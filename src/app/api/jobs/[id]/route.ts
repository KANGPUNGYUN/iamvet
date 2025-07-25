import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { createApiResponse, createErrorResponse } from "@/lib/api";
import { 
  getJobById, 
  incrementJobViewCount, 
  getRelatedJobs,
  getHospitalByUserId,
  updateJobPosting,
  deleteJobPosting
} from "@/lib/database";

// src/app/api/jobs/[id]/route.ts - 채용공고 상세
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id;
    const userAgent = request.headers.get("user-agent");
    const userIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip");

    // 채용공고 조회
    const job = await getJobById(jobId);
    if (!job) {
      return NextResponse.json(
        createErrorResponse("존재하지 않는 채용공고입니다"),
        { status: 404 }
      );
    }

    // 조회수 증가 (IP 기반 중복 방지)
    await incrementJobViewCount(jobId, userIp);

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

export const PUT = withAuth(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const user = (request as any).user;
    const jobId = params.id;
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
});

export const DELETE = withAuth(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const user = (request as any).user;
    const jobId = params.id;

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
});
