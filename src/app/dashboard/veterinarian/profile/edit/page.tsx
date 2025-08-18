"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "public/icons";
import { Button } from "@/components/ui/Button";
import { InputBox } from "@/components/ui/Input/InputBox";
import {
  ProfileImageUpload,
  LicenseImageUpload,
} from "@/components/features/profile";
import veterinarianImage from "@/assets/images/veterinarian.png";
import hospitalImage from "@/assets/images/hospital.png";

interface UserProfileData {
  profileImage?: string;
  userId: string;
  nickname: string;
  phone: string;
  email: string;
  birthDate: string;
  licenseImage?: string;
  password: string;
  passwordConfirm: string;
}

export default function VeterinarianProfileEditPage() {
  // 폼 상태 관리
  const [formData, setFormData] = useState<UserProfileData>({
    profileImage: veterinarianImage.src,
    userId: "qwerwer12", // 읽기 전용
    nickname: "김수의",
    phone: "02-2423-2342",
    email: "qwerwer12@naver.com",
    birthDate: "1994-08-09",
    licenseImage: hospitalImage.src,
    password: "",
    passwordConfirm: "",
  });

  const handleInputChange =
    (field: keyof UserProfileData) => (value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const handleImageChange =
    (field: "profileImage" | "licenseImage") => (file: File | null) => {
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setFormData((prev) => ({ ...prev, [field]: imageUrl }));
      }
    };

  const handleSave = () => {
    // 비밀번호 확인
    if (formData.password && formData.password !== formData.passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 필수 필드 검증
    if (
      !formData.nickname ||
      !formData.phone ||
      !formData.email ||
      !formData.birthDate
    ) {
      alert("모든 필수 정보를 입력해주세요.");
      return;
    }

    console.log("프로필 수정 데이터:", formData);
    alert("프로필이 수정되었습니다!");

    // 프로필 페이지로 이동
    window.location.href = "/dashboard/veterinarian/profile";
  };

  const handleCancel = () => {
    if (confirm("작성 중인 내용이 모두 사라집니다. 정말 취소하시겠습니까?")) {
      window.location.href = "/dashboard/veterinarian/profile";
    }
  };

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

                {/* 닉네임 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    닉네임
                  </label>
                  <InputBox
                    value={formData.nickname}
                    onChange={handleInputChange("nickname")}
                    placeholder="닉네임을 입력해주세요"
                    guide={{
                      text: "동물병원에서 이름 제한이 있습니다",
                      type: "info",
                    }}
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
                className="px-[40px]"
              >
                수정하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
