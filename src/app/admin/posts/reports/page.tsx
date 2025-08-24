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
  CButtonGroup,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CFormSelect,
  CPagination,
  CPaginationItem,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilSearch,
  cilEye,
  cilTrash,
  cilCheckCircle,
  cilXCircle,
  cilWarning,
  cilFlag,
  cilUser,
} from "@coreui/icons";

interface Report {
  id: number;
  contentType: "JOB" | "LECTURE" | "TRANSFER" | "FORUM";
  contentTitle: string;
  contentId: number;
  reportReason: string;
  reporterName: string;
  reporterEmail: string;
  status: "PENDING" | "RESOLVED" | "REJECTED" | "IN_REVIEW";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  reportedAt: string;
  resolvedAt?: string;
  adminNote?: string;
  reportDetails: string;
}

export default function ReportsManagement() {
  const [reports, setReports] = useState<Report[]>([
    {
      id: 1,
      contentType: "JOB",
      contentTitle: "허위 채용 공고",
      contentId: 5,
      reportReason: "허위 정보",
      reporterName: "김신고자",
      reporterEmail: "reporter1@test.com",
      status: "PENDING",
      severity: "HIGH",
      reportedAt: "2024-01-22",
      reportDetails: "실제 존재하지 않는 병원명과 연락처를 사용하여 허위 채용공고를 게시했습니다.",
    },
    {
      id: 2,
      contentType: "LECTURE",
      contentTitle: "부적절한 강의 내용",
      contentId: 5,
      reportReason: "부적절한 내용",
      reporterName: "박수의사",
      reporterEmail: "reporter2@test.com",
      status: "IN_REVIEW",
      severity: "MEDIUM",
      reportedAt: "2024-01-21",
      reportDetails: "강의 내용이 수의학과 관련없는 내용으로 구성되어 있으며, 광고성 내용이 포함되어 있습니다.",
    },
    {
      id: 3,
      contentType: "TRANSFER",
      contentTitle: "허위 양도 정보",
      contentId: 5,
      reportReason: "사기 의심",
      reporterName: "이병원장",
      reporterEmail: "reporter3@test.com",
      status: "RESOLVED",
      severity: "CRITICAL",
      reportedAt: "2024-01-20",
      resolvedAt: "2024-01-21",
      adminNote: "허위 정보로 확인되어 게시물 정지 처리",
      reportDetails: "존재하지 않는 병원 정보와 비현실적인 가격으로 사기 시도가 의심됩니다.",
    },
    {
      id: 4,
      contentType: "FORUM",
      contentTitle: "욕설 및 비방 게시물",
      contentId: 12,
      reportReason: "욕설/비방",
      reporterName: "최수의사",
      reporterEmail: "reporter4@test.com",
      status: "RESOLVED",
      severity: "MEDIUM",
      reportedAt: "2024-01-19",
      resolvedAt: "2024-01-20",
      adminNote: "게시물 삭제 및 사용자 경고 처리",
      reportDetails: "다른 수의사에 대한 욕설과 인신공격성 발언이 포함되어 있습니다.",
    },
    {
      id: 5,
      contentType: "JOB",
      contentTitle: "차별적 채용 공고",
      contentId: 8,
      reportReason: "차별 내용",
      reporterName: "정평등주의",
      reporterEmail: "reporter5@test.com",
      status: "REJECTED",
      severity: "LOW",
      reportedAt: "2024-01-18",
      resolvedAt: "2024-01-19",
      adminNote: "합법적인 자격 요건으로 판단하여 반려",
      reportDetails: "성별, 나이 제한이 있다고 신고했으나 직무상 필요한 요건으로 판단됩니다.",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterSeverity, setFilterSeverity] = useState("ALL");
  const [filterContentType, setFilterContentType] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [actionType, setActionType] = useState<"view" | "resolve" | "reject">("view");

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { color: string; text: string } } = {
      PENDING: { color: "warning", text: "대기중" },
      IN_REVIEW: { color: "info", text: "검토중" },
      RESOLVED: { color: "success", text: "처리완료" },
      REJECTED: { color: "danger", text: "반려" },
    };
    const statusInfo = statusMap[status] || { color: "secondary", text: status };
    return <CBadge color={statusInfo.color}>{statusInfo.text}</CBadge>;
  };

  const getSeverityBadge = (severity: string) => {
    const severityMap: { [key: string]: { color: string; text: string } } = {
      LOW: { color: "secondary", text: "낮음" },
      MEDIUM: { color: "warning", text: "보통" },
      HIGH: { color: "danger", text: "높음" },
      CRITICAL: { color: "dark", text: "긴급" },
    };
    const severityInfo = severityMap[severity] || { color: "secondary", text: severity };
    return <CBadge color={severityInfo.color}>{severityInfo.text}</CBadge>;
  };

  const getContentTypeBadge = (type: string) => {
    const typeMap: { [key: string]: { color: string; text: string } } = {
      JOB: { color: "primary", text: "채용공고" },
      LECTURE: { color: "success", text: "강의" },
      TRANSFER: { color: "info", text: "양도양수" },
      FORUM: { color: "warning", text: "포럼" },
    };
    const typeInfo = typeMap[type] || { color: "secondary", text: type };
    return <CBadge color={typeInfo.color}>{typeInfo.text}</CBadge>;
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch = 
      report.contentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportReason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || report.status === filterStatus;
    const matchesSeverity = filterSeverity === "ALL" || report.severity === filterSeverity;
    const matchesContentType = filterContentType === "ALL" || report.contentType === filterContentType;
    return matchesSearch && matchesStatus && matchesSeverity && matchesContentType;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const handleAction = (report: Report, action: "view" | "resolve" | "reject") => {
    setSelectedReport(report);
    setActionType(action);
    setModalVisible(true);
  };

  const confirmAction = () => {
    if (!selectedReport) return;

    const currentDate = new Date().toISOString().split("T")[0];

    setReports((prev) =>
      prev.map((report) => {
        if (report.id === selectedReport.id) {
          switch (actionType) {
            case "resolve":
              return { 
                ...report, 
                status: "RESOLVED" as const, 
                resolvedAt: currentDate,
                adminNote: "관리자에 의해 처리됨"
              };
            case "reject":
              return { 
                ...report, 
                status: "REJECTED" as const, 
                resolvedAt: currentDate,
                adminNote: "신고 내용이 부적절하여 반려"
              };
            default:
              return report;
          }
        }
        return report;
      })
    );

    setModalVisible(false);
    setSelectedReport(null);
  };

  const renderActionButtons = (report: Report) => (
    <CButtonGroup size="sm">
      <CButton
        color="info"
        variant="outline"
        onClick={() => handleAction(report, "view")}
      >
        <CIcon icon={cilEye} />
      </CButton>
      {report.status === "PENDING" && (
        <>
          <CButton
            color="success"
            variant="outline"
            onClick={() => handleAction(report, "resolve")}
          >
            <CIcon icon={cilCheckCircle} />
          </CButton>
          <CButton
            color="danger"
            variant="outline"
            onClick={() => handleAction(report, "reject")}
          >
            <CIcon icon={cilXCircle} />
          </CButton>
        </>
      )}
    </CButtonGroup>
  );

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <h1 className="mb-4">신고 관리</h1>
        </CCol>
      </CRow>

      {/* Search and Filters */}
      <CRow className="mb-4">
        <CCol md={3}>
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon={cilSearch} />
            </CInputGroupText>
            <CFormInput
              placeholder="제목, 신고자, 사유로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CInputGroup>
        </CCol>
        <CCol md={2}>
          <CFormSelect
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">모든 상태</option>
            <option value="PENDING">대기중</option>
            <option value="IN_REVIEW">검토중</option>
            <option value="RESOLVED">처리완료</option>
            <option value="REJECTED">반려</option>
          </CFormSelect>
        </CCol>
        <CCol md={2}>
          <CFormSelect
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
          >
            <option value="ALL">모든 심각도</option>
            <option value="LOW">낮음</option>
            <option value="MEDIUM">보통</option>
            <option value="HIGH">높음</option>
            <option value="CRITICAL">긴급</option>
          </CFormSelect>
        </CCol>
        <CCol md={3}>
          <CFormSelect
            value={filterContentType}
            onChange={(e) => setFilterContentType(e.target.value)}
          >
            <option value="ALL">모든 콘텐츠 유형</option>
            <option value="JOB">채용공고</option>
            <option value="LECTURE">강의</option>
            <option value="TRANSFER">양도양수</option>
            <option value="FORUM">포럼</option>
          </CFormSelect>
        </CCol>
        <CCol md={2}>
          <CButton color="primary" className="w-100">
            내보내기
          </CButton>
        </CCol>
      </CRow>

      {/* Stats Cards */}
      <CRow className="mb-4">
        <CCol sm={6} md={3}>
          <CCard className="bg-warning text-white">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">
                  {reports.filter(r => r.status === "PENDING").length}
                </div>
                <div>대기중인 신고</div>
              </div>
              <CIcon icon={cilWarning} height={36} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} md={3}>
          <CCard className="bg-info text-white">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">
                  {reports.filter(r => r.status === "IN_REVIEW").length}
                </div>
                <div>검토중</div>
              </div>
              <CIcon icon={cilEye} height={36} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} md={3}>
          <CCard className="bg-danger text-white">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">
                  {reports.filter(r => r.severity === "HIGH" || r.severity === "CRITICAL").length}
                </div>
                <div>긴급 신고</div>
              </div>
              <CIcon icon={cilFlag} height={36} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} md={3}>
          <CCard className="bg-success text-white">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">
                  {reports.filter(r => r.status === "RESOLVED").length}
                </div>
                <div>처리 완료</div>
              </div>
              <CIcon icon={cilCheckCircle} height={36} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Reports Table */}
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <h5 className="mb-0">신고 목록 ({filteredReports.length}개)</h5>
            </CCardHeader>
            <CCardBody>
              <CTable responsive hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>콘텐츠 정보</CTableHeaderCell>
                    <CTableHeaderCell>신고자</CTableHeaderCell>
                    <CTableHeaderCell>신고 사유</CTableHeaderCell>
                    <CTableHeaderCell>심각도</CTableHeaderCell>
                    <CTableHeaderCell>상태</CTableHeaderCell>
                    <CTableHeaderCell>신고일</CTableHeaderCell>
                    <CTableHeaderCell>처리일</CTableHeaderCell>
                    <CTableHeaderCell>액션</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {currentReports.map((report) => (
                    <CTableRow key={report.id}>
                      <CTableDataCell>
                        <div>
                          {getContentTypeBadge(report.contentType)}
                          <div className="fw-semibold mt-1">{report.contentTitle}</div>
                          <small className="text-muted">ID: {report.contentId}</small>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex align-items-center">
                          <CIcon icon={cilUser} className="me-2" />
                          <div>
                            <div>{report.reporterName}</div>
                            <small className="text-muted">{report.reporterEmail}</small>
                          </div>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="fw-semibold">{report.reportReason}</div>
                        <small className="text-muted">{report.reportDetails.slice(0, 50)}...</small>
                      </CTableDataCell>
                      <CTableDataCell>{getSeverityBadge(report.severity)}</CTableDataCell>
                      <CTableDataCell>{getStatusBadge(report.status)}</CTableDataCell>
                      <CTableDataCell>{report.reportedAt}</CTableDataCell>
                      <CTableDataCell>
                        {report.resolvedAt ? (
                          <span>{report.resolvedAt}</span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>{renderActionButtons(report)}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <CPagination>
                    <CPaginationItem
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      이전
                    </CPaginationItem>
                    {[...Array(totalPages)].map((_, index) => (
                      <CPaginationItem
                        key={index + 1}
                        active={currentPage === index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </CPaginationItem>
                    ))}
                    <CPaginationItem
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      다음
                    </CPaginationItem>
                  </CPagination>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Action Modal */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg">
        <CModalHeader>
          <CModalTitle>
            {actionType === "view" && "신고 상세정보"}
            {actionType === "resolve" && "신고 처리"}
            {actionType === "reject" && "신고 반려"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedReport && (
            <div>
              {actionType === "view" && (
                <div>
                  <h5>신고 정보</h5>
                  <hr />
                  <CRow>
                    <CCol md={6}>
                      <p><strong>콘텐츠 유형:</strong> {getContentTypeBadge(selectedReport.contentType)}</p>
                      <p><strong>콘텐츠 제목:</strong> {selectedReport.contentTitle}</p>
                      <p><strong>콘텐츠 ID:</strong> {selectedReport.contentId}</p>
                      <p><strong>신고 사유:</strong> {selectedReport.reportReason}</p>
                    </CCol>
                    <CCol md={6}>
                      <p><strong>신고자:</strong> {selectedReport.reporterName}</p>
                      <p><strong>이메일:</strong> {selectedReport.reporterEmail}</p>
                      <p><strong>심각도:</strong> {getSeverityBadge(selectedReport.severity)}</p>
                      <p><strong>상태:</strong> {getStatusBadge(selectedReport.status)}</p>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md={6}>
                      <p><strong>신고일:</strong> {selectedReport.reportedAt}</p>
                    </CCol>
                    <CCol md={6}>
                      <p><strong>처리일:</strong> {selectedReport.resolvedAt || "미처리"}</p>
                    </CCol>
                  </CRow>
                  <div className="mt-3">
                    <p><strong>신고 상세 내용:</strong></p>
                    <p className="p-3 bg-light rounded">{selectedReport.reportDetails}</p>
                  </div>
                  {selectedReport.adminNote && (
                    <div className="mt-3">
                      <p><strong>관리자 메모:</strong></p>
                      <p className="p-3 bg-info text-white rounded">{selectedReport.adminNote}</p>
                    </div>
                  )}
                </div>
              )}

              {actionType === "resolve" && (
                <CAlert color="success">
                  <CIcon icon={cilCheckCircle} className="me-2" />
                  <strong>{selectedReport.contentTitle}</strong>에 대한 신고를 처리 완료로 변경하시겠습니까?
                  <div className="mt-2">
                    <strong>신고 사유:</strong> {selectedReport.reportReason}
                  </div>
                  <div className="mt-2">
                    처리 완료 시 해당 콘텐츠에 대한 적절한 조치가 취해졌음을 의미합니다.
                  </div>
                </CAlert>
              )}

              {actionType === "reject" && (
                <CAlert color="danger">
                  <CIcon icon={cilXCircle} className="me-2" />
                  <strong>{selectedReport.contentTitle}</strong>에 대한 신고를 반려하시겠습니까?
                  <div className="mt-2">
                    <strong>신고 사유:</strong> {selectedReport.reportReason}
                  </div>
                  <div className="mt-2">
                    반려 시 신고 내용이 부적절하거나 조치가 불필요함을 의미합니다.
                  </div>
                </CAlert>
              )}
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            취소
          </CButton>
          {actionType !== "view" && (
            <CButton
              color={actionType === "resolve" ? "success" : "danger"}
              onClick={confirmAction}
            >
              {actionType === "resolve" && "처리 완료"}
              {actionType === "reject" && "반려"}
            </CButton>
          )}
        </CModalFooter>
      </CModal>
    </>
  );
}