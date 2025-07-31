import lecture1Img from "@/assets/images/lecture/lecture1.png";
import lecture2Img from "@/assets/images/lecture/lecture2.png";
import lecture3Img from "@/assets/images/lecture/lecture3.png";
import lecture4Img from "@/assets/images/lecture/lecture4.png";

export interface Advertisement {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  description?: string;
}

export const advertisementsData: Advertisement[] = [
  {
    id: "1",
    title: "전문가의 이력서 첨삭 서비스",
    description: "수의사 전용 이력서 첨삭 서비스 20% 할인 이벤트",
    imageUrl: lecture1Img.src,
    linkUrl: "/",
  },
  {
    id: "2",
    title: "최신 의료장비 특가 세일",
    description: "고품질 수의학 장비를 특별가로 만나보세요",
    imageUrl: lecture2Img.src,
    linkUrl: "/",
  },
  {
    id: "3",
    title: "온라인 수의학 컨퍼런스 2024",
    description: "국내외 수의학 전문가들과 함께하는 특별한 시간",
    imageUrl: lecture3Img.src,
    linkUrl: "/",
  },
  {
    id: "4",
    title: "동물병원 개원 컨설팅",
    description: "성공적인 동물병원 개원을 위한 전문 컨설팅 서비스",
    imageUrl: lecture4Img.src,
    linkUrl: "/",
  },
];
