import { NextRequest, NextResponse } from "next/server";
import type {
  VeterinarianLoginRequest,
  ApiResponse,
  LoginResponse,
} from "@/lib/types";
import {
  createApiResponse,
  createErrorResponse,
  validateEmail,
} from "@/lib/types";
import { comparePassword } from "@/lib/auth";
import { generateTokens } from "@/lib/database";
import { getUserByEmailOrLoginId, updateLastLogin } from "@/lib/database"; // 데이터베이스 함수

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

    // 이메일 형식 검증 제거 - 로그인 ID도 허용
    // 사용자 조회 (이메일 또는 로그인 ID)
    const user = await getUserByEmailOrLoginId(body.username, "veterinarian");
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
    const tokens = await generateTokens({
      id: user.id,
      email: user.email,
      userType: user.userType
    });

    // 마지막 로그인 시간 업데이트
    await updateLastLogin(user.id);

    const response = createApiResponse(
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
    console.error("Veterinarian login error:", error);
    console.error("Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack"
    });
    return NextResponse.json(
      createErrorResponse("로그인 처리 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}
