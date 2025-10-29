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
  Stack,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
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
  Delete,
} from "@mui/icons-material";
import { Tag } from "@/components/ui/Tag";

interface ForumPost {
  id: string;
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
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    totalViews: 0,
    totalComments: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPagesState, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [selectedPostDetail, setSelectedPostDetail] = useState<any>(null);
  const [actionType, setActionType] = useState<"view" | "toggle">("view");
  const [modalLoading, setModalLoading] = useState(false);
  const [deleteCommentLoading, setDeleteCommentLoading] = useState<string | null>(null);
  
  // 댓글 관리 상태 추가
  const [selectedForumComments, setSelectedForumComments] = useState<any[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  // API 호출 함수
  const fetchForums = async (
    page: number = currentPage,
    search: string = searchTerm,
    category: string = filterCategory,
    status: string = filterStatus
  ) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
      });

      if (search) params.append('search', search);
      if (category !== 'ALL') params.append('category', category);
      if (status !== 'ALL') params.append('status', status);

      const response = await fetch(`/api/admin/forums?${params}`);
      const result = await response.json();

      if (result.status === 'success') {
        setForumPosts(result.data.forums);
        setStats(result.data.stats);
        setTotalPages(result.data.pagination.totalPages);
        setTotalItems(result.data.pagination.total);
      } else {
        console.error('데이터 조회 실패:', result.message);
      }
    } catch (error) {
      console.error('API 호출 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 상세 정보 조회 함수
  const fetchForumDetail = async (forumId: string) => {
    try {
      setModalLoading(true);
      const response = await fetch(`/api/admin/forums/${forumId}`);
      const result = await response.json();

      if (result.status === 'success') {
        setSelectedPostDetail(result.data);
      } else {
        console.error('상세 정보 조회 실패:', result.message);
        setSelectedPostDetail(null);
      }
    } catch (error) {
      console.error('상세 정보 조회 API 호출 실패:', error);
      setSelectedPostDetail(null);
    } finally {
      setModalLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchForums();
  }, []);

  // 검색/필터 변경 시 데이터 새로고침
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchForums(1, searchTerm, filterCategory, filterStatus);
    }, 500); // 500ms 디바운스

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterCategory, filterStatus]);

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

  // 서버 사이드 페이지네이션을 사용하므로 클라이언트 필터링 제거
  const currentPosts = forumPosts;

  // 액션 API 호출 함수
  const executeAction = async (postId: string, action: "activate" | "deactivate") => {
    try {
      const response = await fetch(`/api/admin/forums/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: action,
          reason: action === 'activate' ? '관리자 활성화' : '관리자 비활성화',
        }),
      });

      const result = await response.json();
      if (result.status !== 'success') {
        throw new Error(result.message);
      }

      // 성공 시 데이터 새로고침
      await fetchForums();
      
      return true;
    } catch (error) {
      console.error('액션 실행 실패:', error);
      return false;
    }
  };

  const handleAction = (post: ForumPost, action: "view" | "toggle") => {
    setSelectedPost(post);
    setActionType(action);
    setModalVisible(true);
    
    // 상세보기인 경우 추가 정보 로드
    if (action === "view") {
      fetchForumDetail(post.id);
      fetchForumComments(post.id);
    }
  };

  const confirmAction = async () => {
    if (!selectedPost) return;

    if (actionType === "toggle") {
      const action = selectedPost.isActive ? "deactivate" : "activate";
      const success = await executeAction(selectedPost.id, action);
      
      if (success) {
        setModalVisible(false);
        setSelectedPost(null);
        setSelectedPostDetail(null);
      } else {
        alert('작업 실행 중 오류가 발생했습니다.');
      }
    }
  };

  // 포럼 댓글 조회 함수
  const fetchForumComments = async (forumId: string) => {
    try {
      setCommentsLoading(true);
      const response = await fetch(`/api/forums/${forumId}/comments`);
      const result = await response.json();

      if (result.status === 'success') {
        setSelectedForumComments(result.data || []);
        console.log('getForumComments: Found', result.data?.length || 0, 'comments');
      } else {
        console.error('댓글 조회 실패:', result.message);
        setSelectedForumComments([]);
      }
    } catch (error) {
      console.error('댓글 조회 오류:', error);
      setSelectedForumComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  // 댓글 삭제 함수
  const handleDeleteComment = async (forumId: string, commentId: string, authorName: string) => {
    if (!confirm(`"${authorName}"님의 댓글을 삭제하시겠습니까?\n삭제된 댓글은 복구할 수 없으며, 작성자에게 알림이 전송됩니다.`)) {
      return;
    }

    setDeleteCommentLoading(commentId);
    
    try {
      const response = await fetch(`/api/admin/forums/${forumId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.status === 'success') {
        alert(`댓글이 삭제되었습니다. ${result.data.notificationsSent}명에게 알림이 발송되었습니다.`);
        // 댓글 목록 다시 로드
        fetchForumComments(forumId);
      } else {
        alert(result.message || '댓글 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('댓글 삭제 오류:', error);
      alert('댓글 삭제 중 오류가 발생했습니다.');
    } finally {
      setDeleteCommentLoading(null);
    }
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
        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 12px)", md: "1 1 calc(25% - 18px)" } }}>
          <Card sx={{ position: "relative", bgcolor: "white", border: "1px solid #efeff0", borderRadius: 4, overflow: "hidden" }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: "#3b394d", mb: 0.5, fontSize: "2rem" }}>
                    {stats.active}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#4f5866", fontWeight: 600, mb: 2 }}>
                    활성화된 포스트
                  </Typography>
                </Box>
                <Box sx={{ width: 60, height: 60, borderRadius: 3, background: "linear-gradient(135deg, #ffe5e5 0%, #ffd3d3 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Forum sx={{ fontSize: 28, color: "#ff8796" }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        
        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 12px)", md: "1 1 calc(25% - 18px)" } }}>
          <Card sx={{ position: "relative", bgcolor: "white", border: "1px solid #efeff0", borderRadius: 4, overflow: "hidden" }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: "#3b394d", mb: 0.5, fontSize: "2rem" }}>
                    {stats.inactive}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#4f5866", fontWeight: 600, mb: 2 }}>
                    비활성화된 포스트
                  </Typography>
                </Box>
                <Box sx={{ width: 60, height: 60, borderRadius: 3, background: "linear-gradient(135deg, #fff7f7 0%, #ffe5e5 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Warning sx={{ fontSize: 28, color: "#ff8796" }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        
        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 12px)", md: "1 1 calc(25% - 18px)" } }}>
          <Card sx={{ position: "relative", bgcolor: "white", border: "1px solid #efeff0", borderRadius: 4, overflow: "hidden" }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: "#3b394d", mb: 0.5, fontSize: "2rem" }}>
                    {stats.totalComments}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#4f5866", fontWeight: 600, mb: 2 }}>
                    총 댓글수
                  </Typography>
                </Box>
                <Box sx={{ width: 60, height: 60, borderRadius: 3, background: "linear-gradient(135deg, #fff7f7 0%, #ffe5e5 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Comment sx={{ fontSize: 28, color: "#ff8796" }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        
        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 12px)", md: "1 1 calc(25% - 18px)" } }}>
          <Card sx={{ position: "relative", bgcolor: "white", border: "1px solid #efeff0", borderRadius: 4, overflow: "hidden" }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: "#3b394d", mb: 0.5, fontSize: "2rem" }}>
                    {stats.totalViews.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#4f5866", fontWeight: 600, mb: 2 }}>
                    총 조회수
                  </Typography>
                </Box>
                <Box sx={{ width: 60, height: 60, borderRadius: 3, background: "linear-gradient(135deg, #ffe5e5 0%, #ffd3d3 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <TrendingUp sx={{ fontSize: 28, color: "#ff8796" }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Ultra Modern Data Table */}
      <Card sx={{ borderRadius: 4, border: "1px solid #efeff0", boxShadow: "0 4px 24px rgba(105, 140, 252, 0.08)", overflow: "hidden" }}>
        <Box sx={{ p: 3, bgcolor: "white", borderBottom: "1px solid #efeff0" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#3b394d", fontSize: "1.25rem" }}>
                포럼 게시물 목록
              </Typography>
              <Typography variant="body2" sx={{ color: "#4f5866", mt: 0.5 }}>
                총 {totalItems}개의 게시물
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <TableContainer>
          <Table sx={{ "& .MuiTableCell-root": { borderBottom: "1px solid #efeff0", py: 2 } }}>
            <TableHead sx={{ bgcolor: "#fafafa" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: "#3b394d", fontSize: "0.875rem" }}>게시물 정보</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#3b394d", fontSize: "0.875rem" }}>작성자</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#3b394d", fontSize: "0.875rem" }}>카테고리</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#3b394d", fontSize: "0.875rem" }}>상태</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#3b394d", fontSize: "0.875rem" }}>통계</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#3b394d", fontSize: "0.875rem" }}>작성일</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#3b394d", fontSize: "0.875rem" }}>액션</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography>데이터를 불러오는 중...</Typography>
                  </TableCell>
                </TableRow>
              ) : currentPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography>검색 결과가 없습니다.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                currentPosts.map((post) => (
                  <TableRow key={post.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="600" sx={{ color: post.isActive ? "text.primary" : "text.secondary", opacity: post.isActive ? 1 : 0.6 }}>
                          {post.title}
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                          {post.tags.slice(0, 3).map((tag: string, index: number) => (
                            <Chip key={index} label={tag} size="small" sx={{ bgcolor: "#f5f5f5", color: "#666", fontSize: "0.75rem", height: 20 }} />
                          ))}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar sx={{ bgcolor: post.author.type === "VETERINARIAN" ? "#ff8796" : "#ffb7b8", width: 32, height: 32 }}>
                          {post.author.type === "VETERINARIAN" ? <Person sx={{ fontSize: 18 }} /> : <Business sx={{ fontSize: 18 }} />}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="600">{post.author.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{post.author.type === "VETERINARIAN" ? "수의사" : "병원"}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{getCategoryTag(post.category)}</TableCell>
                    <TableCell>{getStatusTag(post.isActive)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Visibility sx={{ fontSize: 14, color: "#9098a4" }} />
                          <Typography variant="caption">{post.viewCount.toLocaleString()}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <ThumbUp sx={{ fontSize: 14, color: "#9098a4" }} />
                          <Typography variant="caption">{post.likeCount}</Typography>
                          <Comment sx={{ fontSize: 14, color: "#9098a4", ml: 1 }} />
                          <Typography variant="caption">{post.commentCount}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="#9098a4">{post.createdAt}</Typography>
                    </TableCell>
                    <TableCell>{renderActionButtons(post)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modern Pagination */}
        {totalPagesState > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3, bgcolor: "#fafafa", borderTop: "1px solid #efeff0" }}>
            <Pagination
              count={totalPagesState}
              page={currentPage}
              onChange={(_, page) => {
                setCurrentPage(page);
                fetchForums(page, searchTerm, filterCategory, filterStatus);
              }}
              sx={{
                "& .MuiPaginationItem-root": {
                  borderRadius: 2,
                  fontWeight: 500,
                  color: "#4f5866",
                  "&.Mui-selected": { bgcolor: "#ff8796", color: "white" },
                  "&:hover": { bgcolor: "#ffe5e5" },
                },
              }}
            />
          </Box>
        )}
      </Card>

      {/* Action Modal */}
      <Dialog open={modalVisible} onClose={() => setModalVisible(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {actionType === "view" && "게시물 상세보기"}
          {actionType === "toggle" && (selectedPost?.isActive ? "게시물 비활성화" : "게시물 활성화")}
        </DialogTitle>
        <DialogContent>
          {selectedPost && (
            <Box>
              {actionType === "view" && (
                <Box>
                  {modalLoading ? (
                    <Typography>상세 정보를 불러오는 중...</Typography>
                  ) : selectedPostDetail ? (
                    <Stack spacing={3} sx={{ mt: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: "#3b394d", mb: 1 }}>
                          {selectedPostDetail.title}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                          <Avatar sx={{ bgcolor: selectedPostDetail.author.type === "VETERINARIAN" ? "#ff8796" : "#ffb7b8", width: 32, height: 32 }}>
                            <Person />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="600">{selectedPostDetail.author.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {selectedPostDetail.author.type === "VETERINARIAN" ? "수의사" : "병원"} • {selectedPostDetail.createdAt}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#4f5866", mb: 1 }}>
                            포럼 내용
                          </Typography>
                          <Box 
                            sx={{ 
                              bgcolor: "#f8f9fa", 
                              border: "1px solid #e9ecef",
                              borderRadius: 2, 
                              p: 2,
                              maxHeight: 300,
                              overflow: "auto"
                            }}
                          >
                            <div 
                              dangerouslySetInnerHTML={{ __html: selectedPostDetail.content }}
                              style={{ 
                                color: "#3b394d", 
                                lineHeight: 1.7,
                                fontSize: "14px"
                              }}
                            />
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", gap: 4, mb: 3 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#4f5866", mb: 1 }}>
                              참여 통계
                            </Typography>
                            <Stack spacing={1}>
                              <Typography variant="body2">조회수: {selectedPostDetail.viewCount.toLocaleString()}회</Typography>
                              <Typography variant="body2">좋아요: {selectedPostDetail.likeCount}개</Typography>
                              <Typography variant="body2">댓글: {selectedPostDetail.commentCount}개</Typography>
                            </Stack>
                          </Box>
                        </Box>
                        
                        {/* 댓글 섹션 */}
                        <Box sx={{ mt: 3 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            <strong>댓글 관리:</strong>
                          </Typography>
                          {commentsLoading ? (
                            <Typography>댓글을 불러오는 중...</Typography>
                          ) : selectedForumComments.length === 0 ? (
                            <Typography color="text.secondary">
                              등록된 댓글이 없습니다.
                            </Typography>
                          ) : (
                            <Box
                              sx={{
                                maxHeight: 400,
                                overflow: "auto",
                                border: "1px solid #efeff0",
                                borderRadius: 2,
                                p: 2,
                                bgcolor: "#fafafa",
                              }}
                            >
                              {selectedForumComments.map((comment: any) => (
                                <Box key={comment.id}>
                                  <Box
                                    sx={{
                                      bgcolor: "white",
                                      border: "1px solid #e9ecef",
                                      borderRadius: 1,
                                      p: 1.5,
                                      mb: 1,
                                      fontSize: "13px",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        mb: 0.5,
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 1,
                                        }}
                                      >
                                        <Avatar
                                          sx={{
                                            bgcolor:
                                              (comment.userType || comment.user?.type) === "VETERINARIAN"
                                                ? "#ff8796"
                                                : (comment.userType || comment.user?.type) === "HOSPITAL"
                                                ? "#ffb7b8"
                                                : "#9098a4",
                                            width: 20,
                                            height: 20,
                                          }}
                                        >
                                          {(comment.userType || comment.user?.type) === "VETERINARIAN" ? (
                                            <Person sx={{ fontSize: 12 }} />
                                          ) : (comment.userType || comment.user?.type) === "HOSPITAL" ? (
                                            <Business sx={{ fontSize: 12 }} />
                                          ) : (
                                            <Person sx={{ fontSize: 12 }} />
                                          )}
                                        </Avatar>
                                        <Typography
                                          variant="caption"
                                          fontWeight="600"
                                        >
                                          {comment.author_name || comment.author_display_name || comment.user?.name || comment.user?.nickName || "알 수 없는 사용자"}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                        >
                                          • {comment.createdAt}
                                        </Typography>
                                      </Box>
                                      <Button
                                        size="small"
                                        color="error"
                                        disabled={deleteCommentLoading === comment.id}
                                        onClick={() =>
                                          handleDeleteComment(
                                            selectedPost?.id || '',
                                            comment.id,
                                            comment.author_name || comment.author_display_name || comment.user?.name || comment.user?.nickName || "알 수 없는 사용자"
                                          )
                                        }
                                        sx={{ minWidth: "auto", p: 0.5 }}
                                      >
                                        <Delete sx={{ fontSize: 16 }} />
                                      </Button>
                                    </Box>
                                    <Typography
                                      variant="body2"
                                      sx={{ color: "#3b394d", fontSize: "12px" }}
                                    >
                                      {comment.content}
                                    </Typography>
                                  </Box>
                                  {comment.replies && comment.replies.length > 0 && (
                                    <Box sx={{ ml: 3 }}>
                                      {comment.replies.map((reply: any) => (
                                        <Box
                                          key={reply.id}
                                          sx={{
                                            bgcolor: "#fefefe",
                                            border: "1px solid #e9ecef",
                                            borderRadius: 1,
                                            p: 1.5,
                                            mb: 1,
                                            fontSize: "12px",
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "space-between",
                                              mb: 0.5,
                                            }}
                                          >
                                            <Box
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                              }}
                                            >
                                              <Avatar
                                                sx={{
                                                  bgcolor:
                                                    (reply.userType || reply.user?.type) ===
                                                    "VETERINARIAN"
                                                      ? "#ff8796"
                                                      : (reply.userType || reply.user?.type) ===
                                                        "HOSPITAL"
                                                      ? "#ffb7b8"
                                                      : "#9098a4",
                                                  width: 18,
                                                  height: 18,
                                                }}
                                              >
                                                {(reply.userType || reply.user?.type) ===
                                                "VETERINARIAN" ? (
                                                  <Person sx={{ fontSize: 10 }} />
                                                ) : (reply.userType || reply.user?.type) ===
                                                  "HOSPITAL" ? (
                                                  <Business sx={{ fontSize: 10 }} />
                                                ) : (
                                                  <Person sx={{ fontSize: 10 }} />
                                                )}
                                              </Avatar>
                                              <Typography
                                                variant="caption"
                                                fontWeight="600"
                                                fontSize="11px"
                                              >
                                                └{" "}
                                                {reply.author_name || reply.author_display_name || reply.user?.name || reply.user?.nickName || "알 수 없는 사용자"}
                                              </Typography>
                                              <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                fontSize="11px"
                                              >
                                                • {reply.createdAt}
                                              </Typography>
                                            </Box>
                                            <Button
                                              size="small"
                                              color="error"
                                              disabled={
                                                deleteCommentLoading === reply.id
                                              }
                                              onClick={() =>
                                                handleDeleteComment(
                                                  selectedPost?.id || '',
                                                  reply.id,
                                                  reply.author_name || reply.author_display_name || reply.user?.name || reply.user?.nickName || "알 수 없는 사용자"
                                                )
                                              }
                                              sx={{ minWidth: "auto", p: 0.5 }}
                                            >
                                              <Delete sx={{ fontSize: 14 }} />
                                            </Button>
                                          </Box>
                                          <Typography
                                            variant="body2"
                                            sx={{
                                              color: "#3b394d",
                                              fontSize: "11px",
                                              ml: 2,
                                            }}
                                          >
                                            {reply.content}
                                          </Typography>
                                        </Box>
                                      ))}
                                    </Box>
                                  )}
                                </Box>
                              ))}
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Stack>
                  ) : (
                    <Typography>상세 정보를 불러올 수 없습니다.</Typography>
                  )}
                </Box>
              )}

              {actionType === "toggle" && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" sx={{ color: "#3b394d" }}>
                    '{selectedPost.title}' 게시물을 {selectedPost.isActive ? "비활성화" : "활성화"}하시겠습니까?
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
          <Button 
            onClick={() => {
              setModalVisible(false);
              setSelectedPostDetail(null);
            }} 
            color="inherit"
          >
            {actionType === "view" ? "닫기" : "취소"}
          </Button>
          {actionType !== "view" && (
            <Button
              onClick={confirmAction}
              color={actionType === "toggle" ? (selectedPost?.isActive ? "warning" : "success") : "primary"}
              variant="contained"
            >
              {actionType === "toggle" && (selectedPost?.isActive ? "비활성화" : "활성화")}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}