import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import { sql } from '@/lib/db';

// 채용 공고 목록 조회 (관리자용)
export async function GET(request: NextRequest) {
  try {
    // 관리자 인증 확인
    const adminAuth = verifyAdminToken(request);
    if (!adminAuth.success) {
      return NextResponse.json(
        { status: 'error', message: '관리자 인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const workType = searchParams.get('workType') || '';
    const status = searchParams.get('status') || '';
    const location = searchParams.get('location') || '';

    const offset = (page - 1) * limit;

    // 필터 패턴 구성
    const searchPattern = search ? `%${search}%` : null;
    const locationPattern = location ? `%${location}%` : null;

    // 총 개수 조회 (조건부 WHERE 절 처리)
    let countResult;
    if (search || workType || status || location) {
      countResult = await sql`
        SELECT COUNT(*) as total
        FROM jobs j
        LEFT JOIN users h ON j."hospitalId" = h.id
        LEFT JOIN hospitals hosp ON h.id = hosp."userId"
        WHERE 1=1
          ${search ? sql`AND (j.title ILIKE ${searchPattern} OR hosp."hospitalName" ILIKE ${searchPattern})` : sql``}
          ${workType ? sql`AND ${workType} = ANY(j."workType")` : sql``}
          ${status ? sql`AND (${status === 'ACTIVE' ? 'j."isActive" = true AND j."isDraft" = false' : status === 'PENDING' ? 'j."isDraft" = true' : status === 'INACTIVE' ? 'j."isActive" = false' : '1=0'})` : sql``}
      `;
    } else {
      countResult = await sql`
        SELECT COUNT(*) as total
        FROM jobs j
        LEFT JOIN users h ON j."hospitalId" = h.id
        LEFT JOIN hospitals hosp ON h.id = hosp."userId"
      `;
    }
    const total = parseInt(countResult[0]?.total || '0');

    // 채용 공고 목록 조회
    let jobsResult;
    if (search || workType || status || location) {
      // 필터가 있는 경우
      jobsResult = await sql`
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
          COUNT(DISTINCT a.id) as applicant_count,
          COUNT(DISTINCT l.id) as like_count
        FROM jobs j
        LEFT JOIN users h ON j."hospitalId" = h.id
        LEFT JOIN hospitals hosp ON h.id = hosp."userId"
        LEFT JOIN applications a ON j.id = a."jobId"
        LEFT JOIN job_likes l ON j.id = l."jobId"
        WHERE 1=1
          ${search ? sql`AND (j.title ILIKE ${searchPattern} OR hosp."hospitalName" ILIKE ${searchPattern})` : sql``}
          ${workType ? sql`AND ${workType} = ANY(j."workType")` : sql``}
          ${status ? sql`AND (${status === 'ACTIVE' ? 'j."isActive" = true AND j."isDraft" = false' : status === 'PENDING' ? 'j."isDraft" = true' : status === 'INACTIVE' ? 'j."isActive" = false' : '1=0'})` : sql``}
        GROUP BY j.id, h.id, h.phone, hosp."hospitalName", hosp."hospitalAddress"
        ORDER BY j."createdAt" DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      // 필터가 없는 경우
      jobsResult = await sql`
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
          COUNT(DISTINCT a.id) as applicant_count,
          COUNT(DISTINCT l.id) as like_count
        FROM jobs j
        LEFT JOIN users h ON j."hospitalId" = h.id
        LEFT JOIN hospitals hosp ON h.id = hosp."userId"
        LEFT JOIN applications a ON j.id = a."jobId"
        LEFT JOIN job_likes l ON j.id = l."jobId"
        GROUP BY j.id, h.id, h.phone, hosp."hospitalName", hosp."hospitalAddress"
        ORDER BY j."createdAt" DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    // 통계 조회
    const statsResult = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE j."isActive" = true AND j."isDraft" = false) as active,
        COUNT(*) FILTER (WHERE j."isDraft" = true) as pending,
        COUNT(*) FILTER (WHERE j."isActive" = false) as suspended,
        COUNT(*) FILTER (WHERE j."deletedAt" IS NOT NULL) as expired,
        COUNT(*) FILTER (WHERE 'FULL_TIME' = ANY(j."workType")) as full_time,
        COUNT(*) FILTER (WHERE 'PART_TIME' = ANY(j."workType")) as part_time,
        COUNT(*) FILTER (WHERE 'CONTRACT' = ANY(j."workType")) as contract,
        COUNT(*) FILTER (WHERE 'INTERN' = ANY(j."workType")) as intern
      FROM jobs j
    `;

    // 데이터 변환
    const jobs = jobsResult.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description || row.benefits || '',
      hospitalName: row.hospital_name,
      hospitalId: row.hospital_id,
      hospitalPhone: row.hospital_phone,
      hospitalAddress: row.hospital_address,
      location: row.hospital_address || row.department, // Use hospital address or department
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
      requirements: '', // Not available in schema
      benefits: row.benefits,
      status: row.isActive && !row.isDraft ? 'ACTIVE' : row.isDraft ? 'PENDING' : 'INACTIVE',
      isUrgent: false, // Not available in schema
      deadline: row.recruitEndDate,
      createdAt: row.createdAt?.toISOString().split('T')[0],
      updatedAt: row.updatedAt?.toISOString().split('T')[0],
      viewCount: parseInt(row.viewCount) || 0,
      applicantCount: parseInt(row.applicant_count) || 0,
      reportCount: 0, // TODO: Implement reports table
      likeCount: parseInt(row.like_count) || 0,
    }));

    const stats = {
      total: parseInt(statsResult[0]?.total || '0'),
      active: parseInt(statsResult[0]?.active || '0'),
      pending: parseInt(statsResult[0]?.pending || '0'),
      suspended: parseInt(statsResult[0]?.suspended || '0'),
      expired: parseInt(statsResult[0]?.expired || '0'),
      fullTime: parseInt(statsResult[0]?.full_time || '0'),
      partTime: parseInt(statsResult[0]?.part_time || '0'),
      contract: parseInt(statsResult[0]?.contract || '0'),
      intern: parseInt(statsResult[0]?.intern || '0'),
    };

    const pagination = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };

    return NextResponse.json({
      status: 'success',
      data: {
        jobs,
        pagination,
        stats,
      },
    });

  } catch (error) {
    console.error('채용 공고 목록 조회 실패:', error);
    return NextResponse.json(
      { status: 'error', message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}