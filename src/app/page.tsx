"use client";

import { Footer } from "@/components/layout/Footer";
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
import { useState } from "react";
import { Textarea } from "@/components/ui/Input/Textarea";
import { InputBox } from "@/components/ui/Input/InputBox";

export default function HomePage() {
  const handlePrivacyClick = () => {
    console.log("개인정보처리방침 클릭");
    // 실제 라우팅 로직
  };

  const [inputValue1, setInputValue1] = useState("");

  const handleTermsClick = () => {
    console.log("이용약관 클릭");
    // 실제 라우팅 로직
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

  // 한 줄에 6개씩 그룹화 (더 많은 아이콘을 효율적으로 표시)
  const groupedIcons = [];
  for (let i = 0; i < iconComponents.length; i += 6) {
    groupedIcons.push(iconComponents.slice(i, i + 6));
  }

  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([
    "",
  ]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([""]);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log(`페이지 ${page}로 이동`);
  };

  return (
    <>
      <div className="p-6 space-y-8">
        <h1 className="font-title title-bold">IAMVET 홈페이지</h1>

        {/* 아이콘 컬렉션 */}
        <div className="space-y-6">
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
        </div>

        {/* L 크기 버튼들 */}
        <div className="space-y-4">
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
        </div>

        {/* M 크기 버튼들 */}
        <div className="space-y-4">
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
        </div>

        {/* S 크기 버튼들 */}
        <div className="space-y-4">
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
        </div>

        {/* XS 크기 버튼들 */}
        <div className="space-y-4">
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
        </div>

        {/* 아이콘 버튼들 */}
        <div className="space-y-4">
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
        </div>

        {/* 더보기 버튼 */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold">더보기 버튼</h3>
          <Button
            buttonType="more"
            icon={<PlusIcon currentColor="#9098A4" />}
            iconPosition="left"
          >
            더보기
          </Button>
        </div>

        <div className="space-y-4">
          {/* 1. Default 스타일 (밑줄) */}
          <div>
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
          </div>

          {/* 2. Rounded 스타일 */}
          <div>
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
          </div>

          {/* 3. Filled 스타일 */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">버튼 탭</h3>
            <Tab defaultTab="transfer" variant="filled">
              <Tab.List>
                <Tab.Item value="transfer">병원 양도</Tab.Item>
                <Tab.Item value="machine">기계 장치</Tab.Item>
                <Tab.Item value="device">의료 장비</Tab.Item>
                <Tab.Item value="design">인테리어</Tab.Item>
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
              <Tab.Content value="design">
                <div className="p-4">
                  <h4 className="font-semibold mb-2">인테리어</h4>
                  <p>환자 친화적인 병원 공간 설계 및 시공을 지원합니다.</p>
                </div>
              </Tab.Content>
            </Tab>
          </div>
        </div>

        <div className="space-y-8">
          {/* 기본 라디오 그룹 */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">라디오 버튼</h3>
            <Radio.Group value={selectedPeriod} onChange={setSelectedPeriod}>
              <Radio.Item value="immediate">즉시 가능</Radio.Item>
              <Radio.Item value="week">1주일 내</Radio.Item>
              <Radio.Item value="month">1개월 내</Radio.Item>
              <Radio.Item value="quarter">3개월 내</Radio.Item>
            </Radio.Group>
          </div>
        </div>

        <div className="space-y-8">
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
        </div>

        <div className="space-y-8">
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
        </div>

        <div className="space-y-8">
          <h3 className="mb-4 text-lg font-semibold">태그</h3>
          <Tag.Group gap="12px" orientation="horizontal">
            <Tag variant={1}>기본 태그</Tag>
            <Tag variant={2}>강조 태그</Tag>
            <Tag variant={3}>라이트 태그</Tag>
            <Tag variant={4}>다크 태그</Tag>
            <Tag variant={5}>반투명 태그</Tag>
            <Tag variant={6}>회색 태그</Tag>
          </Tag.Group>
        </div>

        <div className="space-y-8">
          <h3 className="mb-4 text-lg font-semibold">텍스트에리아</h3>
          <Textarea
            placeholder="여기에 텍스트를 입력하세요..."
            defaultValue="기본값"
          />
        </div>
        <div className="space-y-8">
          <h3 className="mb-4 text-lg font-semibold">입력박스</h3>
          <InputBox
            value={inputValue1}
            onChange={setInputValue1}
            placeholder="이메일을 입력하세요"
            clearable={true}
          />
          <InputBox placeholder="이메일을 입력하세요" disabled />
        </div>

        {/* 페이지네이션 */}
        <div className="space-y-8">
          <h3 className="mb-4 text-lg font-semibold">페이지네이션</h3>
          <div className="text-sm text-gray-600 mb-4">
            현재 페이지: {currentPage} / 35
          </div>
          <SimplePagination
            currentPage={currentPage}
            totalPages={35}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <Footer className="main-footer">
        <Footer.Logo
          src="/images/Logo.png"
          mobileSrc="/images/LogoBlack.png"
        ></Footer.Logo>

        <Footer.ContentWrap>
          <Footer.Nav>
            <Footer.NavItem href="/privarcy">개인정보처리방침</Footer.NavItem>
            <Footer.NavItem href="/terms">이용약관</Footer.NavItem>
            <Footer.NavItem href="/sitemap">오시는길</Footer.NavItem>
          </Footer.Nav>
          <Footer.Address>
            <Footer.Contact>
              <div className="footer-contact-item">
                05029 서울특별시 광진구 능동로 120 건국대학교 1F
              </div>
              <div className="footer-contact-item">
                E-mail:{" "}
                <a href="mailto:seouledtech@konkuk.ac.kr">
                  seouledtech@konkuk.ac.kr
                </a>
              </div>
              <div className="footer-contact-item">
                Tel: <a href="tel:02-450-0697">02-450-0697~9</a>
              </div>
            </Footer.Contact>

            <Footer.Copyright>
              Copyright © 2025 아이앰펫 All Right Reserved.
            </Footer.Copyright>
          </Footer.Address>
        </Footer.ContentWrap>
      </Footer>
    </>
  );
}
