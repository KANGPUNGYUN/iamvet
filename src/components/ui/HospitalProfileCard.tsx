"use client";

import React from "react";
import Link from "next/link";
import { Tag } from "./Tag";
import Image, { StaticImageData } from "next/image";

interface HospitalProfileCardProps {
  name: string;
  description: string;
  profileImage: string | StaticImageData;
  keywords: string[];
}

const HospitalProfileCard: React.FC<HospitalProfileCardProps> = ({
  name = "서울 강남 동물병원",
  description = "내 동물병원 지료하는 반려동물 종양병원입니다. 반려인과 고양이 내과병원",
  profileImage = "/hospital-placeholder.png",
  keywords = ["반려견", "고양이", "소동물", "내과", "외과", "행동 교정"],
}) => {
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
          <Image
            src={profileImage}
            alt="병원 프로필"
            width={92}
            height={92}
            className="w-[92px] h-[92px] rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/default-hospital.png";
            }}
          />

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