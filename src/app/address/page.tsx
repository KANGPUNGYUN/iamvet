import { Metadata } from "next";
import NaverMap from "@/components/NaverMap";
import Link from "next/link";

export const metadata: Metadata = {
  title: "사이트맵",
  description: "IAMVET 사이트맵 및 오시는 길",
  alternates: {
    canonical: "https://www.iam-vet.com/address",
  },
};

export default function AddressPage() {
  return (
    <div className="min-h-[1100px] bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 오시는 길 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">오시는 길</h2>

          {/* 회사 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                IAMVET
              </h3>
              <div className="space-y-2 text-gray-600">
                <p className="flex items-start">
                  <span className="font-medium mr-2 text-gray-900">주소:</span>
                  서울특별시 서초구 서초대로77길 39, 9층 102호
                </p>
                <p className="flex items-start">
                  <span className="font-medium mr-2 text-gray-900">전화:</span>
                  010-4203-1721
                </p>
                <p className="flex items-start">
                  <span className="font-medium mr-2 text-gray-900">
                    이메일:
                  </span>
                  iamvet25@gmail.com
                </p>
              </div>
            </div>
          </div>

          {/* 네이버 지도 */}
          <div className="mt-8">
            <NaverMap
              location="IAMVET"
              latitude={37.50108}
              longitude={127.025}
              width="100%"
              height="400px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
