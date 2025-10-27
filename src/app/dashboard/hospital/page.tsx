"use client";

import { useState, useEffect } from "react";
import HospitalProfileCard from "@/components/ui/HospitalProfileCard";
import RecruitmentStatusCard from "@/components/ui/RecruitmentStatusCard";
import UrgentJobsCard from "@/components/ui/UrgentJobsCard";
import HospitalNotificationsCard from "@/components/ui/HospitalNotificationsCard";
import ApplicantsTable from "@/components/ui/ApplicantsTable";
import AdvertisementSlider from "@/components/ui/AdvertisementSlider";
import { useNotificationStore } from "@/store/notificationStore";

interface DashboardAdvertisement {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  linkUrl?: string;
  targetAudience: "ALL" | "VETERINARIANS" | "HOSPITALS";
}

interface Notification {
  id: string;
  type: string;
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export default function HospitalDashboardPage() {
  const [advertisements, setAdvertisements] = useState<DashboardAdvertisement[]>([]);
  const [isLoadingAds, setIsLoadingAds] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  
  // 알림 store 사용
  const { fetchUnreadCount } = useNotificationStore();

  useEffect(() => {
    fetchDashboardAdvertisements();
    fetchNotifications();
  }, []);

  const fetchDashboardAdvertisements = async () => {
    try {
      const response = await fetch('/api/advertisements?type=DASHBOARD_BANNER&status=ACTIVE');
      const data = await response.json();
      
      if (data.success && data.data?.length > 0) {
        // Filter ads for hospitals
        const hospitalAds = data.data.filter((ad: DashboardAdvertisement) => 
          ad.targetAudience === "ALL" || ad.targetAudience === "HOSPITALS"
        );
        setAdvertisements(hospitalAds);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard advertisements:', error);
    } finally {
      setIsLoadingAds(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      // 토큰 가져오기
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.log('No access token found');
        return;
      }

      const response = await fetch('/api/messages?type=notifications&filter=unread&sort=recent&limit=2', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const data = await response.json();
      
      if (response.ok && data.messages) {
        // 최대 2개의 읽지 않은 알림만 저장
        setNotifications(data.messages.slice(0, 2));
        // 알림 store의 카운트도 업데이트
        fetchUnreadCount();
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoadingNotifications(false);
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
          {/* 첫 번째 행 */}
          <div className="flex gap-[24px] lg:flex-row flex-col lg:justify-between">
            {/* 병원 프로필 */}
            <HospitalProfileCard />

            {/* 채용 현황 */}
            <RecruitmentStatusCard />
          </div>

          {/* 광고 슬라이더 - 광고가 있을 때만 표시 */}
          {!isLoadingAds && formattedAds.length > 0 && (
            <AdvertisementSlider
              advertisements={formattedAds}
              autoPlay={true}
              autoPlayInterval={5000}
            />
          )}

          <div className="flex gap-[24px] lg:flex-row flex-col lg:justify-between">
            {/* 내 채용 공고 */}
            <UrgentJobsCard />
            {/* 신규 알림 */}
            <HospitalNotificationsCard 
              notifications={notifications.map(notif => ({
                id: notif.id,
                title: notif.title,
                message: notif.content,
                createdAt: notif.createdAt
              }))}
              isLoading={isLoadingNotifications}
            />
          </div>

          {/* 지원자 정보 */}
          <ApplicantsTable />
        </div>
      </div>
    </div>
  );
}