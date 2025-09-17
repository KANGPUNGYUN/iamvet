"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "public/icons";
import { Button } from "@/components/ui/Button";
import { InputBox } from "@/components/ui/Input/InputBox";
import { PhoneInput, BirthDateInput } from "@/components/ui/FormattedInput";
import {
  ProfileImageUpload,
  LicenseImageUpload,
} from "@/components/features/profile";
import {
  useVeterinarianProfile,
  useUpdateVeterinarianProfile,
} from "@/hooks/useProfile";
import { useAuthStore } from "@/stores/authStore";

interface VeterinarianProfileEditData {
  nickname: string;
  phone: string;
  email: string;
  realName: string;
  birthDate: string;
  profileImage?: string;
  licenseImage?: string;
}

export default function VeterinarianProfileEditPage() {
  const { data: profile, isLoading, error } = useVeterinarianProfile();
  const updateProfileMutation = useUpdateVeterinarianProfile();
  const { isAuthenticated, checkAuth } = useAuthStore();

  // 폼 상태 관리
  const [formData, setFormData] = useState<VeterinarianProfileEditData>({
    nickname: "",
    phone: "",
    email: "",
    realName: "",
    birthDate: "",
    profileImage: undefined,
    licenseImage: undefined,
  });

  // 디버깅: 이미지 데이터 확인
  console.log("[VeterinarianProfileEdit] Image data check:", {
    profileImageFromProfile: profile?.profileImage,
    licenseImageFromProfile: profile?.licenseImage,
    profileImageFromForm: formData.profileImage,
    licenseImageFromForm: formData.licenseImage,
  });

  // 프로필 데이터 로드 시 폼 초기화
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (profile) {
      const formatBirthDate = (birthDate?: string | Date) => {
        if (!birthDate) return "";
        if (typeof birthDate === "string") return birthDate.split("T")[0];
        if (birthDate instanceof Date)
          return birthDate.toISOString().split("T")[0];
        return String(birthDate);
      };

      console.log("[VeterinarianProfileEdit] Setting form data with profile:", {
        profileImage: profile.profileImage,
        licenseImage: profile.licenseImage,
        fullProfile: profile,
      });

      setFormData({
        nickname: profile.nickname || profile.realName || "",
        phone: profile.phone || "",
        email: profile.email || "",
        realName: profile.realName || "",
        birthDate: formatBirthDate(profile.birthDate),
        profileImage: profile.profileImage || undefined,
        licenseImage: profile.licenseImage || undefined,
      });
    }
  }, [profile]);

  const handleInputChange =
    (field: keyof VeterinarianProfileEditData) => (value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const handleProfileImageChange = (url: string | null) => {
    setFormData((prev) => ({ ...prev, profileImage: url || undefined }));
  };

  const handleLicenseImageChange = (url: string | null) => {
    setFormData((prev) => ({ ...prev, licenseImage: url || undefined }));
  };

  const handleSave = async () => {
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

    try {
      console.log("프로필 수정 데이터:", formData);

      await updateProfileMutation.mutateAsync(formData);

      alert("프로필이 수정되었습니다!");
      window.location.href = "/dashboard/veterinarian/profile";
    } catch (error) {
      console.error("프로필 수정 오류:", error);
      alert("프로필 수정 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    if (confirm("작성 중인 내용이 모두 사라집니다. 정말 취소하시겠습니까?")) {
      window.location.href = "/dashboard/veterinarian/profile";
    }
  };

  // 초기 로딩 중이거나 인증되지 않은 경우 처리
  if (!isAuthenticated && !isLoading) {
    return <div>로그인이 필요합니다.</div>;
  }

  if (isLoading) {
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
          <p className="text-red-500 mb-4">오류: {error.message}</p>
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

  if (!profile) {
    return <div>프로필을 찾을 수 없습니다.</div>;
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
            {/* 프로필 이미지 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                프로필 이미지
              </label>
              <div className="flex justify-center">
                <ProfileImageUpload
                  value={formData.profileImage}
                  onChange={handleProfileImageChange}
                />
              </div>
            </div>

            {/* 기본 정보 */}
            <div className="space-y-8">
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

              <div>
                <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                  연락처
                </label>
                <PhoneInput
                  value={formData.phone}
                  onChange={handleInputChange("phone")}
                  placeholder="연락처를 입력해 주세요"
                />
              </div>

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

              <div>
                <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                  생년월일
                </label>
                <BirthDateInput
                  value={formData.birthDate}
                  onChange={handleInputChange("birthDate")}
                  placeholder="YYYY-MM-DD"
                />
              </div>
            </div>

            {/* 수의사 면허증 */}
            <div>
              <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                수의사 면허증
              </label>

              <LicenseImageUpload
                value={formData.licenseImage}
                onChange={handleLicenseImageChange}
                className="flex justify-center"
              />
            </div>

            {/* 버튼 영역 */}
            <div className="flex gap-4 w-full justify-center pt-[40px]">
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
                disabled={updateProfileMutation.isPending}
                className="px-[40px]"
              >
                {updateProfileMutation.isPending ? "저장 중..." : "수정하기"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
