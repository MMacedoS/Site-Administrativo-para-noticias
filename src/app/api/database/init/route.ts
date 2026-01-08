// API Route - Initialize Database
import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase } from "@/infrastructure/database/connection";

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
