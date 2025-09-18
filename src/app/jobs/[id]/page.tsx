"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
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
import { useJobDetail } from "@/hooks/api/useJobDetail";

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
    senderName: "",
    senderEmail: "",
    senderPhone: "",
  });
  const router = useRouter();
  const { id } = use(params);
  const { data: jobData, isLoading, error } = useJobDetail(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4">불러오는 중...</h1>
        </div>
      </div>
    );
  }

  if (error || !jobData) {
    return (
      <>
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
      </>
    );
  }

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const handleContactClick = () => {
    setContactModalOpen(true);
  };

  const handleContactSubmit = () => {
    if (
      !contactForm.subject ||
      !contactForm.message ||
      !contactForm.senderName ||
      !contactForm.senderEmail
    ) {
      alert("모든 필수 항목을 입력해 주세요.");
      return;
    }

    // 여기에 메시지 전송 로직 추가
    console.log("메시지 전송:", contactForm);
    alert("메시지가 성공적으로 전송되었습니다!");

    // 폼 초기화 및 모달 닫기
    setContactForm({
      subject: "",
      message: "",
      senderName: "",
      senderEmail: "",
      senderPhone: "",
    });
    setContactModalOpen(false);
  };

  const resetContactForm = () => {
    setContactForm({
      subject: "",
      message: "",
      senderName: "",
      senderEmail: "",
      senderPhone: "",
    });
    setContactModalOpen(false);
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

              <div className="flex flex-col lg:flex-row gap-[40px] mb-4">
                <div className="flex items-center gap-2">
                  <WalletIcon currentColor="#4F5866" />
                  <span className="font-text text-[16px] text-primary">
                    {jobData.experienceLevel || '경력무관'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <LocationIcon currentColor="#4F5866" />
                  <span className="font-text text-[16px] text-primary">
                    {jobData.location || jobData.hospital?.location || '위치 정보 없음'}
                  </span>
                </div>
              </div>

              {/* 키워드 태그와 마감일 */}
              <div className="flex justify-between items-end">
                <div className="flex flex-wrap gap-2">
                  {jobData.keywords && jobData.keywords.length > 0 ? (
                    jobData.keywords.map((keyword, index) => (
                      <Tag key={index} variant={6}>
                        {keyword}
                      </Tag>
                    ))
                  ) : (
                    <Tag variant={6}>일반채용</Tag>
                  )}
                </div>
                <div className="text-right ml-4">
                  <span className="font-text text-[16px] text-[#FF8796]">
                    {jobData.deadline || '상시채용'}
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
                <div className="flex gap-[40px]">
                  <span className="font-text text-[16px] text-bold text-sub w-[80px] flex-shrink-0">
                    근무 형태
                  </span>
                  <span className="font-text text-[16px] text-sub">
                    {jobData.workConditions?.workType || '정규직'}
                  </span>
                </div>
                <div className="flex gap-[40px]">
                  <span className="font-text text-[16px] text-bold text-sub w-[80px] flex-shrink-0">
                    근무 요일
                  </span>
                  <span className="font-text text-[16px] text-sub">
                    {jobData.workConditions?.workDays || '주 5일'}
                  </span>
                </div>
                <div className="flex gap-[40px]">
                  <span className="font-text text-[16px] text-bold text-sub w-[80px] flex-shrink-0">
                    근무 시간
                  </span>
                  <span className="font-text text-[16px] text-sub">
                    {jobData.workConditions?.workHours || '09:00 - 18:00'}
                  </span>
                </div>
                <div className="flex gap-[40px]">
                  <span className="font-text text-[16px] text-bold text-sub w-[80px] flex-shrink-0">
                    급여
                  </span>
                  <span className="font-text text-[16px] text-sub">
                    {jobData.workConditions?.salary || '협의'}
                  </span>
                </div>
                <div className="flex gap-[40px]">
                  <span className="font-text text-[16px] text-bold text-sub w-[80px] flex-shrink-0">
                    복리후생
                  </span>
                  <span className="font-text text-[16px] text-sub">
                    {jobData.workConditions?.benefits || '4대보험'}
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
                <div className="flex gap-[40px]">
                  <span className="font-text text-[16px] text-bold text-sub w-[80px] flex-shrink-0">
                    학력
                  </span>
                  <span className="font-text text-[16px] text-sub">
                    {jobData.qualifications?.education || '학력무관'}
                  </span>
                </div>
                <div className="flex gap-[40px]">
                  <span className="font-text text-[16px] text-bold text-sub w-[80px] flex-shrink-0">
                    자격증/면허
                  </span>
                  <span className="font-text text-[16px] text-sub">
                    {jobData.qualifications?.certificates || '수의사 면허'}
                  </span>
                </div>
                <div className="flex gap-[40px]">
                  <span className="font-text text-[16px] text-bold text-sub w-[80px] flex-shrink-0">
                    경력
                  </span>
                  <span className="font-text text-[16px] text-sub">
                    {jobData.qualifications?.experience || '경력무관'}
                  </span>
                </div>
              </div>
            </div>

            {/* 우대사항 */}
            <div className="mt-[60px] border-b border-[#EFEFF0] pb-[40px]">
              <div className="flex gap-[50px]">
                <h2 className="font-text text-[20px] font-semibold text-primary mb-[20px]">
                  우대사항
                </h2>
                <ul className="space-y-2">
                  {jobData.preferredQualifications && jobData.preferredQualifications.length > 0 ? (
                    jobData.preferredQualifications.map(
                      (qualification, index) => (
                        <li
                          key={index}
                          className="font-text text-[16px] text-sub"
                        >
                          • {qualification}
                        </li>
                      )
                    )
                  ) : (
                    <li className="font-text text-[16px] text-sub">
                      • 특별한 우대사항 없음
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* 병원 정보 */}
            <div className="mt-[40px]">
              <h2 className="font-text text-[20px] font-semibold text-primary mb-[20px]">
                병원 정보
              </h2>

              {/* 병원 카드 */}
              {jobData.hospital && <HospitalCard hospital={jobData.hospital} />}

              {/* 지원하기 버튼 */}
              <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-[40px] mt-[30px]">
                <Button variant="default" size="large">
                  지원하기
                </Button>
                <Button
                  variant="weak"
                  size="large"
                  onClick={handleContactClick}
                >
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
              {jobData.relatedJobs && jobData.relatedJobs.length > 0 ? (
                jobData.relatedJobs.map((job: any) => (
                  <JobInfoCard
                    key={job.id}
                    hospital={job.hospitalName || job.title}
                    dDay={job.recruitEndDate ? Math.max(0, Math.ceil((new Date(job.recruitEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : null}
                    position={job.position || "수의사"}
                    location={job.location || job.hospitalLocation}
                    jobType={Array.isArray(job.workType) ? job.workType[0] : job.workType}
                    tags={[
                      ...(Array.isArray(job.workType) ? job.workType : [job.workType].filter(Boolean)),
                      ...(Array.isArray(job.experience) ? job.experience : [job.experience].filter(Boolean)),
                    ].filter(Boolean)}
                    isBookmarked={false}
                    isNew={new Date(job.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}
                    onClick={() => {
                      router.push(`/jobs/${job.id}`);
                    }}
                    className="w-full"
                  />
                ))
              ) : (
                <div className="col-span-3 text-center text-gray-500 py-10">
                  관련 채용공고가 없습니다.
                </div>
              )}
            </div>

            {/* 모바일 가로 스크롤 */}
            <div className="lg:hidden overflow-x-auto">
              {jobData.relatedJobs && jobData.relatedJobs.length > 0 ? (
                <div
                  className="flex gap-[40px] pb-4"
                  style={{ width: `${jobData.relatedJobs.length * 310}px` }}
                >
                  {jobData.relatedJobs.map((job: any) => (
                    <div key={job.id} className="flex-shrink-0 w-[294px]">
                      <JobInfoCard
                        hospital={job.hospitalName || job.title}
                        dDay={job.recruitEndDate ? Math.max(0, Math.ceil((new Date(job.recruitEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : null}
                        position={job.position || "수의사"}
                        location={job.location || job.hospitalLocation}
                        jobType={Array.isArray(job.workType) ? job.workType[0] : job.workType}
                        tags={[
                          ...(Array.isArray(job.workType) ? job.workType : [job.workType].filter(Boolean)),
                          ...(Array.isArray(job.experience) ? job.experience : [job.experience].filter(Boolean)),
                        ].filter(Boolean)}
                        isBookmarked={false}
                        isNew={new Date(job.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}
                        onClick={() => {
                          router.push(`/jobs/${job.id}`);
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-10">
                  관련 채용공고가 없습니다.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Contact Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">문의하기</h3>
              <p className="text-gray-600 mb-6">
                {jobData.hospital?.name || '병원'}에 {jobData.title} 포지션에 대해
                문의하세요.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    제목 *
                  </label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) =>
                      setContactForm((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8796] focus:border-transparent"
                    placeholder="문의 제목을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    문의 내용 *
                  </label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8796] focus:border-transparent resize-none"
                    placeholder="문의하실 내용을 자세히 작성해 주세요..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={resetContactForm}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleContactSubmit}
                  className="flex-1 px-4 py-2 bg-[#ff8796] text-white rounded-md hover:bg-[#ff9aa6] transition-colors font-medium"
                >
                  문의하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
