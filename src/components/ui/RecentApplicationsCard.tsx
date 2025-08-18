"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Tag } from "./Tag";
import { ArrowRightIcon } from "public/icons";
import profileImg from "@/assets/images/profile.png";

interface ApplicationData {
  id: number;
  applicationDate: string;
  applicant: string;
  position: string;
  contact: string;
  status: "서류 합격" | "면접 대기" | "불합격" | "최종합격";
  profileImage?: string;
}

interface RecentApplicationsCardProps {
  applications?: ApplicationData[];
}

const getStatusVariant = (status: ApplicationData["status"]) => {
  switch (status) {
    case "서류 합격":
      return 2;
    case "면접 대기":
      return 1;
    case "불합격":
      return 6;
    case "최종합격":
      return 1;
    default:
      return 3;
  }
};

const MobileApplicationCard: React.FC<{ application: ApplicationData }> = ({
  application,
}) => {
  return (
    <div className="bg-white border border-[#EFEFF0] rounded-[12px] p-4 mb-3">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Image
            src={application.profileImage || profileImg}
            alt="프로필"
            width={36}
            height={36}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="text-[16px] font-bold text-primary">
            {application.applicant}
          </span>
        </div>
        <Link href={`/jobs/${application.id}`}>
          <ArrowRightIcon size="20" />
        </Link>
      </div>

      <div className="flex flex-col gap-[4px]">
        <div className="flex gap-[20px]">
          <span className="text-[14px] text-gray-500 block w-[70px]">
            지원 포지션
          </span>
          <span className="text-[14px] text-primary font-medium">
            {application.position}
          </span>
        </div>
        <div className="flex gap-[20px]">
          <span className="text-[14px] text-gray-500 block w-[70px]">
            연락처
          </span>
          <span className="text-[14px] text-gray-700">
            {application.contact}
          </span>
        </div>
      </div>

      <div className="mt-[20px] flex items-center justify-between">
        <span className="text-[12px] text-gray-500">
          {application.applicationDate}
        </span>
        <Tag variant={getStatusVariant(application.status)}>
          {application.status}
        </Tag>
      </div>
    </div>
  );
};

const RecentApplicationsCard: React.FC<RecentApplicationsCardProps> = ({
  applications = [
    {
      id: 1,
      applicationDate: "2024.05.03 19:01",
      applicant: "강남 동물병원",
      position: "내과 전문의",
      contact: "010-1234-5678 / duwxr335@naver.com",
      status: "서류 합격",
    },
    {
      id: 2,
      applicationDate: "2024.05.03 19:01",
      applicant: "강남 수의사",
      position: "일반 수의사",
      contact: "010-1234-5678 / duwxr335@naver.com",
      status: "면접 대기",
    },
    {
      id: 3,
      applicationDate: "2024.05.03 19:01",
      applicant: "강남 중금 수의사",
      position: "야간 수의사",
      contact: "010-1234-5678 / duwxr335@naver.com",
      status: "불합격",
    },
  ],
}) => {
  return (
    <div className="bg-white w-full mx-auto rounded-[16px] border border-[#EFEFF0] p-[16px] xl:p-[20px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-bold text-primary">최근 지원 내역</h2>
        <Link
          href="/dashboard/veterinarian/applications"
          className="text-key1 text-[16px] font-bold no-underline hover:underline hover:underline-offset-[3px]"
        >
          전체보기
        </Link>
      </div>

      {/* 모바일 버전 (xl 이하) */}
      <div className="block xl:hidden">
        {applications.slice(0, 3).map((application) => (
          <MobileApplicationCard
            key={application.id}
            application={application}
          />
        ))}
      </div>

      {/* 데스크톱 버전 (xl 이상) */}
      <div className="hidden xl:block overflow-x-auto">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-box-light">
              <th className="text-left py-[22px] pl-[30px] text-sm font-medium text-gray-500 border border-[#EFEFF0] border-r-0 rounded-l-[8px]">
                지원일자
              </th>
              <th className="text-left py-[22px] text-sm font-medium text-gray-500 border-t border-b border-[#EFEFF0]">
                지원자
              </th>
              <th className="text-left py-[22px] text-sm font-medium text-gray-500 border-t border-b border-[#EFEFF0]">
                지원 포지션
              </th>
              <th className="text-left py-[22px] text-sm font-medium text-gray-500 border-t border-b border-[#EFEFF0]">
                연락처/이메일
              </th>
              <th className="text-left py-[22px] text-sm font-medium text-gray-500 border-t border-b border-[#EFEFF0]">
                상태
              </th>
              <th className="text-left py-[22px] pr-[30px] text-sm font-medium text-gray-500 border border-[#EFEFF0] border-l-0 rounded-r-[8px]">
                관리
              </th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application.id} className="border-b border-gray-100">
                <td className="py-[22px] pl-[30px] text-sm text-gray-900">
                  {application.applicationDate}
                </td>
                <td className="py-[22px] text-sm text-gray-900">
                  {application.applicant}
                </td>
                <td className="py-[22px] text-sm text-gray-900">
                  {application.position}
                </td>
                <td className="py-[22px] text-sm text-gray-600">
                  {application.contact}
                </td>
                <td className="py-[22px]">
                  <Tag variant={getStatusVariant(application.status)}>
                    {application.status}
                  </Tag>
                </td>
                <td className="py-[22px] pr-[30px]">
                  <Link
                    href={`/jobs/${application.id}`}
                    className="text-key1 text-[16px] font-bold no-underline hover:underline hover:underline-offset-[3px]"
                  >
                    상세보기
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentApplicationsCard;
