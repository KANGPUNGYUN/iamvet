// src/app/api/login/hospital/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { HospitalLoginRequest } from "@/lib/types";
import { getUserByEmail, updateLastLogin } from "@/lib/database";
import { createErrorResponse } from "@/lib/utils";
import { comparePassword } from "@/lib/auth";
import { createApiResponse, generateTokens } from "@/lib/auth-helpers";

export async function POST(request: NextRequest) {
  try {
    const body: HospitalLoginRequest = await request.json();

    // 병원 로그인 로직 (수의사와 유사하지만 userType이 'hospital')
    const user = await getUserByEmail(body.username, "hospital");

    if (!user) {
      return NextResponse.json(
        createErrorResponse("존재하지 않는 병원입니다"),
        { status: 404 }
      );
    }

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

    const tokens = await generateTokens(user);
    await updateLastLogin(user.id);

    return NextResponse.json(
      createApiResponse("success", "로그인 성공", {
        user: {
          id: user.id,
          username: user.username,
          nickname: user.hospitalName,
          email: user.email,
          profileImage: user.logoImage,
          userType: user.userType,
          provider: "normal",
          socialAccounts: [],
        },
        tokens,
        isNewUser: false,
      })
    );
  } catch (error) {
    return NextResponse.json(
      createErrorResponse("로그인 처리 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}
