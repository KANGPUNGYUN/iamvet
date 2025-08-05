"use client";

import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface GoogleMapProps {
  location: string;
  width?: string;
  height?: string;
}

const GoogleMap = ({ location, width = "100%", height = "400px" }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 기본적으로 회색 배경 UI를 보여주기
    const showFallbackUI = () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = `
          <div style="
            width: 100%; 
            height: 100%; 
            display: flex; 
            flex-direction: column;
            align-items: center; 
            justify-content: center; 
            background-color: #f8f9fa; 
            border-radius: 8px;
            color: #6c757d;
            text-align: center;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          ">
            <div style="
              width: 48px; 
              height: 48px; 
              background-color: #dee2e6; 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              margin-bottom: 12px;
            ">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#6c757d">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <div style="font-size: 16px; font-weight: 600; margin-bottom: 4px; color: #495057;">위치 정보</div>
            <div style="font-size: 14px; color: #6c757d;">${location}</div>
          </div>
        `;
      }
    };

    // API 키가 없거나 결제 정보가 없는 경우를 대비해 기본 UI 표시
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY === 'your_google_maps_api_key_here') {
      showFallbackUI();
      return;
    }

    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        version: "weekly",
      });

      try {
        const google = await loader.load();
        
        // 지역별 대략적인 좌표 매핑
        const locationCoords: { [key: string]: { lat: number; lng: number } } = {
          "서울 강남구": { lat: 37.5175896, lng: 127.0867004 },
          "경기 성남시 분당구": { lat: 37.3595704, lng: 127.1052133 },
          "서울 마포구": { lat: 37.5663245, lng: 126.9779692 },
          "경기 고양시 일산동구": { lat: 37.6585107, lng: 126.7747168 },
          "경기 수원시 영통구": { lat: 37.2635727, lng: 127.0286009 },
          "부산 해운대구": { lat: 35.1631632, lng: 129.1635572 },
          "대전 중구": { lat: 36.3504119, lng: 127.3845475 },
          "광주 북구": { lat: 35.1762739, lng: 126.9115578 },
        };

        const defaultCoords = { lat: 37.5175896, lng: 127.0867004 };
        const coords = locationCoords[location] || defaultCoords;

        if (mapRef.current) {
          const map = new google.maps.Map(mapRef.current, {
            center: coords,
            zoom: 16,
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: true,
            mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
              position: google.maps.ControlPosition.TOP_CENTER,
            },
            zoomControlOptions: {
              position: google.maps.ControlPosition.RIGHT_CENTER,
            },
          });

          // 마커 추가
          const marker = new google.maps.Marker({
            position: coords,
            map: map,
            title: location,
          });

          // 정보창 추가
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 10px; font-size: 14px; max-width: 200px;">
                <strong style="color: #333;">${location}</strong><br/>
                <span style="color: #666;">동물병원 위치</span>
              </div>
            `,
          });

          // 마커 클릭 시 정보창 표시
          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });

          // 지도 클릭 시 정보창 닫기
          map.addListener("click", () => {
            infoWindow.close();
          });

          // 기본적으로 정보창 열어두기
          infoWindow.open(map, marker);
        }
      } catch (error) {
        // 모든 에러에 대해 조용히 처리하고 대체 UI 표시
        console.warn("Google Maps를 불러올 수 없어 기본 UI를 표시합니다:", error.message);
        showFallbackUI();
      }
    };

    initMap();
  }, [location]);

  return (
    <div 
      ref={mapRef}
      style={{ 
        width, 
        height,
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid #e0e0e0"
      }}
      className="mt-4"
    />
  );
};

export default GoogleMap;