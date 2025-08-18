"use client";

import React from "react";
import Link from "next/link";
import { Tag } from "./Tag";

interface RecruitmentData {
  newApplicants: number;
  interviewScheduled: number;
  hired: number;
}

interface RecruitmentStatusCardProps {
  recruitmentData?: RecruitmentData;
}

const DonutChart: React.FC<{ data: RecruitmentData }> = ({ data }) => {
  const [animated, setAnimated] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const total = data.newApplicants + data.interviewScheduled + data.hired;

  if (total === 0) {
    return (
      <div className="w-[178px] h-[178px] rounded-full border-8 border-[#EFEFF0] flex items-center justify-center">
        <span className="text-gray-400 text-sm">데이터 없음</span>
      </div>
    );
  }

  const newApplicantsPercentage = (data.newApplicants / total) * 100;
  const interviewScheduledPercentage = (data.interviewScheduled / total) * 100;
  const hiredPercentage = (data.hired / total) * 100;

  const radius = 65;
  const circumference = 2 * Math.PI * radius;

  const newApplicantsStrokeLength = animated
    ? (newApplicantsPercentage / 100) * circumference
    : 0;
  const interviewScheduledStrokeLength = animated
    ? (interviewScheduledPercentage / 100) * circumference
    : 0;
  const hiredStrokeLength = animated
    ? (hiredPercentage / 100) * circumference
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

        {/* 신규 지원자 - 진한 핑크 */}
        <circle
          cx="89"
          cy="89"
          r={radius}
          fill="transparent"
          stroke="#FF8796"
          strokeWidth="16"
          strokeDasharray={`${newApplicantsStrokeLength} ${circumference}`}
          strokeDashoffset="0"
          className="transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />

        {/* 면접 예정 - 연한 핑크 */}
        <circle
          cx="89"
          cy="89"
          r={radius}
          fill="transparent"
          stroke="#FFD3D3"
          strokeWidth="16"
          strokeDasharray={`${interviewScheduledStrokeLength} ${circumference}`}
          strokeDashoffset={-newApplicantsStrokeLength}
          className="transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />

        {/* 채용 완료 - 어두운 회색 */}
        <circle
          cx="89"
          cy="89"
          r={radius}
          fill="transparent"
          stroke="#4F5866"
          strokeWidth="16"
          strokeDasharray={`${hiredStrokeLength} ${circumference}`}
          strokeDashoffset={
            -(newApplicantsStrokeLength + interviewScheduledStrokeLength)
          }
          className="transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

const RecruitmentStatusCard: React.FC<RecruitmentStatusCardProps> = ({
  recruitmentData = {
    newApplicants: 1,
    interviewScheduled: 1,
    hired: 1,
  },
}) => {
  return (
    <div className="bg-white w-full lg:max-w-[676px] mx-auto rounded-[16px] border border-[#EFEFF0] p-[16px] lg:p-[20px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-bold text-primary">채용 현황</h2>
        <Link
          href="/dashboard/hospital/applicants"
          className="text-key1 text-[16px] font-bold no-underline hover:underline hover:underline-offset-[3px]"
        >
          전체보기
        </Link>
      </div>

      <div className="flex flex-col xl:flex-row items-center gap-[52px]">
        <DonutChart data={recruitmentData} />

        <div className="flex-1 space-y-4 w-full">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-text text-[18px] text-bold text-primary">
                신규 지원자
              </span>
            </div>
            <Tag variant={2}>{recruitmentData.newApplicants}건</Tag>
          </div>
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-text text-[18px] text-bold text-primary">
                면접 예정
              </span>
            </div>
            <Tag variant={1}>{recruitmentData.interviewScheduled}건</Tag>
          </div>
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-text text-[18px] text-bold text-primary">
                채용 완료
              </span>
            </div>
            <Tag variant={4}>{recruitmentData.hired}건</Tag>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentStatusCard;