import React from "react";
import {
  BookmarkFilledIcon,
  BookmarkIcon,
  LocationIcon,
  WalletIcon,
} from "public/icons";
import { Tag } from "../Tag";
import defaultProfileImg from "@/assets/images/profile.png";
import Image from "next/image";

export interface ResumeCardProps {
  id: string;
  name: string;
  experience: string; // e.g., "경력 5년"
  preferredLocation: string; // e.g., "서울 강남, 서울 강서, 경기, 인천"
  keywords: string[]; // e.g., ["내과", "외과", "정규직", "계약직", "파트타임"]
  lastAccessDate: string; // e.g., "2025.04.15"
  profileImage?: string; // 프로필 이미지 URL
  lastLoginAt?: string | Date | null; // 최근 로그인 시간
  isNew?: boolean; // 신규 여부
  isBookmarked?: boolean; // 북마크 여부
  onClick?: () => void;
  onBookmarkClick?: () => void;
}

const ResumeCard: React.FC<ResumeCardProps> = ({
  name,
  experience,
  preferredLocation,
  keywords = [],
  lastAccessDate,
  profileImage,
  lastLoginAt,
  isNew = false,
  isBookmarked = false,
  onClick,
  onBookmarkClick,
}) => {
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmarkClick?.();
  };

  // 최근 로그인 날짜 포맷팅 함수
  const formatLastLoginDate = (lastLoginAt: string | Date | null) => {
    if (!lastLoginAt) return "로그인 정보 없음";
    
    const loginDate = new Date(lastLoginAt);
    return loginDate.toLocaleDateString('ko-KR').replace(/\. /g, '.').replace(/\.$/, '');
  };

  return (
    <div
      className="bg-white flex-1 min-w-[300px] max-w-sm rounded-xl border border-[#E5E5E5] w-full max-w-[343px] max-h-[414px] mx-auto hover:shadow-md transition-shadow duration-200 cursor-pointer p-[20px] flex flex-col gap-[8px] justify-between"
      onClick={onClick}
    >
      {/* 헤더 - 신규 태그와 북마크 */}
      <div className="flex items-start justify-between">
        {isNew ? (
          <Tag variant={1} className="w-[59px] h-[31px]">
            신규
          </Tag>
        ) : (
          <div className="lg:block hidden lg:w-[59px] lg:h-[31px] w-[0px] h-[0px]"></div>
        )}
        {/* lg 미만에서는 프로필과 이름을 함께 표시 */}
        <div className="flex justify-between lg:block">
          <div className="lg:hidden flex items-center gap-2 flex-wrap mb-[20px] lg:mb-[0px]">
            <div className="w-[36px] h-[36px] rounded-full overflow-hidden border-2 border-[#FFB5B5] bg-[#FFF5F5] flex items-center justify-center">
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt={`${name} 프로필`}
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={defaultProfileImg}
                  alt="기본 프로필"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <h3 className="font-text text-[20px] font-bold text-[#3B394D]">
              {name}
            </h3>
          </div>
          {/* lg 이상에서는 기존대로 프로필만 표시 */}
          <div className="hidden lg:block">
            <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-2 border-[#FFB5B5] bg-[#FFF5F5] flex items-center justify-center mt-[40px]">
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt={`${name} 프로필`}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={defaultProfileImg}
                  alt="기본 프로필"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        </div>
        <div
          className="flex items-center justify-end cursor-pointer w-[59px]"
          onClick={handleBookmarkClick}
        >
          {isBookmarked ? (
            <BookmarkFilledIcon currentColor="var(--Keycolor1)" />
          ) : (
            <BookmarkIcon currentColor="var(--Subtext2)" />
          )}
        </div>
      </div>

      <div>
        {/* lg 이상에서만 이름 표시 */}
        <div className="text-left hidden lg:block">
          <h3 className="font-text text-[20px] font-bold text-[#3B394D] mb-[13px]">
            {name}
          </h3>
        </div>

        {/* 경력 정보 */}
        <div className="flex justify-start items-center mb-[5px] gap-[8px]">
          <WalletIcon currentColor="var(--Subtext)" />
          <span className="font-text text-[16px] text-sub">{experience}</span>
        </div>

        {/* 희망 근무지 */}
        <div className="flex justify-start items-center mb-[13px] gap-[8px]">
          <LocationIcon currentColor="var(--Subtext)" />
          <span className="font-text text-[16px] text-sub leading-relaxed">
            {preferredLocation}
          </span>
        </div>

        {/* 핵심 키워드 태그 */}
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <Tag key={index} variant={3}>
              {keyword}
            </Tag>
          ))}
        </div>
      </div>

      {/* 최근 로그인 정보 */}
      <div className="text-right">
        <span className="font-text text-[14px] text-[#CACAD2]">
          최근 로그인: {formatLastLoginDate(lastLoginAt || null)}
        </span>
      </div>
    </div>
  );
};

export default ResumeCard;
