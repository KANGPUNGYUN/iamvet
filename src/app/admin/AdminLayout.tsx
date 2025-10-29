"use client";

import React from "react";
import "./globals.css";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Container,
  Breadcrumbs,
  Link,
  Avatar,
  Menu as MenuComponent,
  MenuItem,
} from "@mui/material";
import {
  People,
  WorkOutline,
  Stars,
  OndemandVideo,
  CurrencyExchange,
  MarkChatUnread,
  Dashboard,
  Menu,
  Sell,
  Forum,
  AccountCircle,
  Logout,
} from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";
import NextLink from "next/link";

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactElement;
}

const drawerWidth = 280;

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarShow, setSidebarShow] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [adminEmail, setAdminEmail] = React.useState("");
  const [isChecking, setIsChecking] = React.useState(true);

  // 로그인 상태 확인
  React.useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      // 로그인 페이지는 인증 체크에서 제외
      if (pathname === "/admin/login") {
        setIsChecking(false);
        return;
      }

      try {
        // 서버에서 실제 인증 상태 확인
        const response = await fetch("/api/admin/auth/verify", {
          credentials: "include",
        });

        if (!isMounted) return;

        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          setAdminEmail(data.email || localStorage.getItem("adminEmail") || "");

          // localStorage 업데이트
          if (data.email) {
            localStorage.setItem("isAdminLoggedIn", "true");
            localStorage.setItem("adminEmail", data.email);
          }
        } else {
          // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
          localStorage.removeItem("isAdminLoggedIn");
          localStorage.removeItem("adminEmail");
          localStorage.removeItem("adminName");
          localStorage.removeItem("adminRole");
          router.push("/admin/login");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        if (isMounted) {
          router.push("/admin/login");
        }
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname, router]);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      // 서버에 로그아웃 요청
      await fetch("/api/admin/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // 클라이언트 사이드 정리
      localStorage.removeItem("isAdminLoggedIn");
      localStorage.removeItem("adminEmail");
      localStorage.removeItem("adminName");
      localStorage.removeItem("adminRole");
      setIsLoggedIn(false);
      setAdminEmail("");
      handleProfileMenuClose();
      router.push("/admin/login");
    }
  };

  // 로그인 페이지일 경우 레이아웃 없이 children만 반환
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // 인증 체크 중이거나 로그인되지 않은 상태에서는 로딩 표시
  if (isChecking || (!isLoggedIn && pathname !== "/admin/login")) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "var(--Box_Light)",
        }}
      >
        <Typography>로그인 확인 중...</Typography>
      </Box>
    );
  }

  const navigation: NavigationItem[] = [
    {
      name: "대시보드",
      href: "/admin",
      icon: <Dashboard />,
    },
    {
      name: "회원 관리",
      href: "/admin/users",
      icon: <People />,
    },
    { name: "채용공고", href: "/admin/jobs", icon: <WorkOutline /> },
    { name: "인재정보", href: "/admin/resumes", icon: <Stars /> },
    { name: "강의영상", href: "/admin/lectures", icon: <OndemandVideo /> },
    { name: "양도양수", href: "/admin/transfers", icon: <CurrencyExchange /> },
    { name: "임상포럼", href: "/admin/forums", icon: <Forum /> },
    {
      name: "공지사항 관리",
      href: "/admin/messages",
      icon: <MarkChatUnread />,
    },
    {
      name: "광고배너 관리",
      href: "/admin/advertise",
      icon: <Sell />,
    },
  ];

  const drawer = (
    <div>
      <Toolbar
        sx={{
          bgcolor: "var(--Box_Light)",
          borderBottom: "1px solid var(--Line)",
        }}
      >
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ color: "var(--Keycolor1)", fontWeight: 700 }}
        >
          IAMVET Admin
        </Typography>
      </Toolbar>
      <List sx={{ px: 2, py: 3 }}>
        {navigation.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={NextLink}
              href={item.href}
              selected={pathname === item.href}
              sx={{
                borderRadius: 2,
                py: 1.5,
                "&:hover": {
                  bgcolor: "rgba(105, 140, 252, 0.08)",
                },
                "&.Mui-selected": {
                  bgcolor: "rgba(105, 140, 252, 0.15)",
                  "&:hover": {
                    bgcolor: "rgba(105, 140, 252, 0.2)",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color:
                    pathname === item.href
                      ? "var(--Keycolor1)"
                      : "text.secondary",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                slotProps={{
                  primary: {
                    sx: {
                      fontWeight: pathname === item.href ? 600 : 500,
                      fontSize: "0.95rem",
                      color:
                        pathname === item.href
                          ? "var(--Keycolor1)"
                          : "text.primary",
                    },
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "var(--Box_Light)" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${sidebarShow ? drawerWidth : 0}px)` },
          ml: { sm: sidebarShow ? `${drawerWidth}px` : 0 },
          bgcolor: "white",
          color: "text.primary",
          borderBottom: "1px solid var(--Line)",
          boxShadow: "0 1px 3px rgba(105, 140, 252, 0.08)",
        }}
      >
        <Toolbar sx={{ minHeight: "64px !important" }}>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={() => setSidebarShow(!sidebarShow)}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <Menu />
          </IconButton>
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{ color: "text.secondary", flexGrow: 1 }}
          >
            <Link
              component={NextLink}
              underline="hover"
              color="text.secondary"
              href="/admin"
              sx={{ fontWeight: 500 }}
            >
              Home
            </Link>
            {pathname !== "/admin" && (
              <Typography color="text.primary" sx={{ fontWeight: 600 }}>
                {pathname.split("/").slice(-1)[0]}
              </Typography>
            )}
          </Breadcrumbs>

          {/* 사용자 프로필 영역 */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {adminEmail}
            </Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <MenuComponent
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
            >
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                로그아웃
              </MenuItem>
            </MenuComponent>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { sm: sidebarShow ? drawerWidth : 0 },
          flexShrink: { sm: 0 },
        }}
        aria-label="admin navigation"
      >
        <Drawer
          variant="temporary"
          open={sidebarShow}
          onClose={() => setSidebarShow(false)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="persistent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: "none",
              boxShadow: "0 4px 20px rgba(105, 140, 252, 0.12)",
              bgcolor: "white",
              height: "100vh",
            },
          }}
          open={sidebarShow}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
          bgcolor: "var(--Box_Light)",
        }}
      >
        <Toolbar />
        <Container maxWidth="xl" sx={{ p: 3 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}
