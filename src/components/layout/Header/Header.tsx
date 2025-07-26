"use client";

import React, { useState } from "react";
import { HeaderLogo } from "./HeaderLogo";
import { HeaderNavigation } from "./HeaderNavigation";
import { HeaderAuth } from "./HeaderAuth";
import { HeaderProfile } from "./HeaderProfile";
import { HeaderMobileMenu } from "./HeaderMobileMenu";
import { HeaderProps } from "./types";

export const Header: React.FC<HeaderProps> = ({
  isLoggedIn = false,
  user,
  navigationItems = [],
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
