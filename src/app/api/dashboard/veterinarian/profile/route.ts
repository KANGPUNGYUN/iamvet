import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import { getVeterinarianProfile, updateVeterinarianProfile } from "@/lib/database";

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
    const formData = await request.formData();

    const profileData = {
      nickname: formData.get("nickname") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      birthDate: formData.get("birthDate") as string,
    };

    // 프로필 이미지 업로드 (TODO: implement uploadFile function)
    // const profileImage = formData.get("profileImage") as File;
    // if (profileImage && profileImage.size > 0) {
    //   const imageUrl = await uploadFile(profileImage, "profiles");
    //   profileData.profileImage = imageUrl;
    // }

    // 면허증 이미지 업로드 (TODO: implement uploadFile function)
    // const licenseImage = formData.get("licenseImage") as File;
    // if (licenseImage && licenseImage.size > 0) {
    //   const licenseUrl = await uploadFile(licenseImage, "licenses");
    //   profileData.licenseImage = licenseUrl;
    // }

    // 프로필 업데이트
    await updateVeterinarianProfile(user.userId, profileData);

    return NextResponse.json(
      createApiResponse("success", "프로필이 수정되었습니다", null)
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      createErrorResponse("프로필 수정 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
});
