import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // 토큰에서 사용자 정보 확인
    let userId: string | undefined;
    let userType: string | undefined;
    
    // Authorization 헤더 확인
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const payload = verifyToken(token);
      if (payload) {
        userId = payload.userId;
        userType = payload.userType;
      }
    }
    
    // Authorization 헤더가 없으면 쿠키에서 확인
    if (!userId) {
      const authTokenCookie = request.cookies.get("auth-token")?.value;
      
      if (authTokenCookie) {
        const payload = verifyToken(authTokenCookie);
        if (payload) {
          userId = payload.userId;
          userType = payload.userType;
        }
      }
    }
    
    if (!userId) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    if (userType !== "HOSPITAL") {
      return NextResponse.json(
        { error: "병원 계정만 접근 가능합니다." },
        { status: 403 }
      );
    }

    // 병원이 올린 모든 공고의 지원자 현황을 조회
    const recruitmentStatus = await prisma.$queryRaw`
      SELECT 
        COUNT(CASE WHEN a.status = 'PENDING' THEN 1 END)::int as "newApplicants",
        COUNT(CASE WHEN a.status = 'REVIEWING' THEN 1 END)::int as "interviewScheduled", 
        COUNT(CASE WHEN a.status = 'ACCEPTED' THEN 1 END)::int as "hired"
      FROM applications a
      INNER JOIN jobs j ON a."jobId" = j.id
      WHERE j."hospitalId" = ${userId}
      AND j."deletedAt" IS NULL
    `;

    const result = Array.isArray(recruitmentStatus) ? recruitmentStatus[0] : recruitmentStatus;

    return NextResponse.json({
      newApplicants: result?.newApplicants || 0,
      interviewScheduled: result?.interviewScheduled || 0,
      hired: result?.hired || 0,
    });
  } catch (error) {
    console.error("채용 현황 조회 실패:", error);
    return NextResponse.json(
      { error: "채용 현황을 조회하는데 실패했습니다." },
      { status: 500 }
    );
  }
}