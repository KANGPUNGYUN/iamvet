"use client";

import React from "react";
import Link from "next/link";
import { Tag } from "./Tag";
import Image from "next/image";
import { useVeterinarianProfile } from "@/hooks/api/useVeterinarianProfile";
import { useVeterinarianResume } from "@/hooks/useResume";

interface MyResumeCardProps {
  // props를 선택적으로 만들어서 실제 데이터를 우선 사용
  name?: string;
  description?: string;
  profileImage?: string;
  keywords?: string[];
}

const MyResumeCard: React.FC<MyResumeCardProps> = ({
  name: propName,
  description: propDescription,
  profileImage: propProfileImage,
  keywords: propKeywords,
}) => {
  const { data: profile, isLoading: profileLoading } = useVeterinarianProfile();
  const { data: resume, isLoading: resumeLoading } = useVeterinarianResume();

  // 이력서가 작성되었는지 확인
  const hasResume = resume && resume.name;
  
  // 실제 데이터가 있으면 사용하고, 없으면 props나 기본값 사용
  const name = resume?.name || profile?.nickname || propName || "닉네임을 설정해주세요";
  const description = resume?.introduction || resume?.selfIntroduction || (profile as any)?.experience || propDescription || "자기소개를 작성해주세요";
  
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

  // 이력서에서 키워드 추출 (specialties, medicalCapabilities 등에서)
  const getResumeKeywords = () => {
    if (!resume) return propKeywords || ["전문 분야를 설정해주세요"];
    
    const keywords = [];
    
    // 전공 분야 (specialties) - 한국어로 변환
    if (resume.specialties && resume.specialties.length > 0) {
      const translatedSpecialties = resume.specialties
        .map(specialty => getKoreanLabel(specialty))
        .slice(0, 3); // 최대 3개만
      keywords.push(...translatedSpecialties);
    }
    
    // 진료상세역량에서 추가 키워드 (부족할 때만) - 한국어로 변환
    if (keywords.length < 3 && resume.medicalCapabilities && resume.medicalCapabilities.length > 0) {
      const remainingSlots = 3 - keywords.length;
      const capabilities = resume.medicalCapabilities
        .filter(cap => cap.field && cap.field.trim())
        .map(cap => getKoreanLabel(cap.field))
        .slice(0, remainingSlots);
      keywords.push(...capabilities);
    }
    
    // 직무 정보 (부족할 때만) - 한국어로 변환
    if (keywords.length < 3 && resume.position) {
      keywords.push(getKoreanLabel(resume.position));
    }
    
    return keywords.filter(Boolean).length > 0 ? keywords : ["전문 분야를 설정해주세요"];
  };
  
  const keywords = getResumeKeywords();
  
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

  const profileImageSrc = resume?.photo || profile?.profileImage || propProfileImage;
  const hasProfileImage = isValidImageUrl(profileImageSrc);

  if (profileLoading || resumeLoading) {
    return (
      <div className="bg-white w-full lg:max-w-[395px] mx-auto rounded-[16px] border border-[#EFEFF0] p-[16px] lg:p-[20px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[20px] font-bold text-primary">내 이력서</h2>
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
              <div key={i} className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white w-full lg:max-w-[395px] mx-auto rounded-[16px] border border-[#EFEFF0] p-[16px] lg:p-[20px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-bold text-primary">내 이력서</h2>
        <Link
          href="/dashboard/veterinarian/resume"
          className="text-key1 text-[16px] font-bold no-underline hover:underline hover:underline-offset-[3px]"
        >
          수정하기
        </Link>
      </div>

      {hasResume ? (
        // 이력서가 있을 때 - 기존 스타일링 유지
        <div className="flex flex-col gap-[16px]">
          <div className="flex gap-[18px] items-center">
            {hasProfileImage ? (
              <Image
                src={profileImageSrc!}
                alt="내 프로필"
                width={92}
                height={92}
                className="w-[92px] h-[92px] rounded-full object-cover"
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
        // 이력서가 없을 때 - 안내 메시지 표시
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-gray-600 text-[16px] mb-2">
            이력서를 작성해주세요
          </p>
          <p className="text-gray-500 text-[14px] mb-4">
            나의 경력과 전문성을 보여주는 이력서를 작성하여<br />
            더 많은 기회를 만나보세요
          </p>
          <Link
            href="/dashboard/veterinarian/resume"
            className="inline-flex items-center px-4 py-2 bg-key1 text-white text-[14px] font-medium rounded-lg hover:bg-key1/90 transition-colors"
          >
            이력서 작성하기
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyResumeCard;
