import { NextRequest, NextResponse } from "next/server";
import type {
  VeterinarianLoginRequest,
  BaseResponse,
  LoginResponse,
} from "@/lib/types";
import {
  createApiResponse,
  createErrorResponse,
  validateEmail,
} from "@/lib/types";
import { generateTokens, comparePassword } from "@/lib/auth";
import { getUserByEmail } from "@/lib/database"; // 데이터베이스 함수

export async function POST(request: NextRequest) {
  try {
    const body: VeterinarianLoginRequest = await request.json();

    // 입력값 검증
    if (!body.username || !body.password) {
      return NextResponse.json(
        createErrorResponse("사용자명과 비밀번호를 입력해주세요"),
        { status: 400 }
      );
    }

    if (!validateEmail(body.username)) {
      return NextResponse.json(
        createErrorResponse("올바른 이메일 형식이 아닙니다"),
        { status: 400 }
      );
    }

    // 사용자 조회
    const user = await getUserByEmail(body.username, "veterinarian");
    if (!user) {
      return NextResponse.json(
        createErrorResponse("존재하지 않는 사용자입니다"),
        { status: 404 }
      );
    }

    // 탈퇴한 계정 확인
    if (user.deletedAt) {
      return NextResponse.json(
        createErrorResponse("탈퇴한 계정입니다", {
          error: "DELETED_ACCOUNT_EXISTS",
          errorCode: "D001",
          deletedAccountInfo: {
            userType: user.userType,
            username: user.username,
            email: user.email,
            deletedAt: user.deletedAt,
            canRecover: true,
          },
        }),
        { status: 403 }
      );
    }

    // 비밀번호 확인
    const isValidPassword = await comparePassword(
      body.password,
      user.passwordHash
    );
    if (!isValidPassword) {
      return NextResponse.json(
        createErrorResponse("비밀번호가 올바르지 않습니다"),
        { status: 401 }
      );
    }

    // 토큰 생성
    const tokens = await generateTokens(user);

    // 마지막 로그인 시간 업데이트
    await updateLastLogin(user.id);

    const response: BaseResponse<LoginResponse> = createApiResponse(
      "success",
      "로그인 성공",
      {
        user: {
          id: user.id,
          username: user.username,
          nickname: user.nickname || user.username,
          email: user.email,
          profileImage: user.profileImage,
          userType: user.userType,
          provider: user.provider || "normal",
          socialAccounts: user.socialAccounts || [],
        },
        tokens,
        isNewUser: false,
      }
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      createErrorResponse("로그인 처리 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}
