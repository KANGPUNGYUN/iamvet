"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import "./Footer/Footer.css";

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  return (
    <footer className={`footer ${className}`}>
      <div className="footer-container">
        {/* 로고 */}
        <div className="footer-logo">
          <Image
            src="/images/Logo.png"
            alt="아이엠벳 로고"
            width={185}
            height={52}
            className="logo-desktop"
          />
          <Image
            src="/images/LogoBlack.png"
            alt="아이엠벳 로고"
            width={185}
            height={52}
            className="logo-mobile"
          />
        </div>

        {/* 푸터 콘텐츠 */}
        <div className="footer-contentwrap">
          {/* 네비게이션 */}
          <nav className="footer-nav">
            <Link href="/privacy" className="footer-nav-item">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="footer-nav-item">
              이용약관
            </Link>
            <Link href="/marketing" className="footer-nav-item">
              마케팅정보수신
            </Link>
            <Link href="/sitemap" className="footer-nav-item">
              오시는길
            </Link>
          </nav>

          {/* 주소 정보 */}
          <div className="footer-address">
            <div className="footer-contact">
              <div className="footer-contact-item">
                법인단체명: 주식회사 아이엠벳
              </div>
              <div className="footer-contact-item">
                주소: 서울특별시 서초구 서초대로77길 39, 9층 102호
              </div>
              <div className="footer-contact-item">
                이메일: <a href="mailto:iamvet25@gmail.com">iamvet25@gmail.com</a>
              </div>
              <div className="footer-contact-item">
                연락처: <a href="tel:01042031721">010-4203-1721</a>
              </div>
              <div className="footer-contact-item">
                사업자등록번호: 507-81-17466
              </div>
              <div className="footer-contact-item">
                대표자명: 김국현
              </div>
            </div>

            <div className="footer-copyright">
              Copyright © 2025 주식회사 아이엠벳 All Right Reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
