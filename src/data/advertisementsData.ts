import advertise01Img from "@/assets/images/advertise01.jpg";
import advertiseL01Img from "@/assets/images/advertiseL01.jpg";

export interface Advertisement {
  id: string;
  imageUrl: string;
  imageLargeUrl: string;
  linkUrl?: string;
}

export const advertisementsData: Advertisement[] = [
  {
    id: "1",
    imageUrl: advertise01Img.src,
    imageLargeUrl: advertiseL01Img.src,
    linkUrl: "/",
  },
  {
    id: "2",
    imageUrl: advertise01Img.src,
    imageLargeUrl: advertiseL01Img.src,
    linkUrl: "/",
  },
  {
    id: "3",
    imageUrl: advertise01Img.src,
    imageLargeUrl: advertiseL01Img.src,
    linkUrl: "/",
  },
  {
    id: "4",
    imageUrl: advertise01Img.src,
    imageLargeUrl: advertiseL01Img.src,
    linkUrl: "/",
  },
];
