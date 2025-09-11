"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "public/icons";
import { Button } from "@/components/ui/Button";
import {
  ProfileImageUpload,
  LicenseImageUpload,
} from "@/components/features/profile";
import { useAuth } from "@/hooks/api/useAuth";
import { getVeterinarianProfile, getCurrentUser } from "@/actions/auth";

interface VeterinarianProfileData {
  profileImage?: string;
  userId: string;
  realName?: string; // 실명 추가
  nickname: string;
  phone?: string;
  email: string;
  birthDate: string;
  licenseImage?: string;
}

export default function VeterinarianProfilePage() {
  const { user, isLoading } = useAuth();
  const [profileData, setProfileData] = React.useState<VeterinarianProfileData | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // 사용자 프로필 데이터 로드
  React.useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setIsLoadingProfile(false);
        return;
      }

      try {
        console.log('[VeterinarianProfile] 프로필 로딩 시작:', user);
        
        // getCurrentUser로 완전한 사용자 정보 가져오기
        const currentUserResult = await getCurrentUser();
        const profileResult = await getVeterinarianProfile();
        
        console.log('[VeterinarianProfile] 사용자 결과:', currentUserResult);
        console.log('[VeterinarianProfile] 프로필 결과:', profileResult);
        
        if (currentUserResult.success && currentUserResult.user && profileResult.success && profileResult.profile) {
          const userData = currentUserResult.user;
          const profile = profileResult.profile;
          
          setProfileData({
            profileImage: userData.profileImage, // users 테이블의 profileImage
            userId: userData.username || userData.email,
            realName: userData.realName, // 실명 추가
            nickname: profile.nickname,
            phone: userData.phone,
            email: userData.email,
            birthDate: typeof profile.birthDate === 'string' ? profile.birthDate : profile.birthDate?.toISOString().split('T')[0] || '',
            licenseImage: profile.licenseImage, // veterinarian_profiles 테이블의 licenseImage
          });
        } else {
          setError(currentUserResult.error || profileResult.error || '프로필을 불러올 수 없습니다.');
        }
      } catch (err) {
        console.error('[VeterinarianProfile] 프로필 로딩 오류:', err);
        setError('프로필 로딩 중 오류가 발생했습니다.');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, [user]);

  // 로딩 상태
  if (isLoading || isLoadingProfile) {
    return (
      <div className="bg-gray-50 min-h-screen pt-[20px] pb-[70px] px-[16px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-[#FF8796] mx-auto mb-4" />
          <p className="text-gray-600">프로필을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error || !user) {
    return (
      <div className="bg-gray-50 min-h-screen pt-[20px] pb-[70px] px-[16px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || '로그인이 필요합니다.'}</p>
          <Button onClick={() => window.location.href = '/login/veterinarian'}>로그인</Button>
        </div>
      </div>
    );
  }

  // 프로필 데이터가 없는 경우
  if (!profileData) {
    return (
      <div className="bg-gray-50 min-h-screen pt-[20px] pb-[70px] px-[16px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">프로필 정보를 찾을 수 없습니다.</p>
          <Button onClick={() => window.location.href = '/dashboard/veterinarian/profile/edit'}>프로필 설정</Button>
        </div>
      </div>
    );
  }

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
                  value={profileData.profileImage}
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
                    {profileData.userId}
                  </div>
                </div>

                {/* 실명 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    성함
                  </label>
                  <div className="w-full px-4 py-3 border border-[#EFEFF0] rounded-[12px] bg-[#F9F9F9] text-[#666666] text-[16px]">
                    {profileData.realName || '등록된 실명이 없습니다'}
                  </div>
                </div>

                {/* 닉네임 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    닉네임
                  </label>
                  <div className="w-full px-4 py-3 border border-[#EFEFF0] rounded-[12px] bg-[#F9F9F9] text-[#666666] text-[16px]">
                    {profileData.nickname}
                  </div>
                </div>

                {/* 연락처 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    연락처
                  </label>
                  <div className="w-full px-4 py-3 border border-[#EFEFF0] rounded-[12px] bg-[#F9F9F9] text-[#666666] text-[16px]">
                    {profileData.phone || '등록된 연락처가 없습니다'}
                  </div>
                </div>

                {/* 이메일 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    이메일
                  </label>
                  <div className="w-full px-4 py-3 border border-[#EFEFF0] rounded-[12px] bg-[#F9F9F9] text-[#666666] text-[16px]">
                    {profileData.email}
                  </div>
                </div>

                {/* 생년월일 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    생년월일
                  </label>
                  <div className="w-full px-4 py-3 border border-[#EFEFF0] rounded-[12px] bg-[#F9F9F9] text-[#666666] text-[16px]">
                    {profileData.birthDate || '등록된 생년월일이 없습니다'}
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
                    value={profileData.licenseImage}
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
