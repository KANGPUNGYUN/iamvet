"use client";

import React from "react";
import { Tag } from "./Tag";
import Image from "next/image";

interface ResumeCardProps {
  name: string;
  description?: string;
  profileImage?: string;
  keywords?: string[];
}

const ResumeCard: React.FC<ResumeCardProps> = ({
  name,
  description,
  profileImage,
  keywords = [],
}) => {
  // 영어 키워드를 한국어로 변환하는 매핑
  const getKoreanLabel = (keyword: string) => {
    const labelMap: { [key: string]: string } = {
      // 전공 분야 (specialties)
      'internal': '내과',
      'surgery': '외과',
      'dermatology': '피부과',
      'orthopedics': '정형외과',
      'ophthalmology': '안과',
      'dentistry': '치과',
      'emergency': '응급의학과',
      'cardiology': '심장내과',
      'neurology': '신경과',
      'oncology': '종양학과',
      'anesthesiology': '마취과',
      'radiology': '영상의학과',
      'pathology': '병리과',
      'laboratory': '임상병리과',
      
      // 직무 (position)
      'veterinarian': '수의사',
      'assistant': '수의테크니션',
      'manager': '병원장',
      'intern': '인턴',
      'resident': '전공의',
      
      // 숙련도 (proficiency)
      'beginner': '초급',
      'intermediate': '중급',
      'advanced': '고급',
      'expert': '전문가',
    };
    
    return labelMap[keyword.toLowerCase()] || keyword;
  };

  // 키워드 변환
  const translatedKeywords = keywords
    .map(keyword => getKoreanLabel(keyword))
    .slice(0, 3); // 최대 3개만

  // 프로필 이미지가 있는지 확인 (유효한 URL인지도 검증)
  const isValidImageUrl = (url: string | undefined) => {
    if (!url) return false;
    if (url === 'photo-url-placeholder') return false; // 플레이스홀더 값 제외
    try {
      // 절대 URL이거나 / 로 시작하는 상대 경로인지 확인
      return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
    } catch {
      return false;
    }
  };

  const hasProfileImage = isValidImageUrl(profileImage);

  return (
    <div className="bg-white w-full rounded-[16px] border border-[#EFEFF0] p-[16px] lg:p-[20px] hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex flex-col gap-[16px]">
        <div className="flex gap-[12px] items-center">
          {hasProfileImage ? (
            <Image
              src={profileImage!}
              alt={`${name} 프로필`}
              width={60}
              height={60}
              className="w-[60px] h-[60px] rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                // 이미지 로드 실패 시 대체 div를 보여주기 위해 부모에게 이벤트 전달
                const parent = target.parentElement;
                if (parent) {
                  const fallbackDiv = parent.querySelector('.fallback-avatar');
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
              width: "60px",
              height: "60px",
              padding: "0",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              flexShrink: 0,
              borderRadius: "50%",
              background: "var(--Keycolor1, #FF8796)",
              color: "var(--Keycolor5, #FFF7F7)",
              textAlign: "center",
              fontFamily: "var(--font-title)",
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "1",
            }}
          >
            {name.charAt(0)}
          </div>

          <div className="flex-1">
            <h3 className="text-[18px] font-text font-bold text-primary mb-1">
              {name}
            </h3>
            {description && (
              <p className="text-[14px] font-text text-gray-600 line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>

        {translatedKeywords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {translatedKeywords.map((keyword, index) => (
              <Tag key={index} variant={3}>
                {keyword}
              </Tag>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeCard;