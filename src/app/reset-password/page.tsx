"use client";

import { InputBox } from "@/components/ui/Input/InputBox";
import { Button } from "@/components/ui/Button";
import { ArrowLeftIcon } from "public/icons";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [isValidToken, setIsValidToken] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      verifyToken(tokenFromUrl);
    } else {
      setError("유효하지 않은 접근입니다.");
      setIsCheckingToken(false);
    }
  }, [searchParams]);

  const verifyToken = async (tokenToVerify: string) => {
    try {
      const response = await fetch("/api/auth/verify-reset-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: tokenToVerify }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsValidToken(true);
      } else {
        setError(result.message || "유효하지 않거나 만료된 링크입니다.");
      }
    } catch (error) {
      console.error("Token verification error:", error);
      setError("토큰 검증 중 오류가 발생했습니다.");
    } finally {
      setIsCheckingToken(false);
    }
  };

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "비밀번호는 최소 8자 이상이어야 합니다.";
    }
    if (!hasUpperCase || !hasLowerCase) {
      return "비밀번호는 대문자와 소문자를 포함해야 합니다.";
    }
    if (!hasNumbers) {
      return "비밀번호는 숫자를 포함해야 합니다.";
    }
    if (!hasSpecialChar) {
      return "비밀번호는 특수문자를 포함해야 합니다.";
    }
    return null;
  };

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    const passwordValidation = validatePassword(password);
    if (passwordValidation) {
      setError(passwordValidation);
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("비밀번호가 성공적으로 변경되었습니다.");
        router.push("/member-select");
      } else {
        setError(result.message || "비밀번호 재설정에 실패했습니다.");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingToken) {
    return (
      <main className="pt-[50px] pb-[224px] px-[16px] bg-white flex flex-col">
        <div className="flex-1 max-w-md mx-auto w-full">
          <div className="text-center py-8">
            <div className="text-[18px] text-[#4F5866]">
              링크를 확인하고 있습니다...
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!isValidToken) {
    return (
      <main className="pt-[50px] pb-[224px] px-[16px] bg-white flex flex-col">
        <div className="flex-1 max-w-md mx-auto w-full">
          {/* 헤더 */}
          <div className="flex flex-col mb-8 gap-[10px]">
            <Link href="/member-select" className="mr-4">
              <ArrowLeftIcon currentColor="#000" />
            </Link>
            <h1 className="font-title text-[36px] title-light text-primary">
              비밀번호 재설정
            </h1>
          </div>

          {/* 에러 메시지 */}
          <div className="text-center space-y-6">
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-6 rounded-md">
              <div className="text-[18px] font-medium mb-2">
                유효하지 않은 링크입니다
              </div>
              <div className="text-[14px]">
                {error || "링크가 만료되었거나 유효하지 않습니다."}
                <br />
                비밀번호 찾기를 다시 시도해주세요.
              </div>
            </div>

            <Button
              variant="keycolor"
              onClick={() => router.push("/find-password")}
              fullWidth={true}
            >
              비밀번호 찾기로 이동
            </Button>
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
            비밀번호 재설정
          </h1>
        </div>

        {/* 설명 텍스트 */}
        <div className="mb-8">
          <p className="text-[16px] text-[#4F5866] leading-6">
            새로운 비밀번호를 입력해주세요.
          </p>
        </div>

        {/* 비밀번호 재설정 폼 */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleResetPassword();
          }}
          className="space-y-6"
        >
          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* 새 비밀번호 입력 */}
          <div>
            <label className="block text-[20px] text-medium text-[#3B394D] mb-3">
              새 비밀번호
            </label>
            <InputBox
              value={password}
              onChange={setPassword}
              placeholder="새 비밀번호를 입력해주세요"
              type="password"
              clearable={false}
            />
            <div className="mt-2 text-[12px] text-[#9098A4] space-y-1">
              <p>• 8자 이상</p>
              <p>• 대문자, 소문자, 숫자, 특수문자 포함</p>
            </div>
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="block text-[20px] text-medium text-[#3B394D] mb-3">
              비밀번호 확인
            </label>
            <InputBox
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="비밀번호를 다시 입력해주세요"
              type="password"
              clearable={false}
            />
          </div>

          {/* 재설정 버튼 */}
          <Button
            variant="keycolor"
            type="submit"
            fullWidth={true}
            className="mt-8"
            disabled={isLoading}
          >
            {isLoading ? "변경 중..." : "비밀번호 변경"}
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