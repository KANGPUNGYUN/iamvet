import { ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  type?: "veterinarian" | "hospital";
  profileName?: string; // 수의사: 닉네임, 병원: 병원명
  profileImage?: string; // 수의사/학생: 프로필 이미지
  hospitalLogo?: string; // 병원: 병원 로고
}

export interface NavigationItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface DashboardMenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ currentColor?: string }>;
  href: string;
  badge?: number;
}

export interface HeaderProps {
  isLoggedIn?: boolean;
  user?: User;
  navigationItems?: NavigationItem[];
  logoHref?: string;
  onLogin?: () => void;
  onSignup?: () => void;
  onLogout?: () => void;
  onProfileClick?: () => void;
  onNotificationClick?: () => void;
  className?: string;
  children?: ReactNode;
}

export interface HeaderLogoProps {
  href?: string;
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
}

export interface HeaderNavigationProps {
  items: NavigationItem[];
  className?: string;
}

export interface HeaderAuthProps {
  onLogin?: () => void;
  onSignup?: () => void;
  className?: string;
}

export interface HeaderProfileProps {
  user: User;
  onProfileClick?: () => void;
  onNotificationClick?: () => void;
  onLogout?: () => void;
  className?: string;
}

export interface HeaderMobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  navigationItems?: NavigationItem[];
  isLoggedIn?: boolean;
  user?: User;
  userType?: "veterinarian" | "hospital";
  onLogin?: () => void;
  onSignup?: () => void;
  onLogout?: () => void;
  onProfileClick?: () => void;
  className?: string;
}