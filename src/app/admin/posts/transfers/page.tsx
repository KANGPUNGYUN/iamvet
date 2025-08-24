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
  cilHome,
  cilCurrencyDollar,
} from "@coreui/icons";

interface Transfer {
  id: number;
  title: string;
  hospitalName: string;
  location: string;
  price: string;
  transferType: "양도" | "양수";
  status: "ACTIVE" | "PENDING" | "SUSPENDED" | "COMPLETED";
  reportCount: number;
  inquiryCount: number;
  createdAt: string;
  viewCount: number;
  description: string;
}

export default function TransfersManagement() {
  const [transfers, setTransfers] = useState<Transfer[]>([
    {
      id: 1,
      title: "서울 강남구 동물병원 양도",
      hospitalName: "강남펫클리닉",
      location: "서울 강남구",
      price: "15억원",
      transferType: "양도",
      status: "ACTIVE",
      reportCount: 0,
      inquiryCount: 8,
      createdAt: "2024-01-20",
      viewCount: 456,
      description: "최신 의료장비 완비, 안정적인 고객층 보유",
    },
    {
      id: 2,
      title: "부산 해운대 동물병원 인수 희망",
      hospitalName: "",
      location: "부산 해운대구",
      price: "5억원~8억원",
      transferType: "양수",
      status: "ACTIVE",
      reportCount: 0,
      inquiryCount: 3,
      createdAt: "2024-01-19",
      viewCount: 234,
      description: "경력 10년 수의사, 해운대 지역 선호",
    },
    {
      id: 3,
      title: "대구 수성구 24시 동물병원 양도",
      hospitalName: "대구24시동물병원",
      location: "대구 수성구",
      price: "협의",
      transferType: "양도",
      status: "PENDING",
      reportCount: 0,
      inquiryCount: 12,
      createdAt: "2024-01-18",
      viewCount: 678,
      description: "24시간 운영, 응급실 완비",
    },
    {
      id: 4,
      title: "인천 송도 동물병원 양도",
      hospitalName: "송도펫케어",
      location: "인천 연수구",
      price: "12억원",
      transferType: "양도",
      status: "COMPLETED",
      reportCount: 0,
      inquiryCount: 15,
      createdAt: "2024-01-15",
      viewCount: 890,
      description: "신도시 위치, 높은 성장 잠재력",
    },
    {
      id: 5,
      title: "허위 양도 정보",
      hospitalName: "가짜병원",
      location: "가짜 주소",
      price: "비현실적 가격",
      transferType: "양도",
      status: "SUSPENDED",
      reportCount: 6,
      inquiryCount: 2,
      createdAt: "2024-01-10",
      viewCount: 45,
      description: "허위 정보로 신고됨",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [actionType, setActionType] = useState<"view" | "suspend" | "delete" | "approve">("view");

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { color: string; text: string } } = {
      ACTIVE: { color: "success", text: "활성" },
      PENDING: { color: "warning", text: "승인대기" },
      SUSPENDED: { color: "danger", text: "정지" },
      COMPLETED: { color: "info", text: "완료" },
    };
    const statusInfo = statusMap[status] || { color: "secondary", text: status };
    return <CBadge color={statusInfo.color}>{statusInfo.text}</CBadge>;
  };

  const getTypeBadge = (type: string) => {
    const typeMap: { [key: string]: { color: string } } = {
      "양도": { color: "primary" },
      "양수": { color: "success" },
    };
    const typeInfo = typeMap[type] || { color: "secondary" };
    return <CBadge color={typeInfo.color}>{type}</CBadge>;
  };

  const filteredTransfers = transfers.filter((transfer) => {
    const matchesSearch = 
      transfer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || transfer.status === filterStatus;
    const matchesType = filterType === "ALL" || transfer.transferType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransfers = filteredTransfers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransfers.length / itemsPerPage);

  const handleAction = (transfer: Transfer, action: "view" | "suspend" | "delete" | "approve") => {
    setSelectedTransfer(transfer);
    setActionType(action);
    setModalVisible(true);
  };

  const confirmAction = () => {
    if (!selectedTransfer) return;

    setTransfers((prev) =>
      prev.map((transfer) => {
        if (transfer.id === selectedTransfer.id) {
          switch (actionType) {
            case "approve":
              return { ...transfer, status: "ACTIVE" as const };
            case "suspend":
              return { ...transfer, status: "SUSPENDED" as const };
            case "delete":
              return { ...transfer, status: "SUSPENDED" as const };
            default:
              return transfer;
          }
        }
        return transfer;
      })
    );

    setModalVisible(false);
    setSelectedTransfer(null);
  };

  const renderActionButtons = (transfer: Transfer) => (
    <CButtonGroup size="sm">
      <CButton
        color="info"
        variant="outline"
        onClick={() => handleAction(transfer, "view")}
      >
        <CIcon icon={cilEye} />
      </CButton>
      {transfer.status === "PENDING" && (
        <CButton
          color="success"
          variant="outline"
          onClick={() => handleAction(transfer, "approve")}
        >
          <CIcon icon={cilCheckCircle} />
        </CButton>
      )}
      <CButton
        color="warning"
        variant="outline"
        onClick={() => handleAction(transfer, "suspend")}
        disabled={transfer.status === "SUSPENDED"}
      >
        <CIcon icon={cilXCircle} />
      </CButton>
      <CButton
        color="danger"
        variant="outline"
        onClick={() => handleAction(transfer, "delete")}
      >
        <CIcon icon={cilTrash} />
      </CButton>
    </CButtonGroup>
  );

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <h1 className="mb-4">양도양수 관리</h1>
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
            <option value="PENDING">승인대기</option>
            <option value="SUSPENDED">정지</option>
            <option value="COMPLETED">완료</option>
          </CFormSelect>
        </CCol>
        <CCol md={3}>
          <CFormSelect
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="ALL">모든 유형</option>
            <option value="양도">양도</option>
            <option value="양수">양수</option>
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
                  {transfers.filter(t => t.status === "ACTIVE").length}
                </div>
                <div>활성 게시물</div>
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
                  {transfers.filter(t => t.status === "PENDING").length}
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
                  {transfers.filter(t => t.reportCount > 0).length}
                </div>
                <div>신고된 게시물</div>
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
                  {transfers.reduce((sum, transfer) => sum + transfer.inquiryCount, 0)}
                </div>
                <div>총 문의수</div>
              </div>
              <CIcon icon={cilHome} height={36} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Transfers Table */}
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <h5 className="mb-0">양도양수 목록 ({filteredTransfers.length}개)</h5>
            </CCardHeader>
            <CCardBody>
              <CTable responsive hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>제목</CTableHeaderCell>
                    <CTableHeaderCell>병원/지역</CTableHeaderCell>
                    <CTableHeaderCell>가격</CTableHeaderCell>
                    <CTableHeaderCell>유형</CTableHeaderCell>
                    <CTableHeaderCell>상태</CTableHeaderCell>
                    <CTableHeaderCell>문의</CTableHeaderCell>
                    <CTableHeaderCell>신고</CTableHeaderCell>
                    <CTableHeaderCell>조회수</CTableHeaderCell>
                    <CTableHeaderCell>등록일</CTableHeaderCell>
                    <CTableHeaderCell>액션</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {currentTransfers.map((transfer) => (
                    <CTableRow key={transfer.id}>
                      <CTableDataCell>
                        <div className="fw-semibold">{transfer.title}</div>
                        <small className="text-muted">{transfer.description}</small>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{transfer.hospitalName}</div>
                        <small className="text-muted">{transfer.location}</small>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="fw-semibold text-success">
                          <CIcon icon={cilCurrencyDollar} className="me-1" />
                          {transfer.price}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>{getTypeBadge(transfer.transferType)}</CTableDataCell>
                      <CTableDataCell>{getStatusBadge(transfer.status)}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="info">{transfer.inquiryCount}건</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        {transfer.reportCount > 0 ? (
                          <CBadge color="danger">{transfer.reportCount}</CBadge>
                        ) : (
                          <span className="text-muted">0</span>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>{transfer.viewCount.toLocaleString()}</CTableDataCell>
                      <CTableDataCell>{transfer.createdAt}</CTableDataCell>
                      <CTableDataCell>{renderActionButtons(transfer)}</CTableDataCell>
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
            {actionType === "view" && "양도양수 상세정보"}
            {actionType === "approve" && "게시물 승인"}
            {actionType === "suspend" && "게시물 정지"}
            {actionType === "delete" && "게시물 삭제"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedTransfer && (
            <div>
              {actionType === "view" && (
                <div>
                  <h5>{selectedTransfer.title}</h5>
                  <hr />
                  <CRow>
                    <CCol md={6}>
                      <p><strong>병원명:</strong> {selectedTransfer.hospitalName || "정보없음"}</p>
                      <p><strong>위치:</strong> {selectedTransfer.location}</p>
                      <p><strong>가격:</strong> {selectedTransfer.price}</p>
                      <p><strong>유형:</strong> {getTypeBadge(selectedTransfer.transferType)}</p>
                    </CCol>
                    <CCol md={6}>
                      <p><strong>상태:</strong> {getStatusBadge(selectedTransfer.status)}</p>
                      <p><strong>문의 수:</strong> {selectedTransfer.inquiryCount}건</p>
                      <p><strong>조회수:</strong> {selectedTransfer.viewCount.toLocaleString()}</p>
                      <p><strong>등록일:</strong> {selectedTransfer.createdAt}</p>
                    </CCol>
                  </CRow>
                  <div className="mt-3">
                    <p><strong>설명:</strong></p>
                    <p>{selectedTransfer.description}</p>
                  </div>
                  {selectedTransfer.reportCount > 0 && (
                    <CAlert color="warning">
                      <strong>주의:</strong> 이 게시물은 {selectedTransfer.reportCount}건의 신고를 받았습니다.
                    </CAlert>
                  )}
                  {selectedTransfer.status === "PENDING" && (
                    <CAlert color="info">
                      <strong>알림:</strong> 이 게시물은 관리자 승인을 기다리고 있습니다.
                    </CAlert>
                  )}
                </div>
              )}

              {actionType === "approve" && (
                <CAlert color="success">
                  <CIcon icon={cilCheckCircle} className="me-2" />
                  <strong>{selectedTransfer.title}</strong> 게시물을 승인하시겠습니까?
                  <div className="mt-2">
                    승인된 게시물은 사용자에게 공개됩니다.
                  </div>
                </CAlert>
              )}

              {actionType === "suspend" && (
                <CAlert color="warning">
                  <CIcon icon={cilWarning} className="me-2" />
                  <strong>{selectedTransfer.title}</strong> 게시물을 정지하시겠습니까?
                  <div className="mt-2">
                    정지된 게시물은 사용자에게 표시되지 않습니다.
                  </div>
                </CAlert>
              )}

              {actionType === "delete" && (
                <CAlert color="danger">
                  <strong>{selectedTransfer.title}</strong> 게시물을 삭제하시겠습니까?
                  <div className="mt-2">
                    삭제된 게시물은 복구할 수 없습니다.
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