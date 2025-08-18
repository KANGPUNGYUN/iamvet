"use client";

import HospitalProfileCard from "@/components/ui/HospitalProfileCard";
import RecruitmentStatusCard from "@/components/ui/RecruitmentStatusCard";
import UrgentJobsCard from "@/components/ui/UrgentJobsCard";
import HospitalNotificationsCard from "@/components/ui/HospitalNotificationsCard";
import ApplicantsTable from "@/components/ui/ApplicantsTable";
import AdvertisementSlider from "@/components/ui/AdvertisementSlider";
import { advertisementsData } from "@/data/advertisementsData";

export default function HospitalDashboardPage() {
  return (
    <div className="bg-gray-50">
      <div className="max-w-[1095px] w-full mx-auto px-[16px] lg:px-[20px] pt-[30px] pb-[156px]">
        <h1 className="text-primary font-title text-[28px] mb-[22px]">
          대시보드
        </h1>

        <div className="flex flex-col gap-[30px]">
          {/* 첫 번째 행 */}
          <div className="flex gap-[24px] lg:flex-row flex-col lg:justify-between">
            {/* 병원 프로필 */}
            <HospitalProfileCard
              name="서울 강남 동물병원"
              description="내 동물병원 지료하는 반려동물 종양병원입니다. 반려인과 고양이 내과병원"
              profileImage="/hospital-placeholder.png"
              keywords={["반려견", "고양이", "소동물", "내과", "외과", "행동 교정"]}
            />

            {/* 채용 현황 */}
            <RecruitmentStatusCard />
          </div>

          {/* 광고 슬라이더 */}
          <AdvertisementSlider
            advertisements={advertisementsData}
            autoPlay={true}
            autoPlayInterval={5000}
          />

          <div className="flex gap-[24px] lg:flex-row flex-col lg:justify-between">
            {/* 긴급충원 채용 공고 */}
            <UrgentJobsCard />
            {/* 신규 알림 */}
            <HospitalNotificationsCard />
          </div>

          {/* 지원자 정보 */}
          <ApplicantsTable />
        </div>
      </div>
    </div>
  );
}