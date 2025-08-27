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
  Avatar,
  Chip,
} from "@mui/material";
import {
  Search,
  Visibility,
  Forum,
  Person,
  Comment,
  ThumbUp,
  Warning,
  TrendingUp,
  PlayArrow,
  Pause,
  Business,
} from "@mui/icons-material";
import { Tag } from "@/components/ui/Tag";

interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
    type: "VETERINARIAN" | "HOSPITAL";
    avatar?: string;
  };
  category:
    | "CLINICAL"
    | "TREATMENT"
    | "DIAGNOSIS"
    | "MEDICATION"
    | "SURGERY"
    | "GENERAL";
  isActive: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export default function ForumsManagement() {
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([
    {
      id: 1,
      title: "강아지 파보바이러스 감염 시 치료 프로토콜",
      content:
        "최근 파보바이러스 감염 케이스가 늘어나고 있습니다. 효과적인 치료 방법에 대해 논의해보고 싶습니다...",
      author: {
        id: 1,
        name: "김수의",
        type: "VETERINARIAN",
      },
      category: "TREATMENT",
      isActive: true,
      viewCount: 1205,
      likeCount: 34,
      commentCount: 18,
      createdAt: "2024-01-20",
      updatedAt: "2024-01-20",
      tags: ["파보바이러스", "감염", "치료"],
    },
    {
      id: 2,
      title: "고양이 만성 신부전 관리법",
      content: "고령 고양이의 만성 신부전 관리에 대한 경험을 공유합니다...",
      author: {
        id: 2,
        name: "박수의",
        type: "VETERINARIAN",
      },
      category: "CLINICAL",
      isActive: true,
      viewCount: 892,
      likeCount: 25,
      commentCount: 12,
      createdAt: "2024-01-19",
      updatedAt: "2024-01-19",
      tags: ["고양이", "신부전", "만성질환"],
    },
    {
      id: 3,
      title: "새로운 심장사상충 예방약 효과 분석",
      content:
        "최근 출시된 심장사상충 예방약의 효과에 대한 임상 데이터를 분석했습니다...",
      author: {
        id: 3,
        name: "서울동물병원",
        type: "HOSPITAL",
      },
      category: "MEDICATION",
      isActive: true,
      viewCount: 567,
      likeCount: 15,
      commentCount: 8,
      createdAt: "2024-01-18",
      updatedAt: "2024-01-18",
      tags: ["심장사상충", "예방약", "분석"],
    },
    {
      id: 4,
      title: "부적절한 내용이 포함된 게시물",
      content: "이 게시물은 부적절한 내용을 포함하고 있어 신고되었습니다...",
      author: {
        id: 4,
        name: "익명사용자",
        type: "VETERINARIAN",
      },
      category: "GENERAL",
      isActive: true,
      viewCount: 123,
      likeCount: 2,
      commentCount: 3,
      createdAt: "2024-01-17",
      updatedAt: "2024-01-17",
      tags: ["신고됨"],
    },
    {
      id: 5,
      title: "복강경 수술 기법 워크샵 후기",
      content:
        "지난 주 참석한 복강경 수술 워크샵에서 배운 내용을 정리해봤습니다...",
      author: {
        id: 5,
        name: "이수의",
        type: "VETERINARIAN",
      },
      category: "SURGERY",
      isActive: false,
      viewCount: 445,
      likeCount: 22,
      commentCount: 7,
      createdAt: "2024-01-16",
      updatedAt: "2024-01-16",
      tags: ["복강경", "수술", "워크샵"],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [actionType, setActionType] = useState<"view" | "toggle">("view");

  const getCategoryTag = (category: string) => {
    const categoryMap: {
      [key: string]: { variant: 1 | 2 | 3 | 4 | 5 | 6; text: string };
    } = {
      CLINICAL: { variant: 2, text: "임상" },
      TREATMENT: { variant: 3, text: "치료" },
      DIAGNOSIS: { variant: 4, text: "진단" },
      MEDICATION: { variant: 5, text: "약물" },
      SURGERY: { variant: 6, text: "수술" },
      GENERAL: { variant: 1, text: "일반" },
    };
    const categoryInfo = categoryMap[category] || {
      variant: 1 as const,
      text: category,
    };
    return <Tag variant={categoryInfo.variant}>{categoryInfo.text}</Tag>;
  };

  const getStatusTag = (isActive: boolean) => {
    return isActive ? (
      <Tag variant={2}>활성화</Tag>
    ) : (
      <Tag variant={6}>비활성화</Tag>
    );
  };

  // Filter posts based on search and filters
  const filteredPosts = forumPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      filterCategory === "ALL" || post.category === filterCategory;
    const matchesStatus =
      filterStatus === "ALL" ||
      (filterStatus === "ACTIVE" && post.isActive) ||
      (filterStatus === "INACTIVE" && !post.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  const handleAction = (post: ForumPost, action: "view" | "toggle") => {
    setSelectedPost(post);
    setActionType(action);
    setModalVisible(true);
  };

  const confirmAction = () => {
    if (!selectedPost) return;

    setForumPosts((prev) =>
      prev.map((post) => {
        if (post.id === selectedPost.id) {
          switch (actionType) {
            case "toggle":
              return { ...post, isActive: !post.isActive };
            default:
              return post;
          }
        }
        return post;
      })
    );

    setModalVisible(false);
    setSelectedPost(null);
  };

  const renderActionButtons = (post: ForumPost) => (
    <ButtonGroup size="small">
      <Button variant="outlined" onClick={() => handleAction(post, "view")}>
        <Visibility />
      </Button>
      <Button
        variant="outlined"
        color={post.isActive ? "warning" : "success"}
        onClick={() => handleAction(post, "toggle")}
      >
        {post.isActive ? <Pause /> : <PlayArrow />}
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
          임상포럼 관리
        </Typography>
        <Typography variant="body1" sx={{ color: "#4f5866" }}>
          임상포럼의 게시물을 효율적으로 관리하고 모니터링하세요.
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
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(40% - 12px)" } }}>
              <TextField
                fullWidth
                placeholder="제목, 작성자, 태그로 검색..."
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
                  <MenuItem value="CLINICAL">임상</MenuItem>
                  <MenuItem value="TREATMENT">치료</MenuItem>
                  <MenuItem value="DIAGNOSIS">진단</MenuItem>
                  <MenuItem value="MEDICATION">약물</MenuItem>
                  <MenuItem value="SURGERY">수술</MenuItem>
                  <MenuItem value="GENERAL">일반</MenuItem>
                </Select>
              </FormControl>
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
                  <MenuItem value="ACTIVE">활성화</MenuItem>
                  <MenuItem value="INACTIVE">비활성화</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(10% - 18px)" } }}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "#ff8796",
                  color: "white",
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(255, 135, 150, 0.3)",
                  "&:hover": {
                    bgcolor: "#ffb7b8",
                    boxShadow: "0 6px 16px rgba(255, 135, 150, 0.4)",
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
                background: "linear-gradient(90deg, #ff8796, #ffe5e5)",
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
                    {forumPosts.filter((p) => p.isActive).length}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4f5866",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    활성화된 포스트
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
                    활발한 활동
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
                  <Forum sx={{ fontSize: 28, color: "#ff8796" }} />
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
                    {forumPosts.filter((p) => !p.isActive).length}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4f5866",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    비활성화된 포스트
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
                    비활성 상태
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
                    {forumPosts.reduce((sum, p) => sum + p.commentCount, 0)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4f5866",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    총 댓글수
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
                    활발한 소통
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
                  <Comment sx={{ fontSize: 28, color: "#ff8796" }} />
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
                background: "linear-gradient(90deg, #ff8796, #ffe5e5)",
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
                    {forumPosts
                      .reduce((sum, p) => sum + p.viewCount, 0)
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
                    높은 관심도
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
                  <TrendingUp sx={{ fontSize: 28, color: "#ff8796" }} />
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
                포럼 게시물 목록
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#4f5866",
                  mt: 0.5,
                }}
              >
                총 {filteredPosts.length}개의 게시물
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
                  게시물 정보
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#3b394d",
                    fontSize: "0.875rem",
                    letterSpacing: "0.025em",
                  }}
                >
                  작성자
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
                  통계
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#3b394d",
                    fontSize: "0.875rem",
                    letterSpacing: "0.025em",
                  }}
                >
                  작성일
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
              {currentPosts.map((post) => (
                <TableRow
                  key={post.id}
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
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight="600"
                          sx={{
                            color: post.isActive
                              ? "text.primary"
                              : "text.secondary",
                            opacity: post.isActive ? 1 : 0.6,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {post.title}
                        </Typography>
                        {!post.isActive && (
                          <Chip
                            label="비활성"
                            size="small"
                            sx={{
                              bgcolor: "#f5f5f5",
                              color: "#666",
                              fontSize: "0.75rem",
                              height: 20,
                            }}
                          />
                        )}
                      </Box>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            sx={{
                              bgcolor: "#f5f5f5",
                              color: "#666",
                              fontSize: "0.75rem",
                              height: 20,
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar
                        sx={{
                          bgcolor:
                            post.author.type === "VETERINARIAN"
                              ? "#ff8796"
                              : "#ffb7b8",
                          width: 32,
                          height: 32,
                        }}
                      >
                        {post.author.type === "VETERINARIAN" ? (
                          <Person sx={{ fontSize: 18 }} />
                        ) : (
                          <Business sx={{ fontSize: 18 }} />
                        )}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="body2"
                          fontWeight="600"
                          sx={{ color: "text.primary" }}
                        >
                          {post.author.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {post.author.type === "VETERINARIAN"
                            ? "수의사"
                            : "병원"}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{getCategoryTag(post.category)}</TableCell>
                  <TableCell>{getStatusTag(post.isActive)}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Visibility sx={{ fontSize: 14, color: "#9098a4" }} />
                        <Typography variant="caption" color="text.secondary">
                          {post.viewCount.toLocaleString()}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <ThumbUp sx={{ fontSize: 14, color: "#9098a4" }} />
                        <Typography variant="caption" color="text.secondary">
                          {post.likeCount}
                        </Typography>
                        <Comment
                          sx={{ fontSize: 14, color: "#9098a4", ml: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {post.commentCount}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="#9098a4"
                      sx={{ fontSize: "0.875rem" }}
                    >
                      {post.createdAt}
                    </Typography>
                  </TableCell>
                  <TableCell>{renderActionButtons(post)}</TableCell>
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
          {actionType === "view" && "게시물 상세보기"}
          {actionType === "toggle" &&
            (selectedPost?.isActive ? "게시물 비활성화" : "게시물 활성화")}
        </DialogTitle>
        <DialogContent>
          {selectedPost && (
            <Box>
              {actionType === "view" && (
                <Stack spacing={3} sx={{ mt: 2 }}>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "#3b394d", mb: 1 }}
                    >
                      {selectedPost.title}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor:
                            selectedPost.author.type === "VETERINARIAN"
                              ? "#ff8796"
                              : "#ffb7b8",
                          width: 32,
                          height: 32,
                        }}
                      >
                        <Person />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="600">
                          {selectedPost.author.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {selectedPost.author.type === "VETERINARIAN"
                            ? "수의사"
                            : "병원"}{" "}
                          • {selectedPost.createdAt}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
                    >
                      {getCategoryTag(selectedPost.category)}
                      {getStatusTag(selectedPost.isActive)}
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{ color: "#3b394d", mb: 2, lineHeight: 1.7 }}
                    >
                      {selectedPost.content}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                        mb: 3,
                      }}
                    >
                      {selectedPost.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={`#${tag}`}
                          size="small"
                          variant="outlined"
                          sx={{ color: "#ff8796", borderColor: "#ff8796" }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", gap: 4 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, color: "#4f5866", mb: 1 }}
                      >
                        참여 통계
                      </Typography>
                      <Stack spacing={1}>
                        <Typography variant="body2" sx={{ color: "#3b394d" }}>
                          조회수: {selectedPost.viewCount.toLocaleString()}회
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#3b394d" }}>
                          좋아요: {selectedPost.likeCount}개
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#3b394d" }}>
                          댓글: {selectedPost.commentCount}개
                        </Typography>
                      </Stack>
                    </Box>
                  </Box>
                </Stack>
              )}

              {actionType === "toggle" && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" sx={{ color: "#3b394d" }}>
                    '{selectedPost.title}' 게시물을{" "}
                    {selectedPost.isActive ? "비활성화" : "활성화"}하시겠습니까?
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#4f5866", mt: 1 }}>
                    {selectedPost.isActive
                      ? "비활성화된 게시물은 사용자에게 노출되지 않습니다."
                      : "활성화된 게시물은 다시 사용자에게 노출됩니다."}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalVisible(false)} color="inherit">
            {actionType === "view" ? "닫기" : "취소"}
          </Button>
          {actionType !== "view" && (
            <Button
              onClick={confirmAction}
              color={
                actionType === "toggle"
                  ? selectedPost?.isActive
                    ? "warning"
                    : "success"
                  : "primary"
              }
              variant="contained"
            >
              {actionType === "toggle" &&
                (selectedPost?.isActive ? "비활성화" : "활성화")}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
