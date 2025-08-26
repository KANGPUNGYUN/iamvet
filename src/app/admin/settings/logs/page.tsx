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
  Stack,
  IconButton,
  Chip,
  Alert,
} from "@mui/material";
import {
  Search,
  Download,
  Refresh,
  Error,
  Warning,
  Info,
  CheckCircle,
  ArrowBack,
} from "@mui/icons-material";
import { Tag } from "@/components/ui/Tag";
import Link from "next/link";

interface SystemLog {
  id: number;
  timestamp: string;
  level: "INFO" | "WARNING" | "ERROR" | "DEBUG";
  category: string;
  message: string;
  details?: string;
  userId?: number;
  userEmail?: string;
  ipAddress?: string;
}

export default function SystemLogsPage() {
  const [logs] = useState<SystemLog[]>([
    {
      id: 1,
      timestamp: "2024-01-22 10:30:15",
      level: "INFO",
      category: "시스템",
      message: "시스템 설정이 업데이트되었습니다.",
      details: "유지보수 모드 설정이 변경되었습니다.",
      userId: 1,
      userEmail: "admin@iamvet.com",
      ipAddress: "192.168.1.100",
    },
    {
      id: 2,
      timestamp: "2024-01-22 10:25:42",
      level: "ERROR",
      category: "인증",
      message: "로그인 실패 - 잘못된 비밀번호",
      details: "사용자가 5회 연속 잘못된 비밀번호를 입력했습니다.",
      userEmail: "user@example.com",
      ipAddress: "203.0.113.50",
    },
    {
      id: 3,
      timestamp: "2024-01-22 10:20:11",
      level: "INFO",
      category: "AI",
      message: "AI 모델이 성공적으로 업데이트되었습니다.",
      details: "채용 매칭 알고리즘 버전 1.2.3이 배포되었습니다.",
    },
    {
      id: 4,
      timestamp: "2024-01-22 10:15:30",
      level: "ERROR",
      category: "메일",
      message: "이메일 전송 중 오류가 발생했습니다.",
      details: "SMTP 서버 연결 실패: Connection timeout",
    },
    {
      id: 5,
      timestamp: "2024-01-22 10:10:05",
      level: "INFO",
      category: "데이터베이스",
      message: "데이터베이스 백업이 완료되었습니다.",
      details: "백업 파일: backup_20240122_101005.sql (2.5GB)",
    },
    {
      id: 6,
      timestamp: "2024-01-22 10:05:22",
      level: "WARNING",
      category: "시스템",
      message: "메모리 사용량이 80%를 초과했습니다.",
      details: "현재 메모리 사용량: 6.4GB/8GB (80%)",
    },
    {
      id: 7,
      timestamp: "2024-01-22 10:00:18",
      level: "INFO",
      category: "API",
      message: "새로운 API 키가 생성되었습니다.",
      details: "API 키 ID: api_key_20240122_100018",
      userId: 2,
      userEmail: "developer@iamvet.com",
      ipAddress: "192.168.1.105",
    },
    {
      id: 8,
      timestamp: "2024-01-22 09:55:33",
      level: "ERROR",
      category: "결제",
      message: "결제 처리 중 오류가 발생했습니다.",
      details: "결제 게이트웨이 응답 오류: Invalid card number",
    },
    {
      id: 9,
      timestamp: "2024-01-22 09:50:27",
      level: "INFO",
      category: "채용",
      message: "새로운 채용 공고가 등록되었습니다.",
      details: "공고 ID: job_20240122_095027, 회사: 서울동물병원",
      userId: 15,
      userEmail: "hr@seouldongmul.com",
    },
    {
      id: 10,
      timestamp: "2024-01-22 09:45:14",
      level: "DEBUG",
      category: "성능",
      message: "데이터베이스 쿼리 성능 모니터링",
      details: "평균 응답 시간: 45ms, 최대 응답 시간: 120ms",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);
  const itemsPerPage = 10;

  const logLevels = ["ALL", "INFO", "WARNING", "ERROR", "DEBUG"];
  const categories = [
    "ALL",
    "시스템",
    "AI",
    "메일",
    "데이터베이스",
    "인증",
    "API",
    "결제",
    "채용",
    "성능",
  ];

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.userEmail &&
        log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLevel = levelFilter === "ALL" || log.level === levelFilter;
    const matchesCategory =
      categoryFilter === "ALL" || log.category === categoryFilter;

    return matchesSearch && matchesLevel && matchesCategory;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "ERROR":
        return <Error sx={{ fontSize: 16 }} />;
      case "WARNING":
        return <Warning sx={{ fontSize: 16 }} />;
      case "INFO":
        return <Info sx={{ fontSize: 16 }} />;
      case "DEBUG":
        return <CheckCircle sx={{ fontSize: 16 }} />;
      default:
        return <Info sx={{ fontSize: 16 }} />;
    }
  };

  const getLevelVariant = (level: string) => {
    switch (level) {
      case "ERROR":
        return 1;
      case "WARNING":
        return 3;
      case "INFO":
        return 2;
      case "DEBUG":
        return 4;
      default:
        return 2;
    }
  };

  const handleExportLogs = () => {
    const csvContent = [
      ["시간", "레벨", "카테고리", "메시지", "세부사항", "사용자", "IP"],
      ...filteredLogs.map((log) => [
        log.timestamp,
        log.level,
        log.category,
        log.message,
        log.details || "",
        log.userEmail || "",
        log.ipAddress || "",
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `system_logs_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <IconButton
            component={Link}
            href="/admin/settings"
            sx={{
              mr: 2,
              color: "#ff8796",
              "&:hover": { bgcolor: "rgba(255, 135, 150, 0.08)" },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#3b394d",
              fontSize: { xs: "1.75rem", md: "2rem" },
            }}
          >
            시스템 로그
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: "#4f5866" }}>
          시스템 활동과 에러를 실시간으로 모니터링하고 분석하세요.
        </Typography>
      </Box>

      {/* Stats Summary */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
        {logLevels.slice(1).map((level) => {
          const count = logs.filter((log) => log.level === level).length;
          const getColorByLevel = (level: string) => {
            switch (level) {
              case "ERROR":
                return "#ff8796";
              case "WARNING":
                return "#ff8796";
              case "INFO":
                return "#ff8796";
              case "DEBUG":
                return "#ff8796";
              default:
                return "#ff8796";
            }
          };
          return (
            <Card
              key={level}
              sx={{
                flex: "1 1 200px",
                borderRadius: 4,
                border: "1px solid #ffffffff",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  bgcolor: getColorByLevel(level),
                },
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 32px rgba(252, 105, 225, 0.15)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                bgcolor: "white",
              }}
            >
              <CardContent sx={{ p: 3, textAlign: "center" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 48,
                      height: 48,
                      borderRadius: 3,
                      bgcolor: `${getColorByLevel(level)}20`,
                      color: getColorByLevel(level),
                      mr: 2,
                    }}
                  >
                    {getLevelIcon(level)}
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "#3b394d" }}
                  >
                    {count}
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{ color: "#4f5866", fontWeight: 500 }}
                >
                  {level}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
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
                placeholder="로그 검색..."
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
                <InputLabel sx={{ color: "#4f5866" }}>레벨</InputLabel>
                <Select
                  value={levelFilter}
                  label="레벨"
                  onChange={(e) => setLevelFilter(e.target.value)}
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
                  {logLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 20.83%" } }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: "#4f5866" }}>카테고리</InputLabel>
                <Select
                  value={categoryFilter}
                  label="카테고리"
                  onChange={(e) => setCategoryFilter(e.target.value)}
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
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: { xs: "1 1 100%", md: "none" } }}>
              <ButtonGroup sx={{ width: "250px", gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={() => {
                    setSearchTerm("");
                    setLevelFilter("ALL");
                    setCategoryFilter("ALL");
                  }}
                  sx={{
                    borderRadius: 2,
                    borderColor: "#efeff0",
                    color: "#4f5866",
                    bgcolor: "white",
                    "&:hover": {
                      borderColor: "#ff8796",
                      bgcolor: "rgba(255, 135, 150, 0.04)",
                      color: "#ff8796",
                    },
                  }}
                >
                  초기화
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={handleExportLogs}
                  sx={{
                    borderRadius: 2,
                    bgcolor: "#ff8796",
                    boxShadow: "0 4px 12px rgba(255, 135, 150, 0.3)",
                    "&:hover": {
                      bgcolor: "#ff8796",
                      boxShadow: "0 6px 20px rgba(255, 135, 150, 0.4)",
                    },
                  }}
                >
                  내보내기
                </Button>
              </ButtonGroup>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card
        sx={{
          borderRadius: 4,
          border: "1px solid #efeff0",
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
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "#4f5866",
                      fontSize: "0.875rem",
                      width: "160px",
                    }}
                  >
                    시간
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "#4f5866",
                      fontSize: "0.875rem",
                      width: "100px",
                    }}
                  >
                    레벨
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "#4f5866",
                      fontSize: "0.875rem",
                      width: "120px",
                    }}
                  >
                    카테고리
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "#4f5866",
                      fontSize: "0.875rem",
                    }}
                  >
                    메시지
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "#4f5866",
                      fontSize: "0.875rem",
                      width: "200px",
                    }}
                  >
                    사용자/IP
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "#4f5866",
                      fontSize: "0.875rem",
                      width: "120px",
                    }}
                  >
                    세부사항
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentLogs.map((log) => (
                  <TableRow
                    key={log.id}
                    hover
                    sx={{ "&:hover": { bgcolor: "rgba(0, 0, 0, 0.02)" } }}
                  >
                    <TableCell
                      sx={{
                        color: "#6c7481",
                        fontWeight: 500,
                        fontFamily: "monospace",
                        fontSize: "0.875rem",
                      }}
                    >
                      {log.timestamp}
                    </TableCell>
                    <TableCell>
                      <Tag variant={getLevelVariant(log.level)}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          {getLevelIcon(log.level)}
                          {log.level}
                        </Box>
                      </Tag>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: "#3b394d" }}>
                      <Chip
                        label={log.category}
                        size="small"
                        sx={{
                          bgcolor: "#f5f5f7",
                          color: "#3b394d",
                          fontWeight: 500,
                          borderRadius: 2,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: "#3b394d", fontWeight: 500 }}>
                      {log.message}
                    </TableCell>
                    <TableCell sx={{ color: "#6c7481", fontSize: "0.875rem" }}>
                      {log.userEmail && (
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {log.userEmail}
                          </Typography>
                        </Box>
                      )}
                      {log.ipAddress && (
                        <Typography
                          variant="caption"
                          sx={{ color: "#9098a4", fontFamily: "monospace" }}
                        >
                          {log.ipAddress}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {log.details && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => setSelectedLog(log)}
                          sx={{
                            color: "#ff8796",
                            borderColor: "#ff8796",
                            minWidth: "auto",
                            px: 2,
                            py: 0.5,
                            borderRadius: 2,
                            fontSize: "0.75rem",
                            "&:hover": {
                              borderColor: "#ff8796",
                              bgcolor: "rgba(255, 135, 150, 0.04)",
                            },
                          }}
                        >
                          보기
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {currentLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: "center", py: 8 }}>
                      <Typography variant="body1" sx={{ color: "#6c7481" }}>
                        검색 조건에 맞는 로그가 없습니다.
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
                  bgcolor: "#ff8796",
                  color: "white",
                  "&:hover": {
                    bgcolor: "#ff8796",
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

      {/* Log Details Modal */}
      {selectedLog && (
        <Alert
          severity="info"
          onClose={() => setSelectedLog(null)}
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "600px",
            zIndex: 1300,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            border: "1px solid var(--Line)",
            borderRadius: 3,
            backgroundColor: "#FFFFFF",
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              로그 세부사항
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, color: "var(--Subtext)" }}
                >
                  시간:
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                  {selectedLog.timestamp}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, color: "var(--Subtext)" }}
                >
                  메시지:
                </Typography>
                <Typography variant="body2">{selectedLog.message}</Typography>
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, color: "#4f5866" }}
                >
                  세부사항:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "monospace",
                    bgcolor: "#caced6",
                    p: 2,
                    borderRadius: 1,
                  }}
                >
                  {selectedLog.details}
                </Typography>
              </Box>
              {selectedLog.userEmail && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: "var(--Subtext)" }}
                  >
                    사용자:
                  </Typography>
                  <Typography variant="body2">
                    {selectedLog.userEmail}
                  </Typography>
                </Box>
              )}
              {selectedLog.ipAddress && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: "var(--Subtext)" }}
                  >
                    IP 주소:
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                    {selectedLog.ipAddress}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>
        </Alert>
      )}
      {selectedLog && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1200,
          }}
          onClick={() => setSelectedLog(null)}
        />
      )}
    </Box>
  );
}
