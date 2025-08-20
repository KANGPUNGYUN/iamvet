import React, { useState, useRef, useEffect } from "react";
import { HeaderProfileProps } from "./types";

export const HeaderProfile: React.FC<HeaderProfileProps> = ({
  user,
  onProfileClick,
  onNotificationClick,
  onLogout,
  className = "",
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMyPageClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleVeterinarianDashboard = () => {
    window.location.href = "/dashboard/veterinarian";
    setIsDropdownOpen(false);
  };

  const handleHospitalDashboard = () => {
    window.location.href = "/dashboard/hospital";
    setIsDropdownOpen(false);
  };

  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "20px",
      }}
    >
      {/* 알림 버튼 */}
      <button
        onClick={onNotificationClick}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "0",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
        >
          <path
            d="M13.73 21.5C13.5542 21.8031 13.3018 22.0547 12.9982 22.2295C12.6946 22.4044 12.3504 22.4965 12 22.4965C11.6496 22.4965 11.3054 22.4044 11.0018 22.2295C10.6982 22.0547 10.4458 21.8031 10.27 21.5M18 8.5C18 6.9087 17.3679 5.38258 16.2426 4.25736C15.1174 3.13214 13.5913 2.5 12 2.5C10.4087 2.5 8.88258 3.13214 7.75736 4.25736C6.63214 5.38258 6 6.9087 6 8.5C6 15.5 3 17.5 3 17.5H21C21 17.5 18 15.5 18 8.5Z"
            stroke="#3B394D"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* 마이페이지 드롭다운 */}
      <div className="hidden lg:flex relative" ref={dropdownRef}>
        <button
          onClick={handleMyPageClick}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0",
          }}
        >
          <span
            style={{
              color: "var(--Text, #3B394D)",
              fontFamily: "SUIT",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: "600",
              lineHeight: "135%",
            }}
          >
            마이페이지
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{
              transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease-in-out",
            }}
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="#3B394D"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* 드롭다운 메뉴 */}
        {isDropdownOpen && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: "0",
              marginTop: "8px",
              backgroundColor: "white",
              border: "1px solid #EFEFF0",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              zIndex: 50,
              minWidth: "160px",
            }}
          >
            <button
              onClick={handleVeterinarianDashboard}
              style={{
                display: "block",
                width: "100%",
                padding: "12px 16px",
                textAlign: "left",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "SUIT",
                fontSize: "14px",
                fontWeight: "500",
                color: "#3B394D",
                borderBottom: "1px solid #EFEFF0",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F8F9FA";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              수의사 마이페이지
            </button>
            <button
              onClick={handleHospitalDashboard}
              style={{
                display: "block",
                width: "100%",
                padding: "12px 16px",
                textAlign: "left",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "SUIT",
                fontSize: "14px",
                fontWeight: "500",
                color: "#3B394D",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F8F9FA";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              병원 마이페이지
            </button>
          </div>
        )}
      </div>

      {/* 프로필 아바타 */}
      <div className="hidden lg:flex items-center">
        <button
          onClick={onProfileClick}
          style={{
            display: "flex",
            width: "30px",
            height: "30px",
            padding: "10px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            flexShrink: 0,
            borderRadius: "27px",
            background: "var(--Keycolor1, #FF8796)",
            color: "var(--Keycolor5, #FFF7F7)",
            textAlign: "center",
            fontFamily: "var(--font-title)",
            fontSize: "15px",
            fontStyle: "normal",
            fontWeight: "400",
            lineHeight: "28px",
            border: "none",
            cursor: "pointer",
          }}
        >
          {user.name.charAt(0)}
        </button>
      </div>
    </div>
  );
};
