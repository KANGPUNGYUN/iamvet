import { HeartFilledIcon, HeartIcon } from "public/icons";
import React, { useState, useEffect } from "react";
import { Tag } from "../Tag";
import Image from "next/image";
import Link from "next/link";

interface TransferCardProps {
  id?: number | string; // transfer ID for navigation
  title: string;
  location: string;
  hospitalType: string;
  area: number; // 평수
  price: string;
  date: string;
  views: number;
  imageUrl?: string;
  categories?: string; // 병원양도, 기계장치, 의료장비, 인테리어 등
  isAd?: boolean; // 광고 여부
  isLiked?: boolean;
  onLike?: () => void;
  onClick?: () => void; // 기존 호환성을 위해 유지
}

const TransferCard: React.FC<TransferCardProps> = ({
  id,
  title = "[양도] 강남 소재 내과 병원 양도합니다",
  location = "서울 강남구",
  hospitalType = "내과",
  area = 100,
  price = "3억 양도",
  date = "2025-04-09",
  views = 127,
  imageUrl,
  categories = "병원양도",
  isAd = false,
  isLiked = false,
  onLike,
  onClick,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const defaultImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='240' viewBox='0 0 400 240'%3E%3Crect width='400' height='240' fill='%23f3f4f6'/%3E%3Ctext x='200' y='120' font-family='Arial' font-size='16' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3E병원 이미지%3C/text%3E%3C/svg%3E";

  // 카드 내용을 렌더링하는 함수
  const renderCardContent = (isMobileLayout = false) => {
    const cardClassName = isMobileLayout
      ? "w-full bg-transparent hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer rounded-[8px] flex flex-row"
      : "w-full bg-transparent hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer rounded-[16px]";

    const cardStyle = isMobileLayout
      ? {
          display: "flex",
          width: "100%",
          height: "130px",
          alignItems: "flex-start",
        }
      : {};

    const content = (
      <div className={cardClassName} style={cardStyle} onClick={onClick}>
        {isMobileLayout ? renderMobileContent() : renderDesktopContent()}
      </div>
    );

    // id가 있으면 Link로 감싸고, 없으면 그대로 반환
    if (id) {
      return (
        <Link href={`/transfers/${id}`} className="block">
          {content}
        </Link>
      );
    }

    return content;
  };

  const renderDesktopContent = () => (
    <>
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
          <Tag
            variant={
              categories === "병원양도"
                ? 2
                : categories === "기계장치"
                ? 1
                : categories === "의료장비"
                ? 4
                : 3
            }
          >
            {categories}
          </Tag>
        </div>

        {/* 좋아요 버튼 */}
        <button
          className="absolute top-[12px] right-[12px] w-[28px] h-[28px] bg-[rgba(121,116,126,0.34)] bg-opacity-90 backdrop-blur-sm rounded-full hover:bg-opacity-100 transition-all duration-200"
          onClick={(e) => {
            e.preventDefault();
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
    </>
  );

  const renderMobileContent = () => (
    <>
      {/* 이미지 영역 - 작은 화면에서는 이미지 크기 조정 */}
      <div
        className="relative flex-shrink-0 overflow-hidden"
        style={{
          width: "min(130px, 35vw)",
          height: "130px",
          minWidth: "130px",
        }}
      >
        <Image
          src={imageUrl || defaultImage}
          alt={title}
          width={130}
          height={130}
          className="w-full h-full object-cover rounded-[8px]"
        />

        {/* 좋아요 버튼 - 작은 화면에서는 더 작게 */}
        <button
          className="absolute left-[6px] top-[6px] w-[24px] h-[24px] min-[400px]:left-[8px] min-[400px]:top-[7px] bg-[rgba(121,116,126,0.34)] bg-opacity-90 backdrop-blur-sm rounded-full hover:bg-opacity-100 transition-all duration-200"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onLike?.();
          }}
        >
          {isLiked ? (
            <HeartFilledIcon size="24px" currentColor="var(--Keycolor1)" />
          ) : (
            <HeartIcon size="24px" currentColor="white" />
          )}
        </button>
      </div>

      {/* 콘텐츠 영역 - 유연한 너비 조정 */}
      <div
        className="flex-1 flex flex-col justify-between self-stretch min-w-0"
        style={{
          display: "flex",
          padding: "0px 8px",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flex: "1 1 auto",
          alignSelf: "stretch",
        }}
      >
        {/* 상단 그룹: 카테고리 + 제목 + 병원정보 + 가격 */}
        <div className="flex flex-col gap-1 w-full min-w-0">
          {/* 카테고리 태그들 - 작은 화면에서는 숨김 */}
          <div className="flex flex-wrap gap-1 mb-1">
            {isAd && <Tag variant={4}>AD</Tag>}
            <Tag
              variant={
                categories === "병원양도"
                  ? 1
                  : categories === "기계장치"
                  ? 2
                  : categories === "의료장비"
                  ? 4
                  : 3
              }
            >
              {categories}
            </Tag>
          </div>

          <h3 className="text-[14px] text-normal text-gray-900 leading-tight line-clamp-1 mb-1">
            {title}
          </h3>

          <div className="flex items-center text-[12px] text-medium text-subtext2 mb-1">
            <span className="truncate">{location}</span>
            <span className="mx-1 flex-shrink-0">·</span>
            <span className="truncate">{hospitalType}</span>
            <span className="mx-1 flex-shrink-0">·</span>
            <span className="flex-shrink-0">{area}평</span>
          </div>
        </div>

        {/* 하단 그룹: 등록일과 조회수 */}
        <div className="flex flex-col w-full">
          <div className="text-right">
            <span className="font-text text-[14px] text-extrabold leading-[150%] text-key1">
              {price}
            </span>
          </div>
          <div className="flex items-center justify-between w-full mt-auto">
            <span className="font-text text-[10px] text-medium text-subtext2 truncate">
              {date}
            </span>
            <span className="font-text text-[10px] text-medium text-subtext2 flex-shrink-0 ml-2">
              조회 {views.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </>
  );

  // 모바일이 아닌 경우 기존 데스크톱 레이아웃 반환
  if (!isMobile) {
    return renderCardContent(false);
  }

  // 모바일 레이아웃
  return renderCardContent(true);
};

export default TransferCard;
