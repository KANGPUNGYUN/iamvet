"use client";

import { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeftIcon,
  MoreVerticalIcon,
  EditIcon,
  TrashIcon,
  LocationIcon,
  BookmarkFilledIcon,
  BookmarkIcon,
  WalletIcon,
} from "public/icons";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import JobInfoCard from "@/components/ui/JobInfoCard";
import HospitalCard from "@/components/ui/HospitalCard";
import { getJobById, relatedJobsData } from "@/data/jobsData";

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { id } = use(params);

  const jobData = getJobById(id);

  if (!jobData) {
    return (
      <>
        <Header isLoggedIn={false} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              채용공고를 찾을 수 없습니다
            </h1>
            <Link href="/jobs" className="text-blue-600 hover:underline">
              채용공고 목록으로 돌아가기
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  return (
    <>
      <div className="min-h-screen bg-[#FBFBFB]">
        <div className="max-w-[1095px] mx-auto pt-[20px] pb-[140px] px-4 lg:px-0">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/jobs"
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeftIcon currentColor="currentColor" />
            </Link>

            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <MoreVerticalIcon size="28" currentColor="currentColor" />
              </button>

              {showMoreMenu && (
                <div className="absolute right-0 top-full mt-2 w-[130px] bg-white border rounded-lg shadow-lg z-10">
                  <Link
                    href={`/jobs/${id}/edit`}
                    className="flex justify-center items-center px-[20px] py-[10px] text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <EditIcon size="24" currentColor="currentColor" />
                    <span className="ml-2">수정하기</span>
                  </Link>
                  <button className="flex justify-center items-center w-full px-[20px] py-[10px] text-sm text-[#ff8796] hover:bg-gray-50">
                    <TrashIcon currentColor="currentColor" />
                    <span className="ml-2">삭제하기</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <section className="max-w-[1095px] w-full px-[16px] pt-[20px] pb-[30px] sm:p-[60px] bg-white rounded-[20px] border border-[#EFEFF0]">
            {/* 채용공고 헤더 */}
            <div className="border-b border-[#EFEFF0] pb-[40px]">
              {/* 제목과 북마크 */}
              <div className="flex justify-between items-start mb-4">
                <h1 className="font-text text-[24px] lg:text-[32px] font-bold text-primary flex-1 pr-4">
                  {jobData.title}
                </h1>
                <div className="cursor-pointer" onClick={handleBookmarkClick}>
                  {isBookmarked ? (
                    <BookmarkFilledIcon currentColor="var(--Keycolor1)" />
                  ) : (
                    <BookmarkIcon currentColor="var(--Subtext2)" />
                  )}
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <WalletIcon currentColor="#4F5866" />
                  <span className="font-text text-[16px] text-primary">
                    {jobData.experienceLevel}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <LocationIcon currentColor="#4F5866" />
                  <span className="font-text text-[16px] text-primary">
                    {jobData.location}
                  </span>
                </div>
              </div>

              {/* 키워드 태그와 마감일 */}
              <div className="flex justify-between items-end">
                <div className="flex flex-wrap gap-2">
                  {jobData.keywords.map((keyword, index) => (
                    <Tag key={index} variant={6}>
                      {keyword}
                    </Tag>
                  ))}
                </div>
                <div className="text-right ml-4">
                  <span className="font-text text-[16px] text-[#FF8796]">
                    {jobData.deadline}
                  </span>
                </div>
              </div>
            </div>

            {/* 근무 조건 */}
            <div className="mt-[40px]">
              <h2 className="font-text text-[20px] font-semibold text-primary mb-[20px]">
                근무 조건
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <span className="font-text text-[16px] text-bold text-sub w-[80px] flex-shrink-0">
                    근무 형태
                  </span>
                  <span className="font-text text-[16px] text-sub">
                    {jobData.workConditions.workType}
                  </span>
                </div>
                <div className="flex gap-4">
                  <span className="font-text text-[16px] text-bold text-sub w-[80px] flex-shrink-0">
                    근무 요일
                  </span>
                  <span className="font-text text-[16px] text-sub">
                    {jobData.workConditions.workDays}
                  </span>
                </div>
                <div className="flex gap-4">
                  <span className="font-text text-[16px] text-bold text-sub w-[80px] flex-shrink-0">
                    근무 시간
                  </span>
                  <span className="font-text text-[16px] text-sub">
                    {jobData.workConditions.workHours}
                  </span>
                </div>
                <div className="flex gap-4">
                  <span className="font-text text-[16px] text-bold text-sub w-[80px] flex-shrink-0">
                    급여
                  </span>
                  <span className="font-text text-[16px] text-sub">
                    {jobData.workConditions.salary}
                  </span>
                </div>
                <div className="flex gap-4">
                  <span className="font-text text-[16px] text-bold text-sub w-[80px] flex-shrink-0">
                    복리후생
                  </span>
                  <span className="font-text text-[16px] text-sub">
                    {jobData.workConditions.benefits}
                  </span>
                </div>
              </div>
            </div>

            {/* 자격 요구사항 */}
            <div className="mt-[60px]">
              <h2 className="font-text text-[20px] font-semibold text-primary mb-[20px]">
                자격 요구사항
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <span className="font-text text-[16px] text-bold text-sub w-[80px] flex-shrink-0">
                    학력
                  </span>
                  <span className="font-text text-[16px] text-sub">
                    {jobData.qualifications.education}
                  </span>
                </div>
                <div className="flex gap-4">
                  <span className="font-text text-[16px] text-bold text-sub w-[80px] flex-shrink-0">
                    자격증/면허
                  </span>
                  <span className="font-text text-[16px] text-sub">
                    {jobData.qualifications.certificates}
                  </span>
                </div>
                <div className="flex gap-4">
                  <span className="font-text text-[16px] text-bold text-sub w-[80px] flex-shrink-0">
                    경력
                  </span>
                  <span className="font-text text-[16px] text-sub">
                    {jobData.qualifications.experience}
                  </span>
                </div>
              </div>
            </div>

            {/* 우대사항 */}
            <div className="mt-[60px] border-b border-[#EFEFF0] pb-[40px]">
              <h2 className="font-text text-[20px] font-semibold text-primary mb-[20px]">
                우대사항
              </h2>
              <ul className="space-y-2">
                {jobData.preferredQualifications.map((qualification, index) => (
                  <li key={index} className="font-text text-[16px] text-sub">
                    • {qualification}
                  </li>
                ))}
              </ul>
            </div>

            {/* 병원 정보 */}
            <div className="mt-[40px]">
              <h2 className="font-text text-[20px] font-semibold text-primary mb-[20px]">
                병원 정보
              </h2>

              {/* 병원 카드 */}
              <HospitalCard hospital={jobData.hospital} />

              {/* 지원하기 버튼 */}
              <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 mt-[30px]">
                <Button variant="default" size="large">
                  지원하기
                </Button>
                <Button variant="weak" size="large">
                  문의하기
                </Button>
              </div>
            </div>
          </section>

          {/* 관련 채용 정보 */}
          <section className="mt-[60px]">
            <h2 className="font-title text-[20px] title-light text-primary mb-[20px]">
              관련 채용 정보
            </h2>

            {/* 데스크톱 그리드 */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-6">
              {relatedJobsData.map((job) => (
                <JobInfoCard
                  key={job.id}
                  hospital={job.title}
                  dDay={job.deadline}
                  position="수의사"
                  location={job.location}
                  jobType={job.salary}
                  tags={job.keywords}
                  isBookmarked={job.bookmarked}
                  isNew={job.isNew}
                  onClick={() => {
                    window.location.href = `/jobs/${job.id}`;
                  }}
                />
              ))}
            </div>

            {/* 모바일 가로 스크롤 */}
            <div className="lg:hidden overflow-x-auto">
              <div
                className="flex gap-4 pb-4"
                style={{ width: `${relatedJobsData.length * 310}px` }}
              >
                {relatedJobsData.map((job) => (
                  <div key={job.id} className="flex-shrink-0 w-[294px]">
                    <JobInfoCard
                      hospital={job.title}
                      dDay={job.deadline}
                      position="수의사"
                      location={job.location}
                      jobType={job.salary}
                      tags={job.keywords}
                      isBookmarked={job.bookmarked}
                      isNew={job.isNew}
                      onClick={() => {
                        window.location.href = `/jobs/${job.id}`;
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
