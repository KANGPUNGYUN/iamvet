// src/app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import { sql } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // 관리자 권한 확인
    const authResult = verifyAdminToken(request);
    if (!authResult.success) {
      return NextResponse.json(
        createErrorResponse(authResult.error || "권한이 없습니다"),
        { status: 401 }
      );
    }

    const { id } = await params;

    // 사용자 기본 정보 조회
    const userResult = await sql`
      SELECT 
        u.id,
        u.email,
        u.phone,
        u."userType",
        u."isActive",
        u."createdAt",
        u."lastLoginAt",
        u."profileImage",
        u."loginId",
        -- 수의사 정보
        v."realName" as vet_real_name,
        v.nickname as vet_nickname,
        v."licenseImage" as vet_license_image,
        v."birthDate" as vet_birth_date,
        v."createdAt" as vet_created_at,
        -- 수의학과 학생 정보
        vs."realName" as student_real_name,
        vs.nickname as student_nickname,
        vs."universityEmail" as student_university_email,
        vs."birthDate" as student_birth_date,
        vs."createdAt" as student_created_at,
        -- 병원 정보
        h."hospitalName",
        h."representativeName",
        h."businessNumber",
        h."businessLicenseFile",
        h."establishedDate",
        h."hospitalAddress",
        h."hospitalAddressDetail",
        h."postalCode",
        h.latitude,
        h.longitude,
        h."hospitalLogo",
        h."hospitalWebsite",
        h."hospitalDescription",
        h."createdAt" as hospital_created_at
      FROM users u
      LEFT JOIN veterinarians v ON u.id = v."userId"
      LEFT JOIN veterinary_students vs ON u.id = vs."userId"
      LEFT JOIN hospitals h ON u.id = h."userId"
      WHERE u.id = ${id} AND u."deletedAt" IS NULL
    `;
    
    if (userResult.length === 0) {
      return NextResponse.json(
        createErrorResponse("사용자를 찾을 수 없습니다"),
        { status: 404 }
      );
    }

    const user = userResult[0];

    // 기본 사용자 정보
    const userData: any = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      userType: user.userType,
      isActive: user.isActive,
      status: user.isActive ? "ACTIVE" : "INACTIVE",
      joinDate: user.createdAt?.toISOString().split('T')[0] || null,
      lastLogin: user.lastLoginAt?.toISOString().split('T')[0] || null,
      profileImage: user.profileImage,
      loginId: user.loginId,
      verified: true, // 기본값
    };

    // 사용자 유형별 상세 정보 추가
    if (user.userType === "VETERINARIAN") {
      userData.name = user.vet_real_name || "미입력";
      userData.realName = user.vet_real_name;
      userData.nickname = user.vet_nickname;
      userData.birthDate = user.vet_birth_date;
      userData.profileCreatedAt = user.vet_created_at;
      
      if (user.vet_license_image) {
        userData.veterinarianLicense = {
          licenseImage: user.vet_license_image,
          licenseNumber: "VET-" + user.id.substring(0, 8),
          issueDate: "2020-01-01", // 실제 구현시 면허증 정보 테이블에서 가져와야 함
          expiryDate: "2030-01-01",
        };
      }

    } else if (user.userType === "VETERINARY_STUDENT") {
      userData.name = user.student_real_name || "미입력";
      userData.realName = user.student_real_name;
      userData.nickname = user.student_nickname;
      userData.birthDate = user.student_birth_date;
      userData.universityEmail = user.student_university_email;
      userData.profileCreatedAt = user.student_created_at;

    } else if (user.userType === "HOSPITAL") {
      userData.name = user.hospitalName || "미입력";
      userData.hospitalName = user.hospitalName;
      userData.representativeName = user.representativeName;
      userData.address = user.hospitalAddress;
      userData.addressDetail = user.hospitalAddressDetail;
      userData.postalCode = user.postalCode;
      userData.latitude = user.latitude;
      userData.longitude = user.longitude;
      userData.hospitalLogo = user.hospitalLogo;
      userData.hospitalWebsite = user.hospitalWebsite;
      userData.hospitalDescription = user.hospitalDescription;
      userData.profileCreatedAt = user.hospital_created_at;
      
      userData.hospitalInfo = {
        businessNumber: user.businessNumber,
        businessRegistration: user.businessLicenseFile,
        representativeName: user.representativeName,
        establishedDate: user.establishedDate?.toISOString().split('T')[0] || null,
      };

      // 병원 추가 정보 조회 (진료 동물, 전문분야, 이미지)
      try {
        // 진료 동물
        const animalsResult = await sql`
          SELECT "animalType" 
          FROM hospital_treatment_animals 
          WHERE "userId" = ${id}
        `;
        userData.treatmentAnimals = animalsResult.map((a: any) => a.animalType);

        // 전문분야
        const specialtiesResult = await sql`
          SELECT specialty 
          FROM hospital_treatment_specialties 
          WHERE "userId" = ${id}
        `;
        userData.specialties = specialtiesResult.map((s: any) => s.specialty);

        // 병원 이미지
        const imagesResult = await sql`
          SELECT "imageUrl", "imageOrder", "imageDescription"
          FROM hospital_images 
          WHERE "userId" = ${id}
          ORDER BY "imageOrder"
        `;
        userData.hospitalImages = imagesResult.map((img: any) => ({
          url: img.imageUrl,
          order: img.imageOrder,
          description: img.imageDescription,
        }));

      } catch (error) {
        console.error("Error fetching hospital additional info:", error);
        userData.treatmentAnimals = [];
        userData.specialties = [];
        userData.hospitalImages = [];
      }
    }

    return NextResponse.json(
      createApiResponse("success", "사용자 상세 정보 조회 성공", { user: userData })
    );

  } catch (error) {
    console.error("Admin user detail error:", error);
    return NextResponse.json(
      createErrorResponse("사용자 상세 정보 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // 관리자 권한 확인
    const authResult = verifyAdminToken(request);
    if (!authResult.success) {
      return NextResponse.json(
        createErrorResponse(authResult.error || "권한이 없습니다"),
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { action, ...updateData } = body;

    // 사용자 존재 확인
    const userCheck = await sql`
      SELECT id, "userType", "isActive" 
      FROM users 
      WHERE id = ${id} AND "deletedAt" IS NULL
    `;

    if (userCheck.length === 0) {
      return NextResponse.json(
        createErrorResponse("사용자를 찾을 수 없습니다"),
        { status: 404 }
      );
    }

    const user = userCheck[0];

    if (action === "verify") {
      // 계정 인증 승인
      await sql`
        UPDATE users 
        SET "isActive" = true, "updatedAt" = NOW()
        WHERE id = ${id}
      `;

      return NextResponse.json(
        createApiResponse("success", "계정 인증이 승인되었습니다")
      );

    } else if (action === "reject") {
      // 계정 인증 거부 (비활성화)
      await sql`
        UPDATE users 
        SET "isActive" = false, "updatedAt" = NOW()
        WHERE id = ${id}
      `;

      return NextResponse.json(
        createApiResponse("success", "계정 인증이 거부되었습니다")
      );

    } else if (action === "suspend") {
      // 계정 정지/활성화 토글
      const newStatus = !user.isActive;
      await sql`
        UPDATE users 
        SET "isActive" = ${newStatus}, "updatedAt" = NOW()
        WHERE id = ${id}
      `;

      return NextResponse.json(
        createApiResponse("success", `계정이 ${newStatus ? "활성화" : "정지"}되었습니다`)
      );

    } else if (action === "delete") {
      // 계정 비활성화 (soft delete)
      await sql`
        UPDATE users 
        SET "isActive" = false, "deletedAt" = NOW(), "updatedAt" = NOW()
        WHERE id = ${id}
      `;

      return NextResponse.json(
        createApiResponse("success", "계정이 비활성화되었습니다")
      );

    } else {
      // 일반 정보 업데이트
      if (updateData.phone !== undefined) {
        await sql`
          UPDATE users 
          SET phone = ${updateData.phone}, "updatedAt" = NOW()
          WHERE id = ${id}
        `;
      }

      return NextResponse.json(
        createApiResponse("success", "사용자 정보가 업데이트되었습니다")
      );
    }

  } catch (error) {
    console.error("Admin user update error:", error);
    return NextResponse.json(
      createErrorResponse("사용자 정보 업데이트 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}