"use client";

import React, { useState } from "react";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
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

interface Post {
  id: number;
  title: string;
  author: string;
  category: string;
  type: "JOB" | "LECTURE" | "TRANSFER" | "FORUM";
  status: "ACTIVE" | "PENDING" | "SUSPENDED" | "DELETED";
  reportCount: number;
  createdAt: string;
  viewCount: number;
}

interface Report {
  id: number;
  postId: number;
  postTitle: string;
  reporter: string;
  reason: string;
  description: string;
  status: "PENDING" | "INVESTIGATING" | "RESOLVED" | "DISMISSED";
  createdAt: string;
}

export default function PostsManagement() {
  const [activeTab, setActiveTab] = useState("posts");
  
  // Posts data
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      title: "수의사 정규직 모집",
      author: "서울동물병원",
      category: "채용공고",
      type: "JOB",
      status: "ACTIVE",
      reportCount: 0,
      createdAt: "2024-01-20",
      viewCount: 156,
    },
    {
      id: 2,
      title: "반려동물 영상진단학 기초",
      author: "김교수",
      category: "교육",
      type: "LECTURE",
      status: "ACTIVE",
      reportCount: 0,
      createdAt: "2024-01-19",
      viewCount: 89,
    },
    {
      id: 3,
      title: "X-ray 장비 양도합니다",
      author: "강남동물병원",
      category: "양도양수",
      type: "TRANSFER",
      status: "PENDING",
      reportCount: 1,
      createdAt: "2024-01-18",
      viewCount: 45,
    },
    {
      id: 4,
      title: "부적절한 광고성 게시물",
      author: "스팸유저",
      category: "자유게시판",
      type: "FORUM",
      status: "SUSPENDED",
      reportCount: 5,
      createdAt: "2024-01-17",
      viewCount: 12,
    },
  ]);

  // Reports data
  const [reports, setReports] = useState<Report[]>([
    {
      id: 1,
      postId: 3,
      postTitle: "X-ray 장비 양도합니다",
      reporter: "김수의",
      reason: "허위정보",
      description: "장비 상태가 실제와 다름",
      status: "PENDING",
      createdAt: "2024-01-20",
    },
    {
      id: 2,
      postId: 4,
      postTitle: "부적절한 광고성 게시물",
      reporter: "박수의",
      reason: "스팸/광고",
      description: "관련 없는 상품 광고",
      status: "INVESTIGATING",
      createdAt: "2024-01-19",
    },
    {
      id: 3,
      postId: 4,
      postTitle: "부적절한 광고성 게시물",
      reporter: "이수의",
      reason: "부적절한 내용",
      description: "수의학과 무관한 내용",
      status: "RESOLVED",
      createdAt: "2024-01-18",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Post | Report | null>(null);
  const [actionType, setActionType] = useState<"view" | "suspend" | "delete" | "resolve">("view");

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { color: string; text: string } } = {
      ACTIVE: { color: "success", text: "활성" },
      PENDING: { color: "warning", text: "검토중" },
      SUSPENDED: { color: "danger", text: "정지" },
      DELETED: { color: "dark", text: "삭제" },
      INVESTIGATING: { color: "info", text: "조사중" },
      RESOLVED: { color: "success", text: "해결됨" },
      DISMISSED: { color: "secondary", text: "기각됨" },
    };
    const statusInfo = statusMap[status] || { color: "secondary", text: status };
    return <CBadge color={statusInfo.color}>{statusInfo.text}</CBadge>;
  };

  const getTypeBadge = (type: string) => {
    const typeMap: { [key: string]: { color: string; text: string } } = {
      JOB: { color: "primary", text: "채용공고" },
      LECTURE: { color: "info", text: "교육콘텐츠" },
      TRANSFER: { color: "warning", text: "양도양수" },
      FORUM: { color: "secondary", text: "커뮤니티" },
    };
    const typeInfo = typeMap[type] || { color: "secondary", text: type };
    return <CBadge color={typeInfo.color}>{typeInfo.text}</CBadge>;
  };

  const handleAction = (item: Post | Report, action: "view" | "suspend" | "delete" | "resolve") => {
    setSelectedItem(item);
    setActionType(action);
    setModalVisible(true);
  };

  const confirmAction = () => {
    if (!selectedItem) return;

    if (activeTab === "posts") {
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === selectedItem.id) {
            switch (actionType) {
              case "suspend":
                return { ...post, status: "SUSPENDED" as const };
              case "delete":
                return { ...post, status: "DELETED" as const };
              default:
                return post;
            }
          }
          return post;
        })
      );
    } else if (activeTab === "reports") {
      setReports((prev) =>
        prev.map((report) => {
          if (report.id === selectedItem.id) {
            switch (actionType) {
              case "resolve":
                return { ...report, status: "RESOLVED" as const };
              default:
                return report;
            }
          }
          return report;
        })
      );
    }

    setModalVisible(false);
    setSelectedItem(null);
  };

  const renderPostsTable = () => {
    const filteredPosts = posts.filter((post) => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "ALL" || post.status === filterStatus;
      const matchesType = filterType === "ALL" || post.type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    });

    return (
      <CTable responsive hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>제목</CTableHeaderCell>
            <CTableHeaderCell>작성자</CTableHeaderCell>
            <CTableHeaderCell>타입</CTableHeaderCell>
            <CTableHeaderCell>상태</CTableHeaderCell>
            <CTableHeaderCell>신고수</CTableHeaderCell>
            <CTableHeaderCell>조회수</CTableHeaderCell>
            <CTableHeaderCell>작성일</CTableHeaderCell>
            <CTableHeaderCell>액션</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredPosts.map((post) => (
            <CTableRow key={post.id}>
              <CTableDataCell>
                <div className="fw-semibold">{post.title}</div>
                <div className="small text-medium-emphasis">{post.category}</div>
              </CTableDataCell>
              <CTableDataCell>{post.author}</CTableDataCell>
              <CTableDataCell>{getTypeBadge(post.type)}</CTableDataCell>
              <CTableDataCell>{getStatusBadge(post.status)}</CTableDataCell>
              <CTableDataCell>
                {post.reportCount > 0 ? (
                  <CBadge color="danger">{post.reportCount}</CBadge>
                ) : (
                  <span className="text-muted">0</span>
                )}
              </CTableDataCell>
              <CTableDataCell>{post.viewCount.toLocaleString()}</CTableDataCell>
              <CTableDataCell>{post.createdAt}</CTableDataCell>
              <CTableDataCell>
                <CButtonGroup size="sm">
                  <CButton
                    color="info"
                    variant="outline"
                    onClick={() => handleAction(post, "view")}
                  >
                    <CIcon icon={cilEye} />
                  </CButton>
                  <CButton
                    color="warning"
                    variant="outline"
                    onClick={() => handleAction(post, "suspend")}
                    disabled={post.status === "SUSPENDED"}
                  >
                    <CIcon icon={cilXCircle} />
                  </CButton>
                  <CButton
                    color="danger"
                    variant="outline"
                    onClick={() => handleAction(post, "delete")}
                    disabled={post.status === "DELETED"}
                  >
                    <CIcon icon={cilTrash} />
                  </CButton>
                </CButtonGroup>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    );
  };

  const renderReportsTable = () => {
    const filteredReports = reports.filter((report) => {
      const matchesSearch = report.postTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           report.reporter.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "ALL" || report.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    return (
      <CTable responsive hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>신고된 게시물</CTableHeaderCell>
            <CTableHeaderCell>신고자</CTableHeaderCell>
            <CTableHeaderCell>신고 사유</CTableHeaderCell>
            <CTableHeaderCell>상태</CTableHeaderCell>
            <CTableHeaderCell>신고일</CTableHeaderCell>
            <CTableHeaderCell>액션</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredReports.map((report) => (
            <CTableRow key={report.id}>
              <CTableDataCell>
                <div className="fw-semibold">{report.postTitle}</div>
                <div className="small text-medium-emphasis">ID: {report.postId}</div>
              </CTableDataCell>
              <CTableDataCell>{report.reporter}</CTableDataCell>
              <CTableDataCell>
                <div>{report.reason}</div>
                <div className="small text-medium-emphasis">{report.description}</div>
              </CTableDataCell>
              <CTableDataCell>{getStatusBadge(report.status)}</CTableDataCell>
              <CTableDataCell>{report.createdAt}</CTableDataCell>
              <CTableDataCell>
                <CButtonGroup size="sm">
                  <CButton
                    color="info"
                    variant="outline"
                    onClick={() => handleAction(report, "view")}
                  >
                    <CIcon icon={cilEye} />
                  </CButton>
                  <CButton
                    color="success"
                    variant="outline"
                    onClick={() => handleAction(report, "resolve")}
                    disabled={report.status === "RESOLVED"}
                  >
                    <CIcon icon={cilCheckCircle} />
                  </CButton>
                </CButtonGroup>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    );
  };

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <h1 className="mb-4">게시물 관리</h1>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <CNav variant="tabs">
                <CNavItem>
                  <CNavLink
                    active={activeTab === "posts"}
                    onClick={() => setActiveTab("posts")}
                    style={{ cursor: "pointer" }}
                  >
                    전체 게시물
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    active={activeTab === "reports"}
                    onClick={() => setActiveTab("reports")}
                    style={{ cursor: "pointer" }}
                  >
                    신고 관리
                    <CBadge color="danger" className="ms-2">
                      {reports.filter(r => r.status === "PENDING").length}
                    </CBadge>
                  </CNavLink>
                </CNavItem>
              </CNav>
            </CCardHeader>
            <CCardBody>
              {/* Search and Filters */}
              <CRow className="mb-4">
                <CCol md={4}>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilSearch} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="제목 또는 작성자로 검색"
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
                    {activeTab === "posts" && (
                      <>
                        <option value="ACTIVE">활성</option>
                        <option value="PENDING">검토중</option>
                        <option value="SUSPENDED">정지</option>
                        <option value="DELETED">삭제</option>
                      </>
                    )}
                    {activeTab === "reports" && (
                      <>
                        <option value="PENDING">대기</option>
                        <option value="INVESTIGATING">조사중</option>
                        <option value="RESOLVED">해결됨</option>
                        <option value="DISMISSED">기각됨</option>
                      </>
                    )}
                  </CFormSelect>
                </CCol>
                {activeTab === "posts" && (
                  <CCol md={3}>
                    <CFormSelect
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                    >
                      <option value="ALL">모든 타입</option>
                      <option value="JOB">채용공고</option>
                      <option value="LECTURE">교육콘텐츠</option>
                      <option value="TRANSFER">양도양수</option>
                      <option value="FORUM">커뮤니티</option>
                    </CFormSelect>
                  </CCol>
                )}
                <CCol md={2}>
                  <CButton color="primary" className="w-100">
                    내보내기
                  </CButton>
                </CCol>
              </CRow>

              <CTabContent>
                <CTabPane visible={activeTab === "posts"}>
                  {renderPostsTable()}
                </CTabPane>
                <CTabPane visible={activeTab === "reports"}>
                  {renderReportsTable()}
                </CTabPane>
              </CTabContent>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Action Modal */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg">
        <CModalHeader>
          <CModalTitle>
            {actionType === "view" && "상세 보기"}
            {actionType === "suspend" && "게시물 정지"}
            {actionType === "delete" && "게시물 삭제"}
            {actionType === "resolve" && "신고 처리"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedItem && actionType === "view" && (
            <div>
              {"title" in selectedItem ? (
                // Post details
                <div>
                  <h5>{selectedItem.title}</h5>
                  <p><strong>작성자:</strong> {selectedItem.author}</p>
                  <p><strong>카테고리:</strong> {selectedItem.category}</p>
                  <p><strong>상태:</strong> {getStatusBadge(selectedItem.status)}</p>
                  <p><strong>조회수:</strong> {selectedItem.viewCount.toLocaleString()}</p>
                  <p><strong>작성일:</strong> {selectedItem.createdAt}</p>
                </div>
              ) : (
                // Report details
                <div>
                  <h5>{selectedItem.postTitle}</h5>
                  <p><strong>신고자:</strong> {selectedItem.reporter}</p>
                  <p><strong>신고 사유:</strong> {selectedItem.reason}</p>
                  <p><strong>상세 설명:</strong> {selectedItem.description}</p>
                  <p><strong>상태:</strong> {getStatusBadge(selectedItem.status)}</p>
                  <p><strong>신고일:</strong> {selectedItem.createdAt}</p>
                </div>
              )}
            </div>
          )}

          {actionType === "suspend" && selectedItem && "title" in selectedItem && (
            <CAlert color="warning">
              <CIcon icon={cilWarning} className="me-2" />
              <strong>{selectedItem.title}</strong> 게시물을 정지하시겠습니까?
              <div className="mt-2">
                정지된 게시물은 사용자에게 표시되지 않습니다.
              </div>
            </CAlert>
          )}

          {actionType === "delete" && selectedItem && "title" in selectedItem && (
            <CAlert color="danger">
              <strong>{selectedItem.title}</strong> 게시물을 삭제하시겠습니까?
              <div className="mt-2">
                삭제된 게시물은 복구할 수 없습니다.
              </div>
            </CAlert>
          )}

          {actionType === "resolve" && selectedItem && "postTitle" in selectedItem && (
            <CAlert color="success">
              이 신고를 해결됨으로 처리하시겠습니까?
              <div className="mt-2">
                <strong>신고된 게시물:</strong> {selectedItem.postTitle}
              </div>
            </CAlert>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            취소
          </CButton>
          {actionType !== "view" && (
            <CButton
              color={actionType === "delete" ? "danger" : "primary"}
              onClick={confirmAction}
            >
              {actionType === "suspend" && "정지"}
              {actionType === "delete" && "삭제"}
              {actionType === "resolve" && "해결됨으로 처리"}
            </CButton>
          )}
        </CModalFooter>
      </CModal>
    </>
  );
}