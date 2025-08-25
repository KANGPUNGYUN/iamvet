"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Divider,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Settings,
  Security,
  Notifications,
  Email,
  CloudUpload,
  Storage,
  Code,
  Warning,
  CheckCircle,
  ExpandMore,
  Backup,
  Cached,
  RestartAlt,
} from "@mui/icons-material";
import { Tag } from "@/components/ui/Tag";

interface SystemSetting {
  key: string;
  value: string;
  category: string;
  description: string;
  type: "string" | "number" | "boolean" | "select";
  options?: string[];
}

export default function SettingsManagement() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  const [settings, setSettings] = useState<SystemSetting[]>([
    {
      key: "site_name",
      value: "IAMVET",
      category: "general",
      description: "사이트 이름",
      type: "string",
    },
    {
      key: "site_description",
      value: "수의사 전문 채용 플랫폼",
      category: "general",
      description: "사이트 설명",
      type: "string",
    },
    {
      key: "admin_email",
      value: "admin@iamvet.com",
      category: "general",
      description: "관리자 이메일",
      type: "string",
    },
    {
      key: "maintenance_mode",
      value: "false",
      category: "general",
      description: "유지보수 모드",
      type: "boolean",
    },
    {
      key: "max_file_size",
      value: "10",
      category: "upload",
      description: "최대 파일 크기 (MB)",
      type: "number",
    },
    {
      key: "allowed_file_types",
      value: "jpg,jpeg,png,pdf,doc,docx",
      category: "upload",
      description: "허용된 파일 형식",
      type: "string",
    },
    {
      key: "email_notifications",
      value: "true",
      category: "notification",
      description: "이메일 알림 사용",
      type: "boolean",
    },
    {
      key: "sms_notifications",
      value: "false",
      category: "notification",
      description: "SMS 알림 사용",
      type: "boolean",
    },
    {
      key: "session_timeout",
      value: "30",
      category: "security",
      description: "세션 타임아웃 (분)",
      type: "number",
    },
    {
      key: "ai_matching_enabled",
      value: "true",
      category: "ai",
      description: "AI 매칭 사용",
      type: "boolean",
    },
    {
      key: "ai_confidence_threshold",
      value: "0.8",
      category: "ai",
      description: "AI 신뢰도 임계값",
      type: "number",
    },
  ]);

  const handleSettingChange = (key: string, value: string) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.key === key ? { ...setting, value } : setting
      )
    );
  };

  const handleSave = (category: string) => {
    setAlertMessage(`${getCategoryName(category)} 설정이 저장되었습니다.`);
    setAlertType("success");
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleReset = (category: string) => {
    setAlertMessage(`${getCategoryName(category)} 설정이 초기화되었습니다.`);
    setAlertType("error");
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const getCategoryName = (category: string) => {
    const names: { [key: string]: string } = {
      general: "일반",
      upload: "파일 업로드",
      notification: "알림",
      ai: "AI 시스템",
    };
    return names[category] || category;
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: any } = {
      general: <Settings />,
      upload: <CloudUpload />,
      notification: <Notifications />,
      security: <Security />,
      ai: <Code />,
    };
    return icons[category] || <Settings />;
  };

  const renderSettingInput = (setting: SystemSetting) => {
    switch (setting.type) {
      case "boolean":
        return (
          <FormControlLabel
            control={
              <Switch
                checked={setting.value === "true"}
                onChange={(e) =>
                  handleSettingChange(setting.key, e.target.checked.toString())
                }
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "var(--Keycolor1)",
                    "&:hover": {
                      backgroundColor: "rgba(105, 140, 252, 0.08)",
                    },
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "var(--Keycolor1)",
                  },
                }}
              />
            }
            label=""
          />
        );
      case "select":
        return (
          <FormControl fullWidth size="small">
            <Select
              value={setting.value}
              onChange={(e) => handleSettingChange(setting.key, e.target.value)}
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
            >
              {setting.options?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case "number":
        return (
          <TextField
            type="number"
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            fullWidth
            size="small"
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
        );
      default:
        return (
          <TextField
            type="text"
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            fullWidth
            size="small"
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
        );
    }
  };

  const categories = ["general", "upload", "notification", "security", "ai"];

  return (
    <Box>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 700, color: "var(--Text)", mb: 4 }}
      >
        시스템 설정
      </Typography>

      {showAlert && (
        <Alert
          severity={alertType}
          onClose={() => setShowAlert(false)}
          sx={{ mb: 3 }}
          icon={alertType === "success" ? <CheckCircle /> : <Warning />}
        >
          {alertMessage}
        </Alert>
      )}

      {/* System Status Overview */}
      <Box sx={{ mb: 4 }}>
        <Card
          sx={{
            position: "relative",
            bgcolor: "white",
            border: "1px solid var(--Line)",
            borderRadius: 4,
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background:
                "linear-gradient(90deg, var(--Keycolor1), var(--Keycolor2))",
            },
            boxShadow: "0 2px 12px rgba(105, 140, 252, 0.08)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "var(--Text)", mb: 3 }}
            >
              시스템 상태
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              <Box sx={{ textAlign: "center", flex: "1 1 200px" }}>
                <CheckCircle sx={{ fontSize: 48, color: "#ff8796", mb: 1 }} />
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: "var(--Text)", mb: 1 }}
                >
                  시스템 상태
                </Typography>
                <Tag variant={2}>정상</Tag>
              </Box>
              <Box sx={{ textAlign: "center", flex: "1 1 200px" }}>
                <Storage
                  sx={{ fontSize: 48, color: "var(--Keycolor1)", mb: 1 }}
                />
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: "var(--Text)", mb: 1 }}
                >
                  데이터베이스
                </Typography>
                <Tag variant={2}>연결됨</Tag>
              </Box>
              <Box sx={{ textAlign: "center", flex: "1 1 200px" }}>
                <Email sx={{ fontSize: 48, color: "#ff8796", mb: 1 }} />
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: "var(--Text)", mb: 1 }}
                >
                  메일 서버
                </Typography>
                <Tag variant={2}>작동중</Tag>
              </Box>
              <Box sx={{ textAlign: "center", flex: "1 1 200px" }}>
                <Code sx={{ fontSize: 48, color: "var(--Keycolor1)", mb: 1 }} />
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: "var(--Text)", mb: 1 }}
                >
                  AI 서비스
                </Typography>
                <Tag variant={2}>활성</Tag>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Settings Accordion */}
      <Box sx={{ mb: 4 }}>
        <Stack spacing={2}>
          {categories.map((category) => (
            <Accordion
              key={category}
              sx={{
                border: "1px solid var(--Line)",
                borderRadius: "16px !important",
                "&:before": { display: "none" },
                "&.Mui-expanded": {
                  boxShadow: "0 8px 32px rgba(105, 140, 252, 0.12)",
                },
                overflow: "hidden",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: "var(--Keycolor1)" }} />}
                sx={{
                  bgcolor: "var(--Box_Light)",
                  borderRadius: "16px",
                  "&.Mui-expanded": {
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    borderBottom: "1px solid var(--Line)",
                  },
                  "& .MuiAccordionSummary-content": {
                    alignItems: "center",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: "#ffe5e5",
                      color: "var(--Keycolor1)",
                    }}
                  >
                    {getCategoryIcon(category)}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "var(--Text)" }}
                  >
                    {getCategoryName(category)} 설정
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 4 }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                  {settings
                    .filter((setting) => setting.category === category)
                    .map((setting) => (
                      <Box
                        key={setting.key}
                        sx={{ flex: "1 1 300px", minWidth: "300px" }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            color: "var(--Text)",
                            mb: 1.5,
                          }}
                        >
                          {setting.description}
                        </Typography>
                        {renderSettingInput(setting)}
                        {setting.key === "maintenance_mode" &&
                          setting.value === "true" && (
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#F44336",
                                display: "block",
                                mt: 0.5,
                                fontWeight: 500,
                              }}
                            >
                              유지보수 모드가 활성화되어 있습니다.
                            </Typography>
                          )}
                      </Box>
                    ))}
                </Box>
                <Divider sx={{ my: 3 }} />
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={<CheckCircle />}
                    onClick={() => handleSave(category)}
                    sx={{
                      bgcolor: "var(--Keycolor1)",
                      "&:hover": {
                        bgcolor: "var(--Keycolor2)",
                      },
                      borderRadius: 2,
                      px: 3,
                    }}
                  >
                    저장
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Warning />}
                    onClick={() => handleReset(category)}
                    sx={{
                      borderColor: "var(--Line_Highlight)",
                      color: "var(--Subtext)",
                      "&:hover": {
                        borderColor: "var(--Keycolor1)",
                        bgcolor: "rgba(105, 140, 252, 0.04)",
                      },
                      borderRadius: 2,
                      px: 3,
                    }}
                  >
                    초기화
                  </Button>
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Box>

      {/* System Logs Preview */}
      <Box sx={{ mb: 4 }}>
        <Card
          sx={{
            border: "1px solid var(--Line)",
            borderRadius: 4,
            boxShadow: "0 2px 12px rgba(105, 140, 252, 0.08)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "var(--Text)", mb: 3 }}
            >
              최근 시스템 로그
            </Typography>
            <TableContainer>
              <Table
                sx={{
                  "& .MuiTableCell-root": {
                    borderBottom: "1px solid var(--Line)",
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
                      시간
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "var(--Subtext)",
                        fontSize: "0.875rem",
                      }}
                    >
                      레벨
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "var(--Subtext)",
                        fontSize: "0.875rem",
                      }}
                    >
                      카테고리
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "var(--Subtext)",
                        fontSize: "0.875rem",
                      }}
                    >
                      메시지
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    hover
                    sx={{ "&:hover": { bgcolor: "rgba(0, 0, 0, 0.02)" } }}
                  >
                    <TableCell
                      sx={{ color: "var(--Subtext2)", fontWeight: 500 }}
                    >
                      2024-01-22 10:30:15
                    </TableCell>
                    <TableCell>
                      <Tag variant={2}>INFO</Tag>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: "var(--Text)" }}>
                      시스템
                    </TableCell>
                    <TableCell sx={{ color: "var(--Subtext)" }}>
                      시스템 설정이 업데이트되었습니다.
                    </TableCell>
                  </TableRow>
                  <TableRow
                    hover
                    sx={{ "&:hover": { bgcolor: "rgba(0, 0, 0, 0.02)" } }}
                  >
                    <TableCell
                      sx={{ color: "var(--Subtext2)", fontWeight: 500 }}
                    >
                      2024-01-22 10:20:11
                    </TableCell>
                    <TableCell>
                      <Tag variant={2}>INFO</Tag>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: "var(--Text)" }}>
                      AI
                    </TableCell>
                    <TableCell sx={{ color: "var(--Subtext)" }}>
                      AI 모델이 성공적으로 업데이트되었습니다.
                    </TableCell>
                  </TableRow>
                  <TableRow
                    hover
                    sx={{ "&:hover": { bgcolor: "rgba(0, 0, 0, 0.02)" } }}
                  >
                    <TableCell
                      sx={{ color: "var(--Subtext2)", fontWeight: 500 }}
                    >
                      2024-01-22 10:15:30
                    </TableCell>
                    <TableCell>
                      <Tag variant={1}>ERROR</Tag>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: "var(--Text)" }}>
                      메일
                    </TableCell>
                    <TableCell sx={{ color: "var(--Subtext)" }}>
                      이메일 전송 중 오류가 발생했습니다.
                    </TableCell>
                  </TableRow>
                  <TableRow
                    hover
                    sx={{ "&:hover": { bgcolor: "rgba(0, 0, 0, 0.02)" } }}
                  >
                    <TableCell
                      sx={{ color: "var(--Subtext2)", fontWeight: 500 }}
                    >
                      2024-01-22 10:10:05
                    </TableCell>
                    <TableCell>
                      <Tag variant={2}>INFO</Tag>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: "var(--Text)" }}>
                      데이터베이스
                    </TableCell>
                    <TableCell sx={{ color: "var(--Subtext)" }}>
                      데이터베이스 백업이 완료되었습니다.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "var(--Keycolor1)",
                  color: "var(--Keycolor1)",
                  "&:hover": {
                    borderColor: "var(--Keycolor2)",
                    bgcolor: "rgba(105, 140, 252, 0.04)",
                  },
                  borderRadius: 2,
                  px: 3,
                }}
              >
                전체 로그 보기
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Backup & Maintenance */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        <Box sx={{ flex: "1 1 400px" }}>
          <Card
            sx={{
              position: "relative",
              bgcolor: "white",
              border: "1px solid var(--Line)",
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
                background:
                  "linear-gradient(90deg, var(--Keycolor1), var(--Keycolor2))",
                opacity: 0,
                transition: "opacity 0.3s ease",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    bgcolor: "#ffe5e5",
                    color: "var(--Keycolor1)",
                    mr: 2,
                  }}
                >
                  <Backup sx={{ fontSize: 28 }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "var(--Text)" }}
                >
                  백업 관리
                </Typography>
              </Box>
              <Stack spacing={2} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, color: "var(--Subtext)" }}
                  >
                    마지막 백업:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "var(--Text)" }}
                  >
                    2024-01-22 02:00:00
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, color: "var(--Subtext)" }}
                  >
                    백업 크기:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "var(--Text)" }}
                  >
                    2.5GB
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, color: "var(--Subtext)" }}
                  >
                    백업 상태:
                  </Typography>
                  <Tag variant={2}>성공</Tag>
                </Box>
              </Stack>
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<Storage />}
                  sx={{
                    bgcolor: "var(--Keycolor1)",
                    "&:hover": {
                      bgcolor: "var(--Keycolor2)",
                    },
                    borderRadius: 2,
                  }}
                >
                  수동 백업 실행
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: "var(--Line_Highlight)",
                    color: "var(--Subtext)",
                    "&:hover": {
                      borderColor: "var(--Keycolor1)",
                      bgcolor: "rgba(105, 140, 252, 0.04)",
                    },
                    borderRadius: 2,
                  }}
                >
                  백업 설정 관리
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: "1 1 400px" }}>
          <Card
            sx={{
              position: "relative",
              bgcolor: "white",
              border: "1px solid var(--Line)",
              borderRadius: 4,
              overflow: "hidden",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 32px rgba(255, 135, 150, 0.15)",
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
                background:
                  "linear-gradient(90deg, var(--Keycolor1), var(--Keycolor2))",
                opacity: 0,
                transition: "opacity 0.3s ease",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    bgcolor: "rgba(255, 135, 150, 0.1)",
                    color: "var(--Keycolor1)",
                    mr: 2,
                  }}
                >
                  <Settings sx={{ fontSize: 28 }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "var(--Text)" }}
                >
                  시스템 유지보수
                </Typography>
              </Box>
              <Stack spacing={2} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, color: "var(--Subtext)" }}
                  >
                    서버 가동시간:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "var(--Text)" }}
                  >
                    45일 12시간
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, color: "var(--Subtext)" }}
                  >
                    메모리 사용량:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "#FF9800" }}
                  >
                    78% (6.2GB/8GB)
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, color: "var(--Subtext)" }}
                  >
                    디스크 사용량:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "#ff8796" }}
                  >
                    65% (130GB/200GB)
                  </Typography>
                </Box>
              </Stack>
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<Cached />}
                  sx={{
                    bgcolor: "#FF9800",
                    "&:hover": {
                      bgcolor: "#F57C00",
                    },
                    borderRadius: 2,
                  }}
                >
                  캐시 정리
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<RestartAlt />}
                  sx={{
                    borderColor: "#F44336",
                    color: "#F44336",
                    "&:hover": {
                      borderColor: "#F44336",
                      bgcolor: "rgba(244, 67, 54, 0.04)",
                    },
                    borderRadius: 2,
                  }}
                >
                  시스템 재시작
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
