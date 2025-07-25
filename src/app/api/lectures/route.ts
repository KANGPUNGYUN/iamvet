import { getLecturesWithPagination } from "@/lib/database";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params = {
      keyword: searchParams.get("keyword") || undefined,
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "20"),
      sort: searchParams.get("sort") || "latest",
      medicalField: searchParams.get("medicalField") || undefined,
      animal: searchParams.get("animal") || undefined,
      difficulty: searchParams.get("difficulty") || undefined,
    };

    const lectures = await getLecturesWithPagination(params);

    return NextResponse.json(
      createApiResponse("success", "강의영상 목록 조회 성공", { lectures })
    );
  } catch (error) {
    console.error("Lectures list error:", error);
    return NextResponse.json(
      createErrorResponse("강의영상 목록 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}
