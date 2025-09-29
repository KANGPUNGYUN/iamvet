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
  id: string;
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
  userName?: string;
  userEmail?: string;
  userPhone?: string;
}

interface ApiResponse {
  status: string;
  data: {
    transfers: Transfer[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    stats: {
      total: number;
      active: number;
      pending: number;
      suspended: number;
      completed: number;
      transferOut: number;
      transferIn: number;
    };
  };
}

export default function TransfersManagement() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    suspended: 0,
    completed: 0,
    transferOut: 0,
    transferIn: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPagesState, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(
    null
  );
  const [actionType, setActionType] = useState<
    "view" | "suspend" | "delete" | "approve"
  >("view");
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedTransferDetail, setSelectedTransferDetail] =
    useState<any>(null);

  // API 호출 함수
  const fetchTransfers = async (
    page: number = currentPage,
    search: string = searchTerm,
    status: string = filterStatus,
    type: string = filterType
  ) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
      });

      if (search) params.append("search", search);
      if (status !== "ALL") params.append("status", status);
      if (type !== "ALL") params.append("transferType", type);

      const response = await fetch(`/api/admin/transfers?${params}`);
      const result = await response.json();

      if (result.status === "success") {
        setTransfers(result.data.transfers);
        setStats(result.data.stats);
        setTotalPages(result.data.pagination.totalPages);
        setTotalItems(result.data.pagination.total);
      } else {
        console.error("데이터 조회 실패:", result.message);
      }
    } catch (error) {
      console.error("API 호출 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchTransfers();
  }, []);

  // 검색/필터 변경 시 데이터 새로고침
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchTransfers(1, searchTerm, filterStatus, filterType);
    }, 500); // 500ms 디바운스

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterStatus, filterType]);

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

  // 서버 사이드 페이지네이션을 사용하므로 클라이언트 필터링 제거
  const currentTransfers = transfers;

  // 상세 정보 조회 함수
  const fetchTransferDetail = async (transferId: string) => {
    try {
      setModalLoading(true);
      const response = await fetch(`/api/admin/transfers/${transferId}`);
      const result = await response.json();

      if (result.status === "success") {
        setSelectedTransferDetail(result.data);
      } else {
        console.error("상세 정보 조회 실패:", result.message);
        setSelectedTransferDetail(null);
      }
    } catch (error) {
      console.error("상세 정보 조회 API 호출 실패:", error);
      setSelectedTransferDetail(null);
    } finally {
      setModalLoading(false);
    }
  };

  const handleAction = (
    transfer: Transfer,
    action: "view" | "suspend" | "delete" | "approve"
  ) => {
    setSelectedTransfer(transfer);
    setActionType(action);
    setModalVisible(true);

    // 상세보기인 경우 추가 정보 로드
    if (action === "view") {
      fetchTransferDetail(transfer.id);
    }
  };

  // 액션 API 호출 함수
  const executeAction = async (
    transferId: string,
    action: "approve" | "suspend" | "delete"
  ) => {
    try {
      if (action === "delete") {
        // DELETE 요청
        const response = await fetch(`/api/admin/transfers/${transferId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason: "관리자에 의한 삭제",
          }),
        });

        const result = await response.json();
        if (result.status !== "success") {
          throw new Error(result.message);
        }
      } else {
        // PATCH 요청 (상태 변경)
        const statusMap = {
          approve: "ACTIVE",
          suspend: "SUSPENDED",
        };

        const response = await fetch(`/api/admin/transfers/${transferId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: statusMap[action],
            reason: action === "approve" ? "관리자 승인" : "관리자에 의한 정지",
          }),
        });

        const result = await response.json();
        if (result.status !== "success") {
          throw new Error(result.message);
        }
      }

      // 성공 시 데이터 새로고침
      await fetchTransfers();

      return true;
    } catch (error) {
      console.error("액션 실행 실패:", error);
      return false;
    }
  };

  const confirmAction = async () => {
    if (!selectedTransfer) return;

    const success = await executeAction(
      selectedTransfer.id,
      actionType as "approve" | "suspend" | "delete"
    );

    if (success) {
      setModalVisible(false);
      setSelectedTransfer(null);
      setSelectedTransferDetail(null);
    } else {
      // TODO: 에러 알림 표시
      alert("작업 실행 중 오류가 발생했습니다.");
    }
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
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } }}>
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
            </Box>
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(25% - 18px)" } }}>
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
            </Box>
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(25% - 18px)" } }}>
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
            </Box>
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(20% - 14px)" } }}>
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
            </Box>
          </Box>
        </CardContent>
      </Card>

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
                총 {totalItems}개의 게시물
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
                  좋아요수
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} sx={{ textAlign: "center", py: 4 }}>
                    <Typography>데이터를 불러오는 중...</Typography>
                  </TableCell>
                </TableRow>
              ) : currentTransfers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} sx={{ textAlign: "center", py: 4 }}>
                    <Typography>검색 결과가 없습니다.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                currentTransfers.map((transfer) => (
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
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modern Pagination */}
        {totalPagesState > 1 && (
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
              count={totalPagesState}
              page={currentPage}
              onChange={(_, page) => {
                setCurrentPage(page);
                fetchTransfers(page, searchTerm, filterStatus, filterType);
              }}
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
                  {modalLoading ? (
                    <Typography>상세 정보를 불러오는 중...</Typography>
                  ) : selectedTransferDetail ? (
                    <>
                      <Typography variant="h6" gutterBottom>
                        {selectedTransferDetail.title}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 2,
                          mt: 1,
                        }}
                      >
                        <Box
                          sx={{
                            flex: { xs: "1 1 100%", md: "1 1 calc(50% - 8px)" },
                          }}
                        >
                          <Stack spacing={1}>
                            <Typography>
                              <strong>위치:</strong>{" "}
                              {selectedTransferDetail.location}
                            </Typography>
                            <Typography>
                              <strong>가격:</strong>{" "}
                              {selectedTransferDetail.price}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <strong>유형:</strong>
                              {getTypeTag(selectedTransferDetail.transferType)}
                            </Box>
                            {selectedTransferDetail.area && (
                              <Typography>
                                <strong>면적:</strong>{" "}
                                {selectedTransferDetail.area}평
                              </Typography>
                            )}
                          </Stack>
                        </Box>
                        <Box
                          sx={{
                            flex: { xs: "1 1 100%", md: "1 1 calc(50% - 8px)" },
                          }}
                        >
                          <Stack spacing={1}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <strong>상태:</strong>
                              {getStatusTag(selectedTransferDetail.status)}
                            </Box>
                            <Typography>
                              <strong>좋아요:</strong>{" "}
                              {selectedTransferDetail.likeCount}개
                            </Typography>
                            <Typography>
                              <strong>조회수:</strong>{" "}
                              {selectedTransferDetail.viewCount.toLocaleString()}
                            </Typography>
                            <Typography>
                              <strong>등록일:</strong>{" "}
                              {selectedTransferDetail.createdAt}
                            </Typography>
                          </Stack>
                        </Box>
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          <strong>설명:</strong>
                        </Typography>
                        <Typography>
                          {selectedTransferDetail.description}
                        </Typography>
                      </Box>
                      {selectedTransferDetail.user && (
                        <Box
                          sx={{
                            mt: 2,
                            p: 2,
                            bgcolor: "#f5f5f5",
                            borderRadius: 1,
                          }}
                        >
                          <Typography variant="subtitle2" gutterBottom>
                            <strong>작성자 정보:</strong>
                          </Typography>
                          <Stack spacing={0.5}>
                            <Typography variant="body2">
                              <strong>이름:</strong>{" "}
                              {selectedTransferDetail.user.name}
                            </Typography>
                            <Typography variant="body2">
                              <strong>이메일:</strong>{" "}
                              {selectedTransferDetail.user.email}
                            </Typography>
                            {selectedTransferDetail.user.phone && (
                              <Typography variant="body2">
                                <strong>연락처:</strong>{" "}
                                {selectedTransferDetail.user.phone}
                              </Typography>
                            )}
                          </Stack>
                        </Box>
                      )}
                      {selectedTransferDetail.relatedStats &&
                        selectedTransferDetail.relatedStats.relatedCount >
                          0 && (
                          <Alert severity="info" sx={{ mt: 2 }}>
                            <strong>참고:</strong> 같은 지역(
                            {selectedTransferDetail.sido}{" "}
                            {selectedTransferDetail.sigungu})에
                            {selectedTransferDetail.relatedStats.relatedCount}
                            개의 유사한 게시물이 있습니다.
                            {selectedTransferDetail.relatedStats.avgPrice >
                              0 && (
                              <>
                                {" "}
                                평균 가격:{" "}
                                {selectedTransferDetail.relatedStats.avgPrice.toLocaleString()}
                                원
                              </>
                            )}
                          </Alert>
                        )}
                      {selectedTransferDetail.reportCount > 0 && (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                          <strong>주의:</strong> 이 게시물은{" "}
                          {selectedTransferDetail.reportCount}건의 신고를
                          받았습니다.
                        </Alert>
                      )}
                      {selectedTransferDetail.status === "PENDING" && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                          <strong>알림:</strong> 이 게시물은 관리자 승인을
                          기다리고 있습니다.
                        </Alert>
                      )}
                    </>
                  ) : (
                    <Typography>상세 정보를 불러올 수 없습니다.</Typography>
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
          <Button
            onClick={() => {
              setModalVisible(false);
              setSelectedTransferDetail(null);
            }}
            color="inherit"
          >
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
