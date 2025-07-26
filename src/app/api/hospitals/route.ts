import { NextRequest, NextResponse } from "next/server";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import { getHospitalsWithPagination } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const result = await getHospitalsWithPagination(page, limit);

    return NextResponse.json(
      createApiResponse("success", "병원 목록 조회 성공", {
        hospitals: result,
        totalCount: result.length,
      })
    );
  } catch (error) {
    console.error("Hospitals list error:", error);
    return NextResponse.json(
      createErrorResponse("병원 목록 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}
