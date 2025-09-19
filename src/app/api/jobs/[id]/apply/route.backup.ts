import { NextRequest, NextResponse } from "next/server";
import {
  createApplication,
  createNotification,
  getApplication,
  getJobById,
  incrementJobApplicantCount,
} from "@/lib/database";
import { withAuth } from "@/lib/middleware";
import { createApiResponse, createErrorResponse } from "@/lib/utils";

// src/app/api/jobs/[id]/apply/route.ts - 채용공고 지원
// Route handler for job applications
export const POST = withAuth(
  async (request: NextRequest, context: any) => {
    const params = await context.params;
    const jobId = params.id;
    const user = (request as any).user;
    
    try {
      console.log('=== Apply route started ===');
      console.log('Job ID:', jobId);
      console.log('User:', { userId: user.userId, userType: user.userType });

      // 수의사만 지원 가능 (대소문자 상관없이 체크)
      const normalizedUserType = user.userType.toLowerCase();
      if (normalizedUserType !== "veterinarian" && normalizedUserType !== "veterinary_student") {
        console.log('User type rejected:', normalizedUserType);
        return NextResponse.json(
          createErrorResponse("수의사만 지원할 수 있습니다"),
          { status: 403 }
        );
      }

      // 채용공고 존재 확인
      console.log('Checking job existence for ID:', jobId);
      const job = await getJobById(jobId);
      console.log('Job found:', !!job, 'isActive:', job?.isActive);
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
      console.log('Checking existing application for:', { jobId, userId: user.userId });
      const existingApplication = await getApplication(jobId, user.userId);
      console.log('Existing application found:', !!existingApplication);
      if (existingApplication) {
        return NextResponse.json(
          createErrorResponse("이미 지원한 채용공고입니다"),
          { status: 409 }
        );
      }

      // 지원서 생성
      console.log('Creating application with data:', {
        jobId,
        veterinarianId: user.userId,
        status: "PENDING"
      });
      const application = await createApplication({
        jobId,
        veterinarianId: user.userId,
        status: "PENDING",
      });
      console.log('Application created:', !!application, 'ID:', application?.id);

      // 지원자 수 증가 (해당 컬럼이 없어서 일단 주석처리)
      // await incrementJobApplicantCount(jobId);

      // 알림 발송 (병원에게)
      await createNotification({
        userId: job.hospitalId,
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
      console.error("Error details:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        jobId: jobId,
        userId: user?.userId,
        userType: user?.userType,
        errorName: error instanceof Error ? error.name : 'Unknown',
        errorCode: (error as any)?.code,
      });
      return NextResponse.json(
        createErrorResponse("지원 처리 중 오류가 발생했습니다"),
        { status: 500 }
      );
    }
  }
);
