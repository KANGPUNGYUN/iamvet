"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { User } from "./Header/types";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  // 관리자 페이지인지 확인
  const isAdminPage = pathname.startsWith("/admin");

  // 관리자 페이지는 헤더/푸터 없이 렌더링
  if (isAdminPage) {
    return <>{children}</>;
  }

  // 테스트용 로그인 상태 및 사용자 데이터
  const isLoggedIn = true; // 테스트를 위해 true로 설정

  // 경로에 따라 테스트용 사용자 타입 결정
  const getTestUser = (): User => {
    if (pathname.startsWith("/dashboard/hospital")) {
      return {
        id: "hospital_1",
        name: "서울동물병원",
        email: "hospital@test.com",
        type: "hospital",
      };
    } else {
      return {
        id: "vet_1",
        name: "김수의사",
        email: "vet@test.com",
        type: "veterinarian",
      };
    }
  };

  const testUser = getTestUser();

  // 테스트용 네비게이션 아이템
  const navigationItems = [
    { label: "채용공고", href: "/jobs", active: pathname === "/jobs" },
    { label: "인재정보", href: "/resumes", active: pathname === "/resumes" },
    { label: "강의영상", href: "/lectures", active: pathname === "/lectures" },
    {
      label: "양수양도",
      href: "/transfers",
      active: pathname === "/transfers",
    },
    { label: "임상포럼", href: "/forums", active: pathname === "/forums" },
  ];

  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        user={testUser}
        navigationItems={navigationItems}
        onLogin={() => console.log("로그인 클릭")}
        onSignup={() => console.log("회원가입 클릭")}
        onLogout={() => console.log("로그아웃 클릭")}
        onProfileClick={() => console.log("프로필 클릭")}
      />
      {children}
      <Footer />
    </>
  );
};
