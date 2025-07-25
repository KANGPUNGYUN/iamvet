import { NextRequest, NextResponse } from "next/server";
import { createApiResponse, createErrorResponse } from "@/lib/api";
import { getHospitalsWithPagination } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params = {
      keyword: searchParams.get("keyword") || undefined,
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "20"),
      sort: searchParams.get("sort") || "latest",
      region: searchParams.get("region") || undefined,
      medicalField: searchParams.get("medicalField") || undefined,
      treatableAnimal: searchParams.get("treatableAnimal") || undefined,
    };

    const result = await getHospitalsWithPagination(params);

    return NextResponse.json(
      createApiResponse("success", "병원 목록 조회 성공", {
        hospitals: result.hospitals,
        totalCount: result.totalCount,
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