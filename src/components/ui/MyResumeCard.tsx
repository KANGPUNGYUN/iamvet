"use client";

import React from "react";
import Link from "next/link";
import { Tag } from "./Tag";
import Image from "next/image";
import profileImg from "@/assets/images/profile.png";

interface MyResumeCardProps {
  name: string;
  description: string;
  profileImage: string;
  keywords: string[];
}

const MyResumeCard: React.FC<MyResumeCardProps> = ({
  name = "김수의",
  description = "소동물 임상 5년 경력/책임 다수",
  profileImage = "/profile-placeholder.png",
  keywords = ["내과", "외과", "정규직", "케어직", "파트타임"],
}) => {
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

      <div className="flex flex-col gap-[16px]">
        <div className="flex gap-[18px] items-center">
          <Image
            src={profileImg}
            alt="내 프로필"
            width={92}
            height={92}
            className="w-[92px] h-[92px] rounded-full object-cover"
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

export default MyResumeCard;
