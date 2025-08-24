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
  CForm,
  CFormLabel,
  CAlert,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilSearch,
  cilPencil,
  cilTrash,
  cilLockLocked,
  cilLockUnlocked,
  cilUser,
  cilBuilding,
} from "@coreui/icons";

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
  const [actionType, setActionType] = useState<"edit" | "suspend" | "delete">("edit");

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "ALL" || user.type === filterType;
    const matchesStatus = filterStatus === "ALL" || user.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { color: string; text: string } } = {
      ACTIVE: { color: "success", text: "활성" },
      PENDING: { color: "warning", text: "대기" },
      SUSPENDED: { color: "danger", text: "정지" },
      INACTIVE: { color: "secondary", text: "비활성" },
    };
    const statusInfo = statusMap[status] || { color: "secondary", text: status };
    return <CBadge color={statusInfo.color}>{statusInfo.text}</CBadge>;
  };

  const getRoleBadge = (role: string) => {
    const roleMap: { [key: string]: { color: string; text: string } } = {
      USER: { color: "info", text: "일반사용자" },
      ADMIN: { color: "warning", text: "관리자" },
      SUPER_ADMIN: { color: "danger", text: "슈퍼관리자" },
    };
    const roleInfo = roleMap[role] || { color: "secondary", text: role };
    return <CBadge color={roleInfo.color}>{roleInfo.text}</CBadge>;
  };

  const handleAction = (user: User, action: "edit" | "suspend" | "delete") => {
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
                status: user.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED" as const,
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
    <CButtonGroup size="sm">
      <CButton
        color="primary"
        variant="outline"
        onClick={() => handleAction(user, "edit")}
      >
        <CIcon icon={cilPencil} />
      </CButton>
      <CButton
        color={user.status === "SUSPENDED" ? "success" : "warning"}
        variant="outline"
        onClick={() => handleAction(user, "suspend")}
      >
        <CIcon icon={user.status === "SUSPENDED" ? cilLockUnlocked : cilLockLocked} />
      </CButton>
      <CButton
        color="danger"
        variant="outline"
        onClick={() => handleAction(user, "delete")}
      >
        <CIcon icon={cilTrash} />
      </CButton>
    </CButtonGroup>
  );

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <h1 className="mb-4">회원 관리</h1>
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
              placeholder="이름 또는 이메일로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CInputGroup>
        </CCol>
        <CCol md={3}>
          <CFormSelect
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="ALL">모든 타입</option>
            <option value="VETERINARIAN">수의사</option>
            <option value="HOSPITAL">병원</option>
          </CFormSelect>
        </CCol>
        <CCol md={3}>
          <CFormSelect
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">모든 상태</option>
            <option value="ACTIVE">활성</option>
            <option value="PENDING">대기</option>
            <option value="SUSPENDED">정지</option>
            <option value="INACTIVE">비활성</option>
          </CFormSelect>
        </CCol>
        <CCol md={2}>
          <CButton color="primary" className="w-100">
            내보내기
          </CButton>
        </CCol>
      </CRow>

      {/* Users Table */}
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  전체 회원 ({filteredUsers.length}명)
                </h5>
              </div>
            </CCardHeader>
            <CCardBody>
              <CTable responsive hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>회원정보</CTableHeaderCell>
                    <CTableHeaderCell>타입</CTableHeaderCell>
                    <CTableHeaderCell>권한</CTableHeaderCell>
                    <CTableHeaderCell>상태</CTableHeaderCell>
                    <CTableHeaderCell>인증</CTableHeaderCell>
                    <CTableHeaderCell>가입일</CTableHeaderCell>
                    <CTableHeaderCell>최근 로그인</CTableHeaderCell>
                    <CTableHeaderCell>액션</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {currentUsers.map((user) => (
                    <CTableRow key={user.id}>
                      <CTableDataCell>
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <CIcon
                              icon={user.type === "VETERINARIAN" ? cilUser : cilBuilding}
                              size="lg"
                              className="text-medium-emphasis"
                            />
                          </div>
                          <div>
                            <div className="fw-semibold">{user.name}</div>
                            <div className="small text-medium-emphasis">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={user.type === "VETERINARIAN" ? "info" : "success"}>
                          {user.type === "VETERINARIAN" ? "수의사" : "병원"}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>{getRoleBadge(user.role)}</CTableDataCell>
                      <CTableDataCell>{getStatusBadge(user.status)}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={user.verified ? "success" : "danger"}>
                          {user.verified ? "인증완료" : "미인증"}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>{user.joinDate}</CTableDataCell>
                      <CTableDataCell>{user.lastLogin}</CTableDataCell>
                      <CTableDataCell>{renderActionButtons(user)}</CTableDataCell>
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
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>
            {actionType === "edit" && "회원 정보 수정"}
            {actionType === "suspend" && 
              (selectedUser?.status === "SUSPENDED" ? "계정 활성화" : "계정 정지")}
            {actionType === "delete" && "계정 삭제"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {actionType === "edit" && selectedUser && (
            <CForm>
              <div className="mb-3">
                <CFormLabel>이름</CFormLabel>
                <CFormInput value={selectedUser.name} />
              </div>
              <div className="mb-3">
                <CFormLabel>이메일</CFormLabel>
                <CFormInput value={selectedUser.email} />
              </div>
              <div className="mb-3">
                <CFormLabel>권한</CFormLabel>
                <CFormSelect value={selectedUser.role}>
                  <option value="USER">일반사용자</option>
                  <option value="ADMIN">관리자</option>
                  <option value="SUPER_ADMIN">슈퍼관리자</option>
                </CFormSelect>
              </div>
            </CForm>
          )}
          
          {actionType === "suspend" && selectedUser && (
            <CAlert color={selectedUser.status === "SUSPENDED" ? "success" : "warning"}>
              <strong>{selectedUser.name}</strong>님의 계정을{" "}
              {selectedUser.status === "SUSPENDED" ? "활성화" : "정지"}하시겠습니까?
              {selectedUser.status !== "SUSPENDED" && (
                <div className="mt-2">
                  계정이 정지되면 로그인할 수 없습니다.
                </div>
              )}
            </CAlert>
          )}
          
          {actionType === "delete" && selectedUser && (
            <CAlert color="danger">
              <strong>{selectedUser.name}</strong>님의 계정을 삭제하시겠습니까?
              <div className="mt-2">
                삭제된 계정은 복구할 수 없습니다.
              </div>
            </CAlert>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            취소
          </CButton>
          <CButton
            color={actionType === "delete" ? "danger" : "primary"}
            onClick={confirmAction}
          >
            {actionType === "edit" && "저장"}
            {actionType === "suspend" && 
              (selectedUser?.status === "SUSPENDED" ? "활성화" : "정지")}
            {actionType === "delete" && "삭제"}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
}