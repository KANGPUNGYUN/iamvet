import { hashPassword } from "@/lib/auth";
import { checkUserExists, createUser } from "@/lib/auth-helpers";
import {
  checkBusinessNumberExists,
  createHospitalProfile,
} from "@/lib/database";
import { uploadFile } from "@/lib/upload";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

// src/app/api/register/hospital/route.ts
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const hospitalName = formData.get("hospitalName") as string;
    const businessNumber = formData.get("businessNumber") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const address = formData.get("address") as string;
    const treatableAnimals = JSON.parse(
      formData.get("treatableAnimals") as string
    );
    const medicalFields = JSON.parse(formData.get("medicalFields") as string);
    const logoImage = formData.get("logoImage") as File;
    const businessRegistration = formData.get("businessRegistration") as File;
    const agreements = JSON.parse(formData.get("agreements") as string);

    // 필수 필드 검증
    if (
      !username ||
      !password ||
      !hospitalName ||
      !businessNumber ||
      !phone ||
      !email ||
      !address
    ) {
      return NextResponse.json(
        createErrorResponse("필수 정보를 모두 입력해주세요"),
        { status: 400 }
      );
    }

    // 중복 확인
    const existingUser = await checkUserExists(email, phone, username);
    const existingBusiness = await checkBusinessNumberExists(businessNumber);

    if (existingUser.exists || existingBusiness) {
      return NextResponse.json(
        createErrorResponse("이미 사용 중인 정보입니다"),
        { status: 409 }
      );
    }

    // 파일 업로드
    let logoImageUrl = "";
    let businessRegistrationUrl = "";

    if (logoImage) {
      logoImageUrl = await uploadFile(logoImage, "logos");
    }

    if (businessRegistration) {
      businessRegistrationUrl = await uploadFile(
        businessRegistration,
        "documents"
      );
    }

    // 시설 이미지 업로드
    const facilityImages: string[] = [];
    const facilityImageFiles = formData.getAll("facilityImages") as File[];
    for (const file of facilityImageFiles) {
      if (file.size > 0) {
        const url = await uploadFile(file, "facilities");
        facilityImages.push(url);
      }
    }

    // 비밀번호 해시화
    const passwordHash = await hashPassword(password);

    // 사용자 생성
    const user = await createUser({
      username,
      email,
      passwordHash,
      userType: "hospital",
      phone,
      profileImage: logoImageUrl,
      termsAgreedAt: agreements.terms ? new Date() : null,
      privacyAgreedAt: agreements.privacy ? new Date() : null,
      marketingAgreedAt: agreements.marketing ? new Date() : null,
    });

    // 병원 프로필 생성
    await createHospitalProfile({
      userId: user.id,
      hospitalName,
      businessNumber,
      address,
      detailAddress: formData.get("detailAddress") as string,
      website: formData.get("website") as string,
      logoImage: logoImageUrl,
      facilityImages,
      treatableAnimals,
      medicalFields,
      businessRegistration: businessRegistrationUrl,
      foundedDate: formData.get("foundedDate")
        ? new Date(formData.get("foundedDate") as string)
        : null,
    });

    // 토큰 생성
    const tokens = await generateTokens(user);

    return NextResponse.json(
      createApiResponse("success", "병원 등록이 완료되었습니다", {
        user: {
          id: user.id,
          username: user.username,
          nickname: hospitalName,
          email: user.email,
          profileImage: logoImageUrl,
          userType: "hospital",
          provider: "normal",
          socialAccounts: [],
        },
        tokens,
        isNewUser: true,
      })
    );
  } catch (error) {
    console.error("Hospital register error:", error);
    return NextResponse.json(
      createErrorResponse("병원 등록 처리 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}
