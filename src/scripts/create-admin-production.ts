import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// 프로덕션 데이터베이스 URL 사용
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_stzc9ESNIAf4@ep-fancy-cherry-a1179pkn-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    }
  }
});

function generateId(prefix?: string): string {
  const id = Math.random().toString(36).substring(2, 15);
  return prefix ? `${prefix}_${id}` : id;
}

async function createAdminUser() {
  try {
    // 기존 관리자 계정 확인
    const existingAdmin = await prisma.admin_users.findFirst({
      where: { email: "admin@iamvet.co.kr" }
    });

    if (existingAdmin) {
      console.log("프로덕션 관리자 계정이 이미 존재합니다.");
      return;
    }

    // 관리자 계정 생성
    const hashedPassword = await bcrypt.hash("admin123!@#", 12);
    
    const admin = await prisma.admin_users.create({
      data: {
        id: generateId("admin"),
        email: "admin@iamvet.co.kr",
        passwordHash: hashedPassword,
        name: "시스템 관리자",
        role: "SUPER_ADMIN",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log("프로덕션 관리자 계정이 생성되었습니다:");
    console.log("- 이메일: admin@iamvet.co.kr");
    console.log("- 비밀번호: admin123!@#");
    console.log("- 역할: SUPER_ADMIN");
    console.log("");
    console.log("⚠️  보안을 위해 첫 로그인 후 반드시 비밀번호를 변경해주세요!");

  } catch (error) {
    console.error("프로덕션 관리자 계정 생성 중 오류:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();