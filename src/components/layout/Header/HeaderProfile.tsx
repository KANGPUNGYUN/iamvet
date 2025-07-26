import React from "react";
import { HeaderProfileProps } from "./types";

export const HeaderProfile: React.FC<HeaderProfileProps> = ({
  user,
  onProfileClick,
  onNotificationClick,
  onLogout,
  className = "",
}) => {
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

      {/* 프로필 영역 */}
      <div className="hidden lg:flex w-full items-center gap-2.5">
        {/* 프로필 대체 이미지 */}
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
            fontFamily: 'var(--font-title)',
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

        {/* 유저 이름 */}
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
          {user.name}
        </span>
      </div>
    </div>
  );
};
