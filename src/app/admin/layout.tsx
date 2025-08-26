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
  Collapse,
} from "@mui/material";
import {
  People,
  Article,
  BarChart,
  Settings,
  Dashboard,
  Menu,
  ExpandLess,
  ExpandMore,
  Speed,
} from "@mui/icons-material";
import { usePathname } from "next/navigation";
import NextLink from "next/link";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 280;

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [sidebarShow, setSidebarShow] = React.useState(true);
  const [postsExpanded, setPostsExpanded] = React.useState(false);

  const navigation = [
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
    {
      name: "게시물 관리",
      icon: <Article />,
      children: [
        { name: "채용 공고", href: "/admin/posts/jobs" },
        { name: "교육 콘텐츠", href: "/admin/posts/lectures" },
        { name: "양도양수", href: "/admin/posts/transfers" },
        { name: "신고 관리", href: "/admin/posts/reports" },
      ],
    },
    {
      name: "AI 매칭 모니터링",
      href: "/admin/ai-monitoring",
      icon: <Speed />,
    },
    {
      name: "통계/리포트",
      href: "/admin/statistics",
      icon: <BarChart />,
    },
    {
      name: "설정",
      href: "/admin/settings",
      icon: <Settings />,
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
        {navigation.map((item, index) => {
          if (item.children) {
            return (
              <React.Fragment key={index}>
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={() => setPostsExpanded(!postsExpanded)}
                    sx={{
                      borderRadius: 2,
                      "&:hover": {
                        bgcolor: "rgba(105, 140, 252, 0.08)",
                      },
                      py: 1.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{ color: "var(--Keycolor1)", minWidth: 40 }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      primaryTypographyProps={{
                        fontWeight: 500,
                        fontSize: "0.95rem",
                        color: "text.primary",
                      }}
                    />
                    {postsExpanded ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={postsExpanded} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ mb: 1 }}>
                    {item.children.map((child, childIndex) => (
                      <ListItem key={childIndex} disablePadding>
                        <ListItemButton
                          component={NextLink}
                          href={child.href}
                          sx={{
                            pl: 6,
                            py: 1,
                            borderRadius: 2,
                            mx: 1,
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
                          selected={pathname === child.href}
                        >
                          <ListItemText
                            primary={child.name}
                            primaryTypographyProps={{
                              fontWeight: pathname === child.href ? 600 : 400,
                              fontSize: "0.875rem",
                              color:
                                pathname === child.href
                                  ? "var(--Keycolor1)"
                                  : "text.secondary",
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            );
          } else {
            return (
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
                    primaryTypographyProps={{
                      fontWeight: pathname === item.href ? 600 : 500,
                      fontSize: "0.95rem",
                      color:
                        pathname === item.href
                          ? "var(--Keycolor1)"
                          : "text.primary",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          }
        })}
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
          <Breadcrumbs aria-label="breadcrumb" sx={{ color: "text.secondary" }}>
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
