"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Tag } from "./Tag";
import { ArrowRightIcon } from "public/icons";
import { useAuth } from "@/hooks/api/useAuth";
import profileImg from "@/assets/images/profile.png";
import axios from "axios";

interface ApplicantData {
  id: string;
  appliedAt: string;
  status: string;
  veterinarianId: string;
  jobId: string;
  nickname: string;
  email: string;
  phone?: string;
  profileImage?: string;
  realName: string;
  job_title: string;
  job_position: string;
  resume_id?: string;
}

interface ApplicantsTableProps {
  applicants?: ApplicantData[];
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case "ACCEPTED":
      return 2;
    case "REVIEWING":
      return 1;
    case "REJECTED":
      return 6;
    case "PENDING":
      return 3;
    default:
      return 3;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "PENDING":
      return "지원서 접수";
    case "REVIEWING":
      return "검토 중";
    case "ACCEPTED":
      return "승인됨";
    case "REJECTED":
      return "거부됨";
    default:
      return status;
  }
};

const MobileApplicantCard: React.FC<{ applicant: ApplicantData }> = ({
  applicant,
}) => {
  return (
    <div className="bg-white border border-[#EFEFF0] rounded-[12px] p-4 mb-3">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Image
            src={applicant.profileImage || profileImg}
            alt="프로필"
            width={36}
            height={36}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="text-[16px] font-bold text-primary">
            {applicant.realName || applicant.nickname}
          </span>
        </div>
        <Link href={`/resumes/${applicant.resume_id || applicant.veterinarianId}?applicationId=${applicant.id}`}>
          <ArrowRightIcon size="20" />
        </Link>
      </div>

      <div className="flex flex-col gap-[4px]">
        <div className="flex gap-[20px]">
          <span className="text-[14px] text-gray-500 block w-[70px]">
            지원 포지션
          </span>
          <span className="text-[14px] text-primary font-medium">
            {applicant.job_position}
          </span>
        </div>
        <div className="flex gap-[20px]">
          <span className="text-[14px] text-gray-500 block w-[70px]">
            연락처
          </span>
          <span className="text-[14px] text-gray-700">
            {applicant.phone} / {applicant.email}
          </span>
        </div>
      </div>

      <div className="mt-[20px] flex items-center justify-between">
        <span className="text-[12px] text-gray-500">
          {new Date(applicant.appliedAt).toLocaleDateString('ko-KR').replace(/\.$/, '')}
        </span>
        <Tag variant={getStatusVariant(applicant.status)}>
          {getStatusText(applicant.status)}
        </Tag>
      </div>
    </div>
  );
};

const ApplicantsTable: React.FC<ApplicantsTableProps> = ({
  applicants: propApplicants,
}) => {
  const [applicants, setApplicants] = useState<ApplicantData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (propApplicants) {
      setApplicants(propApplicants);
      setLoading(false);
    } else if (isAuthenticated) {
      // localStorage에서 사용자 타입 직접 확인
      const localUser = localStorage.getItem("user");
      const userType = localUser ? JSON.parse(localUser)?.userType : null;
      
      // console.log("ApplicantsTable: Local user type:", userType);
      // console.log("ApplicantsTable: useAuth user type:", user?.type);
      
      if (userType === "hospital" || user?.type === "hospital") {
        fetchApplicants();
      } else {
        console.warn("ApplicantsTable: User is not a hospital account. userType:", userType, "user.type:", user?.type);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [propApplicants, isAuthenticated, user]);

  const fetchApplicants = async () => {
    let token: string | null = null;
    try {
      setLoading(true);
      token = localStorage.getItem("accessToken");
      
      if (!token) {
        console.warn("ApplicantsTable: No access token found");
        setApplicants([]);
        return;
      }

      // console.log("ApplicantsTable: Fetching applicants with token:", token.substring(0, 20) + "...");
      // console.log("ApplicantsTable: User info:", { type: user?.type, isAuthenticated });

      const response = await axios.get("/api/dashboard/hospital/applicants?limit=3", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // console.log("ApplicantsTable: API response:", response.data);

      if (response.data.status === "success") {
        setApplicants(response.data.data || []);
      }
    } catch (error: any) {
      console.error("ApplicantsTable: Failed to fetch applicants:", error);
      
      // 더 상세한 에러 정보 출력
      if (error.response) {
        console.error("ApplicantsTable: Response error details:", {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          message: error.response.data?.message || error.response.data?.error || "No message",
        });
      } else if (error.request) {
        console.error("ApplicantsTable: Request error - no response received");
      } else {
        console.error("ApplicantsTable: Error setting up request:", error.message);
      }
      
      if (error.response?.status === 403) {
        console.warn("ApplicantsTable: 403 Access denied - checking if token refresh is needed");
        
        // 토큰이 대문자 HOSPITAL을 사용하는 경우 로그아웃/재로그인 안내
        if (token) {
          try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const payload = JSON.parse(jsonPayload);
            
            if (payload.userType === "HOSPITAL") {
              console.warn("ApplicantsTable: Legacy token detected with uppercase userType. Please logout and login again for better compatibility.");
            }
          } catch (e) {
            console.warn("ApplicantsTable: Failed to decode token:", e);
          }
        }
      }
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white w-full mx-auto rounded-[16px] border border-[#EFEFF0] p-[16px] xl:p-[20px]">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">지원자 정보를 불러오는 중...</div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white w-full mx-auto rounded-[16px] border border-[#EFEFF0] p-[16px] xl:p-[20px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-bold text-primary">지원자 정보</h2>
        <Link
          href="/dashboard/hospital/applicants"
          className="text-key1 text-[16px] font-bold no-underline hover:underline hover:underline-offset-[3px]"
        >
          전체보기
        </Link>
      </div>

      {applicants.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">지원자가 없습니다.</p>
        </div>
      ) : (
        <>
          {/* 모바일 버전 (xl 이하) */}
          <div className="block xl:hidden">
            {applicants.slice(0, 3).map((applicant) => (
              <MobileApplicantCard key={applicant.id} applicant={applicant} />
            ))}
          </div>

      {/* 데스크톱 버전 (xl 이상) */}
      <div className="hidden xl:block overflow-x-auto">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-box-light">
              <th className="text-left py-[22px] pl-[30px] text-sm font-medium text-gray-500 border border-[#EFEFF0] border-r-0 rounded-l-[8px] w-[120px]">
                지원일자
              </th>
              <th className="text-left py-[22px] text-sm font-medium text-gray-500 border-t border-b border-[#EFEFF0]">
                지원자
              </th>
              <th className="text-left py-[22px] text-sm font-medium text-gray-500 border-t border-b border-[#EFEFF0]">
                지원 포지션
              </th>
              <th className="text-left py-[22px] text-sm font-medium text-gray-500 border-t border-b border-[#EFEFF0]">
                연락처/이메일
              </th>
              <th className="text-left py-[22px] text-sm font-medium text-gray-500 border-t border-b border-[#EFEFF0]">
                상태
              </th>
              <th className="text-left py-[22px] pr-[30px] text-sm font-medium text-gray-500 border border-[#EFEFF0] border-l-0 rounded-r-[8px]">
                관리
              </th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((applicant) => (
              <tr key={applicant.id} className="border-b border-gray-100">
                <td className="py-[22px] pl-[30px] text-sm text-gray-900 w-[120px]">
                  {new Date(applicant.appliedAt).toLocaleDateString('ko-KR').replace(/\.$/, '')}
                </td>
                <td className="py-[22px] text-sm text-gray-900">
                  {applicant.realName || applicant.nickname}
                </td>
                <td className="py-[22px] text-sm text-gray-900">
                  {applicant.job_position}
                </td>
                <td className="py-[22px] text-sm text-gray-600">
                  {applicant.phone} / {applicant.email}
                </td>
                <td className="py-[22px]">
                  <Tag variant={getStatusVariant(applicant.status)}>
                    {getStatusText(applicant.status)}
                  </Tag>
                </td>
                <td className="py-[22px] pr-[30px]">
                  <Link
                    href={`/resumes/${applicant.resume_id || applicant.veterinarianId}?applicationId=${applicant.id}`}
                    className="text-key1 text-[16px] font-bold no-underline hover:underline hover:underline-offset-[3px]"
                  >
                    이력서 보기
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        </>
      )}
    </div>
  );
};

export default ApplicantsTable;
