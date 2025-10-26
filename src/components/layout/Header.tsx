"use client";

import React, { useState } from "react";
import { HeaderLogo } from "./Header/HeaderLogo";
import { HeaderNavigation } from "./Header/HeaderNavigation";
import { HeaderAuth } from "./Header/HeaderAuth";
import { HeaderProfile } from "./Header/HeaderProfile";
import { HeaderMobileMenu } from "./Header/HeaderMobileMenu";
import { HeaderProps } from "./Header/types";

// 기본 설정값
const DEFAULT_NAVIGATION_ITEMS = [
  { label: "채용공고", href: "/jobs" },
  { label: "인재정보", href: "/resumes" },
  { label: "강의영상", href: "/lectures" },
  { label: "양도양수", href: "/transfers" },
  { label: "임상 포럼", href: "/forums" },
];

export const Header: React.FC<HeaderProps> = ({
  isLoggedIn = false,
  user,
  navigationItems = DEFAULT_NAVIGATION_ITEMS,
  logoHref = "/",
  onLogin,
  onSignup,
  onLogout,
  onProfileClick,
  onNotificationClick,
  className = "",
  children,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`bg-white border-b border-gray-200 ${className}`}>
      <div
        className="lg:px-[60px] px-[16px]"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "64px",
        }}
      >
        {/* 로고 */}
        <HeaderLogo href={logoHref} />

        {/* 네비게이션과 우측 영역을 묶는 컨테이너 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flex: 1,
            marginLeft: "60px",
          }}
        >
          {/* 데스크톱 네비게이션 (1024px 이상에서만 표시) */}
          <HeaderNavigation
            items={navigationItems}
            className="hidden lg:flex"
          />

          {/* 모바일에서는 빈 div로 공간 확보 */}
          <div className="lg:hidden"></div>

          {/* 우측 영역 */}
          <div className="flex items-center">
            {isLoggedIn && user ? (
              <>
                {/* 로그인된 상태 - 데스크톱에서만 HeaderProfile 표시 */}
                <HeaderProfile
                  user={user}
                  onProfileClick={onProfileClick}
                  onNotificationClick={onNotificationClick}
                  onLogout={onLogout}
                />

                {/* 모바일 메뉴 버튼 */}
                <HeaderMobileMenu
                  isOpen={isMobileMenuOpen}
                  onToggle={handleMobileMenuToggle}
                  navigationItems={navigationItems}
                  isLoggedIn={isLoggedIn}
                  user={user}
                  onLogout={onLogout}
                  onProfileClick={onProfileClick}
                  className="lg:hidden"
                />
              </>
            ) : (
              <>
                {/* 로그인되지 않은 상태 */}
                <HeaderAuth
                  onLogin={onLogin}
                  onSignup={onSignup}
                  className="hidden lg:flex"
                />

                {/* 모바일 메뉴 버튼 */}
                <HeaderMobileMenu
                  isOpen={isMobileMenuOpen}
                  onToggle={handleMobileMenuToggle}
                  navigationItems={navigationItems}
                  isLoggedIn={isLoggedIn}
                  onLogin={onLogin}
                  onSignup={onSignup}
                  className="lg:hidden"
                />
              </>
            )}
          </div>
        </div>
      </div>

      {children}
    </header>
  );
};
