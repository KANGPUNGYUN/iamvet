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
  Home,
  AttachMoney,
} from "@mui/icons-material";
import { Tag } from "@/components/ui/Tag";

interface Transfer {
  id: number;
  title: string;
  hospitalName: string;
  location: string;
  price: string;
  transferType: "양도" | "양수";
  status: "ACTIVE" | "PENDING" | "SUSPENDED" | "COMPLETED";
  reportCount: number;
  inquiryCount: number;
  createdAt: string;
  viewCount: number;
  description: string;
}

export default function TransfersManagement() {
  const [transfers, setTransfers] = useState<Transfer[]>([
    {
      id: 1,
      title: "서울 강남구 동물병원 양도",
      hospitalName: "강남펫클리닉",
      location: "서울 강남구",
      price: "15억원",
      transferType: "양도",
      status: "ACTIVE",
      reportCount: 0,
      inquiryCount: 8,
      createdAt: "2024-01-20",
      viewCount: 456,
      description: "최신 의료장비 완비, 안정적인 고객층 보유",
    },
    {
      id: 2,
      title: "부산 해운대 동물병원 인수 희망",
      hospitalName: "",
      location: "부산 해운대구",
      price: "5억원~8억원",
      transferType: "양수",
      status: "ACTIVE",
      reportCount: 0,
      inquiryCount: 3,
      createdAt: "2024-01-19",
      viewCount: 234,
      description: "경력 10년 수의사, 해운대 지역 선호",
    },
    {
      id: 3,
      title: "대구 수성구 24시 동물병원 양도",
      hospitalName: "대구24시동물병원",
      location: "대구 수성구",
      price: "협의",
      transferType: "양도",
      status: "PENDING",
      reportCount: 0,
      inquiryCount: 12,
      createdAt: "2024-01-18",
      viewCount: 678,
      description: "24시간 운영, 응급실 완비",
    },
    {
      id: 4,
      title: "인천 송도 동물병원 양도",
      hospitalName: "송도펫케어",
      location: "인천 연수구",
      price: "12억원",
      transferType: "양도",
      status: "COMPLETED",
      reportCount: 0,
      inquiryCount: 15,
      createdAt: "2024-01-15",
      viewCount: 890,
      description: "신도시 위치, 높은 성장 잠재력",
    },
    {
      id: 5,
      title: "허위 양도 정보",
      hospitalName: "가짜병원",
      location: "가짜 주소",
      price: "비현실적 가격",
      transferType: "양도",
      status: "SUSPENDED",
      reportCount: 6,
      inquiryCount: 2,
      createdAt: "2024-01-10",
      viewCount: 45,
      description: "허위 정보로 신고됨",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(
    null
  );
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
      COMPLETED: { variant: 4, text: "완료" },
    };
    const statusInfo = statusMap[status] || {
      variant: 6 as const,
      text: status,
    };
    return <Tag variant={statusInfo.variant}>{statusInfo.text}</Tag>;
  };

  const getTypeTag = (type: string) => {
    const typeMap: { [key: string]: { variant: 1 | 2 | 3 | 4 | 5 | 6 } } = {
      양도: { variant: 4 },
      양수: { variant: 5 },
    };
    const typeInfo = typeMap[type] || { variant: 6 as const };
    return <Tag variant={typeInfo.variant}>{type}</Tag>;
  };

  const filteredTransfers = transfers.filter((transfer) => {
    const matchesSearch =
      transfer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "ALL" || transfer.status === filterStatus;
    const matchesType =
      filterType === "ALL" || transfer.transferType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransfers = filteredTransfers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredTransfers.length / itemsPerPage);

  const handleAction = (
    transfer: Transfer,
    action: "view" | "suspend" | "delete" | "approve"
  ) => {
    setSelectedTransfer(transfer);
    setActionType(action);
    setModalVisible(true);
  };

  const confirmAction = () => {
    if (!selectedTransfer) return;

    setTransfers((prev) =>
      prev.map((transfer) => {
        if (transfer.id === selectedTransfer.id) {
          switch (actionType) {
            case "approve":
              return { ...transfer, status: "ACTIVE" as const };
            case "suspend":
              return { ...transfer, status: "SUSPENDED" as const };
            case "delete":
              return { ...transfer, status: "SUSPENDED" as const };
            default:
              return transfer;
          }
        }
        return transfer;
      })
    );

    setModalVisible(false);
    setSelectedTransfer(null);
  };

  const renderActionButtons = (transfer: Transfer) => (
    <ButtonGroup size="small">
      <Button variant="outlined" onClick={() => handleAction(transfer, "view")}>
        <Visibility />
      </Button>
      {transfer.status === "PENDING" && (
        <Button
          variant="outlined"
          color="success"
          onClick={() => handleAction(transfer, "approve")}
        >
          <CheckCircle />
        </Button>
      )}
      <Button
        variant="outlined"
        color="warning"
        onClick={() => handleAction(transfer, "suspend")}
        disabled={transfer.status === "SUSPENDED"}
      >
        <Cancel />
      </Button>
      <Button
        variant="outlined"
        color="error"
        onClick={() => handleAction(transfer, "delete")}
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
          양도양수 관리
        </Typography>
        <Typography variant="body1" sx={{ color: "#4f5866" }}>
          병원 양도양수 게시물을 효율적으로 관리하고 모니터링하세요.
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
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                placeholder="제목, 병원명, 지역으로 검색..."
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
                  <MenuItem value="COMPLETED">완료</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2.5}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: "#4f5866" }}>유형</InputLabel>
                <Select
                  value={filterType}
                  label="유형"
                  onChange={(e) => setFilterType(e.target.value)}
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
                  <MenuItem value="양도">양도</MenuItem>
                  <MenuItem value="양수">양수</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
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
        <Grid item xs={12} sm={6} md={3}>
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
                    {transfers.filter((t) => t.status === "ACTIVE").length}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4f5866",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    활성 게시물
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
                    전월 대비 +12%
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
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
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
                    {transfers.filter((t) => t.status === "PENDING").length}
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
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
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
                    {transfers.filter((t) => t.reportCount > 0).length}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4f5866",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    신고된 게시물
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
                    즉시 확인 필요
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
        <Grid item xs={12} sm={6} md={3}>
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
                    {transfers.reduce(
                      (sum, transfer) => sum + transfer.inquiryCount,
                      0
                    )}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4f5866",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    총 문의수
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
                    이번 주 +8건
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
                  <Home sx={{ fontSize: 28, color: "#ff8796" }} />
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
                양도양수 목록
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#4f5866",
                  mt: 0.5,
                }}
              >
                총 {filteredTransfers.length}개의 게시물
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
                  병원/지역
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#3b394d",
                    fontSize: "0.875rem",
                    letterSpacing: "0.025em",
                  }}
                >
                  가격
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#3b394d",
                    fontSize: "0.875rem",
                    letterSpacing: "0.025em",
                  }}
                >
                  유형
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
                  문의
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
              {currentTransfers.map((transfer) => (
                <TableRow
                  key={transfer.id}
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
                        {transfer.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ lineHeight: 1.3 }}
                      >
                        {transfer.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, mb: 0.5 }}
                      >
                        {transfer.hospitalName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {transfer.location}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <AttachMoney
                        sx={{ mr: 0.5, fontSize: 20, color: "#4CAF50" }}
                      />
                      <Typography
                        variant="body2"
                        fontWeight="600"
                        sx={{ color: "#4CAF50" }}
                      >
                        {transfer.price}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{getTypeTag(transfer.transferType)}</TableCell>
                  <TableCell>{getStatusTag(transfer.status)}</TableCell>
                  <TableCell>
                    <Tag variant={3}>{transfer.inquiryCount}건</Tag>
                  </TableCell>
                  <TableCell>
                    {transfer.reportCount > 0 ? (
                      <Tag variant={1}>{transfer.reportCount}</Tag>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        0
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {transfer.viewCount.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="#9098a4"
                      sx={{ fontSize: "0.875rem" }}
                    >
                      {transfer.createdAt}
                    </Typography>
                  </TableCell>
                  <TableCell>{renderActionButtons(transfer)}</TableCell>
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
          {actionType === "view" && "양도양수 상세정보"}
          {actionType === "approve" && "게시물 승인"}
          {actionType === "suspend" && "게시물 정지"}
          {actionType === "delete" && "게시물 삭제"}
        </DialogTitle>
        <DialogContent>
          {selectedTransfer && (
            <Box>
              {actionType === "view" && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {selectedTransfer.title}
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <Typography>
                          <strong>병원명:</strong>{" "}
                          {selectedTransfer.hospitalName || "정보없음"}
                        </Typography>
                        <Typography>
                          <strong>위치:</strong> {selectedTransfer.location}
                        </Typography>
                        <Typography>
                          <strong>가격:</strong> {selectedTransfer.price}
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <strong>유형:</strong>
                          {getTypeTag(selectedTransfer.transferType)}
                        </Box>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <strong>상태:</strong>
                          {getStatusTag(selectedTransfer.status)}
                        </Box>
                        <Typography>
                          <strong>문의 수:</strong>{" "}
                          {selectedTransfer.inquiryCount}건
                        </Typography>
                        <Typography>
                          <strong>조회수:</strong>{" "}
                          {selectedTransfer.viewCount.toLocaleString()}
                        </Typography>
                        <Typography>
                          <strong>등록일:</strong> {selectedTransfer.createdAt}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      <strong>설명:</strong>
                    </Typography>
                    <Typography>{selectedTransfer.description}</Typography>
                  </Box>
                  {selectedTransfer.reportCount > 0 && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      <strong>주의:</strong> 이 게시물은{" "}
                      {selectedTransfer.reportCount}건의 신고를 받았습니다.
                    </Alert>
                  )}
                  {selectedTransfer.status === "PENDING" && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      <strong>알림:</strong> 이 게시물은 관리자 승인을 기다리고
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
                      <strong>{selectedTransfer.title}</strong> 게시물을
                      승인하시겠습니까?
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    승인된 게시물은 사용자에게 공개됩니다.
                  </Typography>
                </Alert>
              )}

              {actionType === "suspend" && (
                <Alert severity="warning">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Warning />
                    <Typography>
                      <strong>{selectedTransfer.title}</strong> 게시물을
                      정지하시겠습니까?
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    정지된 게시물은 사용자에게 표시되지 않습니다.
                  </Typography>
                </Alert>
              )}

              {actionType === "delete" && (
                <Alert severity="error">
                  <Typography>
                    <strong>{selectedTransfer.title}</strong> 게시물을
                    삭제하시겠습니까?
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    삭제된 게시물은 복구할 수 없습니다.
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
