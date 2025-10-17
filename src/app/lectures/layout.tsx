import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "강의 영상",
  description: "수의학 전문 강의 영상을 통해 최신 의료 기술과 임상 노하우를 학습하세요. 수술, 내과, 응급의학 등 다양한 분야의 전문 강의를 제공합니다.",
  alternates: {
    canonical: "https://www.iam-vet.com/lectures",
  },
  openGraph: {
    title: "강의 영상 - IAMVET",
    description: "수의학 전문 강의 영상을 통해 최신 의료 기술과 임상 노하우를 학습하세요. 수술, 내과, 응급의학 등 다양한 분야의 전문 강의를 제공합니다.",
    images: [
      {
        url: "https://www.iam-vet.com/opengraph.png",
        width: 1200,
        height: 630,
        alt: "IAMVET 강의 영상",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "강의 영상 - IAMVET",
    description: "수의학 전문 강의 영상을 통해 최신 의료 기술과 임상 노하우를 학습하세요.",
    images: [{ url: "https://www.iam-vet.com/opengraph.png", alt: "IAMVET 강의 영상" }],
  },
};

export default function LecturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}