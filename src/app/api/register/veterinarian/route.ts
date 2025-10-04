// src/app/api/register/veterinarian/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { VeterinarianRegisterRequest } from "@/lib/types";
import { hashPassword } from "@/lib/auth";
import { uploadFile } from "@/lib/s3"; // S3 업로드 함수
import {
  createUser,
  createVeterinarianProfile,
  generateTokens,
  updateLastLogin,
} from "@/lib/database";
import {
  checkUserExists,
  createApiResponse,
  createErrorResponse,
} from "@/lib/auth-helpers";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const loginId = formData.get("loginId") as string;
    const username = formData.get("username") as string; // 기존 호환성 유지
    const password = formData.get("password") as string;
    const realName = formData.get("realName") as string;
    const nickname = formData.get("nickname") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const birthDate = formData.get("birthDate") as string;
    const profileImage = formData.get("profileImage") as File;
    const licenseImage = formData.get("licenseImage") as File;
    const agreements = JSON.parse(formData.get("agreements") as string);

    // loginId 우선, 없으면 username 사용 (기존 호환성)
    const actualLoginId = loginId || username;

    // 필수 필드 검증
    if (!actualLoginId || !realName || !nickname || !phone || !email || !licenseImage) {
      return NextResponse.json(
        createErrorResponse("필수 정보를 모두 입력해주세요"),
        { status: 400 }
      );
    }

    // 중복 확인
    const existingUser = await checkUserExists(email, phone, actualLoginId);
    if (existingUser.exists) {
      if (existingUser.isDeleted) {
        // 탈퇴한 계정이 있는 경우
        return NextResponse.json(
          createErrorResponse("탈퇴한 계정이 발견되었습니다", {
            error: "DELETED_ACCOUNT_EXISTS",
            errorCode: "D001",
            deletedAccountInfo: existingUser.account,
            availableOptions: [
              {
                option: "recover",
                title: "기존 계정 복구",
                description: "즉시 서비스 이용 가능, 모든 데이터 복구",
                endpoint: "/auth/recover-account",
                recommended: true,
              },
              {
                option: "cancel",
                title: "가입 취소",
                description: "가입을 포기하고 메인페이지로 돌아갑니다",
                endpoint: "/",
              },
            ],
          }),
          { status: 409 }
        );
      } else {
        return NextResponse.json(
          createErrorResponse("이미 사용 중인 정보입니다"),
          { status: 409 }
        );
      }
    }

    // 파일 업로드
    let profileImageUrl = "";
    let licenseImageUrl = "";

    if (profileImage) {
      profileImageUrl = await uploadFile(profileImage, "profiles");
    }

    if (licenseImage) {
      licenseImageUrl = await uploadFile(licenseImage, "licenses");
    }

    // 비밀번호 해시화
    const passwordHash = password ? await hashPassword(password) : null;

    // 사용자 생성
    const user = await createUser({
      username: actualLoginId,
      loginId: actualLoginId,
      nickname,
      email,
      realName,
      passwordHash,
      userType: "VETERINARIAN",
      phone,
      profileImage: profileImageUrl,
      termsAgreedAt: agreements.terms ? new Date() : null,
      privacyAgreedAt: agreements.privacy ? new Date() : null,
      marketingAgreedAt: agreements.marketing ? new Date() : null,
    });

    // 수의사 프로필 생성
    await createVeterinarianProfile({
      userId: user.id,
      nickname,
      birthDate: birthDate ? new Date(birthDate) : null,
      licenseImage: licenseImageUrl,
    });

    // 토큰 생성
    const tokens = await generateTokens(user);
    
    // 마지막 로그인 시간 업데이트
    await updateLastLogin(user.id);

    return NextResponse.json(
      createApiResponse("success", "회원가입이 완료되었습니다", {
        user: {
          id: user.id,
          username: user.username,
          nickname,
          email: user.email,
          profileImage: profileImageUrl,
          userType: "VETERINARIAN",
          provider: "normal",
          socialAccounts: [],
        },
        tokens,
        isNewUser: true,
      })
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      createErrorResponse("회원가입 처리 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}
