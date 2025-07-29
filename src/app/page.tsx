"use client";

import { Header, Footer } from "@/components";
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
import lecture2Img from "@/assets/images/lecture/lecture2.png";
import lecture3Img from "@/assets/images/lecture/lecture3.png";
import lecture4Img from "@/assets/images/lecture/lecture4.png";
import transfer1Img from "@/assets/images/transfer/transfer1.jpg";
import transfer2Img from "@/assets/images/transfer/transfer2.jpg";
import transfer3Img from "@/assets/images/transfer/transfer3.jpg";
import transfer4Img from "@/assets/images/transfer/transfer4.jpg";
import transfer5Img from "@/assets/images/transfer/transfer5.jpg";
import transfer6Img from "@/assets/images/transfer/transfer6.jpg";
import transfer7Img from "@/assets/images/transfer/transfer7.jpg";
import transfer8Img from "@/assets/images/transfer/transfer8.jpg";
import { useState } from "react";
import { Textarea } from "@/components/ui/Input/Textarea";
import { InputBox } from "@/components/ui/Input/InputBox";
import { SelectBox } from "@/components/ui/SelectBox";
import { SearchBar } from "@/components/ui/SearchBar";
import { DatePicker } from "@/components/ui/DatePicker";
import { TimePicker, TimeValue } from "@/components/ui/TimePicker";
import BannerSlider, {
  BannerItem,
} from "@/components/features/main/BannerSlider";
import AITalentButton from "@/components/features/main/AITalentButton";
import JobFamousList from "@/components/features/main/JobFamousList";
import JobInfoCard from "@/components/ui/JobInfoCard";
import TransferCard from "@/components/ui/TransferCard/TransferCard";
import LectureCard from "@/components/ui/LectureCard/LectureCard";
import Link from "next/link";

export default function HomePage() {
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
      <Header isLoggedIn={false} />

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
            <Tab.List className="flex md:justify-between md:items-center flex-col-reverse md:flex-row gap-[16px] md:gap-0">
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
                <JobInfoCard
                  hospital="서울대학교 동물병원"
                  dDay="D-15"
                  position="수의사(정규직)"
                  location="서울 관악구"
                  jobType="경력 3년"
                  tags={["내과", "외과", "정규직", "파트타임"]}
                  isBookmarked={true}
                  onClick={() => console.log("Job card clicked")}
                />
                <JobInfoCard
                  hospital="건국대학교 동물병원"
                  dDay="D-7"
                  position="수의사(정규직)"
                  location="서울 광진구"
                  jobType="경력 5년"
                  tags={["내과", "외과", "정규직"]}
                  isBookmarked={false}
                  onClick={() => console.log("Job card clicked")}
                />
                <JobInfoCard
                  hospital="연세 동물병원"
                  dDay="D-20"
                  position="간호사(정규직)"
                  location="서울 서대문구"
                  jobType="경력 2년"
                  tags={["간호", "정규직"]}
                  isBookmarked={true}
                  onClick={() => console.log("Job card clicked")}
                />
                <JobInfoCard
                  hospital="강남점 동물병원"
                  dDay="D-30"
                  position="수의사(정규직)"
                  location="서울 강남구"
                  jobType="신입"
                  tags={["내과", "외과", "신입"]}
                  isBookmarked={false}
                  onClick={() => console.log("Job card clicked")}
                />
                <JobInfoCard
                  hospital="까꽁 동물보호센터"
                  dDay="D-5"
                  position="수의사(계약직)"
                  location="경기 성남시"
                  jobType="경력 1년"
                  tags={["보호소", "계약직"]}
                  isBookmarked={true}
                  onClick={() => console.log("Job card clicked")}
                />
              </div>
            </Tab.Content>
            <Tab.Content value="surgery">
              <div
                className="flex items-center gap-[10px] overflow-x-auto custom-scrollbar"
                style={{ alignSelf: "stretch" }}
              >
                <JobInfoCard
                  hospital="메디컬센터 동물병원"
                  dDay="D-10"
                  position="수의사 모집(정규직)"
                  location="서울 강남구"
                  jobType="신입~경력 5년"
                  tags={["내과", "외과", "수술", "정규직"]}
                  isBookmarked={false}
                  onClick={() => console.log("Job card clicked")}
                />
                <JobInfoCard
                  hospital="24시간 응급동물병원"
                  dDay="D-3"
                  position="응급의료 수의사"
                  location="서울 마포구"
                  jobType="경력 2년 이상"
                  tags={["응급", "24시간", "정규직", "파트타임"]}
                  isBookmarked={true}
                  onClick={() => console.log("Job card clicked")}
                />
                <JobInfoCard
                  hospital="반려동물 전문클리닉"
                  dDay="D-25"
                  position="동물간호사 채용"
                  location="경기 수원시"
                  jobType="신입 가능"
                  tags={["간호", "신입", "교육지원"]}
                  isBookmarked={false}
                  onClick={() => console.log("Job card clicked")}
                />
                <JobInfoCard
                  hospital="펫케어 동물병원"
                  dDay="D-14"
                  position="원장급 수의사"
                  location="부산 해운대구"
                  jobType="경력 10년 이상"
                  tags={["원장급", "고연봉", "정규직"]}
                  isBookmarked={true}
                  onClick={() => console.log("Job card clicked")}
                />
                <JobInfoCard
                  hospital="동물보호센터"
                  dDay="D-8"
                  position="보호소 수의사"
                  location="인천 남동구"
                  jobType="경력 1년 이상"
                  tags={["보호소", "봉사", "계약직"]}
                  isBookmarked={false}
                  onClick={() => console.log("Job card clicked")}
                />
              </div>
            </Tab.Content>
            <Tab.Content value="regular">
              <div className="p-4">
                <h4 className="font-semibold mb-2">정규직 정보</h4>
                <p>정규직 채용 관련 정보를 확인하실 수 있습니다.</p>
              </div>
            </Tab.Content>
          </Tab>

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
                <LectureCard
                  title="강아지와 유치원 종합 지식 제거 방법"
                  date="2025-04-09"
                  views={127}
                  category="수술 강의"
                  imageUrl={lecture1Img.src}
                  isLiked={false}
                  onClick={() => console.log("Lecture card clicked")}
                />
                <LectureCard
                  title="고양이 응급처치 및 심폐소생술 실무"
                  date="2025-04-09"
                  views={127}
                  category="수술 강의"
                  imageUrl={lecture2Img.src}
                  isLiked={true}
                  onClick={() => console.log("Lecture card clicked")}
                />
                <LectureCard
                  title="반려동물 외과수술 기초부터 고급까지"
                  date="2025-04-09"
                  views={127}
                  category="수술 강의"
                  imageUrl={lecture3Img.src}
                  isLiked={false}
                  onClick={() => console.log("Lecture card clicked")}
                />
                <LectureCard
                  title="영상진단학 - X-ray 판독의 모든 것"
                  date="2025-04-09"
                  views={127}
                  category="수술 강의"
                  imageUrl={lecture4Img.src}
                  isLiked={false}
                  onClick={() => console.log("Lecture card clicked")}
                />
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
                <LectureCard
                  title="강아지와 유치원 종합 지식 제거 방법"
                  date="2025-04-09"
                  views={127}
                  category="행동/심리학"
                  imageUrl={lecture1Img.src}
                  isLiked={false}
                  onClick={() => console.log("Lecture card clicked")}
                />
                <LectureCard
                  title="강아지와 유치원 종합 지식 제거 방법"
                  date="2025-04-09"
                  views={127}
                  category="행동/심리학"
                  imageUrl={lecture2Img.src}
                  isLiked={true}
                  onClick={() => console.log("Lecture card clicked")}
                />
                <LectureCard
                  title="강아지와 유치원 종합 지식 제거 방법"
                  date="2025-04-09"
                  views={127}
                  category="행동/심리학"
                  imageUrl={lecture3Img.src}
                  isLiked={false}
                  onClick={() => console.log("Lecture card clicked")}
                />
                <LectureCard
                  title="강아지와 유치원 종합 지식 제거 방법"
                  date="2025-04-09"
                  views={127}
                  category="행동/심리학"
                  imageUrl={lecture4Img.src}
                  isLiked={false}
                  onClick={() => console.log("Lecture card clicked")}
                />
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
                <LectureCard
                  title="강아지와 유치원 종합 지식 제거 방법"
                  date="2025-04-09"
                  views={127}
                  category="행동/심리학"
                  imageUrl={lecture1Img.src}
                  isLiked={false}
                  onClick={() => console.log("Lecture card clicked")}
                />
                <LectureCard
                  title="강아지와 유치원 종합 지식 제거 방법"
                  date="2025-04-09"
                  views={127}
                  category="행동/심리학"
                  imageUrl={lecture2Img.src}
                  isLiked={true}
                  onClick={() => console.log("Lecture card clicked")}
                />
                <LectureCard
                  title="강아지와 유치원 종합 지식 제거 방법"
                  date="2025-04-09"
                  views={127}
                  category="행동/심리학"
                  imageUrl={lecture3Img.src}
                  isLiked={false}
                  onClick={() => console.log("Lecture card clicked")}
                />
                <LectureCard
                  title="강아지와 유치원 종합 지식 제거 방법"
                  date="2025-04-09"
                  views={127}
                  category="행동/심리학"
                  imageUrl={lecture4Img.src}
                  isLiked={false}
                  onClick={() => console.log("Lecture card clicked")}
                />
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
                  <TransferCard
                    title="[양도] 강남 소재 내과 병원 양도합니다"
                    location="서울 강남구"
                    hospitalType="내과"
                    area={100}
                    price="3억 양도"
                    categories={["병원양도"]}
                    isAd={true}
                    date="2025-04-09"
                    views={127}
                    imageUrl={transfer1Img.src}
                    isLiked={false}
                    onLike={() => console.log("좋아요 클릭")}
                    onClick={() => console.log("카드 클릭")}
                  />
                  <TransferCard
                    title="[양도] 분당 소재 종합 동물병원 급매"
                    location="경기 성남시"
                    hospitalType="종합병원"
                    area={150}
                    price="5억 양도"
                    categories={["병원양도"]}
                    isAd={false}
                    date="2025-04-08"
                    views={234}
                    imageUrl={transfer2Img.src}
                    isLiked={true}
                    onLike={() => console.log("좋아요 클릭")}
                    onClick={() => console.log("카드 클릭")}
                  />
                  <TransferCard
                    title="[양도] 홍대 인근 24시간 응급병원"
                    location="서울 마포구"
                    hospitalType="응급병원"
                    area={120}
                    price="4억 양도"
                    categories={["병원양도"]}
                    isAd={false}
                    date="2025-04-07"
                    views={156}
                    imageUrl={transfer3Img.src}
                    isLiked={false}
                    onLike={() => console.log("좋아요 클릭")}
                    onClick={() => console.log("카드 클릭")}
                  />
                  <TransferCard
                    title="[양도] 일산 신도시 소형 동물병원"
                    location="경기 고양시"
                    hospitalType="소형병원"
                    area={80}
                    price="2억 양도"
                    categories={["병원양도"]}
                    isAd={false}
                    date="2025-04-06"
                    views={89}
                    imageUrl={transfer4Img.src}
                    isLiked={false}
                    onLike={() => console.log("좋아요 클릭")}
                    onClick={() => console.log("카드 클릭")}
                  />
                  <TransferCard
                    title="[양도] 수원 영통구 동물병원 양도"
                    location="경기 수원시"
                    hospitalType="일반병원"
                    area={110}
                    price="3.5억 양도"
                    categories={["병원양도"]}
                    isAd={false}
                    date="2025-04-05"
                    views={167}
                    imageUrl={transfer5Img.src}
                    isLiked={true}
                    onLike={() => console.log("좋아요 클릭")}
                    onClick={() => console.log("카드 클릭")}
                  />
                  <TransferCard
                    title="[양도] 부산 해운대 동물병원 급매"
                    location="부산 해운대구"
                    hospitalType="일반병원"
                    area={95}
                    price="2.8억 양도"
                    categories={["병원양도"]}
                    isAd={false}
                    date="2025-04-04"
                    views={201}
                    imageUrl={transfer6Img.src}
                    isLiked={false}
                    onLike={() => console.log("좋아요 클릭")}
                    onClick={() => console.log("카드 클릭")}
                  />
                  <TransferCard
                    title="[양도] 대전 중구 소재 동물병원"
                    location="대전 중구"
                    hospitalType="일반병원"
                    area={85}
                    price="2.2억 양도"
                    categories={["병원양도"]}
                    isAd={false}
                    date="2025-04-03"
                    views={145}
                    imageUrl={transfer7Img.src}
                    isLiked={false}
                    onLike={() => console.log("좋아요 클릭")}
                    onClick={() => console.log("카드 클릭")}
                  />
                  <TransferCard
                    title="[양도] 광주 북구 동물병원 양도"
                    location="광주 북구"
                    hospitalType="일반병원"
                    area={75}
                    price="1.8억 양도"
                    categories={["병원양도"]}
                    isAd={false}
                    date="2025-04-02"
                    views={123}
                    imageUrl={transfer8Img.src}
                    isLiked={true}
                    onLike={() => console.log("좋아요 클릭")}
                    onClick={() => console.log("카드 클릭")}
                  />
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
                  <TransferCard
                    title="[판매] X-ray 촬영 장비 판매합니다"
                    location="서울 강남구"
                    hospitalType="의료장비"
                    area={0}
                    price="500만원"
                    categories={["기계장치"]}
                    isAd={false}
                    date="2025-04-09"
                    views={78}
                    imageUrl={transfer1Img.src}
                    isLiked={false}
                    onLike={() => console.log("좋아요 클릭")}
                    onClick={() => console.log("카드 클릭")}
                  />
                  <TransferCard
                    title="[판매] 초음파 진단기 급매"
                    location="경기 성남시"
                    hospitalType="의료장비"
                    area={0}
                    price="800만원"
                    categories={["기계장치"]}
                    isAd={false}
                    date="2025-04-08"
                    views={92}
                    imageUrl={transfer2Img.src}
                    isLiked={true}
                    onLike={() => console.log("좋아요 클릭")}
                    onClick={() => console.log("카드 클릭")}
                  />
                  <TransferCard
                    title="[판매] 수술대 및 수술등 세트"
                    location="서울 마포구"
                    hospitalType="의료장비"
                    area={0}
                    price="300만원"
                    categories={["기계장치"]}
                    isAd={false}
                    date="2025-04-07"
                    views={156}
                    imageUrl={transfer3Img.src}
                    isLiked={false}
                    onLike={() => console.log("좋아요 클릭")}
                    onClick={() => console.log("카드 클릭")}
                  />
                </div>
              </Tab.Content>
              <Tab.Content value="device">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[16px] mb-[88px]">
                  <TransferCard
                    title="[판매] 혈액검사기 판매"
                    location="서울 강남구"
                    hospitalType="의료장비"
                    area={0}
                    price="1200만원"
                    categories={["의료장비"]}
                    isAd={true}
                    date="2025-04-09"
                    views={145}
                    imageUrl={transfer1Img.src}
                    isLiked={false}
                    onLike={() => console.log("좋아요 클릭")}
                    onClick={() => console.log("카드 클릭")}
                  />
                  <TransferCard
                    title="[판매] 내시경 장비 일체"
                    location="경기 성남시"
                    hospitalType="의료장비"
                    area={0}
                    price="2000만원"
                    categories={["의료장비"]}
                    isAd={false}
                    date="2025-04-08"
                    views={234}
                    imageUrl={transfer2Img.src}
                    isLiked={true}
                    onLike={() => console.log("좋아요 클릭")}
                    onClick={() => console.log("카드 클릭")}
                  />
                </div>
              </Tab.Content>
              <Tab.Content value="Interior">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[16px] mb-[88px]">
                  <TransferCard
                    title="[판매] 병원 인테리어 가구 일체"
                    location="서울 강남구"
                    hospitalType="인테리어"
                    area={0}
                    price="800만원"
                    categories={["인테리어"]}
                    isAd={false}
                    date="2025-04-09"
                    views={89}
                    imageUrl={transfer1Img.src}
                    isLiked={false}
                    onLike={() => console.log("좋아요 클릭")}
                    onClick={() => console.log("카드 클릭")}
                  />
                </div>
              </Tab.Content>
            </Tab>
          </section>
        </div>
      </div>

      {/* 아이콘 컬렉션 */}
      {/* <div className="space-y-6">
          <h2 className="text-xl font-bold">
            아이콘 컬렉션 ({iconComponents.length}개)
          </h2>
          <div className="space-y-4">
            {groupedIcons.map((group, groupIndex) => (
              <div key={groupIndex} className="flex space-x-6 items-center">
                {group.map(({ name, component: IconComponent }) => (
                  <div
                    key={name}
                    className="flex flex-col items-center space-y-2 min-w-0"
                  >
                    <div className="w-14 h-14 flex items-center justify-center hover:bg-gray-50 transition-colors rounded-lg border border-gray-200">
                      <IconComponent currentColor="#4F5866" />
                    </div>
                    <span
                      className="text-xs text-gray-600 text-center max-w-20 truncate"
                      title={name}
                    >
                      {name.replace("Icon", "")}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div> */}

      {/* L 크기 버튼들 */}
      {/* <div className="space-y-4">
          <h3 className="text-lg font-bold">L 크기 버튼</h3>
          <div className="flex gap-4 flex-wrap">
            <Button size="large" variant="default">
              Button
            </Button>
            <Button size="large" variant="line">
              Button
            </Button>
            <Button size="large" variant="disable">
              Button
            </Button>
          </div>
        </div> */}

      {/* M 크기 버튼들 */}
      {/* <div className="space-y-4">
          <h3 className="text-lg font-bold">M 크기 버튼</h3>
          <div className="flex gap-4 flex-wrap">
            <Button size="medium" variant="keycolor">
              Button
            </Button>
            <Button size="medium" variant="default">
              Button
            </Button>
            <Button size="medium" variant="line">
              Button
            </Button>
            <Button size="medium" variant="disable">
              Button
            </Button>
          </div>
        </div> */}

      {/* S 크기 버튼들 */}
      {/* <div className="space-y-4">
          <h3 className="text-lg font-bold">S 크기 버튼</h3>
          <div className="flex gap-4 flex-wrap">
            <Button size="small" variant="keycolor">
              Button
            </Button>
            <Button size="small" variant="default">
              Button
            </Button>
            <Button size="small" variant="line">
              Button
            </Button>
            <Button size="small" variant="disable">
              Button
            </Button>
          </div>
        </div> */}

      {/* XS 크기 버튼들 */}
      {/* <div className="space-y-4">
          <h3 className="text-lg font-bold">XS 크기 버튼</h3>
          <div className="flex gap-4 flex-wrap">
            <Button size="xsmall" variant="default">
              Button
            </Button>
            <Button size="xsmall" variant="line">
              Button
            </Button>
            <Button size="xsmall" variant="weak">
              Button
            </Button>
          </div>
        </div> */}

      {/* 아이콘 버튼들 */}
      {/* <div className="space-y-4">
          <h3 className="text-lg font-bold">아이콘 버튼</h3>
          <div className="flex gap-4 items-center flex-wrap">
            <Button
              buttonType="icon-web"
              device="web"
              icon={<EditIcon currentColor="white" />}
            >
              Button
            </Button>
            <Button
              buttonType="icon-app"
              device="app"
              icon={<EditIcon currentColor="white" />}
            />
          </div>
        </div> */}

      {/* 더보기 버튼 */}
      {/* <div className="space-y-4">
          <h3 className="font-title title-medium">더보기 버튼</h3>
          <Button
            buttonType="more"
            icon={<PlusIcon currentColor="#9098A4" />}
            iconPosition="left"
          >
            더보기
          </Button>
        </div> */}

      <div className="space-y-4">
        {/* 1. Default 스타일 (밑줄) */}
        {/* <div>
            <h3 className="mb-4 text-lg font-semibold">기본 탭</h3>
            <Tab defaultTab="internal" variant="default">
              <Tab.List>
                <Tab.Item value="internal">구직정보</Tab.Item>
                <Tab.Item value="surgery">구인정보</Tab.Item>
              </Tab.List>
              <Tab.Content value="internal">
                <div className="p-4">
                  <h4 className="font-semibold mb-2">구직정보</h4>
                  <p>구직정보 관련 정보를 확인하실 수 있습니다.</p>
                </div>
              </Tab.Content>
              <Tab.Content value="surgery">
                <div className="p-4">
                  <h4 className="font-semibold mb-2">구인정보</h4>
                  <p>구인정보 관련 정보를 확인하실 수 있습니다.</p>
                </div>
              </Tab.Content>
              <Tab.Content value="regular">
                <div className="p-4">
                  <h4 className="font-semibold mb-2">정규직 정보</h4>
                  <p>정규직 채용 관련 정보를 확인하실 수 있습니다.</p>
                </div>
              </Tab.Content>
            </Tab>
          </div> */}

        {/* 2. Rounded 스타일 */}
        {/* <div>
            <h3 className="mb-4 text-lg font-semibold">라운드 탭</h3>
            <Tab defaultTab="profile" variant="rounded">
              <Tab.List>
                <Tab.Item value="profile">인재 정보</Tab.Item>
                <Tab.Item value="evaluate">인재 평가</Tab.Item>
              </Tab.List>
              <Tab.Content value="profile">
                <div className="p-4">
                  <h4 className="font-semibold mb-2">인재 정보</h4>
                  <p>인재 정보 관련 정보를 안내해드립니다.</p>
                </div>
              </Tab.Content>
              <Tab.Content value="evaluate">
                <div className="p-4">
                  <h4 className="font-semibold mb-2">인재 평가</h4>
                  <p>인재 평가 관련 정보를 제공합니다.</p>
                </div>
              </Tab.Content>
            </Tab>
          </div> */}

        {/* 3. Filled 스타일 */}
        {/* <div>
            <h3 className="mb-4 text-lg font-semibold">버튼 탭</h3>
            <Tab defaultTab="transfer" variant="filled">
              <Tab.List>
                <Tab.Item value="transfer">병원 양도</Tab.Item>
                <Tab.Item value="machine">기계 장치</Tab.Item>
                <Tab.Item value="device">의료 장비</Tab.Item>
              </Tab.List>

              <Tab.Content value="transfer">
                <div className="p-4">
                  <h4 className="font-semibold mb-2">병원 양도</h4>
                  <p>병원 인수인계 과정과 법적 절차를 상세히 안내합니다.</p>
                </div>
              </Tab.Content>
              <Tab.Content value="machine">
                <div className="p-4">
                  <h4 className="font-semibold mb-2">기계 장치</h4>
                  <p>각종 의료 기계의 사양과 유지보수 정보를 제공합니다.</p>
                </div>
              </Tab.Content>
              <Tab.Content value="device">
                <div className="p-4">
                  <h4 className="font-semibold mb-2">의료 장비</h4>
                  <p>진단 및 치료용 의료 장비의 최신 정보를 제공합니다.</p>
                </div>
              </Tab.Content>
            </Tab>
          </div> */}
      </div>

      <div className="space-y-8">
        {/* 기본 라디오 그룹 */}
        {/* <div>
            <h3 className="mb-4 text-lg font-semibold">라디오 버튼</h3>
            <Radio.Group value={selectedPeriod} onChange={setSelectedPeriod}>
              <Radio.Item value="immediate">즉시 가능</Radio.Item>
              <Radio.Item value="week">1주일 내</Radio.Item>
              <Radio.Item value="month">1개월 내</Radio.Item>
              <Radio.Item value="quarter">3개월 내</Radio.Item>
            </Radio.Group>
          </div> */}
      </div>

      {/* <div className="space-y-8">
          <h3 className="mb-4 text-lg font-semibold">체크박스</h3>
          <Checkbox.Group
            value={selectedDepartments}
            onChange={setSelectedDepartments}
          >
            <Checkbox.Item value="internal">내과</Checkbox.Item>
            <Checkbox.Item value="surgery">외과</Checkbox.Item>
            <Checkbox.Item value="pediatrics">소아과</Checkbox.Item>
            <Checkbox.Item value="dermatology">피부과</Checkbox.Item>
          </Checkbox.Group>
        </div> */}

      {/* <div className="space-y-8">
          <h3 className="mb-4 text-lg font-semibold">필터링 버튼</h3>
          <FilterBox.Group
            value={selectedFilters}
            onChange={setSelectedFilters}
            orientation="horizontal"
          >
            <FilterBox.Item value="정규직">정규직</FilterBox.Item>
            <FilterBox.Item value="파트타임">파트타임</FilterBox.Item>
            <FilterBox.Item value="계약직">계약직</FilterBox.Item>
          </FilterBox.Group>
        </div> */}

      {/* <div className="space-y-8">
          <h3 className="mb-4 text-lg font-semibold">태그</h3>
          <Tag.Group gap="12px" orientation="horizontal">
            <Tag variant={1}>기본 태그</Tag>
            <Tag variant={2}>강조 태그</Tag>
            <Tag variant={3}>라이트 태그</Tag>
            <Tag variant={4}>다크 태그</Tag>
            <Tag variant={5}>반투명 태그</Tag>
            <Tag variant={6}>회색 태그</Tag>
          </Tag.Group>
        </div> */}

      {/* <div className="space-y-8">
          <h3 className="mb-4 text-lg font-semibold">Textarea</h3>
          <Textarea
            placeholder="여기에 텍스트를 입력하세요..."
            defaultValue="기본값"
          />
        </div> */}
      {/* <div className="space-y-8">
          <h3 className="mb-4 text-lg font-semibold">입력박스</h3>
          <InputBox
            value={inputValue1}
            onChange={setInputValue1}
            placeholder="이메일을 입력하세요"
            clearable={true}
          />
          <InputBox
            value={price}
            onChange={setPrice}
            placeholder="가격을 입력하세요"
            type="number"
            suffix="원"
          />
          <InputBox placeholder="이메일을 입력하세요" disabled />
        </div> */}

      {/* <div className="space-y-8">
          <h3 className="mb-4 text-lg font-semibold">선택박스</h3>
          <SelectBox
            options={options}
            placeholder="선택하세요"
            onChange={handleSelectChange}
          />
        </div> */}

      {/* <div className="space-y-8">
          <h3 className="mb-4 text-lg font-semibold">검색바</h3>
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            onSearch={handleSearch}
            placeholder="검색어를 입력하세요"
          />
        </div> */}

      {/* <div className="space-y-8">
          <h3 className="mb-4 text-lg font-semibold">Date Picker</h3>
          <DatePicker
            placeholder="날짜를 선택하세요"
            onChange={handleDateChange}
          />

          <DatePicker.Range
            placeholder="시작일 ~ 종료일"
            onChange={handleRangeChange}
          />
        </div> */}

      {/* <div className="space-y-8">
          <h3 className="mb-4 text-lg font-semibold">Time Picker</h3>
          <TimePicker
            placeholder="시간을 선택하세요"
            onChange={handleTimeChange}
          />
        </div> */}

      {/* 페이지네이션 */}
      {/* <div className="space-y-8">
          <h3 className="mb-4 text-lg font-semibold">페이지네이션</h3>
          <div className="text-sm text-gray-600 mb-4">
            현재 페이지: {currentPage} / 35
          </div>
          <SimplePagination
            currentPage={currentPage}
            totalPages={35}
            onPageChange={handlePageChange}
          />
        </div> */}
      {/* </div> */}
      <Footer />
    </>
  );
}
