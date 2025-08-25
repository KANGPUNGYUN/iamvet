"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  ButtonGroup,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from "@mui/material";
import {
  People,
  Work,
  CheckCircle,
  Assessment,
  CloudDownload,
  TrendingUp,
  TrendingDown,
  Star,
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
import { Line, Bar, Doughnut } from "react-chartjs-2";

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

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: any;
  color: string;
}

export default function StatisticsPage() {
  const [timeRange, setTimeRange] = useState("monthly");
  const [activeMetric, setActiveMetric] = useState("users");

  // Stats cards data
  const statsCards: StatCard[] = [
    {
      title: "총 회원수",
      value: "1,247",
      change: "+12.5%",
      changeType: "increase",
      icon: People,
      color: "primary",
    },
    {
      title: "활성 채용공고",
      value: "328",
      change: "+5.2%",
      changeType: "increase",
      icon: Work,
      color: "success",
    },
    {
      title: "매칭 성공",
      value: "89",
      change: "+23.1%",
      changeType: "increase",
      icon: CheckCircle,
      color: "warning",
    },
    {
      title: "월간 매출",
      value: "₩4.2M",
      change: "-2.1%",
      changeType: "decrease",
      icon: Assessment,
      color: "info",
    },
  ];

  // Chart data for different time ranges
  const chartData = {
    users: [
      { label: "1월", value: 156, change: 12 },
      { label: "2월", value: 189, change: 21 },
      { label: "3월", value: 234, change: 24 },
      { label: "4월", value: 298, change: 27 },
      { label: "5월", value: 356, change: 19 },
      { label: "6월", value: 445, change: 25 },
      { label: "7월", value: 523, change: 17 },
      { label: "8월", value: 612, change: 17 },
      { label: "9월", value: 734, change: 20 },
      { label: "10월", value: 867, change: 18 },
      { label: "11월", value: 998, change: 15 },
      { label: "12월", value: 1247, change: 25 },
    ],
    jobs: [
      { label: "1월", value: 45, change: 8 },
      { label: "2월", value: 67, change: 49 },
      { label: "3월", value: 89, change: 33 },
      { label: "4월", value: 123, change: 38 },
      { label: "5월", value: 156, change: 27 },
      { label: "6월", value: 189, change: 21 },
      { label: "7월", value: 234, change: 24 },
      { label: "8월", value: 267, change: 14 },
      { label: "9월", value: 298, change: 12 },
      { label: "10월", value: 312, change: 5 },
      { label: "11월", value: 324, change: 4 },
      { label: "12월", value: 328, change: 1 },
    ],
    matches: [
      { label: "1월", value: 12, change: 0 },
      { label: "2월", value: 18, change: 50 },
      { label: "3월", value: 25, change: 39 },
      { label: "4월", value: 34, change: 36 },
      { label: "5월", value: 42, change: 24 },
      { label: "6월", value: 51, change: 21 },
      { label: "7월", value: 63, change: 24 },
      { label: "8월", value: 72, change: 14 },
      { label: "9월", value: 81, change: 13 },
      { label: "10월", value: 85, change: 5 },
      { label: "11월", value: 87, change: 2 },
      { label: "12월", value: 89, change: 2 },
    ],
  };

  // Top performers data
  const topHospitals = [
    {
      name: "서울 강남 동물병원",
      jobCount: 12,
      successRate: 92,
      avgResponseTime: "2.3일",
    },
    {
      name: "부산 해운대 동물병원",
      jobCount: 8,
      successRate: 88,
      avgResponseTime: "1.8일",
    },
    {
      name: "대구 수성 동물병원",
      jobCount: 6,
      successRate: 85,
      avgResponseTime: "3.1일",
    },
    {
      name: "인천 송도 동물병원",
      jobCount: 5,
      successRate: 90,
      avgResponseTime: "2.7일",
    },
  ];

  const topVeterinarians = [
    {
      name: "김수의",
      applicationCount: 15,
      successRate: 87,
      avgResponseTime: "12시간",
    },
    {
      name: "박수의",
      applicationCount: 12,
      successRate: 83,
      avgResponseTime: "8시간",
    },
    {
      name: "이수의",
      applicationCount: 10,
      successRate: 90,
      avgResponseTime: "6시간",
    },
    {
      name: "정수의",
      applicationCount: 9,
      successRate: 78,
      avgResponseTime: "14시간",
    },
  ];

  const getCurrentData = () => {
    switch (activeMetric) {
      case "jobs":
        return chartData.jobs;
      case "matches":
        return chartData.matches;
      default:
        return chartData.users;
    }
  };

  const getMetricTitle = () => {
    switch (activeMetric) {
      case "jobs":
        return "채용공고 현황";
      case "matches":
        return "매칭 성공 현황";
      default:
        return "회원 가입 현황";
    }
  };

  // Chart configuration
  const getChartData = () => {
    const currentData = getCurrentData();
    return {
      labels: currentData.map((item) => item.label),
      datasets: [
        {
          label: getMetricTitle(),
          data: currentData.map((item) => item.value),
          borderColor: "#ff8796",
          backgroundColor: "rgba(105, 140, 252, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#ff8796",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
        {
          label: "증감률",
          data: currentData.map((item) => item.change),
          borderColor: "#4f5866",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          yAxisID: "y1",
          pointBackgroundColor: "#4f5866",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            family: "inherit",
            size: 12,
            weight: "normal",
          },
          color: "#3b394d",
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "#ffffff",
        titleColor: "#3b394d",
        bodyColor: "#4f5866",
        borderColor: "#efeff0",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        font: {
          family: "inherit",
        },
        callbacks: {
          title: (context: any) => context[0].label,
          label: (context: any) => {
            if (context.datasetIndex === 0) {
              return `${
                context.dataset.label
              }: ${context.parsed.y.toLocaleString()}`;
            } else {
              return `증감률: ${context.parsed.y > 0 ? "+" : ""}${
                context.parsed.y
              }%`;
            }
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "inherit",
            size: 11,
            weight: "normal",
          },
          color: "#9098a4",
        },
      },
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        grid: {
          color: "rgba(239, 239, 240, 0.5)",
          drawBorder: false,
        },
        ticks: {
          font: {
            family: "inherit",
            size: 11,
            weight: "normal",
          },
          color: "#9098a4",
          callback: (value: any) => value.toLocaleString(),
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          font: {
            family: "inherit",
            size: 11,
            weight: "normal",
          },
          color: "#9098a4",
          callback: (value: any) => `${value}%`,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  };

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 2, md: 0 },
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#3b394d",
                mb: 1,
                fontSize: { xs: "1.75rem", md: "2rem" },
              }}
            >
              통계/리포트
            </Typography>
            <Typography variant="body1" sx={{ color: "#4f5866" }}>
              플랫폼의 주요 지표와 성과를 한눈에 확인하세요.
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel sx={{ color: "#4f5866" }}>기간</InputLabel>
              <Select
                value={timeRange}
                label="기간"
                onChange={(e) => setTimeRange(e.target.value)}
                sx={{
                  bgcolor: "white",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#efeff0",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ff8796",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ff8796",
                  },
                }}
              >
                <MenuItem value="daily">일별</MenuItem>
                <MenuItem value="weekly">주별</MenuItem>
                <MenuItem value="monthly">월별</MenuItem>
                <MenuItem value="yearly">연별</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<CloudDownload />}
              sx={{
                bgcolor: "#ff8796",
                color: "white",
                borderRadius: 2,
                py: 1,
                px: 3,
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(105, 140, 252, 0.3)",
                "&:hover": {
                  bgcolor: "#ffe5e5",
                  boxShadow: "0 6px 16px rgba(105, 140, 252, 0.4)",
                },
              }}
            >
              리포트 다운로드
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Ultra Modern Stats Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        {statsCards.map((stat, index) => (
          <Box key={index} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
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
                      ? "linear-gradient(90deg, #ff8796, #ffb7b8)"
                      : stat.color === "success"
                      ? "linear-gradient(90deg, #ff8796, #ffb7b8)"
                      : stat.color === "warning"
                      ? "linear-gradient(90deg, #ff8796, #ffb7b8)"
                      : "linear-gradient(90deg, #ff8796, #ffb7b8)",
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
                      {stat.value}
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
                        color:
                          stat.changeType === "increase"
                            ? "#ffb7b8"
                            : "#4f5866",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                      }}
                    >
                      {stat.changeType === "increase" ? (
                        <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                      ) : (
                        <TrendingDown sx={{ fontSize: 16, mr: 0.5 }} />
                      )}
                      {stat.change} 이번 달
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 3,
                      background:
                        stat.color === "primary"
                          ? "linear-gradient(135deg, #ffe5e5 0%, #ffd3d3 100%)"
                          : stat.color === "success"
                          ? "linear-gradient(135deg, #ffe5e5 0%, #ffd3d3 100%)"
                          : stat.color === "warning"
                          ? "linear-gradient(135deg, #ffe5e5 0%, #ffd3d3 100%)"
                          : "linear-gradient(135deg, #ffe5e5 0%, #ffd3d3 100%)",
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

      {/* Main Chart */}
      <Card
        sx={{
          mb: 4,
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 2, md: 0 },
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
              {getMetricTitle()}
            </Typography>
            <ButtonGroup>
              <Button
                variant={activeMetric === "users" ? "contained" : "outlined"}
                onClick={() => setActiveMetric("users")}
                sx={{
                  bgcolor: activeMetric === "users" ? "#ff8796" : "transparent",
                  color: activeMetric === "users" ? "white" : "#ff8796",
                  borderColor: "#ff8796",
                  "&:hover": {
                    bgcolor: activeMetric === "users" ? "#ffb7b8" : "#ffd3d3",
                    borderColor: "#ff8796",
                  },
                }}
              >
                회원
              </Button>
              <Button
                variant={activeMetric === "jobs" ? "contained" : "outlined"}
                onClick={() => setActiveMetric("jobs")}
                sx={{
                  bgcolor: activeMetric === "jobs" ? "#ff8796" : "transparent",
                  color: activeMetric === "jobs" ? "white" : "#ff8796",
                  borderColor: "#ff8796",
                  "&:hover": {
                    bgcolor: activeMetric === "jobs" ? "#ffb7b8" : "#ffd3d3",
                    borderColor: "#ff8796",
                  },
                }}
              >
                채용공고
              </Button>
              <Button
                variant={activeMetric === "matches" ? "contained" : "outlined"}
                onClick={() => setActiveMetric("matches")}
                sx={{
                  bgcolor:
                    activeMetric === "matches" ? "#ff8796" : "transparent",
                  color: activeMetric === "matches" ? "white" : "#ff8796",
                  borderColor: "#ff8796",
                  "&:hover": {
                    bgcolor: activeMetric === "matches" ? "#ffb7b8" : "#ffd3d3",
                    borderColor: "#ff8796",
                  },
                }}
              >
                매칭
              </Button>
            </ButtonGroup>
          </Box>
        </Box>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ height: "400px", position: "relative" }}>
            <Line data={getChartData()} options={chartOptions} />
          </Box>
        </CardContent>
      </Card>

      {/* Performance Charts */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        {/* Performance Comparison Chart */}
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(67% - 12px)' } }}>
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
                월별 성과 비교
              </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ height: "300px", position: "relative" }}>
                <Bar
                  data={{
                    labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
                    datasets: [
                      {
                        label: "회원 가입",
                        data: [156, 189, 234, 298, 356, 445],
                        backgroundColor: "#ffb7b8",
                        borderColor: "#ff8796",
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false,
                      },
                      {
                        label: "채용 공고",
                        data: [45, 67, 89, 123, 156, 189],
                        backgroundColor: "#9098a4",
                        borderColor: "#4f5866",
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false,
                      },
                      {
                        label: "매칭 성공",
                        data: [12, 18, 25, 34, 42, 51],
                        backgroundColor: "#ffe5e5",
                        borderColor: "#ffd3d3",
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top" as const,
                        labels: {
                          font: {
                            family: "inherit",
                            size: 12,
                            weight: "normal",
                          },
                          color: "#3b394d",
                          usePointStyle: true,
                          padding: 15,
                        },
                      },
                      tooltip: {
                        backgroundColor: "#ffffff",
                        titleColor: "#3b394d",
                        bodyColor: "#4f5866",
                        borderColor: "#efeff0",
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12,
                      },
                    },
                    scales: {
                      x: {
                        grid: {
                          display: false,
                        },
                        ticks: {
                          font: {
                            family: "inherit",
                            size: 11,
                            weight: "normal",
                          },
                          color: "#9098a4",
                        },
                      },
                      y: {
                        grid: {
                          color: "rgba(239, 239, 240, 0.5)",
                          drawBorder: false,
                        },
                        ticks: {
                          font: {
                            family: "inherit",
                            size: 11,
                            weight: "normal",
                          },
                          color: "#9098a4",
                        },
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Success Rate Donut Chart */}
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(33.33% - 16px)' } }}>
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
                매칭 성공률
              </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ height: "300px", position: "relative" }}>
                <Doughnut
                  data={{
                    labels: ["성공", "실패", "진행중"],
                    datasets: [
                      {
                        data: [75, 15, 10],
                        backgroundColor: ["#4f5866", "#F87171", "#ffd3d3"],
                        borderColor: ["#4f5866", "#F87171", "#ffd3d3"],
                        borderWidth: 2,
                        hoverOffset: 4,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom" as const,
                        labels: {
                          font: {
                            family: "inherit",
                            size: 12,
                            weight: "normal",
                          },
                          color: "#3b394d",
                          usePointStyle: true,
                          padding: 15,
                        },
                      },
                      tooltip: {
                        backgroundColor: "#ffffff",
                        titleColor: "#3b394d",
                        bodyColor: "#4f5866",
                        borderColor: "#efeff0",
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12,
                        callbacks: {
                          label: (context: any) => {
                            const label = context.label || "";
                            const value = context.parsed || 0;
                            return `${label}: ${value}%`;
                          },
                        },
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Top Performers */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        {/* Top Hospitals */}
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(50% - 12px)' } }}>
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
                활발한 병원 순위
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
                      }}
                    >
                      병원명
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#3b394d",
                        fontSize: "0.875rem",
                      }}
                    >
                      채용공고
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#3b394d",
                        fontSize: "0.875rem",
                      }}
                    >
                      성공률
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#3b394d",
                        fontSize: "0.875rem",
                      }}
                    >
                      평균 응답
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topHospitals.map((hospital, index) => (
                    <TableRow
                      key={index}
                      hover
                      sx={{
                        "&:hover": {
                          bgcolor: "rgba(0, 0, 0, 0.02)",
                        },
                      }}
                    >
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Tag variant={4}>{index + 1}</Tag>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {hospital.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tag variant={3}>{hospital.jobCount}개</Tag>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            variant="body2"
                            sx={{ mr: 2, fontWeight: 500 }}
                          >
                            {hospital.successRate}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={hospital.successRate}
                            sx={{
                              flexGrow: 1,
                              height: 6,
                              borderRadius: 3,
                              bgcolor: "#f3f4f6",
                              "& .MuiLinearProgress-bar": {
                                bgcolor:
                                  hospital.successRate >= 90
                                    ? "#4f5866"
                                    : hospital.successRate >= 80
                                    ? "#ffd3d3"
                                    : "#F87171",
                                borderRadius: 3,
                              },
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {hospital.avgResponseTime}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>

        {/* Top Veterinarians */}
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(50% - 12px)' } }}>
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
                활발한 수의사 순위
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
                      }}
                    >
                      수의사명
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#3b394d",
                        fontSize: "0.875rem",
                      }}
                    >
                      지원횟수
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#3b394d",
                        fontSize: "0.875rem",
                      }}
                    >
                      성공률
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#3b394d",
                        fontSize: "0.875rem",
                      }}
                    >
                      평균 응답
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topVeterinarians.map((vet, index) => (
                    <TableRow
                      key={index}
                      hover
                      sx={{
                        "&:hover": {
                          bgcolor: "rgba(0, 0, 0, 0.02)",
                        },
                      }}
                    >
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Tag variant={2}>{index + 1}</Tag>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {vet.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tag variant={3}>{vet.applicationCount}회</Tag>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            variant="body2"
                            sx={{ mr: 2, fontWeight: 500 }}
                          >
                            {vet.successRate}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={vet.successRate}
                            sx={{
                              flexGrow: 1,
                              height: 6,
                              borderRadius: 3,
                              bgcolor: "#f3f4f6",
                              "& .MuiLinearProgress-bar": {
                                bgcolor:
                                  vet.successRate >= 90
                                    ? "#4f5866"
                                    : vet.successRate >= 80
                                    ? "#ffd3d3"
                                    : "#F87171",
                                borderRadius: 3,
                              },
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {vet.avgResponseTime}
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

      {/* Key Metrics Summary */}
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
            주요 지표 요약
          </Typography>
        </Box>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
              <Box
                sx={{
                  textAlign: "center",
                  borderRight: { md: "1px solid #efeff0" },
                  pr: { md: 3 },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#4f5866", mb: 1, fontWeight: 500 }}
                >
                  평균 매칭 시간
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "#ff8796", mb: 1 }}
                >
                  2.4일
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#4f5866",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                  15% 개선
                </Box>
              </Box>
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
              <Box
                sx={{
                  textAlign: "center",
                  borderRight: { md: "1px solid #efeff0" },
                  pr: { md: 3 },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#4f5866", mb: 1, fontWeight: 500 }}
                >
                  사용자 만족도
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "#4f5866", mb: 1 }}
                >
                  4.7/5.0
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#4f5866",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  <Star sx={{ fontSize: 16, mr: 0.5 }} />
                  0.2점 상승
                </Box>
              </Box>
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
              <Box
                sx={{
                  textAlign: "center",
                  borderRight: { md: "1px solid #efeff0" },
                  pr: { md: 3 },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#4f5866", mb: 1, fontWeight: 500 }}
                >
                  월간 활성 사용자
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "#3B82F6", mb: 1 }}
                >
                  756명
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#4f5866",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                  18% 증가
                </Box>
              </Box>
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#4f5866", mb: 1, fontWeight: 500 }}
                >
                  평균 세션 시간
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "#ffd3d3", mb: 1 }}
                >
                  12분 34초
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#F87171",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  <TrendingDown sx={{ fontSize: 16, mr: 0.5 }} />
                  3% 감소
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
