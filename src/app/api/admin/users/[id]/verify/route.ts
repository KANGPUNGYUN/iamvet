// src/app/api/admin/users/[id]/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import { sql } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
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
    const { action, reason } = body; // action: "approve" | "reject", reason: string

    // 사용자 존재 확인
    const userResult = await sql`
      SELECT u.id, u."userType", u."isActive", u.email,
             v."realName" as vet_name,
             vs."realName" as student_name,
             h."hospitalName"
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
    const userName = user.vet_name || user.student_name || user.hospitalName || user.email;

    if (action === "approve") {
      // 인증 승인
      await sql`
        UPDATE users 
        SET "isActive" = true, "updatedAt" = NOW()
        WHERE id = ${id}
      `;

      // 인증 승인 알림 생성 (선택사항)
      try {
        await sql`
          INSERT INTO notifications (
            id, type, "recipientId", "recipientType", title, content, "createdAt", "updatedAt"
          ) VALUES (
            'notif_' || generate_random_id(),
            'SYSTEM',
            ${id},
            ${user.userType},
            '계정 인증 승인',
            '축하합니다! 회원님의 계정 인증이 승인되었습니다. 이제 모든 서비스를 이용하실 수 있습니다.',
            NOW(),
            NOW()
          )
        `;
      } catch (notifError) {
        console.log("알림 생성 실패 (무시됨):", notifError);
      }

      return NextResponse.json(
        createApiResponse("success", `${userName}님의 계정 인증이 승인되었습니다`, {
          userId: id,
          action: "approved",
          userType: user.userType
        })
      );

    } else if (action === "reject") {
      // 인증 거부
      await sql`
        UPDATE users 
        SET "isActive" = false, "updatedAt" = NOW()
        WHERE id = ${id}
      `;

      // 인증 거부 알림 생성 (선택사항)
      try {
        const rejectMessage = reason 
          ? `계정 인증이 거부되었습니다. 사유: ${reason}` 
          : "계정 인증이 거부되었습니다. 관리자에게 문의해주세요.";

        await sql`
          INSERT INTO notifications (
            id, type, "recipientId", "recipientType", title, content, "createdAt", "updatedAt"
          ) VALUES (
            'notif_' || generate_random_id(),
            'SYSTEM',
            ${id},
            ${user.userType},
            '계정 인증 거부',
            ${rejectMessage},
            NOW(),
            NOW()
          )
        `;
      } catch (notifError) {
        console.log("알림 생성 실패 (무시됨):", notifError);
      }

      return NextResponse.json(
        createApiResponse("success", `${userName}님의 계정 인증이 거부되었습니다`, {
          userId: id,
          action: "rejected",
          reason: reason || null,
          userType: user.userType
        })
      );

    } else {
      return NextResponse.json(
        createErrorResponse("유효하지 않은 액션입니다"),
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("Admin user verification error:", error);
    return NextResponse.json(
      createErrorResponse("계정 인증 처리 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
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

    // 사용자 인증 관련 정보 조회
    const userResult = await sql`
      SELECT 
        u.id,
        u.email,
        u."userType",
        u."isActive",
        u."createdAt",
        -- 수의사 정보
        v."realName" as vet_real_name,
        v."licenseImage" as vet_license_image,
        v."birthDate" as vet_birth_date,
        -- 수의학과 학생 정보
        vs."realName" as student_real_name,
        vs."universityEmail" as student_university_email,
        vs."birthDate" as student_birth_date,
        -- 병원 정보
        h."hospitalName",
        h."representativeName",
        h."businessNumber",
        h."businessLicenseFile",
        h."establishedDate"
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

    // 인증 정보 구성
    const verificationData: any = {
      userId: user.id,
      email: user.email,
      userType: user.userType,
      isActive: user.isActive,
      status: user.isActive ? "VERIFIED" : "PENDING",
      joinDate: user.createdAt?.toISOString().split('T')[0] || null,
    };

    if (user.userType === "VETERINARIAN") {
      verificationData.name = user.vet_real_name;
      verificationData.birthDate = user.vet_birth_date;
      verificationData.licenseImage = user.vet_license_image;
      verificationData.verificationDocuments = {
        type: "수의사 면허증",
        hasDocument: !!user.vet_license_image,
        documentUrl: user.vet_license_image,
      };

    } else if (user.userType === "VETERINARY_STUDENT") {
      verificationData.name = user.student_real_name;
      verificationData.birthDate = user.student_birth_date;
      verificationData.universityEmail = user.student_university_email;
      verificationData.verificationDocuments = {
        type: "학생증 또는 재학증명서",
        hasDocument: !!user.student_university_email,
        universityEmail: user.student_university_email,
      };

    } else if (user.userType === "HOSPITAL") {
      verificationData.name = user.hospitalName;
      verificationData.representativeName = user.representativeName;
      verificationData.businessNumber = user.businessNumber;
      verificationData.establishedDate = user.establishedDate;
      verificationData.verificationDocuments = {
        type: "사업자등록증",
        hasDocument: !!user.businessLicenseFile,
        documentUrl: user.businessLicenseFile,
        businessNumber: user.businessNumber,
      };
    }

    return NextResponse.json(
      createApiResponse("success", "인증 정보 조회 성공", { verification: verificationData })
    );

  } catch (error) {
    console.error("Admin user verification info error:", error);
    return NextResponse.json(
      createErrorResponse("인증 정보 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}