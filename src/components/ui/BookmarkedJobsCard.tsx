"use client";

import React from "react";
import Link from "next/link";
import JobInfoCard from "./JobInfoCard";
import { convertDDayToNumber } from "@/utils/dDayConverter";

interface JobData {
  id: string;
  hospital: string;
  dDay: string;
  position: string;
  location: string;
  jobType: string;
  tags: string[];
  isBookmarked: boolean;
}

interface BookmarkedJobsCardProps {
  jobs?: JobData[];
}

const BookmarkedJobsCard: React.FC<BookmarkedJobsCardProps> = ({
  jobs,
}) => {
  const [data, setData] = React.useState<JobData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (jobs) {
      setData(jobs);
      setIsLoading(false);
    } else {
      fetchBookmarkedJobs();
    }
  }, [jobs]);

  const fetchBookmarkedJobs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/veterinarians/bookmarked-jobs', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const result = await response.json();
        setData(result.jobs || []);
      } else {
        throw new Error('북마크한 공고를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('북마크한 공고 조회 실패:', error);
      setError(error instanceof Error ? error.message : '오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-white w-full lg:max-w-[714px] mx-auto rounded-[16px] border border-[#EFEFF0] p-[16px] lg:p-[20px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-bold text-primary">찜한 공고</h2>
        <Link
          href="/dashboard/veterinarian/bookmarks"
          className="text-key1 text-[16px] font-bold no-underline hover:underline hover:underline-offset-[3px]"
        >
          전체보기
        </Link>
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff8796] mx-auto mb-2"></div>
            <p className="text-[#9098A4] text-sm">북마크한 공고를 불러오는 중...</p>
          </div>
        </div>
      )}

      {/* 에러 상태 */}
      {error && !isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-500 text-sm mb-2">{error}</p>
            <button
              onClick={fetchBookmarkedJobs}
              className="text-[#ff8796] text-sm hover:underline"
            >
              다시 시도
            </button>
          </div>
        </div>
      )}

      {/* 빈 상태 */}
      {!isLoading && !error && data.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-[#9098A4] text-lg">북마크한 채용공고가 없습니다</p>
            <p className="text-[#9098A4] text-sm mt-2">관심있는 공고를 북마크해보세요.</p>
          </div>
        </div>
      )}

      {/* 공고 목록 */}
      {!isLoading && !error && data.length > 0 && (
        <div className="flex flex-col xl:flex-row gap-[14px]">
          {data.slice(0, 2).map((job) => (
            <JobInfoCard
              key={job.id}
              hospital={job.hospital}
              dDay={convertDDayToNumber(job.dDay)}
              position={job.position}
              location={job.location}
              jobType={job.jobType}
              tags={job.tags}
              isBookmarked={job.isBookmarked}
              isNew={job.dDay === "신규"}
              variant="wide"
              showDeadline={job.dDay !== "신규"}
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

export default BookmarkedJobsCard;
