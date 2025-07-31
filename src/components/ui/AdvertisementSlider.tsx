"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface Advertisement {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  description?: string;
}

interface AdvertisementSliderProps {
  advertisements: Advertisement[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

const AdvertisementSlider: React.FC<AdvertisementSliderProps> = ({
  advertisements,
  autoPlay = true,
  autoPlayInterval = 5000,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || advertisements.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === advertisements.length - 1 ? 0 : prevIndex + 1
      );
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, advertisements.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      currentIndex === 0 ? advertisements.length - 1 : currentIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex(
      currentIndex === advertisements.length - 1 ? 0 : currentIndex + 1
    );
  };

  if (advertisements.length === 0) {
    return null;
  }

  const currentAd = advertisements[currentIndex];

  const handleAdClick = () => {
    if (currentAd.linkUrl) {
      window.open(currentAd.linkUrl, "_blank");
    }
  };

  return (
    <div
      className={`relative w-full h-[140px] md:h-[144px] rounded-[16px] overflow-hidden bg-[#D8F9FB] ${className}`}
    >
      {/* 메인 광고 컨테이너 */}
      <div
        className="relative w-full h-full cursor-pointer group px-[60px] py-[45px]"
        onClick={handleAdClick}
      >
        {/* 배경 이미지 - 가운데 정렬로 280px 너비 */}
        <div className="absolute right-[20%] top-1/2 -translate-y-1/2 lg:w-[280px] w-[160px] h-full">
          <Image
            src={currentAd.imageUrl}
            alt={currentAd.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="280px"
          />
        </div>

        {/* 콘텐츠 */}
        <div className="absolute inset-0 flex flex-row-reverse justify-between p-[20px] md:p-[32px] text-black">
          <div className="flex justify-end">
            {/* 페이지 인디케이터 */}
            <div className="flex items-start gap-[8px] px-[12px] py-[6px] rounded-full">
              <span className="font-text text-[12px] md:text-[14px] font-medium">
                {currentIndex + 1}
                <span className="text-subtext2">/{advertisements.length}</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-[8px] md:gap-[12px]">
            <h3 className="font-title text-[18px] md:text-[24px] font-bold leading-[130%] line-clamp-2">
              {currentAd.title}
            </h3>
            {currentAd.description && (
              <p className="font-text text-[14px] md:text-[16px] text-black/90 line-clamp-2">
                {currentAd.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvertisementSlider;
