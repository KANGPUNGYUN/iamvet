"use client";

import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Input/Checkbox";
import { FilterBox } from "@/components/ui/FilterBox";
import { Radio } from "@/components/ui/Input/Radio";
import { Tab } from "@/components/ui/Tab";
import { Tag } from "@/components/ui/Tag";
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserLargeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BookmarkIcon,
  BookmarkFilledIcon,
  HeartIcon,
  HeartFilledIcon,
  ShareIcon,
  Edit2Icon,
  MenuIcon,
  GridIcon,
  CheckIcon,
  ExcelIcon,
  WordIcon,
  PdfIcon,
  SearchIcon,
  ExternalLinkIcon,
  MoreIcon,
  MoreVerticalIcon,
  HomeIcon,
  UserPlusIcon,
  ListIcon,
  BellOutlineIcon,
  UsersIcon,
  HeartMenuIcon,
  SettingsIcon,
  calendarIcon,
  EditIcon,
  PlusIcon,
  UserIcon,
  LocationIcon,
  ConnectionIcon,
  WalletIcon,
  PhoneIcon,
  DollarIcon,
  EyeIcon,
  EyeSmallIcon,
  DocumentIcon,
  InfoIcon,
  MailIcon,
  FilterIcon,
  ArrowRightIcon,
  TrashIcon,
  BellIcon,
  CloseIcon,
  UploadIcon,
  DoublePrevIcon,
  PrevIcon,
  NextIcon,
  DoubleNextIcon,
  LinkIcon,
  ImageIcon,
  WebIcon,
  PageIcon,
  Link2Icon,
  DownloadIcon,
} from "public/icons";
import banner1Img from "@/assets/images/banner1.png";
import banner2Img from "@/assets/images/banner2.png";
import banner3Img from "@/assets/images/banner3.png";
import lightbombImg from "@/assets/images/lightbomb.png";
import hospitalImg from "@/assets/images/hospital.png";
import lecture1Img from "@/assets/images/lecture/lecture1.png";
import AdvertisementSlider from "@/components/ui/AdvertisementSlider";
import { advertisementsData } from "@/data/advertisementsData";
import { useState } from "react";
import { TimePicker, TimeValue } from "@/components/ui/TimePicker";
import BannerSlider, {
  BannerItem,
} from "@/components/features/main/BannerSlider";
import AITalentButton from "@/components/features/main/AITalentButton";
import JobFamousList from "@/components/features/main/JobFamousList";
import JobInfoCard from "@/components/ui/JobInfoCard";
import TransferCard from "@/components/ui/TransferCard/TransferCard";
import LectureCard from "@/components/ui/LectureCard/LectureCard";
import { allLecturesData } from "@/data/lecturesData";
import { allJobData } from "@/data/jobsData";
import { allResumeData } from "@/data/resumesData";
import { allTransferData } from "@/data/transfersData";
import Link from "next/link";

export default function HomePage() {
  // 수술 강의 필터링
  const surgeryLectures = allLecturesData
    .filter((lecture) => lecture.medicalField === "surgery")
    .slice(0, 4);

  // 행동/심리학 강의 필터링
  const behaviorLectures = allLecturesData
    .filter((lecture) => lecture.medicalField === "behavior")
    .slice(0, 4);

  // 구인정보 데이터 (최신 5개)
  const jobPostings = allJobData.slice(0, 5);

  // 구직정보 데이터 (최신 5개)
  const resumePostings = allResumeData.slice(0, 5);

  // 양도매물 데이터 카테고리별 필터링
  const hospitalTransfers = allTransferData
    .filter((item) => item.category === "hospital")
    .slice(0, 8);
  
  const machineTransfers = allTransferData
    .filter((item) => item.category === "machine")
    .slice(0, 8);
    
  const deviceTransfers = allTransferData
    .filter((item) => item.category === "device")
    .slice(0, 8);
    
  const interiorTransfers = allTransferData
    .filter((item) => item.category === "interior")
    .slice(0, 8);

  const handlePrivacyClick = () => {
    console.log("개인정보처리방침 클릭");
    // 실제 라우팅 로직
  };

  const [inputValue1, setInputValue1] = useState("");
  const [price, setPrice] = useState("");

  const options = [
    { value: "option1", label: "옵션 1" },
    { value: "option2", label: "옵션 2" },
    { value: "option3", label: "옵션 3", disabled: true },
  ];

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<TimeValue | null>(null);

  // DatePicker 핸들러 함수들
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    console.log("선택된 날짜:", date.toLocaleDateString("ko-KR"));
  };

  const handleRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    console.log("선택된 기간:", {
      시작일: start?.toLocaleDateString("ko-KR"),
      종료일: end?.toLocaleDateString("ko-KR"),
    });
  };

  const handleTimeChange = (time: TimeValue) => {
    setSelectedTime(time);
    console.log("선택된 시간:", {
      시간: time.hour,
      분: time.minute,
      오전오후: time.period || "24시간 형식",
    });

    // 시간을 문자열로 포맷팅하여 로그 출력
    const formattedTime = time.period
      ? `${time.hour.toString().padStart(2, "0")}:${time.minute
          .toString()
          .padStart(2, "0")} ${time.period}`
      : `${time.hour.toString().padStart(2, "0")}:${time.minute
          .toString()
          .padStart(2, "0")}`;

    console.log("포맷된 시간:", formattedTime);
  };

  // 페이지네이션을 위한 간단한 컴포넌트들
  const PaginationButton = ({
    children,
    isActive = false,
    disabled = false,
    onClick,
  }: {
    children: React.ReactNode;
    isActive?: boolean;
    disabled?: boolean;
    onClick?: () => void;
  }) => {
    const [isHovered, setIsHovered] = useState(false);

    const getButtonStyle = () => {
      let baseStyle = {
        display: "flex",
        width: "40px",
        height: "40px",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "8px",
        fontFamily: "Pretendard, sans-serif",
        fontSize: "14px",
        fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease-in-out",
        userSelect: "none" as const,
        border: "1px solid #EFEFF0",
        background: "#FFF",
        color: "#3B394D",
      };

      if (disabled) {
        baseStyle.color = "#9098A4";
        baseStyle.cursor = "not-allowed";
      } else if (isActive) {
        baseStyle.background = "#FF8796";
        baseStyle.color = "#FFF";
        baseStyle.border = "1px solid #FF8796";
      } else if (isHovered) {
        baseStyle.background = "#FFF7F7";
        baseStyle.border = "1px solid #FFF7F7";
      }

      return baseStyle;
    };

    return (
      <button
        style={getButtonStyle()}
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
      </button>
    );
  };

  const PrevIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M10.06 12L11 11.06L7.94667 8L11 4.94L10.06 4L6.06 8L10.06 12Z"
        fill="currentColor"
      />
    </svg>
  );

  const NextIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M6.94 4L6 4.94L9.05333 8L6 11.06L6.94 12L10.94 8L6.94 4Z"
        fill="currentColor"
      />
    </svg>
  );

  const MoreIcon = () => (
    <svg width="20" height="20" viewBox="0 0 13 2" fill="none">
      <circle cx="1.5" cy="1" r="1" fill="currentColor" />
      <circle cx="6.5" cy="1" r="1" fill="currentColor" />
      <circle cx="11.5" cy="1" r="1" fill="currentColor" />
    </svg>
  );

  const SimplePagination = ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) => {
    const generatePageNumbers = () => {
      const pages: (number | "ellipsis")[] = [];
      const maxVisiblePages = 7;

      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        const sidePages = Math.floor((maxVisiblePages - 3) / 2);

        if (currentPage <= sidePages + 2) {
          for (let i = 1; i <= maxVisiblePages - 2; i++) {
            pages.push(i);
          }
          pages.push("ellipsis");
          pages.push(totalPages);
        } else if (currentPage >= totalPages - sidePages - 1) {
          pages.push(1);
          pages.push("ellipsis");
          for (let i = totalPages - maxVisiblePages + 3; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push("ellipsis");
          for (
            let i = currentPage - sidePages;
            i <= currentPage + sidePages;
            i++
          ) {
            pages.push(i);
          }
          pages.push("ellipsis");
          pages.push(totalPages);
        }
      }

      return pages;
    };

    const pageNumbers = generatePageNumbers();

    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "8px",
          justifyContent: "center",
        }}
      >
        {/* 이전 버튼 */}
        <PaginationButton
          disabled={currentPage === 1}
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        >
          <PrevIcon />
        </PaginationButton>

        {/* 페이지 번호들 */}
        {pageNumbers.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <PaginationButton key={`ellipsis-${index}`} disabled={true}>
                <MoreIcon />
              </PaginationButton>
            );
          }

          return (
            <PaginationButton
              key={page}
              isActive={currentPage === page}
              onClick={() => onPageChange(page)}
            >
              {page}
            </PaginationButton>
          );
        })}

        {/* 다음 버튼 */}
        <PaginationButton
          disabled={currentPage === totalPages}
          onClick={() =>
            currentPage < totalPages && onPageChange(currentPage + 1)
          }
        >
          <NextIcon />
        </PaginationButton>
      </div>
    );
  };

  const iconComponents = [
    { name: "ArrowLeftIcon", component: ArrowLeftIcon },
    { name: "ArrowRightIcon", component: ArrowRightIcon },
    { name: "ChevronLeftIcon", component: ChevronLeftIcon },
    { name: "ChevronRightIcon", component: ChevronRightIcon },
    { name: "ChevronDownIcon", component: ChevronDownIcon },
    { name: "ChevronUpIcon", component: ChevronUpIcon },
    { name: "UserIcon", component: UserIcon },
    { name: "UserLargeIcon", component: UserLargeIcon },
    { name: "BookmarkIcon", component: BookmarkIcon },
    { name: "BookmarkFilledIcon", component: BookmarkFilledIcon },
    { name: "HeartIcon", component: HeartIcon },
    { name: "HeartFilledIcon", component: HeartFilledIcon },
    { name: "ShareIcon", component: ShareIcon },
    { name: "EditIcon", component: EditIcon },
    { name: "Edit2Icon", component: Edit2Icon },
    { name: "MenuIcon", component: MenuIcon },
    { name: "GridIcon", component: GridIcon },
    { name: "CheckIcon", component: CheckIcon },
    { name: "ExcelIcon", component: ExcelIcon },
    { name: "WordIcon", component: WordIcon },
    { name: "PdfIcon", component: PdfIcon },
    { name: "SearchIcon", component: SearchIcon },
    { name: "ExternalLinkIcon", component: ExternalLinkIcon },
    { name: "MoreIcon", component: MoreIcon },
    { name: "MoreVerticalIcon", component: MoreVerticalIcon },
    { name: "HomeIcon", component: HomeIcon },
    { name: "UserPlusIcon", component: UserPlusIcon },
    { name: "ListIcon", component: ListIcon },
    { name: "BellOutlineIcon", component: BellOutlineIcon },
    { name: "UsersIcon", component: UsersIcon },
    { name: "HeartMenuIcon", component: HeartMenuIcon },
    { name: "SettingsIcon", component: SettingsIcon },
    { name: "calendarIcon", component: calendarIcon },
    { name: "PlusIcon", component: PlusIcon },
    { name: "LocationIcon", component: LocationIcon },
    { name: "ConnectionIcon", component: ConnectionIcon },
    { name: "WalletIcon", component: WalletIcon },
    { name: "PhoneIcon", component: PhoneIcon },
    { name: "DollarIcon", component: DollarIcon },
    { name: "EyeIcon", component: EyeIcon },
    { name: "EyeSmallIcon", component: EyeSmallIcon },
    { name: "DocumentIcon", component: DocumentIcon },
    { name: "InfoIcon", component: InfoIcon },
    { name: "MailIcon", component: MailIcon },
    { name: "FilterIcon", component: FilterIcon },
    { name: "TrashIcon", component: TrashIcon },
    { name: "BellIcon", component: BellIcon },
    { name: "CloseIcon", component: CloseIcon },
    { name: "UploadIcon", component: UploadIcon },
    { name: "DoublePrevIcon", component: DoublePrevIcon },
    { name: "PrevIcon", component: PrevIcon },
    { name: "NextIcon", component: NextIcon },
    { name: "DoubleNextIcon", component: DoubleNextIcon },
    { name: "LinkIcon", component: LinkIcon },
    { name: "ImageIcon", component: ImageIcon },
    { name: "WebIcon", component: WebIcon },
    { name: "PageIcon", component: PageIcon },
    { name: "Link2Icon", component: Link2Icon },
    { name: "DownloadIcon", component: DownloadIcon },
  ];

  const groupedIcons = [];
  for (let i = 0; i < iconComponents.length; i += 4) {
    groupedIcons.push(iconComponents.slice(i, i + 4));
  }

  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([
    "",
  ]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([""]);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleSearch = (value: string) => {
    console.log("검색:", value);
    setSearchResults([
      `"${value}" 검색 결과 1`,
      `"${value}" 검색 결과 2`,
      `"${value}" 검색 결과 3`,
    ]);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log(`페이지 ${page}로 이동`);
  };

  const [selectedValue, setSelectedValue] = useState("");

  const handleSelectChange = (value: string) => {
    setSelectedValue(value);
    console.log("Selected value:", value);
  };

  const handleAITalentSearch = () => {
    console.log("AI로 인재 찾기 클릭");
    // AI 인재 검색 로직 또는 페이지 이동
  };

  const sampleBanners: BannerItem[] = [
    {
      id: "1",
      imageUrl: banner1Img,
      alt: "첫 번째 배너",
      buttonText: "확인하러 가기",
      buttonLink: "/member-select",
    },
    {
      id: "2",
      imageUrl: banner2Img,
      alt: "두 번째 배너",
      buttonText: "확인하러 가기",
      buttonLink: "/member-select",
    },
    {
      id: "3",
      imageUrl: banner3Img,
      alt: "세 번째 배너",
      buttonText: "확인하러 가기",
      buttonLink: "/member-select",
    },
  ];

  return (
    <>

      <div className="w-full">
        <div className="max-w-[1320px] mx-auto md:px-[60px] py-[30px] px-[15px]">
          {/* 데스크톱: 가로 배치, 모바일: 세로 배치 */}
          <div className="flex flex-col xl:flex-row xl:items-start xl:gap-[30px] gap-8">
            <div className="flex-1">
              <BannerSlider
                banners={sampleBanners}
                autoSlideInterval={4000}
                showButton={true}
              />
            </div>

            <div className="flex items-center xl:items-start gap-[12px] xl:flex-shrink-0 xl:flex-col flex-col-reverse xl:w-auto w-full">
              <div className="flex flex-col gap-[12px] xl:w-auto w-full">
                <AITalentButton
                  title="AI로 인재 찾기"
                  description="AI로 인재를 찾아 고용해보세요!"
                  variant="lightbomb"
                  imageSrc={lightbombImg.src}
                  onClick={handleAITalentSearch}
                />

                <AITalentButton
                  title="AI로 병원 찾기"
                  description="필요한 병원을 빠르고 신속하게!"
                  variant="hospital"
                  imageSrc={hospitalImg.src}
                  onClick={handleAITalentSearch}
                />
              </div>
              <JobFamousList />
            </div>
          </div>
          <Tab
            defaultTab="internal"
            variant="default"
            className="bg-box-light xl:px-[32px] py-[36px] px-[16px] rounded-[16px] mt-[30px]"
          >
            <Tab.List className="flex md:justify-between md:items-center flex-col md:flex-row gap-[16px] md:gap-0">
              <div className="flex gap-4">
                <Tab.Item value="internal">구직정보</Tab.Item>
                <Tab.Item value="surgery">구인정보</Tab.Item>
              </div>
              <Link
                className="flex font-title title-light text-[16px] text-sub hover:underline self-end md:self-auto"
                href="/jobs"
              >
                {<PlusIcon />} 전체보기
              </Link>
            </Tab.List>
            <Tab.Content value="internal">
              <div
                className="flex items-center gap-[10px] overflow-x-auto custom-scrollbar"
                style={{ alignSelf: "stretch" }}
              >
                {jobPostings.map((job) => (
                  <JobInfoCard
                    key={job.id}
                    hospital={job.hospital}
                    dDay={job.dDay}
                    position={job.position}
                    location={job.location}
                    jobType={job.jobType}
                    tags={job.tags}
                    isBookmarked={job.isBookmarked}
                    onClick={() => window.location.href = `/jobs/${job.id}`}
                  />
                ))}
              </div>
            </Tab.Content>
            <Tab.Content value="surgery">
              <div
                className="flex items-center gap-[10px] overflow-x-auto custom-scrollbar"
                style={{ alignSelf: "stretch" }}
              >
                {resumePostings.map((resume) => (
                  <JobInfoCard
                    key={resume.id}
                    hospital={resume.name}
                    dDay={resume.lastAccessDate}
                    position={resume.experience}
                    location={resume.preferredLocation}
                    jobType="구직자"
                    tags={resume.keywords}
                    isBookmarked={resume.isBookmarked}
                    onClick={() => window.location.href = `/resumes/${resume.id}`}
                  />
                ))}
              </div>
            </Tab.Content>
            <Tab.Content value="regular">
              <div className="p-4">
                <h4 className="font-semibold mb-2">정규직 정보</h4>
                <p>정규직 채용 관련 정보를 확인하실 수 있습니다.</p>
              </div>
            </Tab.Content>
          </Tab>

          {/* 광고 슬라이더 섹션 */}
          <section className="pt-[40px] md:pt-[42px]">
            <AdvertisementSlider
              advertisements={advertisementsData}
              autoPlay={true}
              autoPlayInterval={5000}
            />
          </section>

          {/* 기존 강의 섹션을 이 코드로 교체 */}
          <section className="py-[60px]">
            <div className="flex md:justify-between md:items-center flex-col md:flex-row gap-[16px] md:gap-0 mb-[30px]">
              <h3 className="font-title text-[28px] md:text-[44px] title-medium">
                주요 분야 인기 강좌
              </h3>
              <Link
                className="flex font-title title-light text-[16px] text-sub hover:underline items-center gap-1 self-end md:self-auto"
                href="/lectures"
              >
                <PlusIcon /> 전체보기
              </Link>
            </div>

            {/* 수술 강의 섹션 */}
            <div className="relative mb-[60px] md:mb-[120px] h-auto md:h-[400px]">
              {/* 카테고리 카드 - 핑크 */}
              <div
                className="relative md:absolute z-10 w-full md:w-[366px] h-auto md:h-[289px] p-[0px] md:p-[24px] md:pr-[113px] md:pb-[24px] flex flex-col justify-center items-start gap-[20px] md:gap-[102px] rounded-[16px] bg-transparent md:bg-[#FF8796] md:cursor-pointer md:shadow-lg mb-[20px] md:mb-0"
                onClick={() => console.log("수술 강의 전체보기")}
              >
                <div className="flex flex-col gap-[12px]">
                  <h4 className="font-title title-light text-[22px] md:text-[28px] text-[#3B394D] md:text-white mb-[px] leading-[135%]">
                    수술 강의
                  </h4>
                  <p className="hidden md:block font-text text-[14px] md:text-[16px] text-regular text-white opacity-90">
                    수술 전 준비부터 고급 수술까지
                    <br />
                    수술분야 종합적인 역량을 쌓습니다
                  </p>
                </div>
                <button className="hidden md:flex w-[40px] h-[40px] md:w-[44px] md:h-[44px] border border-white bg-white bg-opacity-20 rounded-full items-center justify-center hover:bg-opacity-30 transition-all duration-200">
                  <ArrowRightIcon currentColor="white" size="16px" />
                </button>
              </div>

              {/* 강의 리스트 */}
              <div className="relative md:absolute z-20 md:top-[150px] md:left-[213px] flex items-center gap-[16px] overflow-x-auto custom-scrollbar">
                {surgeryLectures.map((lecture) => (
                  <LectureCard
                    key={lecture.id}
                    title={lecture.title}
                    date={lecture.uploadDate.toLocaleDateString("ko-KR")}
                    views={lecture.viewCount}
                    category={lecture.category}
                    imageUrl={lecture.thumbnailUrl || lecture1Img.src}
                    isLiked={lecture.isLiked}
                    onClick={() =>
                      (window.location.href = `/lectures/${lecture.id}`)
                    }
                  />
                ))}
              </div>
            </div>

            {/* 행동/심리학 섹션 */}
            <div className="relative mb-[60px] md:mb-[120px] h-auto md:h-[400px]">
              {/* 카테고리 카드 - 흰색 */}
              <div
                className="relative md:absolute z-10 w-full md:w-[366px] h-auto md:h-[289px] p-[0px] md:p-[24px] md:pr-[113px] md:pb-[24px] flex flex-col justify-center items-start gap-[20px] md:gap-[102px] rounded-[16px] bg-transparent md:bg-box md:cursor-pointer md:shadow-lg mb-[20px] md:mb-0"
                onClick={() => console.log("행동/심리학 전체보기")}
              >
                <div className="flex flex-col gap-[12px]">
                  <h4 className="font-title title-light text-[22px] md:text-[28px] text-[#3B394D] md:text-black mb-[px] leading-[135%]">
                    행동/심리학
                  </h4>
                  <p className="hidden md:block font-text text-[14px] md:text-[16px] text-regular text-[#6B6B6B]">
                    반려동물의 행동/심리학 관련 다양한
                    <br />
                    강의가 준비되어 있습니다
                  </p>
                </div>
                <button className="hidden md:flex w-[40px] h-[40px] md:w-[44px] md:h-[44px] bg-[#F8F8F9] border border-[#FF8796] rounded-full items-center justify-center hover:bg-[#EFEFF0] transition-all duration-200">
                  <ArrowRightIcon currentColor="#3B394D" size="16px" />
                </button>
              </div>

              {/* 강의 리스트 */}
              <div className="relative md:absolute z-20 md:top-[150px] md:left-[213px] flex items-center gap-[16px] overflow-x-auto custom-scrollbar">
                {behaviorLectures.map((lecture) => (
                  <LectureCard
                    key={lecture.id}
                    title={lecture.title}
                    date={lecture.uploadDate.toLocaleDateString("ko-KR")}
                    views={lecture.viewCount}
                    category={lecture.category}
                    imageUrl={lecture.thumbnailUrl || lecture1Img.src}
                    isLiked={lecture.isLiked}
                    onClick={() =>
                      (window.location.href = `/lectures/${lecture.id}`)
                    }
                  />
                ))}
              </div>
            </div>

            {/* 행동/심리학 섹션 (세 번째) */}
            <div className="relative h-auto md:h-[400px]">
              {/* 카테고리 카드 - 핑크 */}
              <div
                className="relative md:absolute z-10 w-full md:w-[366px] h-auto md:h-[289px] p-[0px] md:p-[24px] md:pr-[113px] md:pb-[24px] flex flex-col justify-center items-start gap-[20px] md:gap-[102px] rounded-[16px] bg-transparent md:bg-[#FF8796] md:cursor-pointer md:shadow-lg mb-[20px] md:mb-0"
                onClick={() => console.log("행동/심리학 전체보기")}
              >
                <div className="flex flex-col gap-[12px]">
                  <h4
                    className="font-title title-light text-[22px] md:text-[28px] text-[#3B394D] md:text-white mb-[px] leading-[135%]"
                    style={{ fontFamily: "Gmarket Sans" }}
                  >
                    행동/심리학
                  </h4>
                  <p className="hidden md:block font-text text-[14px] md:text-[16px] text-regular text-white opacity-90">
                    반려동물의 행동/심리학 관련 다양한
                    <br />
                    강의가 준비되어 있습니다
                  </p>
                </div>
                <button className="hidden md:flex w-[40px] h-[40px] md:w-[44px] md:h-[44px] border border-white bg-white bg-opacity-20 rounded-full items-center justify-center hover:bg-opacity-30 transition-all duration-200">
                  <ArrowRightIcon currentColor="white" size="16px" />
                </button>
              </div>

              {/* 강의 리스트 */}
              <div className="relative md:absolute z-20 md:top-[150px] md:left-[213px] flex items-center gap-[16px] overflow-x-auto custom-scrollbar">
                {behaviorLectures.map((lecture) => (
                  <LectureCard
                    key={lecture.id}
                    title={lecture.title}
                    date={lecture.uploadDate.toLocaleDateString("ko-KR")}
                    views={lecture.viewCount}
                    category={lecture.category}
                    imageUrl={lecture.thumbnailUrl || lecture1Img.src}
                    isLiked={lecture.isLiked}
                    onClick={() =>
                      (window.location.href = `/lectures/${lecture.id}`)
                    }
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="py-[60px]">
            <h3 className="font-title text-[28px] md:text-[44px] title-medium mb-[47px] text-center">
              인기 양도 매물
            </h3>

            <Tab
              defaultTab="transfer"
              variant="filled"
              className="items-center"
            >
              <Tab.List className="flex justify-center">
                <Tab.Item value="transfer">병원 양도</Tab.Item>
                <Tab.Item value="machine">기계 장치</Tab.Item>
                <Tab.Item value="device">의료 장비</Tab.Item>
                <Tab.Item value="Interior">인테리어</Tab.Item>
              </Tab.List>

              <Tab.Content value="transfer">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[16px] mb-[88px]">
                  {hospitalTransfers.map((transfer) => (
                    <TransferCard
                      key={transfer.id}
                      id={transfer.id}
                      title={transfer.title}
                      location={transfer.location}
                      hospitalType={transfer.hospitalType}
                      area={transfer.area}
                      price={transfer.price}
                      categories={transfer.categories}
                      isAd={transfer.isAd}
                      date={transfer.date}
                      views={transfer.views}
                      imageUrl={transfer.imageUrl}
                      isLiked={transfer.isLiked}
                      onLike={() => console.log("좋아요 클릭")}
                      onClick={() => window.location.href = `/transfers/${transfer.id}`}
                    />
                  ))}
                </div>
                <div className="flex justify-center">
                  <Link
                    className="flex font-title title-light text-[16px] text-primary hover:underline items-center justfy-center px-[30px] py-[8px] border border-[1px] border-[#35313C] rounded-full"
                    href="/transfers"
                  >
                    {<PlusIcon />} 전체보기
                  </Link>
                </div>
              </Tab.Content>
              <Tab.Content value="machine">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[16px] mb-[88px]">
                  {machineTransfers.map((transfer) => (
                    <TransferCard
                      key={transfer.id}
                      id={transfer.id}
                      title={transfer.title}
                      location={transfer.location}
                      hospitalType={transfer.hospitalType}
                      area={transfer.area}
                      price={transfer.price}
                      categories={transfer.categories}
                      isAd={transfer.isAd}
                      date={transfer.date}
                      views={transfer.views}
                      imageUrl={transfer.imageUrl}
                      isLiked={transfer.isLiked}
                      onLike={() => console.log("좋아요 클릭")}
                      onClick={() => window.location.href = `/transfers/${transfer.id}`}
                    />
                  ))}
                </div>
              </Tab.Content>
              <Tab.Content value="device">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[16px] mb-[88px]">
                  {deviceTransfers.map((transfer) => (
                    <TransferCard
                      key={transfer.id}
                      id={transfer.id}
                      title={transfer.title}
                      location={transfer.location}
                      hospitalType={transfer.hospitalType}
                      area={transfer.area}
                      price={transfer.price}
                      categories={transfer.categories}
                      isAd={transfer.isAd}
                      date={transfer.date}
                      views={transfer.views}
                      imageUrl={transfer.imageUrl}
                      isLiked={transfer.isLiked}
                      onLike={() => console.log("좋아요 클릭")}
                      onClick={() => window.location.href = `/transfers/${transfer.id}`}
                    />
                  ))}
                </div>
              </Tab.Content>
              <Tab.Content value="Interior">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[16px] mb-[88px]">
                  {interiorTransfers.map((transfer) => (
                    <TransferCard
                      key={transfer.id}
                      id={transfer.id}
                      title={transfer.title}
                      location={transfer.location}
                      hospitalType={transfer.hospitalType}
                      area={transfer.area}
                      price={transfer.price}
                      categories={transfer.categories}
                      isAd={transfer.isAd}
                      date={transfer.date}
                      views={transfer.views}
                      imageUrl={transfer.imageUrl}
                      isLiked={transfer.isLiked}
                      onLike={() => console.log("좋아요 클릭")}
                      onClick={() => window.location.href = `/transfers/${transfer.id}`}
                    />
                  ))}
                </div>
              </Tab.Content>
            </Tab>
          </section>
        </div>
      </div>
    </>
  );
}
