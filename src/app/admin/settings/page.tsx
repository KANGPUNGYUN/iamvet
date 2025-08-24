"use client";

import React, { useState } from "react";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CFormSwitch,
  CButton,
  CAlert,
  CInputGroup,
  CInputGroupText,
  CBadge,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilSettings,
  cilShield,
  cilBell,
  cilEnvelopeClosed,
  cilCloudUpload,
  cilDatabase,
  cilCode,
  cilWarning,
  cilCheckCircle,
} from "@coreui/icons";

interface SystemSetting {
  key: string;
  value: string;
  category: string;
  description: string;
  type: "string" | "number" | "boolean" | "select";
  options?: string[];
}

export default function SettingsManagement() {
  const [activeTab, setActiveTab] = useState("general");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState<"success" | "danger">("success");

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
      key: "security_level",
      value: "medium",
      category: "security",
      description: "보안 레벨",
      type: "select",
      options: ["low", "medium", "high"],
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
    setSettings(prev => prev.map(setting => 
      setting.key === key ? { ...setting, value } : setting
    ));
  };

  const handleSave = (category: string) => {
    // 실제 구현에서는 API 호출
    setAlertMessage(`${getCategoryName(category)} 설정이 저장되었습니다.`);
    setAlertColor("success");
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleReset = (category: string) => {
    setAlertMessage(`${getCategoryName(category)} 설정이 초기화되었습니다.`);
    setAlertColor("danger");
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const getCategoryName = (category: string) => {
    const names: { [key: string]: string } = {
      general: "일반",
      upload: "파일 업로드",
      notification: "알림",
      security: "보안",
      ai: "AI 시스템",
    };
    return names[category] || category;
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: any } = {
      general: cilSettings,
      upload: cilCloudUpload,
      notification: cilBell,
      security: cilShield,
      ai: cilCode,
    };
    return icons[category] || cilSettings;
  };

  const renderSettingInput = (setting: SystemSetting) => {
    switch (setting.type) {
      case "boolean":
        return (
          <CFormSwitch
            id={setting.key}
            checked={setting.value === "true"}
            onChange={(e) => handleSettingChange(setting.key, e.target.checked.toString())}
          />
        );
      case "select":
        return (
          <CFormSelect
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
          >
            {setting.options?.map(option => (
              <option key={option} value={option}>
                {option.toUpperCase()}
              </option>
            ))}
          </CFormSelect>
        );
      case "number":
        return (
          <CFormInput
            type="number"
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
          />
        );
      default:
        return (
          <CFormInput
            type="text"
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
          />
        );
    }
  };

  const categories = ["general", "upload", "notification", "security", "ai"];

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <h1 className="mb-4">시스템 설정</h1>
        </CCol>
      </CRow>

      {showAlert && (
        <CRow className="mb-4">
          <CCol xs={12}>
            <CAlert color={alertColor} dismissible>
              <CIcon icon={alertColor === "success" ? cilCheckCircle : cilWarning} className="me-2" />
              {alertMessage}
            </CAlert>
          </CCol>
        </CRow>
      )}

      {/* System Status Overview */}
      <CRow className="mb-4">
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <h5 className="mb-0">시스템 상태</h5>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol md={3}>
                  <div className="text-center">
                    <CIcon icon={cilCheckCircle} size="2xl" className="text-success mb-2" />
                    <div className="fw-semibold">시스템 상태</div>
                    <CBadge color="success">정상</CBadge>
                  </div>
                </CCol>
                <CCol md={3}>
                  <div className="text-center">
                    <CIcon icon={cilDatabase} size="2xl" className="text-info mb-2" />
                    <div className="fw-semibold">데이터베이스</div>
                    <CBadge color="success">연결됨</CBadge>
                  </div>
                </CCol>
                <CCol md={3}>
                  <div className="text-center">
                    <CIcon icon={cilEnvelopeClosed} size="2xl" className="text-warning mb-2" />
                    <div className="fw-semibold">메일 서버</div>
                    <CBadge color="success">작동중</CBadge>
                  </div>
                </CCol>
                <CCol md={3}>
                  <div className="text-center">
                    <CIcon icon={cilCode} size="2xl" className="text-primary mb-2" />
                    <div className="fw-semibold">AI 서비스</div>
                    <CBadge color="success">활성</CBadge>
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Settings Accordion */}
      <CRow>
        <CCol xs={12}>
          <CAccordion>
            {categories.map((category, index) => (
              <CAccordionItem key={category} itemKey={index + 1}>
                <CAccordionHeader>
                  <CIcon icon={getCategoryIcon(category)} className="me-2" />
                  {getCategoryName(category)} 설정
                </CAccordionHeader>
                <CAccordionBody>
                  <CCard>
                    <CCardBody>
                      <CForm>
                        <CRow>
                          {settings
                            .filter(setting => setting.category === category)
                            .map(setting => (
                              <CCol md={6} key={setting.key} className="mb-3">
                                <CFormLabel htmlFor={setting.key}>
                                  {setting.description}
                                </CFormLabel>
                                {renderSettingInput(setting)}
                                {setting.key === "maintenance_mode" && setting.value === "true" && (
                                  <small className="text-danger">
                                    유지보수 모드가 활성화되어 있습니다.
                                  </small>
                                )}
                              </CCol>
                            ))}
                        </CRow>
                        <div className="d-flex gap-2 mt-3">
                          <CButton 
                            color="primary" 
                            onClick={() => handleSave(category)}
                          >
                            <CIcon icon={cilCheckCircle} className="me-2" />
                            저장
                          </CButton>
                          <CButton 
                            color="secondary" 
                            variant="outline"
                            onClick={() => handleReset(category)}
                          >
                            <CIcon icon={cilWarning} className="me-2" />
                            초기화
                          </CButton>
                        </div>
                      </CForm>
                    </CCardBody>
                  </CCard>
                </CAccordionBody>
              </CAccordionItem>
            ))}
          </CAccordion>
        </CCol>
      </CRow>

      {/* System Logs Preview */}
      <CRow className="mt-4">
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <h5 className="mb-0">최근 시스템 로그</h5>
            </CCardHeader>
            <CCardBody>
              <CTable responsive hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>시간</CTableHeaderCell>
                    <CTableHeaderCell>레벨</CTableHeaderCell>
                    <CTableHeaderCell>카테고리</CTableHeaderCell>
                    <CTableHeaderCell>메시지</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell>2024-01-22 10:30:15</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="success">INFO</CBadge>
                    </CTableDataCell>
                    <CTableDataCell>시스템</CTableDataCell>
                    <CTableDataCell>시스템 설정이 업데이트되었습니다.</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>2024-01-22 10:25:42</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="warning">WARN</CBadge>
                    </CTableDataCell>
                    <CTableDataCell>보안</CTableDataCell>
                    <CTableDataCell>다수의 로그인 실패 시도가 감지되었습니다.</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>2024-01-22 10:20:11</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="success">INFO</CBadge>
                    </CTableDataCell>
                    <CTableDataCell>AI</CTableDataCell>
                    <CTableDataCell>AI 모델이 성공적으로 업데이트되었습니다.</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>2024-01-22 10:15:30</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="danger">ERROR</CBadge>
                    </CTableDataCell>
                    <CTableDataCell>메일</CTableDataCell>
                    <CTableDataCell>이메일 전송 중 오류가 발생했습니다.</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>2024-01-22 10:10:05</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="success">INFO</CBadge>
                    </CTableDataCell>
                    <CTableDataCell>데이터베이스</CTableDataCell>
                    <CTableDataCell>데이터베이스 백업이 완료되었습니다.</CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
              <div className="text-center mt-3">
                <CButton color="primary" variant="outline">
                  전체 로그 보기
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Backup & Maintenance */}
      <CRow className="mt-4">
        <CCol md={6}>
          <CCard>
            <CCardHeader>
              <h5 className="mb-0">백업 관리</h5>
            </CCardHeader>
            <CCardBody>
              <div className="mb-3">
                <p><strong>마지막 백업:</strong> 2024-01-22 02:00:00</p>
                <p><strong>백업 크기:</strong> 2.5GB</p>
                <p><strong>백업 상태:</strong> <CBadge color="success">성공</CBadge></p>
              </div>
              <div className="d-grid gap-2">
                <CButton color="info">
                  <CIcon icon={cilDatabase} className="me-2" />
                  수동 백업 실행
                </CButton>
                <CButton color="secondary" variant="outline">
                  백업 설정 관리
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={6}>
          <CCard>
            <CCardHeader>
              <h5 className="mb-0">시스템 유지보수</h5>
            </CCardHeader>
            <CCardBody>
              <div className="mb-3">
                <p><strong>서버 가동시간:</strong> 45일 12시간</p>
                <p><strong>메모리 사용량:</strong> 78% (6.2GB/8GB)</p>
                <p><strong>디스크 사용량:</strong> 65% (130GB/200GB)</p>
              </div>
              <div className="d-grid gap-2">
                <CButton color="warning">
                  <CIcon icon={cilWarning} className="me-2" />
                  캐시 정리
                </CButton>
                <CButton color="danger" variant="outline">
                  시스템 재시작
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
}