import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Registration from "@/models/Registration";

export async function GET() {
  try {
    await connectDB();
    const count = await Registration.countDocuments();
    return NextResponse.json({ count, limit: 150 });
  } catch {
    return NextResponse.json({ count: 0, limit: 150 }, { status: 500 });
  }
}
