"use client";

import React, { useState, useEffect } from "react";

interface Advertisement {
  id: string;
  imageUrl: string;
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
        {/* 이미지 */}
        <img
          src={currentAd.imageUrl}
          alt={`Advertisement ${currentIndex + 1}`}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            console.error('Image failed to load:', currentAd.imageUrl);
            // 폴백 이미지 또는 플레이스홀더 표시
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNTAgMTUwSDQ1MFYyNTBIMzUwVjE1MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2Zz4K';
          }}
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
