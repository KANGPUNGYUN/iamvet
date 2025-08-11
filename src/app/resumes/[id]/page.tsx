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
  PhoneIcon,
  MailIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  StarEmptyIcon,
  StarFilledIcon,
  StarHalfIcon,
} from "public/icons";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { Footer, Header } from "@/components";
import ResumeCard from "@/components/ui/ResumeCard/ResumeCard";
import { Tab } from "@/components/ui/Tab";
import { getResumeById, DetailedResumeData } from "@/data/resumesData";
import profileImg from "@/assets/images/profile.png";

// 별점 표시 컴포넌트 (소수점 지원)
const StarRating = ({
  rating,
  size = 16,
}: {
  rating: number;
  size?: number;
}) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      // 완전히 채워진 별
      stars.push(<StarFilledIcon key={i} size={size} />);
    } else if (rating >= i - 0.5) {
      // 반쯤 채워진 별
      stars.push(<StarHalfIcon key={i} size={size} />);
    } else {
      // 빈 별
      stars.push(<StarEmptyIcon key={i} size={size} />);
    }
  }
  return <div className="flex gap-1">{stars}</div>;
};

// 관련 인재 정보 (임시 데이터)
const relatedResumes = [
  {
    id: "2",
    name: "박민준",
    experience: "경력 5년 2개월",
    preferredLocation: "서울 전지역",
    keywords: ["외과", "정형외과", "정규직", "수의사"],
    lastAccessDate: "2025.04.10",
    isBookmarked: false,
  },
  {
    id: "3",
    name: "이지연",
    experience: "경력 4년 8개월",
    preferredLocation: "서울 강남구, 서초구, 송파구",
    keywords: ["피부과", "알러지", "정규직", "수의사"],
    lastAccessDate: "2025.04.08",
    isBookmarked: true,
  },
  {
    id: "4",
    name: "최치료",
    experience: "경력 7년",
    preferredLocation: "서울 강남구, 서초구",
    keywords: ["내과", "외과", "관리직", "정규직", "수의사"],
    lastAccessDate: "2025.04.05",
    isBookmarked: false,
  },
];

export default function ResumeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [expandedEvaluations, setExpandedEvaluations] = useState<number[]>([]);
  const { id } = use(params);

  const resumeData = getResumeById(id);

  if (!resumeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">이력서를 찾을 수 없습니다</h1>
          <Link href="/resumes" className="text-blue-600 hover:underline">
            이력서 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const toggleEvaluation = (evaluationId: number) => {
    setExpandedEvaluations((prev) =>
      prev.includes(evaluationId)
        ? prev.filter((id) => id !== evaluationId)
        : [...prev, evaluationId]
    );
  };

  // 전체 평균 계산
  const calculateOverallAverage = () => {
    return resumeData.evaluations.overallAverage.toFixed(1);
  };

  return (
    <>
      <Header isLoggedIn={false} />
      <div className="min-h-screen bg-[#FBFBFB]">
        <div className="max-w-[1095px] mx-auto pt-[20px] pb-[140px] px-4 lg:px-0">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/resumes"
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
                    href={`/resumes/${id}/edit`}
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

          <section>
            {/* 프로필 섹션 */}
            <div className="p-[30px] bg-white border border-[1px] border-[#EFEFF0] rounded-[16px] flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">
              {/* 프로필 이미지와 모바일 북마크 */}
              <div className="flex justify-between lg:justify-start items-start">
                <div className="w-[92px] h-[92px] lg:w-[240px] lg:h-[240px] rounded-full overflow-hidden border-2 border-[#FFB5B5] bg-[#FFF5F5] flex items-center justify-center">
                  <Image
                    src={resumeData.profileImage || profileImg}
                    alt={`${resumeData.name} 프로필`}
                    width={240}
                    height={240}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* 모바일 북마크 버튼 */}
                <div
                  className="lg:hidden cursor-pointer"
                  onClick={handleBookmarkClick}
                >
                  {isBookmarked ? (
                    <BookmarkFilledIcon currentColor="var(--Keycolor1)" />
                  ) : (
                    <BookmarkIcon currentColor="var(--Subtext2)" />
                  )}
                </div>
              </div>

              {/* 프로필 정보 */}
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div>
                    <h1 className="font-text text-[32px] font-normal text-primary mb-2">
                      {resumeData.name}
                    </h1>
                    <p className="font-text text-[16px] text-sub mb-4">
                      {resumeData.summary}
                    </p>

                    {/* 연락처 및 이메일 */}
                    <div className="flex flex-col lg:flex-row lg:gap-[20px] gap-2 mb-6">
                      <div className="flex items-center gap-2">
                        <PhoneIcon currentColor="#4F5866" />
                        <span className="font-text text-[14px] lg:text-[16px] text-sub">
                          {resumeData.contact}
                        </span>
                      </div>
                      <span className="hidden lg:inline">|</span>
                      <div className="flex items-center gap-2">
                        <MailIcon currentColor="#4F5866" />
                        <span className="font-text text-[14px] lg:text-[16px] text-sub">
                          {resumeData.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 북마크 버튼 - 데스크톱용 */}
                  <div
                    className="hidden lg:flex items-center justify-center cursor-pointer"
                    onClick={handleBookmarkClick}
                  >
                    {isBookmarked ? (
                      <BookmarkFilledIcon currentColor="var(--Keycolor1)" />
                    ) : (
                      <BookmarkIcon currentColor="var(--Subtext2)" />
                    )}
                  </div>
                </div>

                {/* 현재 직장, 총 경력, 근무가능일 */}
                <div className="bg-box-light flex flex-col lg:flex-row justify-evenly px-[20px] lg:px-[50px] py-[20px] border border-[1px] border-[#EFEFF0] rounded-[16px] gap-[16px] lg:gap-0">
                  <div className="flex flex-col gap-[4px] items-center">
                    <span className="font-text text-[14px] lg:text-[16px] text-sub">
                      현재 직장
                    </span>
                    <span className="font-text text-key1 text-[18px] lg:text-[24px] font-semibold">
                      {resumeData.currentWorkplace}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[4px] items-center">
                    <span className="font-text text-[14px] lg:text-[16px] text-sub">
                      총 경력
                    </span>
                    <span className="font-text text-key1 text-[18px] lg:text-[24px] font-semibold">
                      {resumeData.totalExperience}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[4px] items-center">
                    <span className="font-text text-[14px] lg:text-[16px] text-sub">
                      근무가능일
                    </span>
                    <span className="font-text text-key1 text-[18px] lg:text-[24px] font-semibold">
                      {resumeData.availableStartDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 탭 섹션 */}
            <div className="mt-[40px] lg:mt-[60px]">
              <Tab defaultTab="talent-info" variant="rounded">
                <Tab.List>
                  <Tab.Item value="talent-info">인재정보</Tab.Item>
                  <Tab.Item value="talent-evaluation">인재평가</Tab.Item>
                </Tab.List>

                <Tab.Content value="talent-info">
                  <div className="flex flex-col gap-[60px] lg:gap-[80px] w-full">
                    <div className="flex flex-col lg:flex-row gap-[40px] lg:gap-[50px] lg:justify-between">
                      {/* 인재 정보 */}
                      <div className="w-full">
                        <h3 className="font-text text-[18px] lg:text-[20px] text-semibold title-light text-primary mb-[16px]">
                          인재 정보
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="flex gap-4">
                            <span className="font-text text-[14px] lg:text-[16px] text-sub w-[70px] lg:w-[80px] flex-shrink-0">
                              이름
                            </span>
                            <span className="font-text text-[14px] lg:text-[16px] text-primary">
                              {resumeData.personalInfo.name}
                            </span>
                          </div>
                          <div className="flex gap-4">
                            <span className="font-text text-[14px] lg:text-[16px] text-sub w-[70px] lg:w-[80px] flex-shrink-0">
                              생년월일
                            </span>
                            <span className="font-text text-[14px] lg:text-[16px] text-primary">
                              {resumeData.personalInfo.birthDate}
                            </span>
                          </div>
                          <div className="flex gap-4">
                            <span className="font-text text-[14px] lg:text-[16px] text-sub w-[70px] lg:w-[80px] flex-shrink-0">
                              연락처
                            </span>
                            <span className="font-text text-[14px] lg:text-[16px] text-primary">
                              {resumeData.personalInfo.contact}
                            </span>
                          </div>
                          <div className="flex gap-4">
                            <span className="font-text text-[14px] lg:text-[16px] text-sub w-[70px] lg:w-[80px] flex-shrink-0">
                              이메일
                            </span>
                            <span className="font-text text-[14px] lg:text-[16px] text-primary">
                              {resumeData.personalInfo.email}
                            </span>
                          </div>
                          <div className="flex gap-4">
                            <span className="font-text text-[14px] lg:text-[16px] text-sub w-[70px] lg:w-[80px] flex-shrink-0">
                              직무
                            </span>
                            <span className="font-text text-[14px] lg:text-[16px] text-primary">
                              {resumeData.personalInfo.jobField}
                            </span>
                          </div>
                          <div className="flex gap-4">
                            <span className="font-text text-[14px] lg:text-[16px] text-sub w-[70px] lg:w-[80px] flex-shrink-0">
                              전공분야
                            </span>
                            <span className="font-text text-[14px] lg:text-[16px] text-primary">
                              {resumeData.personalInfo.major}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 희망 근로 사항 */}
                      <div className="w-full">
                        <h3 className="font-text text-[18px] lg:text-[20px] text-semibold title-light text-primary mb-[16px]">
                          희망 근로 사항
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="flex gap-4">
                            <span className="font-text text-[14px] lg:text-[16px] text-sub w-[70px] lg:w-[80px] flex-shrink-0">
                              근무형태
                            </span>
                            <span className="font-text text-[14px] lg:text-[16px] text-primary">
                              {resumeData.workPreferences.workType}
                            </span>
                          </div>
                          <div className="flex gap-4">
                            <span className="font-text text-[14px] lg:text-[16px] text-sub w-[70px] lg:w-[80px] flex-shrink-0">
                              연봉
                            </span>
                            <span className="font-text text-[14px] lg:text-[16px] text-primary">
                              {resumeData.workPreferences.salary}
                            </span>
                          </div>
                          <div className="flex gap-4">
                            <span className="font-text text-[14px] lg:text-[16px] text-sub w-[70px] lg:w-[80px] flex-shrink-0">
                              근무 요일
                            </span>
                            <span className="font-text text-[14px] lg:text-[16px] text-primary">
                              {resumeData.workPreferences.workDays}
                            </span>
                          </div>
                          <div className="flex gap-4">
                            <span className="font-text text-[14px] lg:text-[16px] text-sub w-[70px] lg:w-[80px] flex-shrink-0">
                              근무 시간
                            </span>
                            <span className="font-text text-[14px] lg:text-[16px] text-primary">
                              {resumeData.workPreferences.workHours}
                            </span>
                          </div>
                          <div className="flex gap-4">
                            <span className="font-text text-[14px] lg:text-[16px] text-sub w-[70px] lg:w-[80px] flex-shrink-0">
                              근무 지역
                            </span>
                            <span className="font-text text-[14px] lg:text-[16px] text-primary">
                              {resumeData.workPreferences.workLocation}
                            </span>
                          </div>
                          <div className="flex gap-4">
                            <span className="font-text text-[14px] lg:text-[16px] text-sub w-[70px] lg:w-[80px] flex-shrink-0">
                              근무 가능일
                            </span>
                            <span className="font-text text-[14px] lg:text-[16px] text-primary">
                              {resumeData.workPreferences.availableDate}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 경력 사항 */}
                    <div>
                      <div className="flex justify-between items-center mb-[20px]">
                        <h3 className="font-text text-[20px] text-semibold title-light text-primary">
                          경력 사항
                        </h3>
                        <p className="font-text text-[20px] text-semibold text-primary">
                          총 {resumeData.totalExperience}
                        </p>
                      </div>
                      <div className="flex flex-col gap-[16px]">
                        {resumeData.careers.map((career) => (
                          <div
                            key={career.id}
                            className="bg-white flex flex-col lg:flex-row gap-[16px] lg:gap-[40px] lg:items-center lg:justify-start"
                          >
                            <div className="flex justify-between lg:justify-start items-start lg:mb-[12px] lg:min-w-[150px]">
                              <div className="flex flex-col gap-[4px]">
                                <span className="font-text text-[18px] lg:text-[24px] text-key1 font-bold">
                                  {career.duration}
                                </span>
                                <span className="font-text text-[14px] lg:text-[16px] text-subtext2">
                                  {career.startDate} ~ {career.endDate}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col bg-box-light rounded-[16px] px-[20px] lg:px-[30px] py-[16px] lg:py-[20px] gap-[4px] w-full">
                              <span className="font-text text-[16px] lg:text-[20px] font-semibold text-primary truncate">
                                {career.hospitalName}
                              </span>
                              <p className="font-text text-[14px] lg:text-[16px] text-sub leading-relaxed line-clamp-3">
                                {career.experience}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 학력 정보 */}
                    <div>
                      <h3 className="font-text text-[20px] text-semibold title-light text-primary mb-[20px]">
                        학력 정보
                      </h3>
                      <div className="flex flex-col gap-[16px]">
                        {resumeData.educations.map((education) => (
                          <div key={education.id} className="bg-white">
                            <div className="flex justify-between items-start mb-[12px] pb-[10px] border-b border-[#EFEFF0]">
                              <div className="flex items-center gap-[12px]">
                                <span className="font-text text-[16px] text-subtext2 font-semibold">
                                  {education.degree}
                                </span>
                                <span className="text-sub">|</span>
                                <span className="font-text text-[16px] text-subtext2 font-semibold">
                                  {education.graduationStatus}
                                </span>
                              </div>
                              <span className="font-text text-[16px] text-subtext2 font-semibold">
                                {education.startDate} ~ {education.endDate}
                              </span>
                            </div>
                            <div className="flex flex-col gap-[4px]">
                              <span className="font-text text-[20px] font-semibold text-sub">
                                {education.schoolName}
                              </span>
                            </div>
                            <div className="flex flex-col gap-[4px]">
                              <p className="font-text text-[16px] text-sub">
                                전공: {education.major}
                              </p>
                              <p className="font-text text-[16px] text-sub">
                                학점: {education.gpa} / {education.gpaScale}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 자격증/면허 */}
                    <div>
                      <h3 className="font-text text-[18px] lg:text-[20px] text-semibold title-light text-primary mb-[20px]">
                        자격증/면허
                      </h3>
                      <div className="flex flex-col lg:flex-row gap-[20px]">
                        {resumeData.certificates.map((certificate) => (
                          <div
                            key={certificate.id}
                            className="flex w-full lg:w-[343px] h-[137px] p-[20px] flex-col justify-between items-start gap-[10px] rounded-[16px] bg-box-light"
                          >
                            <div className="flex justify-between items-start w-full pb-[10px] border-b border-[#EFEFF0]">
                              <span className="font-text text-[14px] lg:text-[16px] text-subtext2">
                                {certificate.issuer}
                              </span>
                              <span className="font-text text-[14px] lg:text-[16px] text-subtext2">
                                취득일 {certificate.acquisitionDate}
                              </span>
                            </div>
                            <div>
                              <span className="font-text text-[18px] lg:text-[20px] font-semibold text-sub">
                                {certificate.name}
                              </span>
                              <p className="font-text text-[16px] lg:text-[18px] font-semibold text-sub">
                                {certificate.grade}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 진료 상세 역량 */}
                    <div>
                      <h3 className="font-text text-[18px] lg:text-[20px] text-semibold title-light text-primary mb-[20px]">
                        진료 상세 역량
                      </h3>
                      <div className="flex flex-col lg:flex-row gap-[20px]">
                        {resumeData.capabilities.map((capability) => (
                          <div
                            key={capability.id}
                            className="flex w-full lg:w-[343px] p-[20px] flex-col justify-between items-start gap-[10px] rounded-[16px] bg-box-light"
                          >
                            <div className="flex justify-between items-start w-full pb-[10px] border-b border-[#EFEFF0]">
                              <div className="flex justify-between items-center w-full">
                                <span className="font-text text-[14px] lg:text-[16px] text-subtext2">
                                  {capability.major}
                                </span>
                                <Tag
                                  variant={
                                    capability.level == "전문가" ||
                                    capability.level == "상급"
                                      ? 1
                                      : 6
                                  }
                                >
                                  {capability.level}
                                </Tag>
                              </div>
                            </div>
                            <div className="mb-[8px]">
                              <span className="font-text text-[18px] lg:text-[20px] font-semibold text-sub h-[61px] flex items-center">
                                {capability.name}
                              </span>
                            </div>
                            <p className="font-text text-[14px] lg:text-[16px] text-guide">
                              관련 경험 {capability.experience}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 자기소개 */}
                    <div>
                      <h3 className="font-text text-[20px] text-semibold lg:text-[20px] title-light text-primary mb-[16px]">
                        자기소개
                      </h3>
                      <div className="border border-[1px] border-[#CACAD2] bg-box-light rounded-[6px] px-[20px] py-[16px]">
                        <p className="font-text text-[14px] lg:text-[16px] text-sub leading-relaxed whitespace-pre-line">
                          {resumeData.selfIntroduction}
                        </p>
                      </div>
                    </div>
                  </div>
                </Tab.Content>

                <Tab.Content value="talent-evaluation">
                  {resumeData.evaluations.hospitals.length === 0 ? (
                    <div className="w-full flex items-center justify-center py-20">
                      <div className="text-center">
                        <p className="font-text text-[16px] text-sub mb-4">
                          아직 평가된 병원 기록이 없습니다.
                        </p>
                        <Button variant="line" size="medium">
                          평가 요청하기
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full flex flex-col gap-[40px]">
                      {/* 전체 평균 섹션 */}
                      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                        <h3 className="font-text text-[18px] lg:text-[20px] text-semibold text-primary">
                          인재 평가
                        </h3>
                        <div className="flex flex-col lg:flex-row items-center lg:gap-[12px] gap-3">
                          <div className="flex items-center justify-center gap-2">
                            <span className="font-text text-[18px] lg:text-[20px] text-semibold text-primary">
                              {calculateOverallAverage()}
                            </span>
                            <StarRating
                              rating={parseFloat(calculateOverallAverage())}
                              size={20}
                            />
                          </div>
                          <Button
                            variant="keycolor"
                            size="medium"
                            className="bg-key1 text-white px-[16px] py-[8px] rounded-[8px]"
                          >
                            평가하기
                          </Button>
                        </div>
                      </div>

                      {/* 병원별 평가 목록 */}
                      <div className="w-full flex flex-col">
                        {resumeData.evaluations.hospitals.map((evaluation) => (
                          <div
                            key={evaluation.id}
                            className="w-full bg-white overflow-hidden border-b border-[#EFEFF0]"
                          >
                            {/* 병원 헤더 */}
                            <div
                              className="flex justify-between items-center p-[16px] lg:p-[20px] cursor-pointer hover:bg-gray-50"
                              onClick={() => toggleEvaluation(evaluation.id)}
                            >
                              <div className="flex items-center gap-[12px] lg:gap-[16px] flex-1 min-w-0">
                                <div className="w-[32px] h-[32px] lg:w-[40px] lg:h-[40px] rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                  <span className="font-text text-[14px] lg:text-[16px] font-semibold text-sub">
                                    {evaluation.hospitalName.charAt(0)}
                                  </span>
                                </div>
                                <div className="flex flex-col min-w-0 flex-1">
                                  <span className="font-text text-[14px] lg:text-[18px] font-semibold text-primary truncate">
                                    {evaluation.hospitalName}
                                  </span>
                                  <span className="font-text text-[12px] lg:text-[14px] text-subtext2 truncate">
                                    {evaluation.evaluationDate}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-[12px] lg:gap-[16px] flex-shrink-0">
                                <div className="flex items-center gap-[6px] lg:gap-[8px]">
                                  <span className="font-text text-[16px] lg:text-[20px] font-bold text-primary">
                                    {evaluation.overallRating.toFixed(1)}
                                  </span>
                                  <StarRating
                                    rating={evaluation.overallRating}
                                    size={14}
                                  />
                                </div>
                                {expandedEvaluations.includes(evaluation.id) ? (
                                  <ChevronUpIcon currentColor="#9098A4" />
                                ) : (
                                  <ChevronDownIcon currentColor="#9098A4" />
                                )}
                              </div>
                            </div>

                            {/* 상세 평가 내용 */}
                            {expandedEvaluations.includes(evaluation.id) && (
                              <div className="pl-[55px] pb-[20px] border-t border-[#EFEFF0]">
                                <div className="flex flex-col gap-[24px] pt-[20px]">
                                  {/* 스트레스 관리 */}
                                  <div>
                                    <div className="flex justify-between items-center mb-[12px]">
                                      <span className="font-text text-[16px] font-semibold text-primary">
                                        스트레스 관리
                                      </span>
                                      <div className="flex items-center gap-[8px]">
                                        <span className="font-text text-[16px] font-bold text-primary">
                                          {evaluation.ratings.stressManagement.toFixed(
                                            1
                                          )}
                                        </span>
                                        <StarRating
                                          rating={
                                            evaluation.ratings.stressManagement
                                          }
                                          size={14}
                                        />
                                      </div>
                                    </div>
                                    <div className="border border-[1px] border-[#EFEFF0] bg-box-light p-[10px] rounded-[8px]">
                                      {evaluation.detailedEvaluations
                                        .filter(
                                          (detail) =>
                                            detail.category === "스트레스 관리"
                                        )
                                        .map((detail, index) => (
                                          <p
                                            key={index}
                                            className="font-text text-[16px] text-sub"
                                          >
                                            {detail.comment || "-"}
                                          </p>
                                        ))}
                                      {!evaluation.detailedEvaluations.some(
                                        (detail) =>
                                          detail.category === "스트레스 관리"
                                      ) && (
                                        <p className="font-text text-[16px] text-sub">
                                          -
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  {/* 성장 의지 */}
                                  <div>
                                    <div className="flex justify-between items-center mb-[12px]">
                                      <span className="font-text text-[16px] font-semibold text-primary">
                                        성장 가능성
                                      </span>
                                      <div className="flex items-center gap-[8px]">
                                        <span className="font-text text-[16px] font-bold text-primary">
                                          {evaluation.ratings.growth.toFixed(1)}
                                        </span>
                                        <StarRating
                                          rating={evaluation.ratings.growth}
                                          size={14}
                                        />
                                      </div>
                                    </div>
                                    <div className="border border-[1px] border-[#EFEFF0] bg-box-light p-[10px] rounded-[8px]">
                                      {evaluation.detailedEvaluations
                                        .filter(
                                          (detail) =>
                                            detail.category === "성장 잠재력"
                                        )
                                        .map((detail, index) => (
                                          <p
                                            key={index}
                                            className="font-text text-[16px] text-sub"
                                          >
                                            {detail.comment || "-"}
                                          </p>
                                        ))}
                                      {!evaluation.detailedEvaluations.some(
                                        (detail) =>
                                          detail.category === "성장 잠재력"
                                      ) && (
                                        <p className="font-text text-[16px] text-sub">
                                          -
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  {/* 보호자 케어 */}
                                  <div>
                                    <div className="flex justify-between items-center mb-[12px]">
                                      <span className="font-text text-[16px] font-semibold text-primary">
                                        케어 능력
                                      </span>
                                      <div className="flex items-center gap-[8px]">
                                        <span className="font-text text-[16px] font-bold text-primary">
                                          {evaluation.ratings.care.toFixed(1)}
                                        </span>
                                        <StarRating
                                          rating={evaluation.ratings.care}
                                          size={14}
                                        />
                                      </div>
                                    </div>
                                    <div className="border border-[1px] border-[#EFEFF0] bg-box-light p-[10px] rounded-[8px]">
                                      {evaluation.detailedEvaluations
                                        .filter(
                                          (detail) =>
                                            detail.category === "소통 능력"
                                        )
                                        .map((detail, index) => (
                                          <p
                                            key={index}
                                            className="font-text text-[16px] text-sub"
                                          >
                                            {detail.comment || "-"}
                                          </p>
                                        ))}
                                      {!evaluation.detailedEvaluations.some(
                                        (detail) =>
                                          detail.category === "소통 능력"
                                      ) && (
                                        <p className="font-text text-[16px] text-sub">
                                          -
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  {/* 기록 및 문서화 */}
                                  <div>
                                    <div className="flex justify-between items-center mb-[12px]">
                                      <span className="font-text text-[16px] font-semibold text-primary">
                                        문서 작성
                                      </span>
                                      <div className="flex items-center gap-[8px]">
                                        <span className="font-text text-[16px] font-bold text-primary">
                                          {evaluation.ratings.documentation.toFixed(
                                            1
                                          )}
                                        </span>
                                        <StarRating
                                          rating={
                                            evaluation.ratings.documentation
                                          }
                                          size={14}
                                        />
                                      </div>
                                    </div>
                                    <div className="border border-[1px] border-[#EFEFF0] bg-box-light p-[10px] rounded-[8px]">
                                      {evaluation.detailedEvaluations
                                        .filter(
                                          (detail) =>
                                            detail.category === "업무 역량"
                                        )
                                        .map((detail, index) => (
                                          <p
                                            key={index}
                                            className="font-text text-[16px] text-sub"
                                          >
                                            {detail.comment || "-"}
                                          </p>
                                        ))}
                                      {!evaluation.detailedEvaluations.some(
                                        (detail) =>
                                          detail.category === "업무 역량"
                                      ) && (
                                        <p className="font-text text-[16px] text-sub">
                                          -
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  {/* 조직 기여도 */}
                                  <div>
                                    <div className="flex justify-between items-center mb-[12px]">
                                      <span className="font-text text-[16px] font-semibold text-primary">
                                        기여도
                                      </span>
                                      <div className="flex items-center gap-[8px]">
                                        <span className="font-text text-[16px] font-bold text-primary">
                                          {evaluation.ratings.contribution.toFixed(
                                            1
                                          )}
                                        </span>
                                        <StarRating
                                          rating={
                                            evaluation.ratings.contribution
                                          }
                                          size={14}
                                        />
                                      </div>
                                    </div>
                                    <div className="border border-[1px] border-[#EFEFF0] bg-box-light p-[10px] rounded-[8px]">
                                      {evaluation.detailedEvaluations
                                        .filter(
                                          (detail) =>
                                            detail.category === "협업 능력"
                                        )
                                        .map((detail, index) => (
                                          <p
                                            key={index}
                                            className="font-text text-[16px] text-sub"
                                          >
                                            {detail.comment || "-"}
                                          </p>
                                        ))}
                                      {!evaluation.detailedEvaluations.some(
                                        (detail) =>
                                          detail.category === "협업 능력"
                                      ) && (
                                        <p className="font-text text-[16px] text-sub">
                                          -
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Tab.Content>
              </Tab>
            </div>
          </section>

          {/* 관련 인재 정보 섹션 */}
          <section className="mt-[60px] lg:mt-[100px]">
            <h2 className="font-title text-[18px] lg:text-[20px] title-light text-primary mb-[20px]">
              관련 인재 정보
            </h2>
            {/* 데스크톱 그리드 */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-6">
              {relatedResumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  id={resume.id}
                  name={resume.name}
                  experience={resume.experience}
                  preferredLocation={resume.preferredLocation}
                  keywords={resume.keywords}
                  lastAccessDate={resume.lastAccessDate}
                  isBookmarked={resume.isBookmarked}
                  onClick={() => {
                    window.location.href = `/resumes/${resume.id}`;
                  }}
                  onBookmarkClick={() => {
                    console.log("북마크:", resume.id);
                  }}
                />
              ))}
            </div>
            {/* 모바일 가로 스크롤 */}
            <div className="lg:hidden overflow-x-auto">
              <div
                className="flex gap-4 pb-4"
                style={{ width: `${relatedResumes.length * 350}px` }}
              >
                {relatedResumes.map((resume) => (
                  <div key={resume.id} className="flex-shrink-0 w-[335px]">
                    <ResumeCard
                      id={resume.id}
                      name={resume.name}
                      experience={resume.experience}
                      preferredLocation={resume.preferredLocation}
                      keywords={resume.keywords}
                      lastAccessDate={resume.lastAccessDate}
                      isBookmarked={resume.isBookmarked}
                      onClick={() => {
                        window.location.href = `/resumes/${resume.id}`;
                      }}
                      onBookmarkClick={() => {
                        console.log("북마크:", resume.id);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
