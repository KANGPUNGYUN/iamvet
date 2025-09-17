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

interface VeterinarianProfileData {
  profileImage?: string;
  userId: string;
  loginId?: string; // 로그인 아이디 추가
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

  // 사용자 프로필 데이터 로드 - useAuth에서 실시간 데이터 사용
  React.useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setIsLoadingProfile(false);
        return;
      }

      try {
        console.log('[VeterinarianProfile] 프로필 로딩 시작:', user);
        
        // API Route로 veterinarian 전용 데이터 가져오기 (localStorage 토큰 지원)
        const accessToken = localStorage.getItem('accessToken');
        console.log('[VeterinarianProfile] Access token:', accessToken ? 'exists' : 'none');
        
        // JWT 토큰 내용 확인 (디버깅용)
        if (accessToken) {
          try {
            const tokenParts = accessToken.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              console.log('[VeterinarianProfile] JWT payload:', payload);
            }
          } catch (e) {
            console.log('[VeterinarianProfile] Failed to decode JWT:', e);
          }
        }
        
        const response = await fetch('/api/dashboard/veterinarian/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        const profileResult = await response.json();
        
        // API 응답 형태에 맞게 변환
        const transformedResult = {
          success: profileResult.status === 'success',
          profile: profileResult.data,
          error: profileResult.message
        };
        
        console.log('[VeterinarianProfile] 프로필 결과:', transformedResult);
        
        if (transformedResult.success) {
          const profile = transformedResult.profile;
          
          // profile이 null이어도 기본값으로 폼을 표시
          // user.phone과 user.birthDate가 없는 경우 profile에서 가져오기
          const finalPhone = user.phone || profile?.phone || '';
          const finalBirthDate = user.birthDate || 
            (profile?.birthDate ? 
              (typeof profile.birthDate === 'string' ? profile.birthDate : profile.birthDate?.toISOString().split('T')[0]) 
              : '');
          
          setProfileData({
            profileImage: user.profileImage, // users 테이블의 profileImage
            userId: user.name || user.email,
            realName: user.realName, // 실명 - useAuth에서 실시간 업데이트됨
            nickname: profile?.nickname || user.name || '닉네임 없음',
            phone: finalPhone,
            email: user.email,
            birthDate: finalBirthDate,
            licenseImage: profile?.licenseImage, // veterinarian_profiles 테이블의 licenseImage
          });
        } else {
          setError(transformedResult.error || '프로필을 불러올 수 없습니다.');
        }
      } catch (err) {
        console.error('[VeterinarianProfile] 프로필 로딩 오류:', err);
        setError('프로필 로딩 중 오류가 발생했습니다.');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, [user]); // user가 변경되면 (React Query 캐시 무효화 시) 자동으로 리로드

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
          <Button onClick={() => window.location.href = '/member-select'}>로그인</Button>
        </div>
      </div>
    );
  }

  // 프로필 데이터가 없는 경우
  if (!profileData) {
    return (
      <div className="bg-gray-50 min-h-screen pt-[20px] pb-[70px] px-[16px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">프로필 정보를 불러오는 중입니다...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-[#FF8796] mx-auto mb-4" />
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
                    {profileData.loginId || profileData.userId}
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
