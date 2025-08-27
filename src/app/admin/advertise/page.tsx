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
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Chip,
  IconButton,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Search,
  Add,
  Edit,
  Delete,
  Visibility,
  Image,
  Link as LinkIcon,
  DateRange,
  TrendingUp,
  PlayArrow,
  Pause,
  Analytics,
  Upload,
} from "@mui/icons-material";
import { Tag } from "@/components/ui/Tag";

interface Advertisement {
  id: number;
  title: string;
  description: string;
  type: "HERO_BANNER" | "GENERAL_BANNER" | "SIDE_AD" | "AD_CARD";
  imageUrl?: string;
  linkUrl?: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  targetAudience: "ALL" | "VETERINARIANS" | "HOSPITALS";
  // Type-specific fields
  buttonText?: string; // For HERO_BANNER
  autoSlide?: boolean; // For HERO_BANNER
  autoSlideInterval?: number; // For HERO_BANNER
  variant?: "default" | "blue"; // For AD_CARD
  createdAt: string;
  updatedAt: string;
}

export default function AdvertiseManagement() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([
    {
      id: 1,
      title: "프리미엄 채용공고 광고",
      description: "채용공고를 더 많은 수의사에게 노출시키세요",
      type: "HERO_BANNER",
      imageUrl: "/banner1.jpg",
      linkUrl: "https://example.com/premium",
      buttonText: "확인하러 가기",
      autoSlide: true,
      autoSlideInterval: 5000,
      isActive: true,
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      targetAudience: "HOSPITALS",
      createdAt: "2024-01-14",
      updatedAt: "2024-01-20",
    },
    {
      id: 2,
      title: "수의사 교육 프로그램",
      description: "최신 수의학 지식을 습득하세요",
      type: "SIDE_AD",
      imageUrl: "/sidebar1.jpg",
      linkUrl: "https://example.com/education",
      isActive: true,
      startDate: "2024-01-10",
      endDate: "2024-03-10",
      targetAudience: "VETERINARIANS",
      createdAt: "2024-01-09",
      updatedAt: "2024-01-18",
    },
    {
      id: 3,
      title: "병원 장비 할인 이벤트",
      description: "최대 30% 할인된 가격으로 장비를 구입하세요",
      type: "GENERAL_BANNER",
      imageUrl: "/popup1.jpg",
      linkUrl: "https://example.com/equipment",
      isActive: false,
      startDate: "2024-01-20",
      endDate: "2024-02-20",
      targetAudience: "ALL",
      createdAt: "2024-01-19",
      updatedAt: "2024-01-19",
    },
    {
      id: 4,
      title: "가산점",
      description: "어떤 과목 선택도 부담없이!\n강의 들어 가산점으로 환산받자!",
      type: "AD_CARD",
      linkUrl: "https://example.com/franchise",
      variant: "default",
      isActive: true,
      startDate: "2024-01-05",
      endDate: "2024-04-05",
      targetAudience: "ALL",
      createdAt: "2024-01-04",
      updatedAt: "2024-01-16",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);
  const [actionType, setActionType] = useState<
    "view" | "edit" | "create" | "delete"
  >("view");
  const [formData, setFormData] = useState<Partial<Advertisement>>({
    title: "",
    description: "",
    type: "GENERAL_BANNER",
    linkUrl: "",
    isActive: true,
    startDate: "",
    endDate: "",
    targetAudience: "ALL",
  });

  const itemsPerPage = 10;

  const filteredAds = advertisements.filter((ad) => {
    const matchesSearch =
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "ALL" || ad.type === filterType;
    const matchesStatus =
      filterStatus === "ALL" ||
      (filterStatus === "ACTIVE" && ad.isActive) ||
      (filterStatus === "INACTIVE" && !ad.isActive) ||
      (filterStatus === "EXPIRED" && new Date(ad.endDate) < new Date()) ||
      (filterStatus === "SCHEDULED" && new Date(ad.startDate) > new Date());

    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredAds.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAds = filteredAds.slice(startIndex, startIndex + itemsPerPage);

  const getStatusVariant = (ad: Advertisement) => {
    const now = new Date();
    const start = new Date(ad.startDate);
    const end = new Date(ad.endDate);

    if (!ad.isActive) return 4;
    if (now < start) return 3;
    if (now > end) return 1;
    return 2;
  };

  const getStatusText = (ad: Advertisement) => {
    const now = new Date();
    const start = new Date(ad.startDate);
    const end = new Date(ad.endDate);

    if (!ad.isActive) return "비활성";
    if (now < start) return "예약됨";
    if (now > end) return "만료됨";
    return "활성";
  };

  const handleAction = (
    ad: Advertisement | null,
    action: typeof actionType
  ) => {
    setSelectedAd(ad);
    setActionType(action);
    if (action === "edit" && ad) {
      setFormData({
        title: ad.title,
        description: ad.description,
        type: ad.type,
        linkUrl: ad.linkUrl,
        isActive: ad.isActive,
        startDate: ad.startDate,
        endDate: ad.endDate,
        targetAudience: ad.targetAudience,
        buttonText: ad.buttonText,
        autoSlide: ad.autoSlide,
        autoSlideInterval: ad.autoSlideInterval,
        variant: ad.variant,
      });
    } else if (action === "create") {
      setFormData({
        title: "",
        description: "",
        type: "HERO_BANNER",
        linkUrl: "",
        isActive: true,
        startDate: "",
        endDate: "",
        targetAudience: "ALL",
        buttonText: "",
        autoSlide: true,
        autoSlideInterval: 5000,
        variant: "default",
      });
    }
    setModalVisible(true);
  };

  const handleSaveAd = () => {
    if (actionType === "create") {
      const newAd: Advertisement = {
        id: Math.max(...advertisements.map((a) => a.id)) + 1,
        title: formData.title!,
        description: formData.description!,
        type: formData.type!,
        linkUrl: formData.linkUrl,
        isActive: formData.isActive!,
        startDate: formData.startDate!,
        endDate: formData.endDate!,
        targetAudience: formData.targetAudience!,
        buttonText: formData.buttonText,
        autoSlide: formData.autoSlide,
        autoSlideInterval: formData.autoSlideInterval,
        variant: formData.variant,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      };
      setAdvertisements((prev) => [newAd, ...prev]);
    } else if (actionType === "edit" && selectedAd) {
      setAdvertisements((prev) =>
        prev.map((ad) =>
          ad.id === selectedAd.id
            ? {
                ...ad,
                title: formData.title!,
                description: formData.description!,
                type: formData.type!,
                linkUrl: formData.linkUrl,
                isActive: formData.isActive!,
                startDate: formData.startDate!,
                endDate: formData.endDate!,
                targetAudience: formData.targetAudience!,
                buttonText: formData.buttonText,
                autoSlide: formData.autoSlide,
                autoSlideInterval: formData.autoSlideInterval,
                variant: formData.variant,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : ad
        )
      );
    }

    setModalVisible(false);
    setSelectedAd(null);
  };

  const handleDeleteAd = () => {
    if (selectedAd) {
      setAdvertisements((prev) => prev.filter((ad) => ad.id !== selectedAd.id));
      setModalVisible(false);
      setSelectedAd(null);
    }
  };

  const handleToggleActive = (adId: number) => {
    setAdvertisements((prev) =>
      prev.map((ad) =>
        ad.id === adId
          ? {
              ...ad,
              isActive: !ad.isActive,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : ad
      )
    );
  };

  const renderActionButtons = (ad: Advertisement) => (
    <ButtonGroup size="small">
      <Button variant="outlined" onClick={() => handleAction(ad, "view")}>
        <Visibility />
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => handleAction(ad, "edit")}
      >
        <Edit />
      </Button>
      <Button
        variant="outlined"
        color={ad.isActive ? "warning" : "success"}
        onClick={() => handleToggleActive(ad.id)}
      >
        {ad.isActive ? <Pause /> : <PlayArrow />}
      </Button>
      <Button
        variant="outlined"
        color="error"
        onClick={() => handleAction(ad, "delete")}
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
            color: "var(--Text)",
            mb: 1,
            fontSize: { xs: "1.75rem", md: "2rem" },
          }}
        >
          광고배너 관리
        </Typography>
        <Typography variant="body1" sx={{ color: "var(--Subtext)" }}>
          사이트 광고 배너를 효율적으로 관리하고 성과를 모니터링하세요.
        </Typography>
      </Box>

      {/* Stats Summary */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
        {[
          {
            label: "전체",
            count: advertisements.length,
            color: "var(--Keycolor1)",
          },
          {
            label: "활성",
            count: advertisements.filter((a) => a.isActive).length,
            color: "var(--Keycolor2)",
          },
          {
            label: "비활성",
            count: advertisements.filter((a) => !a.isActive).length,
            color: "var(--Subtext2)",
          },
          {
            label: "만료",
            count: advertisements.filter(
              (a) => new Date(a.endDate) < new Date()
            ).length,
            color: "var(--Keycolor1)",
          },
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
                sx={{ fontWeight: 700, color: "var(--Text)", mb: 1 }}
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
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              alignItems: "center",
            }}
          >
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 41.66%" } }}>
              <TextField
                fullWidth
                placeholder="제목, 설명으로 검색..."
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
                        <Search
                          sx={{ color: "var(--Guidetext)", fontSize: 20 }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 20.83%" } }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: "var(--Subtext)" }}>유형</InputLabel>
                <Select
                  value={filterType}
                  label="유형"
                  onChange={(e) => setFilterType(e.target.value)}
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
                  <MenuItem value="ALL">모든 유형</MenuItem>
                  <MenuItem value="BANNER">배너</MenuItem>
                  <MenuItem value="POPUP">팝업</MenuItem>
                  <MenuItem value="SIDEBAR">사이드바</MenuItem>
                  <MenuItem value="INLINE">인라인</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 20.83%" } }}>
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
                  <MenuItem value="INACTIVE">비활성</MenuItem>
                  <MenuItem value="SCHEDULED">예약됨</MenuItem>
                  <MenuItem value="EXPIRED">만료됨</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: { xs: "1 1 100%", md: "none" } }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleAction(null, "create")}
                sx={{
                  borderRadius: 2,
                  bgcolor: "var(--Keycolor1)",
                  boxShadow: "0 4px 12px rgba(255, 135, 150, 0.3)",
                  "&:hover": {
                    bgcolor: "var(--Keycolor1)",
                    boxShadow: "0 6px 20px rgba(255, 135, 150, 0.4)",
                  },
                }}
              >
                새 광고
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Advertisements Table */}
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
                  borderBottom: "1px solid var(--Line)",
                  py: 2,
                },
              }}
            >
              <TableHead sx={{ bgcolor: "var(--Box_Light)" }}>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "var(--Subtext)",
                      fontSize: "0.875rem",
                    }}
                  >
                    광고 정보
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "var(--Subtext)",
                      fontSize: "0.875rem",
                    }}
                  >
                    유형
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "var(--Subtext)",
                      fontSize: "0.875rem",
                    }}
                  >
                    상태
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "var(--Subtext)",
                      fontSize: "0.875rem",
                    }}
                  >
                    기간
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "var(--Subtext)",
                      fontSize: "0.875rem",
                    }}
                  >
                    작업
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentAds.map((ad) => (
                  <TableRow
                    key={ad.id}
                    hover
                    sx={{ "&:hover": { bgcolor: "rgba(0, 0, 0, 0.02)" } }}
                  >
                    <TableCell>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            color: "var(--Text)",
                            mb: 0.5,
                          }}
                        >
                          {ad.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "var(--Subtext2)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            mb: 0.5,
                          }}
                        >
                          {ad.description}
                        </Typography>
                        {ad.linkUrl && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <LinkIcon
                              sx={{ fontSize: 14, color: "var(--Guidetext)" }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                color: "var(--Guidetext)",
                                textDecoration: "underline",
                                cursor: "pointer",
                              }}
                              onClick={() => window.open(ad.linkUrl, "_blank")}
                            >
                              {ad.linkUrl.length > 30
                                ? `${ad.linkUrl.substring(0, 30)}...`
                                : ad.linkUrl}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          ad.type === "HERO_BANNER"
                            ? "히어로 배너"
                            : ad.type === "GENERAL_BANNER"
                            ? "일반 배너"
                            : ad.type === "SIDE_AD"
                            ? "사이드 광고"
                            : "광고 카드"
                        }
                        size="small"
                        sx={{
                          bgcolor: "var(--Box_Light)",
                          color: "var(--Text)",
                          fontWeight: 500,
                          borderRadius: 2,
                          width: "fit-content",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Tag variant={getStatusVariant(ad)}>
                        {getStatusText(ad)}
                      </Tag>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "var(--Guidetext)",
                          display: "block",
                          mt: 0.5,
                        }}
                      >
                        {ad.targetAudience === "ALL"
                          ? "전체"
                          : ad.targetAudience === "VETERINARIANS"
                          ? "수의사"
                          : "병원"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "var(--Text)",
                            fontWeight: 500,
                            mb: 0.5,
                          }}
                        >
                          {ad.startDate}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "var(--Subtext2)" }}
                        >
                          ~ {ad.endDate}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{renderActionButtons(ad)}</TableCell>
                  </TableRow>
                ))}
                {currentAds.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: "center", py: 8 }}>
                      <Typography
                        variant="body1"
                        sx={{ color: "var(--Subtext2)" }}
                      >
                        검색 조건에 맞는 광고가 없습니다.
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
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, color: "var(--Text)" }}>
          {actionType === "view" && "광고 상세보기"}
          {actionType === "edit" && "광고 수정"}
          {actionType === "create" && "새 광고 등록"}
          {actionType === "delete" && "광고 삭제"}
        </DialogTitle>
        <DialogContent>
          {actionType === "view" && selectedAd ? (
            <Stack spacing={3} sx={{ mt: 2 }}>
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "var(--Text)", mb: 1 }}
                >
                  {selectedAd.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "var(--Text)", mb: 2 }}
                >
                  {selectedAd.description}
                </Typography>
                {selectedAd.imageUrl && (
                  <Box
                    sx={{
                      width: "100%",
                      height: 200,
                      bgcolor: "var(--Box_Light)",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <Image sx={{ fontSize: 48, color: "var(--Guidetext)" }} />
                    <Typography
                      variant="body2"
                      sx={{ color: "var(--Guidetext)", ml: 1 }}
                    >
                      광고 이미지
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, color: "var(--Subtext)", mb: 1 }}
                >
                  광고 정보
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2" sx={{ color: "var(--Text)" }}>
                    유형:{" "}
                    {selectedAd.type === "HERO_BANNER"
                      ? "히어로 배너"
                      : selectedAd.type === "GENERAL_BANNER"
                      ? "일반 배너"
                      : selectedAd.type === "SIDE_AD"
                      ? "사이드 광고"
                      : "광고 카드"}
                  </Typography>
                  {selectedAd.buttonText && (
                    <Typography variant="body2" sx={{ color: "var(--Text)" }}>
                      버튼 텍스트: {selectedAd.buttonText}
                    </Typography>
                  )}
                  {selectedAd.variant && (
                    <Typography variant="body2" sx={{ color: "var(--Text)" }}>
                      변형: {selectedAd.variant === "default" ? "기본" : "파란"}
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ color: "var(--Text)" }}>
                    대상:{" "}
                    {selectedAd.targetAudience === "ALL"
                      ? "전체"
                      : selectedAd.targetAudience === "VETERINARIANS"
                      ? "수의사"
                      : "병원"}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          ) : actionType === "create" || actionType === "edit" ? (
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="광고 제목"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--Keycolor1)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--Keycolor1)",
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                label="설명"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--Keycolor1)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--Keycolor1)",
                    },
                  },
                }}
              />

              <FormControl fullWidth>
                <InputLabel>광고 유형</InputLabel>
                <Select
                  value={formData.type}
                  label="광고 유형"
                  onChange={(e) => {
                    const newType = e.target.value as Advertisement["type"];
                    setFormData((prev) => ({
                      ...prev,
                      type: newType,
                      // Reset type-specific fields when type changes
                      buttonText:
                        newType === "HERO_BANNER" ? prev.buttonText : undefined,
                      autoSlide:
                        newType === "HERO_BANNER" ? prev.autoSlide : undefined,
                      autoSlideInterval:
                        newType === "HERO_BANNER"
                          ? prev.autoSlideInterval
                          : undefined,
                      variant: newType === "AD_CARD" ? prev.variant : undefined,
                    }));
                  }}
                >
                  <MenuItem value="HERO_BANNER">
                    히어로 배너 (BannerSlider)
                  </MenuItem>
                  <MenuItem value="GENERAL_BANNER">
                    일반 배너 (AdvertisementSlider)
                  </MenuItem>
                  <MenuItem value="SIDE_AD">사이드 광고 (Jobs 페이지)</MenuItem>
                  <MenuItem value="AD_CARD">광고 카드 (AdCard)</MenuItem>
                </Select>
              </FormControl>

              {/* Dynamic fields based on ad type */}
              {formData.type === "HERO_BANNER" && (
                <>
                  <TextField
                    fullWidth
                    label="버튼 텍스트"
                    value={formData.buttonText || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        buttonText: e.target.value,
                      }))
                    }
                    placeholder="예: '확인하러 가기'"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "var(--Keycolor1)",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "var(--Keycolor1)",
                        },
                      },
                    }}
                  />
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.autoSlide || false}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              autoSlide: e.target.checked,
                            }))
                          }
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "var(--Keycolor1)",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                              {
                                backgroundColor: "var(--Keycolor1)",
                              },
                          }}
                        />
                      }
                      label="자동 슬라이드"
                    />
                    {formData.autoSlide && (
                      <TextField
                        type="number"
                        label="슬라이드 간격 (ms)"
                        value={formData.autoSlideInterval || 5000}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            autoSlideInterval: Number(e.target.value),
                          }))
                        }
                        sx={{ minWidth: 200 }}
                      />
                    )}
                  </Box>
                </>
              )}

              {formData.type === "AD_CARD" && (
                <FormControl fullWidth>
                  <InputLabel>카드 변형</InputLabel>
                  <Select
                    value={formData.variant || "default"}
                    label="카드 변형"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        variant: e.target.value as "default" | "blue",
                      }))
                    }
                  >
                    <MenuItem value="default">기본 (초록색)</MenuItem>
                    <MenuItem value="blue">파란색</MenuItem>
                  </Select>
                </FormControl>
              )}

              <TextField
                fullWidth
                label="링크 URL"
                value={formData.linkUrl || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, linkUrl: e.target.value }))
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--Keycolor1)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--Keycolor1)",
                    },
                  },
                }}
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  sx={{ flex: 1 }}
                  type="date"
                  label="시작일"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  sx={{ flex: 1 }}
                  type="date"
                  label="종료일"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <FormControl sx={{ flex: 1 }}>
                  <InputLabel>대상</InputLabel>
                  <Select
                    value={formData.targetAudience}
                    label="대상"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        targetAudience: e.target
                          .value as Advertisement["targetAudience"],
                      }))
                    }
                  >
                    <MenuItem value="ALL">전체</MenuItem>
                    <MenuItem value="VETERINARIANS">수의사</MenuItem>
                    <MenuItem value="HOSPITALS">병원</MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isActive: e.target.checked,
                        }))
                      }
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "var(--Keycolor1)",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: "var(--Keycolor1)",
                          },
                      }}
                    />
                  }
                  label="활성"
                />
              </Box>
            </Stack>
          ) : actionType === "delete" ? (
            <Typography variant="body1" sx={{ color: "var(--Text)", mt: 2 }}>
              '{selectedAd?.title}' 광고를 삭제하시겠습니까? 이 작업은 되돌릴 수
              없습니다.
            </Typography>
          ) : null}
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
              onClick={actionType === "delete" ? handleDeleteAd : handleSaveAd}
              variant="contained"
              disabled={
                (actionType === "create" || actionType === "edit") &&
                (!formData.title ||
                  !formData.description ||
                  !formData.startDate ||
                  !formData.endDate)
              }
              sx={{
                bgcolor:
                  actionType === "delete"
                    ? "var(--Keycolor1)"
                    : "var(--Keycolor1)",
                "&:hover": {
                  bgcolor:
                    actionType === "delete"
                      ? "var(--Keycolor1)"
                      : "var(--Keycolor1)",
                },
              }}
            >
              {actionType === "create"
                ? "등록"
                : actionType === "edit"
                ? "수정"
                : "삭제"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
