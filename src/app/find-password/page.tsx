"use client";

import { InputBox } from "@/components/ui/Input/InputBox";
import { Button } from "@/components/ui/Button";
import { ArrowLeftIcon } from "public/icons";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FindPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSendVerificationEmail = async () => {
    if (!email) {
      setError("이메일을 입력해주세요.");
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/find-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsEmailSent(true);
      } else {
        setError(result.message || "이메일 전송에 실패했습니다.");
      }
    } catch (error) {
      console.error("Find password error:", error);
      setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <main className="pt-[50px] pb-[224px] px-[16px] bg-white flex flex-col">
        <div className="flex-1 max-w-md mx-auto w-full">
          {/* 헤더 */}
          <div className="flex flex-col mb-8 gap-[10px]">
            <Link href="/member-select" className="mr-4">
              <ArrowLeftIcon currentColor="#000" />
            </Link>
            <h1 className="font-title text-[36px] title-light text-primary">
              비밀번호 찾기
            </h1>
          </div>

          {/* 이메일 전송 완료 메시지 */}
          <div className="text-center space-y-6">
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-6 rounded-md">
              <div className="text-[18px] font-medium mb-2">
                이메일을 전송했습니다!
              </div>
              <div className="text-[14px]">
                {email}로 비밀번호 재설정 링크를 보냈습니다.
                <br />
                이메일을 확인하여 비밀번호를 재설정해주세요.
              </div>
            </div>

            <div className="text-[14px] text-[#9098A4] space-y-2">
              <p>이메일이 오지 않나요?</p>
              <ul className="text-left space-y-1">
                <li>• 스팸함을 확인해주세요</li>
                <li>• 이메일 주소가 정확한지 확인해주세요</li>
                <li>• 잠시 후 다시 시도해주세요</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                variant="line"
                onClick={() => setIsEmailSent(false)}
                fullWidth={true}
              >
                다시 시도
              </Button>
              <Button
                variant="keycolor"
                onClick={() => router.push("/member-select")}
                fullWidth={true}
              >
                로그인으로 돌아가기
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-[50px] pb-[224px] px-[16px] bg-white flex flex-col">
      <div className="flex-1 max-w-md mx-auto w-full">
        {/* 헤더 */}
        <div className="flex flex-col mb-8 gap-[10px]">
          <Link href="/member-select" className="mr-4">
            <ArrowLeftIcon currentColor="#000" />
          </Link>
          <h1 className="font-title text-[36px] title-light text-primary">
            비밀번호 찾기
          </h1>
        </div>

        {/* 설명 텍스트 */}
        <div className="mb-8">
          <p className="text-[16px] text-[#4F5866] leading-6">
            가입 시 등록하신 이메일 주소를 입력해주세요.
            <br />
            비밀번호 재설정 링크를 보내드립니다.
          </p>
        </div>

        {/* 비밀번호 찾기 폼 */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendVerificationEmail();
          }}
          className="space-y-6"
        >
          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* 이메일 입력 */}
          <div>
            <label className="block text-[20px] text-medium text-[#3B394D] mb-3">
              이메일
            </label>
            <InputBox
              value={email}
              onChange={setEmail}
              placeholder="이메일을 입력해주세요"
              type="email"
              clearable={false}
            />
          </div>

          {/* 전송 버튼 */}
          <Button
            variant="keycolor"
            type="submit"
            fullWidth={true}
            className="mt-8"
            disabled={isLoading}
          >
            {isLoading ? "전송 중..." : "비밀번호 재설정 이메일 전송"}
          </Button>

          {/* 링크들 */}
          <div className="flex justify-center items-center text-[14px] mt-6">
            <Link href="/member-select" className="text-[#9098A4] underline">
              로그인으로 돌아가기
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}