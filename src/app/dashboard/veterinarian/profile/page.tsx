"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import {
  ProfileImageUpload,
  LicenseImageUpload,
} from "@/components/features/profile";
import {
  useVeterinarianProfile,
  type VeterinarianProfile,
} from "@/hooks/useProfile";
import { useAuthStore } from "@/stores/authStore";

export default function VeterinarianProfilePage() {
  const { data: profile, isLoading, error } = useVeterinarianProfile();
  const { isAuthenticated, checkAuth } = useAuthStore();

  // 타입 안전성을 위한 프로필 데이터 타입 캐스팅
  const profileData = profile as VeterinarianProfile;

  // 초기 인증 상태 확인
  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log("[VeterinarianProfile] Profile data:", profile);
  console.log("[VeterinarianProfile] Loading state:", isLoading);
  console.log("[VeterinarianProfile] Error state:", error);

  if (!isAuthenticated) {
    return <div>로그인이 필요합니다.</div>;
  }

  if (isLoading) {
    return <div>프로필을 불러오는 중...</div>;
  }

  if (error) {
    return <div>오류: {error.message}</div>;
  }

  if (!profile || !profileData) {
    return <div>프로필을 찾을 수 없습니다.</div>;
  }

  const formatBirthDate = (birthDate?: string | Date) => {
    if (!birthDate) return "";
    if (typeof birthDate === "string") return birthDate.split("T")[0];
    if (birthDate instanceof Date) return birthDate.toISOString().split("T")[0];
    return String(birthDate);
  };

  // Provider 확인을 위한 로그
  console.log("[VeterinarianProfile] ID field condition check:", {
    provider: profileData.provider,
    isNormal: profileData.provider === "NORMAL",
    shouldShow: profileData.provider === "NORMAL",
  });

  return (
    <div className="bg-gray-50 min-h-screen pt-[20px] pb-[70px] px-[16px]">
      <div className="bg-white max-w-[1095px] w-full mx-auto px-[16px] lg:px-[20px] pt-[30px] pb-[156px] rounded-[16px] border border-[#EFEFF0]">
        <div className="max-w-md mx-auto w-full">
          {/* 페이지 제목 */}
          <h1 className="font-title text-[28px] text-primary text-center mb-[60px]">
            프로필 설정
          </h1>

          {/* 프로필 정보 */}
          <div className="flex flex-col gap-[60px]">
            {/* 프로필 이미지 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                프로필 이미지
              </label>
              <div className="flex justify-center">
                <ProfileImageUpload
                  value={profileData.profileImage}
                  disabled={true}
                  className="pointer-events-none"
                />
              </div>
            </div>

            {/* 기본 정보 */}
            <div className="space-y-8">
              {/* ID 필드는 NORMAL 로그인 사용자만 표시 */}
              {profileData.provider === "NORMAL" && (
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    아이디
                  </label>
                  <div className="w-full px-4 py-3 border border-[#EFEFF0] rounded-[12px] bg-[#F9F9F9] text-[#666666] text-[16px]">
                    {profileData.loginId || "아이디 없음"}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                  닉네임
                </label>
                <div className="w-full px-4 py-3 border border-[#EFEFF0] rounded-[12px] bg-[#F9F9F9] text-[#666666] text-[16px]">
                  {profileData.nickname ||
                    profileData.realName ||
                    "닉네임 없음"}
                </div>
              </div>

              <div>
                <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                  연락처
                </label>
                <div className="w-full px-4 py-3 border border-[#EFEFF0] rounded-[12px] bg-[#F9F9F9] text-[#666666] text-[16px]">
                  {profileData.phone || "연락처 없음"}
                </div>
              </div>

              <div>
                <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                  이메일
                </label>
                <div className="w-full px-4 py-3 border border-[#EFEFF0] rounded-[12px] bg-[#F9F9F9] text-[#666666] text-[16px]">
                  {profileData.email}
                </div>
              </div>

              <div>
                <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                  생년월일
                </label>
                <div className="w-full px-4 py-3 border border-[#EFEFF0] rounded-[12px] bg-[#F9F9F9] text-[#666666] text-[16px]">
                  {formatBirthDate(profileData.birthDate) || "생년월일 없음"}
                </div>
              </div>
            </div>

            {/* 수의사 면허증 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                수의사 면허증
              </label>
              {profileData.licenseImage ? (
                <LicenseImageUpload
                  value={profileData.licenseImage}
                  disabled={true}
                  className="pointer-events-none flex justify-center"
                />
              ) : (
                <div className="w-[280px] h-[368px] border-2 border-dashed border-[#E5E5E5] rounded-[12px] flex flex-col items-center justify-center text-[#999999]">
                  <div className="text-[16px] mb-2">
                    면허증이 등록되지 않았습니다
                  </div>
                  <div className="text-[14px]">
                    프로필 수정에서 등록해주세요
                  </div>
                </div>
              )}
            </div>

            {/* 프로필 수정 버튼 */}
            <div className="flex justify-center pt-[40px]">
              <Button
                variant="keycolor"
                size="medium"
                onClick={() => {
                  window.location.href = "/dashboard/veterinarian/profile/edit";
                }}
                className="px-[40px]"
              >
                프로필 수정
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
