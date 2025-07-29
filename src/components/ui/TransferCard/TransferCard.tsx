import { HeartFilledIcon, HeartIcon } from "public/icons";
import React from "react";
import { Tag } from "../Tag";
import Image from "next/image";

interface TransferCardProps {
  title: string;
  location: string;
  hospitalType: string;
  area: number; // 평수
  price: string;
  date: string;
  views: number;
  imageUrl?: string;
  categories?: string[]; // 병원양도, 기계장치, 의료장비, 인테리어 등
  isAd?: boolean; // 광고 여부
  isLiked?: boolean;
  onLike?: () => void;
  onClick?: () => void;
}

const TransferCard: React.FC<TransferCardProps> = ({
  title = "[양도] 강남 소재 내과 병원 양도합니다",
  location = "서울 강남구",
  hospitalType = "내과",
  area = 100,
  price = "3억 양도",
  date = "2025-04-09",
  views = 127,
  imageUrl,
  categories = ["병원양도"],
  isAd = false,
  isLiked = false,
  onLike,
  onClick,
}) => {
  const defaultImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='240' viewBox='0 0 400 240'%3E%3Crect width='400' height='240' fill='%23f3f4f6'/%3E%3Ctext x='200' y='120' font-family='Arial' font-size='16' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3E병원 이미지%3C/text%3E%3C/svg%3E";

  return (
    <div
      className="w-full bg-transparent shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer rounded-[16px] border border-[1px] border-[#EFEFF0]"
      onClick={onClick}
    >
      {/* 이미지 영역 */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageUrl || defaultImage}
          alt={title}
          width={400}
          height={240}
          className="w-full h-full object-cover"
        />

        {/* 카테고리 태그들 */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {isAd && <Tag variant={4}>AD</Tag>}
          {categories.map((category, index) => (
            <Tag key={index} variant={1}>
              {category}
            </Tag>
          ))}
        </div>

        {/* 좋아요 버튼 */}
        <button
          className="absolute top-[12px] right-[12px] w-[28px] h-[28px] bg-[rgba(121,116,126,0.34)] bg-opacity-90 backdrop-blur-sm rounded-full hover:bg-opacity-100 transition-all duration-200"
          onClick={(e) => {
            e.stopPropagation();
            onLike?.();
          }}
        >
          {isLiked ? (
            <HeartFilledIcon size="28px" currentColor="var(--Keycolor1)" />
          ) : (
            <HeartIcon size="28px" currentColor="white" />
          )}
        </button>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="p-[12px]">
        <h3 className="text-[18px] text-semibold text-gray-900 mb-2 truncate leading-relaxed">
          {title}
        </h3>

        {/* 병원 정보 */}
        <div className="mb-3">
          <div className="flex items-center text-[14px] text-medium text-subtext2 mb-1">
            <span>{location}</span>
            <span className="mx-1">·</span>
            <span>{hospitalType}</span>
            <span className="mx-1">·</span>
            <span>{area}평</span>
          </div>
        </div>

        {/* 가격 */}
        <div className="mb-2 text-end">
          <span className="font-text text-[20px] text-extrabold leading-[150%] text-key1">
            {price}
          </span>
        </div>

        {/* 등록일과 조회수 */}
        <div className="flex items-center justify-between">
          <span className="font-text text-[14px] text-medium text-subtext2">
            {date}
          </span>
          <span className="font-text text-[14px] text-medium text-subtext2">
            조회 {views.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransferCard;
