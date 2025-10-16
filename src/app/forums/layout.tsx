import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "임상 포럼 - IAMVET",
  description: "수의사들이 임상 경험과 지식을 공유하는 전문 포럼입니다. 내과, 외과, 특수동물 등 다양한 분야의 임상 케이스와 토론을 확인하세요.",
};

export default function ForumsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}