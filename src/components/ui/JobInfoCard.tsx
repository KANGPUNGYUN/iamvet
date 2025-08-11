import {
  BookmarkFilledIcon,
  BookmarkIcon,
  DocumentIcon,
  LocationIcon,
  WalletIcon,
} from "public/icons";
import React from "react";
import { Tag } from "./Tag";

interface JobInfoCardProps {
  hospital: string;
  dDay: string;
  position: string;
  location: string;
  jobType: string;
  tags: string[];
  isBookmarked?: boolean;
  onClick?: () => void;
  variant?: "default" | "wide"; // 기본 스타일과 넓은 스타일 선택
  showDeadline?: boolean; // 마감일 표시 여부
  isNew?: boolean; // 신규 공고 여부
  id?: number; // 채용공고 ID 추가
}

const JobInfoCard: React.FC<JobInfoCardProps> = ({
  hospital = "건국대학교 동물병원",
  dDay = "D-23",
  position = "간호조무사(정규직)",
  location = "서울 광진구",
  jobType = "신입",
  tags = ["내과", "외과", "정규직", "케어직", "파트타임"],
  isBookmarked = false,
  onClick,
  variant = "default",
  showDeadline = false,
  isNew = false,
}) => {
  const isWide = variant === "wide";

  // Wide 버전일 때의 스타일
  const containerClass = isWide
    ? "bg-white rounded-lg border border-[#E5E5E5] p-6 w-full hover:shadow-md transition-shadow duration-200 cursor-pointer"
    : "bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-sm w-[294px] h-[310px] mx-auto hover:shadow-md transition-shadow duration-200 cursor-pointer flex-shrink-0";

  const titleClass = isWide
    ? "font-text text-extrabold text-primary text-[20px]"
    : "font-text text-extrabold text-primary text-[16px]";

  const positionClass = isWide
    ? "font-text text-semibold text-primary text-[16px] mb-1"
    : "font-text text-semibold text-primary text-[24px] mb-6";

  return (
    <div className={containerClass} onClick={onClick}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={titleClass}>{hospital}</h3>
        <div className="flex items-center space-x-2">
          {isNew && <Tag variant={1}>신규</Tag>}
          <div className="w-6 h-6 flex items-center justify-center cursor-pointer">
            {isBookmarked ? (
              <BookmarkFilledIcon currentColor="var(--Keycolor1)" />
            ) : (
              <BookmarkIcon currentColor="var(--Subtext2)" />
            )}
          </div>
        </div>
      </div>

      {/* 직책 */}
      {!isWide && <h4 className={positionClass}>{position}</h4>}

      {/* 위치 정보 */}
      <div className={`${isWide ? "space-y-1 mb-3" : "space-y-3 mb-6"}`}>
        {/* Wide 버전에서는 순서 반대: 경력 -> 위치 */}
        {isWide ? (
          <>
            <div className="flex items-center space-x-3 text-gray-600">
              <WalletIcon />
              <span className="text-[14px] text-sub1 font-bold">{jobType}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600">
              <LocationIcon />
              <span className="text-[14px] text-sub1 font-bold">
                {location}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-3 text-gray-600">
              <LocationIcon />
              <span className="text-[14px] text-sub1 font-bold">
                {location}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600">
              <WalletIcon />
              <span className="text-[14px] text-sub1 font-bold">{jobType}</span>
            </div>
          </>
        )}
      </div>

      {/* 태그들 */}
      <div className="flex justify-between">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Tag key={index} variant={3}>
              {tag}
            </Tag>
          ))}
        </div>
        {isWide && showDeadline && (
          <span className="font-text text-bold text-[16px] text-[#9098A4]">
            {dDay}
          </span>
        )}
      </div>
    </div>
  );
};

export default JobInfoCard;
