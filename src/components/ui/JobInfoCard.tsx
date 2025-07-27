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
}) => {
  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-sm w-[294px] h-[310px] mx-auto hover:shadow-md transition-shadow duration-200 cursor-pointer flex-shrink-0"
      onClick={onClick}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-text text-extrabold text-primary text-[16px]">
          {hospital}
        </h3>
        <div className="flex items-center space-x-2">
          <Tag variant={1}>{dDay}</Tag>
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
      <h4 className="font-text text-semibold text-primary text-[24px] mb-6">
        {position}
      </h4>

      {/* 위치 정보 */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-3 text-gray-600">
          <LocationIcon />
          <span className="text-[14px] text-sub1 font-bold">{location}</span>
        </div>
        <div className="flex items-center space-x-3 text-gray-600">
          <WalletIcon />
          <span className="text-[14px] text-sub1 font-bold">{jobType}</span>
        </div>
      </div>

      {/* 태그들 */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Tag key={index} variant={3}>
            {tag}
          </Tag>
        ))}
      </div>
    </div>
  );
};

export default JobInfoCard;
