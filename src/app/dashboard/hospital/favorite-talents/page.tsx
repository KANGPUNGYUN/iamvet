"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SelectBox } from "@/components/ui/SelectBox";
import { Pagination } from "@/components/ui/Pagination/Pagination";
import ResumeCard from "@/components/ui/ResumeCard/ResumeCard";
import { allResumeData } from "@/data/resumesData";

interface ResumeData {
  id: string;
  name: string;
  experience: string;
  preferredLocation: string;
  keywords: string[];
  lastAccessDate: string;
  profileImage?: string;
  isNew: boolean;
  isBookmarked: boolean;
  createdAt: Date; // 정렬을 위한 생성 날짜
  popularity?: number; // 인기도 (조회수 등)
}

const sortOptions = [
  { value: "latest", label: "최신순" },
  { value: "oldest", label: "오래된순" },
  { value: "popular", label: "인기순" },
];

export default function TalentManagementPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("latest");
  const itemsPerPage = 12;

  // 실제 데이터 사용
  const allResumes: ResumeData[] = allResumeData.map(resume => ({
    ...resume,
    popularity: Math.floor(Math.random() * 1000) + 50, // 인기도는 랜덤 값으로 추가
  }));

  // 정렬 로직
  const sortedResumes = useMemo(() => {
    const sorted = [...allResumes];
    switch (sortBy) {
      case "latest":
        return sorted.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
      case "oldest":
        return sorted.sort(
          (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
        );
      case "popular":
        return sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      default:
        return sorted;
    }
  }, [allResumes, sortBy]);

  // 페이지네이션
  const totalPages = Math.ceil(sortedResumes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentResumes = sortedResumes.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleBookmark = (id: string) => {
    // 북마크 토글 로직 (실제로는 API 호출)
    console.log(`Resume ${id} bookmarked`);
  };

  const handleResumeClick = (id: string) => {
    // 이력서 상세 페이지로 이동
    router.push(`/resumes/${id}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1095px] w-full mx-auto px-[16px] lg:px-[20px] pt-[30px] pb-[156px]">
        {/* 컨텐츠 영역 */}
        <div className="bg-white w-full mx-auto rounded-[16px] border border-[#EFEFF0] p-[16px] xl:p-[20px]">
          {/* 헤더: 제목과 정렬 SelectBox */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-primary font-text text-[24px] text-bold">
              인재 정보
            </h1>
            <SelectBox
              value={sortBy}
              onChange={setSortBy}
              placeholder="최신순"
              options={sortOptions}
            />
          </div>

          {/* 결과 수 */}
          <div className="mb-6">
            <p className="text-[14px] text-gray-600">
              총 {sortedResumes.length}명
            </p>
          </div>

          {/* 이력서 카드 그리드 */}
          {currentResumes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentResumes.map((resume) => (
                  <ResumeCard
                    key={resume.id}
                    id={resume.id}
                    name={resume.name}
                    experience={resume.experience}
                    preferredLocation={resume.preferredLocation}
                    keywords={resume.keywords}
                    lastAccessDate={resume.lastAccessDate}
                    profileImage={resume.profileImage}
                    isNew={resume.isNew}
                    isBookmarked={resume.isBookmarked}
                    onClick={() => handleResumeClick(resume.id)}
                    onBookmarkClick={() => handleBookmark(resume.id)}
                  />
                ))}
              </div>

              {/* 페이지네이션 */}
              <div className="flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-[16px]">
                이력서 정보가 없습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
