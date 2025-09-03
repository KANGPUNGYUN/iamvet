import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeaderMobileMenuProps, DashboardMenuItem } from "./types";
import {
  HomeIcon,
  UserPlusIcon,
  ListIcon,
  BellOutlineIcon,
  UsersIcon,
  HeartMenuIcon,
  SettingsIcon,
} from "public/icons";

export const HeaderMobileMenu: React.FC<HeaderMobileMenuProps> = ({
  isOpen,
  onToggle,
  navigationItems = [],
  isLoggedIn = false,
  user,
  userType,
  onLogin,
  onSignup,
  onLogout,
  onProfileClick,
  className = "",
}) => {
  const pathname = usePathname();

  // active 상태 확인 함수 (Sidebar와 동일한 로직)
  const isActive = (href: string, userType: "veterinarian" | "hospital") => {
    if (href === `/dashboard/${userType}`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // 사용자 타입에 따른 마이페이지 메뉴 데이터
  const getDashboardMenuItems = (
    type: "veterinarian" | "hospital"
  ): DashboardMenuItem[] => {
    if (type === "veterinarian") {
      return [
        {
          id: "dashboard",
          label: "대시보드 홈",
          icon: HomeIcon,
          href: "/dashboard/veterinarian",
        },
        {
          id: "resume",
          label: "나의 이력서",
          icon: UserPlusIcon,
          href: "/dashboard/veterinarian/resume",
        },
        {
          id: "bookmarks",
          label: "찜한 공고 목록",
          icon: HeartMenuIcon,
          href: "/dashboard/veterinarian/bookmarks",
        },
        {
          id: "applications",
          label: "지원 내역 관리",
          icon: ListIcon,
          href: "/dashboard/veterinarian/applications",
        },
        {
          id: "messages",
          label: "알림/메시지 관리",
          icon: BellOutlineIcon,
          href: "/dashboard/veterinarian/messages",
        },
        {
          id: "profile",
          label: "프로필 설정",
          icon: SettingsIcon,
          href: "/dashboard/veterinarian/profile",
        },
      ];
    } else {
      return [
        {
          id: "dashboard",
          label: "대시보드 홈",
          icon: HomeIcon,
          href: "/dashboard/hospital",
        },
        {
          id: "transfer-bookmarks",
          label: "양수양도 찜 목록",
          icon: HeartMenuIcon,
          href: "/dashboard/hospital/transfer-bookmarks",
        },
        {
          id: "my-jobs",
          label: "올린 공고 관리",
          icon: ListIcon,
          href: "/dashboard/hospital/my-jobs",
        },
        {
          id: "favorite-talents",
          label: "관심 인재 목록",
          icon: UsersIcon,
          href: "/dashboard/hospital/favorite-talents",
        },
        {
          id: "messages",
          label: "알림/메시지 관리",
          icon: BellOutlineIcon,
          href: "/dashboard/hospital/messages",
          badge: 3,
        },
        {
          id: "profile",
          label: "프로필 설정",
          icon: SettingsIcon,
          href: "/dashboard/hospital/profile",
        },
      ];
    }
  };

  // userType이 undefined일 때 user.type을 직접 사용
  const actualUserType = userType || user?.type;
  const dashboardItems = actualUserType
    ? getDashboardMenuItems(actualUserType)
    : [];

  // 메뉴가 열렸을 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      // 스크롤 위치 복원
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  const MenuIcon = () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );

  const CloseIcon = () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );

  return (
    <>
      {/* 모바일 메뉴 토글 버튼 */}
      <button
        onClick={onToggle}
        className={`p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 ${className}`}
        aria-label="메뉴"
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* 모바일 메뉴 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50"
          style={{
            height: "100dvh", // 동적 뷰포트 높이 지원
            width: "100vw",
            overflow: "hidden", // 외부 스크롤 방지
          }}
        >
          {/* 배경 오버레이 */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-200"
            onClick={onToggle}
            style={{
              height: "100dvh",
              width: "100vw",
            }}
          />

          {/* 메뉴 패널 */}
          <div
            className="absolute right-0 top-0 w-80 max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-out"
            style={{
              height: "100dvh",
              maxHeight: "100dvh",
              transform: isOpen ? "translateX(0)" : "translateX(100%)",
              willChange: "transform",
            }}
          >
            <div className="flex flex-col h-full">
              {/* 헤더 - 고정 영역 */}
              <div className="flex-shrink-0 flex items-center justify-end p-4">
                <button
                  onClick={onToggle}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* 네비게이션 메뉴 - 스크롤 가능 영역 */}
              <nav
                className="flex-1 px-4 py-6 space-y-2"
                style={{
                  overflowY: "auto",
                  overflowX: "hidden",
                  WebkitOverflowScrolling: "touch", // iOS 부드러운 스크롤
                  scrollbarWidth: "thin", // Firefox 스크롤바
                  msOverflowStyle: "scrollbar", // IE/Edge 스크롤바
                }}
              >
                {navigationItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={onToggle}
                    className={`
                      block px-4 py-3 font-title text-base font-medium rounded-lg transition-colors duration-200 
                      ${
                        item.active
                          ? "text-[#FF8796] bg-[#FFF7F7]"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* 로그인된 경우 마이페이지 섹션 */}
                {isLoggedIn && actualUserType && (
                  <>
                    <h3 className="text-gray-700 block px-4 py-3 font-title text-base font-medium rounded-lg transition-colors duration-200">
                      마이페이지
                    </h3>

                    {/* 사용자 계정 유형에 따른 마이페이지만 표시 */}
                    <div className="pl-4 space-y-1">
                      {dashboardItems.map((item) => {
                        const IconComponent = item.icon;
                        const active = isActive(item.href, actualUserType);

                        return (
                          <Link
                            key={item.id}
                            href={item.href}
                            onClick={onToggle}
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 relative ${
                              active
                                ? "text-[#FF8796] bg-[#FFF7F7]"
                                : "text-[#4F5866] hover:text-gray-900 hover:bg-gray-100"
                            }`}
                          >
                            <IconComponent
                              currentColor={active ? "#FF8796" : "#4F5866"}
                            />
                            <span className="ml-3">{item.label}</span>
                            {item.badge && item.badge > 0 && (
                              <span className="ml-auto bg-[#FF8796] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* 추가 여백을 위한 패딩 */}
                <div className="h-4"></div>
              </nav>

              {/* 하단 액션 버튼 - 고정 영역 */}
              <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      onLogout?.();
                      onToggle();
                    }}
                    className="w-full px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                  >
                    로그아웃
                  </button>
                ) : (
                  <Link href="/member-select" onClick={onToggle}>
                    <button className="font-title title-light w-full px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
                      로그인/회원가입
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
