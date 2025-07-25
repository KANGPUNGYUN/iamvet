// src/app/api/resumes/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { ResumesQueryParams } from "@/lib/types";
import { getResumesWithPagination } from "@/lib/database";
import { createApiResponse, createErrorResponse } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params: ResumesQueryParams = {
      keyword: searchParams.get("keyword") || undefined,
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "20"),
      sort: (searchParams.get("sort") as any) || "latest",
      workType: searchParams.get("workType") || undefined,
      experience: searchParams.get("experience") || undefined,
      region: searchParams.get("region") || undefined,
      license: searchParams.get("license") || undefined,
    };

    const resumes = await getResumesWithPagination(params);

    return NextResponse.json(
      createApiResponse("success", "인재정보 목록 조회 성공", { resumes })
    );
  } catch (error) {
    console.error("Resumes list error:", error);
    return NextResponse.json(
      createErrorResponse("인재정보 목록 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}
