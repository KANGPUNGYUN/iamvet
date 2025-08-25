"use client";

import React, { useState } from "react";
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
  Button,
  ButtonGroup,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  Stack,
} from "@mui/material";
import {
  Search,
  CloudUpload,
  CheckCircle,
  Warning,
  Timeline,
  Settings,
  Speed,
  Computer,
  ModelTraining,
  TrendingUp,
  TrendingDown,
  Upload,
} from "@mui/icons-material";
import { Tag } from "@/components/ui/Tag";

interface MatchingLog {
  id: number;
  veterinarianId: string;
  hospitalId: string;
  matchScore: number;
  result: "SUCCESS" | "FAILED" | "PENDING";
  executionTime: number;
  timestamp: string;
  modelVersion: string;
}

interface ModelVersion {
  id: number;
  version: string;
  name: string;
  accuracy: number;
  status: "ACTIVE" | "TESTING" | "DEPRECATED";
  deployedAt: string;
  trainedOn: string;
  description: string;
}

export default function AIMonitoring() {
  // Matching logs data
  const [matchingLogs] = useState<MatchingLog[]>([
    {
      id: 1,
      veterinarianId: "VET001",
      hospitalId: "HOS001",
      matchScore: 0.89,
      result: "SUCCESS",
      executionTime: 1.2,
      timestamp: "2024-01-20 14:30:25",
      modelVersion: "v2.1.0",
    },
    {
      id: 2,
      veterinarianId: "VET002",
      hospitalId: "HOS002",
      matchScore: 0.45,
      result: "FAILED",
      executionTime: 0.8,
      timestamp: "2024-01-20 14:25:10",
      modelVersion: "v2.1.0",
    },
    {
      id: 3,
      veterinarianId: "VET003",
      hospitalId: "HOS003",
      matchScore: 0.92,
      result: "SUCCESS",
      executionTime: 1.5,
      timestamp: "2024-01-20 14:20:45",
      modelVersion: "v2.1.0",
    },
    {
      id: 4,
      veterinarianId: "VET004",
      hospitalId: "HOS001",
      matchScore: 0.67,
      result: "PENDING",
      executionTime: 2.1,
      timestamp: "2024-01-20 14:15:30",
      modelVersion: "v2.0.9",
    },
  ]);

  // Model versions data
  const [modelVersions, setModelVersions] = useState<ModelVersion[]>([
    {
      id: 1,
      version: "v2.1.0",
      name: "Advanced Matching Model",
      accuracy: 0.87,
      status: "ACTIVE",
      deployedAt: "2024-01-15",
      trainedOn: "2024-01-10",
      description: "최신 딥러닝 기반 매칭 모델",
    },
    {
      id: 2,
      version: "v2.0.9",
      name: "Stable Matching Model",
      accuracy: 0.82,
      status: "DEPRECATED",
      deployedAt: "2023-12-20",
      trainedOn: "2023-12-15",
      description: "안정성 검증된 기존 모델",
    },
    {
      id: 3,
      version: "v2.2.0-beta",
      name: "Experimental Model",
      accuracy: 0.91,
      status: "TESTING",
      deployedAt: "2024-01-18",
      trainedOn: "2024-01-16",
      description: "실험적 신경망 모델",
    },
  ]);

  const [activeTab, setActiveTab] = useState("logs");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterResult, setFilterResult] = useState("ALL");
  const [updateModalVisible, setUpdateModalVisible] = useState(false);

  // Performance metrics
  const performanceMetrics = {
    totalRequests: 1247,
    successRate: 0.87,
    avgResponseTime: 1.3,
    activeModel: "v2.1.0",
    dailyRequests: 156,
    errorRate: 0.13,
  };

  const statsData = [
    {
      title: "총 요청수",
      count: performanceMetrics.totalRequests.toLocaleString(),
      percentage: "+12%",
      icon: Computer,
      color: "primary",
    },
    {
      title: "성공률",
      count: `${(performanceMetrics.successRate * 100).toFixed(1)}%`,
      percentage: "+5%",
      icon: CheckCircle,
      color: "success",
    },
    {
      title: "평균 응답시간",
      count: `${performanceMetrics.avgResponseTime}초`,
      percentage: "-8%",
      icon: Speed,
      color: "info",
    },
    {
      title: "활성 모델",
      count: performanceMetrics.activeModel,
      percentage: "현재",
      icon: ModelTraining,
      color: "warning",
    },
    {
      title: "일일 요청",
      count: performanceMetrics.dailyRequests.toString(),
      percentage: "+15%",
      icon: Timeline,
      color: "primary",
    },
    {
      title: "오류율",
      count: `${(performanceMetrics.errorRate * 100).toFixed(1)}%`,
      percentage: "-3%",
      icon: Warning,
      color: "error",
    },
  ];

  const getResultTag = (result: string) => {
    const resultMap: {
      [key: string]: { variant: 1 | 2 | 3 | 4 | 5 | 6; text: string };
    } = {
      SUCCESS: { variant: 2, text: "성공" },
      FAILED: { variant: 1, text: "실패" },
      PENDING: { variant: 3, text: "대기" },
    };
    const resultInfo = resultMap[result] || { variant: 6, text: result };
    return <Tag variant={resultInfo.variant}>{resultInfo.text}</Tag>;
  };

  const getStatusTag = (status: string) => {
    const statusMap: {
      [key: string]: { variant: 1 | 2 | 3 | 4 | 5 | 6; text: string };
    } = {
      ACTIVE: { variant: 2, text: "활성" },
      TESTING: { variant: 3, text: "테스트" },
      DEPRECATED: { variant: 1, text: "중단됨" },
    };
    const statusInfo = statusMap[status] || { variant: 6, text: status };
    return <Tag variant={statusInfo.variant}>{statusInfo.text}</Tag>;
  };

  const getScoreColor = (score: number) => {
    return "#ff8796";
  };

  const handleModelAction = (
    model: ModelVersion,
    action: "activate" | "test" | "deprecate"
  ) => {
    setModelVersions((prev) =>
      prev.map((m) => {
        if (m.id === model.id) {
          let newStatus: "ACTIVE" | "TESTING" | "DEPRECATED";
          switch (action) {
            case "activate":
              newStatus = "ACTIVE";
              break;
            case "test":
              newStatus = "TESTING";
              break;
            case "deprecate":
              newStatus = "DEPRECATED";
              break;
          }
          return { ...m, status: newStatus };
        }
        // If activating this model, deprecate others
        if (action === "activate") {
          return {
            ...m,
            status: m.status === "ACTIVE" ? "DEPRECATED" : m.status,
          };
        }
        return m;
      })
    );
  };

  const filteredLogs = matchingLogs.filter((log) => {
    const matchesSearch =
      log.veterinarianId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.hospitalId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesResult = filterResult === "ALL" || log.result === filterResult;
    return matchesSearch && matchesResult;
  });

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
          AI 매칭 모니터링
        </Typography>
        <Typography variant="body1" sx={{ color: "#4f5866" }}>
          AI 매칭 시스템의 성능을 모니터링하고 모델을 관리하세요.
        </Typography>
      </Box>

      {/* Performance Overview Stats Cards */}
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
                  background: "#ff8796",
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
                        color:
                          stat.percentage.startsWith("+") ||
                          stat.percentage.startsWith("현재")
                            ? "#ff8796"
                            : "#4f5866",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                      }}
                    >
                      {stat.percentage.startsWith("+") ? (
                        <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                      ) : stat.percentage.startsWith("-") ? (
                        <TrendingDown sx={{ fontSize: 16, mr: 0.5 }} />
                      ) : null}
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
                          ? "linear-gradient(135deg, #ffe5e5 0%, #ffd3d3 100%)"
                          : stat.color === "success"
                          ? "linear-gradient(135deg, #ffe5e5 0%, #ffd3d3 100%)"
                          : stat.color === "warning"
                          ? "linear-gradient(135deg, #ffe5e5 0%, #ffd3d3 100%)"
                          : stat.color === "info"
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

      {/* Main Content */}
      <Card
        sx={{
          borderRadius: 4,
          border: "1px solid #efeff0",
          boxShadow: "0 4px 24px rgba(105, 140, 252, 0.08)",
          overflow: "hidden",
        }}
      >
        {/* Navigation Tabs */}
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
            <ButtonGroup>
              <Button
                variant={activeTab === "logs" ? "contained" : "outlined"}
                onClick={() => setActiveTab("logs")}
                startIcon={<Timeline />}
                sx={{
                  bgcolor: activeTab === "logs" ? "#ff8796" : "transparent",
                  color: activeTab === "logs" ? "white" : "#ff8796",
                  borderColor: "#ff8796",
                  "&:hover": {
                    bgcolor:
                      activeTab === "logs"
                        ? "#ff8796"
                        : "rgba(105, 140, 252, 0.04)",
                    borderColor: "#ff8796",
                  },
                }}
              >
                매칭 로그
              </Button>
              <Button
                variant={activeTab === "models" ? "contained" : "outlined"}
                onClick={() => setActiveTab("models")}
                startIcon={<Settings />}
                sx={{
                  bgcolor: activeTab === "models" ? "#ff8796" : "transparent",
                  color: activeTab === "models" ? "white" : "#ff8796",
                  borderColor: "#ff8796",
                  "&:hover": {
                    bgcolor:
                      activeTab === "models"
                        ? "#ff8796"
                        : "rgba(105, 140, 252, 0.04)",
                    borderColor: "#ff8796",
                  },
                }}
              >
                모델 관리
              </Button>
            </ButtonGroup>
            {activeTab === "models" && (
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                onClick={() => setUpdateModalVisible(true)}
                sx={{
                  bgcolor: "#10B981",
                  color: "white",
                  borderRadius: 2,
                  py: 1,
                  px: 3,
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                  "&:hover": {
                    bgcolor: "#059669",
                    boxShadow: "0 6px 16px rgba(16, 185, 129, 0.4)",
                  },
                }}
              >
                모델 업데이트
              </Button>
            )}
          </Box>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* Search and Filters */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
            <Box sx={{ flex: "1 1 300px" }}>
              <TextField
                fullWidth
                placeholder={
                  activeTab === "logs"
                    ? "수의사/병원 ID로 검색"
                    : "모델명으로 검색"
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "#4f5866" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff8796",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff8796",
                    },
                  },
                }}
              />
            </Box>
            {activeTab === "logs" && (
              <Box sx={{ flex: "0 0 200px" }}>
                <FormControl fullWidth>
                  <InputLabel>결과 필터</InputLabel>
                  <Select
                    value={filterResult}
                    label="결과 필터"
                    onChange={(e) => setFilterResult(e.target.value)}
                    sx={{
                      borderRadius: 2,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ff8796",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ff8796",
                      },
                    }}
                  >
                    <MenuItem value="ALL">모든 결과</MenuItem>
                    <MenuItem value="SUCCESS">성공</MenuItem>
                    <MenuItem value="FAILED">실패</MenuItem>
                    <MenuItem value="PENDING">대기</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}
            <Box sx={{ flex: "0 0 120px" }}>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  borderColor: "#ff8796",
                  color: "#ff8796",
                  borderRadius: 2,
                  height: "56px",
                  "&:hover": {
                    borderColor: "#ff8796",
                    bgcolor: "rgba(105, 140, 252, 0.04)",
                  },
                }}
              >
                내보내기
              </Button>
            </Box>
          </Box>

          {/* Matching Logs Table */}
          {activeTab === "logs" && (
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
                      수의사 ID
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#3b394d",
                        fontSize: "0.875rem",
                      }}
                    >
                      병원 ID
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#3b394d",
                        fontSize: "0.875rem",
                      }}
                    >
                      매칭 점수
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#3b394d",
                        fontSize: "0.875rem",
                      }}
                    >
                      결과
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#3b394d",
                        fontSize: "0.875rem",
                      }}
                    >
                      실행 시간
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#3b394d",
                        fontSize: "0.875rem",
                      }}
                    >
                      모델 버전
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#3b394d",
                        fontSize: "0.875rem",
                      }}
                    >
                      실행 시각
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow
                      key={log.id}
                      hover
                      sx={{
                        "&:hover": {
                          bgcolor: "rgba(0, 0, 0, 0.02)",
                        },
                      }}
                    >
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "monospace",
                            bgcolor: "#f8f9fa",
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            display: "inline-block",
                          }}
                        >
                          {log.veterinarianId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "monospace",
                            bgcolor: "#f8f9fa",
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            display: "inline-block",
                          }}
                        >
                          {log.hospitalId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Typography variant="body2" sx={{ minWidth: "50px" }}>
                            {(log.matchScore * 100).toFixed(1)}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={log.matchScore * 100}
                            sx={{
                              flexGrow: 1,
                              height: 6,
                              borderRadius: 3,
                              bgcolor: "#f3f4f6",
                              "& .MuiLinearProgress-bar": {
                                bgcolor: getScoreColor(log.matchScore),
                                borderRadius: 3,
                              },
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>{getResultTag(log.result)}</TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {log.executionTime}초
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tag variant={4}>{log.modelVersion}</Tag>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="#9098a4">
                          {log.timestamp}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Model Versions Table */}
          {activeTab === "models" && (
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
                      버전
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#3b394d",
                        fontSize: "0.875rem",
                      }}
                    >
                      모델명
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#3b394d",
                        fontSize: "0.875rem",
                      }}
                    >
                      정확도
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
                      배포일
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#3b394d",
                        fontSize: "0.875rem",
                      }}
                    >
                      학습일
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#3b394d",
                        fontSize: "0.875rem",
                      }}
                    >
                      액션
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {modelVersions.map((model) => (
                    <TableRow
                      key={model.id}
                      hover
                      sx={{
                        "&:hover": {
                          bgcolor: "rgba(0, 0, 0, 0.02)",
                        },
                      }}
                    >
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "monospace",
                            fontWeight: 600,
                            bgcolor: "#f8f9fa",
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            display: "inline-block",
                          }}
                        >
                          {model.version}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="600">
                            {model.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {model.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Typography variant="body2" sx={{ minWidth: "50px" }}>
                            {(model.accuracy * 100).toFixed(1)}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={model.accuracy * 100}
                            sx={{
                              flexGrow: 1,
                              height: 6,
                              borderRadius: 3,
                              bgcolor: "#f3f4f6",
                              "& .MuiLinearProgress-bar": {
                                bgcolor: getScoreColor(model.accuracy),
                                borderRadius: 3,
                              },
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>{getStatusTag(model.status)}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color="#9098a4">
                          {model.deployedAt}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="#9098a4">
                          {model.trainedOn}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          {model.status !== "ACTIVE" && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="success"
                              onClick={() =>
                                handleModelAction(model, "activate")
                              }
                              sx={{
                                minWidth: "auto",
                                px: 2,
                                fontSize: "0.75rem",
                                borderRadius: 1,
                              }}
                            >
                              활성화
                            </Button>
                          )}
                          {model.status !== "TESTING" && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="warning"
                              onClick={() => handleModelAction(model, "test")}
                              sx={{
                                minWidth: "auto",
                                px: 2,
                                fontSize: "0.75rem",
                                borderRadius: 1,
                              }}
                            >
                              테스트
                            </Button>
                          )}
                          {model.status !== "DEPRECATED" && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() =>
                                handleModelAction(model, "deprecate")
                              }
                              sx={{
                                minWidth: "auto",
                                px: 2,
                                fontSize: "0.75rem",
                                borderRadius: 1,
                              }}
                            >
                              중단
                            </Button>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Model Update Modal */}
      <Dialog
        open={updateModalVisible}
        onClose={() => setUpdateModalVisible(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: "linear-gradient(135deg, #ecfdf5 0%, #bbf7d0 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CloudUpload sx={{ fontSize: 24, color: "#10B981" }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#3b394d" }}>
              새 모델 업데이트
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert
            severity="info"
            sx={{
              mb: 3,
              bgcolor: "rgba(105, 140, 252, 0.08)",
              color: "#ffb7b8",
              "& .MuiAlert-icon": {
                color: "#ffb7b8",
              },
            }}
          >
            새로운 AI 모델을 업로드하고 배포할 수 있습니다. 업로드된 모델은
            자동으로 테스트 상태로 설정됩니다.
          </Alert>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="모델 버전"
              placeholder="예: v2.3.0"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ffb7b8",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ffb7b8",
                  },
                },
              }}
            />
            <TextField
              fullWidth
              label="모델명"
              placeholder="모델 이름을 입력하세요"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ffb7b8",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ffb7b8",
                  },
                },
              }}
            />
            <TextField
              fullWidth
              label="설명"
              multiline
              rows={3}
              placeholder="모델에 대한 설명을 입력하세요"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ffb7b8",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ffb7b8",
                  },
                },
              }}
            />
            <Box>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: 500, color: "#4f5866" }}
              >
                모델 파일
              </Typography>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<Upload />}
                sx={{
                  borderColor: "#efeff0",
                  color: "#4f5866",
                  borderRadius: 2,
                  py: 2,
                  "&:hover": {
                    borderColor: "#ffb7b8",
                    bgcolor: "rgba(105, 140, 252, 0.04)",
                  },
                }}
              >
                파일 선택 (.pkl, .pt, .h5)
                <input type="file" accept=".pkl,.pt,.h5" hidden />
              </Button>
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: 500, color: "#4f5866" }}
              >
                학습 데이터
              </Typography>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<Upload />}
                sx={{
                  borderColor: "#efeff0",
                  color: "#4f5866",
                  borderRadius: 2,
                  py: 2,
                  "&:hover": {
                    borderColor: "#ffb7b8",
                    bgcolor: "rgba(105, 140, 252, 0.04)",
                  },
                }}
              >
                파일 선택 (.csv, .json)
                <input type="file" accept=".csv,.json" multiple hidden />
              </Button>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={() => setUpdateModalVisible(false)}
            sx={{
              borderColor: "#efeff0",
              color: "#4f5866",
              "&:hover": {
                borderColor: "#ffb7b8",
                bgcolor: "rgba(105, 140, 252, 0.04)",
              },
            }}
          >
            취소
          </Button>
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            sx={{
              bgcolor: "#ffb7b8",
              "&:hover": {
                bgcolor: "#ff8796",
              },
              borderRadius: 2,
              px: 3,
            }}
          >
            업로드 및 배포
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
