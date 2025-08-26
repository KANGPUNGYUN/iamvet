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
  // 수의사 관련 필드
  veterinarianLicense?: {
    licenseNumber: string;
    licenseImage: string;
    issueDate: string;
    expiryDate: string;
  };
  // 병원 관련 필드
  hospitalInfo?: {
    businessNumber: string;
    businessRegistration: string;
    representativeName: string;
    establishedDate: string;
  };
  phone?: string;
  address?: string;
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
      veterinarianLicense: {
        licenseNumber: "VET-2020-1234",
        licenseImage: "/sample-license.jpg",
        issueDate: "2020-03-15",
        expiryDate: "2025-03-15",
      },
      phone: "010-1234-5678",
      address: "서울특별시 강남구 테헤란로 123",
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
      hospitalInfo: {
        businessNumber: "123-45-67890",
        businessRegistration: "/sample-business-registration.pdf",
        representativeName: "김대표",
        establishedDate: "2015-05-20",
      },
      phone: "02-1234-5678",
      address: "서울특별시 중구 명동길 45",
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
      veterinarianLicense: {
        licenseNumber: "VET-2019-5678",
        licenseImage: "/sample-license-2.jpg",
        issueDate: "2019-06-10",
        expiryDate: "2024-06-10",
      },
      phone: "010-9876-5432",
      address: "부산광역시 해운대구 해운대로 567",
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
      hospitalInfo: {
        businessNumber: "987-65-43210",
        businessRegistration: "/sample-business-registration-2.pdf",
        representativeName: "박원장",
        establishedDate: "2010-10-15",
      },
      phone: "02-9876-5432",
      address: "서울특별시 강남구 강남대로 890",
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
      veterinarianLicense: {
        licenseNumber: "VET-2018-9012",
        licenseImage: "/sample-license-3.jpg",
        issueDate: "2018-09-05",
        expiryDate: "2023-09-05",
      },
      phone: "010-5555-7777",
      address: "대구광역시 중구 국채보상로 234",
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
    "edit" | "suspend" | "delete" | "view" | "verify" | "reject"
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
    action: "edit" | "suspend" | "delete" | "view" | "verify" | "reject"
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
            case "verify":
              return { ...user, verified: true, status: "ACTIVE" as const };
            case "reject":
              return { ...user, verified: false, status: "SUSPENDED" as const };
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
      {!user.verified && user.status === "PENDING" && (
        <>
          <Button
            variant="outlined"
            color="success"
            onClick={() => handleAction(user, "verify")}
          >
            <CheckCircle />
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleAction(user, "reject")}
          >
            <Block />
          </Button>
        </>
      )}
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
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
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
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(25% - 18px)' } }}>
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
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(25% - 18px)' } }}>
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
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(25% - 18px)' } }}>
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
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Ultra Modern Stats Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
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
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
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
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
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
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
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
          {actionType === "verify" && "계정 인증 승인"}
          {actionType === "reject" && "계정 인증 거부"}
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
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <strong>타입:</strong>
                          {getTypeTag(selectedUser.type)}
                        </Box>
                      </Box>
                      <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <strong>권한:</strong>
                          {getRoleTag(selectedUser.role)}
                        </Box>
                      </Box>
                      <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <strong>상태:</strong>
                          {getStatusTag(selectedUser.status)}
                        </Box>
                      </Box>
                      <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } }}>
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
                      </Box>
                      <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } }}>
                        <Typography>
                          <strong>가입일:</strong> {selectedUser.joinDate}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } }}>
                        <Typography>
                          <strong>최근 로그인:</strong> {selectedUser.lastLogin}
                        </Typography>
                      </Box>
                      {selectedUser.phone && (
                        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } }}>
                          <Typography>
                            <strong>연락처:</strong> {selectedUser.phone}
                          </Typography>
                        </Box>
                      )}
                      {selectedUser.address && (
                        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } }}>
                          <Typography>
                            <strong>주소:</strong> {selectedUser.address}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* 수의사 면허증 정보 */}
                    {selectedUser.type === "VETERINARIAN" && selectedUser.veterinarianLicense && (
                      <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "#3b394d" }}>
                          수의사 면허 정보
                        </Typography>
                        <Card sx={{ bgcolor: "#f9f9f9", border: "1px solid #efeff0", borderRadius: 2 }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } }}>
                                <Typography><strong>면허번호:</strong> {selectedUser.veterinarianLicense.licenseNumber}</Typography>
                              </Box>
                              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } }}>
                                <Typography><strong>발급일:</strong> {selectedUser.veterinarianLicense.issueDate}</Typography>
                              </Box>
                              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } }}>
                                <Typography><strong>만료일:</strong> {selectedUser.veterinarianLicense.expiryDate}</Typography>
                              </Box>
                              <Box sx={{ flex: '1 1 100%', mt: 2 }}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>면허증 이미지:</Typography>
                                <Box
                                  sx={{
                                    border: "1px solid #ddd",
                                    borderRadius: 1,
                                    p: 2,
                                    bgcolor: "white",
                                    textAlign: "center",
                                    minHeight: "200px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Typography color="text.secondary">
                                    이미지: {selectedUser.veterinarianLicense.licenseImage}
                                    <br />
                                    <small>(실제 구현시 이미지가 표시됩니다)</small>
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Box>
                    )}

                    {/* 병원 사업자등록 정보 */}
                    {selectedUser.type === "HOSPITAL" && selectedUser.hospitalInfo && (
                      <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "#3b394d" }}>
                          병원 사업자 정보
                        </Typography>
                        <Card sx={{ bgcolor: "#f9f9f9", border: "1px solid #efeff0", borderRadius: 2 }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } }}>
                                <Typography><strong>사업자등록번호:</strong> {selectedUser.hospitalInfo.businessNumber}</Typography>
                              </Box>
                              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } }}>
                                <Typography><strong>대표자명:</strong> {selectedUser.hospitalInfo.representativeName}</Typography>
                              </Box>
                              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } }}>
                                <Typography><strong>개원일:</strong> {selectedUser.hospitalInfo.establishedDate}</Typography>
                              </Box>
                              <Box sx={{ flex: '1 1 100%', mt: 2 }}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>사업자등록증:</Typography>
                                <Box
                                  sx={{
                                    border: "1px solid #ddd",
                                    borderRadius: 1,
                                    p: 2,
                                    bgcolor: "white",
                                    textAlign: "center",
                                    minHeight: "150px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Typography color="text.secondary">
                                    파일: {selectedUser.hospitalInfo.businessRegistration}
                                    <br />
                                    <small>(실제 구현시 PDF 뷰어가 표시됩니다)</small>
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Box>
                    )}
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

              {actionType === "verify" && (
                <Box>
                  <Alert severity="success" sx={{ mb: 3 }}>
                    <Typography>
                      <strong>{selectedUser.name}</strong>님의 계정을 인증 승인하시겠습니까?
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      승인 시 계정 상태가 '활성'으로 변경되며, 모든 서비스 이용이 가능해집니다.
                    </Typography>
                  </Alert>

                  {/* 인증 정보 표시 */}
                  {selectedUser.type === "VETERINARIAN" && selectedUser.veterinarianLicense && (
                    <Card sx={{ bgcolor: "#f0f8f0", border: "1px solid #c8e6c9" }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, color: "#2e7d32" }}>
                          수의사 면허 정보 확인
                        </Typography>
                        <Typography><strong>면허번호:</strong> {selectedUser.veterinarianLicense.licenseNumber}</Typography>
                        <Typography><strong>발급일:</strong> {selectedUser.veterinarianLicense.issueDate}</Typography>
                        <Typography><strong>만료일:</strong> {selectedUser.veterinarianLicense.expiryDate}</Typography>
                      </CardContent>
                    </Card>
                  )}

                  {selectedUser.type === "HOSPITAL" && selectedUser.hospitalInfo && (
                    <Card sx={{ bgcolor: "#f0f8f0", border: "1px solid #c8e6c9" }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, color: "#2e7d32" }}>
                          병원 사업자 정보 확인
                        </Typography>
                        <Typography><strong>사업자등록번호:</strong> {selectedUser.hospitalInfo.businessNumber}</Typography>
                        <Typography><strong>대표자명:</strong> {selectedUser.hospitalInfo.representativeName}</Typography>
                        <Typography><strong>개원일:</strong> {selectedUser.hospitalInfo.establishedDate}</Typography>
                      </CardContent>
                    </Card>
                  )}
                </Box>
              )}

              {actionType === "reject" && (
                <Alert severity="warning">
                  <Typography>
                    <strong>{selectedUser.name}</strong>님의 인증을 거부하시겠습니까?
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    거부 시 계정이 정지되며, 재신청 후 다시 검토가 필요합니다.
                  </Typography>
                  {selectedUser.type === "VETERINARIAN" && (
                    <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic" }}>
                      거부 사유: 수의사 면허증 확인 불가 또는 정보 불일치
                    </Typography>
                  )}
                  {selectedUser.type === "HOSPITAL" && (
                    <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic" }}>
                      거부 사유: 사업자등록증 확인 불가 또는 정보 불일치
                    </Typography>
                  )}
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
                  : actionType === "verify"
                  ? "success"
                  : actionType === "reject"
                  ? "error"
                  : "primary"
              }
              variant="contained"
            >
              {actionType === "edit" && "저장"}
              {actionType === "suspend" &&
                (selectedUser?.status === "SUSPENDED" ? "활성화" : "정지")}
              {actionType === "delete" && "삭제"}
              {actionType === "verify" && "승인"}
              {actionType === "reject" && "거부"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
