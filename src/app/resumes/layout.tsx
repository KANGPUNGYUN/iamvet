import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "인재 채용 - IAMVET",
  description: "경력 있는 수의사와 수의테크니션의 이력서를 확인하고 우수한 인재를 채용하세요. 다양한 분야의 전문 인력을 만나보실 수 있습니다.",
};

export default function ResumesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}