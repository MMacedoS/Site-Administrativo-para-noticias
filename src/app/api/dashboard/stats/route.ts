// API Route - Dashboard Stats
import { NextRequest } from "next/server";
import { GetDashboardStats } from "@/application/use-cases/GetDashboardStats";
import {
  successResponse,
  errorResponse,
} from "@/infrastructure/http/helpers/response";

export async function GET(request: NextRequest) {
  try {
    const getDashboardStats = new GetDashboardStats();
    const stats = getDashboardStats.execute();

    return successResponse(stats);
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    return errorResponse(error.message, 500);
  }
}
