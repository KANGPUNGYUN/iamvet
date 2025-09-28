// src/app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import { sql } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // 관리자 권한 확인
    const authResult = verifyAdminToken(request);
    if (!authResult.success) {
      return NextResponse.json(
        createErrorResponse(authResult.error || "권한이 없습니다"),
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const userType = searchParams.get("userType") || "";
    const status = searchParams.get("status") || "";

    const offset = (page - 1) * limit;

    let users;
    let total;

    if (search && userType && status) {
      // 모든 필터 조건이 있는 경우
      const searchPattern = `%${search}%`;
      const activeStatus = status === "ACTIVE";
      
      [users, total] = await Promise.all([
        sql`
          SELECT 
            u.id,
            u.email,
            u.phone,
            u."userType",
            u."isActive",
            u."createdAt",
            u."lastLoginAt",
            u."profileImage",
            v."realName" as vet_real_name,
            v.nickname as vet_nickname,
            v."licenseImage" as vet_license_image,
            v."birthDate" as vet_birth_date,
            vs."realName" as student_real_name,
            vs.nickname as student_nickname,
            vs."universityEmail" as student_university_email,
            vs."birthDate" as student_birth_date,
            h."hospitalName",
            h."representativeName",
            h."businessNumber",
            h."businessLicenseFile",
            h."establishedDate",
            h."hospitalAddress",
            h."hospitalLogo"
          FROM users u
          LEFT JOIN veterinarians v ON u.id = v."userId"
          LEFT JOIN veterinary_students vs ON u.id = vs."userId"
          LEFT JOIN hospitals h ON u.id = h."userId"
          WHERE u."deletedAt" IS NULL
            AND u."userType" = ${userType}
            AND u."isActive" = ${activeStatus}
            AND (
              u.email ILIKE ${searchPattern} OR 
              v."realName" ILIKE ${searchPattern} OR 
              vs."realName" ILIKE ${searchPattern} OR 
              h."hospitalName" ILIKE ${searchPattern}
            )
          ORDER BY u."createdAt" DESC
          LIMIT ${limit} OFFSET ${offset}
        `,
        sql`
          SELECT COUNT(DISTINCT u.id) as total
          FROM users u
          LEFT JOIN veterinarians v ON u.id = v."userId"
          LEFT JOIN veterinary_students vs ON u.id = vs."userId"
          LEFT JOIN hospitals h ON u.id = h."userId"
          WHERE u."deletedAt" IS NULL
            AND u."userType" = ${userType}
            AND u."isActive" = ${activeStatus}
            AND (
              u.email ILIKE ${searchPattern} OR 
              v."realName" ILIKE ${searchPattern} OR 
              vs."realName" ILIKE ${searchPattern} OR 
              h."hospitalName" ILIKE ${searchPattern}
            )
        `
      ]);
    } else if (search && userType) {
      // 검색어와 유형 필터
      const searchPattern = `%${search}%`;
      
      [users, total] = await Promise.all([
        sql`
          SELECT 
            u.id,
            u.email,
            u.phone,
            u."userType",
            u."isActive",
            u."createdAt",
            u."lastLoginAt",
            u."profileImage",
            v."realName" as vet_real_name,
            v.nickname as vet_nickname,
            v."licenseImage" as vet_license_image,
            v."birthDate" as vet_birth_date,
            vs."realName" as student_real_name,
            vs.nickname as student_nickname,
            vs."universityEmail" as student_university_email,
            vs."birthDate" as student_birth_date,
            h."hospitalName",
            h."representativeName",
            h."businessNumber",
            h."businessLicenseFile",
            h."establishedDate",
            h."hospitalAddress",
            h."hospitalLogo"
          FROM users u
          LEFT JOIN veterinarians v ON u.id = v."userId"
          LEFT JOIN veterinary_students vs ON u.id = vs."userId"
          LEFT JOIN hospitals h ON u.id = h."userId"
          WHERE u."deletedAt" IS NULL
            AND u."userType" = ${userType}
            AND (
              u.email ILIKE ${searchPattern} OR 
              v."realName" ILIKE ${searchPattern} OR 
              vs."realName" ILIKE ${searchPattern} OR 
              h."hospitalName" ILIKE ${searchPattern}
            )
          ORDER BY u."createdAt" DESC
          LIMIT ${limit} OFFSET ${offset}
        `,
        sql`
          SELECT COUNT(DISTINCT u.id) as total
          FROM users u
          LEFT JOIN veterinarians v ON u.id = v."userId"
          LEFT JOIN veterinary_students vs ON u.id = vs."userId"
          LEFT JOIN hospitals h ON u.id = h."userId"
          WHERE u."deletedAt" IS NULL
            AND u."userType" = ${userType}
            AND (
              u.email ILIKE ${searchPattern} OR 
              v."realName" ILIKE ${searchPattern} OR 
              vs."realName" ILIKE ${searchPattern} OR 
              h."hospitalName" ILIKE ${searchPattern}
            )
        `
      ]);
    } else if (userType) {
      // 유형 필터만
      [users, total] = await Promise.all([
        sql`
          SELECT 
            u.id,
            u.email,
            u.phone,
            u."userType",
            u."isActive",
            u."createdAt",
            u."lastLoginAt",
            u."profileImage",
            v."realName" as vet_real_name,
            v.nickname as vet_nickname,
            v."licenseImage" as vet_license_image,
            v."birthDate" as vet_birth_date,
            vs."realName" as student_real_name,
            vs.nickname as student_nickname,
            vs."universityEmail" as student_university_email,
            vs."birthDate" as student_birth_date,
            h."hospitalName",
            h."representativeName",
            h."businessNumber",
            h."businessLicenseFile",
            h."establishedDate",
            h."hospitalAddress",
            h."hospitalLogo"
          FROM users u
          LEFT JOIN veterinarians v ON u.id = v."userId"
          LEFT JOIN veterinary_students vs ON u.id = vs."userId"
          LEFT JOIN hospitals h ON u.id = h."userId"
          WHERE u."deletedAt" IS NULL AND u."userType" = ${userType}
          ORDER BY u."createdAt" DESC
          LIMIT ${limit} OFFSET ${offset}
        `,
        sql`
          SELECT COUNT(DISTINCT u.id) as total
          FROM users u
          WHERE u."deletedAt" IS NULL AND u."userType" = ${userType}
        `
      ]);
    } else if (search) {
      // 검색어만
      const searchPattern = `%${search}%`;
      
      [users, total] = await Promise.all([
        sql`
          SELECT 
            u.id,
            u.email,
            u.phone,
            u."userType",
            u."isActive",
            u."createdAt",
            u."lastLoginAt",
            u."profileImage",
            v."realName" as vet_real_name,
            v.nickname as vet_nickname,
            v."licenseImage" as vet_license_image,
            v."birthDate" as vet_birth_date,
            vs."realName" as student_real_name,
            vs.nickname as student_nickname,
            vs."universityEmail" as student_university_email,
            vs."birthDate" as student_birth_date,
            h."hospitalName",
            h."representativeName",
            h."businessNumber",
            h."businessLicenseFile",
            h."establishedDate",
            h."hospitalAddress",
            h."hospitalLogo"
          FROM users u
          LEFT JOIN veterinarians v ON u.id = v."userId"
          LEFT JOIN veterinary_students vs ON u.id = vs."userId"
          LEFT JOIN hospitals h ON u.id = h."userId"
          WHERE u."deletedAt" IS NULL
            AND (
              u.email ILIKE ${searchPattern} OR 
              v."realName" ILIKE ${searchPattern} OR 
              vs."realName" ILIKE ${searchPattern} OR 
              h."hospitalName" ILIKE ${searchPattern}
            )
          ORDER BY u."createdAt" DESC
          LIMIT ${limit} OFFSET ${offset}
        `,
        sql`
          SELECT COUNT(DISTINCT u.id) as total
          FROM users u
          LEFT JOIN veterinarians v ON u.id = v."userId"
          LEFT JOIN veterinary_students vs ON u.id = vs."userId"
          LEFT JOIN hospitals h ON u.id = h."userId"
          WHERE u."deletedAt" IS NULL
            AND (
              u.email ILIKE ${searchPattern} OR 
              v."realName" ILIKE ${searchPattern} OR 
              vs."realName" ILIKE ${searchPattern} OR 
              h."hospitalName" ILIKE ${searchPattern}
            )
        `
      ]);
    } else {
      // 필터 없음 - 전체 조회
      [users, total] = await Promise.all([
        sql`
          SELECT 
            u.id,
            u.email,
            u.phone,
            u."userType",
            u."isActive",
            u."createdAt",
            u."lastLoginAt",
            u."profileImage",
            v."realName" as vet_real_name,
            v.nickname as vet_nickname,
            v."licenseImage" as vet_license_image,
            v."birthDate" as vet_birth_date,
            vs."realName" as student_real_name,
            vs.nickname as student_nickname,
            vs."universityEmail" as student_university_email,
            vs."birthDate" as student_birth_date,
            h."hospitalName",
            h."representativeName",
            h."businessNumber",
            h."businessLicenseFile",
            h."establishedDate",
            h."hospitalAddress",
            h."hospitalLogo"
          FROM users u
          LEFT JOIN veterinarians v ON u.id = v."userId"
          LEFT JOIN veterinary_students vs ON u.id = vs."userId"
          LEFT JOIN hospitals h ON u.id = h."userId"
          WHERE u."deletedAt" IS NULL
          ORDER BY u."createdAt" DESC
          LIMIT ${limit} OFFSET ${offset}
        `,
        sql`
          SELECT COUNT(DISTINCT u.id) as total
          FROM users u
          WHERE u."deletedAt" IS NULL
        `
      ]);
    }

    const totalCount = parseInt(total[0]?.total || "0");

    // 데이터 변환
    const transformedUsers = users.map((user: any) => {
      const baseUser = {
        id: user.id,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        isActive: user.isActive,
        status: user.isActive ? "ACTIVE" : "INACTIVE",
        joinDate: user.createdAt?.toISOString().split('T')[0] || null,
        lastLogin: user.lastLoginAt?.toISOString().split('T')[0] || null,
        profileImage: user.profileImage,
        verified: true, // 기본값으로 설정
      };

      // 사용자 유형별 정보 추가
      if (user.userType === "VETERINARIAN") {
        return {
          ...baseUser,
          name: user.vet_real_name || "미입력",
          nickname: user.vet_nickname,
          realName: user.vet_real_name,
          birthDate: user.vet_birth_date,
          veterinarianLicense: user.vet_license_image ? {
            licenseImage: user.vet_license_image,
            licenseNumber: "VET-" + user.id.substring(0, 8),
            issueDate: "2020-01-01",
            expiryDate: "2030-01-01",
          } : null,
        };
      } else if (user.userType === "VETERINARY_STUDENT") {
        return {
          ...baseUser,
          name: user.student_real_name || "미입력",
          nickname: user.student_nickname,
          realName: user.student_real_name,
          birthDate: user.student_birth_date,
          universityEmail: user.student_university_email,
        };
      } else if (user.userType === "HOSPITAL") {
        return {
          ...baseUser,
          name: user.hospitalName || "미입력",
          hospitalName: user.hospitalName,
          representativeName: user.representativeName,
          address: user.hospitalAddress,
          hospitalLogo: user.hospitalLogo,
          hospitalInfo: user.businessNumber ? {
            businessNumber: user.businessNumber,
            businessRegistration: user.businessLicenseFile,
            representativeName: user.representativeName,
            establishedDate: user.establishedDate?.toISOString().split('T')[0] || null,
          } : null,
        };
      }

      return baseUser;
    });

    // 통계 정보 계산
    const stats = await sql`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN "isActive" = true THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN "isActive" = false THEN 1 ELSE 0 END) as inactive,
        SUM(CASE WHEN "userType" = 'VETERINARIAN' THEN 1 ELSE 0 END) as veterinarians,
        SUM(CASE WHEN "userType" = 'HOSPITAL' THEN 1 ELSE 0 END) as hospitals,
        SUM(CASE WHEN "userType" = 'VETERINARY_STUDENT' THEN 1 ELSE 0 END) as students
      FROM users 
      WHERE "deletedAt" IS NULL
    `;

    const statsData = {
      total: parseInt(stats[0]?.total || "0"),
      active: parseInt(stats[0]?.active || "0"),
      inactive: parseInt(stats[0]?.inactive || "0"),
      veterinarians: parseInt(stats[0]?.veterinarians || "0"),
      hospitals: parseInt(stats[0]?.hospitals || "0"),
      students: parseInt(stats[0]?.students || "0"),
    };

    return NextResponse.json(
      createApiResponse("success", "사용자 목록 조회 성공", {
        users: transformedUsers,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
        stats: statsData,
      })
    );

  } catch (error) {
    console.error("Admin users list error:", error);
    return NextResponse.json(
      createErrorResponse("사용자 목록 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}