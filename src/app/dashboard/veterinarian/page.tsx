"use client";

import { useState, useEffect } from "react";
import MyResumeCard from "@/components/ui/MyResumeCard";
import ApplicationStatusCard from "@/components/ui/ApplicationStatusCard";
import BookmarkedJobsCard from "@/components/ui/BookmarkedJobsCard";
import NotificationsCard from "@/components/ui/NotificationsCard";
import RecentApplicationsCard from "@/components/ui/RecentApplicationsCard";
import AdvertisementSlider from "@/components/ui/AdvertisementSlider";

interface DashboardAdvertisement {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  linkUrl?: string;
  targetAudience: "ALL" | "VETERINARIANS" | "HOSPITALS";
}

export default function VeterinarianDashboardPage() {
  const [advertisements, setAdvertisements] = useState<DashboardAdvertisement[]>([]);
  const [isLoadingAds, setIsLoadingAds] = useState(true);

  useEffect(() => {
    fetchDashboardAdvertisements();
  }, []);

  const fetchDashboardAdvertisements = async () => {
    try {
      const response = await fetch('/api/advertisements?type=DASHBOARD_BANNER&status=ACTIVE');
      const data = await response.json();
      
      if (data.success && data.data?.length > 0) {
        // Filter ads for veterinarians
        const veterinarianAds = data.data.filter((ad: DashboardAdvertisement) => 
          ad.targetAudience === "ALL" || ad.targetAudience === "VETERINARIANS"
        );
        setAdvertisements(veterinarianAds);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard advertisements:', error);
    } finally {
      setIsLoadingAds(false);
    }
  };

  // Transform API data to match AdvertisementSlider format
  const formattedAds = advertisements.map(ad => ({
    id: ad.id,
    imageUrl: ad.imageUrl || '',
    imageLargeUrl: ad.imageUrl || '',
    linkUrl: ad.linkUrl,
    title: ad.title,
    description: ad.description
  }));
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
