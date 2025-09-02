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
  ChevronLeftIcon,
  ChevronRightIcon,
  StarEmptyIcon,
  StarFilledIcon,
  StarHalfIcon,
  WebIcon,
} from "public/icons";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { Tab } from "@/components/ui/Tab";
import JobInfoCard from "@/components/ui/JobInfoCard";
import { getHospitalById, HospitalDetailData } from "@/data/hospitalsData";

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

// 인터랙티브 별점 컴포넌트
const InteractiveStarRating = ({
  rating,
  onRatingChange,
  size = 20,
}: {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: number;
}) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleStarClick = (starRating: number) => {
    onRatingChange(starRating);
  };

  const handleStarHover = (starRating: number) => {
    setHoveredRating(starRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const displayRating = hoveredRating > 0 ? hoveredRating : rating;

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((starNumber) => (
        <button
          key={starNumber}
          type="button"
          className="cursor-pointer hover:scale-110 transition-transform"
          onClick={() => handleStarClick(starNumber)}
          onMouseEnter={() => handleStarHover(starNumber)}
          onMouseLeave={handleStarLeave}
        >
          {starNumber <= displayRating ? (
            <StarFilledIcon size={size} />
          ) : (
            <StarEmptyIcon size={size} />
          )}
        </button>
      ))}
    </div>
  );
};

export default function HospitalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [expandedEvaluations, setExpandedEvaluations] = useState<number[]>([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratings, setRatings] = useState({
    facilities: 0,
    staff: 0,
    service: 0,
    communication: 0,
    workEnvironment: 0,
  });
  const [comments, setComments] = useState({
    facilities: "",
    staff: "",
    service: "",
    communication: "",
    workEnvironment: "",
  });
  const { id } = use(params);

  const hospitalData = getHospitalById(id);

  if (!hospitalData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">병원을 찾을 수 없습니다</h1>
          <Link href="/jobs" className="text-blue-600 hover:underline">
            채용공고 목록으로 돌아가기
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
    return hospitalData.evaluations.overallAverage.toFixed(1);
  };

  // 평가 모달 관련 함수들
  const handleRatingChange = (
    category: keyof typeof ratings,
    rating: number
  ) => {
    setRatings((prev) => ({ ...prev, [category]: rating }));
  };

  const handleCommentChange = (
    category: keyof typeof comments,
    comment: string
  ) => {
    setComments((prev) => ({ ...prev, [category]: comment }));
  };

  const handleModalClose = () => {
    setShowRatingModal(false);
  };

  const handleRatingSubmit = () => {
    // 평가 제출 로직 (나중에 구현)
    console.log("병원 평가 제출:", { ratings, comments });
    setShowRatingModal(false);
  };

  const resetRatingForm = () => {
    setRatings({
      facilities: 0,
      staff: 0,
      service: 0,
      communication: 0,
      workEnvironment: 0,
    });
    setComments({
      facilities: "",
      staff: "",
      service: "",
      communication: "",
      workEnvironment: "",
    });
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
                    href={`/hospitals/${id}/edit`}
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
            {/* 병원 상단 섹션 - HospitalCard 스타일 */}
            <div className="relative rounded-[16px] border border-[#EFEFF0] flex flex-col lg:flex-row lg:justify-between items-start gap-[20px] lg:gap-[30px] p-[20px] lg:p-[28px] bg-white">
              {/* 병원 이미지 */}
              <div className="w-[80px] h-[80px] rounded-full bg-[#EFEFF0] flex items-center justify-center flex-shrink-0">
                <span className="font-text text-[24px] font-semibold text-sub">
                  {hospitalData.name.charAt(0)}
                </span>
              </div>

              {/* 병원 정보 */}
              <div className="w-full">
                <h3 className="font-text text-[20px] font-semibold text-primary mb-2">
                  {hospitalData.name}
                </h3>
                <p className="font-text text-[14px] text-sub mb-4 leading-relaxed lg:mr-[60px] mr-[30px]">
                  {hospitalData.summary}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <LocationIcon currentColor="#4F5866" />
                    <span className="font-text text-[14px] text-sub">
                      {hospitalData.address}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <WebIcon currentColor="#4F5866" />
                    <span className="font-text text-[14px] text-sub">
                      {hospitalData.website}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneIcon currentColor="#4F5866" />
                    <span className="font-text text-[14px] text-sub">
                      {hospitalData.contact}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {hospitalData.specialties.map((keyword, index) => (
                    <Tag key={index} variant={6}>
                      {keyword}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>

            {/* 탭 섹션 */}
            <div className="mt-[40px] lg:mt-[60px]">
              <Tab defaultTab="hospital-info" variant="rounded">
                <Tab.List>
                  <Tab.Item value="hospital-info">병원정보</Tab.Item>
                  <Tab.Item value="hospital-evaluation">병원평가</Tab.Item>
                </Tab.List>

                <Tab.Content value="hospital-info">
                  <div className="flex flex-col gap-[60px] lg:gap-[80px] w-full">
                    {/* 병원 정보 */}
                    <div>
                      <h3 className="font-text text-[18px] lg:text-[20px] text-semibold title-light text-primary mb-[16px]">
                        병원 정보
                      </h3>

                      <div className="flex flex-col">
                        <div className="flex gap-4">
                          <span className="font-text text-[14px] lg:text-[16px] text-sub w-[80px] flex-shrink-0">
                            설립일
                          </span>
                          <span className="font-text text-[14px] lg:text-[16px] text-primary">
                            {hospitalData.establishedYear}
                          </span>
                        </div>
                        <div className="flex gap-4">
                          <span className="font-text text-[14px] lg:text-[16px] text-sub w-[80px] flex-shrink-0">
                            주소
                          </span>
                          <span className="font-text text-[14px] lg:text-[16px] text-primary">
                            {hospitalData.address}
                          </span>
                        </div>
                        <div className="flex gap-4">
                          <span className="font-text text-[14px] lg:text-[16px] text-sub w-[80px] flex-shrink-0">
                            연락처
                          </span>
                          <span className="font-text text-[14px] lg:text-[16px] text-primary">
                            {hospitalData.contact}
                          </span>
                        </div>
                        <div className="flex gap-4">
                          <span className="font-text text-[14px] lg:text-[16px] text-sub w-[80px] flex-shrink-0">
                            이메일
                          </span>
                          <span className="font-text text-[14px] lg:text-[16px] text-primary">
                            {hospitalData.email}
                          </span>
                        </div>
                        <div className="flex gap-4">
                          <span className="font-text text-[14px] lg:text-[16px] text-sub w-[80px] flex-shrink-0">
                            진료 동물
                          </span>
                          <span className="font-text text-[14px] lg:text-[16px] text-primary">
                            {hospitalData.businessType}
                          </span>
                        </div>
                        <div className="flex gap-4">
                          <span className="font-text text-[14px] lg:text-[16px] text-sub w-[80px] flex-shrink-0">
                            진료 분야
                          </span>
                          <span className="font-text text-[14px] lg:text-[16px] text-primary">
                            {hospitalData.specialties.join(", ")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 병원 이미지 */}
                    <div>
                      <h3 className="font-text text-[18px] lg:text-[20px] text-semibold title-light text-primary mb-[16px]">
                        병원 이미지
                      </h3>

                      {/* 데스크톱 그리드 */}
                      <div className="hidden lg:grid lg:grid-cols-3 gap-4">
                        {hospitalData.facilityImages.map((image, index) => (
                          <div
                            key={index}
                            className="aspect-[4/3] rounded-[16px] overflow-hidden"
                          >
                            <Image
                              src={image}
                              alt={`${hospitalData.name} 시설 ${index + 1}`}
                              width={350}
                              height={260}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>

                      {/* 모바일 가로 스크롤 */}
                      <div className="lg:hidden overflow-x-auto">
                        <div className="flex gap-4 pb-4">
                          {hospitalData.facilityImages.map((image, index) => (
                            <div
                              key={index}
                              className="flex-shrink-0 w-[280px] aspect-[4/3] rounded-[16px] overflow-hidden"
                            >
                              <Image
                                src={image}
                                alt={`${hospitalData.name} 시설 ${index + 1}`}
                                width={280}
                                height={210}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 진행중인 채용공고 */}
                    <div>
                      <div className="flex justify-between items-center mb-[16px]">
                        <h3 className="font-text text-[18px] lg:text-[20px] text-semibold title-light text-primary">
                          진행중인 채용공고
                        </h3>
                        {hospitalData.jobPostings.length > 3 && (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                setCurrentJobIndex(
                                  Math.max(0, currentJobIndex - 1)
                                )
                              }
                              disabled={currentJobIndex === 0}
                              className="p-2 rounded-lg border border-[#EFEFF0] disabled:opacity-50 hover:bg-gray-100 w-[32px] h-[32px] rounded-[30px]"
                            >
                              <ChevronLeftIcon currentColor="#FF8796" />
                            </button>
                            <button
                              onClick={() =>
                                setCurrentJobIndex(
                                  Math.min(
                                    hospitalData.jobPostings.length - 3,
                                    currentJobIndex + 1
                                  )
                                )
                              }
                              disabled={
                                currentJobIndex >=
                                hospitalData.jobPostings.length - 3
                              }
                              className="p-2 rounded-lg border border-[#EFEFF0] disabled:opacity-50 hover:bg-gray-100 w-[32px] h-[32px] rounded-[30px]"
                            >
                              <ChevronRightIcon currentColor="#FF8796" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 데스크톱 그리드 */}
                      <div className="hidden lg:grid lg:grid-cols-3 gap-6">
                        {hospitalData.jobPostings
                          .slice(currentJobIndex, currentJobIndex + 3)
                          .map((job) => (
                            <JobInfoCard
                              key={job.id}
                              hospital={job.title}
                              dDay={job.deadline}
                              position="간호조무사(정규직)"
                              location={job.location}
                              jobType={job.experience}
                              tags={[job.type, job.experience]}
                              isBookmarked={job.isBookmarked}
                              onClick={() => {
                                window.location.href = `/jobs/${job.id}`;
                              }}
                            />
                          ))}
                      </div>

                      {/* 모바일 가로 스크롤 */}
                      <div className="lg:hidden overflow-x-auto">
                        <div className="flex gap-4 pb-4">
                          {hospitalData.jobPostings
                            .slice(currentJobIndex, currentJobIndex + 3)
                            .map((job) => (
                              <div key={job.id} className="flex-shrink-0">
                                <JobInfoCard
                                  hospital={job.title}
                                  dDay={job.deadline}
                                  position="간호조무사(정규직)"
                                  location={job.location}
                                  jobType={job.experience}
                                  tags={[job.type, job.experience]}
                                  isBookmarked={job.isBookmarked}
                                  onClick={() => {
                                    window.location.href = `/jobs/${job.id}`;
                                  }}
                                />
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* 병원 소개 */}
                    <div>
                      <h3 className="font-text text-[20px] text-semibold lg:text-[20px] title-light text-primary mb-[16px]">
                        병원 소개
                      </h3>
                      <div className="border border-[1px] border-[#CACAD2] bg-box-light rounded-[6px] px-[20px] py-[16px]">
                        <p className="font-text text-[14px] lg:text-[16px] text-sub leading-relaxed whitespace-pre-line">
                          {hospitalData.introduction}
                        </p>
                      </div>
                    </div>
                  </div>
                </Tab.Content>

                <Tab.Content value="hospital-evaluation">
                  {hospitalData.evaluations.hospitals.length === 0 ? (
                    <div className="w-full flex items-center justify-center py-20">
                      <div className="text-center">
                        <p className="font-text text-[16px] text-sub mb-4">
                          아직 평가된 기록이 없습니다.
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
                          병원 평가
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
                            onClick={() => setShowRatingModal(true)}
                          >
                            평가하기
                          </Button>
                        </div>
                      </div>

                      {/* 평가자별 평가 목록 */}
                      <div className="w-full flex flex-col">
                        {hospitalData.evaluations.hospitals.map(
                          (evaluation) => (
                            <div
                              key={evaluation.id}
                              className="w-full bg-white overflow-hidden border-b border-[#EFEFF0]"
                            >
                              {/* 평가자 헤더 */}
                              <div
                                className="flex justify-between items-center p-[16px] lg:p-[20px] cursor-pointer hover:bg-gray-50"
                                onClick={() => toggleEvaluation(evaluation.id)}
                              >
                                <div className="flex items-center gap-[12px] lg:gap-[16px] flex-1 min-w-0">
                                  <div className="w-[32px] h-[32px] lg:w-[40px] lg:h-[40px] rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <span className="font-text text-[14px] lg:text-[16px] font-semibold text-sub">
                                      {evaluation.evaluatorName.charAt(0)}
                                    </span>
                                  </div>
                                  <div className="flex flex-col min-w-0 flex-1">
                                    <span className="font-text text-[14px] lg:text-[18px] font-semibold text-primary truncate">
                                      {evaluation.evaluatorName}
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
                                  {expandedEvaluations.includes(
                                    evaluation.id
                                  ) ? (
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
                                    {/* 시설 및 장비 */}
                                    <div>
                                      <div className="flex justify-between items-center mb-[12px]">
                                        <span className="font-text text-[16px] font-semibold text-primary">
                                          시설 및 장비
                                        </span>
                                        <div className="flex items-center gap-[8px]">
                                          <span className="font-text text-[16px] font-bold text-primary">
                                            {evaluation.ratings.facilities.toFixed(
                                              1
                                            )}
                                          </span>
                                          <StarRating
                                            rating={
                                              evaluation.ratings.facilities
                                            }
                                            size={14}
                                          />
                                        </div>
                                      </div>
                                      <div className="border border-[1px] border-[#EFEFF0] bg-box-light p-[10px] rounded-[8px]">
                                        {evaluation.detailedEvaluations
                                          .filter(
                                            (detail) =>
                                              detail.category === "시설 및 장비"
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
                                            detail.category === "시설 및 장비"
                                        ) && (
                                          <p className="font-text text-[16px] text-sub">
                                            -
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    {/* 직원 전문성 */}
                                    <div>
                                      <div className="flex justify-between items-center mb-[12px]">
                                        <span className="font-text text-[16px] font-semibold text-primary">
                                          직원 전문성
                                        </span>
                                        <div className="flex items-center gap-[8px]">
                                          <span className="font-text text-[16px] font-bold text-primary">
                                            {evaluation.ratings.staff.toFixed(
                                              1
                                            )}
                                          </span>
                                          <StarRating
                                            rating={evaluation.ratings.staff}
                                            size={14}
                                          />
                                        </div>
                                      </div>
                                      <div className="border border-[1px] border-[#EFEFF0] bg-box-light p-[10px] rounded-[8px]">
                                        {evaluation.detailedEvaluations
                                          .filter(
                                            (detail) =>
                                              detail.category === "직원 전문성"
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
                                            detail.category === "직원 전문성"
                                        ) && (
                                          <p className="font-text text-[16px] text-sub">
                                            -
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    {/* 서비스 품질 */}
                                    <div>
                                      <div className="flex justify-between items-center mb-[12px]">
                                        <span className="font-text text-[16px] font-semibold text-primary">
                                          서비스 품질
                                        </span>
                                        <div className="flex items-center gap-[8px]">
                                          <span className="font-text text-[16px] font-bold text-primary">
                                            {evaluation.ratings.service.toFixed(
                                              1
                                            )}
                                          </span>
                                          <StarRating
                                            rating={evaluation.ratings.service}
                                            size={14}
                                          />
                                        </div>
                                      </div>
                                      <div className="border border-[1px] border-[#EFEFF0] bg-box-light p-[10px] rounded-[8px]">
                                        {evaluation.detailedEvaluations
                                          .filter(
                                            (detail) =>
                                              detail.category === "서비스 품질"
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
                                            detail.category === "서비스 품질"
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
                          )
                        )}
                      </div>
                    </div>
                  )}
                </Tab.Content>
              </Tab>
            </div>
          </section>
        </div>
      </div>

      {/* 병원 평가하기 모달 */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          {/* 데스크톱 모달 */}
          <div className="hidden lg:block relative bg-white rounded-[16px] w-[968px] max-h-[80vh] overflow-y-auto">
            {/* 모달 헤더 */}
            <div className="flex justify-between items-center p-[24px] border-b border-[#EFEFF0]">
              <h2 className="font-title text-[24px] font-light text-primary">
                병원 평가하기
              </h2>
              <button
                onClick={handleModalClose}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="#3B394D"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* 모달 콘텐츠 */}
            <div className="p-[24px] space-y-[32px]">
              {/* 시설 및 장비 */}
              <div>
                <div className="mb-[12px]">
                  <h3 className="font-text text-[16px] font-semibold text-primary mb-[4px]">
                    시설 및 장비
                  </h3>
                  <p className="font-text text-[16px] text-subtext2">
                    병원의 시설 현대성, 장비의 적절성, 청결도 및 환경 관리
                  </p>
                </div>
                <div className="mb-[16px]">
                  <InteractiveStarRating
                    rating={ratings.facilities}
                    onRatingChange={(rating) =>
                      handleRatingChange("facilities", rating)
                    }
                    size={24}
                  />
                </div>
                <textarea
                  value={comments.facilities}
                  onChange={(e) =>
                    handleCommentChange("facilities", e.target.value)
                  }
                  placeholder="시설 및 장비에 대한 평가를 자세히 작성해 주세요."
                  className="w-full h-[80px] p-[12px] border border-[#EFEFF0] rounded-[8px] bg-[#FBFBFB] font-text text-[14px] text-primary resize-none focus:outline-none focus:border-key1"
                  maxLength={500}
                />
                <div className="text-right mt-[8px]">
                  <span className="font-text text-[12px] text-guide">
                    {comments.facilities.length}/500
                  </span>
                </div>
              </div>

              {/* 직원 전문성 */}
              <div>
                <div className="mb-[12px]">
                  <h3 className="font-text text-[16px] font-semibold text-primary mb-[4px]">
                    직원 전문성
                  </h3>
                  <p className="font-text text-[16px] text-subtext2">
                    수의사 및 간호사의 전문 지식, 기술적 역량, 경험 및 자격
                  </p>
                </div>
                <div className="mb-[16px]">
                  <InteractiveStarRating
                    rating={ratings.staff}
                    onRatingChange={(rating) =>
                      handleRatingChange("staff", rating)
                    }
                    size={24}
                  />
                </div>
                <textarea
                  value={comments.staff}
                  onChange={(e) =>
                    handleCommentChange("staff", e.target.value)
                  }
                  placeholder="직원 전문성에 대한 평가를 자세히 작성해 주세요."
                  className="w-full h-[80px] p-[12px] border border-[#EFEFF0] rounded-[8px] bg-[#FBFBFB] font-text text-[14px] text-primary resize-none focus:outline-none focus:border-key1"
                  maxLength={500}
                />
                <div className="text-right mt-[8px]">
                  <span className="font-text text-[12px] text-guide">
                    {comments.staff.length}/500
                  </span>
                </div>
              </div>

              {/* 서비스 품질 */}
              <div>
                <div className="mb-[12px]">
                  <h3 className="font-text text-[16px] font-semibold text-primary mb-[4px]">
                    서비스 품질
                  </h3>
                  <p className="font-text text-[16px] text-subtext2">
                    진료의 질, 대기시간, 예약 시스템, 응급상황 대응 등
                  </p>
                </div>
                <div className="mb-[16px]">
                  <InteractiveStarRating
                    rating={ratings.service}
                    onRatingChange={(rating) =>
                      handleRatingChange("service", rating)
                    }
                    size={24}
                  />
                </div>
                <textarea
                  value={comments.service}
                  onChange={(e) => handleCommentChange("service", e.target.value)}
                  placeholder="서비스 품질에 대한 평가를 자세히 작성해 주세요."
                  className="w-full h-[80px] p-[12px] border border-[#EFEFF0] rounded-[8px] bg-[#FBFBFB] font-text text-[14px] text-primary resize-none focus:outline-none focus:border-key1"
                  maxLength={500}
                />
                <div className="text-right mt-[8px]">
                  <span className="font-text text-[12px] text-guide">
                    {comments.service.length}/500
                  </span>
                </div>
              </div>

              {/* 소통 및 상담 */}
              <div>
                <div className="mb-[12px]">
                  <h3 className="font-text text-[16px] font-semibold text-primary mb-[4px]">
                    소통 및 상담
                  </h3>
                  <p className="font-text text-[16px] text-subtext2">
                    보호자와의 소통, 설명의 명확성, 친절도 및 상담 질
                  </p>
                </div>
                <div className="mb-[16px]">
                  <InteractiveStarRating
                    rating={ratings.communication}
                    onRatingChange={(rating) =>
                      handleRatingChange("communication", rating)
                    }
                    size={24}
                  />
                </div>
                <textarea
                  value={comments.communication}
                  onChange={(e) =>
                    handleCommentChange("communication", e.target.value)
                  }
                  placeholder="소통 및 상담에 대한 평가를 자세히 작성해 주세요."
                  className="w-full h-[80px] p-[12px] border border-[#EFEFF0] rounded-[8px] bg-[#FBFBFB] font-text text-[14px] text-primary resize-none focus:outline-none focus:border-key1"
                  maxLength={500}
                />
                <div className="text-right mt-[8px]">
                  <span className="font-text text-[12px] text-guide">
                    {comments.communication.length}/500
                  </span>
                </div>
              </div>

              {/* 근무 환경 */}
              <div>
                <div className="mb-[12px]">
                  <h3 className="font-text text-[16px] font-semibold text-primary mb-[4px]">
                    근무 환경
                  </h3>
                  <p className="font-text text-[16px] text-subtext2">
                    직원들의 업무 분위기, 조직 문화, 워라벨, 복지 혜택 등
                  </p>
                </div>
                <div className="mb-[16px]">
                  <InteractiveStarRating
                    rating={ratings.workEnvironment}
                    onRatingChange={(rating) =>
                      handleRatingChange("workEnvironment", rating)
                    }
                    size={24}
                  />
                </div>
                <textarea
                  value={comments.workEnvironment}
                  onChange={(e) =>
                    handleCommentChange("workEnvironment", e.target.value)
                  }
                  placeholder="근무 환경에 대한 평가를 자세히 작성해 주세요."
                  className="w-full h-[80px] p-[12px] border border-[#EFEFF0] rounded-[8px] bg-[#FBFBFB] font-text text-[14px] text-primary resize-none focus:outline-none focus:border-key1"
                  maxLength={500}
                />
                <div className="text-right mt-[8px]">
                  <span className="font-text text-[12px] text-guide">
                    {comments.workEnvironment.length}/500
                  </span>
                </div>
              </div>
            </div>

            {/* 모달 푸터 */}
            <div className="flex justify-end gap-[12px] p-[24px] border-t border-[#EFEFF0]">
              <Button
                variant="text"
                size="medium"
                onClick={() => {
                  resetRatingForm();
                  handleModalClose();
                }}
              >
                취소
              </Button>
              <Button
                variant="keycolor"
                size="medium"
                onClick={handleRatingSubmit}
                className="bg-[#4F5866] text-white"
              >
                등록하기
              </Button>
            </div>
          </div>

          {/* 모바일 모달 (전체 화면) */}
          <div className="lg:hidden fixed inset-0 bg-white z-50 overflow-y-auto">
            {/* 모바일 헤더 */}
            <div className="flex items-center justify-between p-[16px] border-b border-[#EFEFF0]">
              <button
                onClick={handleModalClose}
                className="flex items-center justify-center w-8 h-8"
              >
                <ArrowLeftIcon currentColor="currentColor" />
              </button>
              <h2 className="font-title text-[16px] font-light text-primary">
                병원 평가하기
              </h2>
              <div className="w-8 h-8"></div>
            </div>

            {/* 모바일 콘텐츠 */}
            <div className="p-[16px] pb-[120px] space-y-[24px]">
              {/* 시설 및 장비 */}
              <div>
                <div className="mb-[12px]">
                  <h3 className="font-text text-[16px] font-semibold text-primary mb-[4px]">
                    시설 및 장비
                  </h3>
                  <p className="font-text text-[16px] text-subtext2">
                    병원의 시설 현대성, 장비의 적절성, 청결도 및 환경 관리
                  </p>
                </div>
                <div className="mb-[16px]">
                  <InteractiveStarRating
                    rating={ratings.facilities}
                    onRatingChange={(rating) =>
                      handleRatingChange("facilities", rating)
                    }
                    size={20}
                  />
                </div>
                <textarea
                  value={comments.facilities}
                  onChange={(e) =>
                    handleCommentChange("facilities", e.target.value)
                  }
                  placeholder="시설 및 장비에 대한 평가를 자세히 작성해 주세요."
                  className="w-full h-[80px] p-[12px] border border-[#EFEFF0] rounded-[8px] bg-[#FBFBFB] font-text text-[14px] text-primary resize-none focus:outline-none focus:border-key1"
                  maxLength={500}
                />
                <div className="text-right mt-[8px]">
                  <span className="font-text text-[12px] text-guide">
                    {comments.facilities.length}/500
                  </span>
                </div>
              </div>

              {/* 직원 전문성 */}
              <div>
                <div className="mb-[12px]">
                  <h3 className="font-text text-[16px] font-semibold text-primary mb-[4px]">
                    직원 전문성
                  </h3>
                  <p className="font-text text-[16px] text-subtext2">
                    수의사 및 간호사의 전문 지식, 기술적 역량, 경험 및 자격
                  </p>
                </div>
                <div className="mb-[16px]">
                  <InteractiveStarRating
                    rating={ratings.staff}
                    onRatingChange={(rating) =>
                      handleRatingChange("staff", rating)
                    }
                    size={20}
                  />
                </div>
                <textarea
                  value={comments.staff}
                  onChange={(e) =>
                    handleCommentChange("staff", e.target.value)
                  }
                  placeholder="직원 전문성에 대한 평가를 자세히 작성해 주세요."
                  className="w-full h-[80px] p-[12px] border border-[#EFEFF0] rounded-[8px] bg-[#FBFBFB] font-text text-[14px] text-primary resize-none focus:outline-none focus:border-key1"
                  maxLength={500}
                />
                <div className="text-right mt-[8px]">
                  <span className="font-text text-[12px] text-guide">
                    {comments.staff.length}/500
                  </span>
                </div>
              </div>

              {/* 서비스 품질 */}
              <div>
                <div className="mb-[12px]">
                  <h3 className="font-text text-[16px] font-semibold text-primary mb-[4px]">
                    서비스 품질
                  </h3>
                  <p className="font-text text-[16px] text-subtext2">
                    진료의 질, 대기시간, 예약 시스템, 응급상황 대응 등
                  </p>
                </div>
                <div className="mb-[16px]">
                  <InteractiveStarRating
                    rating={ratings.service}
                    onRatingChange={(rating) =>
                      handleRatingChange("service", rating)
                    }
                    size={20}
                  />
                </div>
                <textarea
                  value={comments.service}
                  onChange={(e) => handleCommentChange("service", e.target.value)}
                  placeholder="서비스 품질에 대한 평가를 자세히 작성해 주세요."
                  className="w-full h-[80px] p-[12px] border border-[#EFEFF0] rounded-[8px] bg-[#FBFBFB] font-text text-[14px] text-primary resize-none focus:outline-none focus:border-key1"
                  maxLength={500}
                />
                <div className="text-right mt-[8px]">
                  <span className="font-text text-[12px] text-guide">
                    {comments.service.length}/500
                  </span>
                </div>
              </div>

              {/* 소통 및 상담 */}
              <div>
                <div className="mb-[12px]">
                  <h3 className="font-text text-[16px] font-semibold text-primary mb-[4px]">
                    소통 및 상담
                  </h3>
                  <p className="font-text text-[16px] text-subtext2">
                    보호자와의 소통, 설명의 명확성, 친절도 및 상담 질
                  </p>
                </div>
                <div className="mb-[16px]">
                  <InteractiveStarRating
                    rating={ratings.communication}
                    onRatingChange={(rating) =>
                      handleRatingChange("communication", rating)
                    }
                    size={20}
                  />
                </div>
                <textarea
                  value={comments.communication}
                  onChange={(e) =>
                    handleCommentChange("communication", e.target.value)
                  }
                  placeholder="소통 및 상담에 대한 평가를 자세히 작성해 주세요."
                  className="w-full h-[80px] p-[12px] border border-[#EFEFF0] rounded-[8px] bg-[#FBFBFB] font-text text-[14px] text-primary resize-none focus:outline-none focus:border-key1"
                  maxLength={500}
                />
                <div className="text-right mt-[8px]">
                  <span className="font-text text-[12px] text-guide">
                    {comments.communication.length}/500
                  </span>
                </div>
              </div>

              {/* 근무 환경 */}
              <div>
                <div className="mb-[12px]">
                  <h3 className="font-text text-[16px] font-semibold text-primary mb-[4px]">
                    근무 환경
                  </h3>
                  <p className="font-text text-[16px] text-subtext2">
                    직원들의 업무 분위기, 조직 문화, 워라벨, 복지 혜택 등
                  </p>
                </div>
                <div className="mb-[16px]">
                  <InteractiveStarRating
                    rating={ratings.workEnvironment}
                    onRatingChange={(rating) =>
                      handleRatingChange("workEnvironment", rating)
                    }
                    size={20}
                  />
                </div>
                <textarea
                  value={comments.workEnvironment}
                  onChange={(e) =>
                    handleCommentChange("workEnvironment", e.target.value)
                  }
                  placeholder="근무 환경에 대한 평가를 자세히 작성해 주세요."
                  className="w-full h-[80px] p-[12px] border border-[#EFEFF0] rounded-[8px] bg-[#FBFBFB] font-text text-[14px] text-primary resize-none focus:outline-none focus:border-key1"
                  maxLength={500}
                />
                <div className="text-right mt-[8px]">
                  <span className="font-text text-[12px] text-guide">
                    {comments.workEnvironment.length}/500
                  </span>
                </div>
              </div>
            </div>

            {/* 모바일 푸터 */}
            <div className="fixed bottom-0 left-0 right-0 flex gap-[12px] p-[16px] bg-white border-t border-[#EFEFF0]">
              <Button
                variant="text"
                size="medium"
                fullWidth
                onClick={() => {
                  resetRatingForm();
                  handleModalClose();
                }}
              >
                취소
              </Button>
              <Button
                variant="keycolor"
                size="medium"
                onClick={handleRatingSubmit}
              >
                등록하기
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
