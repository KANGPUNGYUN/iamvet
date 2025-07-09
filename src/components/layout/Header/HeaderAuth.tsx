import React from "react";
import { HeaderAuthProps } from "./types";

export const HeaderAuth: React.FC<HeaderAuthProps> = ({
  onLogin,
  onSignup,
  className = "",
}) => {
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <a
        href="/login"
        style={{
          display: "flex",
          height: "36px",
          padding: "10px 18px",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          borderRadius: "4px",
          background: "var(--Subtext, #4F5866)",
          color: "#FFF",
          fontFamily: "SUIT",
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: "700",
          lineHeight: "135%",
          textDecoration: "none",
        }}
      >
        로그인/회원가입
      </a>
    </div>
  );
};
