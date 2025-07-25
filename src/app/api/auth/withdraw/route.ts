import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { createApiResponse, createErrorResponse } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json(
        createErrorResponse("인증이 필요합니다"),
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        createErrorResponse("유효하지 않은 토큰입니다"),
        { status: 401 }
      );
    }

    const { reason } = await request.json();

    // Soft delete: 계정을 삭제하지 않고 deleted_at 필드만 설정
    const deletedUser = await softDeleteUser(decoded.userId, reason);

    // 관련 데이터도 soft delete 처리
    await softDeleteUserData(decoded.userId);

    return NextResponse.json(
      createApiResponse("success", "회원 탈퇴가 완료되었습니다", {
        deletedAt: deletedUser.deletedAt,
        message: "계정은 3개월간 보관되며, 같은 휴대폰번호로 재가입 시 복구할 수 있습니다"
      })
    );

  } catch (error) {
    console.error("Withdraw error:", error);
    return NextResponse.json(
      createErrorResponse("탈퇴 처리 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}

async function softDeleteUser(userId: string, reason?: string) {
  // 실제 구현에서는 데이터베이스 연결 사용
  const deletedAt = new Date();
  
  // 사용자 테이블에 deleted_at, withdraw_reason 업데이트
  // await db.users.update({
  //   where: { id: userId },
  //   data: { 
  //     deletedAt,
  //     withdrawReason: reason,
  //     isActive: false
  //   }
  // });

  return { deletedAt };
}

async function softDeleteUserData(userId: string) {
  // 관련 데이터들도 soft delete 처리
  // - 이력서
  // - 채용공고
  // - 북마크
  // - 댓글 등
  
  // await db.resumes.updateMany({
  //   where: { userId },
  //   data: { deletedAt: new Date() }
  // });
  
  // await db.jobs.updateMany({
  //   where: { userId },
  //   data: { deletedAt: new Date() }
  // });
}