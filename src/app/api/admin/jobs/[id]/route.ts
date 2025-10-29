import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import { sql } from '@/lib/db';

// 채용 공고 상세 조회 (관리자용)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 관리자 인증 확인
    const adminAuth = verifyAdminToken(request);
    if (!adminAuth.success) {
      return NextResponse.json(
        { status: 'error', message: '관리자 인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const { id: jobId } = await params;

    // 채용 공고 상세 정보 조회
    const jobResult = await sql`
      SELECT 
        j.id,
        j.title,
        j.benefits as description,
        j."workType",
        j.salary,
        j."salaryType",
        j.department,
        j.benefits,
        j."isActive",
        j."isDraft",
        j."createdAt",
        j."updatedAt",
        j."viewCount",
        j."recruitEndDate",
        h.id as hospital_id,
        hosp."hospitalName" as hospital_name,
        h.phone as hospital_phone,
        hosp."hospitalAddress" as hospital_address,
        h.email as hospital_email,
        COUNT(DISTINCT a.id) as applicant_count,
        COUNT(DISTINCT l.id) as like_count
      FROM jobs j
      LEFT JOIN users h ON j."hospitalId" = h.id
      LEFT JOIN hospitals hosp ON h.id = hosp."userId"
      LEFT JOIN applications a ON j.id = a."jobId"
      LEFT JOIN job_likes l ON j.id = l."jobId"
      WHERE j.id = ${jobId}
      GROUP BY j.id, h.id, h.phone, h.email, hosp."hospitalName", hosp."hospitalAddress"
    `;

    if (jobResult.length === 0) {
      return NextResponse.json(
        { status: 'error', message: '채용 공고를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const row = jobResult[0];

    // 최근 지원자 목록 조회 (최대 5명)
    const applicantsResult = await sql`
      SELECT 
        a.id,
        a."createdAt",
        a.status as application_status,
        a."coverLetter",
        u.id as veterinarian_id,
        u.email,
        u.phone,
        v."realName" as name,
        v."nickname"
      FROM applications a
      LEFT JOIN users u ON a."veterinarianId" = u.id
      LEFT JOIN veterinarians v ON u.id = v."userId"
      WHERE a."jobId" = ${jobId}
      ORDER BY a."createdAt" DESC
      LIMIT 5
    `;


    // 데이터 변환
    const job = {
      id: row.id,
      title: row.title,
      description: row.description || row.benefits || '',
      hospitalName: row.hospital_name,
      hospitalId: row.hospital_id,
      hospitalPhone: row.hospital_phone,
      hospitalAddress: row.hospital_address,
      workType: (() => {
        const workTypeValue = Array.isArray(row.workType) ? row.workType[0] : row.workType;
        const typeMap: { [key: string]: string } = {
          '정규직': 'FULL_TIME',
          '파트타임': 'PART_TIME',
          '비정규직': 'PART_TIME',
          '계약직': 'CONTRACT',
          '인턴': 'INTERN'
        };
        return typeMap[workTypeValue] || workTypeValue || 'FULL_TIME';
      })(),
      salaryMin: null,
      salaryMax: null,
      salary: row.salary,
      salaryType: row.salaryType,
      location: row.department,
      requirements: '', // Not available in schema
      benefits: row.benefits,
      status: row.isActive && !row.isDraft ? 'ACTIVE' : row.isDraft ? 'PENDING' : 'INACTIVE',
      isUrgent: false,
      deadline: row.recruitEndDate,
      createdAt: row.createdAt?.toISOString().split('T')[0],
      updatedAt: row.updatedAt?.toISOString().split('T')[0],
      viewCount: parseInt(row.viewCount) || 0,
      applicantCount: parseInt(row.applicant_count) || 0,
      reportCount: 0, // TODO: Implement reports table
      likeCount: parseInt(row.like_count) || 0,
      hospital: {
        id: row.hospital_id,
        name: row.hospital_name,
        phone: row.hospital_phone,
        address: row.hospital_address,
        email: row.hospital_email,
      },
    };

    const recentApplicants = applicantsResult.map(applicant => ({
      id: applicant.id,
      createdAt: applicant.createdAt?.toISOString().split('T')[0],
      status: applicant.application_status,
      coverLetter: applicant.coverLetter,
      veterinarian: {
        id: applicant.veterinarian_id,
        name: applicant.name || applicant.nickname || 'Unknown',
        email: applicant.email,
        phone: applicant.phone,
        nickname: applicant.nickname,
      },
    }));

    const recentReports: any[] = []; // TODO: Implement reports system

    return NextResponse.json({
      status: 'success',
      data: {
        job,
        recentApplicants,
        recentReports,
      },
    });

  } catch (error) {
    console.error('채용 공고 상세 조회 실패:', error);
    return NextResponse.json(
      { status: 'error', message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 채용 공고 상태 변경 (관리자용)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 관리자 인증 확인
    const adminAuth = verifyAdminToken(request);
    if (!adminAuth.success) {
      return NextResponse.json(
        { status: 'error', message: '관리자 인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const { id: jobId } = await params;
    const body = await request.json();
    const { isActive, reason } = body;

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { status: 'error', message: 'isActive 값이 필요합니다.' },
        { status: 400 }
      );
    }

    // 현재 채용공고 정보 조회 (작성자 정보 포함)
    const jobResult = await sql`
      SELECT 
        j.id,
        j.title,
        j."hospitalId",
        j."isActive",
        h.email as hospital_email,
        hosp."hospitalName" as hospital_name
      FROM jobs j
      LEFT JOIN users h ON j."hospitalId" = h.id
      LEFT JOIN hospitals hosp ON h.id = hosp."userId"
      WHERE j.id = ${jobId}
    `;

    if (jobResult.length === 0) {
      return NextResponse.json(
        { status: 'error', message: '채용 공고를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const job = jobResult[0];

    // 채용공고 상태 업데이트
    await sql`
      UPDATE jobs 
      SET "isActive" = ${isActive}, "updatedAt" = NOW()
      WHERE id = ${jobId}
    `;

    // 작성자에게 알림 발송
    try {
      const statusText = isActive ? '활성화' : '비활성화';
      const notificationTitle = `채용공고 ${statusText} 알림`;
      const notificationContent = reason 
        ? `"${job.title}" 채용공고가 관리자에 의해 ${statusText}되었습니다.\n사유: ${reason}`
        : `"${job.title}" 채용공고가 관리자에 의해 ${statusText}되었습니다.`;

      // 데이터베이스에 직접 삽입 (camelCase 필드명 사용)
      const notificationId = `notification_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      await sql`
        INSERT INTO notifications (id, "recipientId", "recipientType", type, title, content, "isRead", "createdAt", "updatedAt")
        VALUES (${notificationId}, ${job.hospitalId}, 'HOSPITAL', 'SYSTEM', ${notificationTitle}, ${notificationContent}, false, NOW(), NOW())
      `;
    } catch (notificationError) {
      console.error('알림 발송 실패:', notificationError);
      // 알림 발송 실패해도 상태 변경은 성공으로 처리
    }

    return NextResponse.json({
      status: 'success',
      message: `채용공고가 ${isActive ? '활성화' : '비활성화'}되었습니다.`,
      data: {
        jobId,
        isActive,
        updatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('채용 공고 상태 변경 실패:', error);
    return NextResponse.json(
      { status: 'error', message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}