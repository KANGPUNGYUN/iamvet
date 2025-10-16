import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "양도/양수 게시판 - IAMVET",
  description: "동물병원 양도, 의료장비, 기계장치, 인테리어 등 동물병원 관련 양도/양수 정보를 확인하세요. 전국의 다양한 매물을 한눈에 볼 수 있습니다.",
};

export default function TransfersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}