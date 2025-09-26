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
  Chip,
} from "@mui/material";
import {
  Search,
  Send,
  Delete,
  Announcement,
  Edit,
  Publish,
  Check,
} from "@mui/icons-material";
import { Tag } from "@/components/ui/Tag";
import axios from "axios";

interface AnnouncementData {
  id: string;
  title: string;
  content: string;
  priority: "HIGH" | "NORMAL" | "LOW";
  status: "DRAFT" | "PUBLISHED" | "SENT";
  targetUsers: string[];
  sendCount: number;
  totalRecipients: number;
  readCount: number;
  author: string;
  createdAt: string;
  updatedAt?: string;
  sentAt?: string;
}

export default function AnnouncementManagement() {
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AnnouncementData | null>(null);
  const [actionType, setActionType] = useState<"view" | "send" | "delete" | "compose" | "edit" | "publish">("view");
  
  const [announcementData, setAnnouncementData] = useState({
    title: "",
    content: "",
    priority: "NORMAL" as AnnouncementData["priority"],
    targetUsers: "ALL" as string,
  });

  const itemsPerPage = 10;

  // 공지사항 목록 조회
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/announcements");
      if (response.data.success) {
        setAnnouncements(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || announcement.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const currentItems = filteredAnnouncements;
  const totalPages = Math.ceil(currentItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayItems = currentItems.slice(startIndex, startIndex + itemsPerPage);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "SENT": return 2;
      case "PUBLISHED": return 3;
      case "DRAFT": return 4;
      default: return 2;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "SENT": return "발송완료";
      case "PUBLISHED": return "게시됨";
      case "DRAFT": return "임시저장";
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH": return "#F44336";
      case "NORMAL": return "var(--Keycolor3)";
      case "LOW": return "var(--Keycolor2)";
      default: return "var(--Keycolor2)";
    }
  };

  const getTargetUsersText = (targetUsers: string[]) => {
    if (targetUsers.includes("ALL")) return "전체";
    const types = [];
    if (targetUsers.includes("VETERINARIAN")) types.push("수의사");
    if (targetUsers.includes("HOSPITAL")) types.push("병원");
    if (targetUsers.includes("VETERINARY_STUDENT")) types.push("수의학과 학생");
    return types.join(", ");
  };

  const handleAction = (item: AnnouncementData | null, action: typeof actionType) => {
    setSelectedItem(item);
    setActionType(action);
    
    if (action === "edit" && item) {
      setAnnouncementData({
        title: item.title,
        content: item.content,
        priority: item.priority,
        targetUsers: item.targetUsers.includes("ALL") ? "ALL" : 
                    item.targetUsers.includes("VETERINARIAN") ? "VETERINARIAN" :
                    item.targetUsers.includes("HOSPITAL") ? "HOSPITAL" : "VETERINARY_STUDENT",
      });
    }
    
    setModalVisible(true);
  };

  const handleCreateAnnouncement = () => {
    setSelectedItem(null);
    setActionType("compose");
    setAnnouncementData({
      title: "",
      content: "",
      priority: "NORMAL",
      targetUsers: "ALL",
    });
    setModalVisible(true);
  };

  const handleSaveAnnouncement = async () => {
    try {
      setLoading(true);
      
      const targetUsersArray = announcementData.targetUsers === "ALL" 
        ? ["ALL"] 
        : [announcementData.targetUsers];

      if (actionType === "compose") {
        // 새 공지사항 생성
        const response = await axios.post("/api/admin/announcements", {
          title: announcementData.title,
          content: announcementData.content,
          priority: announcementData.priority,
          targetUsers: targetUsersArray,
        });
        
        if (response.data.success) {
          await fetchAnnouncements();
        }
      } else if (actionType === "edit" && selectedItem) {
        // 공지사항 수정
        const response = await axios.put(`/api/admin/announcements/${selectedItem.id}`, {
          title: announcementData.title,
          content: announcementData.content,
          priority: announcementData.priority,
          targetUsers: targetUsersArray,
        });
        
        if (response.data.success) {
          await fetchAnnouncements();
        }
      }
      
      setModalVisible(false);
      setSelectedItem(null);
      setAnnouncementData({
        title: "",
        content: "",
        priority: "NORMAL",
        targetUsers: "ALL",
      });
    } catch (error) {
      console.error("Failed to save announcement:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishAnnouncement = async (announcementId: string) => {
    try {
      setLoading(true);
      await axios.post(`/api/admin/announcements/${announcementId}`, {
        action: "publish"
      });
      await fetchAnnouncements();
    } catch (error) {
      console.error("Failed to publish announcement:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendAnnouncement = async (announcementId: string) => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/admin/announcements/${announcementId}`, {
        action: "send"
      });
      
      if (response.data.success) {
        alert(response.data.message);
        await fetchAnnouncements();
      }
    } catch (error) {
      console.error("Failed to send announcement:", error);
      alert("공지사항 발송에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    try {
      if (!selectedItem) return;
      
      setLoading(true);
      await axios.delete(`/api/admin/announcements/${selectedItem.id}`);
      await fetchAnnouncements();
      
      setModalVisible(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Failed to delete announcement:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderActionButtons = (item: AnnouncementData) => (
    <ButtonGroup size="small">
      <Button variant="outlined" onClick={() => handleAction(item, "view")}>
        <Search />
      </Button>
      
      <Button
        variant="outlined"
        color="primary"
        onClick={() => handleAction(item, "edit")}
      >
        <Edit />
      </Button>
      
      {item.status === "DRAFT" && (
        <Button
          variant="outlined"
          color="success"
          onClick={() => handlePublishAnnouncement(item.id)}
        >
          <Publish />
        </Button>
      )}
      
      {(item.status === "PUBLISHED" || item.status === "DRAFT") && (
        <Button
          variant="outlined"
          color="warning"
          onClick={() => handleSendAnnouncement(item.id)}
        >
          <Send />
        </Button>
      )}
      
      {item.status === "SENT" && (
        <Button variant="outlined" disabled>
          <Check />
        </Button>
      )}
      
      <Button
        variant="outlined"
        color="error"
        onClick={() => handleAction(item, "delete")}
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
          공지사항 관리
        </Typography>
        <Typography variant="body1" sx={{ color: "var(--Subtext)" }}>
          사용자에게 전달할 공지사항을 작성하고 관리하세요.
        </Typography>
      </Box>

      {/* Stats Summary */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
        {[
          { label: "전체", count: announcements.length, color: "var(--Keycolor1)" },
          { label: "임시저장", count: announcements.filter(a => a.status === "DRAFT").length, color: "#9E9E9E" },
          { label: "게시됨", count: announcements.filter(a => a.status === "PUBLISHED").length, color: "var(--Keycolor3)" },
          { label: "발송완료", count: announcements.filter(a => a.status === "SENT").length, color: "var(--Keycolor2)" },
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

      {/* Filter Section */}
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
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: "center" }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 41.66%' } }}>
              <TextField
                fullWidth
                placeholder="제목, 내용으로 검색..."
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
                  <MenuItem value="DRAFT">임시저장</MenuItem>
                  <MenuItem value="PUBLISHED">게시됨</MenuItem>
                  <MenuItem value="SENT">발송완료</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ flex: { xs: '1 1 100%', md: 'none' } }}>
              <Button
                variant="contained"
                startIcon={<Announcement />}
                onClick={handleCreateAnnouncement}
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
                새 공지사항
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Announcements Table */}
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
                    제목/내용
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "var(--Subtext)", fontSize: "0.875rem" }}>
                    대상/우선순위
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "var(--Subtext)", fontSize: "0.875rem" }}>
                    발송현황
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "var(--Subtext)", fontSize: "0.875rem" }}>
                    상태
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "var(--Subtext)", fontSize: "0.875rem" }}>
                    날짜
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "var(--Subtext)", fontSize: "0.875rem" }}>
                    작업
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayItems.map((item) => (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{ "&:hover": { bgcolor: "rgba(0, 0, 0, 0.02)" } }}
                  >
                    <TableCell>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600, color: "#3b394d", mb: 0.5 }}
                        >
                          {item.title}
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
                          }}
                        >
                          {item.content}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Chip
                          label={getTargetUsersText(item.targetUsers)}
                          size="small"
                          sx={{
                            bgcolor: "var(--Box_Light)",
                            color: "var(--Text)",
                            fontWeight: 500,
                            borderRadius: 2,
                            mb: 0.5,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ 
                            color: getPriorityColor(item.priority),
                            fontWeight: 600
                          }}
                        >
                          {item.priority} 우선순위
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: "#3b394d", fontWeight: 500 }}
                      >
                        {item.status === "SENT" 
                          ? `발송: ${item.sendCount}명 / 읽음: ${item.readCount}명`
                          : `대상: ${item.totalRecipients || 0}명`
                        }
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tag variant={getStatusVariant(item.status)}>
                        {getStatusText(item.status)}
                      </Tag>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: "var(--Subtext2)", fontFamily: "monospace" }}
                      >
                        {new Date(item.createdAt).toLocaleString()}
                      </Typography>
                      {item.sentAt && (
                        <Typography
                          variant="caption"
                          sx={{ color: "var(--Guidetext)", display: "block" }}
                        >
                          발송: {new Date(item.sentAt).toLocaleString()}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{renderActionButtons(item)}</TableCell>
                  </TableRow>
                ))}
                {displayItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: "center", py: 8 }}>
                      <Typography variant="body1" sx={{ color: "var(--Subtext2)" }}>
                        {loading ? "로딩 중..." : "검색 조건에 맞는 공지사항이 없습니다."}
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

      {/* Modal */}
      <Dialog
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, color: "#3b394d" }}>
          {actionType === "view" && "공지사항 상세보기"}
          {actionType === "delete" && "삭제 확인"}
          {actionType === "compose" && "새 공지사항 작성"}
          {actionType === "edit" && "공지사항 수정"}
        </DialogTitle>
        <DialogContent>
          {(actionType === "compose" || actionType === "edit") ? (
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="제목"
                value={announcementData.title}
                onChange={(e) => setAnnouncementData(prev => ({ ...prev, title: e.target.value }))}
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
                rows={6}
                label="내용"
                value={announcementData.content}
                onChange={(e) => setAnnouncementData(prev => ({ ...prev, content: e.target.value }))}
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
                <FormControl sx={{ flex: 1 }}>
                  <InputLabel>우선순위</InputLabel>
                  <Select
                    value={announcementData.priority}
                    label="우선순위"
                    onChange={(e) => setAnnouncementData(prev => ({ ...prev, priority: e.target.value as AnnouncementData["priority"] }))}
                  >
                    <MenuItem value="HIGH">높음</MenuItem>
                    <MenuItem value="NORMAL">보통</MenuItem>
                    <MenuItem value="LOW">낮음</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ flex: 1 }}>
                  <InputLabel>대상 사용자</InputLabel>
                  <Select
                    value={announcementData.targetUsers}
                    label="대상 사용자"
                    onChange={(e) => setAnnouncementData(prev => ({ ...prev, targetUsers: e.target.value }))}
                  >
                    <MenuItem value="ALL">전체 사용자</MenuItem>
                    <MenuItem value="VETERINARIAN">수의사</MenuItem>
                    <MenuItem value="HOSPITAL">병원</MenuItem>
                    <MenuItem value="VETERINARY_STUDENT">수의학과 학생</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Stack>
          ) : actionType === "view" && selectedItem ? (
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#3b394d", mb: 1 }}>
                  {selectedItem.title}
                </Typography>
                <Typography variant="body1" sx={{ color: "#3b394d" }}>
                  {selectedItem.content}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "var(--Subtext)", mb: 1 }}>
                  공지사항 정보
                </Typography>
                <Typography variant="body2" sx={{ color: "#3b394d", mb: 0.5 }}>
                  상태: {getStatusText(selectedItem.status)}
                </Typography>
                <Typography variant="body2" sx={{ color: "#3b394d", mb: 0.5 }}>
                  대상: {getTargetUsersText(selectedItem.targetUsers)}
                </Typography>
                <Typography variant="body2" sx={{ color: "#3b394d", mb: 0.5 }}>
                  작성자: {selectedItem.author}
                </Typography>
                {selectedItem.status === "SENT" && (
                  <Typography variant="body2" sx={{ color: "#3b394d" }}>
                    발송: {selectedItem.sendCount}명 / 읽음: {selectedItem.readCount}명
                  </Typography>
                )}
              </Box>
            </Stack>
          ) : (
            <Typography variant="body1" sx={{ color: "#3b394d", mt: 2 }}>
              {actionType === "delete" && `이 공지사항을 삭제하시겠습니까?`}
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
              onClick={
                actionType === "delete" ? handleDeleteItem : handleSaveAnnouncement
              }
              variant="contained"
              disabled={
                (actionType === "compose" || actionType === "edit") 
                  ? (!announcementData.title || !announcementData.content || loading)
                  : loading
              }
              sx={{
                bgcolor: actionType === "delete" ? "#F44336" : "var(--Keycolor1)",
                "&:hover": {
                  bgcolor: actionType === "delete" ? "#D32F2F" : "var(--Keycolor1)",
                },
              }}
            >
              {loading ? "처리중..." :
               actionType === "compose" ? "저장" :
               actionType === "edit" ? "수정 완료" : "삭제"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}