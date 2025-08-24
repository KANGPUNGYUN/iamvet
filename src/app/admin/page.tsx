"use client";

import React from "react";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CProgress,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilPeople,
  cilNotes,
  cilChart,
  cilCheckCircle,
} from "@coreui/icons";
import "./globals.css";

export default function AdminDashboard() {
  const statsData = [
    {
      title: "전체 회원",
      count: "1,247",
      percentage: "+12%",
      icon: cilPeople,
      color: "primary",
    },
    {
      title: "채용 공고",
      count: "328",
      percentage: "+5%",
      icon: cilNotes,
      color: "success",
    },
    {
      title: "매칭 성공",
      count: "89",
      percentage: "+23%",
      icon: cilCheckCircle,
      color: "warning",
    },
    {
      title: "월간 활성 사용자",
      count: "756",
      percentage: "+18%",
      icon: cilChart,
      color: "info",
    },
  ];

  const recentUsers = [
    {
      id: 1,
      name: "김수의",
      email: "kim@example.com",
      type: "수의사",
      status: "active",
      joinDate: "2024-01-15",
    },
    {
      id: 2,
      name: "서울동물병원",
      email: "seoul@hospital.com",
      type: "병원",
      status: "pending",
      joinDate: "2024-01-14",
    },
    {
      id: 3,
      name: "박수의",
      email: "park@example.com",
      type: "수의사",
      status: "active",
      joinDate: "2024-01-13",
    },
    {
      id: 4,
      name: "강남동물병원",
      email: "gangnam@hospital.com",
      type: "병원",
      status: "suspended",
      joinDate: "2024-01-12",
    },
  ];

  const pendingReports = [
    {
      id: 1,
      title: "부적절한 채용 공고",
      reporter: "김수의",
      type: "채용공고",
      date: "2024-01-15",
      status: "pending",
    },
    {
      id: 2,
      title: "스팸 게시물",
      reporter: "이수의",
      type: "교육콘텐츠",
      date: "2024-01-14",
      status: "investigating",
    },
    {
      id: 3,
      title: "허위 정보",
      reporter: "박수의",
      type: "양도양수",
      date: "2024-01-13",
      status: "pending",
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { color: string; text: string } } = {
      active: { color: "success", text: "활성" },
      pending: { color: "warning", text: "대기" },
      suspended: { color: "danger", text: "정지" },
      investigating: { color: "info", text: "조사중" },
    };
    const statusInfo = statusMap[status] || { color: "secondary", text: status };
    return <CBadge color={statusInfo.color}>{statusInfo.text}</CBadge>;
  };

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <h1 className="mb-4">관리자 대시보드</h1>
        </CCol>
      </CRow>

      {/* Stats Cards */}
      <CRow className="mb-4">
        {statsData.map((stat, index) => (
          <CCol sm={6} lg={3} key={index}>
            <CCard className="mb-3">
              <CCardBody>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="fs-6 fw-semibold text-medium-emphasis">
                      {stat.title}
                    </div>
                    <div className="fs-4 fw-bold">{stat.count}</div>
                    <small className={`text-${stat.color}`}>
                      {stat.percentage} 이번 달
                    </small>
                  </div>
                  <div className={`bg-${stat.color} text-white p-3 rounded`}>
                    <CIcon icon={stat.icon} size="xl" />
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      <CRow>
        {/* Recent Users */}
        <CCol md={8}>
          <CCard className="mb-4">
            <CCardHeader>
              <h5 className="mb-0">최근 가입 회원</h5>
            </CCardHeader>
            <CCardBody>
              <CTable responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>이름/병원명</CTableHeaderCell>
                    <CTableHeaderCell>이메일</CTableHeaderCell>
                    <CTableHeaderCell>타입</CTableHeaderCell>
                    <CTableHeaderCell>상태</CTableHeaderCell>
                    <CTableHeaderCell>가입일</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {recentUsers.map((user) => (
                    <CTableRow key={user.id}>
                      <CTableDataCell>
                        <div className="fw-semibold">{user.name}</div>
                      </CTableDataCell>
                      <CTableDataCell>{user.email}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={user.type === "수의사" ? "info" : "success"}>
                          {user.type}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>{getStatusBadge(user.status)}</CTableDataCell>
                      <CTableDataCell>{user.joinDate}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Pending Reports */}
        <CCol md={4}>
          <CCard className="mb-4">
            <CCardHeader>
              <h5 className="mb-0">처리 대기 신고</h5>
            </CCardHeader>
            <CCardBody>
              {pendingReports.map((report) => (
                <div key={report.id} className="border-bottom py-3">
                  <div className="d-flex justify-content-between">
                    <div className="fw-semibold small">{report.title}</div>
                    {getStatusBadge(report.status)}
                  </div>
                  <div className="text-medium-emphasis small">
                    신고자: {report.reporter}
                  </div>
                  <div className="text-medium-emphasis small">
                    {report.type} • {report.date}
                  </div>
                </div>
              ))}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* System Status */}
      <CRow>
        <CCol md={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <h5 className="mb-0">시스템 상태</h5>
            </CCardHeader>
            <CCardBody>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>서버 CPU 사용률</span>
                  <span>65%</span>
                </div>
                <CProgress value={65} color="success" />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>메모리 사용률</span>
                  <span>78%</span>
                </div>
                <CProgress value={78} color="warning" />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>데이터베이스 연결</span>
                  <span>정상</span>
                </div>
                <CProgress value={100} color="success" />
              </div>
              <div>
                <div className="d-flex justify-content-between mb-1">
                  <span>스토리지 사용률</span>
                  <span>45%</span>
                </div>
                <CProgress value={45} color="info" />
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <h5 className="mb-0">AI 매칭 성능</h5>
            </CCardHeader>
            <CCardBody>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>매칭 정확도</span>
                  <span>87%</span>
                </div>
                <CProgress value={87} color="primary" />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>응답 시간</span>
                  <span>1.2초</span>
                </div>
                <CProgress value={80} color="success" />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>일일 매칭 요청</span>
                  <span>456건</span>
                </div>
                <CProgress value={70} color="info" />
              </div>
              <div>
                <div className="d-flex justify-content-between mb-1">
                  <span>성공률</span>
                  <span>92%</span>
                </div>
                <CProgress value={92} color="warning" />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
}