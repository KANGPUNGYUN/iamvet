export interface JobData {
  id: number;
  hospital: string;
  dDay: string;
  position: string;
  location: string;
  jobType: string;
  workType: string;
  experience: string;
  region: string;
  tags: string[];
  isBookmarked: boolean;
  isNew: boolean;
  createdAt: Date;
  deadline: Date;
}

export interface JobDetailData {
  id: string;
  title: string;
  experienceLevel: string;
  location: string;
  keywords: string[];
  bookmarked: boolean;
  deadline: string;
  workConditions: {
    workType: string;
    workDays: string;
    workHours: string;
    salary: string;
    benefits: string;
  };
  qualifications: {
    education: string;
    certificates: string;
    experience: string;
  };
  preferredQualifications: string[];
  hospital: {
    id: string;
    name: string;
    description: string;
    location: string;
    website: string;
    phone: string;
    keywords: string[];
    image?: string;
  };
}

export const allJobData: JobData[] = [
  {
    id: 1,
    hospital: "서울동물메디컬센터",
    dDay: "D-3",
    position: "수의사",
    location: "서울시 강남구",
    jobType: "경력직",
    workType: "fulltime",
    experience: "senior",
    region: "seoul",
    tags: ["내과", "외과", "응급진료"],
    isBookmarked: false,
    isNew: true,
    createdAt: new Date("2024-01-15"),
    deadline: new Date("2024-02-15"),
  },
  {
    id: 2,
    hospital: "건국대학교 동물병원",
    dDay: "D-7",
    position: "간호조무사",
    location: "서울시 광진구",
    jobType: "신입",
    workType: "parttime",
    experience: "new",
    region: "seoul",
    tags: ["간호", "케어", "정규직"],
    isBookmarked: true,
    isNew: true,
    createdAt: new Date("2024-01-14"),
    deadline: new Date("2024-02-14"),
  },
  {
    id: 3,
    hospital: "연세동물병원",
    dDay: "D-5",
    position: "수의사",
    location: "부산시 해운대구",
    jobType: "경력직",
    workType: "fulltime",
    experience: "mid",
    region: "busan",
    tags: ["피부과", "안과", "치과"],
    isBookmarked: false,
    isNew: true,
    createdAt: new Date("2024-01-13"),
    deadline: new Date("2024-02-13"),
  },
  {
    id: 4,
    hospital: "대구동물의료센터",
    dDay: "D-10",
    position: "수의테크니션",
    location: "대구시 중구",
    jobType: "경력직",
    workType: "contract",
    experience: "junior",
    region: "daegu",
    tags: ["검사", "진단", "랩"],
    isBookmarked: false,
    isNew: false,
    createdAt: new Date("2024-01-12"),
    deadline: new Date("2024-02-12"),
  },
  {
    id: 5,
    hospital: "인천반려동물병원",
    dDay: "D-14",
    position: "동물간호사",
    location: "인천시 남동구",
    jobType: "신입",
    workType: "fulltime",
    experience: "new",
    region: "incheon",
    tags: ["간호", "수술보조", "응급"],
    isBookmarked: true,
    isNew: false,
    createdAt: new Date("2024-01-11"),
    deadline: new Date("2024-02-11"),
  },
  {
    id: 6,
    hospital: "광주동물종합병원",
    dDay: "D-20",
    position: "수의사",
    location: "광주시 북구",
    jobType: "경력직",
    workType: "fulltime",
    experience: "senior",
    region: "gwangju",
    tags: ["내과", "외과", "영상진단"],
    isBookmarked: false,
    isNew: false,
    createdAt: new Date("2024-01-10"),
    deadline: new Date("2024-02-10"),
  },
  {
    id: 7,
    hospital: "대전펫클리닉",
    dDay: "D-12",
    position: "수의사",
    location: "대전시 유성구",
    jobType: "경력직",
    workType: "parttime",
    experience: "mid",
    region: "daejeon",
    tags: ["일반진료", "예방접종"],
    isBookmarked: false,
    isNew: false,
    createdAt: new Date("2024-01-09"),
    deadline: new Date("2024-02-09"),
  },
  {
    id: 8,
    hospital: "울산동물의료원",
    dDay: "D-8",
    position: "간호조무사",
    location: "울산시 남구",
    jobType: "신입",
    workType: "fulltime",
    experience: "new",
    region: "ulsan",
    tags: ["간호", "접수", "관리"],
    isBookmarked: true,
    isNew: false,
    createdAt: new Date("2024-01-08"),
    deadline: new Date("2024-02-08"),
  },
  {
    id: 9,
    hospital: "경기동물메디컬",
    dDay: "D-6",
    position: "수의사",
    location: "경기도 성남시",
    jobType: "경력직",
    workType: "fulltime",
    experience: "senior",
    region: "gyeonggi",
    tags: ["내과", "외과", "마취"],
    isBookmarked: false,
    isNew: false,
    createdAt: new Date("2024-01-07"),
    deadline: new Date("2024-02-07"),
  },
  {
    id: 10,
    hospital: "강원동물병원",
    dDay: "D-15",
    position: "동물간호사",
    location: "강원도 춘천시",
    jobType: "경력직",
    workType: "contract",
    experience: "junior",
    region: "gangwon",
    tags: ["간호", "재활", "물리치료"],
    isBookmarked: false,
    isNew: false,
    createdAt: new Date("2024-01-06"),
    deadline: new Date("2024-02-06"),
  },
];

export const popularJobsData = [
  {
    rank: 1,
    title: "서울대학교 동물병원",
    subtitle: "수의사 (경력직)",
    color: "#FF6B6B",
  },
  {
    rank: 2,
    title: "건국대학교 동물병원",
    subtitle: "수의사 (경력직)",
    color: "#4ECDC4",
  },
  {
    rank: 3,
    title: "연세동물병원",
    subtitle: "간호사 (경력직)",
    color: "#45B7D1",
  },
  {
    rank: 4,
    title: "영역학 동물병원",
    subtitle: "수의사 (경력직)",
    color: "#96CEB4",
  },
  {
    rank: 5,
    title: "까꿍 동물메디컬센터",
    subtitle: "수의사 (경력직)",
    color: "#FECA57",
  },
];

export const jobDetailData: JobDetailData[] = [
  {
    id: "1",
    title: "서울동물메디컬센터 수의사 모집",
    experienceLevel: "경력 5년 이상",
    location: "서울시 강남구",
    keywords: ["내과", "외과", "응급진료"],
    bookmarked: false,
    deadline: "D-3",
    workConditions: {
      workType: "정규직",
      workDays: "월~금",
      workHours: "09:00 ~ 18:00",
      salary: "연봉 4,000만원 ~ 5,000만원 (경력에 따라 협의)",
      benefits: "4대 보험, 연차, 교육비 지원, 식비 지원",
    },
    qualifications: {
      education: "수의대 졸업",
      certificates: "수의사 면허 필수",
      experience: "경력 5년 이상",
    },
    preferredQualifications: ["내과 전문의", "외과 경험", "응급처치 가능자"],
    hospital: {
      id: "1",
      name: "서울동물메디컬센터",
      description:
        "최신 의료 장비를 갖춘 종합동물병원으로, 24시간 응급진료 서비스를 제공합니다.",
      location: "서울시 강남구",
      website: "www.seouldmc.com",
      phone: "02-555-0001",
      keywords: ["내과", "외과", "응급진료"],
      image: "",
    },
  },
  {
    id: "2",
    title: "건국대학교 동물병원 간호조무사 모집",
    experienceLevel: "신입 가능",
    location: "서울시 광진구",
    keywords: ["간호", "케어", "정규직"],
    bookmarked: true,
    deadline: "D-7",
    workConditions: {
      workType: "파트타임",
      workDays: "월~금",
      workHours: "09:00 ~ 13:00",
      salary: "시급 15,000원",
      benefits: "4대 보험, 식비 지원, 교육 제공",
    },
    qualifications: {
      education: "고등학교 졸업 이상",
      certificates: "관련 자격증 우대",
      experience: "신입 가능",
    },
    preferredQualifications: ["동물 관련 전공", "친화적 성격", "책임감"],
    hospital: {
      id: "2",
      name: "건국대학교 동물병원",
      description:
        "대학 부속 동물병원으로 교육과 진료를 병행하는 전문 의료기관입니다.",
      location: "서울시 광진구",
      website: "www.konkuk-vet.ac.kr",
      phone: "02-555-0002",
      keywords: ["간호", "케어", "정규직"],
      image: "",
    },
  },
  {
    id: "3",
    title: "연세동물병원 수의사 모집",
    experienceLevel: "경력 3~5년",
    location: "부산시 해운대구",
    keywords: ["피부과", "안과", "치과"],
    bookmarked: false,
    deadline: "D-5",
    workConditions: {
      workType: "정규직",
      workDays: "월~토",
      workHours: "09:00 ~ 18:00",
      salary: "연봉 3,500만원 ~ 4,200만원",
      benefits: "4대 보험, 연차, 성과급, 교육비 지원",
    },
    qualifications: {
      education: "수의대 졸업",
      certificates: "수의사 면허 필수",
      experience: "경력 3~5년",
    },
    preferredQualifications: [
      "피부과 전문지식",
      "안과 진료 경험",
      "치과 진료 가능",
    ],
    hospital: {
      id: "3",
      name: "연세동물병원",
      description: "전문 진료과목을 운영하는 특화된 동물병원입니다.",
      location: "부산시 해운대구",
      website: "www.yonseivet.com",
      phone: "051-555-0003",
      keywords: ["피부과", "안과", "치과"],
      image: "",
    },
  },
  {
    id: "4",
    title: "대구동물의료센터 수의테크니션 모집",
    experienceLevel: "경력 1~3년",
    location: "대구시 중구",
    keywords: ["검사", "진단", "랩"],
    bookmarked: false,
    deadline: "D-10",
    workConditions: {
      workType: "계약직",
      workDays: "월~금",
      workHours: "08:30 ~ 17:30",
      salary: "연봉 2,800만원 ~ 3,200만원",
      benefits: "4대 보험, 연차, 교육 지원",
    },
    qualifications: {
      education: "전문대 졸업 이상",
      certificates: "관련 자격증 우대",
      experience: "경력 1~3년",
    },
    preferredQualifications: ["검사 기술", "진단 경험", "랩 업무 숙련"],
    hospital: {
      id: "4",
      name: "대구동물의료센터",
      description: "최첨단 검사 장비를 보유한 진단 전문 동물병원입니다.",
      location: "대구시 중구",
      website: "www.dgamc.com",
      phone: "053-555-0004",
      keywords: ["검사", "진단", "랩"],
      image: "",
    },
  },
  {
    id: "5",
    title: "인천반려동물병원 동물간호사 모집",
    experienceLevel: "신입 가능",
    location: "인천시 남동구",
    keywords: ["간호", "수술보조", "응급"],
    bookmarked: true,
    deadline: "D-14",
    workConditions: {
      workType: "정규직",
      workDays: "월~금",
      workHours: "09:00 ~ 18:00",
      salary: "연봉 2,400만원 ~ 2,800만원",
      benefits: "4대 보험, 연차, 야근수당, 교육비 지원",
    },
    qualifications: {
      education: "전문대 졸업 이상",
      certificates: "동물간호사 자격증 우대",
      experience: "신입 가능",
    },
    preferredQualifications: [
      "동물 간호 전공",
      "수술 보조 경험",
      "응급처치 가능",
    ],
    hospital: {
      id: "5",
      name: "인천반려동물병원",
      description: "반려동물과 가족을 위한 따뜻한 치료 서비스를 제공합니다.",
      location: "인천시 남동구",
      website: "www.icheonpet.com",
      phone: "032-555-0005",
      keywords: ["간호", "수술보조", "응급"],
      image: "",
    },
  },
  {
    id: "6",
    title: "광주동물종합병원 수의사 모집",
    experienceLevel: "경력 5년 이상",
    location: "광주시 북구",
    keywords: ["내과", "외과", "영상진단"],
    bookmarked: false,
    deadline: "D-20",
    workConditions: {
      workType: "정규직",
      workDays: "월~토",
      workHours: "09:00 ~ 19:00",
      salary: "연봉 4,200만원 ~ 5,500만원",
      benefits: "4대 보험, 연차, 성과급, 학회 참가비 지원",
    },
    qualifications: {
      education: "수의대 졸업",
      certificates: "수의사 면허 필수",
      experience: "경력 5년 이상",
    },
    preferredQualifications: ["내과 전문의", "외과 수술 경험", "영상진단 가능"],
    hospital: {
      id: "6",
      name: "광주동물종합병원",
      description:
        "광주 지역 최대 규모의 종합동물병원으로 전문 진료 서비스를 제공합니다.",
      location: "광주시 북구",
      website: "www.gjvh.com",
      phone: "062-555-0006",
      keywords: ["내과", "외과", "영상진단"],
      image: "",
    },
  },
  {
    id: "7",
    title: "대전펫클리닉 수의사 모집",
    experienceLevel: "경력 3~5년",
    location: "대전시 유성구",
    keywords: ["일반진료", "예방접종"],
    bookmarked: false,
    deadline: "D-12",
    workConditions: {
      workType: "파트타임",
      workDays: "월~금",
      workHours: "14:00 ~ 19:00",
      salary: "시급 35,000원",
      benefits: "4대 보험, 유연근무, 교육 지원",
    },
    qualifications: {
      education: "수의대 졸업",
      certificates: "수의사 면허 필수",
      experience: "경력 3~5년",
    },
    preferredQualifications: [
      "일반진료 경험",
      "예방접종 숙련",
      "소통능력 우수",
    ],
    hospital: {
      id: "7",
      name: "대전펫클리닉",
      description: "지역 주민을 위한 친근한 동네 동물병원입니다.",
      location: "대전시 유성구",
      website: "www.daejeonpet.com",
      phone: "042-555-0007",
      keywords: ["일반진료", "예방접종"],
      image: "",
    },
  },
  {
    id: "8",
    title: "울산동물의료원 간호조무사 모집",
    experienceLevel: "신입 가능",
    location: "울산시 남구",
    keywords: ["간호", "접수", "관리"],
    bookmarked: true,
    deadline: "D-8",
    workConditions: {
      workType: "정규직",
      workDays: "월~토",
      workHours: "09:00 ~ 18:00",
      salary: "연봉 2,200만원 ~ 2,600만원",
      benefits: "4대 보험, 연차, 식비 지원",
    },
    qualifications: {
      education: "고등학교 졸업 이상",
      certificates: "관련 자격증 우대",
      experience: "신입 가능",
    },
    preferredQualifications: [
      "간호 보조 업무",
      "접수 업무 가능",
      "친화적 성격",
    ],
    hospital: {
      id: "8",
      name: "울산동물의료원",
      description: "울산 지역의 믿을 수 있는 동물 의료 서비스를 제공합니다.",
      location: "울산시 남구",
      website: "www.ulsanvet.com",
      phone: "052-555-0008",
      keywords: ["간호", "접수", "관리"],
      image: "",
    },
  },
  {
    id: "9",
    title: "경기동물메디컬 수의사 모집",
    experienceLevel: "경력 5년 이상",
    location: "경기도 성남시",
    keywords: ["내과", "외과", "마취"],
    bookmarked: false,
    deadline: "D-6",
    workConditions: {
      workType: "정규직",
      workDays: "월~금",
      workHours: "09:00 ~ 18:00",
      salary: "연봉 4,500만원 ~ 6,000만원",
      benefits: "4대 보험, 연차, 성과급, 학회비 지원",
    },
    qualifications: {
      education: "수의대 졸업",
      certificates: "수의사 면허 필수",
      experience: "경력 5년 이상",
    },
    preferredQualifications: [
      "내과 전문의",
      "외과 수술 숙련",
      "마취 관리 가능",
    ],
    hospital: {
      id: "9",
      name: "경기동물메디컬",
      description:
        "경기 지역 최고 수준의 의료 서비스를 제공하는 전문 동물병원입니다.",
      location: "경기도 성남시",
      website: "www.gyeonggivet.com",
      phone: "031-555-0009",
      keywords: ["내과", "외과", "마취"],
      image: "",
    },
  },
  {
    id: "10",
    title: "강원동물병원 동물간호사 모집",
    experienceLevel: "경력 1~3년",
    location: "강원도 춘천시",
    keywords: ["간호", "재활", "물리치료"],
    bookmarked: false,
    deadline: "D-15",
    workConditions: {
      workType: "계약직",
      workDays: "월~금",
      workHours: "09:00 ~ 17:00",
      salary: "연봉 2,600만원 ~ 3,000만원",
      benefits: "4대 보험, 연차, 재활 교육 지원",
    },
    qualifications: {
      education: "전문대 졸업 이상",
      certificates: "동물간호사 자격증 필수",
      experience: "경력 1~3년",
    },
    preferredQualifications: ["동물 재활 경험", "물리치료 지식", "인내심"],
    hospital: {
      id: "10",
      name: "강원동물병원",
      description:
        "동물 재활 및 물리치료 전문 서비스를 제공하는 특화 병원입니다.",
      location: "강원도 춘천시",
      website: "www.kangwonvet.com",
      phone: "033-555-0010",
      keywords: ["간호", "재활", "물리치료"],
      image: "",
    },
  },
];

export const getJobById = (id: string): JobDetailData | undefined => {
  return jobDetailData.find((job) => job.id === id);
};

// 관련 채용공고 (임시 데이터)
export const relatedJobsData = [
  {
    id: "2",
    title: "건국대학교 동물병원",
    location: "서울시 광진구",
    salary: "연봉 협의",
    keywords: ["간호", "케어", "정규직"],
    deadline: "~6/7(금)",
    bookmarked: false,
    isNew: true,
  },
  {
    id: "3",
    title: "연세동물병원",
    location: "부산시 해운대구",
    salary: "연봉 협의",
    keywords: ["피부과", "안과", "치과"],
    deadline: "~6/7(금)",
    bookmarked: true,
    isNew: true,
  },
  {
    id: "4",
    title: "대구동물의료센터",
    location: "대구시 중구",
    salary: "연봉 협의",
    keywords: ["검사", "진단", "랩"],
    deadline: "~6/7(금)",
    bookmarked: false,
    isNew: false,
  },
];
