"use client";

import { Footer, Header } from "@/components";
import { InputBox } from "@/components/ui/Input/InputBox";
import { Button } from "@/components/ui/Button";
import { SocialLoginButton } from "@/components/ui/SocialLoginButton";
import { ArrowLeftIcon } from "public/icons";
import Link from "next/link";
import { useState } from "react";

export default function VeterinarianLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("로그인 시도:", { email, password });
  };

  const handleSocialLogin = (type: string) => {
    console.log(`${type} 로그인 시도`);
  };

  return (
    <>
      <Header isLoggedIn={false} />

      <main className="pt-[50px] pb-[224px] px-[16px] bg-white flex flex-col">
        <div className="flex-1 max-w-md mx-auto w-full">
          {/* 헤더 */}
          <div className="flex flex-col mb-8 gap-[10px]">
            <Link href="/member-select" className="mr-4">
              <ArrowLeftIcon currentColor="#000" />
            </Link>
            <h1 className="font-title text-[28px] titie-light text-[#3B394D]">
              수의사 로그인
            </h1>
          </div>

          {/* 로그인 폼 */}
          <div className="space-y-6">
            {/* 아이디 입력 */}
            <div>
              <label className="block text-[20px] text-medium text-[#3B394D] mb-3">
                아이디
              </label>
              <InputBox
                value={email}
                onChange={setEmail}
                placeholder="아이디를 입력해주세요"
                type="email"
                clearable={false}
              />
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label className="block text-[20px] text-medium text-[#3B394D] mb-3">
                비밀번호
              </label>
              <InputBox
                value={password}
                onChange={setPassword}
                placeholder="비밀번호를 입력해주세요"
                type="password"
                clearable={false}
              />
            </div>

            {/* 로그인 버튼 */}
            <Button
              variant="keycolor"
              onClick={handleLogin}
              fullWidth={true}
              className="mt-8"
            >
              로그인
            </Button>

            {/* 링크들 */}
            <div className="flex justify-between items-center text-[14px] mt-4">
              <Link href="/find-password" className="text-[#9098A4] underline">
                비밀번호 찾기
              </Link>
              <Link
                href="/register/veterinarian"
                className="text-[#FF8796] underline"
              >
                회원가입
              </Link>
            </div>

            {/* 구분선 */}
            <div className="flex items-center mt-[50px]">
              <div className="flex-1 h-px bg-[#E5E5E5]"></div>
              <span className="px-4 text-[14px] text-[#9098A4]">
                소셜 계정으로 간편 로그인
              </span>
              <div className="flex-1 h-px bg-[#E5E5E5]"></div>
            </div>

            {/* SNS 로그인 버튼들 */}
            <div className="flex flex-col md:grid md:grid-cols-3 gap-3">
              <SocialLoginButton
                type="naver"
                onClick={() => handleSocialLogin("네이버")}
              />
              <SocialLoginButton
                type="kakao"
                onClick={() => handleSocialLogin("카카오")}
              />
              <SocialLoginButton
                type="google"
                onClick={() => handleSocialLogin("구글")}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
