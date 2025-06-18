import { Button } from "@/components/ui/Button";
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
} from "public/icons";

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
  ];

  // 한 줄에 6개씩 그룹화 (더 많은 아이콘을 효율적으로 표시)
  const groupedIcons = [];
  for (let i = 0; i < iconComponents.length; i += 6) {
    groupedIcons.push(iconComponents.slice(i, i + 6));
  }

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
    </div>
  );
}
