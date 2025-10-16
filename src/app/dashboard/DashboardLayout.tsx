"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/ui/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 경로를 기반으로 사용자 타입 결정
  const userType = pathname.startsWith("/dashboard/hospital")
    ? "hospital"
    : "veterinarian";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userType={userType} />
      <main className="flex-1 overflow-auto lg:ml-0">{children}</main>
    </div>
  );
}
