"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

interface EmailVerificationModalProps {
  email: string;
  name?: string;
  onVerified: () => void;
  onClose: () => void;
  autoSend?: boolean; // 모달 열릴 때 자동으로 이메일 전송 여부
}

export default function EmailVerificationModal({
  email,
  name,
  onVerified,
  onClose,
  autoSend = false,
}: EmailVerificationModalProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [timer, setTimer] = useState(600); // 10분 = 600초
  const [lastSentTime, setLastSentTime] = useState(0); // 마지막 전송 시간
  const [isFirstRender, setIsFirstRender] = useState(true); // 첫 렌더링 체크
  const mountedRef = useRef(false); // 컴포넌트 마운트 상태 추적

  // 타이머 효과
  useEffect(() => {
    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [timer]);

  // 중복 전송 방지 함수
  const canSendEmail = () => {
    const now = Date.now();
    return now - lastSentTime > 3000; // 3초 이내 중복 전송 방지
  };

  // 인증 코드 전송
  const sendVerificationMutation = useMutation({
    mutationFn: async () => {
      console.log("이메일 전송 시작:", { email, name });
      const response = await axios.post(
        "/api/register/email-verification/send",
        {
          email,
          name,
        }
      );
      console.log("이메일 전송 응답:", response.data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("이메일 전송 성공:", data);
      setTimer(600); // 타이머 리셋
      setLastSentTime(Date.now());
      alert("인증 코드가 이메일로 전송되었습니다");
    },
    onError: (error: any) => {
      console.error("이메일 전송 오류:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "이메일 전송에 실패했습니다";
      alert(errorMessage);
    },
  });

  // 인증 상태 확인
  const { data: verificationStatus } = useQuery({
    queryKey: ["emailVerificationStatus", email],
    queryFn: async () => {
      const response = await axios.get(
        `/api/register/email-verification/verify?email=${encodeURIComponent(
          email
        )}`
      );
      return response.data;
    },
    refetchInterval: 5000, // 5초마다 상태 확인
  });

  // 인증 코드 확인
  const verifyMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        "/api/register/email-verification/verify",
        {
          email,
          verificationCode,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      alert("이메일 인증이 완료되었습니다");
      onVerified();
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || "인증에 실패했습니다";
      alert(errorMessage);
    },
  });

  // 컴포넌트 마운트 추적
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;

      // autoSend가 true이고 첫 마운트일 때만 자동 전송
      if (autoSend && email && isFirstRender) {
        console.log("자동 이메일 전송 시작 (첫 마운트)");
        // 약간의 지연을 두어 React Strict Mode 중복 실행 방지
        const timeoutId = setTimeout(() => {
          if (
            mountedRef.current &&
            !sendVerificationMutation.isPending &&
            canSendEmail()
          ) {
            sendVerificationMutation.mutate();
          }
        }, 100);

        setIsFirstRender(false);

        return () => {
          clearTimeout(timeoutId);
        };
      }
    }
  }, [autoSend, email]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // 이미 인증된 경우 자동으로 성공 처리
  useEffect(() => {
    if (verificationStatus?.verified) {
      onVerified();
    }
  }, [verificationStatus?.verified]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleVerificationCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setVerificationCode(value);
  };

  const isExpired = timer === 0 || verificationStatus?.isExpired;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          대학교 이메일 인증
        </h2>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              인증 코드를 전송한 이메일
            </p>
            <p className="text-lg font-medium text-gray-900">{email}</p>
          </div>

          {verificationStatus?.verified ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-center font-medium">
                이메일 인증이 완료되었습니다 ✓
              </p>
            </div>
          ) : (
            <>
              <div>
                <label
                  htmlFor="verificationCode"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  인증 코드 (6자리)
                </label>
                <input
                  type="text"
                  id="verificationCode"
                  value={verificationCode}
                  onChange={handleVerificationCodeChange}
                  placeholder="000000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
                  disabled={isExpired || verifyMutation.isPending}
                />
              </div>

              {!isExpired && (
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    남은 시간:{" "}
                    <span className="font-mono font-medium text-blue-600">
                      {formatTime(timer)}
                    </span>
                  </p>
                </div>
              )}

              {isExpired && (
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-red-800">
                    인증 코드가 만료되었습니다. 다시 전송해주세요.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                {lastSentTime === 0 && !autoSend ? (
                  // autoSend가 false이고 처음 전송할 때만 전송 버튼 표시
                  <button
                    onClick={() => {
                      if (canSendEmail()) {
                        sendVerificationMutation.mutate();
                      }
                    }}
                    disabled={
                      sendVerificationMutation.isPending || !canSendEmail()
                    }
                    className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200"
                  >
                    {sendVerificationMutation.isPending
                      ? "전송 중..."
                      : "인증 코드 전송"}
                  </button>
                ) : (
                  // autoSend이거나 전송 후에는 인증하기와 재전송 버튼 표시
                  <>
                    <button
                      onClick={() => verifyMutation.mutate()}
                      disabled={
                        verificationCode.length !== 6 ||
                        isExpired ||
                        verifyMutation.isPending ||
                        sendVerificationMutation.isPending
                      }
                      className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200"
                    >
                      {verifyMutation.isPending ? "인증 중..." : "인증하기"}
                    </button>

                    <button
                      onClick={() => {
                        if (canSendEmail()) {
                          sendVerificationMutation.mutate();
                        }
                      }}
                      disabled={
                        sendVerificationMutation.isPending ||
                        !canSendEmail() ||
                        (!isExpired && timer > 540)
                      }
                      className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition duration-200"
                    >
                      {sendVerificationMutation.isPending
                        ? "전송 중..."
                        : "인증 코드 재전송"}
                    </button>
                  </>
                )}

                <button
                  onClick={onClose}
                  className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  취소
                </button>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">참고사항</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• 인증 코드는 10분간 유효합니다</li>
            <li>• 이메일이 도착하지 않았다면 스팸 폴더를 확인해주세요</li>
            <li>
              • 수의학과 학생은 인증된 수의학과 대학 이메일로만 사용 가능합니다
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
