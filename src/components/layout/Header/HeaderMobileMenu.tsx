import React, { useEffect } from "react";
import Link from "next/link";
import { HeaderMobileMenuProps } from "./types";

export const HeaderMobileMenu: React.FC<HeaderMobileMenuProps> = ({
  isOpen,
  onToggle,
  navigationItems = [],
  isLoggedIn = false,
  user,
  onLogin,
  onSignup,
  onLogout,
  onProfileClick,
  className = "",
}) => {
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

  const UserIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
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
              <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">메뉴</h2>
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
                      block px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200
                      ${
                        item.active
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* 로그인된 경우 추가 메뉴 */}
                {isLoggedIn && (
                  <>
                    <hr className="my-4" />
                    <button
                      onClick={() => {
                        onProfileClick?.();
                        onToggle();
                      }}
                      className="flex items-center w-full px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      <UserIcon />
                      <span className="ml-3">마이페이지</span>
                    </button>
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
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        onLogin?.();
                        onToggle();
                      }}
                      className="w-full px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                    >
                      로그인
                    </button>
                    <button
                      onClick={() => {
                        onSignup?.();
                        onToggle();
                      }}
                      className="w-full px-4 py-2 text-sm font-medium text-white bg-key1 rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                      회원가입
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
