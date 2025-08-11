import lecture1Img from "@/assets/images/lecture/lecture1.png";
import lecture2Img from "@/assets/images/lecture/lecture2.png";
import lecture3Img from "@/assets/images/lecture/lecture3.png";
import lecture4Img from "@/assets/images/lecture/lecture4.png";
import lecture5Img from "@/assets/images/lecture/lecture5.png";
import lecture6Img from "@/assets/images/lecture/lecture6.png";

export interface Comment {
  id: string;
  author: string;
  authorProfile: string;
  content: string;
  date: string;
  replies: Comment[];
}

export interface ReferenceFile {
  id: string;
  name: string;
  size: string;
  downloadUrl: string;
}

export interface LectureData {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorTitle: string;
  videoUrl: string;
  youtubeUrl?: string;
  thumbnailUrl?: string;
  medicalField: string;
  animalType?: string;
  difficulty: string;
  viewCount: number;
  rating: number;
  uploadDate: Date;
  category: string;
  isLiked?: boolean;
  isPublic: boolean;
  isActive: boolean;
  referenceFiles: ReferenceFile[];
  comments: Comment[];
}

export const allLecturesData: LectureData[] = [
  {
    id: "1",
    title: "중성화 동물 (개·고양이) 피부 절환 진단 치지",
    description: "이 영상은 개와 고양이에게 나타날 수 있는 다양한 피부 질환에 대해 다룹니다. 피부염의 종류, 진단 방법, 그리고 치료법에 대해 상세히 설명하며, 실제 사례를 통해 피부 질환을 체계적으로 접근하는 방법을 제시합니다. 수의사가 실무에서 자주 접하는 피부 질환들을 중심으로 한 실습 위주의 강의입니다.",
    instructor: "김수의 교수",
    instructorTitle: "국내 동물병원 원장, 수의학 박사",
    videoUrl: "/videos/lecture1.mp4",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: lecture1Img.src,
    medicalField: "surgery",
    animalType: "dog",
    difficulty: "beginner",
    viewCount: 1127,
    rating: 4.8,
    uploadDate: new Date("2024-04-09"),
    category: "수술 강의",
    isLiked: false,
    isPublic: true,
    isActive: true,
    referenceFiles: [
      {
        id: "1",
        name: "수술용 새소독.doc",
        size: "2.5MB",
        downloadUrl: "/files/reference1.doc",
      },
      {
        id: "2",
        name: "참고자료 완료.xlsx",
        size: "1.2MB",
        downloadUrl: "/files/reference2.xlsx",
      },
      {
        id: "3",
        name: "수술 가이드라인.pdf",
        size: "3.1MB",
        downloadUrl: "/files/reference3.pdf",
      },
    ],
    comments: [
      {
        id: "1",
        author: "홍길동수의사",
        authorProfile: "",
        content: "정말 유익한 강의였습니다. 실무에서 바로 적용할 수 있는 내용들이 많아서 도움이 됐어요.",
        date: "2024-04-10",
        replies: [
          {
            id: "1-1",
            author: "김수의 교수",
            authorProfile: "",
            content: "도움이 되셨다니 기쁩니다. 추가 질문이 있으시면 언제든 댓글로 남겨주세요!",
            date: "2024-04-10",
            replies: [],
          },
        ],
      },
      {
        id: "2",
        author: "박동물병원",
        authorProfile: "",
        content: "피부 질환 진단 부분이 특히 도움됐습니다. 감사합니다.",
        date: "2024-04-11",
        replies: [],
      },
    ],
  },
  {
    id: "2",
    title: "고양이 행동학 심화 과정",
    description: "고양이의 행동 패턴을 이해하고 문제 행동을 교정하는 방법을 학습합니다. 고양이의 스트레스 신호를 파악하는 방법부터 공격성, 배변 문제 등 다양한 행동 문제를 체계적으로 분석하고 해결하는 접근법을 제시합니다.",
    instructor: "박동물 박사",
    instructorTitle: "동물행동학 박사, 수의학 전문의",
    videoUrl: "/videos/lecture2.mp4",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: lecture2Img.src,
    medicalField: "behavior",
    animalType: "cat",
    difficulty: "advanced",
    viewCount: 890,
    rating: 4.6,
    uploadDate: new Date("2024-01-18"),
    category: "행동/심리학",
    isLiked: true,
    isPublic: true,
    isActive: true,
    referenceFiles: [
      {
        id: "1",
        name: "고양이 행동 체크리스트.pdf",
        size: "1.8MB",
        downloadUrl: "/files/cat-behavior-checklist.pdf",
      },
    ],
    comments: [
      {
        id: "1",
        author: "이수의사",
        authorProfile: "",
        content: "고양이 행동 교정에 대해 많이 배웠습니다. 감사합니다!",
        date: "2024-01-19",
        replies: [],
      },
    ],
  },
  {
    id: "3",
    title: "응급처치 실습 워크샵",
    description: "반려동물 응급상황 대처 방법과 실습을 통한 응급처치 기법을 배웁니다. 심폐소생술, 응급 수혈, 독성 물질 섭취 시 대처법 등 다양한 응급상황에 대한 실무적인 접근을 다룹니다.",
    instructor: "이응급 원장",
    instructorTitle: "응급의학 전문의, 수의학 박사",
    videoUrl: "/videos/lecture3.mp4",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: lecture3Img.src,
    medicalField: "emergency",
    animalType: "dog",
    difficulty: "intermediate",
    viewCount: 2150,
    rating: 4.9,
    uploadDate: new Date("2024-01-15"),
    category: "응급의학",
    isLiked: false,
    isPublic: true,
    isActive: true,
    referenceFiles: [
      {
        id: "1",
        name: "응급처치 매뉴얼.pdf",
        size: "4.2MB",
        downloadUrl: "/files/emergency-manual.pdf",
      },
    ],
    comments: [],
  },
  {
    id: "4",
    title: "피부과 진단학 기초",
    description: "반려동물 피부질환의 진단과 치료에 대한 기초적인 내용을 다룹니다.",
    instructor: "최피부 교수",
    instructorTitle: "수의피부과 전문의",
    videoUrl: "/videos/lecture4.mp4",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: lecture4Img.src,
    medicalField: "dermatology",
    animalType: "dog",
    difficulty: "beginner",
    viewCount: 1680,
    rating: 4.7,
    uploadDate: new Date("2024-01-12"),
    category: "피부과",
    isLiked: true,
    isPublic: true,
    isActive: true,
    referenceFiles: [],
    comments: [],
  },
  {
    id: "5",
    title: "내과 진료 실무",
    description: "반려동물 내과 질환의 진단과 치료 방법에 대해 학습합니다.",
    instructor: "정내과 원장",
    instructorTitle: "수의내과 전문의",
    videoUrl: "/videos/lecture5.mp4",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: lecture5Img.src,
    medicalField: "internal",
    animalType: "cat",
    difficulty: "intermediate",
    viewCount: 1420,
    rating: 4.5,
    uploadDate: new Date("2024-01-10"),
    category: "내과",
    isLiked: false,
    isPublic: true,
    isActive: true,
    referenceFiles: [],
    comments: [],
  },
  {
    id: "6",
    title: "영상진단학 마스터 클래스",
    description: "X-ray, 초음파 등 영상진단 기법의 활용법을 심화 학습합니다.",
    instructor: "한영상 박사",
    instructorTitle: "영상의학 박사",
    videoUrl: "/videos/lecture6.mp4",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: lecture6Img.src,
    medicalField: "radiology",
    animalType: "dog",
    difficulty: "advanced",
    viewCount: 950,
    rating: 4.8,
    uploadDate: new Date("2024-01-08"),
    category: "영상진단",
    isLiked: true,
    isPublic: true,
    isActive: true,
    referenceFiles: [],
    comments: [],
  },
  {
    id: "7",
    title: "마취학 실무 가이드",
    description: "안전한 마취 절차와 마취 중 모니터링에 대해 배웁니다.",
    instructor: "조마취 교수",
    instructorTitle: "마취학 전문의",
    videoUrl: "/videos/lecture7.mp4",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: lecture2Img.src,
    medicalField: "anesthesia",
    animalType: "dog",
    difficulty: "intermediate",
    viewCount: 1320,
    rating: 4.6,
    uploadDate: new Date("2024-01-05"),
    category: "마취학",
    isLiked: false,
    isPublic: true,
    isActive: true,
    referenceFiles: [],
    comments: [],
  },
  {
    id: "8",
    title: "치과 진료의 기초와 실제",
    description: "반려동물 치과 질환의 진단, 치료 및 예방에 대해 학습합니다.",
    instructor: "김치과 원장",
    instructorTitle: "수의치과 전문의",
    videoUrl: "/videos/lecture8.mp4",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: lecture3Img.src,
    medicalField: "dentistry",
    animalType: "cat",
    difficulty: "beginner",
    viewCount: 1140,
    rating: 4.4,
    uploadDate: new Date("2024-01-03"),
    category: "치과",
    isLiked: true,
    isPublic: true,
    isActive: true,
    referenceFiles: [],
    comments: [],
  },
  {
    id: "9",
    title: "외과 수술 고급 테크닉",
    description: "복잡한 외과 수술 절차와 고급 테크닉을 상세히 다룹니다.",
    instructor: "신외과 교수",
    instructorTitle: "외과 전문의",
    videoUrl: "/videos/lecture9.mp4",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: lecture4Img.src,
    medicalField: "surgery",
    animalType: "dog",
    difficulty: "advanced",
    viewCount: 780,
    rating: 4.9,
    uploadDate: new Date("2024-01-01"),
    category: "수술 강의",
    isLiked: false,
    isPublic: true,
    isActive: true,
    referenceFiles: [],
    comments: [],
  },
  {
    id: "10",
    title: "영상진단학 마스터 클래스",
    description: "X-ray, 초음파 등 영상진단 기법의 활용법을 심화 학습합니다.",
    instructor: "한영상 박사",
    instructorTitle: "영상의학 박사",
    videoUrl: "/videos/lecture6.mp4",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: lecture6Img.src,
    medicalField: "radiology",
    animalType: "dog",
    difficulty: "advanced",
    viewCount: 950,
    rating: 4.8,
    uploadDate: new Date("2024-01-08"),
    category: "영상진단",
    isLiked: true,
    isPublic: true,
    isActive: true,
    referenceFiles: [],
    comments: [],
  },
];
