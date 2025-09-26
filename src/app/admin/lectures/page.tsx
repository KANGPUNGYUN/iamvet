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
  Edit,
  Pause,
  CloudUpload,
  AttachFile,
  PictureAsPdf,
  Description,
  TableChart,
} from "@mui/icons-material";
import { Tag } from "@/components/ui/Tag";
import { uploadImage, deleteImage } from "@/lib/s3";
import { isS3Url } from "@/lib/s3-client";

interface Lecture {
  id: string;
  title: string;
  description: string;
  category: string;
  videoUrl?: string;
  thumbnail?: string;
  viewCount: number;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
  instructor?: string;
  duration?: number;
  youtubeUrl?: string;
  isActive?: boolean;
  tags?: string[];
  referenceMaterials?: {
    id: string;
    name: string;
    type: "PDF" | "PPT" | "WORD" | "EXCEL";
    size: number;
    url: string;
  }[];
}

export default function LecturesManagement() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [actionType, setActionType] = useState<
    "view" | "activate" | "deactivate" | "edit" | "delete"
  >("view");
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newLecture, setNewLecture] = useState({
    title: "",
    instructor: "",
    category: "",
    youtubeUrl: "",
    description: "",
    referenceMaterials: [] as {
      id: string;
      name: string;
      type: "PDF" | "PPT" | "WORD" | "EXCEL";
      size: number;
      url: string;
    }[],
  });

  // 강의 목록 조회 함수
  const fetchLectures = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/lectures?limit=1000');
      const data = await response.json();
      
      if (data.status === 'success') {
        const lecturesData = data.data?.lectures?.data || [];
        const mappedLectures = lecturesData.map((lecture: any) => ({
          ...lecture,
          instructor: lecture.instructor || "강사명",
          youtubeUrl: lecture.videoUrl,
          isActive: !lecture.deletedAt,
          referenceMaterials: lecture.referenceMaterials || []
        }));
        setLectures(mappedLectures);
      } else {
        console.error('Failed to fetch lectures:', data.message);
        alert('강의 목록을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('Error fetching lectures:', error);
      alert('강의 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 강의 목록 조회
  useEffect(() => {
    fetchLectures();
  }, []);

  const getFileType = (
    fileName: string
  ): "PDF" | "PPT" | "WORD" | "EXCEL" | null => {
    const extension = fileName.toLowerCase().split(".").pop();
    switch (extension) {
      case "pdf":
        return "PDF";
      case "ppt":
      case "pptx":
        return "PPT";
      case "doc":
      case "docx":
        return "WORD";
      case "xls":
      case "xlsx":
        return "EXCEL";
      default:
        return null;
    }
  };

  const getFileIcon = (type: "PDF" | "PPT" | "WORD" | "EXCEL") => {
    switch (type) {
      case "PDF":
        return <PictureAsPdf sx={{ color: "#f44336" }} />;
      case "PPT":
        return <Description sx={{ color: "#ff9800" }} />;
      case "WORD":
        return <Description sx={{ color: "#2196f3" }} />;
      case "EXCEL":
        return <TableChart sx={{ color: "#4caf50" }} />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileType = getFileType(file.name);
        if (!fileType) {
          alert(`지원하지 않는 파일 형식입니다: ${file.name}`);
          return null;
        }

        // 파일 크기 제한 (10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert(`파일 크기는 10MB 이하로 선택해주세요: ${file.name}`);
          return null;
        }

        try {
          // S3에 파일 업로드
          const result = await uploadImage(file, 'lecture-materials');
          
          if (result.success && result.url) {
            return {
              id: `file_${Date.now()}_${Math.random()
                .toString(36)
                .substring(2, 11)}`,
              name: file.name,
              type: fileType,
              size: file.size,
              url: result.url,
            };
          } else {
            alert(`파일 업로드 실패: ${file.name} - ${result.error || '알 수 없는 오류'}`);
            return null;
          }
        } catch (uploadError) {
          console.error('File upload error:', uploadError);
          alert(`파일 업로드 중 오류 발생: ${file.name}`);
          return null;
        }
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      const validFiles = uploadedFiles.filter(Boolean) as {
        id: string;
        name: string;
        type: "PDF" | "PPT" | "WORD" | "EXCEL";
        size: number;
        url: string;
      }[];

      if (validFiles.length > 0) {
        setNewLecture((prev) => ({
          ...prev,
          referenceMaterials: [...prev.referenceMaterials, ...validFiles],
        }));
      }
    } catch (error) {
      console.error('File upload process error:', error);
      alert('파일 업로드 중 오류가 발생했습니다.');
    }

    // Reset the file input
    event.target.value = "";
  };

  const removeReferenceMaterial = async (fileId: string) => {
    const fileToRemove = newLecture.referenceMaterials.find(file => file.id === fileId);
    
    if (fileToRemove && isS3Url(fileToRemove.url)) {
      try {
        await deleteImage(fileToRemove.url);
      } catch (error) {
        console.error('Failed to delete file from S3:', error);
        // 에러가 발생해도 UI에서는 제거 (사용자 경험을 위해)
      }
    }
    
    setNewLecture((prev) => ({
      ...prev,
      referenceMaterials: prev.referenceMaterials.filter(
        (file) => file.id !== fileId
      ),
    }));
  };

  // YouTube URL이나 iframe에서 video ID를 추출하는 함수
  const extractYouTubeVideoId = (input: string): string | null => {
    if (!input) return null;

    // iframe 태그에서 src URL 추출
    const iframeMatch = input.match(/src=[\"']([^\"']+)[\"']/);
    if (iframeMatch) {
      input = iframeMatch[1];
    }

    // YouTube URL 패턴들
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match) return match[1];
    }

    return null;
  };

  // YouTube 비디오 ID에서 썸네일 URL을 생성하는 함수
  const getYouTubeThumbnail = (videoId: string): string => {
    // 고화질 썸네일 우선순위: maxresdefault > hqdefault > mqdefault > default
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const getStatusTag = (isActive: boolean | undefined) => {
    return (
      <Tag variant={isActive ? 2 : 1}>{isActive ? "활성화" : "비활성화"}</Tag>
    );
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

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "시간 미정";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  const filteredLectures = lectures.filter((lecture) => {
    const matchesSearch =
      lecture.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lecture.instructor || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "ALL" ||
      (filterStatus === "ACTIVE" && lecture.isActive === true) ||
      (filterStatus === "INACTIVE" && lecture.isActive !== true);
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
    action: "view" | "activate" | "deactivate" | "edit" | "delete"
  ) => {
    setSelectedLecture(lecture);
    setActionType(action);
    
    if (action === "edit" && lecture) {
      setNewLecture({
        title: lecture.title,
        instructor: lecture.instructor || "",
        category: lecture.category,
        youtubeUrl: lecture.youtubeUrl || "",
        description: lecture.description,
        referenceMaterials: lecture.referenceMaterials || [],
      });
    }
    
    setModalVisible(true);
  };

  const resetCreateForm = () => {
    setNewLecture({
      title: "",
      instructor: "",
      category: "",
      youtubeUrl: "",
      description: "",
      referenceMaterials: [],
    });
    setCreateModalVisible(false);
  };

  const confirmAction = async () => {
    if (!selectedLecture) return;

    try {
      switch (actionType) {
        case "activate":
        case "deactivate":
          // 활성화/비활성화는 실제 API가 없으므로 로컬 상태만 업데이트
          setLectures((prev) =>
            prev.map((lecture) => {
              if (lecture.id === selectedLecture.id) {
                return { ...lecture, isActive: actionType === "activate" };
              }
              return lecture;
            })
          );
          alert(`강의가 ${actionType === "activate" ? "활성화" : "비활성화"}되었습니다.`);
          break;

        case "delete":
          const response = await fetch(`/api/lectures/${selectedLecture.id}`, {
            method: "DELETE",
          });

          const data = await response.json();
          if (data.status === "success") {
            // 강의 목록 다시 불러오기
            await fetchLectures();
            alert("강의가 성공적으로 삭제되었습니다.");
          } else {
            alert(data.message || "강의 삭제에 실패했습니다.");
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.error("Action error:", error);
      alert("작업 중 오류가 발생했습니다.");
    }

    setModalVisible(false);
    setSelectedLecture(null);
  };

  const handleSaveLecture = async () => {
    console.log("newLecture 상태:", newLecture);
    console.log("제목:", newLecture.title);
    console.log("강사명:", newLecture.instructor);
    console.log("카테고리:", newLecture.category);
    
    if (!newLecture.title || !newLecture.instructor || !newLecture.category) {
      alert("제목, 강사명, 카테고리는 필수 필드입니다.");
      return;
    }

    // YouTube URL 검증
    const videoId = extractYouTubeVideoId(newLecture.youtubeUrl);
    if (newLecture.youtubeUrl && !videoId) {
      alert("유효한 유튜브 URL 또는 iframe 코드를 입력해 주세요.");
      return;
    }

    try {
      // 썸네일 URL 생성
      let thumbnailUrl = null;
      if (newLecture.youtubeUrl && videoId) {
        thumbnailUrl = getYouTubeThumbnail(videoId);
      }

      const isEdit = actionType === "edit" && selectedLecture;
      const url = isEdit ? `/api/lectures/${selectedLecture.id}` : '/api/lectures';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newLecture.title,
          instructor: newLecture.instructor,
          description: newLecture.description || "강의 설명이 입력되지 않았습니다.",
          category: newLecture.category,
          videoUrl: newLecture.youtubeUrl,
          thumbnail: thumbnailUrl,
          tags: [], // 필요에 따라 추가
        }),
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        if (isEdit) {
          // 수정 모드 - 전체 목록 다시 불러오기
          await fetchLectures();
          alert("강의가 성공적으로 수정되었습니다.");
          setModalVisible(false);
        } else {
          // 생성 모드 - 전체 목록 다시 불러오기
          await fetchLectures();
          alert("강의가 성공적으로 생성되었습니다.");
          setCreateModalVisible(false);
        }
        
        // 폼 초기화
        setNewLecture({
          title: "",
          instructor: "",
          category: "",
          youtubeUrl: "",
          description: "",
          referenceMaterials: [],
        });
        setSelectedLecture(null);
      } else {
        alert(result.message || `강의 ${isEdit ? '수정' : '생성'}에 실패했습니다.`);
      }
    } catch (error) {
      console.error("강의 저장 오류:", error);
      alert("강의 저장 중 오류가 발생했습니다.");
    }
  };

  const renderActionButtons = (lecture: Lecture) => (
    <ButtonGroup size="small">
      <Button variant="outlined" onClick={() => handleAction(lecture, "view")}>
        <Visibility />
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => handleAction(lecture, "edit")}
      >
        <Edit />
      </Button>
      {lecture.isActive ? (
        <Button
          variant="outlined"
          color="warning"
          onClick={() => handleAction(lecture, "deactivate")}
        >
          <Pause />
        </Button>
      ) : (
        <Button
          variant="outlined"
          color="success"
          onClick={() => handleAction(lecture, "activate")}
        >
          <PlayArrow />
        </Button>
      )}
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
          강의영상 관리
        </Typography>
        <Typography variant="body1" sx={{ color: "#4f5866" }}>
          강의영상을 효율적으로 관리하고 모니터링하세요.
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
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 41.66%" } }}>
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
            </Box>
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 20.83%" } }}>
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
                  <MenuItem value="ACTIVE">활성화</MenuItem>
                  <MenuItem value="INACTIVE">비활성화</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 20.83%" } }}>
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
            </Box>
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 16.66%" } }}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => setCreateModalVisible(true)}
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
                강의 생성
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
                    {lectures.filter((l) => l.isActive).length}
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
                    {lectures.filter((l) => !l.isActive).length}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4f5866",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    비활성화
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
                    {lectures.length}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4f5866",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    전체 강의
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
                    전체 강의 수
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
                  <TableCell colSpan={7} sx={{ textAlign: "center", py: 4 }}>
                    <Typography>강의 목록을 불러오는 중...</Typography>
                  </TableCell>
                </TableRow>
              ) : currentLectures.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: "center", py: 4 }}>
                    <Typography color="text.secondary">등록된 강의가 없습니다.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                currentLectures.map((lecture) => (
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
                      {lecture.instructor || "강사명"}
                    </Typography>
                  </TableCell>
                  <TableCell>{getCategoryTag(lecture.category)}</TableCell>
                  <TableCell>{getStatusTag(lecture.isActive)}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {lecture.viewCount.toLocaleString()}
                    </Typography>
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
                ))
              )}
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
          {actionType === "edit" && "강의 수정"}
          {actionType === "activate" && "강의 활성화"}
          {actionType === "deactivate" && "강의 비활성화"}
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
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}
                  >
                    <Box
                      sx={{
                        flex: { xs: "1 1 100%", md: "1 1 calc(50% - 8px)" },
                      }}
                    >
                      <Stack spacing={1}>
                        <Typography>
                          <strong>강사:</strong> {selectedLecture.instructor || "강사명"}
                        </Typography>
                        <Typography>
                          <strong>카테고리:</strong> {selectedLecture.category}
                        </Typography>
                        <Typography>
                          <strong>강의시간:</strong>{" "}
                          {formatDuration(selectedLecture.duration)}
                        </Typography>
                        {selectedLecture.youtubeUrl && (
                          <Typography>
                            <strong>동영상:</strong>{" "}
                            <a
                              href={
                                selectedLecture.youtubeUrl.startsWith("http")
                                  ? selectedLecture.youtubeUrl
                                  : `https://www.youtube.com/watch?v=${extractYouTubeVideoId(
                                      selectedLecture.youtubeUrl
                                    )}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "#ff8796",
                                textDecoration: "none",
                              }}
                            >
                              유튜브에서 보기
                            </a>
                          </Typography>
                        )}
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <strong>상태:</strong>
                          {getStatusTag(selectedLecture.isActive)}
                        </Box>
                      </Stack>
                    </Box>
                    <Box
                      sx={{
                        flex: { xs: "1 1 100%", md: "1 1 calc(50% - 8px)" },
                      }}
                    >
                      <Stack spacing={1}>
                        <Typography>
                          <strong>조회수:</strong>{" "}
                          {selectedLecture.viewCount.toLocaleString()}
                        </Typography>
                        <Typography>
                          <strong>등록일:</strong> {selectedLecture.createdAt}
                        </Typography>
                      </Stack>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      <strong>설명:</strong>
                    </Typography>
                    <Typography>{selectedLecture.description}</Typography>
                  </Box>

                  {/* YouTube 미리보기 */}
                  {selectedLecture.youtubeUrl && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        <strong>동영상 미리보기:</strong>
                      </Typography>
                      {(() => {
                        const videoId = extractYouTubeVideoId(
                          selectedLecture.youtubeUrl
                        );
                        if (videoId) {
                          return (
                            <Box
                              sx={{
                                position: "relative",
                                paddingBottom: "56.25%",
                                height: 0,
                                overflow: "hidden",
                                borderRadius: 2,
                                border: "1px solid #efeff0",
                              }}
                            >
                              <iframe
                                src={`https://www.youtube.com/embed/${videoId}`}
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  height: "100%",
                                  border: "none",
                                }}
                                allowFullScreen
                                title="YouTube video player"
                              />
                            </Box>
                          );
                        } else {
                          return (
                            <Box
                              sx={{
                                p: 2,
                                border: "1px solid #efeff0",
                                borderRadius: 2,
                                bgcolor: "#f9f9f9",
                              }}
                            >
                              <Typography color="text.secondary">
                                유효하지 않은 유튜브 URL입니다.
                              </Typography>
                            </Box>
                          );
                        }
                      })()}
                    </Box>
                  )}

                  {/* Reference Materials Display */}
                  {selectedLecture.referenceMaterials &&
                    selectedLecture.referenceMaterials.length > 0 && (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          <strong>참고자료:</strong>
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          {selectedLecture.referenceMaterials.map((file) => (
                            <Box
                              key={file.id}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                p: 2,
                                border: "1px solid #efeff0",
                                borderRadius: 2,
                                bgcolor: "#fafafa",
                                "&:hover": {
                                  bgcolor: "#f0f0f0",
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                {getFileIcon(file.type)}
                                <Box>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 500 }}
                                  >
                                    {file.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {formatFileSize(file.size)} • {file.type}
                                  </Typography>
                                </Box>
                              </Box>
                              <Button
                                size="small"
                                variant="outlined"
                                href={file.url}
                                target="_blank"
                                sx={{
                                  color: "#ff8796",
                                  borderColor: "#ff8796",
                                  "&:hover": {
                                    borderColor: "#ffb7b8",
                                    bgcolor: "#fff5f5",
                                  },
                                }}
                              >
                                <AttachFile sx={{ fontSize: 18, mr: 0.5 }} />
                                열기
                              </Button>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}
                </Box>
              )}

              {actionType === "activate" && (
                <Alert severity="success">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircle />
                    <Typography>
                      <strong>{selectedLecture.title}</strong> 강의를
                      활성화하시겠습니까?
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    활성화된 강의는 사용자에게 공개됩니다.
                  </Typography>
                </Alert>
              )}

              {actionType === "edit" && (
                <Stack spacing={3} sx={{ mt: 2 }}>
                  <TextField
                    label="강의 제목"
                    fullWidth
                    value={newLecture.title}
                    onChange={(e) =>
                      setNewLecture((prev) => ({ ...prev, title: e.target.value }))
                    }
                    required
                  />
                  <TextField
                    label="강사명"
                    fullWidth
                    value={newLecture.instructor}
                    onChange={(e) =>
                      setNewLecture((prev) => ({
                        ...prev,
                        instructor: e.target.value,
                      }))
                    }
                    required
                  />
                  <FormControl fullWidth required>
                    <InputLabel>카테고리</InputLabel>
                    <Select
                      value={newLecture.category}
                      label="카테고리"
                      onChange={(e) =>
                        setNewLecture((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                    >
                      <MenuItem value="영상진단">영상진단</MenuItem>
                      <MenuItem value="내과">내과</MenuItem>
                      <MenuItem value="외과">외과</MenuItem>
                      <MenuItem value="응급의학">응급의학</MenuItem>
                      <MenuItem value="기타">기타</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="유튜브 동영상 URL 또는 iframe 코드"
                    fullWidth
                    multiline
                    rows={4}
                    value={newLecture.youtubeUrl}
                    onChange={(e) =>
                      setNewLecture((prev) => ({
                        ...prev,
                        youtubeUrl: e.target.value,
                      }))
                    }
                  />
                  <TextField
                    label="강의 설명"
                    fullWidth
                    multiline
                    rows={4}
                    value={newLecture.description}
                    onChange={(e) =>
                      setNewLecture((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </Stack>
              )}

              {actionType === "deactivate" && (
                <Alert severity="warning">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Warning />
                    <Typography>
                      <strong>{selectedLecture.title}</strong> 강의를
                      비활성화하시겠습니까?
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    비활성화된 강의는 사용자에게 표시되지 않습니다.
                  </Typography>
                </Alert>
              )}

              {actionType === "delete" && (
                <Alert severity="error">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Warning />
                    <Typography>
                      <strong>{selectedLecture.title}</strong> 강의를
                      삭제하시겠습니까?
                    </Typography>
                  </Box>
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
          {actionType === "edit" && (
            <Button
              onClick={handleSaveLecture}
              variant="contained"
              sx={{
                bgcolor: "#ff8796",
                "&:hover": {
                  bgcolor: "#ffb7b8",
                },
              }}
            >
              수정 완료
            </Button>
          )}
          {(actionType === "activate" || actionType === "deactivate" || actionType === "delete") && (
            <Button
              onClick={confirmAction}
              color={actionType === "activate" ? "success" : actionType === "delete" ? "error" : "warning"}
              variant="contained"
            >
              {actionType === "activate" && "활성화"}
              {actionType === "deactivate" && "비활성화"}
              {actionType === "delete" && "삭제"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Create Lecture Modal */}
      <Dialog
        open={createModalVisible}
        onClose={resetCreateForm}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>새 강의 생성</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
            <TextField
              label="강의 제목"
              fullWidth
              value={newLecture.title}
              onChange={(e) =>
                setNewLecture((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />
            <TextField
              label="강사명"
              fullWidth
              value={newLecture.instructor}
              onChange={(e) =>
                setNewLecture((prev) => ({
                  ...prev,
                  instructor: e.target.value,
                }))
              }
              required
            />
            <FormControl fullWidth required>
              <InputLabel>카테고리</InputLabel>
              <Select
                value={newLecture.category}
                label="카테고리"
                onChange={(e) =>
                  setNewLecture((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
              >
                <MenuItem value="영상진단">영상진단</MenuItem>
                <MenuItem value="내과">내과</MenuItem>
                <MenuItem value="외과">외과</MenuItem>
                <MenuItem value="응급의학">응급의학</MenuItem>
                <MenuItem value="기타">기타</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="유튜브 동영상 URL 또는 iframe 코드"
              fullWidth
              multiline
              rows={4}
              value={newLecture.youtubeUrl}
              onChange={(e) =>
                setNewLecture((prev) => ({
                  ...prev,
                  youtubeUrl: e.target.value,
                }))
              }
              placeholder="다음 중 하나를 입력하세요:&#10;1. https://www.youtube.com/watch?v=VIDEO_ID&#10;2. https://youtu.be/VIDEO_ID&#10;3. <iframe src='https://www.youtube.com/embed/VIDEO_ID'></iframe>"
              helperText="유튜브 동영상 URL을 입력하거나 유튜브에서 제공하는 iframe 임베드 코드를 붙여넣으세요."
            />

            {/* 썸네일 미리보기 */}
            {newLecture.youtubeUrl && (() => {
              const videoId = extractYouTubeVideoId(newLecture.youtubeUrl);
              if (videoId) {
                const thumbnailUrl = getYouTubeThumbnail(videoId);
                return (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      썸네일 미리보기
                    </Typography>
                    <Box
                      sx={{
                        position: "relative",
                        display: "inline-block",
                        borderRadius: 2,
                        overflow: "hidden",
                        border: "1px solid #efeff0",
                        bgcolor: "#fafafa",
                      }}
                    >
                      <img
                        src={thumbnailUrl}
                        alt="유튜브 썸네일"
                        style={{
                          width: "200px",
                          height: "112px",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          // 고화질 썸네일이 없으면 기본 썸네일로 fallback
                          const target = e.target as HTMLImageElement;
                          if (target.src.includes('maxresdefault')) {
                            target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                          } else if (target.src.includes('hqdefault')) {
                            target.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
                          } else if (target.src.includes('mqdefault')) {
                            target.src = `https://img.youtube.com/vi/${videoId}/default.jpg`;
                          }
                        }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                      이 썸네일이 자동으로 저장됩니다
                    </Typography>
                  </Box>
                );
              }
              return null;
            })()}
            <TextField
              label="강의 설명"
              fullWidth
              multiline
              rows={4}
              value={newLecture.description}
              onChange={(e) =>
                setNewLecture((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="강의에 대한 자세한 설명을 입력해 주세요..."
            />

            {/* Reference Materials Upload */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                참고자료 (선택사항)
              </Typography>
              <Box
                sx={{
                  border: "2px dashed #efeff0",
                  borderRadius: 2,
                  p: 3,
                  textAlign: "center",
                  bgcolor: "#fafafa",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#ff8796",
                    bgcolor: "#fff5f5",
                  },
                }}
              >
                <input
                  accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx"
                  style={{ display: "none" }}
                  id="reference-materials-upload"
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                />
                <label htmlFor="reference-materials-upload">
                  <Box sx={{ cursor: "pointer" }}>
                    <CloudUpload
                      sx={{ fontSize: 48, color: "#ff8796", mb: 1 }}
                    />
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600, mb: 0.5 }}
                    >
                      클릭하여 참고자료 업로드
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      PDF, PPT, Word, Excel 파일을 지원합니다 (여러 파일 선택
                      가능)
                    </Typography>
                  </Box>
                </label>
              </Box>

              {/* Uploaded Files List */}
              {newLecture.referenceMaterials.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 600 }}
                  >
                    업로드된 파일 ({newLecture.referenceMaterials.length}개)
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {newLecture.referenceMaterials.map((file) => (
                      <Box
                        key={file.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          p: 2,
                          border: "1px solid #efeff0",
                          borderRadius: 2,
                          bgcolor: "white",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {getFileIcon(file.type)}
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              {file.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {formatFileSize(file.size)} • {file.type}
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => removeReferenceMaterial(file.id)}
                          sx={{ minWidth: "auto", p: 1 }}
                        >
                          <Delete sx={{ fontSize: 18 }} />
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetCreateForm} color="inherit">
            취소
          </Button>
          <Button
            onClick={handleSaveLecture}
            variant="contained"
            sx={{
              bgcolor: "#ff8796",
              "&:hover": {
                bgcolor: "#ffb7b8",
              },
            }}
          >
            강의 생성
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
