"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMyJobs } from "@/hooks/useMyJobs";

interface Job {
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

const MyJobsCard: React.FC = () => {
  const router = useRouter();
  const { data, error, isLoading } = useMyJobs(2); // 최대 2개만 가져오기

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isDeadlineClose = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7; // 7일 이내면 마감 임박
  };

  const getDeadlineText = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "마감";
    if (diffDays === 0) return "오늘 마감";
    if (diffDays <= 7) return `${diffDays}일 후 마감`;
    return formatDate(deadline);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-[16px] border border-[#EFEFF0] p-[20px] w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[18px] font-semibold text-[#3B394D]">
            내 채용공고
          </h3>
        </div>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff8796]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-[16px] border border-[#EFEFF0] p-[20px] w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[18px] font-semibold text-[#3B394D]">
            내 채용공고
          </h3>
        </div>
        <div className="text-center py-8">
          <p className="text-red-500">채용공고를 불러오는데 실패했습니다.</p>
        </div>
      </div>
    );
  }

  const jobs = data?.data?.jobs || [];

  return (
    <div className="bg-white rounded-[16px] border border-[#EFEFF0] p-[20px] w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[18px] font-semibold text-[#3B394D]">
          내 채용공고
        </h3>
        <Link
          href="/dashboard/hospital/my-jobs"
          className="text-[14px] text-[#FF8796] hover:underline"
        >
          전체보기
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-8">
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
          <button
            onClick={() => router.push("/dashboard/hospital/my-jobs/create")}
            className="inline-flex items-center px-4 py-2 bg-[#FF8796] text-white text-[14px] rounded-lg hover:bg-[#ffb7b8] transition-colors"
          >
            채용공고 등록
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job: Job) => (
            <div
              key={job.id}
              className="border border-[#EFEFF0] rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => router.push(`/jobs/${job.id}`)}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-[16px] font-medium text-[#3B394D] line-clamp-1 flex-1 mr-2">
                  {job.title}
                </h4>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isDeadlineClose(job.deadline) && (
                    <span className="px-2 py-1 bg-red-100 text-red-600 text-[12px] rounded-full">
                      마감임박
                    </span>
                  )}
                  <span className="text-[12px] text-[#9098A4]">
                    {getDeadlineText(job.deadline)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[14px] text-[#9098A4]">
                <span>{job.employmentType}</span>
                <span>{job.experience}</span>
                <span>조회 {job.viewCount}회</span>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-[12px] rounded-full ${
                      job.isActive
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {job.isActive ? "진행중" : "마감"}
                  </span>
                  {job.isDraft && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-600 text-[12px] rounded-full">
                      임시저장
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/dashboard/hospital/my-jobs/edit/${job.id}`);
                  }}
                  className="text-[12px] text-[#FF8796] hover:underline"
                >
                  수정
                </button>
              </div>
            </div>
          ))}

          {jobs.length >= 2 && (
            <div className="text-center pt-2">
              <Link
                href="/dashboard/hospital/my-jobs"
                className="text-[14px] text-[#FF8796] hover:underline"
              >
                더 많은 공고 보기
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyJobsCard;
