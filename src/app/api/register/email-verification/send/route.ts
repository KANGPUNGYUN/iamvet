import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { sendVerificationEmail, generateVerificationCode } from "@/lib/email";
import { validateStudentEmail } from "@/lib/emailValidation";

// 메모리 기반 중복 전송 방지 (서버 재시작 시 초기화됨)
const emailSendingMap = new Map<string, number>();

const sendVerificationSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력해주세요"),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = sendVerificationSchema.parse(body);

    // 중복 전송 방지 체크 (3초 이내 중복 요청 차단)
    const now = Date.now();
    const lastSentTime = emailSendingMap.get(email) || 0;
    if (now - lastSentTime < 3000) {
      return NextResponse.json(
        { error: "잠시 후 다시 시도해주세요" },
        { status: 429 }
      );
    }

    // 전송 시간 기록
    emailSendingMap.set(email, now);

    // 오래된 기록 정리 (10분 이상 된 기록 삭제)
    emailSendingMap.forEach((value, key) => {
      if (now - value > 10 * 60 * 1000) {
        emailSendingMap.delete(key);
      }
    });

    // 수의학과 학생 이메일 검증
    const isValidEmail = validateStudentEmail(email);

    if (!isValidEmail) {
      return NextResponse.json(
        {
          error: "수의학과 학생은 대학 이메일(.ac.kr)만 사용 가능합니다",
        },
        { status: 400 }
      );
    }

    // 이미 등록된 이메일인지 확인
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "이미 사용 중인 이메일입니다" },
        { status: 400 }
      );
    }

    // 기존 인증 코드가 있는지 확인 (회원가입 전이므로 이메일로만 검색)
    const existingVerification = await prisma.email_verifications.findFirst({
      where: {
        email,
        verified: false,
        expiresAt: { gt: new Date() },
        userId: null, // 회원가입 전이므로 userId는 null
      },
      orderBy: { createdAt: "desc" },
    });

    let verificationCode: string;
    let verificationId: string;

    if (existingVerification) {
      // 기존 인증 코드가 있고 아직 유효하면 재사용
      verificationCode = existingVerification.verificationCode;
      verificationId = existingVerification.id;
    } else {
      // 새로운 인증 코드 생성
      verificationCode = generateVerificationCode();
      verificationId = nanoid();

      // 이전 인증 요청들은 모두 만료 처리
      await prisma.email_verifications.updateMany({
        where: {
          email,
          verified: false,
          userId: null,
        },
        data: {
          expiresAt: new Date(),
        },
      });

      // 새로운 인증 요청 저장 (회원가입용이므로 userId 없이)
      await prisma.email_verifications.create({
        data: {
          id: verificationId,
          userId: null, // 회원가입 전이므로 null
          email,
          verificationCode,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10분 후 만료
          updatedAt: new Date(),
        },
      });
    }

    // 이메일 전송 (중복 방지를 위해 try-catch로 감싸기)
    try {
      console.log("이메일 전송 시작:", { to: email, code: verificationCode });
      await sendVerificationEmail(email, verificationCode, name);
      console.log("이메일 전송 완료:", email);
    } catch (emailError) {
      console.error("이메일 전송 실패:", emailError);
      // 이메일 전송 실패해도 인증 코드는 저장되어 있으므로 성공으로 처리
    }

    return NextResponse.json({
      success: true,
      message: "인증 코드가 이메일로 전송되었습니다",
      verificationId,
    });
  } catch (error) {
    console.error("Email verification error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "이메일 전송에 실패했습니다" },
      { status: 500 }
    );
  }
}
