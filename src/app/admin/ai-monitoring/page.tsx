"use client";

import React, { useState } from "react";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CButton,
  CProgress,
  CAlert,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormTextarea,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilSearch,
  cilCloudUpload,
  cilCheckCircle,
  cilXCircle,
  cilWarning,
  cilChart,
  cilCog,
} from "@coreui/icons";

interface MatchingLog {
  id: number;
  veterinarianId: string;
  hospitalId: string;
  matchScore: number;
  result: "SUCCESS" | "FAILED" | "PENDING";
  executionTime: number;
  timestamp: string;
  modelVersion: string;
}

interface ModelVersion {
  id: number;
  version: string;
  name: string;
  accuracy: number;
  status: "ACTIVE" | "TESTING" | "DEPRECATED";
  deployedAt: string;
  trainedOn: string;
  description: string;
}

export default function AIMonitoring() {
  // Matching logs data
  const [matchingLogs, setMatchingLogs] = useState<MatchingLog[]>([
    {
      id: 1,
      veterinarianId: "VET001",
      hospitalId: "HOS001",
      matchScore: 0.89,
      result: "SUCCESS",
      executionTime: 1.2,
      timestamp: "2024-01-20 14:30:25",
      modelVersion: "v2.1.0",
    },
    {
      id: 2,
      veterinarianId: "VET002",
      hospitalId: "HOS002",
      matchScore: 0.45,
      result: "FAILED",
      executionTime: 0.8,
      timestamp: "2024-01-20 14:25:10",
      modelVersion: "v2.1.0",
    },
    {
      id: 3,
      veterinarianId: "VET003",
      hospitalId: "HOS003",
      matchScore: 0.92,
      result: "SUCCESS",
      executionTime: 1.5,
      timestamp: "2024-01-20 14:20:45",
      modelVersion: "v2.1.0",
    },
    {
      id: 4,
      veterinarianId: "VET004",
      hospitalId: "HOS001",
      matchScore: 0.67,
      result: "PENDING",
      executionTime: 2.1,
      timestamp: "2024-01-20 14:15:30",
      modelVersion: "v2.0.9",
    },
  ]);

  // Model versions data
  const [modelVersions, setModelVersions] = useState<ModelVersion[]>([
    {
      id: 1,
      version: "v2.1.0",
      name: "Advanced Matching Model",
      accuracy: 0.87,
      status: "ACTIVE",
      deployedAt: "2024-01-15",
      trainedOn: "2024-01-10",
      description: "최신 딥러닝 기반 매칭 모델",
    },
    {
      id: 2,
      version: "v2.0.9",
      name: "Stable Matching Model",
      accuracy: 0.82,
      status: "DEPRECATED",
      deployedAt: "2023-12-20",
      trainedOn: "2023-12-15",
      description: "안정성 검증된 기존 모델",
    },
    {
      id: 3,
      version: "v2.2.0-beta",
      name: "Experimental Model",
      accuracy: 0.91,
      status: "TESTING",
      deployedAt: "2024-01-18",
      trainedOn: "2024-01-16",
      description: "실험적 신경망 모델",
    },
  ]);

  const [activeTab, setActiveTab] = useState("logs");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterResult, setFilterResult] = useState("ALL");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelVersion | null>(null);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);

  // Performance metrics
  const performanceMetrics = {
    totalRequests: 1247,
    successRate: 0.87,
    avgResponseTime: 1.3,
    activeModel: "v2.1.0",
    dailyRequests: 156,
    errorRate: 0.13,
  };

  const getResultBadge = (result: string) => {
    const resultMap: { [key: string]: { color: string; text: string; icon: any } } = {
      SUCCESS: { color: "success", text: "성공", icon: cilCheckCircle },
      FAILED: { color: "danger", text: "실패", icon: cilXCircle },
      PENDING: { color: "warning", text: "대기", icon: cilWarning },
    };
    const resultInfo = resultMap[result] || { color: "secondary", text: result, icon: cilWarning };
    return (
      <CBadge color={resultInfo.color}>
        <CIcon icon={resultInfo.icon} className="me-1" />
        {resultInfo.text}
      </CBadge>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { color: string; text: string } } = {
      ACTIVE: { color: "success", text: "활성" },
      TESTING: { color: "warning", text: "테스트" },
      DEPRECATED: { color: "danger", text: "중단됨" },
    };
    const statusInfo = statusMap[status] || { color: "secondary", text: status };
    return <CBadge color={statusInfo.color}>{statusInfo.text}</CBadge>;
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "success";
    if (score >= 0.6) return "warning";
    return "danger";
  };

  const handleModelAction = (model: ModelVersion, action: "activate" | "test" | "deprecate") => {
    setModelVersions((prev) =>
      prev.map((m) => {
        if (m.id === model.id) {
          let newStatus: "ACTIVE" | "TESTING" | "DEPRECATED";
          switch (action) {
            case "activate":
              newStatus = "ACTIVE";
              break;
            case "test":
              newStatus = "TESTING";
              break;
            case "deprecate":
              newStatus = "DEPRECATED";
              break;
          }
          return { ...m, status: newStatus };
        }
        // If activating this model, deprecate others
        if (action === "activate") {
          return { ...m, status: m.status === "ACTIVE" ? "DEPRECATED" : m.status };
        }
        return m;
      })
    );
  };

  const filteredLogs = matchingLogs.filter((log) => {
    const matchesSearch = 
      log.veterinarianId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.hospitalId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesResult = filterResult === "ALL" || log.result === filterResult;
    return matchesSearch && matchesResult;
  });

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <h1 className="mb-4">AI 매칭 모니터링</h1>
        </CCol>
      </CRow>

      {/* Performance Overview */}
      <CRow className="mb-4">
        <CCol sm={6} lg={2}>
          <CCard className="mb-3">
            <CCardBody>
              <div className="fs-6 fw-semibold text-medium-emphasis">총 요청수</div>
              <div className="fs-4 fw-bold">{performanceMetrics.totalRequests.toLocaleString()}</div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={2}>
          <CCard className="mb-3">
            <CCardBody>
              <div className="fs-6 fw-semibold text-medium-emphasis">성공률</div>
              <div className="fs-4 fw-bold text-success">
                {(performanceMetrics.successRate * 100).toFixed(1)}%
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={2}>
          <CCard className="mb-3">
            <CCardBody>
              <div className="fs-6 fw-semibold text-medium-emphasis">평균 응답시간</div>
              <div className="fs-4 fw-bold text-info">{performanceMetrics.avgResponseTime}초</div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={2}>
          <CCard className="mb-3">
            <CCardBody>
              <div className="fs-6 fw-semibold text-medium-emphasis">활성 모델</div>
              <div className="fs-4 fw-bold text-primary">{performanceMetrics.activeModel}</div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={2}>
          <CCard className="mb-3">
            <CCardBody>
              <div className="fs-6 fw-semibold text-medium-emphasis">일일 요청</div>
              <div className="fs-4 fw-bold">{performanceMetrics.dailyRequests}</div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={2}>
          <CCard className="mb-3">
            <CCardBody>
              <div className="fs-6 fw-semibold text-medium-emphasis">오류율</div>
              <div className="fs-4 fw-bold text-warning">
                {(performanceMetrics.errorRate * 100).toFixed(1)}%
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Navigation Tabs */}
      <CRow className="mb-4">
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <CButton
                    color={activeTab === "logs" ? "primary" : "ghost"}
                    className="me-2"
                    onClick={() => setActiveTab("logs")}
                  >
                    <CIcon icon={cilChart} className="me-2" />
                    매칭 로그
                  </CButton>
                  <CButton
                    color={activeTab === "models" ? "primary" : "ghost"}
                    onClick={() => setActiveTab("models")}
                  >
                    <CIcon icon={cilCog} className="me-2" />
                    모델 관리
                  </CButton>
                </div>
                {activeTab === "models" && (
                  <CButton
                    color="success"
                    onClick={() => setUpdateModalVisible(true)}
                  >
                    <CIcon icon={cilCloudUpload} className="me-2" />
                    모델 업데이트
                  </CButton>
                )}
              </div>
            </CCardHeader>
            <CCardBody>
              {/* Search and Filters */}
              <CRow className="mb-4">
                <CCol md={6}>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilSearch} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder={
                        activeTab === "logs" 
                          ? "수의사/병원 ID로 검색"
                          : "모델명으로 검색"
                      }
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </CInputGroup>
                </CCol>
                {activeTab === "logs" && (
                  <CCol md={3}>
                    <CFormSelect
                      value={filterResult}
                      onChange={(e) => setFilterResult(e.target.value)}
                    >
                      <option value="ALL">모든 결과</option>
                      <option value="SUCCESS">성공</option>
                      <option value="FAILED">실패</option>
                      <option value="PENDING">대기</option>
                    </CFormSelect>
                  </CCol>
                )}
                <CCol md={3}>
                  <CButton color="primary" className="w-100">
                    내보내기
                  </CButton>
                </CCol>
              </CRow>

              {/* Matching Logs Table */}
              {activeTab === "logs" && (
                <CTable responsive hover>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>수의사 ID</CTableHeaderCell>
                      <CTableHeaderCell>병원 ID</CTableHeaderCell>
                      <CTableHeaderCell>매칭 점수</CTableHeaderCell>
                      <CTableHeaderCell>결과</CTableHeaderCell>
                      <CTableHeaderCell>실행 시간</CTableHeaderCell>
                      <CTableHeaderCell>모델 버전</CTableHeaderCell>
                      <CTableHeaderCell>실행 시각</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredLogs.map((log) => (
                      <CTableRow key={log.id}>
                        <CTableDataCell>
                          <code>{log.veterinarianId}</code>
                        </CTableDataCell>
                        <CTableDataCell>
                          <code>{log.hospitalId}</code>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex align-items-center">
                            <span className="me-2">{(log.matchScore * 100).toFixed(1)}%</span>
                            <CProgress
                              value={log.matchScore * 100}
                              color={getScoreColor(log.matchScore)}
                              className="flex-grow-1"
                              style={{ height: "8px" }}
                            />
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>{getResultBadge(log.result)}</CTableDataCell>
                        <CTableDataCell>{log.executionTime}초</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color="info">{log.modelVersion}</CBadge>
                        </CTableDataCell>
                        <CTableDataCell>{log.timestamp}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}

              {/* Model Versions Table */}
              {activeTab === "models" && (
                <CTable responsive hover>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>버전</CTableHeaderCell>
                      <CTableHeaderCell>모델명</CTableHeaderCell>
                      <CTableHeaderCell>정확도</CTableHeaderCell>
                      <CTableHeaderCell>상태</CTableHeaderCell>
                      <CTableHeaderCell>배포일</CTableHeaderCell>
                      <CTableHeaderCell>학습일</CTableHeaderCell>
                      <CTableHeaderCell>액션</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {modelVersions.map((model) => (
                      <CTableRow key={model.id}>
                        <CTableDataCell>
                          <code className="fw-bold">{model.version}</code>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="fw-semibold">{model.name}</div>
                          <div className="small text-medium-emphasis">
                            {model.description}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex align-items-center">
                            <span className="me-2">{(model.accuracy * 100).toFixed(1)}%</span>
                            <CProgress
                              value={model.accuracy * 100}
                              color={getScoreColor(model.accuracy)}
                              className="flex-grow-1"
                              style={{ height: "8px" }}
                            />
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>{getStatusBadge(model.status)}</CTableDataCell>
                        <CTableDataCell>{model.deployedAt}</CTableDataCell>
                        <CTableDataCell>{model.trainedOn}</CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex gap-1">
                            {model.status !== "ACTIVE" && (
                              <CButton
                                size="sm"
                                color="success"
                                variant="outline"
                                onClick={() => handleModelAction(model, "activate")}
                              >
                                활성화
                              </CButton>
                            )}
                            {model.status !== "TESTING" && (
                              <CButton
                                size="sm"
                                color="warning"
                                variant="outline"
                                onClick={() => handleModelAction(model, "test")}
                              >
                                테스트
                              </CButton>
                            )}
                            {model.status !== "DEPRECATED" && (
                              <CButton
                                size="sm"
                                color="danger"
                                variant="outline"
                                onClick={() => handleModelAction(model, "deprecate")}
                              >
                                중단
                              </CButton>
                            )}
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Model Update Modal */}
      <CModal visible={updateModalVisible} onClose={() => setUpdateModalVisible(false)} size="lg">
        <CModalHeader>
          <CModalTitle>새 모델 업데이트</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CAlert color="info">
            새로운 AI 모델을 업로드하고 배포할 수 있습니다.
            업로드된 모델은 자동으로 테스트 상태로 설정됩니다.
          </CAlert>
          <CForm>
            <div className="mb-3">
              <CFormLabel>모델 버전</CFormLabel>
              <CFormInput placeholder="예: v2.3.0" />
            </div>
            <div className="mb-3">
              <CFormLabel>모델명</CFormLabel>
              <CFormInput placeholder="모델 이름을 입력하세요" />
            </div>
            <div className="mb-3">
              <CFormLabel>설명</CFormLabel>
              <CFormTextarea
                rows={3}
                placeholder="모델에 대한 설명을 입력하세요"
              />
            </div>
            <div className="mb-3">
              <CFormLabel>모델 파일</CFormLabel>
              <CFormInput type="file" accept=".pkl,.pt,.h5" />
            </div>
            <div className="mb-3">
              <CFormLabel>학습 데이터</CFormLabel>
              <CFormInput type="file" accept=".csv,.json" multiple />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setUpdateModalVisible(false)}>
            취소
          </CButton>
          <CButton color="primary">
            <CIcon icon={cilCloudUpload} className="me-2" />
            업로드 및 배포
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
}