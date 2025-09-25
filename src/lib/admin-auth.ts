import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET + "_admin";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "SUPER_ADMIN" | "ADMIN" | "MODERATOR";
}

export async function authenticateAdmin(req: NextRequest): Promise<AdminUser | null> {
  try {
    const token = req.cookies.get("admin-token")?.value;

    if (!token) {
      return null;
    }

    // JWT 토큰 검증
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET!) as any;

    // DB에서 관리자 정보 재확인 (토큰이 유효하더라도 계정이 비활성화될 수 있음)
    const admin = await prisma.admin_users.findUnique({
      where: { 
        id: decoded.adminId,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    if (!admin || !admin.isActive) {
      return null;
    }

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role as "SUPER_ADMIN" | "ADMIN" | "MODERATOR",
    };
  } catch (error) {
    console.error("Admin authentication error:", error);
    return null;
  }
}

export function requireAdmin(minRole: "SUPER_ADMIN" | "ADMIN" | "MODERATOR" = "ADMIN") {
  const roleHierarchy = {
    MODERATOR: 1,
    ADMIN: 2,
    SUPER_ADMIN: 3,
  };

  return (admin: AdminUser): boolean => {
    return roleHierarchy[admin.role] >= roleHierarchy[minRole];
  };
}