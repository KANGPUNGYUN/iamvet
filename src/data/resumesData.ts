export interface ResumeListData {
  id: string;
  name: string;
  experience: string;
  preferredLocation: string;
  keywords: string[];
  lastAccessDate: string;
  profileImage?: string;
  isNew: boolean;
  isBookmarked: boolean;
  createdAt: Date;
}

export interface ResumeData {
  id: string;
  name: string;
  profileImage: string | null;
  summary: string;
  contact: string;
  email: string;
  currentWorkplace: string;
  totalExperience: string;
  availableStartDate: string;
  personalInfo: {
    name: string;
    birthDate: string;
    contact: string;
    email: string;
    jobField: string;
    major: string;
  };
  workPreferences: {
    workType: string;
    salary: string;
    workDays: string;
    workHours: string;
    workLocation: string;
    availableDate: string;
  };
  careers: Array<{
    id: number;
    duration: string;
    startDate: string;
    endDate: string;
    hospitalName: string;
    experience: string;
  }>;
  educations: Array<{
    id: number;
    degree: string;
    graduationStatus: string;
    startDate: string;
    endDate: string;
    schoolName: string;
    major: string;
    gpa: number;
    gpaScale: number;
  }>;
  certificates: Array<{
    id: number;
    issuer: string;
    acquisitionDate: string;
    name: string;
    grade: string;
  }>;
  capabilities: Array<{
    id: number;
    major: string;
    level: string;
    name: string;
    experience: string;
  }>;
  selfIntroduction: string;
  evaluations: {
    overallAverage: number;
    totalEvaluations: number;
    hospitals: Array<{
      id: number;
      hospitalName: string;
      evaluationDate: string;
      overallRating: number;
      ratings: {
        stressManagement: number;
        growth: number;
        care: number;
        documentation: number;
        contribution: number;
      };
      detailedEvaluations: Array<{
        category: string;
        rating: number;
        comment: string;
      }>;
    }>;
  };
}

export type ResumeListDataType = ResumeListData;

export const allResumeData: ResumeListData[] = [
  {
    id: "1",
    name: "김수희",
    experience: "경력 3년 4개월",
    preferredLocation: "서울 강남구, 서초구",
    keywords: ["내과", "정규직", "수의사"],
    lastAccessDate: "2025.04.15",
    profileImage: undefined,
    isNew: true,
    isBookmarked: false,
    createdAt: new Date("2025-04-15"),
  },
  {
    id: "2",
    name: "박민준",
    experience: "경력 5년 2개월",
    preferredLocation: "서울 전지역",
    keywords: ["외과", "정형외과", "정규직", "수의사"],
    lastAccessDate: "2025.04.14",
    profileImage: undefined,
    isNew: false,
    isBookmarked: true,
    createdAt: new Date("2025-04-10"),
  },
  {
    id: "3",
    name: "이지연",
    experience: "경력 4년 8개월",
    preferredLocation: "서울 강남구, 서초구, 송파구",
    keywords: ["피부과", "알러지", "정규직", "수의사"],
    lastAccessDate: "2025.04.13",
    profileImage: undefined,
    isNew: false,
    isBookmarked: false,
    createdAt: new Date("2025-04-08"),
  },
  {
    id: "4",
    name: "최치료",
    experience: "경력 7년",
    preferredLocation: "서울 강남구, 서울 서초구",
    keywords: ["내과", "외과", "관리직", "정규직", "수의사"],
    lastAccessDate: "2025.04.12",
    profileImage: undefined,
    isNew: false,
    isBookmarked: true,
    createdAt: new Date("2025-04-05"),
  },
  {
    id: "5",
    name: "한간호",
    experience: "경력 2년",
    preferredLocation: "인천 남동구, 경기 성남시",
    keywords: ["내과", "피부과", "계약직", "간호조무사"],
    lastAccessDate: "2025.04.11",
    profileImage: undefined,
    isNew: true,
    isBookmarked: false,
    createdAt: new Date("2025-04-12"),
  },
  {
    id: "6",
    name: "정간호",
    experience: "경력 4년",
    preferredLocation: "경기 수원시, 경기 용인시",
    keywords: ["간호", "내과", "정규직", "간호조무사"],
    lastAccessDate: "2025.04.10",
    profileImage: undefined,
    isNew: false,
    isBookmarked: false,
    createdAt: new Date("2025-04-03"),
  },
  {
    id: "7",
    name: "송수술",
    experience: "경력 6년",
    preferredLocation: "서울 전지역",
    keywords: ["외과", "정형외과", "신경외과", "정규직", "수의사"],
    lastAccessDate: "2025.04.09",
    profileImage: undefined,
    isNew: false,
    isBookmarked: true,
    createdAt: new Date("2025-04-01"),
  },
  {
    id: "8",
    name: "윤예방",
    experience: "신입",
    preferredLocation: "대전 서구, 대전 유성구",
    keywords: ["예방의학", "공중보건", "파트타임", "수의사"],
    lastAccessDate: "2025.04.08",
    profileImage: undefined,
    isNew: true,
    isBookmarked: false,
    createdAt: new Date("2025-04-14"),
  },
  {
    id: "9",
    name: "장진단",
    experience: "경력 8년",
    preferredLocation: "부산 전지역",
    keywords: ["진단의학", "영상의학", "정규직", "수의사"],
    lastAccessDate: "2025.04.07",
    profileImage: undefined,
    isNew: false,
    isBookmarked: false,
    createdAt: new Date("2025-03-28"),
  },
  {
    id: "10",
    name: "강연구",
    experience: "경력 10년",
    preferredLocation: "서울 강남구, 서울 중구",
    keywords: ["연구", "임상시험", "학술", "정규직", "수의사"],
    lastAccessDate: "2025.04.06",
    profileImage: undefined,
    isNew: false,
    isBookmarked: true,
    createdAt: new Date("2025-03-25"),
  },
];

export const popularResumesData = [
  {
    rank: 1,
    name: "김수의",
    experience: "경력 5년",
    keywords: ["내과", "외과"],
  },
  {
    rank: 2,
    name: "최치료",
    experience: "경력 7년",
    keywords: ["관리직", "정규직"],
  },
  {
    rank: 3,
    name: "송수술",
    experience: "경력 6년",
    keywords: ["외과", "정형외과"],
  },
  {
    rank: 4,
    name: "장진단",
    experience: "경력 8년",
    keywords: ["진단의학", "영상의학"],
  },
  {
    rank: 5,
    name: "강연구",
    experience: "경력 10년",
    keywords: ["연구", "임상시험"],
  },
];

export const resumeData: ResumeData[] = [
  {
    id: "1",
    name: "김수희",
    profileImage: null,
    summary: "수의학 전공, 내과 전문의 취득 희망",
    contact: "010-0000-0000",
    email: "suhee@iamvet.com",
    currentWorkplace: "단국대 동물병원",
    totalExperience: "3년 4개월",
    availableStartDate: "2025.01.15",
    personalInfo: {
      name: "김수희",
      birthDate: "1990.05.15",
      contact: "010-0000-0000",
      email: "suhee@iamvet.com",
      jobField: "내과",
      major: "수의학과",
    },
    workPreferences: {
      workType: "정규직",
      salary: "연봉 5,000만원",
      workDays: "월-금",
      workHours: "09:00 - 18:00",
      workLocation: "서울 강남구, 서초구",
      availableDate: "2025.01.15",
    },
    careers: [
      {
        id: 1,
        duration: "2년 3개월",
        startDate: "2022.03",
        endDate: "2024.06",
        hospitalName: "단국대학교 동물병원",
        experience: "내과 진료 및 수술 보조, 응급처치 담당, 신규 수의사 교육 담당",
      },
      {
        id: 2,
        duration: "1년 1개월",
        startDate: "2021.02",
        endDate: "2022.02",
        hospitalName: "건국대학교 동물병원",
        experience: "외과 수술 보조, 마취 관리, 입원 환자 관리",
      },
    ],
    educations: [
      {
        id: 1,
        degree: "석사",
        graduationStatus: "졸업",
        startDate: "2019.03",
        endDate: "2021.02",
        schoolName: "서울대학교",
        major: "수의학과",
        gpa: 4.2,
        gpaScale: 4.5,
      },
      {
        id: 2,
        degree: "학사",
        graduationStatus: "졸업",
        startDate: "2015.03",
        endDate: "2019.02",
        schoolName: "서울대학교",
        major: "수의학과",
        gpa: 4.0,
        gpaScale: 4.5,
      },
    ],
    certificates: [
      {
        id: 1,
        issuer: "농림축산식품부",
        acquisitionDate: "2019.01.15",
        name: "수의사면허",
        grade: "-",
      },
      {
        id: 2,
        issuer: "대한수의내과학회",
        acquisitionDate: "2022.08.15",
        name: "내과 전문의",
        grade: "Level 2",
      },
    ],
    capabilities: [
      {
        id: 1,
        major: "내과",
        level: "상급",
        name: "내과 진료",
        experience: "3년",
      },
      {
        id: 2,
        major: "외과",
        level: "중급",
        name: "연부조직 수술",
        experience: "2년",
      },
    ],
    selfIntroduction: "안녕하세요. 수의학과를 졸업하고 3년 4개월의 임상 경험을 쌓은 김수희입니다. 특히 내과 진료에 특화되어 있으며, 현재 내과 전문의 과정을 이수 중입니다.",
    evaluations: {
      overallAverage: 4.2,
      totalEvaluations: 8,
      hospitals: [
        {
          id: 1,
          hospitalName: "단국대학교 동물병원",
          evaluationDate: "2024.06.15",
          overallRating: 4.5,
          ratings: {
            stressManagement: 4.2,
            growth: 4.6,
            care: 4.8,
            documentation: 4.3,
            contribution: 4.1,
          },
          detailedEvaluations: [
            {
              category: "업무 역량",
              rating: 4.5,
              comment: "진료 능력이 뛰어나며 응급상황 대처 능력이 우수함",
            },
            {
              category: "협업 능력",
              rating: 4.3,
              comment: "",
            },
            {
              category: "스트레스 관리",
              rating: 4.2,
              comment: "압박상황에서도 침착하게 대응함",
            },
          ],
        },
        {
          id: 2,
          hospitalName: "건국대학교 동물병원",
          evaluationDate: "2022.02.28",
          overallRating: 3.9,
          ratings: {
            stressManagement: 3.8,
            growth: 4.2,
            care: 4.1,
            documentation: 3.7,
            contribution: 3.7,
          },
          detailedEvaluations: [
            {
              category: "업무 역량",
              rating: 4.0,
              comment: "성실하고 꼼꼼한 업무 처리",
            },
            {
              category: "성장 잠재력",
              rating: 4.2,
              comment: "빠른 학습 능력과 개선 의지가 돋보임",
            },
          ],
        },
      ],
    },
  },
  {
    id: "2",
    name: "박민준",
    profileImage: null,
    summary: "외과 전문, 정형외과 수술 경험 풍부",
    contact: "010-1111-2222",
    email: "minjun.park@iamvet.com",
    currentWorkplace: "서울대 동물병원",
    totalExperience: "5년 2개월",
    availableStartDate: "2025.02.01",
    personalInfo: {
      name: "박민준",
      birthDate: "1988.08.22",
      contact: "010-1111-2222",
      email: "minjun.park@iamvet.com",
      jobField: "외과",
      major: "수의학과",
    },
    workPreferences: {
      workType: "정규직",
      salary: "연봉 6,500만원",
      workDays: "월-토",
      workHours: "08:00 - 19:00",
      workLocation: "서울 전지역",
      availableDate: "2025.02.01",
    },
    careers: [
      {
        id: 1,
        duration: "3년 2개월",
        startDate: "2021.08",
        endDate: "2024.10",
        hospitalName: "서울대학교 동물병원",
        experience: "정형외과 수술 전담, 복잡 골절 수술, 관절 수술 전문",
      },
      {
        id: 2,
        duration: "2년",
        startDate: "2019.08",
        endDate: "2021.07",
        hospitalName: "연세대 동물병원",
        experience: "일반 외과 수술, 연부조직 수술, 응급 수술",
      },
    ],
    educations: [
      {
        id: 1,
        degree: "학사",
        graduationStatus: "졸업",
        startDate: "2013.03",
        endDate: "2019.02",
        schoolName: "서울대학교",
        major: "수의학과",
        gpa: 3.8,
        gpaScale: 4.5,
      },
    ],
    certificates: [
      {
        id: 1,
        issuer: "농림축산식품부",
        acquisitionDate: "2019.01.15",
        name: "수의사면허",
        grade: "-",
      },
      {
        id: 2,
        issuer: "대한수의외과학회",
        acquisitionDate: "2023.06.20",
        name: "외과 전문의",
        grade: "Level 3",
      },
    ],
    capabilities: [
      {
        id: 1,
        major: "외과",
        level: "전문가",
        name: "정형외과 수술",
        experience: "5년",
      },
      {
        id: 2,
        major: "진단",
        level: "상급",
        name: "영상 진단",
        experience: "4년",
      },
    ],
    selfIntroduction: "외과 전문의로서 5년 이상의 풍부한 수술 경험을 보유하고 있습니다. 특히 정형외과 분야에서 복잡한 골절 수술과 관절 수술을 전문으로 하고 있습니다.",
    evaluations: {
      overallAverage: 4.6,
      totalEvaluations: 12,
      hospitals: [
        {
          id: 1,
          hospitalName: "서울대학교 동물병원",
          evaluationDate: "2024.10.20",
          overallRating: 4.7,
          ratings: {
            stressManagement: 4.5,
            growth: 4.8,
            care: 4.9,
            documentation: 4.6,
            contribution: 4.7,
          },
          detailedEvaluations: [
            {
              category: "수술 기술",
              rating: 4.9,
              comment: "정형외과 수술 기술이 매우 뛰어나며 합병증 발생률이 낮음",
            },
            {
              category: "환자 관리",
              rating: 4.6,
              comment: "수술 후 관리와 보호자 상담 능력이 우수함",
            },
          ],
        },
      ],
    },
  },
  {
    id: "3",
    name: "이지연",
    profileImage: null,
    summary: "피부과 전문, 알러지 치료 전문가",
    contact: "010-3333-4444",
    email: "jiyeon.lee@iamvet.com",
    currentWorkplace: "이대 동물병원",
    totalExperience: "4년 8개월",
    availableStartDate: "2025.03.01",
    personalInfo: {
      name: "이지연",
      birthDate: "1991.12.05",
      contact: "010-3333-4444",
      email: "jiyeon.lee@iamvet.com",
      jobField: "피부과",
      major: "수의학과",
    },
    workPreferences: {
      workType: "정규직",
      salary: "연봉 5,200만원",
      workDays: "월-금",
      workHours: "09:00 - 18:00",
      workLocation: "서울 강남구, 서초구, 송파구",
      availableDate: "2025.03.01",
    },
    careers: [
      {
        id: 1,
        duration: "2년 8개월",
        startDate: "2022.02",
        endDate: "2024.10",
        hospitalName: "이화여자대학교 동물병원",
        experience: "피부과 진료 전담, 알러지 검사 및 치료, 피부 조직검사",
      },
      {
        id: 2,
        duration: "2년",
        startDate: "2020.02",
        endDate: "2022.01",
        hospitalName: "고려대 동물병원",
        experience: "일반 진료, 피부과 진료 보조, 내분비 질환 치료",
      },
    ],
    educations: [
      {
        id: 1,
        degree: "석사",
        graduationStatus: "졸업",
        startDate: "2018.03",
        endDate: "2020.02",
        schoolName: "이화여자대학교",
        major: "수의학과",
        gpa: 4.1,
        gpaScale: 4.5,
      },
      {
        id: 2,
        degree: "학사",
        graduationStatus: "졸업",
        startDate: "2014.03",
        endDate: "2018.02",
        schoolName: "이화여자대학교",
        major: "수의학과",
        gpa: 3.9,
        gpaScale: 4.5,
      },
    ],
    certificates: [
      {
        id: 1,
        issuer: "농림축산식품부",
        acquisitionDate: "2018.03.10",
        name: "수의사면허",
        grade: "-",
      },
      {
        id: 2,
        issuer: "대한수의피부과학회",
        acquisitionDate: "2023.03.15",
        name: "피부과 전문의",
        grade: "Level 2",
      },
    ],
    capabilities: [
      {
        id: 1,
        major: "피부과",
        level: "전문가",
        name: "알러지 진단 및 치료",
        experience: "4년",
      },
      {
        id: 2,
        major: "면역학",
        level: "상급",
        name: "면역치료",
        experience: "3년",
      },
    ],
    selfIntroduction: "피부과 전문의로서 알러지 질환과 면역 관련 피부 질환 치료에 특화되어 있습니다. 다양한 검사법을 활용한 정확한 진단과 체계적인 치료 계획 수립에 자신 있습니다.",
    evaluations: {
      overallAverage: 4.3,
      totalEvaluations: 10,
      hospitals: [
        {
          id: 1,
          hospitalName: "이화여자대학교 동물병원",
          evaluationDate: "2024.10.15",
          overallRating: 4.4,
          ratings: {
            stressManagement: 4.1,
            growth: 4.5,
            care: 4.6,
            documentation: 4.4,
            contribution: 4.2,
          },
          detailedEvaluations: [
            {
              category: "전문성",
              rating: 4.6,
              comment: "피부과 전문 지식이 뛰어나고 진단 능력이 우수함",
            },
            {
              category: "소통 능력",
              rating: 4.3,
              comment: "보호자와의 소통이 원활하고 치료 계획 설명이 명확함",
            },
          ],
        },
      ],
    },
  },
  {
    id: "4",
    name: "최치료",
    profileImage: null,
    summary: "다양한 진료 분야 경험, 관리직 경험 보유",
    contact: "010-4444-5555",
    email: "chiryo.choi@iamvet.com",
    currentWorkplace: "서울 중앙 동물병원",
    totalExperience: "7년",
    availableStartDate: "2025.04.01",
    personalInfo: {
      name: "최치료",
      birthDate: "1985.07.10",
      contact: "010-4444-5555",
      email: "chiryo.choi@iamvet.com",
      jobField: "종합진료",
      major: "수의학과",
    },
    workPreferences: {
      workType: "정규직",
      salary: "연봉 7,000만원",
      workDays: "월-토",
      workHours: "08:30 - 19:00",
      workLocation: "서울 강남구, 서초구",
      availableDate: "2025.04.01",
    },
    careers: [
      {
        id: 1,
        duration: "4년",
        startDate: "2020.01",
        endDate: "2024.01",
        hospitalName: "서울 중앙 동물병원",
        experience: "원장 대행, 전체 진료과 관리, 신규 직원 교육 및 관리",
      },
      {
        id: 2,
        duration: "3년",
        startDate: "2017.01",
        endDate: "2019.12",
        hospitalName: "강남 동물의료센터",
        experience: "내과, 외과 종합 진료, 응급 진료 담당",
      },
    ],
    educations: [
      {
        id: 1,
        degree: "학사",
        graduationStatus: "졸업",
        startDate: "2011.03",
        endDate: "2017.02",
        schoolName: "건국대학교",
        major: "수의학과",
        gpa: 3.7,
        gpaScale: 4.5,
      },
    ],
    certificates: [
      {
        id: 1,
        issuer: "농림축산식품부",
        acquisitionDate: "2017.01.15",
        name: "수의사면허",
        grade: "-",
      },
      {
        id: 2,
        issuer: "대한수의사회",
        acquisitionDate: "2021.05.20",
        name: "병원관리사",
        grade: "Level 1",
      },
    ],
    capabilities: [
      {
        id: 1,
        major: "종합진료",
        level: "전문가",
        name: "종합 진료 관리",
        experience: "7년",
      },
      {
        id: 2,
        major: "관리",
        level: "상급",
        name: "병원 운영 관리",
        experience: "4년",
      },
    ],
    selfIntroduction: "7년간의 풍부한 임상 경험과 4년간의 관리 경험을 보유하고 있습니다. 내과, 외과를 포함한 종합적인 진료 능력과 더불어 병원 운영 및 직원 관리 경험을 통해 조직 전체의 발전에 기여할 수 있습니다.",
    evaluations: {
      overallAverage: 4.4,
      totalEvaluations: 15,
      hospitals: [
        {
          id: 1,
          hospitalName: "서울 중앙 동물병원",
          evaluationDate: "2024.01.30",
          overallRating: 4.6,
          ratings: {
            stressManagement: 4.5,
            growth: 4.7,
            care: 4.6,
            documentation: 4.8,
            contribution: 4.4,
          },
          detailedEvaluations: [
            {
              category: "관리 능력",
              rating: 4.8,
              comment: "병원 전체 운영을 체계적으로 관리하며 직원들의 신뢰를 받음",
            },
            {
              category: "진료 역량",
              rating: 4.5,
              comment: "다양한 진료 분야에서 안정적인 진료 결과를 보여줌",
            },
          ],
        },
      ],
    },
  },
];

export const getResumeById = (id: string): ResumeData | undefined => {
  const detailedResume = resumeData.find(resume => resume.id === id);
  
  if (detailedResume) {
    return detailedResume;
  }
  
  // allResumeData에서 찾아서 기본 구조로 변환
  const listItem = allResumeData.find(resume => resume.id === id);
  if (!listItem) {
    return undefined;
  }
  
  // 기본 상세 데이터 구조로 변환
  return {
    id: listItem.id,
    name: listItem.name,
    profileImage: null,
    summary: listItem.keywords.join(", ") + " 전문",
    contact: "010-0000-0000",
    email: `${listItem.name.toLowerCase()}@iamvet.com`,
    currentWorkplace: "미정",
    totalExperience: listItem.experience,
    availableStartDate: "협의",
    personalInfo: {
      name: listItem.name,
      birthDate: "미정",
      contact: "010-0000-0000",
      email: `${listItem.name.toLowerCase()}@iamvet.com`,
      jobField: listItem.keywords[0] || "미정",
      major: "수의학과",
    },
    workPreferences: {
      workType: listItem.keywords.includes("정규직") ? "정규직" : listItem.keywords.includes("계약직") ? "계약직" : "파트타임",
      salary: "협의",
      workDays: "협의",
      workHours: "협의",
      workLocation: listItem.preferredLocation,
      availableDate: "협의",
    },
    careers: [
      {
        id: 1,
        duration: listItem.experience,
        startDate: "미정",
        endDate: "현재",
        hospitalName: "이전 근무지",
        experience: "관련 업무 경험",
      },
    ],
    educations: [
      {
        id: 1,
        degree: "학사",
        graduationStatus: "졸업",
        startDate: "미정",
        endDate: "미정",
        schoolName: "미정",
        major: "수의학과",
        gpa: 0,
        gpaScale: 4.5,
      },
    ],
    certificates: [
      {
        id: 1,
        issuer: "농림축산식품부",
        acquisitionDate: "미정",
        name: listItem.keywords.includes("수의사") ? "수의사면허" : "관련 자격증",
        grade: "-",
      },
    ],
    capabilities: [
      {
        id: 1,
        major: listItem.keywords[0] || "일반",
        level: "중급",
        name: `${listItem.keywords[0] || "일반"} 업무`,
        experience: listItem.experience,
      },
    ],
    selfIntroduction: `안녕하세요. ${listItem.name}입니다. ${listItem.keywords.join(", ")} 분야에서 활동하고 있습니다.`,
    evaluations: {
      overallAverage: 0,
      totalEvaluations: 0,
      hospitals: [],
    },
  };
};

export const getAllResumes = (): ResumeData[] => {
  return resumeData;
};
