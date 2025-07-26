import {
  createApplication,
  createNotification,
  getApplication,
  getJobById,
  incrementJobApplicantCount,
} from "@/lib/database";
import { withAuth } from "@/lib/middleware";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

// src/app/api/jobs/[id]/apply/route.ts - 채용공고 지원
export const POST = withAuth(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      const resolvedParams = await params;
      const jobId = resolvedParams.id;
      const user = (request as any).user;

      // 수의사만 지원 가능
      if (user.userType !== "veterinarian") {
        return NextResponse.json(
          createErrorResponse("수의사만 지원할 수 있습니다"),
          { status: 403 }
        );
      }

      // 채용공고 존재 확인
      const job = await getJobById(jobId);
      if (!job || !job.isActive) {
        return NextResponse.json(
          createErrorResponse("존재하지 않거나 비활성화된 채용공고입니다"),
          { status: 404 }
        );
      }

      // 마감일 확인
      if (job.deadline && new Date(job.deadline) < new Date()) {
        return NextResponse.json(createErrorResponse("마감된 채용공고입니다"), {
          status: 400,
        });
      }

      // 중복 지원 확인
      const existingApplication = await getApplication(jobId, user.userId);
      if (existingApplication) {
        return NextResponse.json(
          createErrorResponse("이미 지원한 채용공고입니다"),
          { status: 409 }
        );
      }

      // 지원서 생성
      const application = await createApplication({
        jobId,
        veterinarianId: user.userId,
        status: "document_pending",
      });

      // 지원자 수 증가
      await incrementJobApplicantCount(jobId);

      // 알림 발송 (병원에게)
      await createNotification({
        userId: job.hospital.userId,
        type: "application_status",
        title: "새로운 지원자가 있습니다",
        description: `${job.title} 공고에 새로운 지원자가 지원했습니다`,
        applicationId: application.id,
        url: `/dashboard/hospital/applicants/${application.id}`,
      });

      return NextResponse.json(
        createApiResponse("success", "지원이 완료되었습니다", {
          applicationId: application.id,
          status: application.status,
        })
      );
    } catch (error) {
      console.error("Job apply error:", error);
      return NextResponse.json(
        createErrorResponse("지원 처리 중 오류가 발생했습니다"),
        { status: 500 }
      );
    }
  }
);
