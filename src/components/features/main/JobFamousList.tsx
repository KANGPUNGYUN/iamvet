import React from "react";
import { useRouter } from "next/navigation";

interface JobPosting {
  id: number;
  hospital: string;
  position: string;
  type: string;
}

const JobFamousList: React.FC = () => {
  const router = useRouter();
  
  const jobPostings: JobPosting[] = [
    {
      id: 1,
      hospital: "서울대학교 동물병원",
      position: "수의사",
      type: "정규직",
    },
    {
      id: 2,
      hospital: "건국대학교 동물병원",
      position: "수의사",
      type: "정규직",
    },
    {
      id: 3,
      hospital: "연세 동물병원",
      position: "간호사",
      type: "정규직",
    },
    {
      id: 4,
      hospital: "강남점 동물병원",
      position: "수의사",
      type: "정규직",
    },
    {
      id: 5,
      hospital: "까꽁 동물보호센터",
      position: "수의사",
      type: "정규직",
    },
  ];

  return (
    <div className="bg-white rounded-[16px] border border-[line-primary] p-[20px] w-full">
      <h2 className="text-[20px] font-title title-light text-primary mb-[10px]">
        인기 채용 공고
      </h2>

      <div className="divide-y divide-[line-primary]">
        {jobPostings.map((job, index) => (
          <div
            key={job.id}
            className="flex items-center space-x-4 p-[8px] hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
            onClick={() => router.push(`/jobs/${job.id}`)}
          >
            <div
              className={`text-2xl font-bold min-w-[24px] flex items-center justify-center font-title ${
                job.id <= 3 ? "text-key1" : "text-guide"
              }`}
            >
              {job.id}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-text text-bold text-[15px] text-gray-900 hover:text-key1 transition-colors duration-200">
                {job.hospital}
              </h3>
              <div className="flex items-center gap-[4px] text-sm text-gray-600">
                <span>{job.position}</span>
                <span className="font-text text-regular text-[14px]">{`(${job.type})`}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobFamousList;
