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
  Chip,
  Avatar,
  CircularProgress,
  Switch,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  Search,
  Visibility,
  CheckCircle,
  Cancel,
  Warning,
  Work,
  ToggleOn,
  ToggleOff,
} from "@mui/icons-material";
import { Tag } from "@/components/ui/Tag";
import { useAdminJobs, useAdminJobDetail } from "@/hooks/api/useAdminJobs";

interface Job {
  id: string;
  title: string;
  description: string;
  hospitalName: string;
  hospitalId: string;
  hospitalPhone?: string;
  hospitalAddress?: string;
  location: string;
  workType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";
  salary?: string;
  salaryType?: string;
  requirements?: string;
  benefits?: string;
  status: "ACTIVE" | "PENDING" | "SUSPENDED" | "EXPIRED";
  isUrgent: boolean;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  applicantCount: number;
  reportCount: number;
  likeCount: number;
}

export default function JobPostsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterWorkType, setFilterWorkType] = useState<string>("");
  const [filterLocation] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailJobId, setDetailJobId] = useState<string | null>(null);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);

  // API hooks
  const {
    data: jobsData,
    isLoading,
    error,
  } = useAdminJobs({
    search: searchTerm,
    workType: filterWorkType || undefined,
    status: filterStatus || undefined,
    location: filterLocation || undefined,
    page: currentPage,
    limit: 10,
  });

  const {
    data: jobDetailData,
    isLoading: detailLoading,
    error: detailError,
  } = useAdminJobDetail(detailJobId || "");

  const getStatusTag = (status: string) => {
    const statusMap = {
      ACTIVE: { color: "#10b981", bg: "#d1fae5", text: "활성" },
      PENDING: { color: "#f59e0b", bg: "#fef3c7", text: "대기" },
      SUSPENDED: { color: "#ef4444", bg: "#fee2e2", text: "정지" },
      EXPIRED: { color: "#6b7280", bg: "#f3f4f6", text: "만료" },
    };
    const info =
      statusMap[status as keyof typeof statusMap] || statusMap.PENDING;
    return (
      <Chip
        label={info.text}
        size="small"
        sx={{
          backgroundColor: info.bg,
          color: info.color,
          fontWeight: "medium",
          border: "none",
        }}
      />
    );
  };

  const getWorkTypeTag = (workType: string) => {
    const typeMap = {
      FULL_TIME: { variant: 1 as const, text: "정규직" },
      PART_TIME: { variant: 2 as const, text: "비정규직" },
      CONTRACT: { variant: 3 as const, text: "계약직" },
      INTERN: { variant: 4 as const, text: "인턴" },
      정규직: { variant: 1 as const, text: "정규직" },
      파트타임: { variant: 2 as const, text: "파트타임" },
      비정규직: { variant: 2 as const, text: "비정규직" },
      계약직: { variant: 3 as const, text: "계약직" },
      인턴: { variant: 4 as const, text: "인턴" },
    };
    const typeInfo = typeMap[workType as keyof typeof typeMap] || {
      variant: 6 as const,
      text: workType,
    };
    return <Tag variant={typeInfo.variant}>{typeInfo.text}</Tag>;
  };

  const getSalaryText = (salary?: string, salaryType?: string) => {
    if (!salary) return "협의";
    const typeText =
      salaryType === "HOURLY" || salaryType === "시급"
        ? "/시간"
        : salaryType === "MONTHLY" || salaryType === "월급"
        ? "/월"
        : salaryType === "YEARLY" || salaryType === "연봉"
        ? "/년"
        : "";
    return `${salary}${typeText}`;
  };

  const handleJobClick = (jobId: string) => {
    setDetailJobId(jobId);
    setDetailModalOpen(true);
  };

  const handleToggleJobStatus = async (jobId: string, currentStatus: string) => {
    try {
      setToggleLoading(jobId);
      
      const newIsActive = currentStatus !== 'ACTIVE';
      
      // 쿠키 기반 관리자 인증 사용
      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // HttpOnly 쿠키 전송
        body: JSON.stringify({
          isActive: newIsActive,
          reason: newIsActive ? '관리자에 의한 활성화' : '관리자에 의한 비활성화'
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        // 성공 시 페이지 새로고침 또는 상태 업데이트
        window.location.reload();
      } else {
        console.error('상태 변경 실패:', result.message);
        alert('상태 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('API 호출 오류:', error);
      alert('네트워크 오류가 발생했습니다.');
    } finally {
      setToggleLoading(null);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <CircularProgress size={40} sx={{ color: "#ff8796" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        채용 공고 목록을 불러오는 중 오류가 발생했습니다.
      </Alert>
    );
  }

  const jobs = jobsData?.jobs || [];
  const pagination = jobsData?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  };
  const stats = jobsData?.stats || {
    total: 0,
    active: 0,
    pending: 0,
    suspended: 0,
    expired: 0,
    fullTime: 0,
    partTime: 0,
    contract: 0,
    intern: 0,
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, color: "#3b394d", fontWeight: "bold" }}
      >
        채용 공고 관리
      </Typography>

      {/* 통계 카드들 */}
      <Box sx={{ display: "flex", gap: 3, mb: 4, flexWrap: "wrap" }}>
        <Card
          sx={{
            flex: 1,
            minWidth: 200,
            borderRadius: 3,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 3 }}>
            <Work sx={{ fontSize: 32, color: "#ff8796", mb: 1 }} />
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#3b394d" }}
            >
              {stats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              총 공고
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            flex: 1,
            minWidth: 200,
            borderRadius: 3,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 3 }}>
            <CheckCircle sx={{ fontSize: 32, color: "#10b981", mb: 1 }} />
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#3b394d" }}
            >
              {stats.active}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              활성 공고
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            flex: 1,
            minWidth: 200,
            borderRadius: 3,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 3 }}>
            <Warning sx={{ fontSize: 32, color: "#f59e0b", mb: 1 }} />
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#3b394d" }}
            >
              {stats.pending}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              승인 대기
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            flex: 1,
            minWidth: 200,
            borderRadius: 3,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 3 }}>
            <Cancel sx={{ fontSize: 32, color: "#ef4444", mb: 1 }} />
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#3b394d" }}
            >
              {stats.suspended}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              정지된 공고
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* 필터 및 검색 */}
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "#9098a4", fontSize: 20 }} />
                    </InputAdornment>
                  ),
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
                      border: "1px solid #efeff0",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff8796",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff8796",
                      borderWidth: 2,
                    },
                  }}
                >
                  <MenuItem value="">전체</MenuItem>
                  <MenuItem value="ACTIVE">활성</MenuItem>
                  <MenuItem value="PENDING">대기</MenuItem>
                  <MenuItem value="SUSPENDED">정지</MenuItem>
                  <MenuItem value="EXPIRED">만료</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(25% - 18px)" } }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: "#4f5866" }}>근무형태</InputLabel>
                <Select
                  value={filterWorkType}
                  label="근무형태"
                  onChange={(e) => setFilterWorkType(e.target.value)}
                  sx={{
                    bgcolor: "white",
                    borderRadius: 2,
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #efeff0",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff8796",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff8796",
                      borderWidth: 2,
                    },
                  }}
                  startAdornment={
                    <InputAdornment position="start">
                      <Work sx={{ color: "#9098a4", fontSize: 20 }} />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">전체</MenuItem>
                  <MenuItem value="FULL_TIME">정규직</MenuItem>
                  <MenuItem value="PART_TIME">비정규직</MenuItem>
                  <MenuItem value="CONTRACT">계약직</MenuItem>
                  <MenuItem value="INTERN">인턴</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* 채용 공고 테이블 */}
      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid #efeff0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                <TableCell sx={{ fontWeight: "bold", color: "#3b394d" }}>
                  제목
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#3b394d" }}>
                  병원명
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#3b394d" }}>
                  위치
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#3b394d" }}>
                  근무형태
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#3b394d" }}>
                  급여
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#3b394d" }}>
                  상태
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", color: "#3b394d" }}
                  align="center"
                >
                  지원자
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", color: "#3b394d" }}
                  align="center"
                >
                  조회수
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#3b394d" }}>
                  등록일
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", color: "#3b394d" }}
                  align="center"
                >
                  상태 관리
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", color: "#3b394d" }}
                  align="center"
                >
                  작업
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.map((job: Job) => (
                <TableRow
                  key={job.id}
                  hover
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "#f8f9fa",
                    },
                  }}
                  onClick={() => handleJobClick(job.id)}
                >
                  <TableCell>
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: "medium", color: "#3b394d" }}
                      >
                        {job.title}
                      </Typography>
                      {job.isUrgent && (
                        <Chip
                          label="긴급"
                          size="small"
                          sx={{
                            backgroundColor: "#fee2e2",
                            color: "#dc2626",
                            fontSize: "0.75rem",
                            mt: 0.5,
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "#4f5866" }}>
                      {job.hospitalName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "#4f5866" }}>
                      {job.location}
                    </Typography>
                  </TableCell>
                  <TableCell>{getWorkTypeTag(job.workType)}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "#4f5866" }}>
                      {getSalaryText(job.salary, job.salaryType)}
                    </Typography>
                  </TableCell>
                  <TableCell>{getStatusTag(job.status)}</TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ color: "#4f5866" }}>
                      {job.applicantCount}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ color: "#4f5866" }}>
                      {job.viewCount.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "#4f5866" }}>
                      {job.createdAt}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title={`채용공고 ${job.status === 'ACTIVE' ? '비활성화' : '활성화'}`}>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleJobStatus(job.id, job.status);
                        }}
                        disabled={toggleLoading === job.id}
                        sx={{
                          color: job.status === 'ACTIVE' ? '#10b981' : '#6b7280',
                          '&:hover': {
                            bgcolor: job.status === 'ACTIVE' ? '#d1fae5' : '#f3f4f6',
                          },
                        }}
                      >
                        {toggleLoading === job.id ? (
                          <CircularProgress size={20} />
                        ) : job.status === 'ACTIVE' ? (
                          <ToggleOn sx={{ fontSize: 28 }} />
                        ) : (
                          <ToggleOff sx={{ fontSize: 28 }} />
                        )}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJobClick(job.id);
                      }}
                      sx={{
                        minWidth: "auto",
                        px: 1.5,
                        py: 0.5,
                        borderColor: "#ff8796",
                        color: "#ff8796",
                        "&:hover": {
                          borderColor: "#ff8796",
                          bgcolor: "#fef2f3",
                        },
                      }}
                    >
                      <Visibility sx={{ fontSize: 16 }} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* 페이지네이션 */}
        {pagination.totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <Pagination
              count={pagination.totalPages}
              page={currentPage}
              onChange={(_, page) => setCurrentPage(page)}
              color="primary"
              sx={{
                "& .MuiPaginationItem-root": {
                  "&.Mui-selected": {
                    backgroundColor: "#ff8796",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#ff8796",
                    },
                  },
                  "&:hover": {
                    backgroundColor: "#ffe5e5",
                  },
                },
              }}
            />
          </Box>
        )}
      </Card>

      {/* 채용 공고 상세 정보 모달 */}
      <Dialog
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        maxWidth="lg"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "12px",
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#3b394d",
            fontSize: "20px",
            fontWeight: "bold",
            borderBottom: "1px solid #efeff0",
            pb: 2,
          }}
        >
          채용 공고 상세 정보
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {detailLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={40} sx={{ color: "#ff8796" }} />
            </Box>
          ) : detailError ? (
            <Alert severity="error">
              상세 정보를 불러오는 중 오류가 발생했습니다.
            </Alert>
          ) : jobDetailData?.job ? (
            <Box sx={{ pt: 2 }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "#3b394d", mb: 3 }}
              >
                {jobDetailData.job.title}
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 3 }}>
                <Box
                  sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } }}
                >
                  <Stack spacing={2}>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "bold", color: "#4f5866", mb: 1 }}
                      >
                        병원 정보
                      </Typography>
                      <Typography sx={{ mb: 1 }}>
                        <strong>병원명:</strong>{" "}
                        {jobDetailData.job.hospitalName}
                      </Typography>
                      <Typography sx={{ mb: 1 }}>
                        <strong>위치:</strong> {jobDetailData.job.location}
                      </Typography>
                      {jobDetailData.job.hospital?.phone && (
                        <Typography sx={{ mb: 1 }}>
                          <strong>연락처:</strong>{" "}
                          {jobDetailData.job.hospital.phone}
                        </Typography>
                      )}
                    </Box>

                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "bold", color: "#4f5866", mb: 1 }}
                      >
                        채용 조건
                      </Typography>
                      <Typography sx={{ mb: 1 }}>
                        <strong>급여:</strong>{" "}
                        {getSalaryText(
                          jobDetailData.job.salary,
                          jobDetailData.job.salaryType
                        )}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <strong>근무형태:</strong>
                        {getWorkTypeTag(jobDetailData.job.workType)}
                      </Box>
                      {jobDetailData.job.deadline && (
                        <Typography sx={{ mb: 1 }}>
                          <strong>마감일:</strong> {jobDetailData.job.deadline}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </Box>

                <Box
                  sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } }}
                >
                  <Stack spacing={2}>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "bold", color: "#4f5866", mb: 1 }}
                      >
                        공고 상태
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <strong>상태:</strong>
                        {getStatusTag(jobDetailData.job.status)}
                      </Box>
                      <Typography sx={{ mb: 1 }}>
                        <strong>등록일:</strong> {jobDetailData.job.createdAt}
                      </Typography>
                      <Typography sx={{ mb: 1 }}>
                        <strong>수정일:</strong> {jobDetailData.job.updatedAt}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "bold", color: "#4f5866", mb: 1 }}
                      >
                        통계
                      </Typography>
                      <Typography sx={{ mb: 1 }}>
                        <strong>지원자 수:</strong>{" "}
                        {jobDetailData.job.applicantCount}명
                      </Typography>
                      <Typography sx={{ mb: 1 }}>
                        <strong>조회수:</strong>{" "}
                        {jobDetailData.job.viewCount.toLocaleString()}
                      </Typography>
                      <Typography sx={{ mb: 1 }}>
                        <strong>좋아요:</strong> {jobDetailData.job.likeCount}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: "bold", color: "#4f5866", mb: 2 }}
                >
                  공고 내용
                </Typography>
                <Typography sx={{ lineHeight: 1.6, color: "#4f5866" }}>
                  {jobDetailData.job.description || "설명이 없습니다."}
                </Typography>
              </Box>

              {jobDetailData.job.benefits && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: "bold", color: "#4f5866", mb: 2 }}
                  >
                    복리후생
                  </Typography>
                  <Typography sx={{ lineHeight: 1.6, color: "#4f5866" }}>
                    {jobDetailData.job.benefits}
                  </Typography>
                </Box>
              )}

              {jobDetailData.recentApplicants &&
                jobDetailData.recentApplicants.length > 0 && (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: "bold", color: "#4f5866", mb: 2 }}
                    >
                      최근 지원자 ({jobDetailData.recentApplicants.length}명)
                    </Typography>
                    <Stack spacing={1}>
                      {jobDetailData.recentApplicants.map((applicant: any) => (
                        <Box
                          key={applicant.id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            p: 2,
                            border: "1px solid #efeff0",
                            borderRadius: 2,
                          }}
                        >
                          <Avatar sx={{ bgcolor: "#ff8796" }}>
                            {applicant.veterinarian?.name?.charAt(0) || "?"}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: "medium" }}>
                              {applicant.veterinarian?.name || "이름 없음"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              지원일: {applicant.createdAt}
                            </Typography>
                          </Box>
                          <Chip
                            label={
                              applicant.status === "PENDING"
                                ? "대기"
                                : applicant.status === "ACCEPTED"
                                ? "승인"
                                : "거절"
                            }
                            size="small"
                            color={
                              applicant.status === "PENDING"
                                ? "warning"
                                : applicant.status === "ACCEPTED"
                                ? "success"
                                : "error"
                            }
                          />
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}
            </Box>
          ) : (
            <Typography>데이터를 찾을 수 없습니다.</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: "1px solid #efeff0" }}>
          <Button
            onClick={() => setDetailModalOpen(false)}
            variant="contained"
            sx={{
              bgcolor: "#ff8796",
              "&:hover": {
                bgcolor: "#ff7085",
              },
            }}
          >
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
