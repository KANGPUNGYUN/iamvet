"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LocationIcon,
  PhoneIcon,
  WebIcon,
  ChevronRightIcon,
} from "public/icons";
import { Tag } from "./Tag";

interface HospitalCardProps {
  hospital: {
    id: string;
    name: string;
    description: string;
    location: string;
    website: string;
    phone: string;
    keywords: string[];
    image?: string;
  };
}

const HospitalCard: React.FC<HospitalCardProps> = ({ hospital }) => {
  return (
    <div className="relative rounded-[16px] border border-[#EFEFF0] flex flex-col lg:flex-row items-start gap-[20px] lg:gap-[30px] p-[20px] lg:p-[28px]">
      {/* 병원 이미지 */}
      <div className="w-[80px] h-[80px] rounded-full bg-[#EFEFF0] flex items-center justify-center flex-shrink-0">
        {hospital.image ? (
          <Image
            src={hospital.image}
            alt={hospital.name}
            width={80}
            height={80}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <span className="font-text text-[24px] font-semibold text-sub">
            {hospital.name.charAt(0)}
          </span>
        )}
      </div>

      {/* 병원 정보 */}
      <div className="flex-1">
        <h3 className="font-text text-[20px] font-semibold text-primary mb-2">
          {hospital.name}
        </h3>
        <p className="font-text text-[14px] text-sub mb-4 leading-relaxed">
          {hospital.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <LocationIcon currentColor="#4F5866" />
            <span className="font-text text-[14px] text-sub">
              {hospital.location}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <WebIcon currentColor="#4F5866" />
            <span className="font-text text-[14px] text-sub">
              {hospital.website}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <PhoneIcon currentColor="#4F5866" />
            <span className="font-text text-[14px] text-sub">
              {hospital.phone}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {hospital.keywords.map((keyword, index) => (
            <Tag key={index} variant={6}>
              {keyword}
            </Tag>
          ))}
        </div>
      </div>

      <Link
        href={`/hospitals/${hospital.id}`}
        className="absolute top-[20px] right-[20px] lg:relative lg:top-auto lg:right-auto flex items-center justify-center w-8 h-8 flex-shrink-0"
      >
        <ChevronRightIcon currentColor="#FF8796" />
      </Link>
    </div>
  );
};

export default HospitalCard;
