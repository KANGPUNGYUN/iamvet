"use client";

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from "@mui/material";
import {
  People,
  Work,
  CheckCircle,
  TrendingUp,
  Person,
  Business,
  ReportProblem,
  Computer,
  Speed,
  Assessment,
  CloudDone,
} from "@mui/icons-material";
import { Tag } from "@/components/ui/Tag";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AdminDashboard() {
  const statsData = [
    {
      title: "전체 회원",
      count: "1,247",
      percentage: "+12%",
      icon: People,
      color: "primary",
    },
    {
      title: "채용 공고",
      count: "328",
      percentage: "+5%",
      icon: Work,
      color: "success",
    },
    {
      title: "매칭 성공",
      count: "89",
      percentage: "+23%",
      icon: CheckCircle,
      color: "warning",
    },
    {
      title: "월간 활성 사용자",
      count: "756",
      percentage: "+18%",
      icon: Assessment,
      color: "info",
    },
  ];

  const recentUsers = [
    {
      id: 1,
      name: "김수의",
      email: "kim@example.com",
      type: "VETERINARIAN",
      status: "ACTIVE",
      joinDate: "2024-01-15",
    },
    {
      id: 2,
      name: "서울동물병원",
      email: "seoul@hospital.com",
      type: "HOSPITAL",
      status: "PENDING",
      joinDate: "2024-01-14",
    },
    {
      id: 3,
      name: "박수의",
      email: "park@example.com",
      type: "VETERINARIAN",
      status: "ACTIVE",
      joinDate: "2024-01-13",
    },
    {
      id: 4,
      name: "강남동물병원",
      email: "gangnam@hospital.com",
      type: "HOSPITAL",
      status: "SUSPENDED",
      joinDate: "2024-01-12",
    },
  ];

  const pendingReports = [
    {
      id: 1,
      title: "부적절한 채용 공고",
      reporter: "김수의",
      type: "채용공고",
      date: "2024-01-15",
      status: "PENDING",
    },
    {
      id: 2,
      title: "스팸 게시물",
      reporter: "이수의",
      type: "교육콘텐츠",
      date: "2024-01-14",
      status: "INVESTIGATING",
    },
    {
      id: 3,
      title: "허위 정보",
      reporter: "박수의",
      type: "양도양수",
      date: "2024-01-13",
      status: "PENDING",
    },
  ];

  const getStatusTag = (status: string) => {
    const statusMap: {
      [key: string]: { variant: 1 | 2 | 3 | 4 | 5 | 6; text: string };
    } = {
      ACTIVE: { variant: 2, text: "활성" },
      PENDING: { variant: 3, text: "대기" },
      SUSPENDED: { variant: 1, text: "정지" },
      INVESTIGATING: { variant: 4, text: "조사중" },
    };
    const statusInfo = statusMap[status] || {
      variant: 6 as const,
      text: status,
    };
    return <Tag variant={statusInfo.variant}>{statusInfo.text}</Tag>;
  };

  const getTypeTag = (type: string) => {
    const typeMap: { [key: string]: { variant: 1 | 2 | 3 | 4 | 5 | 6 } } = {
      VETERINARIAN: { variant: 4 },
      HOSPITAL: { variant: 5 },
    };
    const typeInfo = typeMap[type] || { variant: 6 as const };
    const typeText =
      {
        VETERINARIAN: "수의사",
        HOSPITAL: "병원",
      }[type] || type;
    return <Tag variant={typeInfo.variant}>{typeText}</Tag>;
  };

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#3b394d",
            mb: 1,
            fontSize: { xs: "1.75rem", md: "2rem" },
          }}
        >
          관리자 대시보드
        </Typography>
        <Typography variant="body1" sx={{ color: "#4f5866" }}>
          플랫폼의 전반적인 현황을 한눈에 확인하세요.
        </Typography>
      </Box>

      {/* Ultra Modern Stats Cards */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
        {statsData.map((stat, index) => (
          <Box key={index} sx={{ flex: "1 1 300px", minWidth: "250px" }}>
            <Card
              sx={{
                position: "relative",
                bgcolor: "white",
                border: "1px solid #efeff0",
                borderRadius: 4,
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 32px rgba(105, 140, 252, 0.15)",
                  "&::before": {
                    opacity: 1,
                  },
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background:
                    stat.color === "primary"
                      ? "linear-gradient(90deg, #ff8796, #ffd3d3)"
                      : stat.color === "success"
                      ? "linear-gradient(90deg, #ffb7b8, #ffe5e5)"
                      : stat.color === "warning"
                      ? "linear-gradient(90deg, #ff8796, #ffd3d3)"
                      : "linear-gradient(90deg, #ffb7b8, #ffe5e5)",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 800,
                        color: "#3b394d",
                        mb: 0.5,
                        fontSize: "2rem",
                      }}
                    >
                      {stat.count}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#4f5866",
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      {stat.title}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "#ff8796",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                      }}
                    >
                      <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                      {stat.percentage} 이번 달
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 3,
                      background:
                        stat.color === "primary"
                          ? "linear-gradient(135deg, #ffe5e5 0%, #ffb7b8 100%)"
                          : stat.color === "success"
                          ? "linear-gradient(135deg, #ffe5e5 0%, #ffb7b8 100%)"
                          : stat.color === "warning"
                          ? "linear-gradient(135deg, #ffe5e5 0%, #ffb7b8 100%)"
                          : "linear-gradient(135deg, #ffe5e5 0%, #ffb7b8 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <stat.icon
                      sx={{
                        fontSize: 28,
                        color: "#ff8796",
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
        {/* Recent Users */}
        <Box sx={{ flex: "2 1 600px" }}>
          <Card
            sx={{
              borderRadius: 4,
              border: "1px solid #efeff0",
              boxShadow: "0 4px 24px rgba(105, 140, 252, 0.08)",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 3,
                bgcolor: "white",
                borderBottom: "1px solid #efeff0",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#3b394d",
                  fontSize: "1.25rem",
                }}
              >
                최근 가입 회원
              </Typography>
            </Box>
            <TableContainer>
              <Table
                sx={{
                  "& .MuiTableCell-root": {
                    borderBottom: "1px solid #efeff0",
                    py: 2,
                  },
                }}
              >
                <TableHead sx={{ bgcolor: "#fafafa" }}>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#3b394d",
                        fontSize: "0.875rem",
                        letterSpacing: "0.025em",
                      }}
                    >
                      이름/병원명
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#3b394d",
                        fontSize: "0.875rem",
                        letterSpacing: "0.025em",
                      }}
                    >
                      이메일
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#3b394d",
                        fontSize: "0.875rem",
                        letterSpacing: "0.025em",
                      }}
                    >
                      타입
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#3b394d",
                        fontSize: "0.875rem",
                        letterSpacing: "0.025em",
                      }}
                    >
                      상태
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#3b394d",
                        fontSize: "0.875rem",
                        letterSpacing: "0.025em",
                      }}
                    >
                      가입일
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      hover
                      sx={{
                        "&:hover": {
                          bgcolor: "rgba(0, 0, 0, 0.02)",
                        },
                      }}
                    >
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar
                            sx={{
                              bgcolor:
                                user.type === "VETERINARIAN"
                                  ? "#ff8796"
                                  : "#ffb7b8",
                              width: 36,
                              height: 36,
                            }}
                          >
                            {user.type === "VETERINARIAN" ? (
                              <Person sx={{ fontSize: 20 }} />
                            ) : (
                              <Business sx={{ fontSize: 20 }} />
                            )}
                          </Avatar>
                          <Typography
                            variant="subtitle2"
                            fontWeight="600"
                            sx={{ color: "text.primary" }}
                          >
                            {user.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: "0.875rem" }}
                        >
                          {user.email}
                        </Typography>
                      </TableCell>
                      <TableCell>{getTypeTag(user.type)}</TableCell>
                      <TableCell>{getStatusTag(user.status)}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color="#9098a4"
                          sx={{ fontSize: "0.875rem" }}
                        >
                          {user.joinDate}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
