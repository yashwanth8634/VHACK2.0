import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Registration from "@/models/Registration";
import { uploadImage } from "@/services/imagekit";

// Simple in-memory rate limiter: max 5 registrations per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW = 60_000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// Cleanup stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    rateLimitMap.forEach((val, key) => {
      if (now > val.resetAt) rateLimitMap.delete(key);
    });
  }, 300_000);
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit check
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    await connectDB();

    // Upload screenshot to ImageKit first (before transaction)
    const formData = await req.formData();

    // Extract fields
    const teamName = formData.get("teamName") as string;
    const domain = formData.get("domain") as string;
    const teamSize = parseInt(formData.get("teamSize") as string, 10);
    const college = formData.get("college") as string;
    const leaderName = formData.get("leaderName") as string;
    const leaderEmail = formData.get("leaderEmail") as string;
    const leaderPhone = formData.get("leaderPhone") as string;
    const leaderYear = formData.get("leaderYear") as string;
    const transactionId = formData.get("transactionId") as string;
    const screenshot = formData.get("screenshot") as File;

    // Validate required fields
    if (
      !teamName ||
      !domain ||
      !teamSize ||
      !college ||
      !leaderName ||
      !leaderEmail ||
      !leaderPhone ||
      !leaderYear ||
      !transactionId ||
      !screenshot
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Parse members from JSON
    const membersRaw = formData.get("members") as string;
    let members = [];
    try {
      members = JSON.parse(membersRaw || "[]");
    } catch {
      members = [];
    }

    // Validate file size (max 5MB)
    if (screenshot.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Screenshot must be under 5MB" },
        { status: 400 }
      );
    }

    // Upload screenshot to ImageKit
    const bytes = await screenshot.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = screenshot.name.split(".").pop() || "png";
    const filename = `${Date.now()}-${teamName.replace(/\s+/g, "_")}.${ext}`;

    const screenshotUrl = await uploadImage(buffer, filename);

    // Atomic check-and-insert using MongoDB transaction
    // This prevents race conditions where two users submit at the same time
    const mongoose = (await import("mongoose")).default;
    const session = await mongoose.startSession();

    try {
      let registration: any;

      await session.withTransaction(async () => {
        // Check registration cap inside the transaction
        const count = await Registration.countDocuments().session(session);
        if (count >= 150) {
          throw new Error("REGISTRATIONS_FULL");
        }

        // Create registration inside the same transaction
        const docs = await Registration.create(
          [
            {
              teamName,
              domain,
              teamSize,
              college,
              leader: {
                name: leaderName,
                email: leaderEmail,
                phone: leaderPhone,
                year: leaderYear,
              },
              members,
              transactionId,
              screenshotUrl,
            },
          ],
          { session }
        );
        registration = docs[0];
      });

      session.endSession();

      return NextResponse.json(
        {
          message: "Registration successful!",
          registrationId: registration._id,
        },
        { status: 201 }
      );
    } catch (txError: any) {
      session.endSession();

      if (txError.message === "REGISTRATIONS_FULL") {
        return NextResponse.json(
          { error: "Registrations are full! We've reached the maximum of 150 teams." },
          { status: 403 }
        );
      }

      throw txError; // re-throw to be caught by outer catch
    }
  } catch (error: any) {
    console.error("Registration error:", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "";
      let msg = "A registration with this information already exists";
      if (field === "teamName") msg = "This team name is already taken";
      else if (field === "leader.email") msg = "This email is already registered";
      else if (field === "transactionId") msg = "This transaction ID is already used";

      return NextResponse.json(
        { error: msg },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
