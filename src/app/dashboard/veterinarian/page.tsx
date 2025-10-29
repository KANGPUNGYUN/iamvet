"use client";

import MyResumeCard from "@/components/ui/MyResumeCard";
import ApplicationStatusCard from "@/components/ui/ApplicationStatusCard";
import BookmarkedJobsCard from "@/components/ui/BookmarkedJobsCard";
import NotificationsCard from "@/components/ui/NotificationsCard";
import RecentApplicationsCard from "@/components/ui/RecentApplicationsCard";
import AdvertisementSlider from "@/components/ui/AdvertisementSlider";
import { useDashboardBanners } from "@/hooks/api/useAdvertisements";
import React from "react";

export default function VeterinarianDashboardPage() {
  // 대시보드 배너 광고 데이터 조회
  const { data: dashboardBannersData, isLoading: isLoadingAds } = useDashboardBanners();

  // 수의사용 광고 필터링 및 변환
  const formattedAds = React.useMemo(() => {
    if (!dashboardBannersData?.data || dashboardBannersData.data.length === 0) {
      return [];
    }

    // Filter ads for veterinarians
    const veterinarianAds = dashboardBannersData.data.filter(ad => 
      ad.targetAudience === "ALL" || ad.targetAudience === "VETERINARIANS"
    );

    // Transform API data to match AdvertisementSlider format
    return veterinarianAds.map(ad => ({
      id: ad.id,
      imageUrl: ad.imageUrl || '',
      linkUrl: ad.linkUrl,
    }));
  }, [dashboardBannersData]);
  return (
    <div className="bg-gray-50">
      <div className="max-w-[1095px] w-full mx-auto px-[16px] lg:px-[20px] pt-[30px] pb-[156px]">
        <h1 className="text-primary font-title text-[28px] mb-[22px]">
          대시보드
        </h1>

        <div className="flex flex-col gap-[30px]">
          {/* 왼쪽 열 */}
          <div className="flex gap-[24px] lg:flex-row flex-col lg:justify-between">
            {/* 내 이력서 */}
            <MyResumeCard />

            {/* 지원현황 */}
            <ApplicationStatusCard />
          </div>

          <div className="flex gap-[24px] lg:flex-row flex-col lg:justify-between">
            {/* 찜한 공고 */}
            <BookmarkedJobsCard />
            {/* 신규 알림 */}
            <NotificationsCard />
          </div>

          {/* 광고 배너 - 광고가 있을 때만 표시 */}
          {!isLoadingAds && formattedAds.length > 0 && (
            <AdvertisementSlider
              advertisements={formattedAds}
              autoPlay={true}
              autoPlayInterval={5000}
            />
          )}

          {/* 최근 지원한 공고 */}
          <RecentApplicationsCard />
        </div>
      </div>
    </div>
  );
}
