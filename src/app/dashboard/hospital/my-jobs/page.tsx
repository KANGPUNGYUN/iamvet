"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeftIcon, EditIcon } from "public/icons";
import { SelectBox } from "@/components/ui/SelectBox";
import { Pagination } from "@/components/ui/Pagination/Pagination";
import JobInfoCard from "@/components/ui/JobInfoCard";
import { useMyJobs } from "@/hooks/api/useJobs";
import { Job } from "@/types/job";


export default function HospitalMyJobsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("recent");
  const [statusFilter, setStatusFilter] = useState("all");
  const itemsPerPage = 8;

  const { data: jobs = [], isLoading, error } = useMyJobs();

  const filteredAndSortedJobs = useMemo(() => {
    let filtered = [...jobs];
    
    if (statusFilter !== "all") {
      filtered = filtered.filter((job) => {
        const isExpired = job.recruitEndDate && new Date(job.recruitEndDate) < new Date();
        
        switch (statusFilter) {
          case "active":
            return job.isActive && !isExpired;
          case "expired":
            return isExpired;
          case "inactive":
            return !job.isActive;
          default:
            return true;
        }
      });
    }

    switch (sortBy) {
      case "recent":
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case "deadline":
        return filtered.sort((a, b) => {
          if (!a.recruitEndDate && !b.recruitEndDate) return 0;
          if (!a.recruitEndDate) return 1;
          if (!b.recruitEndDate) return -1;
          return new Date(a.recruitEndDate).getTime() - new Date(b.recruitEndDate).getTime();
        });
      default:
        return filtered;
    }
  }, [jobs, sortBy, statusFilter]);

  // 페이지네이션
  const totalPages = Math.ceil(filteredAndSortedJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = filteredAndSortedJobs.slice(startIndex, startIndex + itemsPerPage);

  const handleJobClick = (jobId: string) => {
    window.location.href = `/jobs/${jobId}`;
  };

  if (isLoading) {
    return (
      <div className="bg-white">
        <div className="max-w-[1095px] w-full mx-auto px-[16px] lg:px-[20px] pt-[30px] pb-[156px]">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-gray-500">로딩 중...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white">
        <div className="max-w-[1095px] w-full mx-auto px-[16px] lg:px-[20px] pt-[30px] pb-[156px]">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-red-500">오류가 발생했습니다: {error.message}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-[1095px] w-full mx-auto px-[16px] lg:px-[20px] pt-[30px] pb-[156px]">
        {/* 컨텐츠 영역 */}
        <div className="w-full mx-auto p-[16px] xl:p-[20px]">
          {/* 헤더: 제목과 정렬 SelectBox */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-primary font-title text-[28px] text-bold mb-2">
              올린 공고 관리
            </h1>
            <Link
              href="/dashboard/hospital/my-jobs/create"
              className="h-[44px] w-[140px] bg-subtext hover:bg-[#3b394d] p-[10px] gap-[10px] flex items-center justify-center text-[white] rounded-[6px] font-text text-semibold text-[18px]"
            >
              <EditIcon size="20" /> 글쓰기
            </Link>
          </div>

          {/* 필터링 및 정렬 */}
          <div className="flex gap-4 mb-6">
            <SelectBox
              options={[
                { value: "all", label: "전체" },
                { value: "active", label: "모집중" },
                { value: "expired", label: "마감" },
                { value: "inactive", label: "비활성" },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="상태 선택"
            />
            <SelectBox
              options={[
                { value: "recent", label: "최신순" },
                { value: "deadline", label: "마감일순" },
              ]}
              value={sortBy}
              onChange={setSortBy}
              placeholder="정렬 기준"
            />
          </div>

          {/* 공고 목록 - 그리드 형태 */}
          <div className="flex flex-col gap-[16px]">
            {currentJobs.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                등록된 채용 공고가 없습니다.
              </div>
            ) : (
              currentJobs.map((job) => {
                const dDay = job.recruitEndDate 
                  ? Math.ceil((new Date(job.recruitEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) > 0
                    ? `D-${Math.ceil((new Date(job.recruitEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}`
                    : "마감"
                  : "상시";

                return (
                  <JobInfoCard
                    key={job.id}
                    hospital={job.hospitalName || "병원명 미설정"}
                    dDay={dDay}
                    position={job.title}
                    location={job.position || "위치 미설정"}
                    jobType={job.experience.join(", ") || "경력무관"}
                    tags={[...job.major, ...job.workType]}
                    isBookmarked={false}
                    isNew={new Date(job.createdAt).getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000)}
                    variant="wide"
                    showDeadline={job.recruitEndDate !== null}
                    onClick={() => handleJobClick(job.id)}
                  />
                );
              })
            )}
          </div>

          {/* 페이지네이션 */}
          <div className="flex justify-center my-[50px]">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
