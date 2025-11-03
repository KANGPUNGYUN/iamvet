import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import { getVeterinarianResumeAction } from "@/actions/resume";

/**
 * 현재 사용자의 이력서 존재 여부 및 최신 정보 확인 API
 * 실시간으로 이력서 상태를 확인하여 지원하기 전 검증에 사용
 */
export const GET = withAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    
    console.log('[Resume Status API] Checking resume status for user:', user.userId);

    // 토큰 추출
    const authHeader = request.headers.get('authorization');
    let token: string | null = null;
    
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }
    
    if (!token) {
      // 쿠키에서 토큰 확인
      const authTokenCookie = request.cookies.get('auth-token')?.value;
      if (authTokenCookie) {
        token = authTokenCookie;
      }
    }
    
    if (!token) {
      return NextResponse.json(
        createErrorResponse("인증 토큰이 필요합니다"),
        { status: 401 }
      );
    }

    // 이력서 존재 여부 실시간 확인
    const resumeResult = await getVeterinarianResumeAction(token);
    
    if (!resumeResult.success) {
      console.error('[Resume Status API] Resume check failed:', resumeResult.error);
      return NextResponse.json(
        createErrorResponse("이력서 정보를 확인할 수 없습니다"),
        { status: 500 }
      );
    }

    const hasResume = !!resumeResult.data;
    const resumeInfo = resumeResult.data ? {
      id: resumeResult.data.id,
      name: resumeResult.data.name,
      updatedAt: resumeResult.data.updatedAt,
      isComplete: !!(
        resumeResult.data.name && 
        resumeResult.data.phone && 
        resumeResult.data.email &&
        resumeResult.data.workTypes && 
        resumeResult.data.workTypes.length > 0
      )
    } : null;

    console.log('[Resume Status API] Resume status:', {
      hasResume,
      resumeInfo
    });

    return NextResponse.json(
      createApiResponse("success", "이력서 상태 확인 완료", {
        hasResume,
        resume: resumeInfo,
        requiresResume: !hasResume,
        message: hasResume 
          ? "이력서가 존재합니다" 
          : "지원하기 전에 이력서를 먼저 작성해주세요"
      })
    );
  } catch (error) {
    console.error('[Resume Status API] Error:', error);
    return NextResponse.json(
      createErrorResponse("이력서 상태 확인 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
});