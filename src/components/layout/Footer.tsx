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
                05029 서울특별시 광진구 능동로 120 건국대학교 1F
              </div>
              <div className="footer-contact-item">
                E-mail:{" "}
                <a href="mailto:seouledtech@konkuk.ac.kr">
                  seouledtech@konkuk.ac.kr
                </a>
              </div>
              <div className="footer-contact-item">
                Tel: <a href="tel:02-450-0697">02-450-0697~9</a>
              </div>
            </div>

            <div className="footer-copyright">
              Copyright © 2025 아이엠벳 All Right Reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
