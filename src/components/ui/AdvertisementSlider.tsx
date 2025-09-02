"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface Advertisement {
  id: string;
  imageUrl: string;
  imageLargeUrl: string;
  linkUrl?: string;
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
      className={`relative w-full h-[140px] md:h-[144px] rounded-[16px] overflow-hidden ${className}`}
    >
      {/* 이미지 컨테이너 */}
      <div
        className="relative w-full h-full cursor-pointer group"
        onClick={handleAdClick}
      >
        {/* 모바일용 이미지 */}
        <Image
          src={currentAd.imageUrl}
          alt={`Advertisement ${currentIndex + 1}`}
          fill
          className="md:hidden object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="100vw"
        />
        
        {/* 데스크톱용 이미지 */}
        <Image
          src={currentAd.imageLargeUrl}
          alt={`Advertisement ${currentIndex + 1}`}
          fill
          className="hidden md:block object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 1200px) 100vw, 1200px"
        />

        {/* 페이지 인디케이터 */}
        {advertisements.length > 1 && (
          <div className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-full px-3 py-1">
            <span className="text-white text-sm font-medium">
              {currentIndex + 1}/{advertisements.length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvertisementSlider;
