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
        { error: "토큰이 유효하지 않거나 만료되었습니다. 다시 로그인해주세요." },
        { status: 401 }
      );
    }

    if (!userType || !["VETERINARIAN", "VETERINARY_STUDENT", "veterinarian", "veterinary_student"].includes(userType)) {
      return NextResponse.json(
        { error: "수의사 또는 수의학과 학생 계정만 접근 가능합니다." },
        { status: 403 }
      );
    }

    // 수의사가 지원한 모든 공고의 상태별 통계를 조회
    const applicationStatus = await prisma.$queryRaw`
      SELECT 
        COUNT(CASE WHEN a.status = 'PENDING' THEN 1 END)::int as "applying",
        COUNT(CASE WHEN a.status = 'REVIEWING' THEN 1 END)::int as "documentPassed", 
        COUNT(CASE WHEN a.status = 'ACCEPTED' THEN 1 END)::int as "finalPassed",
        COUNT(CASE WHEN a.status = 'REJECTED' THEN 1 END)::int as "rejected"
      FROM applications a
      INNER JOIN jobs j ON a."jobId" = j.id
      WHERE a."veterinarianId" = ${userId}
      AND j."deletedAt" IS NULL
    `;

    const result = Array.isArray(applicationStatus) ? applicationStatus[0] : applicationStatus;

    return NextResponse.json({
      applying: result?.applying || 0,
      documentPassed: result?.documentPassed || 0,
      finalPassed: result?.finalPassed || 0,
      rejected: result?.rejected || 0,
    });
  } catch (error) {
    console.error("지원 현황 조회 실패:", error);
    return NextResponse.json(
      { error: "지원 현황을 조회하는데 실패했습니다." },
      { status: 500 }
    );
  }
}