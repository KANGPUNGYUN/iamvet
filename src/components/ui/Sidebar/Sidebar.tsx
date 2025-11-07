"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  UserPlusIcon,
  ListIcon,
  BellOutlineIcon,
  UsersIcon,
  BookmarkIcon,
  SettingsIcon,
} from "public/icons";
import { useNotificationStore } from "@/store/notificationStore";

// 사이드바용 북마크 아이콘 (0.8배 크기로 조정)
const BookmarkMenuIcon: React.FC<{ currentColor?: string }> = ({
  currentColor = "currentColor",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16.8"
    height="16"
    viewBox="0 0 21 20"
    fill="none"
  >
    <path
      d="M17.375 18.75L10.5 14.375L3.625 18.75V4.6875C3.625 4.20707 3.81532 3.74622 4.15273 3.40881C4.49014 3.0714 4.95099 2.88108 5.43142 2.88108H15.5686C16.049 2.88108 16.5099 3.0714 16.8473 3.40881C17.1847 3.74622 17.375 4.20707 17.375 4.6875V18.75Z"
      stroke={currentColor}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 간단한 펼침/접힘 아이콘 컴포넌트
const ChevronDownIcon: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

const CommentIcon: React.FC<{ currentColor?: string }> = ({
  currentColor = "currentColor",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M15 10.3333C15 10.7459 14.8361 11.1416 14.5444 11.4333C14.2527 11.725 13.857 11.8889 13.4444 11.8889H4.11111L1 15V2.55556C1 2.143 1.16389 1.74733 1.45561 1.45561C1.74733 1.16389 2.143 1 2.55556 1H13.4444C13.857 1 14.2527 1.16389 14.5444 1.45561C14.8361 1.74733 15 2.143 15 2.55556V10.3333Z"
      stroke="currentColor"
      strokeWidth="1.0"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface SidebarMenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ currentColor?: string }>;
  href: string;
  badge?: number;
}

interface SidebarChildMenuItem {
  id: string;
  label: string;
  href: string;
}

interface SidebarMenuGroup {
  id: string;
  label: string;
  icon: React.ComponentType<{ currentColor?: string }>;
  children: SidebarChildMenuItem[];
}

interface SidebarProps {
  userType: "veterinarian" | "hospital";
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ userType, className = "" }) => {
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(
    new Set(["posts-management", "bookmarks"])
  );

  // 알림 store에서 읽지 않은 알림 수 가져오기
  const { unreadCount, fetchUnreadCount } = useNotificationStore();

  // 컴포넌트 마운트시 읽지 않은 알림 수 가져오기
  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  // 수의사용 메뉴
  const veterinarianMenu: SidebarMenuItem[] = [
    {
      id: "dashboard",
      label: "대시보드 홈",
      icon: HomeIcon,
      href: "/dashboard/veterinarian",
    },
    {
      id: "resume",
      label: "나의 이력서",
      icon: UserPlusIcon,
      href: "/dashboard/veterinarian/resume",
    },
    {
      id: "applications",
      label: "지원 내역 관리",
      icon: ListIcon,
      href: "/dashboard/veterinarian/applications",
    },
    {
      id: "messages",
      label: "알림/메시지 관리",
      icon: BellOutlineIcon,
      href: "/dashboard/veterinarian/messages",
      badge: unreadCount,
    },
    {
      id: "profile",
      label: "프로필 설정",
      icon: SettingsIcon,
      href: "/dashboard/veterinarian/profile",
    },
    {
      id: "my-comments",
      label: "댓글 관리",
      icon: CommentIcon,
      href: "/dashboard/veterinarian/my-comments",
    },
  ];

  // 병원용 메뉴
  const hospitalMenu: SidebarMenuItem[] = [
    {
      id: "dashboard",
      label: "대시보드 홈",
      icon: HomeIcon,
      href: "/dashboard/hospital",
    },
    {
      id: "my-jobs",
      label: "올린 공고 관리",
      icon: ListIcon,
      href: "/dashboard/hospital/my-jobs",
    },
    {
      id: "applicants",
      label: "지원자 목록",
      icon: UsersIcon,
      href: "/dashboard/hospital/applicants",
    },
    {
      id: "messages",
      label: "알림/메시지 관리",
      icon: BellOutlineIcon,
      href: "/dashboard/hospital/messages",
      badge: unreadCount,
    },
    {
      id: "profile",
      label: "프로필 설정",
      icon: SettingsIcon,
      href: "/dashboard/hospital/profile",
    },
    {
      id: "my-comments",
      label: "댓글 관리",
      icon: CommentIcon,
      href: "/dashboard/hospital/my-comments",
    },
  ];

  // 병원용 북마크 그룹
  // 게시물 관리 그룹 (병원용)
  const hospitalPostsGroup: SidebarMenuGroup = {
    id: "posts-management",
    label: "게시물 관리",
    icon: ListIcon,
    children: [
      {
        id: "my-forum-posts",
        label: "임상포럼 게시물",
        href: "/dashboard/hospital/my-forum-posts",
      },
      {
        id: "my-transfer-posts",
        label: "양도양수 게시물",
        href: "/dashboard/hospital/my-transfer-posts",
      },
    ],
  };

  const hospitalBookmarkGroup: SidebarMenuGroup = {
    id: "bookmarks",
    label: "북마크 관리",
    icon: BookmarkMenuIcon,
    children: [
      {
        id: "transfer-bookmarks",
        label: "양도양수 북마크",
        href: "/dashboard/hospital/transfer-bookmarks",
      },
      {
        id: "lecture-bookmarks",
        label: "강의 북마크",
        href: "/dashboard/hospital/lecture-bookmarks",
      },
      {
        id: "forum-bookmarks",
        label: "임상포럼 북마크",
        href: "/dashboard/hospital/forum-bookmarks",
      },
      {
        id: "favorite-talents",
        label: "이력서 북마크",
        href: "/dashboard/hospital/favorite-talents",
      },
    ],
  };

  // 게시물 관리 그룹 (수의사용)
  const veterinarianPostsGroup: SidebarMenuGroup = {
    id: "posts-management",
    label: "게시물 관리",
    icon: ListIcon,
    children: [
      {
        id: "my-forum-posts",
        label: "임상포럼 게시물",
        href: "/dashboard/veterinarian/my-forum-posts",
      },
      {
        id: "my-transfer-posts",
        label: "양도양수 게시물",
        href: "/dashboard/veterinarian/my-transfer-posts",
      },
    ],
  };

  // 수의사용 북마크 그룹
  const veterinarianBookmarkGroup: SidebarMenuGroup = {
    id: "bookmarks",
    label: "북마크 관리",
    icon: BookmarkMenuIcon,
    children: [
      {
        id: "transfer-bookmarks",
        label: "양도양수 북마크",
        href: "/dashboard/veterinarian/transfer-bookmarks",
      },
      {
        id: "lecture-bookmarks",
        label: "강의 북마크",
        href: "/dashboard/veterinarian/lecture-bookmarks",
      },
      {
        id: "forum-bookmarks",
        label: "임상포럼 북마크",
        href: "/dashboard/veterinarian/forum-bookmarks",
      },
      {
        id: "job-bookmarks",
        label: "채용공고 북마크",
        href: "/dashboard/veterinarian/job-bookmarks",
      },
    ],
  };

  const menuItems =
    userType === "veterinarian" ? veterinarianMenu : hospitalMenu;

  const isActive = (href: string) => {
    if (href === `/dashboard/${userType}`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const isGroupActive = (group: SidebarMenuGroup) => {
    return group.children.some((child) => isActive(child.href));
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  return (
    <aside
      className={`w-[240px] bg-white flex-col hidden h-auto lg:flex ${className}`}
    >
      {/* Header */}
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-800">MENU</h2>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.href);

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-200 relative ${
                    active
                      ? "text-[#FF8796] bg-[#FFF7F7]"
                      : "text-[#4F5866] hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <IconComponent
                    currentColor={active ? "#FF8796" : "#4F5866"}
                  />
                  <span className="ml-3">{item.label}</span>

                  {/* Badge */}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-auto bg-[#FF8796] text-white text-xs rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center font-semibold">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}

          {/* 게시물 관리 그룹 */}
          {userType === "hospital" && (
            <li key={hospitalPostsGroup.id}>
              <button
                onClick={() => toggleGroup(hospitalPostsGroup.id)}
                className={`w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isGroupActive(hospitalPostsGroup)
                    ? "text-[#FF8796] bg-[#FFF7F7]"
                    : "text-[#4F5866] hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <hospitalPostsGroup.icon
                  currentColor={
                    isGroupActive(hospitalPostsGroup) ? "#FF8796" : "#4F5866"
                  }
                />
                <span className="ml-3">{hospitalPostsGroup.label}</span>
                <span className="ml-auto">
                  {expandedGroups.has(hospitalPostsGroup.id) ? (
                    <ChevronDownIcon className="w-4 h-4" />
                  ) : (
                    <ChevronRightIcon className="w-4 h-4" />
                  )}
                </span>
              </button>

              {/* 하위 메뉴 */}
              {expandedGroups.has(hospitalPostsGroup.id) && (
                <ul className="mt-2 ml-6 space-y-1">
                  {hospitalPostsGroup.children.map((child) => {
                    const childActive = isActive(child.href);

                    return (
                      <li key={child.id}>
                        <Link
                          href={child.href}
                          className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            childActive
                              ? "text-[#FF8796] bg-[#FFF7F7]"
                              : "text-[#4F5866] hover:text-gray-900 hover:bg-gray-50"
                          }`}
                        >
                          <span>{child.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          )}

          {/* 댓글 관리 그룹 */}
          {/* {userType === "hospital" && (
            <li key={hospitalCommentsGroup.id}>
              <button
                onClick={() => toggleGroup(hospitalCommentsGroup.id)}
                className={`w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isGroupActive(hospitalCommentsGroup)
                    ? "text-[#FF8796] bg-[#FFF7F7]"
                    : "text-[#4F5866] hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <hospitalCommentsGroup.icon
                  currentColor={
                    isGroupActive(hospitalCommentsGroup) ? "#FF8796" : "#4F5866"
                  }
                />
                <span className="ml-3">{hospitalCommentsGroup.label}</span>
                <span className="ml-auto">
                  {expandedGroups.has(hospitalCommentsGroup.id) ? (
                    <ChevronDownIcon className="w-4 h-4" />
                  ) : (
                    <ChevronRightIcon className="w-4 h-4" />
                  )}
                </span>
              </button> */}

          {/* 하위 메뉴 */}
          {/* {expandedGroups.has(hospitalCommentsGroup.id) && (
                <ul className="mt-2 ml-6 space-y-1">
                  {hospitalCommentsGroup.children.map((child) => {
                    const childActive = isActive(child.href);

                    return (
                      <li key={child.id}>
                        <Link
                          href={child.href}
                          className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            childActive
                              ? "text-[#FF8796] bg-[#FFF7F7]"
                              : "text-[#4F5866] hover:text-gray-900 hover:bg-gray-50"
                          }`}
                        >
                          <span>{child.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          )} */}

          {/* 북마크 그룹 */}
          {userType === "hospital" && (
            <li key={hospitalBookmarkGroup.id}>
              <button
                onClick={() => toggleGroup(hospitalBookmarkGroup.id)}
                className={`w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isGroupActive(hospitalBookmarkGroup)
                    ? "text-[#FF8796] bg-[#FFF7F7]"
                    : "text-[#4F5866] hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <hospitalBookmarkGroup.icon
                  currentColor={
                    isGroupActive(hospitalBookmarkGroup) ? "#FF8796" : "#4F5866"
                  }
                />
                <span className="ml-3">{hospitalBookmarkGroup.label}</span>
                <span className="ml-auto">
                  {expandedGroups.has(hospitalBookmarkGroup.id) ? (
                    <ChevronDownIcon className="w-4 h-4" />
                  ) : (
                    <ChevronRightIcon className="w-4 h-4" />
                  )}
                </span>
              </button>

              {/* 하위 메뉴 */}
              {expandedGroups.has(hospitalBookmarkGroup.id) && (
                <ul className="mt-2 ml-6 space-y-1">
                  {hospitalBookmarkGroup.children.map((child) => {
                    const childActive = isActive(child.href);

                    return (
                      <li key={child.id}>
                        <Link
                          href={child.href}
                          className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            childActive
                              ? "text-[#FF8796] bg-[#FFF7F7]"
                              : "text-[#4F5866] hover:text-gray-900 hover:bg-gray-50"
                          }`}
                        >
                          <span>{child.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          )}

          {/* 게시물 관리 그룹 (수의사용) */}
          {userType === "veterinarian" && (
            <li key={veterinarianPostsGroup.id}>
              <button
                onClick={() => toggleGroup(veterinarianPostsGroup.id)}
                className={`w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isGroupActive(veterinarianPostsGroup)
                    ? "text-[#FF8796] bg-[#FFF7F7]"
                    : "text-[#4F5866] hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <veterinarianPostsGroup.icon
                  currentColor={
                    isGroupActive(veterinarianPostsGroup)
                      ? "#FF8796"
                      : "#4F5866"
                  }
                />
                <span className="ml-3">{veterinarianPostsGroup.label}</span>
                <span className="ml-auto">
                  {expandedGroups.has(veterinarianPostsGroup.id) ? (
                    <ChevronDownIcon className="w-4 h-4" />
                  ) : (
                    <ChevronRightIcon className="w-4 h-4" />
                  )}
                </span>
              </button>

              {/* 하위 메뉴 */}
              {expandedGroups.has(veterinarianPostsGroup.id) && (
                <ul className="mt-2 ml-6 space-y-1">
                  {veterinarianPostsGroup.children.map((child) => {
                    const childActive = isActive(child.href);

                    return (
                      <li key={child.id}>
                        <Link
                          href={child.href}
                          className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            childActive
                              ? "text-[#FF8796] bg-[#FFF7F7]"
                              : "text-[#4F5866] hover:text-gray-900 hover:bg-gray-50"
                          }`}
                        >
                          <span>{child.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          )}

          {/* 댓글 관리 그룹 (수의사용) */}
          {/* {userType === "veterinarian" && (
            <li key={veterinarianCommentsGroup.id}>
              <button
                onClick={() => toggleGroup(veterinarianCommentsGroup.id)}
                className={`w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isGroupActive(veterinarianCommentsGroup)
                    ? "text-[#FF8796] bg-[#FFF7F7]"
                    : "text-[#4F5866] hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <veterinarianCommentsGroup.icon
                  currentColor={
                    isGroupActive(veterinarianCommentsGroup)
                      ? "#FF8796"
                      : "#4F5866"
                  }
                />
                <span className="ml-3">{veterinarianCommentsGroup.label}</span>
                <span className="ml-auto">
                  {expandedGroups.has(veterinarianCommentsGroup.id) ? (
                    <ChevronDownIcon className="w-4 h-4" />
                  ) : (
                    <ChevronRightIcon className="w-4 h-4" />
                  )}
                </span>
              </button> */}

          {/* 하위 메뉴 */}
          {/* {expandedGroups.has(veterinarianCommentsGroup.id) && (
                <ul className="mt-2 ml-6 space-y-1">
                  {veterinarianCommentsGroup.children.map((child) => {
                    const childActive = isActive(child.href);

                    return (
                      <li key={child.id}>
                        <Link
                          href={child.href}
                          className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            childActive
                              ? "text-[#FF8796] bg-[#FFF7F7]"
                              : "text-[#4F5866] hover:text-gray-900 hover:bg-gray-50"
                          }`}
                        >
                          <span>{child.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          )} */}

          {userType === "veterinarian" && (
            <li key={veterinarianBookmarkGroup.id}>
              <button
                onClick={() => toggleGroup(veterinarianBookmarkGroup.id)}
                className={`w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isGroupActive(veterinarianBookmarkGroup)
                    ? "text-[#FF8796] bg-[#FFF7F7]"
                    : "text-[#4F5866] hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <veterinarianBookmarkGroup.icon
                  currentColor={
                    isGroupActive(veterinarianBookmarkGroup)
                      ? "#FF8796"
                      : "#4F5866"
                  }
                />
                <span className="ml-3">{veterinarianBookmarkGroup.label}</span>
                <span className="ml-auto">
                  {expandedGroups.has(veterinarianBookmarkGroup.id) ? (
                    <ChevronDownIcon className="w-4 h-4" />
                  ) : (
                    <ChevronRightIcon className="w-4 h-4" />
                  )}
                </span>
              </button>

              {/* 하위 메뉴 */}
              {expandedGroups.has(veterinarianBookmarkGroup.id) && (
                <ul className="mt-2 ml-6 space-y-1">
                  {veterinarianBookmarkGroup.children.map((child) => {
                    const childActive = isActive(child.href);

                    return (
                      <li key={child.id}>
                        <Link
                          href={child.href}
                          className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            childActive
                              ? "text-[#FF8796] bg-[#FFF7F7]"
                              : "text-[#4F5866] hover:text-gray-900 hover:bg-gray-50"
                          }`}
                        >
                          <span>{child.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
