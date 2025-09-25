import { NextRequest, NextResponse } from 'next/server';
import { createApiResponse, createErrorResponse } from '@/lib/utils';
import { withAuth } from '@/lib/middleware';
import { prisma } from '@/lib/prisma';

export const POST = withAuth(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const user = (request as any).user;
    const resolvedParams = await params;
    const resumeId = resolvedParams.id;

    const resume = await (prisma as any).detailedResume.findUnique({
      where: { id: resumeId }
    });

    if (!resume) {
      return NextResponse.json(createErrorResponse('이력서를 찾을 수 없습니다.'), { status: 404 });
    }

    const existingLike = await (prisma as any).resume_likes.findUnique({
      where: {
        userId_resumeId: {
          userId: user.userId,
          resumeId: resumeId
        }
      }
    });

    if (existingLike) {
      return NextResponse.json(createErrorResponse('이미 좋아요한 이력서입니다.'), { status: 400 });
    }

    await (prisma as any).resume_likes.create({
      data: {
        userId: user.userId,
        resumeId: resumeId
      }
    });

    return NextResponse.json(createApiResponse('success', '좋아요가 추가되었습니다.'), { status: 201 });
  } catch (error) {
    console.error('Resume like error:', error);
    return NextResponse.json(createErrorResponse('좋아요 처리 중 오류가 발생했습니다.'), { status: 500 });
  }
});

export const DELETE = withAuth(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const user = (request as any).user;
    const resolvedParams = await params;
    const resumeId = resolvedParams.id;

    const existingLike = await (prisma as any).resume_likes.findUnique({
      where: {
        userId_resumeId: {
          userId: user.userId,
          resumeId: resumeId
        }
      }
    });

    if (!existingLike) {
      return NextResponse.json(createErrorResponse('좋아요하지 않은 이력서입니다.'), { status: 400 });
    }

    await (prisma as any).resume_likes.delete({
      where: {
        userId_resumeId: {
          userId: user.userId,
          resumeId: resumeId
        }
      }
    });

    return NextResponse.json(createApiResponse('success', '좋아요가 취소되었습니다.'));
  } catch (error) {
    console.error('Resume unlike error:', error);
    return NextResponse.json(createErrorResponse('좋아요 취소 중 오류가 발생했습니다.'), { status: 500 });
  }
});