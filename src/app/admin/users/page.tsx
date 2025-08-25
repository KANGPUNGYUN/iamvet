"use client";

import React, { useState } from "react";
import {
  Box,
  Grid,
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
  Avatar,
} from "@mui/material";
import {
  Search,
  Edit,
  Block,
  Delete,
  Person,
  Business,
  People,
  CheckCircle,
  Cancel,
  Warning,
  LockOpen,
  Lock,
  Verified,
  VerifiedUser,
} from "@mui/icons-material";
import { Tag } from "@/components/ui/Tag";

interface User {
  id: number;
  name: string;
  email: string;
  type: "VETERINARIAN" | "HOSPITAL";
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  status: "ACTIVE" | "SUSPENDED" | "PENDING" | "INACTIVE";
  joinDate: string;
  lastLogin: string;
  verified: boolean;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "김수의",
      email: "kim@example.com",
      type: "VETERINARIAN",
      role: "USER",
      status: "ACTIVE",
      joinDate: "2024-01-15",
      lastLogin: "2024-01-20",
      verified: true,
    },
    {
      id: 2,
      name: "서울동물병원",
      email: "seoul@hospital.com",
      type: "HOSPITAL",
      role: "USER",
      status: "PENDING",
      joinDate: "2024-01-14",
      lastLogin: "2024-01-19",
      verified: false,
    },
    {
      id: 3,
      name: "박수의",
      email: "park@example.com",
      type: "VETERINARIAN",
      role: "USER",
      status: "ACTIVE",
      joinDate: "2024-01-13",
      lastLogin: "2024-01-20",
      verified: true,
    },
    {
      id: 4,
      name: "강남동물병원",
      email: "gangnam@hospital.com",
      type: "HOSPITAL",
      role: "USER",
      status: "SUSPENDED",
      joinDate: "2024-01-12",
      lastLogin: "2024-01-18",
      verified: true,
    },
    {
      id: 5,
      name: "이수의",
      email: "lee@example.com",
      type: "VETERINARIAN",
      role: "ADMIN",
      status: "ACTIVE",
      joinDate: "2024-01-10",
      lastLogin: "2024-01-20",
      verified: true,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<
    "edit" | "suspend" | "delete" | "view"
  >("view");

  const getStatusTag = (status: string) => {
    const statusMap: {
      [key: string]: { variant: 1 | 2 | 3 | 4 | 5 | 6; text: string };
    } = {
      ACTIVE: { variant: 2, text: "활성" },
      PENDING: { variant: 3, text: "승인대기" },
      SUSPENDED: { variant: 1, text: "정지" },
      INACTIVE: { variant: 6, text: "비활성" },
    };
    const statusInfo = statusMap[status] || {
      variant: 6 as const,
      text: status,
    };
    return <Tag variant={statusInfo.variant}>{statusInfo.text}</Tag>;
  };

  const getRoleTag = (role: string) => {
    const roleMap: { [key: string]: { variant: 1 | 2 | 3 | 4 | 5 | 6 } } = {
      USER: { variant: 3 },
      ADMIN: { variant: 4 },
      SUPER_ADMIN: { variant: 1 },
    };
    const roleInfo = roleMap[role] || { variant: 6 as const };
    const roleText =
      {
        USER: "일반사용자",
        ADMIN: "관리자",
        SUPER_ADMIN: "슈퍼관리자",
      }[role] || role;
    return <Tag variant={roleInfo.variant}>{roleText}</Tag>;
  };

  const getTypeTag = (type: string) => {
    const typeMap: { [key: string]: { variant: 1 | 2 | 3 | 4 | 5 | 6 } } = {
      VETERINARIAN: { variant: 4 },
      HOSPITAL: { variant: 5 },
    };
    const typeInfo = typeMap[type] || { variant: 6 as const };
    const typeText =
      {
        VETERINARIAN: "수의사",
        HOSPITAL: "병원",
      }[type] || type;
    return <Tag variant={typeInfo.variant}>{typeText}</Tag>;
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "ALL" || user.type === filterType;
    const matchesStatus =
      filterStatus === "ALL" || user.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleAction = (
    user: User,
    action: "edit" | "suspend" | "delete" | "view"
  ) => {
    setSelectedUser(user);
    setActionType(action);
    setModalVisible(true);
  };

  const confirmAction = () => {
    if (!selectedUser) return;

    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === selectedUser.id) {
          switch (actionType) {
            case "suspend":
              return {
                ...user,
                status:
                  user.status === "SUSPENDED"
                    ? "ACTIVE"
                    : ("SUSPENDED" as const),
              };
            case "delete":
              return { ...user, status: "INACTIVE" as const };
            default:
              return user;
          }
        }
        return user;
      })
    );

    setModalVisible(false);
    setSelectedUser(null);
  };

  const renderActionButtons = (user: User) => (
    <ButtonGroup size="small">
      <Button variant="outlined" onClick={() => handleAction(user, "view")}>
        <Person />
      </Button>
      <Button variant="outlined" onClick={() => handleAction(user, "edit")}>
        <Edit />
      </Button>
      <Button
        variant="outlined"
        color={user.status === "SUSPENDED" ? "success" : "warning"}
        onClick={() => handleAction(user, "suspend")}
      >
        {user.status === "SUSPENDED" ? <LockOpen /> : <Lock />}
      </Button>
      <Button
        variant="outlined"
        color="error"
        onClick={() => handleAction(user, "delete")}
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
          회원 관리
        </Typography>
        <Typography variant="body1" sx={{ color: "#4f5866" }}>
          플랫폼의 회원을 효율적으로 관리하고 모니터링하세요.
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
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="이름 또는 이메일로 검색..."
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
            </Grid>
            <Grid item xs={12} md={2.5}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: "#4f5866" }}>타입</InputLabel>
                <Select
                  value={filterType}
                  label="타입"
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
                  <MenuItem value="ALL">모든 타입</MenuItem>
                  <MenuItem value="VETERINARIAN">수의사</MenuItem>
                  <MenuItem value="HOSPITAL">병원</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2.5}>
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
                  <MenuItem value="INACTIVE">비활성</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
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
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Ultra Modern Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
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
                    {users.filter((u) => u.status === "ACTIVE").length}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4f5866",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    활성 회원
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
                  <CheckCircle sx={{ fontSize: 28, color: "#ff8796" }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
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
                    {users.filter((u) => u.status === "PENDING").length}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4f5866",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    승인 대기
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
                    승인 필요
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
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
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
                    {users.filter((u) => u.status === "SUSPENDED").length}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4f5866",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    정지된 계정
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
                    관리 필요
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
                  <Block sx={{ fontSize: 28, color: "#ff8796" }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
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
                    {users.length}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4f5866",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    총 회원수
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
                    지속 성장
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
                  <People sx={{ fontSize: 28, color: "#ff8796" }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
                회원 목록
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#4f5866",
                  mt: 0.5,
                }}
              >
                총 {filteredUsers.length}명의 회원
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
                  회원정보
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#3b394d",
                    fontSize: "0.875rem",
                    letterSpacing: "0.025em",
                  }}
                >
                  타입
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#3b394d",
                    fontSize: "0.875rem",
                    letterSpacing: "0.025em",
                  }}
                >
                  권한
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
                  인증
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#3b394d",
                    fontSize: "0.875rem",
                    letterSpacing: "0.025em",
                  }}
                >
                  가입일
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#3b394d",
                    fontSize: "0.875rem",
                    letterSpacing: "0.025em",
                  }}
                >
                  최근 로그인
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
              {currentUsers.map((user) => (
                <TableRow
                  key={user.id}
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor:
                            user.type === "VETERINARIAN"
                              ? "#ff8796"
                              : "#ffb7b8",
                          width: 40,
                          height: 40,
                        }}
                      >
                        {user.type === "VETERINARIAN" ? (
                          <Person />
                        ) : (
                          <Business />
                        )}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          fontWeight="600"
                          sx={{ color: "text.primary", mb: 0.5 }}
                        >
                          {user.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ lineHeight: 1.3 }}
                        >
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{getTypeTag(user.type)}</TableCell>
                  <TableCell>{getRoleTag(user.role)}</TableCell>
                  <TableCell>{getStatusTag(user.status)}</TableCell>
                  <TableCell>
                    {user.verified ? (
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <VerifiedUser
                          sx={{ color: "#10B981", fontSize: 20, mr: 1 }}
                        />
                        <Tag variant={2}>인증완료</Tag>
                      </Box>
                    ) : (
                      <Tag variant={1}>미인증</Tag>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="#9098a4"
                      sx={{ fontSize: "0.875rem" }}
                    >
                      {user.joinDate}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="#9098a4"
                      sx={{ fontSize: "0.875rem" }}
                    >
                      {user.lastLogin}
                    </Typography>
                  </TableCell>
                  <TableCell>{renderActionButtons(user)}</TableCell>
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
          {actionType === "view" && "회원 상세정보"}
          {actionType === "edit" && "회원 정보 수정"}
          {actionType === "suspend" &&
            (selectedUser?.status === "SUSPENDED"
              ? "계정 활성화"
              : "계정 정지")}
          {actionType === "delete" && "계정 삭제"}
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              {actionType === "view" && (
                <Box>
                  <Stack spacing={2} sx={{ mt: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor:
                            selectedUser.type === "VETERINARIAN"
                              ? "#ff8796"
                              : "#ffb7b8",
                          width: 60,
                          height: 60,
                        }}
                      >
                        {selectedUser.type === "VETERINARIAN" ? (
                          <Person />
                        ) : (
                          <Business />
                        )}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {selectedUser.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedUser.email}
                        </Typography>
                      </Box>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <strong>타입:</strong>
                          {getTypeTag(selectedUser.type)}
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <strong>권한:</strong>
                          {getRoleTag(selectedUser.role)}
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <strong>상태:</strong>
                          {getStatusTag(selectedUser.status)}
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <strong>인증:</strong>
                          {selectedUser.verified ? (
                            <Tag variant={2}>인증완료</Tag>
                          ) : (
                            <Tag variant={1}>미인증</Tag>
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>
                          <strong>가입일:</strong> {selectedUser.joinDate}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>
                          <strong>최근 로그인:</strong> {selectedUser.lastLogin}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Stack>
                </Box>
              )}

              {actionType === "edit" && (
                <Stack spacing={2} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="이름"
                    value={selectedUser.name}
                    disabled
                  />
                  <TextField
                    fullWidth
                    label="이메일"
                    value={selectedUser.email}
                    disabled
                  />
                  <FormControl fullWidth>
                    <InputLabel>권한</InputLabel>
                    <Select value={selectedUser.role} label="권한">
                      <MenuItem value="USER">일반사용자</MenuItem>
                      <MenuItem value="ADMIN">관리자</MenuItem>
                      <MenuItem value="SUPER_ADMIN">슈퍼관리자</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              )}

              {actionType === "suspend" && (
                <Alert
                  severity={
                    selectedUser.status === "SUSPENDED" ? "success" : "warning"
                  }
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {selectedUser.status === "SUSPENDED" ? (
                      <LockOpen />
                    ) : (
                      <Lock />
                    )}
                    <Typography>
                      <strong>{selectedUser.name}</strong>님의 계정을{" "}
                      {selectedUser.status === "SUSPENDED" ? "활성화" : "정지"}
                      하시겠습니까?
                    </Typography>
                  </Box>
                  {selectedUser.status !== "SUSPENDED" && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      계정이 정지되면 로그인할 수 없습니다.
                    </Typography>
                  )}
                </Alert>
              )}

              {actionType === "delete" && (
                <Alert severity="error">
                  <Typography>
                    <strong>{selectedUser.name}</strong>님의 계정을
                    삭제하시겠습니까?
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    삭제된 계정은 복구할 수 없습니다.
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
          {actionType !== "view" && (
            <Button
              onClick={confirmAction}
              color={
                actionType === "delete"
                  ? "error"
                  : actionType === "suspend"
                  ? selectedUser?.status === "SUSPENDED"
                    ? "success"
                    : "warning"
                  : "primary"
              }
              variant="contained"
            >
              {actionType === "edit" && "저장"}
              {actionType === "suspend" &&
                (selectedUser?.status === "SUSPENDED" ? "활성화" : "정지")}
              {actionType === "delete" && "삭제"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
