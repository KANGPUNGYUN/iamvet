"use client";

import React from "react";
import "./globals.css";
import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CNavTitle,
  CNavItem,
  CNavGroup,
  CSidebarToggler,
  CContainer,
  CBreadcrumb,
  CBreadcrumbItem,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilPeople,
  cilNotes,
  cilChart,
  cilCog,
  cilSpeedometer,
  cilSettings,
  cilMenu,
} from "@coreui/icons";
import { usePathname } from "next/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [sidebarShow, setSidebarShow] = React.useState(true);

  const navigation = [
    {
      component: CNavItem,
      name: "대시보드",
      to: "/admin",
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    },
    {
      component: CNavTitle,
      name: "사용자 관리",
    },
    {
      component: CNavItem,
      name: "회원 관리",
      to: "/admin/users",
      icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    },
    {
      component: CNavTitle,
      name: "콘텐츠 관리",
    },
    {
      component: CNavGroup,
      name: "게시물 관리",
      to: "/admin/posts",
      icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: "채용 공고",
          to: "/admin/posts/jobs",
        },
        {
          component: CNavItem,
          name: "교육 콘텐츠",
          to: "/admin/posts/lectures",
        },
        {
          component: CNavItem,
          name: "양도양수",
          to: "/admin/posts/transfers",
        },
        {
          component: CNavItem,
          name: "신고 관리",
          to: "/admin/posts/reports",
        },
      ],
    },
    {
      component: CNavTitle,
      name: "시스템",
    },
    {
      component: CNavItem,
      name: "AI 매칭 모니터링",
      to: "/admin/ai-monitoring",
      icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: "통계/리포트",
      to: "/admin/statistics",
      icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: "설정",
      to: "/admin/settings",
      icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    },
  ];

  return (
    <div className="admin-layout">
      <CSidebar
        position="fixed"
        unfoldable={false}
        visible={sidebarShow}
        onVisibleChange={(visible) => setSidebarShow(visible)}
        className="d-print-none sidebar sidebar-fixed"
      >
        <CSidebarBrand className="d-md-flex" href="/admin">
          <div className="sidebar-brand-full h4 mb-0">IAMVET Admin</div>
          <div className="sidebar-brand-minimized">IV</div>
        </CSidebarBrand>
        <CSidebarNav>
          {navigation.map((item, index) => {
            if (item.component === CNavTitle) {
              return <CNavTitle key={index}>{item.name}</CNavTitle>;
            }
            if (item.component === CNavGroup) {
              return (
                <CNavGroup key={index} toggler={item.name}>
                  {item.items?.map((subItem, subIndex) => (
                    <CNavItem key={subIndex} href={subItem.to}>
                      {subItem.name}
                    </CNavItem>
                  ))}
                </CNavGroup>
              );
            }
            return (
              <CNavItem key={index} href={item.to}>
                {item.icon}
                <span className="ms-2">{item.name}</span>
              </CNavItem>
            );
          })}
        </CSidebarNav>
        <CSidebarToggler
          className="d-none d-lg-flex"
          onClick={() => setSidebarShow(!sidebarShow)}
        />
      </CSidebar>

      <div className={`main-content ${sidebarShow ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        <div className="content-header bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
          <div>
            <button
              className="btn btn-link d-lg-none p-0 me-3"
              onClick={() => setSidebarShow(!sidebarShow)}
            >
              <CIcon icon={cilMenu} size="lg" />
            </button>
            <CBreadcrumb className="mb-0">
              <CBreadcrumbItem href="/admin">Home</CBreadcrumbItem>
              {pathname !== "/admin" && (
                <CBreadcrumbItem active>
                  {pathname.split("/").slice(-1)[0]}
                </CBreadcrumbItem>
              )}
            </CBreadcrumb>
          </div>
        </div>
        <div className="content-body bg-light">
          <CContainer fluid className="p-4">
            {children}
          </CContainer>
        </div>
      </div>
    </div>
  );
}
