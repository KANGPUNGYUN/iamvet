import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import { sql } from '@/lib/db';

// 양수양도 상세 조회 (관리자용)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const { id } = params;

    // 양수양도 상세 조회
    const transferResult = await sql`
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
        t.latitude,
        t.longitude,
        u.id as user_id,
        u.name as user_name,
        u.email as user_email,
        u.phone as user_phone,
        COUNT(DISTINCT tl.id) as like_count
      FROM transfers t
      LEFT JOIN users u ON t."userId" = u.id
      LEFT JOIN transfer_likes tl ON t.id = tl."transferId"
      WHERE t.id = ${id} AND t."deletedAt" IS NULL
      GROUP BY t.id, u.id, u.name, u.email, u.phone
    `;

    if (transferResult.length === 0) {
      return NextResponse.json(
        { status: 'error', message: '양수양도 게시물을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const transfer = transferResult[0];

    // 관련 통계 조회 (같은 지역의 다른 게시물들)
    const relatedStatsResult = await sql`
      SELECT 
        COUNT(*) as related_count,
        AVG(price) as avg_price
      FROM transfers t
      WHERE t.sido = ${transfer.sido}
        AND t.sigungu = ${transfer.sigungu}
        AND t.category = ${transfer.category}
        AND t.id != ${id}
        AND t.status = 'ACTIVE'
        AND t."deletedAt" IS NULL
    `;

    // 사용자의 다른 게시물 조회
    const userOtherTransfersResult = await sql`
      SELECT 
        id,
        title,
        status,
        "createdAt"
      FROM transfers t
      WHERE t."userId" = ${transfer.user_id}
        AND t.id != ${id}
        AND t."deletedAt" IS NULL
      ORDER BY t."createdAt" DESC
      LIMIT 5
    `;

    // 데이터 변환
    const transferData = {
      id: transfer.id,
      title: transfer.title,
      description: transfer.description || '',
      hospitalName: '', // transfers에는 병원명이 없음
      location: transfer.location || `${transfer.sido || ''} ${transfer.sigungu || ''}`.trim(),
      price: transfer.price ? `${transfer.price.toLocaleString()}원` : '협의',
      transferType: transfer.category === '양도' ? '양도' : '양수',
      status: transfer.status,
      reportCount: 0, // TODO: 신고 시스템 구현시 추가
      inquiryCount: parseInt(transfer.like_count) || 0,
      createdAt: transfer.createdAt?.toISOString().split('T')[0],
      updatedAt: transfer.updatedAt?.toISOString().split('T')[0],
      viewCount: parseInt(transfer.views) || 0,
      images: transfer.images || [],
      area: transfer.area,
      baseAddress: transfer.base_address,
      detailAddress: transfer.detail_address,
      sido: transfer.sido,
      sigungu: transfer.sigungu,
      latitude: transfer.latitude,
      longitude: transfer.longitude,
      user: {
        id: transfer.user_id,
        name: transfer.user_name,
        email: transfer.user_email,
        phone: transfer.user_phone,
      },
      likeCount: parseInt(transfer.like_count) || 0,
      relatedStats: {
        relatedCount: parseInt(relatedStatsResult[0]?.related_count || '0'),
        avgPrice: parseFloat(relatedStatsResult[0]?.avg_price || '0'),
      },
      userOtherTransfers: userOtherTransfersResult.map(row => ({
        id: row.id,
        title: row.title,
        status: row.status,
        createdAt: row.createdAt?.toISOString().split('T')[0],
      })),
    };

    return NextResponse.json({
      status: 'success',
      data: transferData,
    });

  } catch (error) {
    console.error('양수양도 상세 조회 실패:', error);
    return NextResponse.json(
      { status: 'error', message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 양수양도 상태 변경 (관리자용)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const { id } = params;
    const { status, reason } = await request.json();

    // 유효한 상태값인지 확인
    const validStatuses = ['ACTIVE', 'PENDING', 'SUSPENDED', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { status: 'error', message: '유효하지 않은 상태값입니다.' },
        { status: 400 }
      );
    }

    // 양수양도 게시물 존재 확인
    const existingTransfer = await sql`
      SELECT id, status, "userId"
      FROM transfers
      WHERE id = ${id} AND "deletedAt" IS NULL
    `;

    if (existingTransfer.length === 0) {
      return NextResponse.json(
        { status: 'error', message: '양수양도 게시물을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 상태 업데이트
    await sql`
      UPDATE transfers
      SET 
        status = ${status},
        "updatedAt" = NOW()
      WHERE id = ${id}
    `;

    // TODO: 상태 변경 로그 기록
    // await sql`
    //   INSERT INTO admin_logs (action, target_type, target_id, admin_id, reason, created_at)
    //   VALUES ('status_change', 'transfer', ${id}, ${adminAuth.adminId}, ${reason || ''}, NOW())
    // `;

    // TODO: 사용자에게 알림 발송 (상태 변경 시)
    // if (status === 'SUSPENDED') {
    //   // 정지 알림 발송
    // } else if (status === 'ACTIVE') {
    //   // 승인 알림 발송
    // }

    return NextResponse.json({
      status: 'success',
      message: '상태가 성공적으로 변경되었습니다.',
      data: {
        id,
        status,
        updatedAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('양수양도 상태 변경 실패:', error);
    return NextResponse.json(
      { status: 'error', message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 양수양도 삭제 (관리자용)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const { id } = params;
    const { reason } = await request.json();

    // 양수양도 게시물 존재 확인
    const existingTransfer = await sql`
      SELECT id, "userId"
      FROM transfers
      WHERE id = ${id} AND "deletedAt" IS NULL
    `;

    if (existingTransfer.length === 0) {
      return NextResponse.json(
        { status: 'error', message: '양수양도 게시물을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 소프트 삭제 (deletedAt 설정)
    await sql`
      UPDATE transfers
      SET 
        "deletedAt" = NOW(),
        "updatedAt" = NOW()
      WHERE id = ${id}
    `;

    // TODO: 삭제 로그 기록
    // await sql`
    //   INSERT INTO admin_logs (action, target_type, target_id, admin_id, reason, created_at)
    //   VALUES ('delete', 'transfer', ${id}, ${adminAuth.adminId}, ${reason || ''}, NOW())
    // `;

    // TODO: 사용자에게 삭제 알림 발송

    return NextResponse.json({
      status: 'success',
      message: '게시물이 성공적으로 삭제되었습니다.',
      data: {
        id,
        deletedAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('양수양도 삭제 실패:', error);
    return NextResponse.json(
      { status: 'error', message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}