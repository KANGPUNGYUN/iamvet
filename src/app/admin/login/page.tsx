"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InputBox } from "@/components/ui/Input/InputBox";
import { Button } from "@/components/ui/Button";
import { ArrowLeftIcon } from "public/icons";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // 임시 어드민 계정 검증 (실제 환경에서는 API 호출로 변경)
      if (email === "admin@iamvet.com" && password === "admin123!") {
        // 로그인 성공 시 세션/쿠키 설정 (실제 환경에서는 JWT 토큰 등 사용)
        localStorage.setItem("isAdminLoggedIn", "true");
        localStorage.setItem("adminEmail", email);
        
        alert("어드민 로그인이 완료되었습니다.");
        router.push("/admin");
      } else {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      }
    } catch (error) {
      setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <>
      <main className="min-h-screen pt-[50px] pb-[50px] px-[16px] bg-[#FBFBFB] flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-[20px] border border-[#EFEFF0] p-[40px]">
          {/* 헤더 */}
          <div className="flex flex-col mb-8 gap-[10px]">
            <Link href="/" className="mb-4">
              <ArrowLeftIcon currentColor="#000" />
            </Link>
            <h1 className="font-title text-[36px] title-light text-primary text-center">
              어드민 로그인
            </h1>
            <p className="text-center text-[16px] text-[#9098A4] mt-2">
              관리자 계정으로 로그인하세요
            </p>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-6 p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-lg">
              <p className="text-[14px] text-[#DC2626]">{error}</p>
            </div>
          )}

          {/* 로그인 폼 */}
          <div className="space-y-6">
            {/* 이메일 입력 */}
            <div>
              <label className="block text-[18px] font-medium text-[#3B394D] mb-3">
                이메일
              </label>
              <InputBox
                value={email}
                onChange={setEmail}
                placeholder="관리자 이메일을 입력하세요"
                type="email"
                clearable={false}
                onKeyPress={handleKeyPress}
              />
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label className="block text-[18px] font-medium text-[#3B394D] mb-3">
                비밀번호
              </label>
              <InputBox
                value={password}
                onChange={setPassword}
                placeholder="비밀번호를 입력하세요"
                type="password"
                clearable={false}
                onKeyPress={handleKeyPress}
              />
            </div>

            {/* 로그인 버튼 */}
            <Button
              variant="keycolor"
              onClick={handleLogin}
              fullWidth={true}
              className="mt-8 bg-[#4f5866] hover:bg-[#3b394d]"
              disabled={isLoading}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>

            {/* 임시 계정 안내 */}
            <div className="mt-6 p-4 bg-[#F8F9FA] rounded-lg">
              <h3 className="text-[14px] font-semibold text-[#3B394D] mb-2">
                임시 관리자 계정
              </h3>
              <p className="text-[12px] text-[#9098A4] mb-1">
                이메일: admin@iamvet.com
              </p>
              <p className="text-[12px] text-[#9098A4]">
                비밀번호: admin123!
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}