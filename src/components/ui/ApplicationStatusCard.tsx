"use client";

import React from "react";
import Link from "next/link";
import { Tag } from "./Tag";

interface StatusData {
  applying: number;
  documentPassed: number;
  finalPassed: number;
  rejected: number;
}

interface ApplicationStatusCardProps {
  statusData?: StatusData;
}

const DonutChart: React.FC<{ data: StatusData }> = ({ data }) => {
  const [animated, setAnimated] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const total =
    data.applying + data.documentPassed + data.finalPassed + data.rejected;

  if (total === 0) {
    return (
      <div className="w-[178px] h-[178px] rounded-full border-8 border-[#EFEFF0] flex items-center justify-center">
        <span className="text-gray-400 text-sm">데이터 없음</span>
      </div>
    );
  }

  const applyingPercentage = (data.applying / total) * 100;
  const documentPassedPercentage = (data.documentPassed / total) * 100;
  const finalPassedPercentage = (data.finalPassed / total) * 100;
  const rejectedPercentage = (data.rejected / total) * 100;

  const radius = 65;
  const circumference = 2 * Math.PI * radius;

  const applyingStrokeLength = animated
    ? (applyingPercentage / 100) * circumference
    : 0;
  const documentPassedStrokeLength = animated
    ? (documentPassedPercentage / 100) * circumference
    : 0;
  const finalPassedStrokeLength = animated
    ? (finalPassedPercentage / 100) * circumference
    : 0;
  const rejectedStrokeLength = animated
    ? (rejectedPercentage / 100) * circumference
    : 0;

  return (
    <div className="relative w-[178px] h-[178px]">
      <svg
        className="w-[178px] h-[178px] -rotate-90"
        viewBox="0 0 178 178"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 배경 원 */}
        <circle
          cx="89"
          cy="89"
          r={radius}
          fill="transparent"
          stroke="#EFEFF0"
          strokeWidth="16"
        />

        {/* 지원중 - 어두운 회색 */}
        <circle
          cx="89"
          cy="89"
          r={radius}
          fill="transparent"
          stroke="#4F5866"
          strokeWidth="16"
          strokeDasharray={`${applyingStrokeLength} ${circumference}`}
          strokeDashoffset="0"
          className="transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />

        {/* 서류합격 - 연한 핑크 */}
        <circle
          cx="89"
          cy="89"
          r={radius}
          fill="transparent"
          stroke="#FFD3D3"
          strokeWidth="16"
          strokeDasharray={`${documentPassedStrokeLength} ${circumference}`}
          strokeDashoffset={-applyingStrokeLength}
          className="transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />

        {/* 최종합격 - 진한 핑크 */}
        <circle
          cx="89"
          cy="89"
          r={radius}
          fill="transparent"
          stroke="#FF8796"
          strokeWidth="16"
          strokeDasharray={`${finalPassedStrokeLength} ${circumference}`}
          strokeDashoffset={
            -(applyingStrokeLength + documentPassedStrokeLength)
          }
          className="transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />

        {/* 불합격 - 연한 회색 */}
        <circle
          cx="89"
          cy="89"
          r={radius}
          fill="transparent"
          stroke="#EFEFF0"
          strokeWidth="16"
          strokeDasharray={`${rejectedStrokeLength} ${circumference}`}
          strokeDashoffset={
            -(
              applyingStrokeLength +
              documentPassedStrokeLength +
              finalPassedStrokeLength
            )
          }
          className="transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

const ApplicationStatusCard: React.FC<ApplicationStatusCardProps> = ({
  statusData = {
    applying: 1,
    documentPassed: 1,
    finalPassed: 1,
    rejected: 1,
  },
}) => {
  return (
    <div className="bg-white w-full lg:max-w-[676px] mx-auto rounded-[16px] border border-[#EFEFF0] p-[16px] lg:p-[20px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-bold text-primary">지원 현황</h2>
        <Link
          href="/dashboard/veterinarian/applications"
          className="text-key1 text-[16px] font-bold no-underline hover:underline hover:underline-offset-[3px]"
        >
          전체보기
        </Link>
      </div>

      <div className="flex flex-col xl:flex-row items-center gap-[52px]">
        <DonutChart data={statusData} />

        <div className="flex-1 space-y-4 w-full">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-text text-[18px] text-bold text-primary">
                지원중
              </span>
            </div>
            <Tag variant={4}>{statusData.applying}건</Tag>
          </div>
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-text text-[18px] text-bold text-primary">
                서류 합격
              </span>
            </div>
            <Tag variant={1}>{statusData.documentPassed}건</Tag>
          </div>
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-text text-[18px] text-bold text-primary">
                최종 합격
              </span>
            </div>
            <Tag variant={2}>{statusData.finalPassed}건</Tag>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatusCard;
