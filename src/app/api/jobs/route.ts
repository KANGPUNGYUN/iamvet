import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import {
  getJobsWithPagination,
  createJobPosting,
  getHospitalByUserId,
  getAdvertisements,
} from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params = {
      keyword: searchParams.get("keyword") || undefined,
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "20"),
      sort: searchParams.get("sort") || "latest",
      workType: searchParams.get("workType") || undefined,
      experience: searchParams.get("experience") || undefined,
      region: searchParams.get("region") || undefined,
    };

    const result = await getJobsWithPagination(params);
    const advertisements = await getAdvertisements("jobs");

    return NextResponse.json(
      createApiResponse("success", "채용공고 목록 조회 성공", {
        jobs: result.jobs,
        totalCount: result.totalCount,
        advertisements,
      })
    );
  } catch (error) {
    console.error("Jobs list error:", error);
    return NextResponse.json(
      createErrorResponse("채용공고 목록 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const jobData = await request.json();

    if (user.userType !== "hospital") {
      return NextResponse.json(
        createErrorResponse("병원만 채용공고를 등록할 수 있습니다"),
        { status: 403 }
      );
    }

    // 병원 ID 조회
    const hospital = await getHospitalByUserId(user.userId);
    if (!hospital) {
      return NextResponse.json(
        createErrorResponse("병원 정보를 찾을 수 없습니다"),
        { status: 404 }
      );
    }

    // 채용공고 생성
    const job = await createJobPosting({
      ...jobData,
      hospitalId: hospital.id,
    });

    return NextResponse.json(
      createApiResponse("success", "채용공고가 등록되었습니다", job)
    );
  } catch (error) {
    console.error("Job create error:", error);
    return NextResponse.json(
      createErrorResponse("채용공고 등록 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
});
