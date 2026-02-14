import { NextRequest, NextResponse } from "next/server";
import {connectDB}from "@/lib/db";
import Registration from "@/models/Registration";

export async function POST(req: NextRequest) {
  try {
    const { transactionId } = await req.json();

    if (!transactionId || typeof transactionId !== "string") {
      return NextResponse.json(
        { valid: false, message: "Transaction ID is required" },
        { status: 400 }
      );
    }

    const trimmed = transactionId.trim();

    // Format check — UPI UTR IDs are typically 12-digit numbers
    if (!/^\d{12,}$/.test(trimmed)) {
      return NextResponse.json(
        { valid: false, message: "Invalid format. Enter the 12+ digit numeric UTR/Transaction ID." },
        { status: 200 }
      );
    }

    await connectDB();

    // Check if this transaction ID is already used
    const existing = await Registration.findOne(
      { transactionId: trimmed },
      { _id: 1 }
    ).lean();

    if (existing) {
      return NextResponse.json(
        { valid: false, message: "This Transaction ID has already been used by another team." },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { valid: true, message: "Transaction ID is valid" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { valid: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
