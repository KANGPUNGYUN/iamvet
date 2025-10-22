"use client";

import React from "react";
import Link from "next/link";
import JobInfoCard from "./JobInfoCard";
import { convertDDayToNumber } from "@/utils/dDayConverter";
import { useMyJobs } from "@/hooks/useMyJobs";

interface JobData {
  id: string;
  title: string;
  content: string;
  employmentType: string;
  experience: string;
  education: string;
  salary: string;
  workDays: string;
  workHours: string;
  location: string;
  address: string;
  detailAddress: string | null;
  benefits: string[];
  requiredDocuments: string[];
  specialties: string[];
  preferredConditions: string[];
  deadline: string;
  viewCount: number;
  isActive: boolean;
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
  hospitalId: string;
  isLiked?: boolean;
  hospital?: {
    id: string;
    name: string;
    profileImage: string | null;
    phone: string;
    location: string;
    address: string;
  };
}

interface UrgentJobsCardProps {
  // props는 더 이상 필요하지 않음 (API에서 가져오므로)
}

const UrgentJobsCard: React.FC<UrgentJobsCardProps> = () => {
  const { data, error, isLoading } = useMyJobs(2); // 최대 2개만 가져오기

  const formatDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "마감";
    if (diffDays === 0) return "오늘 마감";
    if (diffDays <= 30) return `D-${diffDays}`;
    return "진행중";
  };

  const isJobNew = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const today = new Date();
    const diffTime = today.getTime() - createdDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7; // 7일 이내면 신규
  };

  const jobs = data?.data?.jobs || [];

  return (
    <div className="bg-white w-full lg:max-w-[714px] mx-auto rounded-[16px] border border-[#EFEFF0] p-[16px] lg:p-[20px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-bold text-primary">내 채용 공고</h2>
        <Link
          href="/dashboard/hospital/my-jobs"
          className="text-key1 text-[16px] font-bold no-underline hover:underline hover:underline-offset-[3px]"
        >
          전체보기
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff8796]"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">채용공고를 불러오는데 실패했습니다.</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-[#9098A4] text-[16px] mb-2">
            아직 생성한 공고가 없습니다.
          </p>
          <p className="text-[#9098A4] text-[14px] mb-4">
            새로운 채용공고를 등록해보세요.
          </p>
          <Link
            href="/dashboard/hospital/my-jobs/create"
            className="inline-flex items-center px-4 py-2 bg-[#FF8796] text-white text-[14px] rounded-lg hover:bg-[#ffb7b8] transition-colors"
          >
            채용공고 등록
          </Link>
        </div>
      ) : (
        <div className="flex flex-col xl:flex-row gap-[14px]">
          {jobs.slice(0, 2).map((job: JobData) => (
            <JobInfoCard
              key={job.id}
              hospital={job.hospital?.name || "병원명"}
              dDay={convertDDayToNumber(
                formatDeadline(job.deadline || new Date().toISOString())
              )}
              position={job.title || "채용공고"}
              location={job.location || "위치 미정"}
              jobType={job.experience || "경력 무관"}
              tags={[
                job.employmentType,
                ...(job.specialties || []).slice(0, 3),
              ].filter(Boolean)}
              isBookmarked={job.isLiked || false}
              isNew={isJobNew(job.createdAt || new Date().toISOString())}
              variant="wide"
              showDeadline={
                formatDeadline(job.deadline || new Date().toISOString()) !==
                "진행중"
              }
              onClick={() => {
                window.location.href = `/jobs/${job.id}`;
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UrgentJobsCard;
