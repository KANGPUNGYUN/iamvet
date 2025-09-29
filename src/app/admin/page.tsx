"use client";

import React, { useState, useEffect } from "react";
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
  Skeleton,
  Chip,
} from "@mui/material";
import {
  People,
  Work,
  Description,
  Forum,
  Person,
  Business,
  School,
  Visibility,
  Comment,
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

interface DashboardStats {
  users: {
    total: number;
    veterinarians: number;
    students: number;
    hospitals: number;
    pendingVerification: number;
    newThisMonth: number;
    newThisWeek: number;
    growthRate: number;
  };
  jobs: {
    active: number;
    pending: number;
    closed: number;
    newThisMonth: number;
    growthRate: number;
  };
  resumes: {
    active: number;
    hidden: number;
    newThisMonth: number;
  };
  transfers: {
    active: number;
    pending: number;
    completed: number;
    newThisMonth: number;
  };
  forums: {
    totalPosts: number;
    totalViews: number;
    newThisMonth: number;
  };
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  type: string;
  status: string;
  joinDate: string;
}

interface RecentJob {
  id: string;
  title: string;
  hospitalName: string;
  employmentType: string;
  status: string;
  createdAt: string;
}

interface RecentForum {
  id: string;
  title: string;
  author: string;
  category: string;
  viewCount: number;
  commentCount: number;
  createdAt: string;
}

interface UserTrend {
  month: string;
  count: number;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([]);
  const [recentForums, setRecentForums] = useState<RecentForum[]>([]);
  const [userTrend, setUserTrend] = useState<UserTrend[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/dashboard');
      const result = await response.json();
      
      if (result.status === 'success') {
        setStats(result.data.stats);
        setRecentUsers(result.data.recentUsers);
        setRecentJobs(result.data.recentJobs);
        setRecentForums(result.data.recentForums);
        setUserTrend(result.data.userTrend);
      }
    } catch (error) {
      console.error('대시보드 데이터 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status: string) => {
    const statusMap: {
      [key: string]: { variant: 1 | 2 | 3 | 4 | 5 | 6; text: string };
    } = {
      ACTIVE: { variant: 2, text: "활성" },
      PENDING: { variant: 3, text: "대기" },
      SUSPENDED: { variant: 1, text: "정지" },
      CLOSED: { variant: 6, text: "마감" },
      HIDDEN: { variant: 6, text: "비공개" },
    };
    const statusInfo = statusMap[status] || {
      variant: 6 as const,
      text: status,
    };
    return <Tag variant={statusInfo.variant}>{statusInfo.text}</Tag>;
  };

  const getTypeTag = (type: string) => {
    const typeMap: { [key: string]: { variant: 1 | 2 | 3 | 4 | 5 | 6; icon: any } } = {
      VETERINARIAN: { variant: 4, icon: Person },
      VETERINARY_STUDENT: { variant: 5, icon: School },
      HOSPITAL: { variant: 5, icon: Business },
    };
    const typeInfo = typeMap[type] || { variant: 6 as const, icon: Person };
    const typeText = {
      VETERINARIAN: "수의사",
      VETERINARY_STUDENT: "수의대생",
      HOSPITAL: "병원",
    }[type] || type;
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <typeInfo.icon sx={{ fontSize: 14 }} />
        <Tag variant={typeInfo.variant}>{typeText}</Tag>
      </Box>
    );
  };

  const getEmploymentTypeTag = (type: string) => {
    const typeMap: { [key: string]: string } = {
      FULL_TIME: "정규직",
      PART_TIME: "파트타임",
      CONTRACT: "계약직",
      INTERN: "인턴",
    };
    return <Chip label={typeMap[type] || type} size="small" />;
  };

  const statsData = stats ? [
    {
      title: "전체 회원",
      count: stats.users.total.toLocaleString(),
      percentage: `+${stats.users.growthRate}%`,
      icon: People,
      color: "primary",
      subText: `신규 ${stats.users.newThisMonth}명`,
    },
    {
      title: "활성 채용공고",
      count: stats.jobs.active.toLocaleString(),
      percentage: `+${stats.jobs.growthRate}%`,
      icon: Work,
      color: "success",
      subText: `대기중 ${stats.jobs.pending}건`,
    },
    {
      title: "활성 이력서",
      count: stats.resumes.active.toLocaleString(),
      percentage: `+${Math.round((stats.resumes.newThisMonth / (stats.resumes.active || 1)) * 100)}%`,
      icon: Description,
      color: "warning",
      subText: `신규 ${stats.resumes.newThisMonth}건`,
    },
    {
      title: "포럼 게시물",
      count: stats.forums.totalPosts.toLocaleString(),
      percentage: `${stats.forums.totalViews.toLocaleString()} 조회`,
      icon: Forum,
      color: "info",
      subText: `신규 ${stats.forums.newThisMonth}건`,
    },
  ] : [];

  // 사용자 유형별 차트 데이터
  const userTypeChartData = stats ? {
    labels: ['수의사', '수의대생', '병원'],
    datasets: [{
      data: [
        stats.users.veterinarians,
        stats.users.students,
        stats.users.hospitals
      ],
      backgroundColor: [
        '#ff8796',
        '#ffb7b8',
        '#ffd3d3',
      ],
      borderWidth: 0,
    }]
  } : null;

  // 월별 가입자 추이 차트 데이터
  const userTrendChartData = userTrend.length > 0 ? {
    labels: userTrend.map(item => {
      const month = item.month.split('-')[1];
      return `${month}월`;
    }),
    datasets: [{
      label: '신규 가입자',
      data: userTrend.map(item => item.count),
      borderColor: '#ff8796',
      backgroundColor: 'rgba(255, 135, 150, 0.1)',
      tension: 0.3,
      fill: true,
    }]
  } : null;

  if (loading) {
    return (
      <Box>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="text" width={300} height={24} />
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
          {[1, 2, 3, 4].map((index) => (
            <Box key={index} sx={{ flex: "1 1 300px", minWidth: "250px" }}>
              <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 4 }} />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

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

      {/* Stats Cards */}
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
                  background: "linear-gradient(90deg, #ff8796, #ffd3d3)",
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
                        mb: 1,
                      }}
                    >
                      {stat.title}
                    </Typography>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#ff8796",
                          fontWeight: 500,
                        }}
                      >
                        {stat.percentage}
                      </Typography>
                      {stat.subText && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#9098a4",
                            ml: 1,
                          }}
                        >
                          {stat.subText}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 3,
                      background: "linear-gradient(135deg, #ffe5e5 0%, #ffd3d3 100%)",
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
              {stats && stats.users.pendingVerification > 0 && (
                <Chip 
                  label={`${stats.users.pendingVerification}명 인증 대기중`}
                  size="small"
                  color="warning"
                  sx={{ mt: 1 }}
                />
              )}
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
                      }}
                    >
                      이름/병원명
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#3b394d",
                        fontSize: "0.875rem",
                      }}
                    >
                      이메일
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#3b394d",
                        fontSize: "0.875rem",
                      }}
                    >
                      타입
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#3b394d",
                        fontSize: "0.875rem",
                      }}
                    >
                      상태
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#3b394d",
                        fontSize: "0.875rem",
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
                        <Typography
                          variant="subtitle2"
                          fontWeight="600"
                        >
                          {user.name}
                        </Typography>
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

        {/* Charts */}
        <Box sx={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: 3 }}>
          {/* User Type Chart */}
          <Card
            sx={{
              borderRadius: 4,
              border: "1px solid #efeff0",
              p: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#3b394d",
                mb: 2,
                fontSize: "1rem",
              }}
            >
              회원 유형 분포
            </Typography>
            {userTypeChartData && (
              <Box sx={{ height: 200 }}>
                <Doughnut 
                  data={userTypeChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          padding: 15,
                          font: {
                            size: 12
                          }
                        }
                      }
                    }
                  }}
                />
              </Box>
            )}
          </Card>

          {/* User Trend Chart */}
          <Card
            sx={{
              borderRadius: 4,
              border: "1px solid #efeff0",
              p: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#3b394d",
                mb: 2,
                fontSize: "1rem",
              }}
            >
              월별 가입자 추이
            </Typography>
            {userTrendChartData && (
              <Box sx={{ height: 200 }}>
                <Line 
                  data={userTrendChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          display: false
                        }
                      },
                      x: {
                        grid: {
                          display: false
                        }
                      }
                    }
                  }}
                />
              </Box>
            )}
          </Card>
        </Box>
      </Box>

      {/* Recent Activities */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {/* Recent Jobs */}
        <Box sx={{ flex: "1 1 400px" }}>
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
                최근 채용공고
              </Typography>
            </Box>
            <List sx={{ p: 0 }}>
              {recentJobs.map((job, index) => (
                <React.Fragment key={job.id}>
                  <ListItem sx={{ px: 3, py: 2 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "#ffe5e5" }}>
                        <Work sx={{ color: "#ff8796", fontSize: 20 }} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight="600">
                          {job.title}
                        </Typography>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography variant="caption" color="text.secondary" component="span" display="block">
                            {job.hospitalName}
                          </Typography>
                          <Box component="span" sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                            {getEmploymentTypeTag(job.employmentType)}
                            {getStatusTag(job.status)}
                          </Box>
                        </React.Fragment>
                      }
                      secondaryTypographyProps={{
                        component: 'div'
                      }}
                    />
                    <Typography variant="caption" color="#9098a4">
                      {job.createdAt}
                    </Typography>
                  </ListItem>
                  {index < recentJobs.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Card>
        </Box>

        {/* Recent Forums */}
        <Box sx={{ flex: "1 1 400px" }}>
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
                최근 포럼 활동
              </Typography>
            </Box>
            <List sx={{ p: 0 }}>
              {recentForums.map((forum, index) => (
                <React.Fragment key={forum.id}>
                  <ListItem sx={{ px: 3, py: 2 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "#ffe5e5" }}>
                        <Forum sx={{ color: "#ff8796", fontSize: 20 }} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight="600">
                          {forum.title}
                        </Typography>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography variant="caption" color="text.secondary" component="span" display="block">
                            {forum.author} · {forum.category}
                          </Typography>
                          <Box component="span" sx={{ display: 'flex', gap: 2, mt: 0.5, alignItems: 'center' }}>
                            <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Visibility sx={{ fontSize: 14, color: "#9098a4" }} />
                              <Typography variant="caption" color="#9098a4" component="span">
                                {forum.viewCount}
                              </Typography>
                            </Box>
                            <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Comment sx={{ fontSize: 14, color: "#9098a4" }} />
                              <Typography variant="caption" color="#9098a4" component="span">
                                {forum.commentCount}
                              </Typography>
                            </Box>
                          </Box>
                        </React.Fragment>
                      }
                      secondaryTypographyProps={{
                        component: 'div'
                      }}
                    />
                    <Typography variant="caption" color="#9098a4">
                      {forum.createdAt}
                    </Typography>
                  </ListItem>
                  {index < recentForums.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}