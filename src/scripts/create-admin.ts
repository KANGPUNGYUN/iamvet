import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/auth";
import { generateId } from "../lib/utils/id";

async function createAdminUser() {
  try {
    // 기존 관리자 계정 확인
    const existingAdmin = await prisma.admin_users.findFirst({
      where: { email: "admin@iamvet.co.kr" }
    });

    if (existingAdmin) {
      console.log("관리자 계정이 이미 존재합니다.");
      return;
    }

    // 관리자 계정 생성
    const hashedPassword = await hashPassword("admin123!@#");
    
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

    console.log("관리자 계정이 생성되었습니다:");
    console.log("- 이메일: admin@iamvet.co.kr");
    console.log("- 비밀번호: admin123!@#");
    console.log("- 역할: SUPER_ADMIN");
    console.log("");
    console.log("⚠️  보안을 위해 첫 로그인 후 반드시 비밀번호를 변경해주세요!");

  } catch (error) {
    console.error("관리자 계정 생성 중 오류:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();