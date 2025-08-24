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
  CProgress,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilSearch,
  cilEye,
  cilTrash,
  cilCheckCircle,
  cilXCircle,
  cilWarning,
  cilPlay,
  cilStar,
} from "@coreui/icons";

interface Lecture {
  id: number;
  title: string;
  instructor: string;
  category: string;
  duration: number; // minutes
  status: "ACTIVE" | "PENDING" | "SUSPENDED" | "DRAFT";
  reportCount: number;
  viewCount: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  thumbnail: string;
}

export default function LecturesManagement() {
  const [lectures, setLectures] = useState<Lecture[]>([
    {
      id: 1,
      title: "반려동물 영상진단학 기초",
      instructor: "김영상 교수",
      category: "영상진단",
      duration: 120,
      status: "ACTIVE",
      reportCount: 0,
      viewCount: 1245,
      rating: 4.8,
      reviewCount: 34,
      createdAt: "2024-01-20",
      thumbnail: "/lectures/thumb1.jpg",
    },
    {
      id: 2,
      title: "고양이 내과질환 진단과 치료",
      instructor: "박내과 수의사",
      category: "내과",
      duration: 90,
      status: "ACTIVE",
      reportCount: 0,
      viewCount: 987,
      rating: 4.6,
      reviewCount: 28,
      createdAt: "2024-01-19",
      thumbnail: "/lectures/thumb2.jpg",
    },
    {
      id: 3,
      title: "소동물 외과수술 실습",
      instructor: "이외과 전문의",
      category: "외과",
      duration: 180,
      status: "PENDING",
      reportCount: 0,
      viewCount: 0,
      rating: 0,
      reviewCount: 0,
      createdAt: "2024-01-18",
      thumbnail: "/lectures/thumb3.jpg",
    },
    {
      id: 4,
      title: "반려동물 응급처치 가이드",
      instructor: "정응급 수의사",
      category: "응급의학",
      duration: 75,
      status: "ACTIVE",
      reportCount: 0,
      viewCount: 2156,
      rating: 4.9,
      reviewCount: 67,
      createdAt: "2024-01-17",
      thumbnail: "/lectures/thumb4.jpg",
    },
    {
      id: 5,
      title: "부적절한 강의 내용",
      instructor: "스팸강사",
      category: "기타",
      duration: 30,
      status: "SUSPENDED",
      reportCount: 5,
      viewCount: 45,
      rating: 1.2,
      reviewCount: 8,
      createdAt: "2024-01-15",
      thumbnail: "/lectures/thumb5.jpg",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [actionType, setActionType] = useState<"view" | "suspend" | "delete" | "approve">("view");

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { color: string; text: string } } = {
      ACTIVE: { color: "success", text: "활성" },
      PENDING: { color: "warning", text: "승인대기" },
      SUSPENDED: { color: "danger", text: "정지" },
      DRAFT: { color: "secondary", text: "임시저장" },
    };
    const statusInfo = statusMap[status] || { color: "secondary", text: status };
    return <CBadge color={statusInfo.color}>{statusInfo.text}</CBadge>;
  };

  const getCategoryBadge = (category: string) => {
    const categoryMap: { [key: string]: { color: string } } = {
      "영상진단": { color: "primary" },
      "내과": { color: "info" },
      "외과": { color: "danger" },
      "응급의학": { color: "warning" },
      "기타": { color: "secondary" },
    };
    const categoryInfo = categoryMap[category] || { color: "secondary" };
    return <CBadge color={categoryInfo.color}>{category}</CBadge>;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  const filteredLectures = lectures.filter((lecture) => {
    const matchesSearch = 
      lecture.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecture.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || lecture.status === filterStatus;
    const matchesCategory = filterCategory === "ALL" || lecture.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLectures = filteredLectures.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLectures.length / itemsPerPage);

  const handleAction = (lecture: Lecture, action: "view" | "suspend" | "delete" | "approve") => {
    setSelectedLecture(lecture);
    setActionType(action);
    setModalVisible(true);
  };

  const confirmAction = () => {
    if (!selectedLecture) return;

    setLectures((prev) =>
      prev.map((lecture) => {
        if (lecture.id === selectedLecture.id) {
          switch (actionType) {
            case "approve":
              return { ...lecture, status: "ACTIVE" as const };
            case "suspend":
              return { ...lecture, status: "SUSPENDED" as const };
            case "delete":
              return { ...lecture, status: "SUSPENDED" as const };
            default:
              return lecture;
          }
        }
        return lecture;
      })
    );

    setModalVisible(false);
    setSelectedLecture(null);
  };

  const renderActionButtons = (lecture: Lecture) => (
    <CButtonGroup size="sm">
      <CButton
        color="info"
        variant="outline"
        onClick={() => handleAction(lecture, "view")}
      >
        <CIcon icon={cilEye} />
      </CButton>
      {lecture.status === "PENDING" && (
        <CButton
          color="success"
          variant="outline"
          onClick={() => handleAction(lecture, "approve")}
        >
          <CIcon icon={cilCheckCircle} />
        </CButton>
      )}
      <CButton
        color="warning"
        variant="outline"
        onClick={() => handleAction(lecture, "suspend")}
        disabled={lecture.status === "SUSPENDED"}
      >
        <CIcon icon={cilXCircle} />
      </CButton>
      <CButton
        color="danger"
        variant="outline"
        onClick={() => handleAction(lecture, "delete")}
      >
        <CIcon icon={cilTrash} />
      </CButton>
    </CButtonGroup>
  );

  const renderRating = (rating: number) => {
    return (
      <div className="d-flex align-items-center">
        <CIcon icon={cilStar} className="text-warning me-1" />
        <span>{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <h1 className="mb-4">교육콘텐츠 관리</h1>
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
              placeholder="제목, 강사명으로 검색"
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
            <option value="PENDING">승인대기</option>
            <option value="SUSPENDED">정지</option>
            <option value="DRAFT">임시저장</option>
          </CFormSelect>
        </CCol>
        <CCol md={3}>
          <CFormSelect
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="ALL">모든 카테고리</option>
            <option value="영상진단">영상진단</option>
            <option value="내과">내과</option>
            <option value="외과">외과</option>
            <option value="응급의학">응급의학</option>
            <option value="기타">기타</option>
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
          <CCard className="bg-success text-white">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">
                  {lectures.filter(l => l.status === "ACTIVE").length}
                </div>
                <div>활성 강의</div>
              </div>
              <CIcon icon={cilPlay} height={36} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} md={3}>
          <CCard className="bg-warning text-white">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">
                  {lectures.filter(l => l.status === "PENDING").length}
                </div>
                <div>승인 대기</div>
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
                  {lectures.filter(l => l.reportCount > 0).length}
                </div>
                <div>신고된 강의</div>
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
                  {lectures.reduce((sum, lecture) => sum + lecture.viewCount, 0).toLocaleString()}
                </div>
                <div>총 조회수</div>
              </div>
              <CIcon icon={cilEye} height={36} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Lectures Table */}
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <h5 className="mb-0">강의 목록 ({filteredLectures.length}개)</h5>
            </CCardHeader>
            <CCardBody>
              <CTable responsive hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>강의명</CTableHeaderCell>
                    <CTableHeaderCell>강사</CTableHeaderCell>
                    <CTableHeaderCell>카테고리</CTableHeaderCell>
                    <CTableHeaderCell>시간</CTableHeaderCell>
                    <CTableHeaderCell>상태</CTableHeaderCell>
                    <CTableHeaderCell>평점</CTableHeaderCell>
                    <CTableHeaderCell>조회수</CTableHeaderCell>
                    <CTableHeaderCell>신고</CTableHeaderCell>
                    <CTableHeaderCell>등록일</CTableHeaderCell>
                    <CTableHeaderCell>액션</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {currentLectures.map((lecture) => (
                    <CTableRow key={lecture.id}>
                      <CTableDataCell>
                        <div className="fw-semibold">{lecture.title}</div>
                      </CTableDataCell>
                      <CTableDataCell>{lecture.instructor}</CTableDataCell>
                      <CTableDataCell>{getCategoryBadge(lecture.category)}</CTableDataCell>
                      <CTableDataCell>
                        <small>{formatDuration(lecture.duration)}</small>
                      </CTableDataCell>
                      <CTableDataCell>{getStatusBadge(lecture.status)}</CTableDataCell>
                      <CTableDataCell>
                        {lecture.rating > 0 ? (
                          <div>
                            {renderRating(lecture.rating)}
                            <small className="text-muted">({lecture.reviewCount})</small>
                          </div>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>{lecture.viewCount.toLocaleString()}</CTableDataCell>
                      <CTableDataCell>
                        {lecture.reportCount > 0 ? (
                          <CBadge color="danger">{lecture.reportCount}</CBadge>
                        ) : (
                          <span className="text-muted">0</span>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>{lecture.createdAt}</CTableDataCell>
                      <CTableDataCell>{renderActionButtons(lecture)}</CTableDataCell>
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
            {actionType === "view" && "강의 상세정보"}
            {actionType === "approve" && "강의 승인"}
            {actionType === "suspend" && "강의 정지"}
            {actionType === "delete" && "강의 삭제"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedLecture && (
            <div>
              {actionType === "view" && (
                <div>
                  <h5>{selectedLecture.title}</h5>
                  <hr />
                  <CRow>
                    <CCol md={6}>
                      <p><strong>강사:</strong> {selectedLecture.instructor}</p>
                      <p><strong>카테고리:</strong> {selectedLecture.category}</p>
                      <p><strong>강의시간:</strong> {formatDuration(selectedLecture.duration)}</p>
                      <p><strong>상태:</strong> {getStatusBadge(selectedLecture.status)}</p>
                    </CCol>
                    <CCol md={6}>
                      <p><strong>조회수:</strong> {selectedLecture.viewCount.toLocaleString()}</p>
                      <p><strong>평점:</strong> {selectedLecture.rating > 0 ? `${selectedLecture.rating}/5.0 (${selectedLecture.reviewCount}개 리뷰)` : "평가없음"}</p>
                      <p><strong>등록일:</strong> {selectedLecture.createdAt}</p>
                    </CCol>
                  </CRow>
                  {selectedLecture.reportCount > 0 && (
                    <CAlert color="warning">
                      <strong>주의:</strong> 이 강의는 {selectedLecture.reportCount}건의 신고를 받았습니다.
                    </CAlert>
                  )}
                  {selectedLecture.status === "PENDING" && (
                    <CAlert color="info">
                      <strong>알림:</strong> 이 강의는 관리자 승인을 기다리고 있습니다.
                    </CAlert>
                  )}
                </div>
              )}

              {actionType === "approve" && (
                <CAlert color="success">
                  <CIcon icon={cilCheckCircle} className="me-2" />
                  <strong>{selectedLecture.title}</strong> 강의를 승인하시겠습니까?
                  <div className="mt-2">
                    승인된 강의는 사용자에게 공개됩니다.
                  </div>
                </CAlert>
              )}

              {actionType === "suspend" && (
                <CAlert color="warning">
                  <CIcon icon={cilWarning} className="me-2" />
                  <strong>{selectedLecture.title}</strong> 강의를 정지하시겠습니까?
                  <div className="mt-2">
                    정지된 강의는 사용자에게 표시되지 않습니다.
                  </div>
                </CAlert>
              )}

              {actionType === "delete" && (
                <CAlert color="danger">
                  <strong>{selectedLecture.title}</strong> 강의를 삭제하시겠습니까?
                  <div className="mt-2">
                    삭제된 강의는 복구할 수 없습니다.
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
              color={
                actionType === "approve" ? "success" :
                actionType === "delete" ? "danger" : "warning"
              }
              onClick={confirmAction}
            >
              {actionType === "approve" && "승인"}
              {actionType === "suspend" && "정지"}
              {actionType === "delete" && "삭제"}
            </CButton>
          )}
        </CModalFooter>
      </CModal>
    </>
  );
}