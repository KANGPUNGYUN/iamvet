"use client";

import React, { useState } from "react";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CButtonGroup,
  CFormSelect,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CProgress,
  CAlert,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilPeople,
  cilNotes,
  cilCheckCircle,
  cilChart,
  cilCloudDownload,
  cilCalendar,
  cilTrendUp,
  cilTrendDown,
} from "@coreui/icons";

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: any;
  color: string;
}

interface ChartData {
  label: string;
  value: number;
  change: number;
}

export default function StatisticsPage() {
  const [timeRange, setTimeRange] = useState("monthly");
  const [activeMetric, setActiveMetric] = useState("users");

  // Stats cards data
  const statsCards: StatCard[] = [
    {
      title: "총 회원수",
      value: "1,247",
      change: "+12.5%",
      changeType: "increase",
      icon: cilPeople,
      color: "primary",
    },
    {
      title: "활성 채용공고",
      value: "328",
      change: "+5.2%",
      changeType: "increase",
      icon: cilNotes,
      color: "success",
    },
    {
      title: "매칭 성공",
      value: "89",
      change: "+23.1%",
      changeType: "increase",
      icon: cilCheckCircle,
      color: "warning",
    },
    {
      title: "월간 매출",
      value: "₩4.2M",
      change: "-2.1%",
      changeType: "decrease",
      icon: cilChart,
      color: "info",
    },
  ];

  // Chart data for different time ranges
  const chartData = {
    users: [
      { label: "1월", value: 156, change: 12 },
      { label: "2월", value: 189, change: 21 },
      { label: "3월", value: 234, change: 24 },
      { label: "4월", value: 298, change: 27 },
      { label: "5월", value: 356, change: 19 },
      { label: "6월", value: 445, change: 25 },
      { label: "7월", value: 523, change: 17 },
      { label: "8월", value: 612, change: 17 },
      { label: "9월", value: 734, change: 20 },
      { label: "10월", value: 867, change: 18 },
      { label: "11월", value: 998, change: 15 },
      { label: "12월", value: 1247, change: 25 },
    ],
    jobs: [
      { label: "1월", value: 45, change: 8 },
      { label: "2월", value: 67, change: 49 },
      { label: "3월", value: 89, change: 33 },
      { label: "4월", value: 123, change: 38 },
      { label: "5월", value: 156, change: 27 },
      { label: "6월", value: 189, change: 21 },
      { label: "7월", value: 234, change: 24 },
      { label: "8월", value: 267, change: 14 },
      { label: "9월", value: 298, change: 12 },
      { label: "10월", value: 312, change: 5 },
      { label: "11월", value: 324, change: 4 },
      { label: "12월", value: 328, change: 1 },
    ],
    matches: [
      { label: "1월", value: 12, change: 0 },
      { label: "2월", value: 18, change: 50 },
      { label: "3월", value: 25, change: 39 },
      { label: "4월", value: 34, change: 36 },
      { label: "5월", value: 42, change: 24 },
      { label: "6월", value: 51, change: 21 },
      { label: "7월", value: 63, change: 24 },
      { label: "8월", value: 72, change: 14 },
      { label: "9월", value: 81, change: 13 },
      { label: "10월", value: 85, change: 5 },
      { label: "11월", value: 87, change: 2 },
      { label: "12월", value: 89, change: 2 },
    ],
  };

  // Top performers data
  const topHospitals = [
    {
      name: "서울 강남 동물병원",
      jobCount: 12,
      successRate: 92,
      avgResponseTime: "2.3일",
    },
    {
      name: "부산 해운대 동물병원",
      jobCount: 8,
      successRate: 88,
      avgResponseTime: "1.8일",
    },
    {
      name: "대구 수성 동물병원",
      jobCount: 6,
      successRate: 85,
      avgResponseTime: "3.1일",
    },
    {
      name: "인천 송도 동물병원",
      jobCount: 5,
      successRate: 90,
      avgResponseTime: "2.7일",
    },
  ];

  const topVeterinarians = [
    {
      name: "김수의",
      applicationCount: 15,
      successRate: 87,
      avgResponseTime: "12시간",
    },
    {
      name: "박수의",
      applicationCount: 12,
      successRate: 83,
      avgResponseTime: "8시간",
    },
    {
      name: "이수의",
      applicationCount: 10,
      successRate: 90,
      avgResponseTime: "6시간",
    },
    {
      name: "정수의",
      applicationCount: 9,
      successRate: 78,
      avgResponseTime: "14시간",
    },
  ];

  const getCurrentData = () => {
    switch (activeMetric) {
      case "jobs":
        return chartData.jobs;
      case "matches":
        return chartData.matches;
      default:
        return chartData.users;
    }
  };

  const getMetricTitle = () => {
    switch (activeMetric) {
      case "jobs":
        return "채용공고 현황";
      case "matches":
        return "매칭 성공 현황";
      default:
        return "회원 가입 현황";
    }
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return "success";
    if (rate >= 80) return "warning";
    return "danger";
  };

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>통계/리포트</h1>
            <div className="d-flex gap-2">
              <CFormSelect
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                style={{ width: "auto" }}
              >
                <option value="daily">일별</option>
                <option value="weekly">주별</option>
                <option value="monthly">월별</option>
                <option value="yearly">연별</option>
              </CFormSelect>
              <CButton color="primary">
                <CIcon icon={cilCloudDownload} className="me-2" />
                리포트 다운로드
              </CButton>
            </div>
          </div>
        </CCol>
      </CRow>

      {/* Stats Cards */}
      <CRow className="mb-4">
        {statsCards.map((stat, index) => (
          <CCol sm={6} lg={3} key={index}>
            <CCard className="mb-3">
              <CCardBody>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="fs-6 fw-semibold text-medium-emphasis">
                      {stat.title}
                    </div>
                    <div className="fs-4 fw-bold">{stat.value}</div>
                    <div className="d-flex align-items-center">
                      <CIcon
                        icon={stat.changeType === "increase" ? cilTrendUp : cilTrendDown}
                        className={`me-1 ${stat.changeType === "increase" ? "text-success" : "text-danger"}`}
                      />
                      <small className={stat.changeType === "increase" ? "text-success" : "text-danger"}>
                        {stat.change} 이번 달
                      </small>
                    </div>
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

      {/* Main Chart */}
      <CRow className="mb-4">
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{getMetricTitle()}</h5>
                <CButtonGroup>
                  <CButton
                    color={activeMetric === "users" ? "primary" : "outline-primary"}
                    onClick={() => setActiveMetric("users")}
                  >
                    회원
                  </CButton>
                  <CButton
                    color={activeMetric === "jobs" ? "primary" : "outline-primary"}
                    onClick={() => setActiveMetric("jobs")}
                  >
                    채용공고
                  </CButton>
                  <CButton
                    color={activeMetric === "matches" ? "primary" : "outline-primary"}
                    onClick={() => setActiveMetric("matches")}
                  >
                    매칭
                  </CButton>
                </CButtonGroup>
              </div>
            </CCardHeader>
            <CCardBody>
              <div style={{ height: "300px", position: "relative" }}>
                <CAlert color="info">
                  <CIcon icon={cilChart} className="me-2" />
                  실제 환경에서는 Chart.js나 다른 차트 라이브러리를 사용하여 시각화합니다.
                </CAlert>
                
                {/* Simple bar chart representation */}
                <div className="d-flex align-items-end justify-content-between" style={{ height: "200px" }}>
                  {getCurrentData().slice(-6).map((data, index) => (
                    <div key={index} className="d-flex flex-column align-items-center" style={{ width: "14%" }}>
                      <div
                        className="bg-primary rounded-top"
                        style={{
                          height: `${(data.value / Math.max(...getCurrentData().map(d => d.value))) * 150}px`,
                          width: "100%",
                          minHeight: "10px",
                        }}
                      />
                      <div className="small mt-2 text-center">
                        <div className="fw-semibold">{data.label}</div>
                        <div className="text-muted">{data.value.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Top Performers */}
      <CRow>
        {/* Top Hospitals */}
        <CCol md={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <h5 className="mb-0">활발한 병원 순위</h5>
            </CCardHeader>
            <CCardBody>
              <CTable responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>병원명</CTableHeaderCell>
                    <CTableHeaderCell>채용공고</CTableHeaderCell>
                    <CTableHeaderCell>성공률</CTableHeaderCell>
                    <CTableHeaderCell>평균 응답</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {topHospitals.map((hospital, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>
                        <div className="d-flex align-items-center">
                          <CBadge color="primary" className="me-2">
                            {index + 1}
                          </CBadge>
                          {hospital.name}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="info">{hospital.jobCount}개</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex align-items-center">
                          <span className="me-2">{hospital.successRate}%</span>
                          <CProgress
                            value={hospital.successRate}
                            color={getSuccessRateColor(hospital.successRate)}
                            className="flex-grow-1"
                            style={{ height: "6px" }}
                          />
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>{hospital.avgResponseTime}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Top Veterinarians */}
        <CCol md={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <h5 className="mb-0">활발한 수의사 순위</h5>
            </CCardHeader>
            <CCardBody>
              <CTable responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>수의사명</CTableHeaderCell>
                    <CTableHeaderCell>지원횟수</CTableHeaderCell>
                    <CTableHeaderCell>성공률</CTableHeaderCell>
                    <CTableHeaderCell>평균 응답</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {topVeterinarians.map((vet, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>
                        <div className="d-flex align-items-center">
                          <CBadge color="success" className="me-2">
                            {index + 1}
                          </CBadge>
                          {vet.name}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="info">{vet.applicationCount}회</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex align-items-center">
                          <span className="me-2">{vet.successRate}%</span>
                          <CProgress
                            value={vet.successRate}
                            color={getSuccessRateColor(vet.successRate)}
                            className="flex-grow-1"
                            style={{ height: "6px" }}
                          />
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>{vet.avgResponseTime}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Key Metrics Summary */}
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <h5 className="mb-0">주요 지표 요약</h5>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol md={3}>
                  <div className="border-end pe-3">
                    <div className="fs-6 text-medium-emphasis">평균 매칭 시간</div>
                    <div className="fs-4 fw-bold text-primary">2.4일</div>
                    <div className="small text-success">
                      <CIcon icon={cilTrendUp} className="me-1" />
                      15% 개선
                    </div>
                  </div>
                </CCol>
                <CCol md={3}>
                  <div className="border-end pe-3">
                    <div className="fs-6 text-medium-emphasis">사용자 만족도</div>
                    <div className="fs-4 fw-bold text-success">4.7/5.0</div>
                    <div className="small text-success">
                      <CIcon icon={cilTrendUp} className="me-1" />
                      0.2점 상승
                    </div>
                  </div>
                </CCol>
                <CCol md={3}>
                  <div className="border-end pe-3">
                    <div className="fs-6 text-medium-emphasis">월간 활성 사용자</div>
                    <div className="fs-4 fw-bold text-info">756명</div>
                    <div className="small text-success">
                      <CIcon icon={cilTrendUp} className="me-1" />
                      18% 증가
                    </div>
                  </div>
                </CCol>
                <CCol md={3}>
                  <div>
                    <div className="fs-6 text-medium-emphasis">평균 세션 시간</div>
                    <div className="fs-4 fw-bold text-warning">12분 34초</div>
                    <div className="small text-danger">
                      <CIcon icon={cilTrendDown} className="me-1" />
                      3% 감소
                    </div>
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
}