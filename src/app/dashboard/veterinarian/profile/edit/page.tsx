"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "public/icons";
import { Button } from "@/components/ui/Button";
import { InputBox } from "@/components/ui/Input/InputBox";
import {
  ProfileImageUpload,
  LicenseImageUpload,
} from "@/components/features/profile";
import { useAuth } from "@/hooks/api/useAuth";
import { getVeterinarianProfile, getCurrentUser } from "@/actions/auth";
import { useQueryClient } from "@tanstack/react-query";
import { authKeys } from "@/hooks/api/useAuth";

interface VeterinarianProfileEditData {
  profileImage?: string;
  userId: string;
  realName: string; // 실명 추가
  nickname: string;
  phone: string;
  email: string;
  birthDate: string;
  licenseImage?: string;
  password: string;
  passwordConfirm: string;
}

export default function VeterinarianProfileEditPage() {
  const { user, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 폼 상태 관리
  const [formData, setFormData] = useState<VeterinarianProfileEditData>({
    profileImage: undefined,
    userId: "",
    realName: "",
    nickname: "",
    phone: "",
    email: "",
    birthDate: "",
    licenseImage: undefined,
    password: "",
    passwordConfirm: "",
  });

  // 사용자 데이터 로드
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const profileResult = await getVeterinarianProfile();

        if (profileResult.success && profileResult.profile) {
          // getVeterinarianProfile returns only the profile data, we need user data from getCurrentUser
          const currentUserResult = await getCurrentUser();
          if (currentUserResult.success && currentUserResult.user) {
            const userData = currentUserResult.user;
            const profileData = profileResult.profile;

            setFormData({
              profileImage: userData.profileImage || undefined,
              userId: userData.username || "",
              realName: userData.realName || "",
              nickname: profileData.nickname || "",
              phone: userData.phone || "",
              email: userData.email || "",
              birthDate: profileData.birthDate
                ? new Date(profileData.birthDate).toISOString().split("T")[0]
                : "",
              licenseImage: profileData.licenseImage || undefined,
              password: "",
              passwordConfirm: "",
            });
          } else {
            setError("사용자 정보를 불러올 수 없습니다.");
          }
        } else {
          setError(profileResult.error || "프로필 정보를 불러올 수 없습니다.");
        }
      } catch (err) {
        console.error("프로필 로드 오류:", err);
        setError("프로필 정보 로드 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (user && !isLoading) {
      loadUserData();
    } else if (!isLoading && !user) {
      // 로그인하지 않은 경우 리다이렉트
      window.location.href = "/auth/login";
    }
  }, [user, isLoading]);

  const handleInputChange =
    (field: keyof VeterinarianProfileEditData) => (value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const handleImageChange =
    (field: "profileImage" | "licenseImage") => (url: string | null) => {
      setFormData((prev) => ({ ...prev, [field]: url }));
    };

  const handleSave = async () => {
    // 비밀번호 확인
    if (formData.password && formData.password !== formData.passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 필수 필드 검증
    if (
      !formData.realName ||
      !formData.nickname ||
      !formData.phone ||
      !formData.email ||
      !formData.birthDate
    ) {
      alert("모든 필수 정보를 입력해주세요.");
      return;
    }

    setSaving(true);
    
    try {
      console.log("프로필 수정 데이터:", formData);
      
      // FormData 생성
      const updateData = new FormData();
      updateData.append("realName", formData.realName);
      updateData.append("nickname", formData.nickname);
      updateData.append("phone", formData.phone);
      updateData.append("email", formData.email);
      updateData.append("birthDate", formData.birthDate);
      
      if (formData.profileImage) {
        updateData.append("profileImage", formData.profileImage);
      }
      if (formData.licenseImage) {
        updateData.append("licenseImage", formData.licenseImage);
      }
      if (formData.password) {
        updateData.append("password", formData.password);
      }

      // FormData 로깅
      console.log("FormData 내용:");
      console.log("realName:", updateData.get("realName"));
      console.log("nickname:", updateData.get("nickname"));
      console.log("phone:", updateData.get("phone"));
      console.log("email:", updateData.get("email"));
      console.log("birthDate:", updateData.get("birthDate"));
      console.log("profileImage:", updateData.get("profileImage"));
      console.log("licenseImage:", updateData.get("licenseImage"));
      console.log("password:", updateData.get("password") ? "[SET]" : "[NOT SET]");

      // API 호출
      console.log("API 호출 시작...");
      const response = await fetch("/api/dashboard/veterinarian/profile", {
        method: "PUT",
        body: updateData,
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("HTTP Error Response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      // 응답을 텍스트로 먼저 읽어서 내용 확인
      const responseText = await response.text();
      console.log("Raw Response Text:", responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
        console.log("Parsed API Response:", result);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.error("Response was not valid JSON:", responseText);
        throw new Error("서버 응답 형식이 올바르지 않습니다.");
      }

      if (result.status === "success") {
        // React Query 캐시 무효화하여 실시간 업데이트
        await queryClient.invalidateQueries({ queryKey: authKeys.currentUser });
        
        alert(result.message || "프로필이 수정되었습니다!");
        
        // 프로필 페이지로 이동
        window.location.href = "/dashboard/veterinarian/profile";
      } else {
        console.error("API Error Result:", result);
        alert(`프로필 수정 실패: ${result.message || "알 수 없는 오류가 발생했습니다."}`);
      }
    } catch (error) {
      console.error("프로필 수정 오류:", error);
      alert("프로필 수정 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm("작성 중인 내용이 모두 사라집니다. 정말 취소하시겠습니까?")) {
      window.location.href = "/dashboard/veterinarian/profile";
    }
  };

  if (isLoading || loading) {
    return (
      <div className="bg-gray-50 min-h-screen pt-[20px] pb-[70px] px-[16px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-[#666666]">프로필 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen pt-[20px] pb-[70px] px-[16px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button
            variant="keycolor"
            size="medium"
            onClick={() => window.location.reload()}
          >
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-[20px] pb-[70px] px-[16px]">
      <div className="bg-white max-w-[1095px] w-full mx-auto px-[16px] lg:px-[20px] pt-[30px] pb-[156px] rounded-[16px] border border-[#EFEFF0]">
        {/* 메인 컨텐츠 */}
        <div className="max-w-md mx-auto w-full">
          {/* 페이지 제목 */}
          <h1 className="font-title text-[28px] font-light text-primary text-center mb-[60px]">
            프로필 수정
          </h1>

          <div className="flex flex-col gap-[60px]">
            {/* 프로필 사진 섹션 */}
            <section>
              <h2 className="text-[20px] font-medium text-[#3B394D] mb-6">
                프로필 사진
              </h2>
              <div className="flex justify-center">
                <ProfileImageUpload
                  value={formData.profileImage}
                  onChange={handleImageChange("profileImage")}
                  folder="profiles"
                />
              </div>
            </section>

            {/* 기본 정보 섹션 */}
            <section>
              <div className="space-y-8">
                {/* 아이디 (읽기 전용) */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    아이디
                  </label>
                  <div className="w-full px-4 py-3 border border-[#EFEFF0] rounded-[12px] bg-[#F9F9F9] text-[#666666] text-[16px]">
                    {formData.userId}
                  </div>
                </div>

                {/* 실명 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    성함
                  </label>
                  <InputBox
                    value={formData.realName}
                    onChange={handleInputChange("realName")}
                    placeholder="실명을 입력해주세요"
                  />
                </div>

                {/* 닉네임 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    닉네임
                  </label>
                  <InputBox
                    value={formData.nickname}
                    onChange={handleInputChange("nickname")}
                    placeholder="닉네임을 입력해주세요"
                  />
                </div>

                {/* 연락처 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    연락처
                  </label>
                  <InputBox
                    value={formData.phone}
                    onChange={handleInputChange("phone")}
                    placeholder="연락처를 입력해 주세요"
                    type="tel"
                  />
                </div>

                {/* 이메일 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    이메일
                  </label>
                  <InputBox
                    value={formData.email}
                    onChange={handleInputChange("email")}
                    placeholder="이메일을 입력해 주세요"
                    type="email"
                  />
                </div>

                {/* 생년월일 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    생년월일
                  </label>
                  <InputBox
                    value={formData.birthDate}
                    onChange={handleInputChange("birthDate")}
                    placeholder="YYYY-MM-DD"
                    type="text"
                  />
                </div>

                {/* 비밀번호 변경 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    비밀번호 변경
                  </label>
                  <InputBox
                    value={formData.password}
                    onChange={handleInputChange("password")}
                    placeholder="새 비밀번호를 입력해주세요 (변경 시에만)"
                    type="password"
                    guide={{
                      text: "비밀번호는 8자 이상 입력해주세요",
                      type: "info",
                    }}
                  />
                </div>

                {/* 비밀번호 변경 확인 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    비밀번호 변경 재입력
                  </label>
                  <InputBox
                    value={formData.passwordConfirm}
                    onChange={handleInputChange("passwordConfirm")}
                    placeholder="새 비밀번호를 다시 입력해주세요"
                    type="password"
                    error={
                      !!(
                        formData.passwordConfirm &&
                        formData.password !== formData.passwordConfirm
                      )
                    }
                    guide={
                      formData.passwordConfirm &&
                      formData.password !== formData.passwordConfirm
                        ? {
                            text: "비밀번호가 일치하지 않습니다",
                            type: "error",
                          }
                        : undefined
                    }
                  />
                </div>
              </div>

              {/* 수의사 면허증 */}
              <div className="mt-8">
                <label className="block text-[20px] font-medium text-[#3B394D] mb-6">
                  수의사 면허증
                </label>
                <div className="flex justify-center text-center">
                  <LicenseImageUpload
                    className="flex justify-center"
                    value={formData.licenseImage}
                    onChange={handleImageChange("licenseImage")}
                  />
                </div>
              </div>
            </section>

            {/* 버튼 영역 */}
            <div className="flex gap-4 w-full justify-center mt-[60px]">
              <Button
                variant="line"
                size="medium"
                onClick={handleCancel}
                className="px-[40px]"
              >
                취소
              </Button>
              <Button
                variant="keycolor"
                size="medium"
                onClick={handleSave}
                disabled={saving}
                className="px-[40px]"
              >
                {saving ? "저장 중..." : "수정하기"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
