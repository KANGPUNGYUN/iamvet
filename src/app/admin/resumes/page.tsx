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
} from "@mui/material";
import {
  Search,
  Visibility,
  Block,
  CheckCircle,
  Cancel,
  Warning,
  Star,
  Work,
  School,
  LocationOn,
  Phone,
  Email,
} from "@mui/icons-material";
import { Tag } from "@/components/ui/Tag";

interface Resume {
  id: number;
  name: string;
  email: string;
  phone: string;
  title: string;
  experience: number;
  location: string;
  education: string;
  specialties: string[];
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING";
  verified: boolean;
  rating: number;
  reviewCount: number;
  viewCount: number;
  favoriteCount: number;
  createdAt: string;
  lastUpdated: string;
  profileImage?: string;
}

export default function ResumesManagement() {
  const [resumes, setResumes] = useState<Resume[]>([
    {
      id: 1,
      name: "김수의",
      email: "kim@example.com",
      phone: "010-1234-5678",
      title: "소동물 임상수의사",
      experience: 5,
      location: "서울특별시 강남구",
      education: "서울대학교 수의과대학",
      specialties: ["소동물내과", "응급처치", "수술"],
      status: "ACTIVE",
      verified: true,
      rating: 4.8,
      reviewCount: 24,
      viewCount: 1250,
      favoriteCount: 45,
      createdAt: "2024-01-15",
      lastUpdated: "2024-01-20",
    },
    {
      id: 2,
      name: "이진료",
      email: "lee@example.com",
      phone: "010-2345-6789",
      title: "대동물 수의사",
      experience: 8,
      location: "경기도 용인시",
      education: "건국대학교 수의과대학",
      specialties: ["대동물내과", "번식학", "영양학"],
      status: "ACTIVE",
      verified: true,
      rating: 4.9,
      reviewCount: 18,
      viewCount: 890,
      favoriteCount: 32,
      createdAt: "2024-01-10",
      lastUpdated: "2024-01-18",
    },
    {
      id: 3,
      name: "박외과",
      email: "park@example.com",
      phone: "010-3456-7890",
      title: "수의외과 전문의",
      experience: 12,
      location: "부산광역시 해운대구",
      education: "전북대학교 수의과대학",
      specialties: ["정형외과", "신경외과", "종양외과"],
      status: "SUSPENDED",
      verified: false,
      rating: 4.6,
      reviewCount: 41,
      viewCount: 2100,
      favoriteCount: 78,
      createdAt: "2024-01-05",
      lastUpdated: "2024-01-16",
    },
    {
      id: 4,
      name: "최영상",
      email: "choi@example.com",
      phone: "010-4567-8901",
      title: "영상진단 전문의",
      experience: 7,
      location: "대구광역시 중구",
      education: "경북대학교 수의과대학",
      specialties: ["방사선학", "CT", "MRI", "초음파"],
      status: "PENDING",
      verified: false,
      rating: 0,
      reviewCount: 0,
      viewCount: 0,
      favoriteCount: 0,
      createdAt: "2024-01-22",
      lastUpdated: "2024-01-22",
    },
    {
      id: 5,
      name: "정병리",
      email: "jung@example.com",
      phone: "010-5678-9012",
      title: "수의병리학 전문의",
      experience: 15,
      location: "광주광역시 북구",
      education: "전남대학교 수의과대학",
      specialties: ["조직병리", "세포병리", "부검"],
      status: "INACTIVE",
      verified: true,
      rating: 4.7,
      reviewCount: 33,
      viewCount: 1680,
      favoriteCount: 56,
      createdAt: "2023-12-28",
      lastUpdated: "2024-01-12",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterSpecialty, setFilterSpecialty] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [actionType, setActionType] = useState<"view" | "approve" | "suspend" | "activate" | "delete">("view");

  const itemsPerPage = 10;
  const specialties = ["ALL", "소동물내과", "대동물내과", "외과", "영상진단", "병리학", "응급처치"];

  const filteredResumes = resumes.filter((resume) => {
    const matchesSearch =
      resume.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || resume.status === filterStatus;
    const matchesSpecialty = filterSpecialty === "ALL" || 
      resume.specialties.some(spec => spec.includes(filterSpecialty));

    return matchesSearch && matchesStatus && matchesSpecialty;
  });

  const totalPages = Math.ceil(filteredResumes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentResumes = filteredResumes.slice(startIndex, startIndex + itemsPerPage);

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
    switch (status) {
      case "ACTIVE": return "활성";
      case "SUSPENDED": return "정지";
      case "PENDING": return "승인대기";
      case "INACTIVE": return "비활성";
      default: return status;
    }
  };

  const handleAction = (resume: Resume, action: typeof actionType) => {
    setSelectedResume(resume);
    setActionType(action);
    setModalVisible(true);
  };

  const handleConfirmAction = () => {
    if (!selectedResume) return;

    setResumes(prev =>
      prev.map(resume =>
        resume.id === selectedResume.id
          ? {
              ...resume,
              status: actionType === "approve" ? "ACTIVE" :
                      actionType === "suspend" ? "SUSPENDED" :
                      actionType === "activate" ? "ACTIVE" :
                      resume.status,
              lastUpdated: new Date().toISOString().split('T')[0]
            }
          : resume
      ).filter(resume => !(actionType === "delete" && resume.id === selectedResume.id))
    );

    setModalVisible(false);
    setSelectedResume(null);
  };

  const renderActionButtons = (resume: Resume) => (
    <ButtonGroup size="small">
      <Button variant="outlined" onClick={() => handleAction(resume, "view")}>
        <Visibility />
      </Button>
      {resume.status === "PENDING" && (
        <Button
          variant="outlined"
          color="success"
          onClick={() => handleAction(resume, "approve")}
        >
          <CheckCircle />
        </Button>
      )}
      {resume.status === "ACTIVE" && (
        <Button
          variant="outlined"
          color="warning"
          onClick={() => handleAction(resume, "suspend")}
        >
          <Block />
        </Button>
      )}
      {(resume.status === "SUSPENDED" || resume.status === "INACTIVE") && (
        <Button
          variant="outlined"
          color="success"
          onClick={() => handleAction(resume, "activate")}
        >
          <CheckCircle />
        </Button>
      )}
      <Button
        variant="outlined"
        color="error"
        onClick={() => handleAction(resume, "delete")}
      >
        <Cancel />
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
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
        {[
          { label: "전체", count: resumes.length, color: "var(--Keycolor1)" },
          { label: "활성", count: resumes.filter(r => r.status === "ACTIVE").length, color: "var(--Keycolor2)" },
          { label: "승인대기", count: resumes.filter(r => r.status === "PENDING").length, color: "var(--Keycolor3)" },
          { label: "정지", count: resumes.filter(r => r.status === "SUSPENDED").length, color: "var(--Keycolor1)" },
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
                  <MenuItem value="ALL">모든 상태</MenuItem>
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
                  {specialties.map((specialty) => (
                    <MenuItem key={specialty} value={specialty}>
                      {specialty === "ALL" ? "모든 분야" : specialty}
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
                {currentResumes.map((resume) => (
                  <TableRow
                    key={resume.id}
                    hover
                    sx={{ "&:hover": { bgcolor: "rgba(0, 0, 0, 0.02)" } }}
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
                    <TableCell>{renderActionButtons(resume)}</TableCell>
                  </TableRow>
                ))}
                {currentResumes.length === 0 && (
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
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Pagination
            count={totalPages}
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
            <Typography variant="body1" sx={{ color: "#3b394d" }}>
              {actionType === "approve" && `${selectedResume?.name} 수의사의 인재정보를 승인하시겠습니까?`}
              {actionType === "suspend" && `${selectedResume?.name} 수의사의 인재정보를 정지하시겠습니까?`}
              {actionType === "activate" && `${selectedResume?.name} 수의사의 인재정보를 활성화하시겠습니까?`}
              {actionType === "delete" && `${selectedResume?.name} 수의사의 인재정보를 영구삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
            </Typography>
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
              sx={{
                bgcolor: actionType === "delete" ? "var(--Keycolor1)" : "#ff8796",
                "&:hover": {
                  bgcolor: actionType === "delete" ? "#D32F2F" : "#ff8796",
                },
              }}
            >
              확인
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}