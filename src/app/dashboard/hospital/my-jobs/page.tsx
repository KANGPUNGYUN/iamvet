"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeftIcon, EditIcon } from "public/icons";
import { SelectBox } from "@/components/ui/SelectBox";
import { Pagination } from "@/components/ui/Pagination/Pagination";
import JobInfoCard from "@/components/ui/JobInfoCard";

interface JobData {
  id: number;
  hospital: string;
  dDay: string;
  position: string;
  location: string;
  jobType: string;
  tags: string[];
  isBookmarked: boolean;
  isNew?: boolean;
}

export default function HospitalMyJobsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("recent");
  const itemsPerPage = 8;

  // 더미 데이터 (찜한 공고 목록)
  const allBookmarkedJobs: JobData[] = Array.from({ length: 248 }, (_, i) => ({
    id: i + 1,
    hospital: "서울동물메디컬센터",
    dDay: i % 5 === 0 ? "신규" : `D-${(i % 30) + 1}`,
    position: "경력 3년 이상",
    location: "서울 강남구",
    jobType:
      i % 3 === 0 ? "신입" : i % 3 === 1 ? "경력 3년 이상" : "경력 5년 이상",
    tags: ["내과", "외과", "정규직", "케어직", "파트타임"],
    isBookmarked: true,
    isNew: i % 5 === 0,
  }));

  // 정렬 로직
  const sortedJobs = useMemo(() => {
    const sorted = [...allBookmarkedJobs];
    switch (sortBy) {
      case "recent":
        return sorted.sort((a, b) => b.id - a.id);
      case "popular":
        return sorted.sort((a, b) => a.hospital.localeCompare(b.hospital));
      case "deadline":
        return sorted.sort((a, b) => {
          // 신규는 맨 앞에, 나머지는 마감일순
          if (a.dDay === "신규" && b.dDay !== "신규") return -1;
          if (b.dDay === "신규" && a.dDay !== "신규") return 1;
          if (a.dDay === "신규" && b.dDay === "신규") return 0;

          const aDays = parseInt(a.dDay.replace("D-", ""));
          const bDays = parseInt(b.dDay.replace("D-", ""));
          return aDays - bDays;
        });
      default:
        return sorted;
    }
  }, [allBookmarkedJobs, sortBy]);

  // 페이지네이션
  const totalPages = Math.ceil(sortedJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = sortedJobs.slice(startIndex, startIndex + itemsPerPage);

  const handleJobClick = (jobId: number) => {
    window.location.href = `/jobs/${jobId}`;
  };

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

          {/* 공고 목록 - 그리드 형태 */}
          <div className="flex flex-col gap-[16px]">
            {currentJobs.map((job) => (
              <JobInfoCard
                key={job.id}
                hospital={job.hospital}
                dDay={job.dDay}
                position={job.position}
                location={job.location}
                jobType={job.jobType}
                tags={job.tags}
                isBookmarked={job.isBookmarked}
                isNew={job.isNew}
                variant="wide"
                showDeadline={job.dDay !== "신규"}
                onClick={() => handleJobClick(job.id)}
              />
            ))}
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
