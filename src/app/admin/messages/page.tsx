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
} from "@mui/material";
import {
  Search,
  Send,
  Delete,
  Notifications,
  NotificationsActive,
  Email,
  Sms,
  Campaign,
  Person,
  Check,
  Schedule,
} from "@mui/icons-material";
import { Tag } from "@/components/ui/Tag";

interface Message {
  id: number;
  title: string;
  content: string;
  type: "NOTIFICATION" | "EMAIL" | "SMS" | "BROADCAST";
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "SENT" | "PENDING" | "DRAFT" | "FAILED";
  recipientType: "ALL" | "VETERINARIANS" | "HOSPITALS" | "SPECIFIC";
  recipientCount: number;
  readCount: number;
  sender: string;
  createdAt: string;
  sentAt?: string;
  recipients?: string[];
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "SYSTEM" | "JOB" | "RESUME" | "LECTURE" | "TRANSFER";
  priority: "HIGH" | "MEDIUM" | "LOW";
  targetUsers: "ALL" | "VETERINARIANS" | "HOSPITALS";
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
}

export default function MessagesManagement() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      title: "신규 채용공고 알림",
      content: "새로운 채용공고가 등록되었습니다. 확인해보세요!",
      type: "NOTIFICATION",
      priority: "MEDIUM",
      status: "SENT",
      recipientType: "VETERINARIANS",
      recipientCount: 1250,
      readCount: 987,
      sender: "admin@iamvet.com",
      createdAt: "2024-01-22 09:30:00",
      sentAt: "2024-01-22 09:35:00",
    },
    {
      id: 2,
      title: "시스템 점검 안내",
      content: "오늘 밤 12시부터 2시간 동안 시스템 점검이 있을 예정입니다.",
      type: "EMAIL",
      priority: "HIGH",
      status: "SENT",
      recipientType: "ALL",
      recipientCount: 3450,
      readCount: 2890,
      sender: "admin@iamvet.com",
      createdAt: "2024-01-21 14:20:00",
      sentAt: "2024-01-21 15:00:00",
    },
    {
      id: 3,
      title: "신규 교육 콘텐츠 업데이트",
      content: "소동물 응급처치에 관한 새로운 강의가 업로드되었습니다.",
      type: "BROADCAST",
      priority: "LOW",
      status: "PENDING",
      recipientType: "ALL",
      recipientCount: 3450,
      readCount: 0,
      sender: "admin@iamvet.com",
      createdAt: "2024-01-22 11:15:00",
    },
    {
      id: 4,
      title: "병원 인증 완료 알림",
      content: "귀하의 병원이 성공적으로 인증되었습니다.",
      type: "SMS",
      priority: "HIGH",
      status: "FAILED",
      recipientType: "SPECIFIC",
      recipientCount: 1,
      readCount: 0,
      sender: "system",
      createdAt: "2024-01-22 08:45:00",
      recipients: ["seoul@animal.com"],
    },
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "신규 회원가입 알림",
      message: "새로운 수의사가 가입했을 때 관리자에게 알림",
      type: "SYSTEM",
      priority: "MEDIUM",
      targetUsers: "ALL",
      isActive: true,
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      title: "긴급 채용공고 알림",
      message: "긴급 채용공고가 등록되었을 때 해당 지역 수의사에게 알림",
      type: "JOB",
      priority: "HIGH",
      targetUsers: "VETERINARIANS",
      isActive: true,
      createdAt: "2024-01-18",
      expiresAt: "2024-02-18",
    },
    {
      id: 3,
      title: "프리미엄 강의 알림",
      message: "새로운 프리미엄 강의 출시 알림",
      type: "LECTURE",
      priority: "LOW",
      targetUsers: "ALL",
      isActive: false,
      createdAt: "2024-01-20",
    },
  ]);

  const [activeTab, setActiveTab] = useState<"messages" | "notifications">("messages");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Message | Notification | null>(null);
  const [actionType, setActionType] = useState<"view" | "send" | "delete" | "compose">("view");
  const [composeData, setComposeData] = useState({
    title: "",
    content: "",
    type: "NOTIFICATION" as Message["type"],
    priority: "MEDIUM" as Message["priority"],
    recipientType: "ALL" as Message["recipientType"],
  });

  const itemsPerPage = 10;

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "ALL" || message.type === filterType;
    const matchesStatus = filterStatus === "ALL" || message.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "ALL" || notification.type === filterType;

    return matchesSearch && matchesType;
  });

  const currentItems = activeTab === "messages" ? filteredMessages : filteredNotifications;
  const totalPages = Math.ceil(currentItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayItems = currentItems.slice(startIndex, startIndex + itemsPerPage);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "NOTIFICATION": case "SYSTEM": return <Notifications />;
      case "EMAIL": return <Email />;
      case "SMS": return <Sms />;
      case "BROADCAST": return <Campaign />;
      case "JOB": return <Person />;
      case "LECTURE": return <Schedule />;
      default: return <Notifications />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "SENT": return 2;
      case "PENDING": return 3;
      case "DRAFT": return 4;
      case "FAILED": return 1;
      default: return 2;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "SENT": return "발송완료";
      case "PENDING": return "발송대기";
      case "DRAFT": return "임시저장";
      case "FAILED": return "발송실패";
      default: return status;
    }
  };

  const handleAction = (item: Message | Notification, action: typeof actionType) => {
    setSelectedItem(item);
    setActionType(action);
    setModalVisible(true);
  };

  const handleSendMessage = () => {
    if (actionType === "compose") {
      const newMessage: Message = {
        id: Math.max(...messages.map(m => m.id)) + 1,
        title: composeData.title,
        content: composeData.content,
        type: composeData.type,
        priority: composeData.priority,
        status: "SENT",
        recipientType: composeData.recipientType,
        recipientCount: composeData.recipientType === "ALL" ? 3450 : 
                      composeData.recipientType === "VETERINARIANS" ? 1250 : 2200,
        readCount: 0,
        sender: "admin@iamvet.com",
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        sentAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      };
      
      setMessages(prev => [newMessage, ...prev]);
      setComposeData({
        title: "",
        content: "",
        type: "NOTIFICATION",
        priority: "MEDIUM",
        recipientType: "ALL",
      });
    } else if (selectedItem && 'status' in selectedItem) {
      setMessages(prev =>
        prev.map(message =>
          message.id === selectedItem.id
            ? { ...message, status: "SENT" as Message["status"], sentAt: new Date().toISOString().replace('T', ' ').slice(0, 19) }
            : message
        )
      );
    }
    
    setModalVisible(false);
    setSelectedItem(null);
  };

  const handleToggleNotification = (notificationId: number) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isActive: !notification.isActive }
          : notification
      )
    );
  };

  const renderActionButtons = (item: Message | Notification) => (
    <ButtonGroup size="small">
      <Button variant="outlined" onClick={() => handleAction(item, "view")}>
        <Search />
      </Button>
      {'status' in item && item.status === "PENDING" && (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleAction(item, "send")}
        >
          <Send />
        </Button>
      )}
      {'status' in item && item.status === "SENT" && (
        <Button variant="outlined" disabled>
          <Check />
        </Button>
      )}
      {'isActive' in item && (
        <Button
          variant="outlined"
          color={item.isActive ? "warning" : "success"}
          onClick={() => handleToggleNotification(item.id)}
        >
          {item.isActive ? <NotificationsActive /> : <Notifications />}
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
          알림/메시지 관리
        </Typography>
        <Typography variant="body1" sx={{ color: "var(--Subtext)" }}>
          사용자 알림 및 메시지를 효율적으로 관리하고 발송하세요.
        </Typography>
      </Box>

      {/* Tab Navigation */}
      <Box sx={{ mb: 4 }}>
        <ButtonGroup
          sx={{
            "& .MuiButton-root": {
              borderRadius: 2,
              px: 4,
              py: 1.5,
              borderColor: "var(--Line)",
              color: "var(--Subtext2)",
              "&.active": {
                bgcolor: "var(--Keycolor1)",
                color: "white",
                borderColor: "var(--Keycolor1)",
                "&:hover": {
                  bgcolor: "var(--Keycolor1)",
                },
              },
              "&:hover": {
                borderColor: "var(--Keycolor1)",
                bgcolor: "rgba(255, 135, 150, 0.04)",
              },
            },
          }}
        >
          <Button
            className={activeTab === "messages" ? "active" : ""}
            onClick={() => {
              setActiveTab("messages");
              setCurrentPage(1);
            }}
          >
            메시지 관리
          </Button>
          <Button
            className={activeTab === "notifications" ? "active" : ""}
            onClick={() => {
              setActiveTab("notifications");
              setCurrentPage(1);
            }}
          >
            알림 설정
          </Button>
        </ButtonGroup>
      </Box>

      {/* Stats Summary */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
        {(activeTab === "messages" ? [
          { label: "전체", count: messages.length, color: "var(--Keycolor1)" },
          { label: "발송완료", count: messages.filter(m => m.status === "SENT").length, color: "var(--Keycolor2)" },
          { label: "발송대기", count: messages.filter(m => m.status === "PENDING").length, color: "var(--Keycolor3)" },
          { label: "발송실패", count: messages.filter(m => m.status === "FAILED").length, color: "#F44336" },
        ] : [
          { label: "전체", count: notifications.length, color: "var(--Keycolor1)" },
          { label: "활성", count: notifications.filter(n => n.isActive).length, color: "var(--Keycolor2)" },
          { label: "비활성", count: notifications.filter(n => !n.isActive).length, color: "#9E9E9E" },
          { label: "높은우선순위", count: notifications.filter(n => n.priority === "HIGH").length, color: "#F44336" },
        ]).map((stat, index) => (
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
                  {activeTab === "messages" ? [
                    <MenuItem key="NOTIFICATION" value="NOTIFICATION">알림</MenuItem>,
                    <MenuItem key="EMAIL" value="EMAIL">이메일</MenuItem>,
                    <MenuItem key="SMS" value="SMS">SMS</MenuItem>,
                    <MenuItem key="BROADCAST" value="BROADCAST">전체발송</MenuItem>,
                  ] : [
                    <MenuItem key="SYSTEM" value="SYSTEM">시스템</MenuItem>,
                    <MenuItem key="JOB" value="JOB">채용</MenuItem>,
                    <MenuItem key="LECTURE" value="LECTURE">강의</MenuItem>,
                    <MenuItem key="RESUME" value="RESUME">인재정보</MenuItem>,
                  ]}
                </Select>
              </FormControl>
            </Box>
            {activeTab === "messages" && (
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
                    <MenuItem value="SENT">발송완료</MenuItem>
                    <MenuItem value="PENDING">발송대기</MenuItem>
                    <MenuItem value="DRAFT">임시저장</MenuItem>
                    <MenuItem value="FAILED">발송실패</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}
            <Box sx={{ flex: { xs: '1 1 100%', md: 'none' } }}>
              {activeTab === "messages" && (
                <Button
                  variant="contained"
                  startIcon={<Send />}
                  onClick={() => handleAction(null as any, "compose")}
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
                  새 메시지
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Items Table */}
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
                    유형
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "var(--Subtext)", fontSize: "0.875rem" }}>
                    {activeTab === "messages" ? "수신/읽음" : "대상/우선순위"}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "var(--Subtext)", fontSize: "0.875rem" }}>
                    {activeTab === "messages" ? "상태" : "활성"}
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
                {displayItems.map((item: any) => (
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
                          {activeTab === "messages" ? item.content : item.message}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 32,
                            height: 32,
                            borderRadius: 2,
                            bgcolor: "var(--Box_Light)",
                            color: "#ff8796",
                          }}
                        >
                          {getTypeIcon(item.type)}
                        </Box>
                        <Chip
                          label={item.type}
                          size="small"
                          sx={{
                            bgcolor: "var(--Box_Light)",
                            color: "var(--Text)",
                            fontWeight: 500,
                            borderRadius: 2,
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      {activeTab === "messages" ? (
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ color: "#3b394d", fontWeight: 500, mb: 0.5 }}
                          >
                            수신: {item.recipientCount.toLocaleString()}명
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "var(--Subtext2)" }}
                          >
                            읽음: {item.readCount.toLocaleString()}명 ({Math.round((item.readCount / item.recipientCount) * 100)}%)
                          </Typography>
                        </Box>
                      ) : (
                        <Box>
                          <Chip
                            label={item.targetUsers === "ALL" ? "전체" : 
                                  item.targetUsers === "VETERINARIANS" ? "수의사" : "병원"}
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
                              color: item.priority === "HIGH" ? "#F44336" : 
                                    item.priority === "MEDIUM" ? "var(--Keycolor3)" : "var(--Keycolor2)",
                              fontWeight: 600
                            }}
                          >
                            {item.priority} 우선순위
                          </Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      {activeTab === "messages" ? (
                        <Tag variant={getStatusVariant(item.status)}>
                          {getStatusText(item.status)}
                        </Tag>
                      ) : (
                        <Chip
                          label={item.isActive ? "활성" : "비활성"}
                          size="small"
                          sx={{
                            bgcolor: item.isActive ? "var(--Keycolor2)20" : "#9E9E9E20",
                            color: item.isActive ? "var(--Keycolor2)" : "#9E9E9E",
                            fontWeight: 600,
                            borderRadius: 2,
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: "var(--Subtext2)", fontFamily: "monospace" }}
                      >
                        {item.createdAt}
                      </Typography>
                      {activeTab === "messages" && item.sentAt && (
                        <Typography
                          variant="caption"
                          sx={{ color: "var(--Guidetext)", display: "block" }}
                        >
                          발송: {item.sentAt}
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
                        검색 조건에 맞는 {activeTab === "messages" ? "메시지" : "알림"}가 없습니다.
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
        <DialogTitle sx={{ fontWeight: 600, color: "#3b394d" }}>
          {actionType === "view" && (activeTab === "messages" ? "메시지 상세보기" : "알림 상세보기")}
          {actionType === "send" && "메시지 발송 확인"}
          {actionType === "delete" && "삭제 확인"}
          {actionType === "compose" && "새 메시지 작성"}
        </DialogTitle>
        <DialogContent>
          {actionType === "compose" ? (
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="제목"
                value={composeData.title}
                onChange={(e) => setComposeData(prev => ({ ...prev, title: e.target.value }))}
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
                rows={4}
                label="내용"
                value={composeData.content}
                onChange={(e) => setComposeData(prev => ({ ...prev, content: e.target.value }))}
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
                  <InputLabel>유형</InputLabel>
                  <Select
                    value={composeData.type}
                    label="유형"
                    onChange={(e) => setComposeData(prev => ({ ...prev, type: e.target.value as Message["type"] }))}
                  >
                    <MenuItem value="NOTIFICATION">알림</MenuItem>
                    <MenuItem value="EMAIL">이메일</MenuItem>
                    <MenuItem value="SMS">SMS</MenuItem>
                    <MenuItem value="BROADCAST">전체발송</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ flex: 1 }}>
                  <InputLabel>우선순위</InputLabel>
                  <Select
                    value={composeData.priority}
                    label="우선순위"
                    onChange={(e) => setComposeData(prev => ({ ...prev, priority: e.target.value as Message["priority"] }))}
                  >
                    <MenuItem value="HIGH">높음</MenuItem>
                    <MenuItem value="MEDIUM">보통</MenuItem>
                    <MenuItem value="LOW">낮음</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <FormControl fullWidth>
                <InputLabel>수신대상</InputLabel>
                <Select
                  value={composeData.recipientType}
                  label="수신대상"
                  onChange={(e) => setComposeData(prev => ({ ...prev, recipientType: e.target.value as Message["recipientType"] }))}
                >
                  <MenuItem value="ALL">전체 사용자</MenuItem>
                  <MenuItem value="VETERINARIANS">수의사만</MenuItem>
                  <MenuItem value="HOSPITALS">병원만</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          ) : actionType === "view" && selectedItem ? (
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#3b394d", mb: 1 }}>
                  {selectedItem.title}
                </Typography>
                <Typography variant="body1" sx={{ color: "#3b394d" }}>
                  {activeTab === "messages" ? (selectedItem as Message).content : (selectedItem as Notification).message}
                </Typography>
              </Box>
              
              {activeTab === "messages" && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "var(--Subtext)", mb: 1 }}>
                    발송 정보
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#3b394d", mb: 0.5 }}>
                    수신대상: {(selectedItem as Message).recipientCount.toLocaleString()}명
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#3b394d" }}>
                    읽음: {(selectedItem as Message).readCount.toLocaleString()}명 
                    ({Math.round(((selectedItem as Message).readCount / (selectedItem as Message).recipientCount) * 100)}%)
                  </Typography>
                </Box>
              )}
            </Stack>
          ) : (
            <Typography variant="body1" sx={{ color: "#3b394d", mt: 2 }}>
              {actionType === "send" && `이 메시지를 지금 발송하시겠습니까?`}
              {actionType === "delete" && `이 ${activeTab === "messages" ? "메시지" : "알림"}를 삭제하시겠습니까?`}
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
              onClick={handleSendMessage}
              variant="contained"
              disabled={actionType === "compose" && (!composeData.title || !composeData.content)}
              sx={{
                bgcolor: "var(--Keycolor1)",
                "&:hover": {
                  bgcolor: "var(--Keycolor1)",
                },
              }}
            >
              {actionType === "compose" ? "발송" : actionType === "send" ? "발송" : "삭제"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}