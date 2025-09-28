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
  Avatar,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  Search,
  Visibility,
  Block,
  CheckCircle,
  Cancel,
  Star,
  Work,
  LocationOn,
  Phone,
  Email,
} from "@mui/icons-material";
import { Tag } from "@/components/ui/Tag";
import { 
  useAdminResumes, 
  useAdminResumeDetail, 
  useAdminResumeAction,
  type Resume 
} from "@/hooks/api/useAdminResumes";
import { mapStatus } from "@/lib/korean-mappings";

export default function ResumesManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [actionType, setActionType] = useState<"view" | "approve" | "suspend" | "activate" | "delete">("view");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailResumeId, setDetailResumeId] = useState<string | null>(null);
  const [actionReason, setActionReason] = useState("");

  // API hooks
  const {
    data: resumesData,
    isLoading,
    error,
    refetch,
  } = useAdminResumes({
    search: searchTerm,
    status: filterStatus || undefined,
    specialty: filterSpecialty || undefined,
    page: currentPage,
    limit: 10,
  });

  const {
    data: resumeDetailData,
    isLoading: detailLoading,
    error: detailError,
  } = useAdminResumeDetail(detailResumeId || "");

  const resumeActionMutation = useAdminResumeAction();

  const resumes = resumesData?.resumes || [];
  const pagination = resumesData?.pagination;
  const stats = resumesData?.stats;

  const specialties = ["소동물내과", "대동물내과", "외과", "영상진단", "병리학", "응급처치"];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "ACTIVE": return 2;
      case "SUSPENDED": return 1;
      case "PENDING": return 3;
      case "INACTIVE": return 4;
      default: return 2;
    }
  };

  const getStatusText = (status: string) => {
    return mapStatus(status) || status;
  };

  const handleAction = (resume: Resume, action: typeof actionType) => {
    setSelectedResume(resume);
    setActionType(action);
    if (action === "view") {
      setDetailResumeId(resume.id);
      setDetailModalOpen(true);
    } else {
      setModalVisible(true);
    }
  };

  const handleResumeClick = (resumeId: string) => {
    setDetailResumeId(resumeId);
    setDetailModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedResume || !actionType) return;

    if (actionType === "view") return;

    try {
      await resumeActionMutation.mutateAsync({
        resumeId: selectedResume.id,
        action: actionType === "approve" ? "approve" :
                actionType === "suspend" ? "suspend" :
                actionType === "activate" ? "activate" :
                actionType === "delete" ? "delete" : "verify",
        reason: actionReason || undefined,
      });

      setModalVisible(false);
      setSelectedResume(null);
      setActionType("view");
      setActionReason("");
      refetch();
    } catch (error) {
      console.error("Action failed:", error);
      alert(`작업 실패: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">
          이력서 데이터를 불러오는데 실패했습니다: {error.message}
        </Alert>
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
            color: "var(--Text)",
            mb: 1,
            fontSize: { xs: "1.75rem", md: "2rem" },
          }}
        >
          인재정보 관리
        </Typography>
        <Typography variant="body1" sx={{ color: "var(--Subtext)" }}>
          수의사 인재정보를 효율적으로 관리하고 검토하세요.
        </Typography>
      </Box>

      {/* Stats Summary */}
      {stats && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
          {[
            { label: "전체", count: stats.total, color: "var(--Keycolor1)" },
            { label: "활성", count: stats.active, color: "var(--Keycolor2)" },
            { label: "승인대기", count: stats.pending, color: "var(--Keycolor3)" },
            { label: "정지", count: stats.suspended, color: "var(--Keycolor1)" },
          ].map((stat, index) => (
            <Card
              key={index}
              sx={{
                flex: "1 1 200px",
                borderRadius: 4,
                border: "1px solid var(--Line)",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  bgcolor: stat.color,
                },
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 32px rgba(105, 140, 252, 0.15)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                bgcolor: "white",
              }}
            >
              <CardContent sx={{ p: 3, textAlign: "center" }}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "#3b394d", mb: 1 }}
                >
                  {stat.count}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "var(--Subtext)", fontWeight: 500 }}
                >
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Modern Filter Section */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          border: "1px solid var(--Line)",
          bgcolor: "var(--Box_Light)",
          boxShadow: "none",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 41.66%' } }}>
              <TextField
                fullWidth
                placeholder="이름, 제목, 이메일로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "white",
                    borderRadius: 2,
                    border: "1px solid var(--Line)",
                    "&:hover": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "var(--Keycolor1)",
                      },
                    },
                    "&.Mui-focused": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "var(--Keycolor1)",
                        borderWidth: 2,
                      },
                    },
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: "var(--Guidetext)", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 20.83%' } }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: "var(--Subtext)" }}>상태</InputLabel>
                <Select
                  value={filterStatus}
                  label="상태"
                  onChange={(e) => setFilterStatus(e.target.value)}
                  sx={{
                    bgcolor: "white",
                    borderRadius: 2,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--Line)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--Keycolor1)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--Keycolor1)",
                    },
                  }}
                >
                  <MenuItem value="">모든 상태</MenuItem>
                  <MenuItem value="ACTIVE">활성</MenuItem>
                  <MenuItem value="PENDING">승인대기</MenuItem>
                  <MenuItem value="SUSPENDED">정지</MenuItem>
                  <MenuItem value="INACTIVE">비활성</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 20.83%' } }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: "var(--Subtext)" }}>전문분야</InputLabel>
                <Select
                  value={filterSpecialty}
                  label="전문분야"
                  onChange={(e) => setFilterSpecialty(e.target.value)}
                  sx={{
                    bgcolor: "white",
                    borderRadius: 2,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--Line)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--Keycolor1)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--Keycolor1)",
                    },
                  }}
                >
                  <MenuItem value="">모든 분야</MenuItem>
                  {specialties.map((specialty) => (
                    <MenuItem key={specialty} value={specialty}>
                      {specialty}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Resumes Table */}
      <Card
        sx={{
          borderRadius: 4,
          border: "1px solid var(--Line)",
          boxShadow: "0 4px 20px rgba(105, 140, 252, 0.08)",
          mb: 4,
          bgcolor: "white",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table
              sx={{
                "& .MuiTableCell-root": {
                  borderBottom: "1px solid #f5f5f7",
                  py: 2,
                },
              }}
            >
              <TableHead sx={{ bgcolor: "#fafbfc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: "var(--Subtext)", fontSize: "0.875rem" }}>
                    수의사
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "var(--Subtext)", fontSize: "0.875rem" }}>
                    전문분야
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "var(--Subtext)", fontSize: "0.875rem" }}>
                    경력/지역
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "var(--Subtext)", fontSize: "0.875rem" }}>
                    평점/조회수
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "var(--Subtext)", fontSize: "0.875rem" }}>
                    상태
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "var(--Subtext)", fontSize: "0.875rem" }}>
                    작업
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resumes.map((resume) => (
                  <TableRow
                    key={resume.id}
                    hover
                    onClick={() => handleResumeClick(resume.id)}
                    sx={{ 
                      "&:hover": { bgcolor: "rgba(0, 0, 0, 0.02)" },
                      cursor: "pointer"
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                          src={resume.profileImage}
                          sx={{
                            width: 48,
                            height: 48,
                            bgcolor: "var(--Keycolor1)",
                            fontSize: "1.2rem",
                          }}
                        >
                          {resume.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600, color: "#3b394d" }}
                          >
                            {resume.name}
                            {resume.verified && (
                              <CheckCircle
                                sx={{ fontSize: 16, color: "var(--Keycolor2)", ml: 0.5 }}
                              />
                            )}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "var(--Subtext2)", fontWeight: 500 }}
                          >
                            {resume.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "var(--Guidetext)", display: "flex", alignItems: "center", gap: 0.5 }}
                          >
                            <Email sx={{ fontSize: 12 }} />
                            {resume.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                        {resume.specialties.slice(0, 2).map((specialty, index) => (
                          <Chip
                            key={index}
                            label={specialty}
                            size="small"
                            sx={{
                              bgcolor: "var(--Box_Light)",
                              color: "var(--Text)",
                              fontWeight: 500,
                              fontSize: "0.75rem",
                              borderRadius: 2,
                              mb: 0.5,
                            }}
                          />
                        ))}
                        {resume.specialties.length > 2 && (
                          <Chip
                            label={`+${resume.specialties.length - 2}`}
                            size="small"
                            sx={{
                              bgcolor: "#ffe5e5",
                              color: "#ff8796",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              borderRadius: 2,
                            }}
                          />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ color: "#3b394d", fontWeight: 500, display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}
                        >
                          <Work sx={{ fontSize: 14 }} />
                          {resume.experience}년 경력
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "var(--Subtext2)", display: "flex", alignItems: "center", gap: 0.5 }}
                        >
                          <LocationOn sx={{ fontSize: 14 }} />
                          {resume.location}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        {resume.rating > 0 && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                            <Star sx={{ fontSize: 16, color: "#FFB400" }} />
                            <Typography
                              variant="body2"
                              sx={{ color: "#3b394d", fontWeight: 600 }}
                            >
                              {resume.rating}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "var(--Subtext2)" }}
                            >
                              ({resume.reviewCount})
                            </Typography>
                          </Box>
                        )}
                        <Typography
                          variant="body2"
                          sx={{ color: "var(--Subtext2)" }}
                        >
                          조회 {resume.viewCount.toLocaleString()}회
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Tag variant={getStatusVariant(resume.status)}>
                        {getStatusText(resume.status)}
                      </Tag>
                    </TableCell>
                    <TableCell>
                      <ButtonGroup size="small">
                        <Button 
                          variant="outlined" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(resume, "view");
                          }}
                        >
                          <Visibility />
                        </Button>
                        {resume.status === "PENDING" && (
                          <Button
                            variant="outlined"
                            color="success"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction(resume, "approve");
                            }}
                          >
                            <CheckCircle />
                          </Button>
                        )}
                        {resume.status === "ACTIVE" && (
                          <Button
                            variant="outlined"
                            color="warning"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction(resume, "suspend");
                            }}
                          >
                            <Block />
                          </Button>
                        )}
                        {(resume.status === "SUSPENDED" || resume.status === "INACTIVE") && (
                          <Button
                            variant="outlined"
                            color="success"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction(resume, "activate");
                            }}
                          >
                            <CheckCircle />
                          </Button>
                        )}
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(resume, "delete");
                          }}
                        >
                          <Cancel />
                        </Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))}
                {resumes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: "center", py: 8 }}>
                      <Typography variant="body1" sx={{ color: "var(--Subtext2)" }}>
                        검색 조건에 맞는 인재정보가 없습니다.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Pagination
            count={pagination.totalPages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            size="large"
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: 2,
                "&.Mui-selected": {
                  bgcolor: "var(--Keycolor1)",
                  color: "white",
                  "&:hover": {
                    bgcolor: "var(--Keycolor1)",
                  },
                },
                "&:hover": {
                  bgcolor: "rgba(255, 135, 150, 0.04)",
                },
              },
            }}
          />
        </Box>
      )}

      {/* Action Modal */}
      <Dialog
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, color: "#3b394d" }}>
          {actionType === "view" && "인재정보 상세보기"}
          {actionType === "approve" && "승인 확인"}
          {actionType === "suspend" && "정지 확인"}
          {actionType === "activate" && "활성화 확인"}
          {actionType === "delete" && "삭제 확인"}
        </DialogTitle>
        <DialogContent>
          {actionType === "view" && selectedResume && (
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Avatar
                  src={selectedResume.profileImage}
                  sx={{ width: 80, height: 80, bgcolor: "var(--Keycolor1)" }}
                >
                  {selectedResume.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#3b394d" }}>
                    {selectedResume.name}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "var(--Subtext2)", mb: 1 }}>
                    {selectedResume.title}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Phone sx={{ fontSize: 14, color: "var(--Guidetext)" }} />
                    <Typography variant="body2" sx={{ color: "var(--Subtext2)" }}>
                      {selectedResume.phone}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "var(--Subtext)", mb: 1 }}>
                    학력
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#3b394d" }}>
                    {selectedResume.education}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "var(--Subtext)", mb: 1 }}>
                    전문분야
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {selectedResume.specialties.map((specialty, index) => (
                      <Chip
                        key={index}
                        label={specialty}
                        size="small"
                        sx={{
                          bgcolor: "var(--Box_Light)",
                          color: "var(--Text)",
                          fontWeight: 500,
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "var(--Subtext)", mb: 1 }}>
                    통계
                  </Typography>
                  <Box sx={{ display: "flex", gap: 3 }}>
                    <Typography variant="body2" sx={{ color: "#3b394d" }}>
                      조회수: {selectedResume.viewCount.toLocaleString()}회
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#3b394d" }}>
                      관심: {selectedResume.favoriteCount}개
                    </Typography>
                    {selectedResume.rating > 0 && (
                      <Typography variant="body2" sx={{ color: "#3b394d" }}>
                        평점: {selectedResume.rating}/5.0
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Stack>
            </Box>
          )}
          {actionType !== "view" && (
            <Box>
              <Typography variant="body1" sx={{ color: "#3b394d", mb: 2 }}>
                {actionType === "approve" && `${selectedResume?.name} 수의사의 인재정보를 승인하시겠습니까?`}
                {actionType === "suspend" && `${selectedResume?.name} 수의사의 인재정보를 정지하시겠습니까?`}
                {actionType === "activate" && `${selectedResume?.name} 수의사의 인재정보를 활성화하시겠습니까?`}
                {actionType === "delete" && `${selectedResume?.name} 수의사의 인재정보를 영구삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="사유 (선택사항)"
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="작업 사유를 입력하세요..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#f6f6f6',
                  },
                  '& .MuiInputLabel-root': {
                    color: '#4f5866',
                  }
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setModalVisible(false)}
            sx={{
              color: "var(--Subtext2)",
              "&:hover": { bgcolor: "rgba(108, 116, 129, 0.04)" },
            }}
          >
            {actionType === "view" ? "닫기" : "취소"}
          </Button>
          {actionType !== "view" && (
            <Button
              onClick={handleConfirmAction}
              variant="contained"
              disabled={resumeActionMutation.isPending}
              sx={{
                bgcolor: actionType === "delete" ? "var(--Keycolor1)" : "#ff8796",
                "&:hover": {
                  bgcolor: actionType === "delete" ? "#D32F2F" : "#ff8796",
                },
              }}
            >
              {resumeActionMutation.isPending ? "처리중..." : "확인"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Resume Detail Modal */}
      <Dialog
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        maxWidth="lg"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '12px',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          color: "#3b394d", 
          fontSize: "20px", 
          fontWeight: "bold",
          pb: 2,
          borderBottom: "1px solid #efeff0"
        }}>
          인재정보 상세보기
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {detailLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={40} sx={{ color: "#ff8796" }} />
            </Box>
          ) : detailError ? (
            <Alert severity="error">
              상세 정보를 불러오는 중 오류가 발생했습니다.
            </Alert>
          ) : resumeDetailData?.resume ? (
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Avatar
                  src={resumeDetailData.resume.profileImage}
                  sx={{ width: 80, height: 80, bgcolor: "var(--Keycolor1)" }}
                >
                  {resumeDetailData.resume.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#3b394d" }}>
                    {resumeDetailData.resume.name}
                    {resumeDetailData.resume.verified && (
                      <CheckCircle
                        sx={{ fontSize: 16, color: "var(--Keycolor2)", ml: 0.5 }}
                      />
                    )}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "var(--Subtext2)", mb: 1 }}>
                    {resumeDetailData.resume.title}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Phone sx={{ fontSize: 14, color: "var(--Guidetext)" }} />
                    <Typography variant="body2" sx={{ color: "var(--Subtext2)" }}>
                      {resumeDetailData.resume.phone}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Email sx={{ fontSize: 14, color: "var(--Guidetext)" }} />
                    <Typography variant="body2" sx={{ color: "var(--Subtext2)" }}>
                      {resumeDetailData.resume.email}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "var(--Subtext)", mb: 1 }}>
                    학력
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#3b394d" }}>
                    {resumeDetailData.resume.education}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "var(--Subtext)", mb: 1 }}>
                    전문분야
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {resumeDetailData.resume.specialties.map((specialty: string, index: number) => (
                      <Chip
                        key={index}
                        label={specialty}
                        size="small"
                        sx={{
                          bgcolor: "var(--Box_Light)",
                          color: "var(--Text)",
                          fontWeight: 500,
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "var(--Subtext)", mb: 1 }}>
                    경력 및 지역
                  </Typography>
                  <Box sx={{ display: "flex", gap: 3 }}>
                    <Typography variant="body2" sx={{ color: "#3b394d" }}>
                      경력: {resumeDetailData.resume.experience}년
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#3b394d" }}>
                      지역: {resumeDetailData.resume.location}
                    </Typography>
                  </Box>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "var(--Subtext)", mb: 1 }}>
                    통계
                  </Typography>
                  <Box sx={{ display: "flex", gap: 3 }}>
                    <Typography variant="body2" sx={{ color: "#3b394d" }}>
                      조회수: {resumeDetailData.resume.viewCount.toLocaleString()}회
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#3b394d" }}>
                      관심: {resumeDetailData.resume.favoriteCount}개
                    </Typography>
                    {resumeDetailData.resume.rating > 0 && (
                      <Typography variant="body2" sx={{ color: "#3b394d" }}>
                        평점: {resumeDetailData.resume.rating}/5.0 ({resumeDetailData.resume.reviewCount}개 리뷰)
                      </Typography>
                    )}
                  </Box>
                </Box>
                
                {resumeDetailData.resume.description && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "var(--Subtext)", mb: 1 }}>
                      소개
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#3b394d", lineHeight: 1.6 }}>
                      {resumeDetailData.resume.description}
                    </Typography>
                  </Box>
                )}
                
                {resumeDetailData.resume.careerHistory && resumeDetailData.resume.careerHistory.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "var(--Subtext)", mb: 2 }}>
                      경력 사항
                    </Typography>
                    <Stack spacing={1}>
                      {resumeDetailData.resume.careerHistory.map((career: any, index: number) => (
                        <Box 
                          key={index} 
                          sx={{ 
                            p: 2, 
                            border: "1px solid var(--Line)", 
                            borderRadius: 2,
                            bgcolor: "var(--Box_Light)"
                          }}
                        >
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#3b394d" }}>
                            {career.hospitalName} - {career.position}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "var(--Subtext)", mb: 1 }}>
                            {career.startDate} ~ {career.endDate || "현재"}
                          </Typography>
                          {career.description && (
                            <Typography variant="body2" sx={{ color: "#3b394d" }}>
                              {career.description}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Box>
          ) : (
            <Typography>데이터를 찾을 수 없습니다.</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: "1px solid #efeff0" }}>
          <Button
            onClick={() => setDetailModalOpen(false)}
            sx={{
              color: "#9098a4",
              backgroundColor: "#f6f6f6",
              borderRadius: "8px",
              px: 3,
              py: 1,
              '&:hover': {
                backgroundColor: "#efeff0",
              }
            }}
          >
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}