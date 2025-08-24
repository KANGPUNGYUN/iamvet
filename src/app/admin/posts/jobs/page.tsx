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
} from "@coreui/icons";

interface JobPost {
  id: number;
  title: string;
  hospitalName: string;
  location: string;
  salary: string;
  workType: string;
  status: "ACTIVE" | "PENDING" | "SUSPENDED" | "EXPIRED";
  reportCount: number;
  applicantCount: number;
  createdAt: string;
  viewCount: number;
}

export default function JobPostsManagement() {
  const [jobPosts, setJobPosts] = useState<JobPost[]>([
    {
      id: 1,
      title: "경력 수의사 모집 (정규직)",
      hospitalName: "서울동물병원",
      location: "서울 강남구",
      salary: "연봉 5000~7000만원",
      workType: "정규직",
      status: "ACTIVE",
      reportCount: 0,
      applicantCount: 12,
      createdAt: "2024-01-20",
      viewCount: 245,
    },
    {
      id: 2,
      title: "신입 수의사 채용",
      hospitalName: "부산해운대동물병원",
      location: "부산 해운대구",
      salary: "연봉 4000~5000만원",
      workType: "정규직",
      status: "ACTIVE",
      reportCount: 0,
      applicantCount: 8,
      createdAt: "2024-01-19",
      viewCount: 189,
    },
    {
      id: 3,
      title: "파트타임 수의사 모집",
      hospitalName: "대구수성동물병원",
      location: "대구 수성구",
      salary: "시급 50,000원",
      workType: "파트타임",
      status: "PENDING",
      reportCount: 1,
      applicantCount: 3,
      createdAt: "2024-01-18",
      viewCount: 87,
    },
    {
      id: 4,
      title: "야간 응급 수의사 급구",
      hospitalName: "24시응급동물병원",
      location: "인천 남동구",
      salary: "협의",
      workType: "계약직",
      status: "ACTIVE",
      reportCount: 0,
      applicantCount: 5,
      createdAt: "2024-01-17",
      viewCount: 156,
    },
    {
      id: 5,
      title: "허위 채용 공고",
      hospitalName: "가짜병원",
      location: "가짜 주소",
      salary: "비현실적 급여",
      workType: "정규직",
      status: "SUSPENDED",
      reportCount: 8,
      applicantCount: 0,
      createdAt: "2024-01-15",
      viewCount: 23,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterWorkType, setFilterWorkType] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [actionType, setActionType] = useState<"view" | "suspend" | "delete">("view");

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { color: string; text: string } } = {
      ACTIVE: { color: "success", text: "활성" },
      PENDING: { color: "warning", text: "검토중" },
      SUSPENDED: { color: "danger", text: "정지" },
      EXPIRED: { color: "secondary", text: "만료" },
    };
    const statusInfo = statusMap[status] || { color: "secondary", text: status };
    return <CBadge color={statusInfo.color}>{statusInfo.text}</CBadge>;
  };

  const getWorkTypeBadge = (workType: string) => {
    const typeMap: { [key: string]: { color: string } } = {
      "정규직": { color: "primary" },
      "계약직": { color: "info" },
      "파트타임": { color: "warning" },
      "인턴": { color: "secondary" },
    };
    const typeInfo = typeMap[workType] || { color: "secondary" };
    return <CBadge color={typeInfo.color}>{workType}</CBadge>;
  };

  const filteredJobs = jobPosts.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || job.status === filterStatus;
    const matchesWorkType = filterWorkType === "ALL" || job.workType === filterWorkType;
    return matchesSearch && matchesStatus && matchesWorkType;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  const handleAction = (job: JobPost, action: "view" | "suspend" | "delete") => {
    setSelectedJob(job);
    setActionType(action);
    setModalVisible(true);
  };

  const confirmAction = () => {
    if (!selectedJob) return;

    setJobPosts((prev) =>
      prev.map((job) => {
        if (job.id === selectedJob.id) {
          switch (actionType) {
            case "suspend":
              return { ...job, status: "SUSPENDED" as const };
            case "delete":
              return { ...job, status: "SUSPENDED" as const };
            default:
              return job;
          }
        }
        return job;
      })
    );

    setModalVisible(false);
    setSelectedJob(null);
  };

  const renderActionButtons = (job: JobPost) => (
    <CButtonGroup size="sm">
      <CButton
        color="info"
        variant="outline"
        onClick={() => handleAction(job, "view")}
      >
        <CIcon icon={cilEye} />
      </CButton>
      <CButton
        color="warning"
        variant="outline"
        onClick={() => handleAction(job, "suspend")}
        disabled={job.status === "SUSPENDED"}
      >
        <CIcon icon={cilXCircle} />
      </CButton>
      <CButton
        color="danger"
        variant="outline"
        onClick={() => handleAction(job, "delete")}
      >
        <CIcon icon={cilTrash} />
      </CButton>
    </CButtonGroup>
  );

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <h1 className="mb-4">채용공고 관리</h1>
        </CCol>
      </CRow>

      {/* Search and Filters */}
      <CRow className="mb-4">
        <CCol md={4}>
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon={cilSearch} />
            </CInputGroupText>
            <CFormInput
              placeholder="제목, 병원명, 지역으로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CInputGroup>
        </CCol>
        <CCol md={3}>
          <CFormSelect
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">모든 상태</option>
            <option value="ACTIVE">활성</option>
            <option value="PENDING">검토중</option>
            <option value="SUSPENDED">정지</option>
            <option value="EXPIRED">만료</option>
          </CFormSelect>
        </CCol>
        <CCol md={3}>
          <CFormSelect
            value={filterWorkType}
            onChange={(e) => setFilterWorkType(e.target.value)}
          >
            <option value="ALL">모든 근무형태</option>
            <option value="정규직">정규직</option>
            <option value="계약직">계약직</option>
            <option value="파트타임">파트타임</option>
            <option value="인턴">인턴</option>
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
          <CCard className="bg-primary text-white">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">
                  {jobPosts.filter(j => j.status === "ACTIVE").length}
                </div>
                <div>활성 공고</div>
              </div>
              <CIcon icon={cilCheckCircle} height={36} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} md={3}>
          <CCard className="bg-warning text-white">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">
                  {jobPosts.filter(j => j.status === "PENDING").length}
                </div>
                <div>검토 대기</div>
              </div>
              <CIcon icon={cilWarning} height={36} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} md={3}>
          <CCard className="bg-danger text-white">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">
                  {jobPosts.filter(j => j.reportCount > 0).length}
                </div>
                <div>신고된 공고</div>
              </div>
              <CIcon icon={cilXCircle} height={36} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} md={3}>
          <CCard className="bg-info text-white">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">
                  {jobPosts.reduce((sum, job) => sum + job.applicantCount, 0)}
                </div>
                <div>총 지원자</div>
              </div>
              <CIcon icon={cilEye} height={36} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Jobs Table */}
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <h5 className="mb-0">채용공고 목록 ({filteredJobs.length}개)</h5>
            </CCardHeader>
            <CCardBody>
              <CTable responsive hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>제목</CTableHeaderCell>
                    <CTableHeaderCell>병원</CTableHeaderCell>
                    <CTableHeaderCell>지역</CTableHeaderCell>
                    <CTableHeaderCell>급여</CTableHeaderCell>
                    <CTableHeaderCell>근무형태</CTableHeaderCell>
                    <CTableHeaderCell>상태</CTableHeaderCell>
                    <CTableHeaderCell>지원자</CTableHeaderCell>
                    <CTableHeaderCell>신고</CTableHeaderCell>
                    <CTableHeaderCell>조회수</CTableHeaderCell>
                    <CTableHeaderCell>등록일</CTableHeaderCell>
                    <CTableHeaderCell>액션</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {currentJobs.map((job) => (
                    <CTableRow key={job.id}>
                      <CTableDataCell>
                        <div className="fw-semibold">{job.title}</div>
                      </CTableDataCell>
                      <CTableDataCell>{job.hospitalName}</CTableDataCell>
                      <CTableDataCell>{job.location}</CTableDataCell>
                      <CTableDataCell>
                        <small>{job.salary}</small>
                      </CTableDataCell>
                      <CTableDataCell>{getWorkTypeBadge(job.workType)}</CTableDataCell>
                      <CTableDataCell>{getStatusBadge(job.status)}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="info">{job.applicantCount}명</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        {job.reportCount > 0 ? (
                          <CBadge color="danger">{job.reportCount}</CBadge>
                        ) : (
                          <span className="text-muted">0</span>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>{job.viewCount.toLocaleString()}</CTableDataCell>
                      <CTableDataCell>{job.createdAt}</CTableDataCell>
                      <CTableDataCell>{renderActionButtons(job)}</CTableDataCell>
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
            {actionType === "view" && "채용공고 상세"}
            {actionType === "suspend" && "채용공고 정지"}
            {actionType === "delete" && "채용공고 삭제"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedJob && (
            <div>
              {actionType === "view" && (
                <div>
                  <h5>{selectedJob.title}</h5>
                  <hr />
                  <CRow>
                    <CCol md={6}>
                      <p><strong>병원명:</strong> {selectedJob.hospitalName}</p>
                      <p><strong>위치:</strong> {selectedJob.location}</p>
                      <p><strong>급여:</strong> {selectedJob.salary}</p>
                      <p><strong>근무형태:</strong> {selectedJob.workType}</p>
                    </CCol>
                    <CCol md={6}>
                      <p><strong>상태:</strong> {getStatusBadge(selectedJob.status)}</p>
                      <p><strong>지원자 수:</strong> {selectedJob.applicantCount}명</p>
                      <p><strong>조회수:</strong> {selectedJob.viewCount.toLocaleString()}</p>
                      <p><strong>등록일:</strong> {selectedJob.createdAt}</p>
                    </CCol>
                  </CRow>
                  {selectedJob.reportCount > 0 && (
                    <CAlert color="warning">
                      <strong>주의:</strong> 이 공고는 {selectedJob.reportCount}건의 신고를 받았습니다.
                    </CAlert>
                  )}
                </div>
              )}

              {actionType === "suspend" && (
                <CAlert color="warning">
                  <CIcon icon={cilWarning} className="me-2" />
                  <strong>{selectedJob.title}</strong> 채용공고를 정지하시겠습니까?
                  <div className="mt-2">
                    정지된 공고는 사용자에게 표시되지 않습니다.
                  </div>
                </CAlert>
              )}

              {actionType === "delete" && (
                <CAlert color="danger">
                  <strong>{selectedJob.title}</strong> 채용공고를 삭제하시겠습니까?
                  <div className="mt-2">
                    삭제된 공고는 복구할 수 없습니다.
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
              color={actionType === "delete" ? "danger" : "warning"}
              onClick={confirmAction}
            >
              {actionType === "suspend" && "정지"}
              {actionType === "delete" && "삭제"}
            </CButton>
          )}
        </CModalFooter>
      </CModal>
    </>
  );
}