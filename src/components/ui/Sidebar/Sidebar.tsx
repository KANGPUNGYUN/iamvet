"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  UserPlusIcon,
  ListIcon,
  BellOutlineIcon,
  UsersIcon,
  HeartMenuIcon,
  SettingsIcon,
} from "public/icons";

interface SidebarMenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ currentColor?: string }>;
  href: string;
  badge?: number;
}

interface SidebarProps {
  userType: "veterinarian" | "hospital";
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ userType, className = "" }) => {
  const pathname = usePathname();

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
      id: "bookmarks",
      label: "찜한 공고 목록",
      icon: HeartMenuIcon,
      href: "/dashboard/veterinarian/bookmarks",
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
    },
    {
      id: "profile",
      label: "프로필 설정",
      icon: SettingsIcon,
      href: "/dashboard/veterinarian/profile",
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
      id: "transfer-bookmarks",
      label: "양수양도 찜 목록",
      icon: HeartMenuIcon,
      href: "/dashboard/hospital/transfer-bookmarks",
    },
    {
      id: "my-jobs",
      label: "올린 공고 관리",
      icon: ListIcon,
      href: "/dashboard/hospital/my-jobs",
    },
    {
      id: "favorite-talents",
      label: "관심 인재 목록",
      icon: UsersIcon,
      href: "/dashboard/hospital/favorite-talents",
    },
    {
      id: "messages",
      label: "알림/메시지 관리",
      icon: BellOutlineIcon,
      href: "/dashboard/hospital/messages",
      badge: 3, // 예시 배지
    },
    {
      id: "profile",
      label: "프로필 설정",
      icon: SettingsIcon,
      href: "/dashboard/hospital/profile",
    },
  ];

  const menuItems =
    userType === "veterinarian" ? veterinarianMenu : hospitalMenu;

  const isActive = (href: string) => {
    if (href === `/dashboard/${userType}`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
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
                  {item.badge && item.badge > 0 && (
                    <span className="ml-auto bg-[#FF8796] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
