"use client";

import { Footer, Header } from "@/components";
import Link from "next/link";
import Image from "next/image";
import hospitalImg from "@/assets/images/hospital.png";
import veterinarianImg from "@/assets/images/veterinarian.png";

export default function MemberSelectPage() {
  return (
    <>
      <Header
        isLoggedIn={false}
        navigationItems={[
          { label: "채용공고", href: "/" },
          { label: "인재정보", href: "/" },
          { label: "강의영상", href: "/" },
          { label: "양수양도", href: "/" },
          { label: "임상 포럼", href: "/" },
        ]}
        onLogin={() => console.log("로그인")}
        onSignup={() => console.log("회원가입")}
      />
      <main>
        <h2 className="font-title title-medium text-[32px] text-primary mt-[85px] flex justify-center">
          회원 유형 선택
        </h2>
        <div className="flex justify-center items-center gap-[20px] mt-[40px] mb-[136px] md:flex-row flex-col md:gap-[20px] gap-[16px] md:px-0 px-[16px]">
          <Link
            href="/login/veterinarian"
            className="md:w-[348px] md:h-[380px] w-full max-w-[343px] h-[72px] border-[1px] border-solid border-[#cacad2] rounded-[16px] md:pt-[40px] md:px-[74px] md:pb-[23px] p-[16px] flex md:flex-col flex-row md:items-center items-center md:justify-between justify-between hover:border-keycolor1 hover:shadow-[0px_0px_12px_0px_rgba(255,135,150,0.25)] transition-all group"
          >
            <h3 className="md:w-[172px] w-auto font-title title-light md:text-[28px] text-[18px] text-subtext2 text-center font-normal group-hover:text-primary md:group-hover:border-b-[3px] md:group-hover:border-b-keycolor1 transition-all md:pb-1 pb-0">
              수의사 회원
            </h3>
            <Image
              src={veterinarianImg}
              alt="수의사 회원"
              width={200}
              height={200}
              className="object-contain md:w-[200px] md:h-[200px] w-[77px] h-[77px]"
            />
          </Link>
          <Link
            href="/login/hospital"
            className="md:w-[348px] md:h-[380px] max-w-[343px] w-full h-[72px] border-[1px] border-solid border-[#cacad2] rounded-[16px] md:pt-[40px] md:px-[74px] md:pb-[23px] p-[16px] flex md:flex-col flex-row md:items-center items-center md:justify-between justify-between hover:border-keycolor1 hover:shadow-[0px_0px_12px_0px_rgba(255,135,150,0.25)] transition-all group"
          >
            <h3 className="md:w-[172px] w-auto font-title title-light md:text-[28px] text-[18px] text-subtext2 text-center font-normal group-hover:text-primary md:group-hover:border-b-[3px] md:group-hover:border-b-keycolor1 transition-all md:pb-1 pb-0">
              병원 회원
            </h3>
            <Image
              src={hospitalImg}
              alt="병원 회원"
              width={200}
              height={200}
              className="object-contain md:w-[200px] md:h-[200px] w-[77px] h-[77px]"
            />
          </Link>
        </div>
      </main>
      <Footer className="main-footer">
        <Footer.Logo
          src="/images/Logo.png"
          mobileSrc="/images/LogoBlack.png"
        ></Footer.Logo>

        <Footer.ContentWrap>
          <Footer.Nav>
            <Footer.NavItem href="/privarcy">개인정보처리방침</Footer.NavItem>
            <Footer.NavItem href="/terms">이용약관</Footer.NavItem>
            <Footer.NavItem href="/sitemap">오시는길</Footer.NavItem>
          </Footer.Nav>
          <Footer.Address>
            <Footer.Contact>
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
            </Footer.Contact>

            <Footer.Copyright>
              Copyright © 2025 아이엠벳 All Right Reserved.
            </Footer.Copyright>
          </Footer.Address>
        </Footer.ContentWrap>
      </Footer>
    </>
  );
}
