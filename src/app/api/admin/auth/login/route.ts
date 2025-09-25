import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/auth";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || JWT_SECRET + "_admin";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "이메일과 비밀번호를 입력해주세요." },
        { status: 400 }
      );
    }

    // 관리자 계정 조회
    const admin = await prisma.admin_users.findUnique({
      where: { 
        email: email.toLowerCase(),
      },
    });

    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { success: false, message: "존재하지 않는 관리자 계정입니다." },
        { status: 401 }
      );
    }

    // 비밀번호 확인
    const isValidPassword = await comparePassword(password, admin.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: "비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      {
        adminId: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      ADMIN_JWT_SECRET,
      { expiresIn: "8h" }
    );

    // 마지막 로그인 시간 업데이트
    await prisma.admin_users.update({
      where: { id: admin.id },
      data: { 
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // 응답 생성 (쿠키 설정)
    const response = NextResponse.json({
      success: true,
      message: "로그인되었습니다.",
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    // HttpOnly 쿠키로 토큰 설정 (보안)
    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 8 * 60 * 60, // 8시간
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, message: "로그인 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}