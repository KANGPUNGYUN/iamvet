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
  Paper,
  Button,
  ButtonGroup,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Stack,
} from "@mui/material";
import {
  Search,
  Visibility,
  Delete,
  CheckCircle,
  Cancel,
  Warning,
  Flag,
  Person,
} from "@mui/icons-material";
import { Tag } from "@/components/ui/Tag";

interface Report {
  id: number;
  contentType: "JOB" | "LECTURE" | "TRANSFER" | "FORUM";
  contentTitle: string;
  contentId: number;
  reportReason: string;
  reporterName: string;
  reporterEmail: string;
  status: "PENDING" | "RESOLVED" | "REJECTED" | "IN_REVIEW";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  reportedAt: string;
  resolvedAt?: string;
  adminNote?: string;
  reportDetails: string;
}

export default function ReportsManagement() {
  const [reports, setReports] = useState<Report[]>([
    {
      id: 1,
      contentType: "JOB",
      contentTitle: "허위 채용 공고",
      contentId: 5,
      reportReason: "허위 정보",
      reporterName: "김신고자",
      reporterEmail: "reporter1@test.com",
      status: "PENDING",
      severity: "HIGH",
      reportedAt: "2024-01-22",
      reportDetails:
        "실제 존재하지 않는 병원명과 연락처를 사용하여 허위 채용공고를 게시했습니다.",
    },
    {
      id: 2,
      contentType: "LECTURE",
      contentTitle: "부적절한 강의 내용",
      contentId: 5,
      reportReason: "부적절한 내용",
      reporterName: "박수의사",
      reporterEmail: "reporter2@test.com",
      status: "IN_REVIEW",
      severity: "MEDIUM",
      reportedAt: "2024-01-21",
      reportDetails:
        "강의 내용이 수의학과 관련없는 내용으로 구성되어 있으며, 광고성 내용이 포함되어 있습니다.",
    },
    {
      id: 3,
      contentType: "TRANSFER",
      contentTitle: "허위 양도 정보",
      contentId: 5,
      reportReason: "사기 의심",
      reporterName: "이병원장",
      reporterEmail: "reporter3@test.com",
      status: "RESOLVED",
      severity: "CRITICAL",
      reportedAt: "2024-01-20",
      resolvedAt: "2024-01-21",
      adminNote: "허위 정보로 확인되어 게시물 정지 처리",
      reportDetails:
        "존재하지 않는 병원 정보와 비현실적인 가격으로 사기 시도가 의심됩니다.",
    },
    {
      id: 4,
      contentType: "FORUM",
      contentTitle: "욕설 및 비방 게시물",
      contentId: 12,
      reportReason: "욕설/비방",
      reporterName: "최수의사",
      reporterEmail: "reporter4@test.com",
      status: "RESOLVED",
      severity: "MEDIUM",
      reportedAt: "2024-01-19",
      resolvedAt: "2024-01-20",
      adminNote: "게시물 삭제 및 사용자 경고 처리",
      reportDetails:
        "다른 수의사에 대한 욕설과 인신공격성 발언이 포함되어 있습니다.",
    },
    {
      id: 5,
      contentType: "JOB",
      contentTitle: "차별적 채용 공고",
      contentId: 8,
      reportReason: "차별 내용",
      reporterName: "정평등주의",
      reporterEmail: "reporter5@test.com",
      status: "REJECTED",
      severity: "LOW",
      reportedAt: "2024-01-18",
      resolvedAt: "2024-01-19",
      adminNote: "합법적인 자격 요건으로 판단하여 반려",
      reportDetails:
        "성별, 나이 제한이 있다고 신고했으나 직무상 필요한 요건으로 판단됩니다.",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterSeverity, setFilterSeverity] = useState("ALL");
  const [filterContentType, setFilterContentType] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [actionType, setActionType] = useState<"view" | "resolve" | "reject">(
    "view"
  );

  const getStatusTag = (status: string) => {
    const statusMap: {
      [key: string]: { variant: 1 | 2 | 3 | 4 | 5 | 6; text: string };
    } = {
      PENDING: { variant: 3, text: "대기중" },
      IN_REVIEW: { variant: 4, text: "검토중" },
      RESOLVED: { variant: 2, text: "처리완료" },
      REJECTED: { variant: 1, text: "반려" },
    };
    const statusInfo = statusMap[status] || {
      variant: 6 as const,
      text: status,
    };
    return <Tag variant={statusInfo.variant}>{statusInfo.text}</Tag>;
  };

  const getSeverityTag = (severity: string) => {
    const severityMap: {
      [key: string]: { variant: 1 | 2 | 3 | 4 | 5 | 6; text: string };
    } = {
      LOW: { variant: 6, text: "낮음" },
      MEDIUM: { variant: 3, text: "보통" },
      HIGH: { variant: 1, text: "높음" },
      CRITICAL: { variant: 4, text: "긴급" },
    };
    const severityInfo = severityMap[severity] || {
      variant: 6 as const,
      text: severity,
    };
    return <Tag variant={severityInfo.variant}>{severityInfo.text}</Tag>;
  };

  const getContentTypeTag = (type: string) => {
    const typeMap: {
      [key: string]: { variant: 1 | 2 | 3 | 4 | 5 | 6; text: string };
    } = {
      JOB: { variant: 4, text: "채용공고" },
      LECTURE: { variant: 2, text: "강의" },
      TRANSFER: { variant: 3, text: "양도양수" },
      FORUM: { variant: 5, text: "포럼" },
    };
    const typeInfo = typeMap[type] || {
      variant: 6 as const,
      text: type,
    };
    return <Tag variant={typeInfo.variant}>{typeInfo.text}</Tag>;
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.contentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportReason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "ALL" || report.status === filterStatus;
    const matchesSeverity =
      filterSeverity === "ALL" || report.severity === filterSeverity;
    const matchesContentType =
      filterContentType === "ALL" || report.contentType === filterContentType;
    return (
      matchesSearch && matchesStatus && matchesSeverity && matchesContentType
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReports = filteredReports.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const handleAction = (
    report: Report,
    action: "view" | "resolve" | "reject"
  ) => {
    setSelectedReport(report);
    setActionType(action);
    setModalVisible(true);
  };

  const confirmAction = () => {
    if (!selectedReport) return;

    const currentDate = new Date().toISOString().split("T")[0];

    setReports((prev) =>
      prev.map((report) => {
        if (report.id === selectedReport.id) {
          switch (actionType) {
            case "resolve":
              return {
                ...report,
                status: "RESOLVED" as const,
                resolvedAt: currentDate,
                adminNote: "관리자에 의해 처리됨",
              };
            case "reject":
              return {
                ...report,
                status: "REJECTED" as const,
                resolvedAt: currentDate,
                adminNote: "신고 내용이 부적절하여 반려",
              };
            default:
              return report;
          }
        }
        return report;
      })
    );

    setModalVisible(false);
    setSelectedReport(null);
  };

  const renderActionButtons = (report: Report) => (
    <ButtonGroup size="small">
      <Button variant="outlined" onClick={() => handleAction(report, "view")}>
        <Visibility />
      </Button>
      {report.status === "PENDING" && (
        <>
          <Button
            variant="outlined"
            color="success"
            onClick={() => handleAction(report, "resolve")}
          >
            <CheckCircle />
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleAction(report, "reject")}
          >
            <Cancel />
          </Button>
        </>
      )}
    </ButtonGroup>
  );

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
          신고 관리
        </Typography>
        <Typography variant="body1" sx={{ color: "#4f5866" }}>
          사용자 신고를 효율적으로 관리하고 처리하세요.
        </Typography>
      </Box>

      {/* Modern Filter Section */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          border: "1px solid #efeff0",
          bgcolor: "#fafafa",
          boxShadow: "none",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(25% - 18px)" } }}>
              <TextField
                fullWidth
                placeholder="제목, 신고자, 사유로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "white",
                    borderRadius: 2,
                    border: "1px solid #efeff0",
                    "&:hover": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ff8796",
                      },
                    },
                    "&.Mui-focused": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ff8796",
                        borderWidth: 2,
                      },
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "#9098a4", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box
              sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(18.75% - 18px)" } }}
            >
              <FormControl fullWidth>
                <InputLabel sx={{ color: "#4f5866" }}>상태</InputLabel>
                <Select
                  value={filterStatus}
                  label="상태"
                  onChange={(e) => setFilterStatus(e.target.value)}
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
                  <MenuItem value="ALL">모든 상태</MenuItem>
                  <MenuItem value="PENDING">대기중</MenuItem>
                  <MenuItem value="IN_REVIEW">검토중</MenuItem>
                  <MenuItem value="RESOLVED">처리완료</MenuItem>
                  <MenuItem value="REJECTED">반려</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box
              sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(18.75% - 18px)" } }}
            >
              <FormControl fullWidth>
                <InputLabel sx={{ color: "#4f5866" }}>심각도</InputLabel>
                <Select
                  value={filterSeverity}
                  label="심각도"
                  onChange={(e) => setFilterSeverity(e.target.value)}
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
                  <MenuItem value="ALL">모든 심각도</MenuItem>
                  <MenuItem value="LOW">낮음</MenuItem>
                  <MenuItem value="MEDIUM">보통</MenuItem>
                  <MenuItem value="HIGH">높음</MenuItem>
                  <MenuItem value="CRITICAL">긴급</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box
              sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(18.75% - 18px)" } }}
            >
              <FormControl fullWidth>
                <InputLabel sx={{ color: "#4f5866" }}>콘텐츠 유형</InputLabel>
                <Select
                  value={filterContentType}
                  label="콘텐츠 유형"
                  onChange={(e) => setFilterContentType(e.target.value)}
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
                  <MenuItem value="ALL">모든 유형</MenuItem>
                  <MenuItem value="JOB">채용공고</MenuItem>
                  <MenuItem value="LECTURE">강의</MenuItem>
                  <MenuItem value="TRANSFER">양도양수</MenuItem>
                  <MenuItem value="FORUM">포럼</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box
              sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(18.75% - 18px)" } }}
            >
              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "#ff8796",
                  color: "white",
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: 600,
                  boxShadow: "0 4px 12px #ffd3d3",
                  "&:hover": {
                    bgcolor: "#ff8796",
                    boxShadow: "0 6px 16px #ffd3d3",
                  },
                }}
              >
                내보내기
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Ultra Modern Stats Cards */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
        <Box
          sx={{
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 12px)",
              md: "1 1 calc(25% - 18px)",
            },
          }}
        >
          <Card
            sx={{
              position: "relative",
              bgcolor: "white",
              border: "1px solid #efeff0",
              borderRadius: 4,
              overflow: "hidden",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 32px #ffd3d3",
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
                background: "linear-gradient(90deg, #ff8796, #ffb7b8)",
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
                    {reports.filter((r) => r.status === "PENDING").length}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4f5866",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    대기중인 신고
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
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: "#ff8796",
                        mr: 1,
                      }}
                    />
                    24시간 내 처리
                  </Box>
                </Box>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, #fff7f7 0%, #ffe5e5 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Warning sx={{ fontSize: 28, color: "#ff8796" }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box
          sx={{
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 12px)",
              md: "1 1 calc(25% - 18px)",
            },
          }}
        >
          <Card
            sx={{
              position: "relative",
              bgcolor: "white",
              border: "1px solid #efeff0",
              borderRadius: 4,
              overflow: "hidden",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 32px #ffe5e5",
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
                background: "linear-gradient(90deg, #ffd3d3, #ffe5e5)",
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
                    {reports.filter((r) => r.status === "IN_REVIEW").length}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4f5866",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    검토중
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "#ffb7b8",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: "#ffb7b8",
                        mr: 1,
                      }}
                    />
                    검토 진행중
                  </Box>
                </Box>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, #ffe5e5 0%, #ffd3d3 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Visibility sx={{ fontSize: 28, color: "#ff8796" }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box
          sx={{
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 12px)",
              md: "1 1 calc(25% - 18px)",
            },
          }}
        >
          <Card
            sx={{
              position: "relative",
              bgcolor: "white",
              border: "1px solid #efeff0",
              borderRadius: 4,
              overflow: "hidden",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 32px #ffe5e5",
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
                background: "linear-gradient(90deg, #ff8796, #ff8796)",
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
                    {
                      reports.filter(
                        (r) =>
                          r.severity === "HIGH" || r.severity === "CRITICAL"
                      ).length
                    }
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4f5866",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    긴급 신고
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
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: "#ff8796",
                        mr: 1,
                      }}
                    />
                    즉시 처리 필요
                  </Box>
                </Box>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, #ffe5e5 0%, #ffd3d3 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Flag sx={{ fontSize: 28, color: "#ff8796" }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box
          sx={{
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 12px)",
              md: "1 1 calc(25% - 18px)",
            },
          }}
        >
          <Card
            sx={{
              position: "relative",
              bgcolor: "white",
              border: "1px solid #efeff0",
              borderRadius: 4,
              overflow: "hidden",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 32px #ffe5e5",
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
                background: "linear-gradient(90deg, #ffd3d3, #ffe5e5)",
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
                    {reports.filter((r) => r.status === "RESOLVED").length}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4f5866",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    처리 완료
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
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: "#ff8796",
                        mr: 1,
                      }}
                    />
                    평균 2일 소요
                  </Box>
                </Box>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, #ffe5e5 0%, #ffd3d3 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckCircle sx={{ fontSize: 28, color: "#ff8796" }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Ultra Modern Data Table */}
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#3b394d",
                  fontSize: "1.25rem",
                }}
              >
                신고 목록
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#4f5866",
                  mt: 0.5,
                }}
              >
                총 {filteredReports.length}개의 신고
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                size="small"
                sx={{
                  color: "#4f5866",
                  border: "1px solid #efeff0",
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                필터
              </Button>
              <Button
                size="small"
                sx={{
                  color: "#4f5866",
                  border: "1px solid #efeff0",
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                정렬
              </Button>
            </Box>
          </Box>
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
                  콘텐츠 정보
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#3b394d",
                    fontSize: "0.875rem",
                    letterSpacing: "0.025em",
                  }}
                >
                  신고자
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#3b394d",
                    fontSize: "0.875rem",
                    letterSpacing: "0.025em",
                  }}
                >
                  신고 사유
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#3b394d",
                    fontSize: "0.875rem",
                    letterSpacing: "0.025em",
                  }}
                >
                  심각도
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
                  신고일
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#3b394d",
                    fontSize: "0.875rem",
                    letterSpacing: "0.025em",
                  }}
                >
                  처리일
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#3b394d",
                    fontSize: "0.875rem",
                    letterSpacing: "0.025em",
                  }}
                >
                  액션
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentReports.map((report) => (
                <TableRow
                  key={report.id}
                  hover
                  sx={{
                    "&:hover": {
                      bgcolor: "rgba(0, 0, 0, 0.02)",
                    },
                    "& .MuiTableCell-root": {
                      py: 2,
                    },
                  }}
                >
                  <TableCell>
                    <Box>
                      {getContentTypeTag(report.contentType)}
                      <Typography
                        variant="subtitle2"
                        fontWeight="600"
                        sx={{ color: "text.primary", mb: 0.5, mt: 0.5 }}
                      >
                        {report.contentTitle}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {report.contentId}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Person sx={{ mr: 1, fontSize: 20, color: "#9098a4" }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {report.reporterName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {report.reporterEmail}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, mb: 0.5 }}
                      >
                        {report.reportReason}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ lineHeight: 1.3 }}
                      >
                        {report.reportDetails.slice(0, 50)}...
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{getSeverityTag(report.severity)}</TableCell>
                  <TableCell>{getStatusTag(report.status)}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="#9098a4"
                      sx={{ fontSize: "0.875rem" }}
                    >
                      {report.reportedAt}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {report.resolvedAt ? (
                      <Typography
                        variant="body2"
                        color="#9098a4"
                        sx={{ fontSize: "0.875rem" }}
                      >
                        {report.resolvedAt}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        -
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{renderActionButtons(report)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modern Pagination */}
        {totalPages > 1 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              p: 3,
              bgcolor: "#fafafa",
              borderTop: "1px solid #efeff0",
            }}
          >
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, page) => setCurrentPage(page)}
              sx={{
                "& .MuiPaginationItem-root": {
                  borderRadius: 2,
                  fontWeight: 500,
                  color: "#4f5866",
                  "&.Mui-selected": {
                    bgcolor: "#ff8796",
                    color: "white",
                    "&:hover": {
                      bgcolor: "#ff8796",
                    },
                  },
                  "&:hover": {
                    bgcolor: "#f2f5ff",
                  },
                },
              }}
            />
          </Box>
        )}
      </Card>

      {/* Action Modal */}
      <Dialog
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {actionType === "view" && "신고 상세정보"}
          {actionType === "resolve" && "신고 처리"}
          {actionType === "reject" && "신고 반려"}
        </DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Box>
              {actionType === "view" && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    신고 정보
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                    <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } }}>
                      <Stack spacing={1}>
                        <Typography>
                          <strong>콘텐츠 유형:</strong>{" "}
                          {getContentTypeTag(selectedReport.contentType)}
                        </Typography>
                        <Typography>
                          <strong>콘텐츠 제목:</strong>{" "}
                          {selectedReport.contentTitle}
                        </Typography>
                        <Typography>
                          <strong>콘텐츠 ID:</strong> {selectedReport.contentId}
                        </Typography>
                        <Typography>
                          <strong>신고 사유:</strong>{" "}
                          {selectedReport.reportReason}
                        </Typography>
                      </Stack>
                    </Box>
                    <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } }}>
                      <Stack spacing={1}>
                        <Typography>
                          <strong>신고자:</strong> {selectedReport.reporterName}
                        </Typography>
                        <Typography>
                          <strong>이메일:</strong>{" "}
                          {selectedReport.reporterEmail}
                        </Typography>
                        <Typography>
                          <strong>심각도:</strong>{" "}
                          {getSeverityTag(selectedReport.severity)}
                        </Typography>
                        <Typography>
                          <strong>상태:</strong>{" "}
                          {getStatusTag(selectedReport.status)}
                        </Typography>
                      </Stack>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                    <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } }}>
                      <Typography>
                        <strong>신고일:</strong> {selectedReport.reportedAt}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } }}>
                      <Typography>
                        <strong>처리일:</strong>{" "}
                        {selectedReport.resolvedAt || "미처리"}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      <strong>신고 상세 내용:</strong>
                    </Typography>
                    <Box sx={{ p: 3, bgcolor: "#f5f5f5", borderRadius: 2 }}>
                      <Typography>{selectedReport.reportDetails}</Typography>
                    </Box>
                  </Box>
                  {selectedReport.adminNote && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        <strong>관리자 메모:</strong>
                      </Typography>
                      <Box sx={{ p: 3, bgcolor: "#e3f2fd", borderRadius: 2 }}>
                        <Typography>{selectedReport.adminNote}</Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              )}

              {actionType === "resolve" && (
                <Alert severity="success">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircle />
                    <Typography>
                      <strong>{selectedReport.contentTitle}</strong>에 대한
                      신고를 처리 완료로 변경하시겠습니까?
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    <strong>신고 사유:</strong> {selectedReport.reportReason}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    처리 완료 시 해당 콘텐츠에 대한 적절한 조치가 취해졌음을
                    의미합니다.
                  </Typography>
                </Alert>
              )}

              {actionType === "reject" && (
                <Alert severity="error">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Cancel />
                    <Typography>
                      <strong>{selectedReport.contentTitle}</strong>에 대한
                      신고를 반려하시겠습니까?
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    <strong>신고 사유:</strong> {selectedReport.reportReason}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    반려 시 신고 내용이 부적절하거나 조치가 불필요함을
                    의미합니다.
                  </Typography>
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalVisible(false)} color="inherit">
            취소
          </Button>
          {actionType !== "view" && (
            <Button
              onClick={confirmAction}
              color={actionType === "resolve" ? "success" : "error"}
              variant="contained"
            >
              {actionType === "resolve" && "처리 완료"}
              {actionType === "reject" && "반려"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
