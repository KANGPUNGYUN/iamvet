// src/app/api/admin/resumes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import { sql } from "@/lib/db";
import { mapPosition, mapDegree, mapGraduationStatus, mapSpecialties } from "@/lib/korean-mappings";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 관리자 권한 확인
    const authResult = verifyAdminToken(request);
    if (!authResult.success) {
      return NextResponse.json(
        createErrorResponse(authResult.error || "권한이 없습니다"),
        { status: 401 }
      );
    }

    const { id: resumeId } = await params;

    // 이력서 상세 정보 조회
    const resumeResult = await sql`
      SELECT 
        dr.id,
        dr.name,
        dr.introduction as description,
        dr.phone,
        dr.email,
        dr.position as title,
        dr.specialties,
        dr."preferredRegions" as location,
        dr."viewCount",
        dr."createdAt",
        dr."updatedAt" as "lastUpdated",
        dr.photo as "profileImage",
        dr."selfIntroduction",
        u.id as "userId",
        u.email as "userEmail",
        u.phone as "userPhone",
        u."createdAt" as "joinDate",
        u."lastLoginAt" as "lastLogin",
        u."isActive",
        v."realName" as "veterinarianName",
        v."licenseImage",
        v."birthDate"
      FROM resumes dr
      JOIN users u ON dr."userId" = u.id
      LEFT JOIN veterinarians v ON u.id = v."userId"
      WHERE dr.id = ${resumeId} AND dr."deletedAt" IS NULL
    `;

    if (resumeResult.length === 0) {
      return NextResponse.json(
        createErrorResponse("이력서를 찾을 수 없습니다"),
        { status: 404 }
      );
    }

    const resume = resumeResult[0];

    // 학력 정보 조회
    const educations = await sql`
      SELECT 
        degree,
        "graduationStatus",
        "schoolName",
        major,
        gpa,
        "totalGpa",
        "startDate",
        "endDate",
        "sortOrder"
      FROM resume_educations
      WHERE "resumeId" = ${resumeId}
      ORDER BY "sortOrder" ASC
    `;

    // 경력 정보 조회
    const experiences = await sql`
      SELECT 
        "hospitalName",
        "mainTasks",
        "startDate",
        "endDate",
        "sortOrder"
      FROM resume_experiences
      WHERE "resumeId" = ${resumeId}
      ORDER BY "sortOrder" ASC
    `;

    // 자격증 정보 조회
    const licenses = await sql`
      SELECT 
        name,
        issuer,
        "acquiredDate",
        "sortOrder"
      FROM resume_licenses
      WHERE "resumeId" = ${resumeId}
      ORDER BY "sortOrder" ASC
    `;

    // 최근 지원 내역 조회 (옵션) - applications 테이블 사용
    const recentApplications = await sql`
      SELECT 
        a.id,
        a."appliedAt",
        a.status,
        j.title as "jobTitle",
        h."hospitalName"
      FROM applications a
      JOIN jobs j ON a."jobId" = j.id
      JOIN hospitals h ON j."hospitalId" = h."userId"
      WHERE a."veterinarianId" = ${resume.userId}
      ORDER BY a."appliedAt" DESC
      LIMIT 5
    `;

    // 최근 조회 내역 (옵션) - 해당 테이블이 없으므로 빈 배열로 설정
    const recentViews: any[] = [];

    // 학력 정보 구성 (한국어 매핑 적용)
    let educationText = "학력 미입력";
    if (educations.length > 0) {
      const edu = educations[0];
      const parts = [];
      if (edu.schoolName) parts.push(edu.schoolName);
      if (edu.degree) parts.push(mapDegree(edu.degree));
      if (edu.major) parts.push(edu.major);
      if (edu.graduationStatus) parts.push(mapGraduationStatus(edu.graduationStatus));
      educationText = parts.join(" ");
    }

    // 경력년수 계산
    let experienceYears = 0;
    if (experiences.length > 0) {
      const startDates = experiences.filter(exp => exp.startDate).map(exp => new Date(exp.startDate));
      const endDates = experiences.filter(exp => exp.endDate).map(exp => new Date(exp.endDate));
      
      if (startDates.length > 0) {
        const earliestStart = new Date(Math.min(...startDates.map(d => d.getTime())));
        const latestEnd = endDates.length > 0 ? 
          new Date(Math.max(...endDates.map(d => d.getTime()))) : 
          new Date();
        
        experienceYears = Math.floor((latestEnd.getTime() - earliestStart.getTime()) / (1000 * 60 * 60 * 24 * 365));
      }
    }

    // 경력 이력 변환
    const careerHistory = experiences.map((exp: any) => ({
      hospitalName: exp.hospitalName,
      position: "수의사", // 기본값
      startDate: exp.startDate ? exp.startDate.toISOString().split('T')[0] : null,
      endDate: exp.endDate ? exp.endDate.toISOString().split('T')[0] : null,
      description: exp.mainTasks
    }));

    // 자격증 정보 변환
    const certificates = licenses.map((license: any) => ({
      name: license.name,
      issuer: license.issuer,
      acquiredDate: license.acquiredDate ? license.acquiredDate.toISOString().split('T')[0] : null
    }));

    // 데이터 변환 (한국어 매핑 적용)
    const transformedResume = {
      id: resume.id,
      name: resume.name || resume.veterinarianName || "미입력",
      email: resume.email || resume.userEmail,
      phone: resume.phone || resume.userPhone,
      title: mapPosition(resume.title) || "제목 없음",
      experience: experienceYears,
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
      description: resume.description || resume.selfIntroduction,
      careerHistory: careerHistory,
      certificates: certificates,
      achievements: [],
      skills: [],
      languages: [],
      portfolio: [],
      user: {
        id: resume.userId,
        name: resume.name || resume.veterinarianName || "미입력",
        email: resume.userEmail,
        phone: resume.userPhone,
        joinDate: resume.joinDate?.toISOString().split('T')[0] || null,
        lastLogin: resume.lastLogin?.toISOString().split('T')[0] || null,
        verified: true,
        veterinarianLicense: resume.licenseImage ? {
          licenseNumber: `VET-${resume.userId.substring(0, 8)}`,
          licenseImage: resume.licenseImage,
          issueDate: "2020-01-01",
          expiryDate: "2030-01-01",
        } : undefined,
      }
    };

    return NextResponse.json(
      createApiResponse("success", "이력서 상세 조회 성공", {
        resume: transformedResume,
        recentApplications: recentApplications.map((app: any) => ({
          id: app.id,
          jobTitle: app.jobTitle,
          hospitalName: app.hospitalName,
          appliedAt: app.appliedAt?.toISOString().split('T')[0] || null,
          status: app.status,
        })),
        recentViews: recentViews.map((view: any) => ({
          hospitalName: view.hospitalName,
          viewedAt: view.viewedAt?.toISOString().split('T')[0] || null,
        })),
      })
    );

  } catch (error) {
    console.error("Admin resume detail error:", error);
    return NextResponse.json(
      createErrorResponse("이력서 상세 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 관리자 권한 확인
    const authResult = verifyAdminToken(request);
    if (!authResult.success) {
      return NextResponse.json(
        createErrorResponse(authResult.error || "권한이 없습니다"),
        { status: 401 }
      );
    }

    const { id: resumeId } = await params;
    const body = await request.json();
    const { action, reason } = body;

    // 유효한 액션 확인
    const validActions = ["approve", "suspend", "activate", "delete", "verify"];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        createErrorResponse("잘못된 액션입니다"),
        { status: 400 }
      );
    }

    // 이력서 존재 확인
    const resumeResult = await sql`
      SELECT dr.id, u."isActive", dr."userId"
      FROM resumes dr
      JOIN users u ON dr."userId" = u.id
      WHERE dr.id = ${resumeId} AND dr."deletedAt" IS NULL
    `;

    if (resumeResult.length === 0) {
      return NextResponse.json(
        createErrorResponse("이력서를 찾을 수 없습니다"),
        { status: 404 }
      );
    }

    // 액션별 처리
    let actionDescription = "";

    switch (action) {
      case "approve":
        await sql`
          UPDATE users 
          SET "isActive" = true, "updatedAt" = NOW()
          WHERE id = (SELECT "userId" FROM resumes WHERE id = ${resumeId})
        `;
        actionDescription = "승인";
        break;

      case "suspend":
        await sql`
          UPDATE users 
          SET "isActive" = false, "updatedAt" = NOW()
          WHERE id = (SELECT "userId" FROM resumes WHERE id = ${resumeId})
        `;
        actionDescription = "정지";
        break;

      case "activate":
        await sql`
          UPDATE users 
          SET "isActive" = true, "updatedAt" = NOW()
          WHERE id = (SELECT "userId" FROM resumes WHERE id = ${resumeId})
        `;
        actionDescription = "활성화";
        break;

      case "delete":
        await sql`
          UPDATE resumes 
          SET "deletedAt" = NOW(), "updatedAt" = NOW()
          WHERE id = ${resumeId}
        `;
        actionDescription = "삭제";
        break;

      case "verify":
        // detailed_resumes에는 verified 필드가 없으므로 단순히 사용자 활성화
        await sql`
          UPDATE users 
          SET "isActive" = true, "updatedAt" = NOW()
          WHERE id = (SELECT "userId" FROM resumes WHERE id = ${resumeId})
        `;
        actionDescription = "인증";
        break;
    }

    // 관리 로그 기록 (옵션)
    try {
      await sql`
        INSERT INTO admin_action_logs (
          "adminId",
          "targetType",
          "targetId", 
          action,
          reason,
          "createdAt"
        ) VALUES (
          ${'system'},
          'resume',
          ${resumeId},
          ${action},
          ${reason || null},
          NOW()
        )
      `;
    } catch (logError) {
      console.warn("Failed to log admin action:", logError);
      // 로그 실패해도 메인 작업은 계속 진행
    }

    return NextResponse.json(
      createApiResponse("success", `이력서 ${actionDescription} 완료`, {
        resumeId,
        action,
        reason,
      })
    );

  } catch (error) {
    console.error("Admin resume action error:", error);
    return NextResponse.json(
      createErrorResponse("이력서 관리 작업 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}