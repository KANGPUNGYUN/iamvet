"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "public/icons";
import { Button } from "@/components/ui/Button";
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
}

export default function VeterinarianProfilePage() {
  // 더미 사용자 데이터 (실제로는 API에서 가져올 데이터)
  const userData: UserProfileData = {
    profileImage: veterinarianImage.src,
    userId: "qwerwer12",
    nickname: "김수의",
    phone: "02-2423-2342",
    email: "qwerwer12@naver.com",
    birthDate: "1994-08-09",
    licenseImage: hospitalImage.src,
  };

  const handleEdit = () => {
    window.location.href = "/dashboard/veterinarian/profile/edit";
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-[20px] pb-[70px] px-[16px]">
      <div className="bg-white max-w-[1095px] w-full mx-auto px-[16px] lg:px-[20px] pt-[30px] pb-[156px] rounded-[16px] border border-[#EFEFF0]">
        {/* 메인 컨텐츠 */}
        <div className="max-w-md mx-auto w-full">
          {/* 페이지 제목 */}
          <h1 className="font-title text-[28px] font-light text-primary text-center mb-[60px]">
            프로필 설정
          </h1>

          <div className="flex flex-col gap-[60px]">
            {/* 프로필 사진 섹션 */}
            <section>
              <h2 className="text-[20px] font-medium text-[#3B394D] mb-6">
                프로필 사진
              </h2>
              <div className="flex justify-center">
                <ProfileImageUpload
                  value={userData.profileImage}
                  onChange={() => {}} // 읽기 전용이므로 빈 함수
                  disabled={true}
                />
              </div>
            </section>

            {/* 기본 정보 섹션 */}
            <section>
              <div className="space-y-8">
                {/* 아이디 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    아이디
                  </label>
                  <div className="w-full px-4 py-3 border border-[#EFEFF0] rounded-[12px] bg-[#F9F9F9] text-[#666666] text-[16px]">
                    {userData.userId}
                  </div>
                </div>

                {/* 닉네임 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    닉네임
                  </label>
                  <div className="w-full px-4 py-3 border border-[#EFEFF0] rounded-[12px] bg-[#F9F9F9] text-[#666666] text-[16px]">
                    {userData.nickname}
                  </div>
                </div>

                {/* 연락처 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    연락처
                  </label>
                  <div className="w-full px-4 py-3 border border-[#EFEFF0] rounded-[12px] bg-[#F9F9F9] text-[#666666] text-[16px]">
                    {userData.phone}
                  </div>
                </div>

                {/* 이메일 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    이메일
                  </label>
                  <div className="w-full px-4 py-3 border border-[#EFEFF0] rounded-[12px] bg-[#F9F9F9] text-[#666666] text-[16px]">
                    {userData.email}
                  </div>
                </div>

                {/* 생년월일 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    생년월일
                  </label>
                  <div className="w-full px-4 py-3 border border-[#EFEFF0] rounded-[12px] bg-[#F9F9F9] text-[#666666] text-[16px]">
                    {userData.birthDate}
                  </div>
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
                    value={userData.licenseImage}
                    onChange={() => {}} // 읽기 전용이므로 빈 함수
                    disabled={true}
                  />
                </div>
              </div>
            </section>

            {/* 수정하기 버튼 */}
            <div className="flex justify-center mt-[60px]">
              <Button
                variant="default"
                size="medium"
                onClick={handleEdit}
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
