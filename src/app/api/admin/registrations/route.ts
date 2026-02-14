import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Registration from "@/models/Registration";

export async function GET(req: NextRequest) {
  try {
    // Check admin password
    const password = req.headers.get("x-admin-password");
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const domain = searchParams.get("domain");

    const filter: Record<string, string> = {};
    if (domain) filter.domain = domain;

    const registrations = await Registration.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ registrations, count: registrations.length });
  } catch (error) {
    console.error("Admin fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const password = req.headers.get("x-admin-password");
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Registration ID is required" },
        { status: 400 }
      );
    }

    const deleted = await Registration.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Registration deleted" });
  } catch (error) {
    console.error("Admin delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete registration" },
      { status: 500 }
    );
  }
}
