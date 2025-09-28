// src/app/api/admin/resumes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import { sql } from "@/lib/db";
import { mapPosition, mapDegree, mapGraduationStatus, mapSpecialties } from "@/lib/korean-mappings";

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
    const status = searchParams.get("status") || "";
    const specialty = searchParams.get("specialty") || "";
    const location = searchParams.get("location") || "";
    const experience = searchParams.get("experience") || "";
    const verified = searchParams.get("verified") || "";

    const offset = (page - 1) * limit;

    // 이력서 목록 조회 - 학력과 경력 정보 포함
    const [resumes, total] = await Promise.all([
      sql`
        SELECT 
          dr.id,
          dr.name,
          dr.introduction,
          dr.phone,
          dr.email,
          dr.position as title,
          dr.specialties,
          dr."preferredRegions" as location,
          dr."viewCount",
          dr."createdAt",
          dr."updatedAt" as "lastUpdated",
          dr.photo as "profileImage",
          u.id as "userId",
          u."userType",
          u."isActive",
          v."realName" as "veterinarianName",
          -- 최신 학력 정보 하나만 가져오기
          re.degree,
          re."schoolName",
          re.major,
          re."graduationStatus",
          -- 총 경력년수 계산
          COALESCE(
            EXTRACT(YEAR FROM AGE(
              COALESCE(MAX(rex."endDate"), NOW()),
              MIN(rex."startDate")
            ))::INTEGER,
            0
          ) as "experienceYears"
        FROM detailed_resumes dr
        JOIN users u ON dr."userId" = u.id
        LEFT JOIN veterinarians v ON u.id = v."userId"
        LEFT JOIN resume_educations re ON dr.id = re."resumeId" 
          AND re."sortOrder" = (
            SELECT MIN("sortOrder") 
            FROM resume_educations 
            WHERE "resumeId" = dr.id
          )
        LEFT JOIN resume_experiences rex ON dr.id = rex."resumeId"
        WHERE dr."deletedAt" IS NULL
        GROUP BY dr.id, dr.name, dr.introduction, dr.phone, dr.email, 
                 dr.position, dr.specialties, dr."preferredRegions", 
                 dr."viewCount", dr."createdAt", dr."updatedAt", 
                 dr.photo, u.id, u."userType", u."isActive", 
                 v."realName", re.degree, re."schoolName", re.major, re."graduationStatus"
        ORDER BY dr."createdAt" DESC
        LIMIT ${limit} OFFSET ${offset}
      `,
      sql`
        SELECT COUNT(*) as total
        FROM detailed_resumes dr
        WHERE dr."deletedAt" IS NULL
      `
    ]);

    const totalCount = parseInt(total[0]?.total || "0");

    // 데이터 변환
    const transformedResumes = resumes.map((resume: any) => {
      // 학력 정보 구성 (한국어 매핑 적용)
      let educationText = "학력 미입력";
      if (resume.schoolName || resume.degree) {
        const parts = [];
        if (resume.schoolName) parts.push(resume.schoolName);
        if (resume.degree) parts.push(mapDegree(resume.degree));
        if (resume.major) parts.push(resume.major);
        if (resume.graduationStatus) parts.push(mapGraduationStatus(resume.graduationStatus));
        educationText = parts.join(" ");
      }

      return {
        id: resume.id,
        name: resume.name || resume.veterinarianName || "미입력",
        email: resume.email,
        phone: resume.phone,
        title: mapPosition(resume.title) || "제목 없음",
        experience: parseInt(resume.experienceYears || "0"),
        location: Array.isArray(resume.location) ? resume.location.join(", ") : (resume.location || "위치 미입력"),
        education: educationText,
        specialties: Array.isArray(resume.specialties) ? mapSpecialties(resume.specialties) : [],
        status: resume.isActive ? "ACTIVE" : "INACTIVE",
        verified: true, // 기본값으로 설정
        rating: 0, // detailed_resumes에는 rating 필드가 없음
        reviewCount: 0, // detailed_resumes에는 reviewCount 필드가 없음
        viewCount: parseInt(resume.viewCount || "0"),
        favoriteCount: 0, // detailed_resumes에는 favoriteCount 필드가 없음
        createdAt: resume.createdAt?.toISOString().split('T')[0] || null,
        lastUpdated: resume.lastUpdated?.toISOString().split('T')[0] || null,
        profileImage: resume.profileImage,
        userId: resume.userId,
      };
    });

    // 통계 정보 계산
    const stats = await sql`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN u."isActive" = true THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN u."isActive" = false THEN 1 ELSE 0 END) as inactive,
        0 as suspended,
        0 as pending,
        COUNT(*) as verified,
        0 as unverified
      FROM detailed_resumes dr
      JOIN users u ON dr."userId" = u.id
      WHERE dr."deletedAt" IS NULL
    `;
    
    const statsData = {
      total: parseInt(stats[0]?.total || "0"),
      active: parseInt(stats[0]?.active || "0"),
      inactive: parseInt(stats[0]?.inactive || "0"),
      suspended: parseInt(stats[0]?.suspended || "0"),
      pending: parseInt(stats[0]?.pending || "0"),
      verified: parseInt(stats[0]?.verified || "0"),
      unverified: parseInt(stats[0]?.unverified || "0"),
    };

    return NextResponse.json(
      createApiResponse("success", "이력서 목록 조회 성공", {
        resumes: transformedResumes,
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
    console.error("Admin resumes list error:", error);
    return NextResponse.json(
      createErrorResponse("이력서 목록 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}