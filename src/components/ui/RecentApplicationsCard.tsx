"use client";

import React from "react";
import Link from "next/link";
import { Tag } from "./Tag";

interface ApplicationData {
  id: number;
  applicationDate: string;
  applicant: string;
  position: string;
  contact: string;
  status: "서류 합격" | "면접 대기" | "불합격" | "최종합격";
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
    <div className="bg-white w-full mx-auto rounded-[16px] border border-[#EFEFF0] p-[16px] lg:p-[20px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-bold text-primary">최근 지원 내역</h2>
        <Link
          href="/dashboard/veterinarian/applications"
          className="text-key1 text-[16px] font-bold no-underline hover:underline hover:underline-offset-[3px]"
        >
          전체보기
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-box-light rounded-[8px] border border-[#EFEFF0]">
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                지원일자
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                지원자
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                지원 포지션
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                연락처/이메일
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                상태
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                관리
              </th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application.id} className="border-b border-gray-100">
                <td className="py-4 px-2 text-sm text-gray-900">
                  {application.applicationDate}
                </td>
                <td className="py-4 px-2 text-sm text-gray-900">
                  {application.applicant}
                </td>
                <td className="py-4 px-2 text-sm text-gray-900">
                  {application.position}
                </td>
                <td className="py-4 px-2 text-sm text-gray-600">
                  {application.contact}
                </td>
                <td className="py-4 px-2">
                  <Tag variant={getStatusVariant(application.status)}>
                    {application.status}
                  </Tag>
                </td>
                <td className="py-4 px-2">
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
