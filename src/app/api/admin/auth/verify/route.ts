import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET + "_admin";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("admin-token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "토큰이 없습니다." },
        { status: 401 }
      );
    }

    // 토큰 검증
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET!) as any;

    return NextResponse.json({
      success: true,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      admin: {
        id: decoded.adminId,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
      },
    });
  } catch (error) {
    console.error("Token verification error:", error);
    
    const response = NextResponse.json(
      { success: false, message: "유효하지 않은 토큰입니다." },
      { status: 401 }
    );

    // 유효하지 않은 토큰 쿠키 삭제
    response.cookies.delete("admin-token");
    
    return response;
  }
}