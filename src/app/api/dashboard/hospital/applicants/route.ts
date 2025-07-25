import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { createApiResponse, createErrorResponse } from "@/src/lib/api";
import { getHospitalApplicants, getHospitalByUserId } from "@/lib/database";

export const GET = withAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;

    if (user.userType !== "hospital") {
      return NextResponse.json(
        createErrorResponse("병원만 접근할 수 있습니다"),
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all"; // "pending" | "document_passed" | "document_failed" | "final_passed" | "final_failed" | "all"
    const jobId = searchParams.get("jobId") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const applicants = await getHospitalApplicants(hospital.id, {
      status,
      jobId,
      page,
      limit,
    });

    return NextResponse.json(
      createApiResponse("success", "지원자 목록 조회 성공", applicants)
    );
  } catch (error) {
    console.error("Hospital applicants error:", error);
    return NextResponse.json(
      createErrorResponse("지원자 목록 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
});
