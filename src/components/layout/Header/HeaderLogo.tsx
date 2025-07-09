import React from "react";
import Link from "next/link";
import { HeaderLogoProps } from "./types";

export const HeaderLogo: React.FC<HeaderLogoProps> = ({
  href = "/",
  onClick,
  className = "",
  children,
}) => {
  const LogoContent = () => (
    <div className={`flex items-center ${className}`}>
      {children || (
        <div className="text-xl font-bold text-gray-900">
          <img
            className="w-[185px] h-[52px]"
            src="/images/Logo.png"
            alt="아이엠벳 메인 로고"
          />
        </div>
      )}
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="focus:outline-none">
        <LogoContent />
      </button>
    );
  }

  return (
    <Link href={href} className="focus:outline-none">
      <LogoContent />
    </Link>
  );
};
