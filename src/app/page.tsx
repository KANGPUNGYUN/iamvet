"use client";

import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { FilterBox } from "@/components/ui/FilterBox";
import { Radio } from "@/components/ui/Radio";
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

export default function HomePage() {
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

  return (
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
        <div className="flex gap-4">
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
        <div className="flex gap-4">
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
        <div className="flex gap-4">
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
        <div className="flex gap-4">
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
        <div className="flex gap-4 items-center">
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
    </div>
  );
}
