import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import {
  getVeterinarianProfile,
  updateVeterinarianProfile,
} from "@/lib/database";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";

export const GET = withAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const profile = await getVeterinarianProfile(user.userId);

    return NextResponse.json(
      createApiResponse("success", "프로필 조회 성공", profile)
    );
  } catch (error) {
    return NextResponse.json(
      createErrorResponse("프로필 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
});

export const PUT = withAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    console.log('[API] PUT /api/dashboard/veterinarian/profile - User:', user.userId);
    
    const formData = await request.formData();
    console.log('[API] FormData keys:', Array.from(formData.keys()));

    const profileData: any = {
      nickname: formData.get("nickname") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      birthDate: formData.get("birthDate") as string,
    };

    // 프로필 이미지 업로드
    const profileImageUrl = formData.get("profileImage") as string;
    if (profileImageUrl && profileImageUrl !== "undefined" && profileImageUrl !== "null") {
      console.log('[API] Profile image URL received:', profileImageUrl);
      // URL이 이미 S3 URL인 경우 그대로 사용
      profileData.profileImage = profileImageUrl;
    }

    // 면허증 이미지 업로드  
    const licenseImageUrl = formData.get("licenseImage") as string;
    if (licenseImageUrl && licenseImageUrl !== "undefined" && licenseImageUrl !== "null") {
      console.log('[API] License image URL received:', licenseImageUrl);
      profileData.licenseImage = licenseImageUrl;
    }

    // 비밀번호 변경 처리
    const password = formData.get("password") as string;
    if (password && password.trim() !== "") {
      console.log('[API] Password change requested');
      const passwordHash = await bcrypt.hash(password, 12);
      
      // users 테이블의 비밀번호 업데이트
      await sql`
        UPDATE users 
        SET "passwordHash" = ${passwordHash}, "updatedAt" = NOW()
        WHERE id = ${user.userId}
      `;
    }

    console.log('[API] Profile data to update:', profileData);
    
    // 프로필 업데이트
    await updateVeterinarianProfile(user.userId, profileData);

    console.log('[API] Profile update completed successfully');
    return NextResponse.json(
      createApiResponse("success", "프로필이 성공적으로 수정되었습니다", null)
    );
  } catch (error) {
    console.error('[API] Profile update error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      createErrorResponse(`프로필 수정 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`),
      { status: 500 }
    );
  }
});
