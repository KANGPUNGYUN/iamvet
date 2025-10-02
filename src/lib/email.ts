import nodemailer from "nodemailer";
import { generateEmailTemplate } from "./emailTemplate";

// Gmail SMTP를 사용한 무료 이메일 전송 설정
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Gmail 이메일 주소
    pass: process.env.EMAIL_APP_PASSWORD, // Gmail 앱 비밀번호
  },
});

// 이메일 인증 코드 생성 (6자리 숫자)
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 이메일 인증 메일 전송
export async function sendVerificationEmail(
  to: string,
  verificationCode: string,
  userName?: string
): Promise<void> {
  const subject = "[아이엠벳] 이메일 인증 코드";
  const html = generateEmailTemplate({
    title: "이메일 인증",
    preheader: "아이엠벳 이메일 인증을 완료해주세요",
    content: `
      <h2 style="color: #333333; margin-bottom: 20px;">안녕하세요${
        userName ? `, ${userName}님` : ""
      }!</h2>
      <p style="color: #666666; margin-bottom: 30px;">
        아이엠벳 서비스를 이용해 주셔서 감사합니다.<br>
        아래의 인증 코드를 입력하여 이메일 인증을 완료해 주세요.
      </p>
      <div style="background-color: #f8f9fa; border: 2px solid #ff8796; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
        <p style="margin: 0; font-size: 14px; color: #666666;">인증 코드</p>
        <h1 style="margin: 10px 0; font-size: 36px; color: #ff8796; letter-spacing: 5px;">${verificationCode}</h1>
        <p style="margin: 0; font-size: 12px; color: #999999;">10분 이내에 입력해 주세요</p>
      </div>
      <p style="color: #999999; font-size: 14px; margin-top: 30px;">
        본인이 요청한 것이 아니라면 이 이메일을 무시하셔도 됩니다.<br>
        인증 코드는 10분간 유효합니다.
      </p>
    `,
    buttonText: "아이엠벳 바로가기",
    buttonUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://www.iam-vet.com",
  });

  await transporter.sendMail({
    from: `"아이엠벳" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

// 회원가입 완료 이메일 전송
export async function sendWelcomeEmail(
  to: string,
  userName: string,
  userType: string
): Promise<void> {
  const userTypeText =
    {
      VETERINARIAN: "수의사",
      HOSPITAL: "동물병원",
      VETERINARY_STUDENT: "수의학과 학생",
    }[userType] || "회원";

  const subject = "[아이엠벳] 회원가입을 환영합니다!";
  const html = generateEmailTemplate({
    title: "회원가입 완료",
    preheader: "아이엠벳 회원가입을 축하드립니다",
    content: `
      <h2 style="color: #333333; margin-bottom: 20px;">${userName}님, 환영합니다! 🎉</h2>
      <p style="color: #666666; margin-bottom: 30px;">
        아이엠벳 ${userTypeText} 회원가입이 완료되었습니다.<br>
        이제 아이엠벳의 다양한 서비스를 이용하실 수 있습니다.
      </p>
      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 30px 0;">
        <h3 style="color: #333333; margin-bottom: 15px;">아이엠벳에서 제공하는 서비스</h3>
        <ul style="color: #666666; padding-left: 20px;">
          <li style="margin-bottom: 10px;">전국 동물병원 정보 검색</li>
          <li style="margin-bottom: 10px;">실시간 병원 예약 서비스</li>
          <li style="margin-bottom: 10px;">수의사 커뮤니티</li>
          <li style="margin-bottom: 10px;">반려동물 건강 정보</li>
        </ul>
      </div>
      <p style="color: #666666;">
        궁금한 점이 있으시면 언제든지 고객센터로 문의해 주세요.<br>
        감사합니다.
      </p>
    `,
    buttonText: "서비스 이용하기",
    buttonUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://www.iam-vet.com",
  });

  await transporter.sendMail({
    from: `"아이엠벳" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

// 비밀번호 재설정 이메일 전송
export async function sendPasswordResetEmail(
  to: string,
  resetToken: string,
  userName?: string
): Promise<void> {
  const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password?token=${resetToken}`;

  const subject = "[아이엠벳] 비밀번호 재설정 안내";
  const html = generateEmailTemplate({
    title: "비밀번호 재설정",
    preheader: "비밀번호를 재설정하세요",
    content: `
      <h2 style="color: #333333; margin-bottom: 20px;">비밀번호 재설정</h2>
      <p style="color: #666666; margin-bottom: 30px;">
        ${
          userName ? `${userName}님, ` : ""
        }비밀번호 재설정을 요청하셨습니다.<br>
        아래 버튼을 클릭하여 새로운 비밀번호를 설정해 주세요.
      </p>
      <p style="color: #999999; font-size: 14px;">
        본인이 요청한 것이 아니라면 이 이메일을 무시하셔도 됩니다.<br>
        이 링크는 1시간 동안 유효합니다.
      </p>
    `,
    buttonText: "비밀번호 재설정하기",
    buttonUrl: resetUrl,
  });

  await transporter.sendMail({
    from: `"아이엠벳" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}
