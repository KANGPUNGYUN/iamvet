import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const verifyEmailSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요'),
  verificationCode: z.string().length(6, '인증 코드는 6자리여야 합니다'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, verificationCode } = verifyEmailSchema.parse(body);

    // 인증 정보 조회
    const verification = await prisma.email_verifications.findFirst({
      where: { 
        email,
        verificationCode,
        verified: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!verification) {
      return NextResponse.json(
        { error: '유효하지 않은 인증 코드입니다' },
        { status: 400 }
      );
    }

    // 인증 완료 처리
    await prisma.email_verifications.update({
      where: { id: verification.id },
      data: {
        verified: true,
        verifiedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: '이메일 인증이 완료되었습니다',
      verificationId: verification.id,
    });
  } catch (error) {
    console.error('Email verification error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: '이메일 인증에 실패했습니다' },
      { status: 500 }
    );
  }
}

// GET: 인증 상태 확인
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: '이메일이 필요합니다' },
        { status: 400 }
      );
    }

    // 최근 인증 정보 조회
    const verification = await prisma.email_verifications.findFirst({
      where: { 
        email,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!verification) {
      return NextResponse.json({
        verified: false,
        message: '인증 정보가 없습니다',
      });
    }

    const isExpired = new Date() > verification.expiresAt;

    return NextResponse.json({
      id: verification.id,
      email: verification.email,
      verified: verification.verified,
      verifiedAt: verification.verifiedAt,
      isExpired: !verification.verified && isExpired,
    });
  } catch (error) {
    console.error('Email verification status error:', error);
    return NextResponse.json(
      { error: '인증 상태 확인에 실패했습니다' },
      { status: 500 }
    );
  }
}