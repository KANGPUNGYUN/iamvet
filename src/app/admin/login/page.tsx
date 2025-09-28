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
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // 로그인 성공 시 관리자 정보를 localStorage에 저장
        localStorage.setItem("isAdminLoggedIn", "true");
        localStorage.setItem("adminEmail", data.admin.email);
        localStorage.setItem("adminName", data.admin.name);
        localStorage.setItem("adminRole", data.admin.role);
        localStorage.setItem("admin-token", data.token); // 토큰도 저장

        router.push("/admin");
      } else {
        setError(data.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
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
          </div>
        </div>
      </main>
    </>
  );
}
