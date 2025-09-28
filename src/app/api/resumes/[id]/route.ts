import { createApiResponse, createErrorResponse, generateUserIdentifier } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sql } from "@/lib/db";
import { incrementDetailedResumeViewCount } from "@/lib/database";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const veterinarianId = resolvedParams.id;
    // const userIp =
    //   request.headers.get("x-forwarded-for") ||
    //   request.headers.get("x-real-ip") ||
    //   "unknown";

    // 사용자 정보 확인 (선택적) - Bearer token과 쿠키 인증 모두 지원
    let userId: string | undefined;
    
    // Authorization 헤더 확인
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const payload = verifyToken(token);
      if (payload) {
        userId = payload.userId;
      }
    }
    
    // Authorization 헤더가 없으면 쿠키에서 확인 (withAuth 미들웨어와 동일한 방식)
    if (!userId) {
      const authTokenCookie = request.cookies.get("auth-token")?.value;
      console.log("[Resume Detail API] auth-token 쿠키:", authTokenCookie ? "존재함" : "없음");
      
      if (authTokenCookie) {
        console.log("[Resume Detail API] auth-token:", authTokenCookie.substring(0, 20) + "...");
        const payload = verifyToken(authTokenCookie);
        if (payload) {
          userId = payload.userId;
          console.log("[Resume Detail API] 토큰 검증 성공, userId:", userId);
        } else {
          console.log("[Resume Detail API] 토큰 검증 실패");
        }
      }
    }
    
    console.log("[Resume Detail API] 최종 사용자 ID:", userId);

    // detailed_resumes 테이블에서 이력서 조회
    const resumeResult = await sql`
      SELECT 
        dr.id,
        dr."userId",
        dr.name,
        dr.photo,
        dr.introduction,
        dr."selfIntroduction",
        dr.position,
        dr.specialties,
        dr."preferredRegions",
        dr."expectedSalary",
        dr."workTypes",
        dr."startDate",
        dr."preferredWeekdays",
        dr."weekdaysNegotiable",
        dr."workStartTime",
        dr."workEndTime",
        dr."workTimeNegotiable",
        dr.phone,
        dr.email,
        dr."phonePublic",
        dr."emailPublic",
        dr."birthDate",
        dr."viewCount",
        dr."createdAt",
        dr."updatedAt"
      FROM detailed_resumes dr
      WHERE dr.id = ${veterinarianId}
    `;

    // 관련 데이터 조회
    const [experiencesResult, educationsResult, licensesResult, medicalCapabilitiesResult] = await Promise.all([
      sql`
        SELECT 
          id,
          "resumeId",
          "hospitalName",
          "mainTasks",
          "startDate",
          "endDate",
          "sortOrder",
          "createdAt",
          "updatedAt"
        FROM resume_experiences
        WHERE "resumeId" = ${veterinarianId}
        ORDER BY "sortOrder" ASC, "createdAt" DESC
      `,
      sql`
        SELECT 
          id,
          "resumeId",
          degree,
          "graduationStatus",
          "schoolName",
          major,
          gpa,
          "totalGpa",
          "startDate",
          "endDate",
          "sortOrder",
          "createdAt",
          "updatedAt"
        FROM resume_educations
        WHERE "resumeId" = ${veterinarianId}
        ORDER BY "sortOrder" ASC, "createdAt" DESC
      `,
      sql`
        SELECT 
          id,
          "resumeId",
          name,
          issuer,
          "acquiredDate",
          "sortOrder",
          "createdAt",
          "updatedAt"
        FROM resume_licenses
        WHERE "resumeId" = ${veterinarianId}
        ORDER BY "sortOrder" ASC, "createdAt" DESC
      `,
      sql`
        SELECT 
          id,
          "resumeId",
          field,
          proficiency,
          description,
          others,
          "sortOrder",
          "createdAt",
          "updatedAt"
        FROM resume_medical_capabilities
        WHERE "resumeId" = ${veterinarianId}
        ORDER BY "sortOrder" ASC, "createdAt" DESC
      `
    ]);
    
    if (resumeResult.length === 0) {
      return NextResponse.json(
        createErrorResponse("존재하지 않는 이력서입니다"),
        { status: 404 }
      );
    }
    
    const resume = resumeResult[0];

    // 조회수 증가 (회원/비회원 모두 처리, 24시간 중복 방지)
    const userIdentifier = generateUserIdentifier(request, userId);
    await incrementDetailedResumeViewCount(veterinarianId, userIdentifier, userId);

    // 좋아요 여부 확인 (로그인한 경우에만)
    let isLiked = false;
    if (userId && resume.id) {
      console.log(`[Resume Detail API] 좋아요 상태 확인 - userId: ${userId}, resumeId: ${resume.id}`);
      const likeCheck = await (prisma as any).resume_likes.findFirst({
        where: {
          userId: userId,
          resumeId: resume.id
        }
      });
      isLiked = !!likeCheck;
      console.log(`[Resume Detail API] 좋아요 상태 결과: ${isLiked}`);
    }

    const resumeDetail = {
      ...resume,
      isLiked: isLiked,
      experiences: experiencesResult,
      educations: educationsResult,
      licenses: licensesResult,
      medicalCapabilities: medicalCapabilitiesResult,
    };

    return NextResponse.json(
      createApiResponse("success", "인재정보 조회 성공", resumeDetail)
    );
  } catch (error) {
    console.error("Resume detail error:", error);
    return NextResponse.json(
      createErrorResponse("인재정보 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}
