"use client";

import React from "react";
import Link from "next/link";
import { Tag } from "./Tag";
import Image, { StaticImageData } from "next/image";
import { useHospitalProfile } from "@/hooks/api/useHospitalProfile";
import { useDetailedHospitalProfile } from "@/hooks/api/useDetailedHospitalProfile";
import { useCurrentUser } from "@/hooks/api/useAuth";

interface HospitalProfileCardProps {
  // props를 선택적으로 만들어서 실제 데이터를 우선 사용
  name?: string;
  description?: string;
  profileImage?: string | StaticImageData;
  keywords?: string[];
}

const HospitalProfileCard: React.FC<HospitalProfileCardProps> = ({
  name: propName,
  description: propDescription,
  profileImage: propProfileImage,
  keywords: propKeywords,
}) => {
  const { data: profile, isLoading: profileLoading } = useHospitalProfile();
  const { data: detailedProfile, isLoading: detailedProfileLoading } = useDetailedHospitalProfile();
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();

  // localStorage에서 병원 정보 가져오기 (fallback)
  const getLocalHospitalData = () => {
    if (typeof window === 'undefined') return null;
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        return JSON.parse(userString);
      } catch {
        return null;
      }
    }
    return null;
  };

  const localUserData = getLocalHospitalData();

  // 실제 프로필 데이터가 있으면 사용하고, 없으면 props나 기본값 사용
  const name = detailedProfile?.hospitalName || profile?.hospitalName || localUserData?.hospitalName || currentUser?.profileName || propName || "병원명을 설정해주세요";
  const description =
    detailedProfile?.description || propDescription || "병원 소개를 작성해주세요";
  
  // 병원 프로필에서 키워드 추출 (주소, 전문 분야 등)
  const getHospitalKeywords = () => {
    if (propKeywords && propKeywords.length > 0) return propKeywords;
    
    const keywords = [];
    
    // 상세 프로필 우선, 기본 프로필 fallback
    const profileData = detailedProfile || profile;
    
    // 주소에서 지역 정보 추출
    if (profileData?.address) {
      const region = profileData.address.split(" ")[0]; // 첫 번째 단어 (시/도)
      if (region) keywords.push(region);
    }
    
    // 전화번호가 있으면 "연락 가능" 태그
    if (profileData?.phone) {
      keywords.push("연락 가능");
    }
    
    // 웹사이트가 있으면 "홈페이지 보유" 태그
    if (profileData?.website) {
      keywords.push("홈페이지 보유");
    }
    
    return keywords.length > 0 ? keywords : ["진료 분야를 설정해주세요"];
  };
  
  const keywords = getHospitalKeywords();
  const isLoading = profileLoading || detailedProfileLoading || userLoading;

  // 프로필 이미지 URL 결정 (상세 프로필 우선, users 테이블의 hospitalLogo 또는 profileImage 사용)
  const profileImageSrc = detailedProfile?.hospitalLogo || localUserData?.hospitalLogo || currentUser?.profileImage || propProfileImage;
  const hasProfileImage =
    profileImageSrc && profileImageSrc !== "/hospital-placeholder.png";

  if (isLoading) {
    return (
      <div className="bg-white w-full lg:max-w-[395px] mx-auto rounded-[16px] border border-[#EFEFF0] p-[16px] lg:p-[20px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[20px] font-bold text-primary">병원 프로필</h2>
          <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex flex-col gap-[16px]">
          <div className="flex gap-[18px] items-center">
            <div className="w-[92px] h-[92px] bg-gray-200 rounded-full animate-pulse"></div>
            <div className="flex flex-col gap-[6px]">
              <div className="w-32 h-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-48 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-16 h-6 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  // 프로필이 없는 경우 체크 (상세 프로필 또는 기본 프로필이 있는지 확인)
  const hasProfile = detailedProfile || profile || (name !== "병원명을 설정해주세요" && name !== propName);

  return (
    <div className="bg-white w-full lg:max-w-[395px] mx-auto rounded-[16px] border border-[#EFEFF0] p-[16px] lg:p-[20px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-bold text-primary">병원 프로필</h2>
        <Link
          href="/dashboard/hospital/profile/edit"
          className="text-key1 text-[16px] font-bold no-underline hover:underline hover:underline-offset-[3px]"
        >
          {hasProfile ? "수정하기" : "작성하기"}
        </Link>
      </div>

      {hasProfile ? (
        <div className="flex flex-col gap-[16px]">
          <div className="flex gap-[18px] items-center">
          {hasProfileImage ? (
            <Image
              src={profileImageSrc!}
              alt="병원 프로필"
              width={92}
              height={92}
              className="w-[92px] h-[92px] rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                // 이미지 로드 실패 시 대체 div를 보여주기 위해 부모에게 이벤트 전달
                const parent = target.parentElement;
                if (parent) {
                  const fallbackDiv = parent.querySelector(".fallback-avatar");
                  if (fallbackDiv) {
                    (fallbackDiv as HTMLElement).style.display = "flex";
                  }
                }
              }}
            />
          ) : null}

          {/* 기본 아바타 (이미지가 없거나 로드 실패 시) */}
          <div
            className={`fallback-avatar ${hasProfileImage ? "hidden" : "flex"}`}
            style={{
              display: hasProfileImage ? "none" : "flex",
              width: "92px",
              height: "92px",
              padding: "0",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              flexShrink: 0,
              borderRadius: "50%",
              background: "var(--Keycolor1, #FF8796)",
              color: "var(--Keycolor5, #FFF7F7)",
              textAlign: "center",
              fontFamily: "var(--font-title)",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "1",
            }}
          >
            {name.charAt(0)}
          </div>

          <div className="flex flex-col gap-[6px]">
            <h3 className="text-[20px] font-text text-bold text-primary">
              {name}
            </h3>
            <p className="text-[16px] font-text text-subtext text-gray-600 text-sm mb-4">
              {description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <Tag key={index} variant={3}>
              {keyword}
            </Tag>
          ))}
        </div>
      </div>
      ) : (
        // 프로필이 없을 때 - 안내 메시지 표시
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <p className="text-gray-600 text-[16px] mb-2">
            병원 프로필을 작성해주세요
          </p>
          <p className="text-gray-500 text-[14px] mb-4">
            병원의 정보와 특징을 소개하는 프로필을 작성하여<br />
            더 많은 인재를 만나보세요
          </p>
          <Link
            href="/dashboard/hospital/profile/edit"
            className="inline-flex items-center px-4 py-2 bg-key1 text-white text-[14px] font-medium rounded-lg hover:bg-key1/90 transition-colors"
          >
            병원 프로필 작성하기
          </Link>
        </div>
      )}
    </div>
  );
};

export default HospitalProfileCard;
