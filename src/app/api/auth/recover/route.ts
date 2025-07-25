import { NextRequest, NextResponse } from "next/server";
import { createApiResponse, createErrorResponse } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const { phone, password } = await request.json();

    if (!phone) {
      return NextResponse.json(
        createErrorResponse("휴대폰번호가 필요합니다"),
        { status: 400 }
      );
    }

    // 탈퇴한 계정 조회 (3개월 이내)
    const deletedAccount = await findDeletedAccount(phone);
    
    if (!deletedAccount) {
      return NextResponse.json(
        createErrorResponse("복구 가능한 계정이 없습니다"),
        { status: 404 }
      );
    }

    // 3개월 경과 여부 확인
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    if (deletedAccount.deletedAt < threeMonthsAgo) {
      return NextResponse.json(
        createErrorResponse("계정 보관 기간이 만료되어 복구할 수 없습니다"),
        { status: 410 }
      );
    }

    // 비밀번호 검증 (소셜 로그인 계정이 아닌 경우)
    if (deletedAccount.provider === 'normal' && password) {
      const isPasswordValid = await verifyPassword(password, deletedAccount.passwordHash);
      if (!isPasswordValid) {
        return NextResponse.json(
          createErrorResponse("비밀번호가 일치하지 않습니다"),
          { status: 401 }
        );
      }
    }

    // 계정 복구 (soft delete 해제)
    const restoredUser = await restoreAccount(deletedAccount.id);

    // 관련 데이터도 복구
    await restoreUserData(deletedAccount.id);

    // 토큰 생성
    const tokens = await generateTokens(restoredUser);

    return NextResponse.json(
      createApiResponse("success", "계정이 성공적으로 복구되었습니다", {
        user: {
          id: restoredUser.id,
          username: restoredUser.username,
          email: restoredUser.email,
          userType: restoredUser.userType,
          provider: restoredUser.provider,
        },
        tokens,
        restoredAt: new Date()
      })
    );

  } catch (error) {
    console.error("Account recovery error:", error);
    return NextResponse.json(
      createErrorResponse("계정 복구 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json(
        createErrorResponse("휴대폰번호가 필요합니다"),
        { status: 400 }
      );
    }

    // 복구 가능한 계정 정보 조회
    const deletedAccount = await findDeletedAccount(phone);
    
    if (!deletedAccount) {
      return NextResponse.json(
        createApiResponse("success", "복구 가능한 계정이 없습니다", {
          hasRecoverableAccount: false
        })
      );
    }

    // 3개월 경과 여부 확인
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    const isExpired = deletedAccount.deletedAt < threeMonthsAgo;

    return NextResponse.json(
      createApiResponse("success", "계정 정보 조회 완료", {
        hasRecoverableAccount: !isExpired,
        accountInfo: isExpired ? null : {
          email: maskEmail(deletedAccount.email),
          userType: deletedAccount.userType,
          provider: deletedAccount.provider,
          deletedAt: deletedAccount.deletedAt,
          daysUntilExpiry: Math.ceil((deletedAccount.deletedAt.getTime() + (90 * 24 * 60 * 60 * 1000) - Date.now()) / (24 * 60 * 60 * 1000))
        }
      })
    );

  } catch (error) {
    console.error("Account check error:", error);
    return NextResponse.json(
      createErrorResponse("계정 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}

async function findDeletedAccount(phone: string) {
  // 실제 구현에서는 데이터베이스 연결 사용
  // return await db.users.findFirst({
  //   where: {
  //     phone,
  //     deletedAt: { not: null },
  //     isActive: false
  //   }
  // });
  return null;
}

async function restoreAccount(userId: string) {
  // 계정 복구 (deleted_at을 null로 설정, isActive를 true로 설정)
  // return await db.users.update({
  //   where: { id: userId },
  //   data: {
  //     deletedAt: null,
  //     withdrawReason: null,
  //     isActive: true,
  //     restoredAt: new Date()
  //   }
  // });
  return {};
}

async function restoreUserData(userId: string) {
  // 관련 데이터들도 복구
  // await db.resumes.updateMany({
  //   where: { userId, deletedAt: { not: null } },
  //   data: { deletedAt: null }
  // });
  
  // await db.jobs.updateMany({
  //   where: { userId, deletedAt: { not: null } },
  //   data: { deletedAt: null }
  // });
}

function maskEmail(email: string): string {
  const [username, domain] = email.split('@');
  const maskedUsername = username.length > 2 
    ? username.slice(0, 2) + '*'.repeat(username.length - 2)
    : username;
  return `${maskedUsername}@${domain}`;
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // 실제 구현에서는 bcrypt 등을 사용
  return true;
}

async function generateTokens(user: any) {
  // JWT 토큰 생성
  return {
    accessToken: "sample_access_token",
    refreshToken: "sample_refresh_token"
  };
}