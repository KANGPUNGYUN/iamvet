import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import {
  createApiResponse,
  createErrorResponse,
  generateUserIdentifier,
} from "@/lib/utils";
import {
  getJobById,
  incrementJobViewCount,
  getRelatedJobs,
  getHospitalByUserId,
  updateJobPosting,
  deleteJobPosting,
} from "@/lib/database";
import { verifyToken } from "@/lib/auth";

// src/app/api/jobs/[id]/route.ts - 채용공고 상세
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const jobId = resolvedParams.id;

    // 채용공고 조회
    const job = await getJobById(jobId);
    if (!job) {
      return NextResponse.json(
        createErrorResponse("존재하지 않는 채용공고입니다"),
        { status: 404 }
      );
    }

    // 사용자 정보 확인 (선택적)
    let userId: string | undefined;
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const payload = verifyToken(token);
      if (payload) {
        userId = payload.userId;
      }
    }

    // 조회수 증가 (회원/비회원 모두 처리, 24시간 중복 방지)
    const userIdentifier = generateUserIdentifier(request, userId);
    await incrementJobViewCount(jobId, userIdentifier, userId);

    // 관련 채용공고
    const relatedJobs = await getRelatedJobs(jobId, job.medicalField, 5);

    const jobDetail = {
      ...job,
      relatedJobs,
    };

    return NextResponse.json(
      createApiResponse("success", "채용공고 조회 성공", jobDetail)
    );
  } catch (error) {
    console.error("Job detail error:", error);
    return NextResponse.json(
      createErrorResponse("채용공고 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}

export const PUT = withAuth(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      const user = (request as any).user;
      const resolvedParams = await params;
      const jobId = resolvedParams.id;
      const jobData = await request.json();

      if (user.userType !== "hospital") {
        return NextResponse.json(
          createErrorResponse("병원만 채용공고를 수정할 수 있습니다"),
          { status: 403 }
        );
      }

      // 채용공고 존재 및 권한 확인
      const job = await getJobById(jobId);
      if (!job) {
        return NextResponse.json(
          createErrorResponse("채용공고를 찾을 수 없습니다"),
          { status: 404 }
        );
      }

      // 병원 ID 조회
      const hospital = await getHospitalByUserId(user.userId);
      if (!hospital || job.hospitalId !== hospital.id) {
        return NextResponse.json(
          createErrorResponse("이 채용공고를 수정할 권한이 없습니다"),
          { status: 403 }
        );
      }

      // 채용공고 수정
      const updatedJob = await updateJobPosting(jobId, jobData);

      return NextResponse.json(
        createApiResponse("success", "채용공고가 수정되었습니다", updatedJob)
      );
    } catch (error) {
      console.error("Job update error:", error);
      return NextResponse.json(
        createErrorResponse("채용공고 수정 중 오류가 발생했습니다"),
        { status: 500 }
      );
    }
  }
);

export const DELETE = withAuth(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      const user = (request as any).user;
      const resolvedParams = await params;
      const jobId = resolvedParams.id;

      if (user.userType !== "hospital") {
        return NextResponse.json(
          createErrorResponse("병원만 채용공고를 삭제할 수 있습니다"),
          { status: 403 }
        );
      }

      // 채용공고 존재 및 권한 확인
      const job = await getJobById(jobId);
      if (!job) {
        return NextResponse.json(
          createErrorResponse("채용공고를 찾을 수 없습니다"),
          { status: 404 }
        );
      }

      // 병원 ID 조회
      const hospital = await getHospitalByUserId(user.userId);
      if (!hospital || job.hospitalId !== hospital.id) {
        return NextResponse.json(
          createErrorResponse("이 채용공고를 삭제할 권한이 없습니다"),
          { status: 403 }
        );
      }

      // 채용공고 삭제
      await deleteJobPosting(jobId);

      return NextResponse.json(
        createApiResponse("success", "채용공고가 삭제되었습니다")
      );
    } catch (error) {
      console.error("Job delete error:", error);
      return NextResponse.json(
        createErrorResponse("채용공고 삭제 중 오류가 발생했습니다"),
        { status: 500 }
      );
    }
  }
);
