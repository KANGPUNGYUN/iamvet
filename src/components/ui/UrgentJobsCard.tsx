"use client";

import React from "react";
import Link from "next/link";
import JobInfoCard from "./JobInfoCard";
import { convertDDayToNumber } from "@/utils/dDayConverter";

interface JobData {
  id: number;
  hospital: string;
  dDay: string;
  position: string;
  location: string;
  jobType: string;
  tags: string[];
  isBookmarked: boolean;
}

interface UrgentJobsCardProps {
  jobs?: JobData[];
}

const UrgentJobsCard: React.FC<UrgentJobsCardProps> = ({
  jobs = [
    {
      id: 1,
      hospital: "서울 강남 동물병원",
      dDay: "신규",
      position: "내과 전문의(정규직)",
      location: "서울 종로구",
      jobType: "경력 3년 이상",
      tags: ["내과", "외과", "정규직", "케어직"],
      isBookmarked: false,
    },
    {
      id: 2,
      hospital: "서울 강남 동물병원",
      dDay: "D-23",
      position: "간호조무사(정규직)",
      location: "서울 광진구",
      jobType: "신입",
      tags: ["내과", "외과", "정규직", "케어직", "파트타임"],
      isBookmarked: false,
    },
  ],
}) => {
  return (
    <div className="bg-white w-full lg:max-w-[714px] mx-auto rounded-[16px] border border-[#EFEFF0] p-[16px] lg:p-[20px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-bold text-primary">
          진행중인 채용 공고
        </h2>
        <Link
          href="/dashboard/hospital/my-jobs"
          className="text-key1 text-[16px] font-bold no-underline hover:underline hover:underline-offset-[3px]"
        >
          전체보기
        </Link>
      </div>

      <div className="flex flex-col xl:flex-row gap-[14px]">
        {jobs.slice(0, 2).map((job) => (
          <JobInfoCard
            key={job.id}
            hospital={job.hospital}
            dDay={convertDDayToNumber(job.dDay)}
            position={job.position}
            location={job.location}
            jobType={job.jobType}
            tags={job.tags}
            isBookmarked={job.isBookmarked}
            isNew={job.dDay === "신규"}
            variant="wide"
            showDeadline={job.dDay !== "신규"}
            onClick={() => {
              window.location.href = `/dashboard/hospital/my-jobs/${job.id}`;
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default UrgentJobsCard;
