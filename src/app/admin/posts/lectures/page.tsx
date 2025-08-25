"use client";

import React, { useState } from "react";
import {
  Box,
  Grid,
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
  PlayArrow,
  Star,
} from "@mui/icons-material";
import { Tag } from "@/components/ui/Tag";

interface Lecture {
  id: number;
  title: string;
  instructor: string;
  category: string;
  duration: number; // minutes
  status: "ACTIVE" | "PENDING" | "SUSPENDED" | "DRAFT";
  reportCount: number;
  viewCount: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  description: string;
}

export default function LecturesManagement() {
  const [lectures, setLectures] = useState<Lecture[]>([
    {
      id: 1,
      title: "반려동물 영상진단학 기초",
      instructor: "김영상 교수",
      category: "영상진단",
      duration: 120,
      status: "ACTIVE",
      reportCount: 0,
      viewCount: 1245,
      rating: 4.8,
      reviewCount: 34,
      createdAt: "2024-01-20",
      description: "반려동물 영상진단의 기본 원리와 실습을 다룹니다.",
    },
    {
      id: 2,
      title: "고양이 내과질환 진단과 치료",
      instructor: "박내과 수의사",
      category: "내과",
      duration: 90,
      status: "ACTIVE",
      reportCount: 0,
      viewCount: 987,
      rating: 4.6,
      reviewCount: 28,
      createdAt: "2024-01-19",
      description:
        "고양이 특유의 내과 질환에 대한 체계적인 접근법을 소개합니다.",
    },
    {
      id: 3,
      title: "소동물 외과수술 실습",
      instructor: "이외과 전문의",
      category: "외과",
      duration: 180,
      status: "PENDING",
      reportCount: 0,
      viewCount: 0,
      rating: 0,
      reviewCount: 0,
      createdAt: "2024-01-18",
      description: "실제 수술 과정을 단계별로 상세히 설명합니다.",
    },
    {
      id: 4,
      title: "반려동물 응급처치 가이드",
      instructor: "정응급 수의사",
      category: "응급의학",
      duration: 75,
      status: "ACTIVE",
      reportCount: 0,
      viewCount: 2156,
      rating: 4.9,
      reviewCount: 67,
      createdAt: "2024-01-17",
      description: "응급 상황에서 필요한 처치법을 실습과 함께 배웁니다.",
    },
    {
      id: 5,
      title: "부적절한 강의 내용",
      instructor: "스팸강사",
      category: "기타",
      duration: 30,
      status: "SUSPENDED",
      reportCount: 5,
      viewCount: 45,
      rating: 1.2,
      reviewCount: 8,
      createdAt: "2024-01-15",
      description: "신고된 부적절한 내용의 강의입니다.",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [actionType, setActionType] = useState<
    "view" | "suspend" | "delete" | "approve"
  >("view");

  const getStatusTag = (status: string) => {
    const statusMap: {
      [key: string]: { variant: 1 | 2 | 3 | 4 | 5 | 6; text: string };
    } = {
      ACTIVE: { variant: 2, text: "활성" },
      PENDING: { variant: 3, text: "승인대기" },
      SUSPENDED: { variant: 1, text: "정지" },
      DRAFT: { variant: 6, text: "임시저장" },
    };
    const statusInfo = statusMap[status] || {
      variant: 6 as const,
      text: status,
    };
    return <Tag variant={statusInfo.variant}>{statusInfo.text}</Tag>;
  };

  const getCategoryTag = (category: string) => {
    const categoryMap: { [key: string]: { variant: 1 | 2 | 3 | 4 | 5 | 6 } } = {
      영상진단: { variant: 4 },
      내과: { variant: 3 },
      외과: { variant: 1 },
      응급의학: { variant: 5 },
      기타: { variant: 6 },
    };
    const categoryInfo = categoryMap[category] || { variant: 6 as const };
    return <Tag variant={categoryInfo.variant}>{category}</Tag>;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  const renderRating = (rating: number) => {
    if (rating === 0)
      return (
        <Typography variant="body2" color="text.secondary">
          -
        </Typography>
      );
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Star sx={{ fontSize: 18, color: "#FFA726" }} />
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {rating.toFixed(1)}
        </Typography>
      </Box>
    );
  };

  const filteredLectures = lectures.filter((lecture) => {
    const matchesSearch =
      lecture.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecture.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "ALL" || lecture.status === filterStatus;
    const matchesCategory =
      filterCategory === "ALL" || lecture.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLectures = filteredLectures.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredLectures.length / itemsPerPage);

  const handleAction = (
    lecture: Lecture,
    action: "view" | "suspend" | "delete" | "approve"
  ) => {
    setSelectedLecture(lecture);
    setActionType(action);
    setModalVisible(true);
  };

  const confirmAction = () => {
    if (!selectedLecture) return;

    setLectures((prev) =>
      prev.map((lecture) => {
        if (lecture.id === selectedLecture.id) {
          switch (actionType) {
            case "approve":
              return { ...lecture, status: "ACTIVE" as const };
            case "suspend":
              return { ...lecture, status: "SUSPENDED" as const };
            case "delete":
              return { ...lecture, status: "SUSPENDED" as const };
            default:
              return lecture;
          }
        }
        return lecture;
      })
    );

    setModalVisible(false);
    setSelectedLecture(null);
  };

  const renderActionButtons = (lecture: Lecture) => (
    <ButtonGroup size="small">
      <Button variant="outlined" onClick={() => handleAction(lecture, "view")}>
        <Visibility />
      </Button>
      {lecture.status === "PENDING" && (
        <Button
          variant="outlined"
          color="success"
          onClick={() => handleAction(lecture, "approve")}
        >
          <CheckCircle />
        </Button>
      )}
      <Button
        variant="outlined"
        color="warning"
        onClick={() => handleAction(lecture, "suspend")}
        disabled={lecture.status === "SUSPENDED"}
      >
        <Cancel />
      </Button>
      <Button
        variant="outlined"
        color="error"
        onClick={() => handleAction(lecture, "delete")}
      >
        <Delete />
      </Button>
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
          교육콘텐츠 관리
        </Typography>
        <Typography variant="body1" sx={{ color: "#4f5866" }}>
          수의사 교육콘텐츠를 효율적으로 관리하고 모니터링하세요.
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
          <Grid container spacing={3}>
            <Grid xs={12} md={5}>
              <TextField
                fullWidth
                placeholder="제목, 강사명으로 검색..."
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
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: "#9098a4", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={2.5}>
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
                  <MenuItem value="ACTIVE">활성</MenuItem>
                  <MenuItem value="PENDING">승인대기</MenuItem>
                  <MenuItem value="SUSPENDED">정지</MenuItem>
                  <MenuItem value="DRAFT">임시저장</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2.5}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: "#4f5866" }}>카테고리</InputLabel>
                <Select
                  value={filterCategory}
                  label="카테고리"
                  onChange={(e) => setFilterCategory(e.target.value)}
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
                  <MenuItem value="ALL">모든 카테고리</MenuItem>
                  <MenuItem value="영상진단">영상진단</MenuItem>
                  <MenuItem value="내과">내과</MenuItem>
                  <MenuItem value="외과">외과</MenuItem>
                  <MenuItem value="응급의학">응급의학</MenuItem>
                  <MenuItem value="기타">기타</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} md={2}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "#ff8796",
                  color: "white",
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(105, 140, 252, 0.3)",
                  "&:hover": {
                    bgcolor: "#ffb7b8",
                    boxShadow: "0 6px 16px rgba(105, 140, 252, 0.4)",
                  },
                }}
              >
                내보내기
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Ultra Modern Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} sm={6} md={3}>
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
                    {lectures.filter((l) => l.status === "ACTIVE").length}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4f5866",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    활성 강의
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
                    전월 대비 +5%
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
                  <PlayArrow sx={{ fontSize: 28, color: "#ff8796" }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card
            sx={{
              position: "relative",
              bgcolor: "white",
              border: "1px solid #efeff0",
              borderRadius: 4,
              overflow: "hidden",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 32px rgba(255, 139, 150, 0.15)",
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
                    {lectures.filter((l) => l.status === "PENDING").length}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4f5866",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    승인 대기
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
                    48시간 내 처리
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
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card
            sx={{
              position: "relative",
              bgcolor: "white",
              border: "1px solid #efeff0",
              borderRadius: 4,
              overflow: "hidden",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 32px rgba(255, 135, 150, 0.2)",
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
                    {lectures.filter((l) => l.reportCount > 0).length}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4f5866",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    신고된 강의
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
                    즉시 검토 필요
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
                  <Cancel sx={{ fontSize: 28, color: "#ff8796" }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
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
                    {lectures
                      .reduce((sum, lecture) => sum + lecture.viewCount, 0)
                      .toLocaleString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4f5866",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    총 조회수
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
                    이번 주 +523
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
        </Grid>
      </Grid>

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
                강의 목록
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#4f5866",
                  mt: 0.5,
                }}
              >
                총 {filteredLectures.length}개의 강의
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
                  제목
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#3b394d",
                    fontSize: "0.875rem",
                    letterSpacing: "0.025em",
                  }}
                >
                  강사
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#3b394d",
                    fontSize: "0.875rem",
                    letterSpacing: "0.025em",
                  }}
                >
                  카테고리
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#3b394d",
                    fontSize: "0.875rem",
                    letterSpacing: "0.025em",
                  }}
                >
                  시간
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
                  평점
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#3b394d",
                    fontSize: "0.875rem",
                    letterSpacing: "0.025em",
                  }}
                >
                  조회수
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#3b394d",
                    fontSize: "0.875rem",
                    letterSpacing: "0.025em",
                  }}
                >
                  신고
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#3b394d",
                    fontSize: "0.875rem",
                    letterSpacing: "0.025em",
                  }}
                >
                  등록일
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
              {currentLectures.map((lecture) => (
                <TableRow
                  key={lecture.id}
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
                      <Typography
                        variant="subtitle2"
                        fontWeight="600"
                        sx={{ color: "text.primary", mb: 0.5 }}
                      >
                        {lecture.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ lineHeight: 1.3 }}
                      >
                        {lecture.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {lecture.instructor}
                    </Typography>
                  </TableCell>
                  <TableCell>{getCategoryTag(lecture.category)}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDuration(lecture.duration)}
                    </Typography>
                  </TableCell>
                  <TableCell>{getStatusTag(lecture.status)}</TableCell>
                  <TableCell>
                    {renderRating(lecture.rating)}
                    {lecture.reviewCount > 0 && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mt: 0.5 }}
                      >
                        ({lecture.reviewCount}개 리뷰)
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {lecture.viewCount.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {lecture.reportCount > 0 ? (
                      <Tag variant={1}>{lecture.reportCount}</Tag>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        0
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="#9098a4"
                      sx={{ fontSize: "0.875rem" }}
                    >
                      {lecture.createdAt}
                    </Typography>
                  </TableCell>
                  <TableCell>{renderActionButtons(lecture)}</TableCell>
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
                      bgcolor: "#ffb7b8",
                    },
                  },
                  "&:hover": {
                    bgcolor: "#ffe5e5",
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
          {actionType === "view" && "강의 상세정보"}
          {actionType === "approve" && "강의 승인"}
          {actionType === "suspend" && "강의 정지"}
          {actionType === "delete" && "강의 삭제"}
        </DialogTitle>
        <DialogContent>
          {selectedLecture && (
            <Box>
              {actionType === "view" && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {selectedLecture.title}
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid xs={12} md={6}>
                      <Stack spacing={1}>
                        <Typography>
                          <strong>강사:</strong> {selectedLecture.instructor}
                        </Typography>
                        <Typography>
                          <strong>카테고리:</strong> {selectedLecture.category}
                        </Typography>
                        <Typography>
                          <strong>강의시간:</strong>{" "}
                          {formatDuration(selectedLecture.duration)}
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <strong>상태:</strong>
                          {getStatusTag(selectedLecture.status)}
                        </Box>
                      </Stack>
                    </Grid>
                    <Grid xs={12} md={6}>
                      <Stack spacing={1}>
                        <Typography>
                          <strong>조회수:</strong>{" "}
                          {selectedLecture.viewCount.toLocaleString()}
                        </Typography>
                        <Typography>
                          <strong>평점:</strong>{" "}
                          {selectedLecture.rating > 0
                            ? `${selectedLecture.rating}/5.0 (${selectedLecture.reviewCount}개 리뷰)`
                            : "평가없음"}
                        </Typography>
                        <Typography>
                          <strong>등록일:</strong> {selectedLecture.createdAt}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      <strong>설명:</strong>
                    </Typography>
                    <Typography>{selectedLecture.description}</Typography>
                  </Box>
                  {selectedLecture.reportCount > 0 && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      <strong>주의:</strong> 이 강의는{" "}
                      {selectedLecture.reportCount}건의 신고를 받았습니다.
                    </Alert>
                  )}
                  {selectedLecture.status === "PENDING" && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      <strong>알림:</strong> 이 강의는 관리자 승인을 기다리고
                      있습니다.
                    </Alert>
                  )}
                </Box>
              )}

              {actionType === "approve" && (
                <Alert severity="success">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircle />
                    <Typography>
                      <strong>{selectedLecture.title}</strong> 강의를
                      승인하시겠습니까?
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    승인된 강의는 사용자에게 공개됩니다.
                  </Typography>
                </Alert>
              )}

              {actionType === "suspend" && (
                <Alert severity="warning">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Warning />
                    <Typography>
                      <strong>{selectedLecture.title}</strong> 강의를
                      정지하시겠습니까?
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    정지된 강의는 사용자에게 표시되지 않습니다.
                  </Typography>
                </Alert>
              )}

              {actionType === "delete" && (
                <Alert severity="error">
                  <Typography>
                    <strong>{selectedLecture.title}</strong> 강의를
                    삭제하시겠습니까?
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    삭제된 강의는 복구할 수 없습니다.
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
              color={
                actionType === "approve"
                  ? "success"
                  : actionType === "delete"
                  ? "error"
                  : "warning"
              }
              variant="contained"
            >
              {actionType === "approve" && "승인"}
              {actionType === "suspend" && "정지"}
              {actionType === "delete" && "삭제"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
