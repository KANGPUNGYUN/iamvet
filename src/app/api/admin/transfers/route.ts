import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import { sql } from '@/lib/db';

// 양수양도 목록 조회 (관리자용)
export async function GET(request: NextRequest) {
  try {
    // TODO: 임시로 인증 우회 - 나중에 다시 활성화
    // const adminAuth = verifyAdminToken(request);
    // if (!adminAuth.success) {
    //   return NextResponse.json(
    //     { status: 'error', message: '관리자 인증이 필요합니다.' },
    //     { status: 401 }
    //   );
    // }
    
    console.log('Admin transfers API called'); // 디버깅용 로그

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const transferType = searchParams.get('transferType') || '';
    const status = searchParams.get('status') || '';
    const location = searchParams.get('location') || '';

    const offset = (page - 1) * limit;

    // 필터 패턴 구성
    const searchPattern = search ? `%${search}%` : null;

    // 총 개수 조회
    let countResult;
    if (search || transferType || status || location) {
      countResult = await sql`
        SELECT COUNT(*) as total
        FROM transfers t
        LEFT JOIN users u ON t."userId" = u.id
        WHERE 1=1
          ${search ? sql`AND (t.title ILIKE ${searchPattern} OR t.location ILIKE ${searchPattern} OR t.description ILIKE ${searchPattern})` : sql``}
          ${transferType ? sql`AND (
            (${transferType} = '양도' AND (t.category LIKE '%양도%' OR t.category LIKE '%매매%')) OR
            (${transferType} = '양수' AND (t.category LIKE '%양수%' OR t.category LIKE '%인수%'))
          )` : sql``}
          ${status ? sql`AND (
            (${status} = 'ACTIVE' AND t.status = 'ACTIVE') OR
            (${status} = 'PENDING' AND t.status = 'RESERVED') OR
            (${status} = 'SUSPENDED' AND t.status = 'DISABLED') OR
            (${status} = 'COMPLETED' AND t.status = 'SOLD')
          )` : sql``}
          ${location ? sql`AND t.location ILIKE ${`%${location}%`}` : sql``}
          AND t."deletedAt" IS NULL
      `;
    } else {
      countResult = await sql`
        SELECT COUNT(*) as total
        FROM transfers t
        WHERE t."deletedAt" IS NULL
      `;
    }
    const total = parseInt(countResult[0]?.total || '0');

    // 양수양도 목록 조회
    let transfersResult;
    if (search || transferType || status || location) {
      transfersResult = await sql`
        SELECT 
          t.id,
          t.title,
          t.description,
          t.location,
          t.price,
          t.category,
          t.status,
          t."createdAt",
          t."updatedAt",
          t.views,
          t.images,
          t.area,
          t."base_address",
          t."detail_address",
          t.sido,
          t.sigungu,
          u.name as user_name,
          u.email as user_email,
          u.phone as user_phone,
          COUNT(DISTINCT tl.id) as like_count
        FROM transfers t
        LEFT JOIN users u ON t."userId" = u.id
        LEFT JOIN transfer_likes tl ON t.id = tl."transferId"
        WHERE 1=1
          ${search ? sql`AND (t.title ILIKE ${searchPattern} OR t.location ILIKE ${searchPattern} OR t.description ILIKE ${searchPattern})` : sql``}
          ${transferType ? sql`AND (
            (${transferType} = '양도' AND (t.category LIKE '%양도%' OR t.category LIKE '%매매%')) OR
            (${transferType} = '양수' AND (t.category LIKE '%양수%' OR t.category LIKE '%인수%'))
          )` : sql``}
          ${status ? sql`AND (
            (${status} = 'ACTIVE' AND t.status = 'ACTIVE') OR
            (${status} = 'PENDING' AND t.status = 'RESERVED') OR
            (${status} = 'SUSPENDED' AND t.status = 'DISABLED') OR
            (${status} = 'COMPLETED' AND t.status = 'SOLD')
          )` : sql``}
          ${location ? sql`AND t.location ILIKE ${`%${location}%`}` : sql``}
          AND t."deletedAt" IS NULL
        GROUP BY t.id, u.id, u.name, u.email, u.phone
        ORDER BY t."createdAt" DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      transfersResult = await sql`
        SELECT 
          t.id,
          t.title,
          t.description,
          t.location,
          t.price,
          t.category,
          t.status,
          t."createdAt",
          t."updatedAt",
          t.views,
          t.images,
          t.area,
          t."base_address",
          t."detail_address",
          t.sido,
          t.sigungu,
          u.name as user_name,
          u.email as user_email,
          u.phone as user_phone,
          COUNT(DISTINCT tl.id) as like_count
        FROM transfers t
        LEFT JOIN users u ON t."userId" = u.id
        LEFT JOIN transfer_likes tl ON t.id = tl."transferId"
        WHERE t."deletedAt" IS NULL
        GROUP BY t.id, u.id, u.name, u.email, u.phone
        ORDER BY t."createdAt" DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    // 통계 조회
    const statsResult = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE t.status = 'ACTIVE') as active,
        COUNT(*) FILTER (WHERE t.status = 'RESERVED') as pending,
        COUNT(*) FILTER (WHERE t.status = 'DISABLED') as suspended,
        COUNT(*) FILTER (WHERE t.status = 'SOLD') as completed,
        COUNT(*) FILTER (WHERE t.category LIKE '%양도%' OR t.category LIKE '%매매%') as transfer_out,
        COUNT(*) FILTER (WHERE t.category LIKE '%양수%' OR t.category LIKE '%인수%') as transfer_in
      FROM transfers t
      WHERE t."deletedAt" IS NULL
    `;

    // 최근 7일 통계
    const recentStatsResult = await sql`
      SELECT 
        COUNT(*) as recent_transfers,
        SUM(t.views) as total_views
      FROM transfers t
      WHERE t."createdAt" >= NOW() - INTERVAL '7 days'
        AND t."deletedAt" IS NULL
    `;

    // 데이터 변환
    const transfers = transfersResult.map(row => {
      // 카테고리 매핑: 데이터베이스의 값을 프론트엔드 형식으로 변환
      const getTransferType = (category: string) => {
        if (category?.includes('양도') || category?.includes('매매')) return '양도';
        if (category?.includes('양수') || category?.includes('인수')) return '양수';
        return '양도'; // 기본값
      };
      
      // 상태 매핑: 데이터베이스 enum을 프론트엔드 형식으로 변환
      const getStatus = (dbStatus: string) => {
        switch (dbStatus) {
          case 'ACTIVE': return 'ACTIVE';
          case 'SOLD': return 'COMPLETED';
          case 'RESERVED': return 'PENDING';
          case 'DISABLED': return 'SUSPENDED';
          default: return 'ACTIVE';
        }
      };
      
      return {
        id: row.id,
        title: row.title,
        description: row.description || '',
        hospitalName: '', // transfers에는 병원명이 없음
        location: row.location || `${row.sido || ''} ${row.sigungu || ''}`.trim(),
        price: row.price ? `${row.price.toLocaleString()}원` : '협의',
        transferType: getTransferType(row.category),
        status: getStatus(row.status),
        reportCount: 0, // TODO: 신고 시스템 구현시 추가
        inquiryCount: parseInt(row.like_count) || 0, // 좋아요를 문의로 임시 대체
        createdAt: row.createdAt?.toISOString().split('T')[0],
        updatedAt: row.updatedAt?.toISOString().split('T')[0],
        viewCount: parseInt(row.views) || 0,
        images: row.images || [],
        area: row.area,
        baseAddress: row.base_address,
        detailAddress: row.detail_address,
        sido: row.sido,
        sigungu: row.sigungu,
        userName: row.user_name,
        userEmail: row.user_email,
        userPhone: row.user_phone,
        likeCount: parseInt(row.like_count) || 0,
      };
    });

    const stats = {
      total: parseInt(statsResult[0]?.total || '0'),
      active: parseInt(statsResult[0]?.active || '0'),
      pending: parseInt(statsResult[0]?.pending || '0'),
      suspended: parseInt(statsResult[0]?.suspended || '0'),
      completed: parseInt(statsResult[0]?.completed || '0'),
      transferOut: parseInt(statsResult[0]?.transfer_out || '0'),
      transferIn: parseInt(statsResult[0]?.transfer_in || '0'),
      recentTransfers: parseInt(recentStatsResult[0]?.recent_transfers || '0'),
      totalViews: parseInt(recentStatsResult[0]?.total_views || '0'),
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
        transfers,
        pagination,
        stats,
      },
    });

  } catch (error) {
    console.error('양수양도 목록 조회 실패:', error);
    return NextResponse.json(
      { status: 'error', message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}