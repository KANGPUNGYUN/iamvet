"use client";

import React from "react";
import Link from "next/link";
import { Tag } from "./Tag";
import Image, { StaticImageData } from "next/image";
import { useHospitalProfile } from "@/hooks/api/useHospitalProfile";

interface HospitalProfileCardProps {
  // props를 선택적으로 만들어서 실제 데이터를 우선 사용
  name?: string;
  description?: string;
  profileImage?: string | StaticImageData;
  keywords?: string[];
}

const HospitalProfileCard: React.FC<HospitalProfileCardProps> = ({
  name: propName,
  description: propDescription,
  profileImage: propProfileImage,
  keywords: propKeywords,
}) => {
  const { data: profile, isLoading } = useHospitalProfile();

  // 실제 프로필 데이터가 있으면 사용하고, 없으면 props나 기본값 사용
  const name = profile?.hospitalName || propName || "병원명을 설정해주세요";
  const description =
    profile?.description || propDescription || "병원 소개를 작성해주세요";
  const keywords = propKeywords || ["진료 분야를 설정해주세요"];

  // 프로필 이미지가 있는지 확인
  const hasProfileImage =
    propProfileImage && propProfileImage !== "/hospital-placeholder.png";

  if (isLoading) {
    return (
      <div className="bg-white w-full lg:max-w-[395px] mx-auto rounded-[16px] border border-[#EFEFF0] p-[16px] lg:p-[20px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[20px] font-bold text-primary">병원 프로필</h2>
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
              <div
                key={i}
                className="w-16 h-6 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white w-full lg:max-w-[395px] mx-auto rounded-[16px] border border-[#EFEFF0] p-[16px] lg:p-[20px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-bold text-primary">병원 프로필</h2>
        <Link
          href="/dashboard/hospital/profile/edit"
          className="text-key1 text-[16px] font-bold no-underline hover:underline hover:underline-offset-[3px]"
        >
          수정하기
        </Link>
      </div>

      <div className="flex flex-col gap-[16px]">
        <div className="flex gap-[18px] items-center">
          {hasProfileImage ? (
            <Image
              src={propProfileImage!}
              alt="병원 프로필"
              width={92}
              height={92}
              className="w-[92px] h-[92px] rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                // 이미지 로드 실패 시 대체 div를 보여주기 위해 부모에게 이벤트 전달
                const parent = target.parentElement;
                if (parent) {
                  const fallbackDiv = parent.querySelector(".fallback-avatar");
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
    </div>
  );
};

export default HospitalProfileCard;
