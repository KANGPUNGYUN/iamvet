import transfer1 from "@/assets/images/transfer/transfer1.jpg";
import transfer2 from "@/assets/images/transfer/transfer2.jpg";
import transfer3 from "@/assets/images/transfer/transfer3.jpg";
import transfer4 from "@/assets/images/transfer/transfer4.jpg";
import transfer5 from "@/assets/images/transfer/transfer5.jpg";
import transfer6 from "@/assets/images/transfer/transfer6.jpg";
import transfer7 from "@/assets/images/transfer/transfer7.jpg";
import transfer8 from "@/assets/images/transfer/transfer8.jpg";

export interface HospitalEvaluation {
  id: number;
  evaluatorName: string;
  evaluationDate: string;
  overallRating: number;
  ratings: {
    facilities: number;
    staff: number;
    service: number;
    cleanliness: number;
    accessibility: number;
  };
  detailedEvaluations: Array<{
    category: string;
    comment: string;
  }>;
}

export interface JobPosting {
  id: string;
  title: string;
  location: string;
  type: string;
  experience: string;
  deadline: string;
  isBookmarked: boolean;
}

export interface HospitalDetailData {
  id: string;
  name: string;
  summary: string;
  contact: string;
  email: string;
  website: string;
  establishedYear: string;
  address: string;
  staffCount: string;
  businessType: string;
  specialties: string[];
  facilityImages: any[];
  introduction: string;
  jobPostings: JobPosting[];
  evaluations: {
    overallAverage: number;
    hospitals: HospitalEvaluation[];
  };
}

// Mock hospital data
const hospitalsData: Record<string, HospitalDetailData> = {
  "1": {
    id: "1",
    name: "서울의료원",
    summary: "서울 수의학과 최초의 의료 서비스를 제공하는 서울의료원입니다. 최첨단 진료 장비와 모든 동물을 위한 전문 의료진이 대기하고 있습니다.",
    contact: "02-2276-7000",
    email: "hospital@naver.com",
    website: "www.pethospital.com",
    establishedYear: "2004.03.04",
    address: "서울 강남구 강남대로 2길 116, 2층",
    staffCount: "미정",
    businessType: "고양이, 개 치료",
    specialties: ["진료실", "간호", "수술"],
    facilityImages: [transfer1, transfer2, transfer3, transfer4, transfer5],
    introduction: "저희 충남대학교 수의과대학 부속동물병원은 우수동물병원으로 선정, 충남대학교 수의과대학 교수진이 인정한 최신 의료진으로 국내 최고 수준을 목표로 하고 있습니다.\n\n가축 품질 식사건 검진이 있고 유능한 의사들이 진합한 진료를 기대가지 인체에 진료경험을 토대로 제공되는 애완동물들은 충남대학교 수의과대학 부속동물병원에서 지료되고 성장하여 건강한 상태를 획득하고 있습니다.\n\n최신식 의료 지역 사업을 C호 교육원, 단체유학생들이 펼쳐드, 진료설정과, 고령견, 한국을원, 진단에 본격적인 체계 진료와 일반 활동의 충남 수의사를 위한 체계 진료는 늘 지료치료를 한 내에 찾는 서비스입니다.",
    jobPostings: [
      {
        id: "1",
        title: "서울동물메디컬센터",
        location: "서울 강남구",
        type: "계약직",
        experience: "경력 3년 이상",
        deadline: "~4/7(금)",
        isBookmarked: false,
      },
      {
        id: "2",
        title: "건국대학교 동물병원",
        location: "서울 광진구",
        type: "정규직",
        experience: "경력 2년 이상",
        deadline: "~4/15(월)",
        isBookmarked: true,
      },
      {
        id: "3",
        title: "이화여대 동물병원",
        location: "서울 서대문구",
        type: "계약직",
        experience: "신입",
        deadline: "~4/20(토)",
        isBookmarked: false,
      },
      {
        id: "4",
        title: "고려대학교 동물병원",
        location: "서울 성북구",
        type: "정규직",
        experience: "경력 5년 이상",
        deadline: "~4/25(목)",
        isBookmarked: false,
      },
      {
        id: "5",
        title: "연세대학교 동물병원",
        location: "서울 서대문구",
        type: "인턴십",
        experience: "신입",
        deadline: "~4/30(화)",
        isBookmarked: true,
      },
    ],
    evaluations: {
      overallAverage: 4.2,
      hospitals: [
        {
          id: 1,
          evaluatorName: "김수의사",
          evaluationDate: "2024.12.15",
          overallRating: 4.4,
          ratings: {
            facilities: 4.5,
            staff: 4.3,
            service: 4.4,
            cleanliness: 4.6,
            accessibility: 4.0,
          },
          detailedEvaluations: [
            {
              category: "시설 및 장비",
              comment: "최신 장비들이 잘 갖춰져 있고, 시설이 깔끔하게 관리되고 있습니다. 특히 수술실 환경이 인상적이었습니다.",
            },
            {
              category: "직원 전문성",
              comment: "수의사 선생님들의 전문성이 뛰어나며, 간호사분들도 경험이 풍부해 보입니다.",
            },
            {
              category: "서비스 품질",
              comment: "전반적으로 서비스가 만족스럽고, 응급상황 대응도 신속했습니다.",
            },
          ],
        },
        {
          id: 2,
          evaluatorName: "박동물의학과",
          evaluationDate: "2024.11.28",
          overallRating: 4.0,
          ratings: {
            facilities: 4.0,
            staff: 4.2,
            service: 3.8,
            cleanliness: 4.1,
            accessibility: 3.9,
          },
          detailedEvaluations: [
            {
              category: "시설 및 장비",
              comment: "시설은 양호하나 일부 장비의 업데이트가 필요해 보입니다.",
            },
            {
              category: "직원 전문성",
              comment: "직원들의 전문성은 우수하지만, 바쁜 시간대에는 대기시간이 다소 길어집니다.",
            },
            {
              category: "서비스 품질",
              comment: "기본적인 서비스는 만족스럽지만, 고객 응대에서 개선의 여지가 있습니다.",
            },
          ],
        },
      ],
    },
  },
  "2": {
    id: "2",
    name: "건국대학교 동물병원",
    summary: "건국대학교 수의과대학 부속동물병원으로 교육과 진료를 병행하는 종합동물병원입니다. 최신 의료진과 시설로 반려동물의 건강을 책임집니다.",
    contact: "02-450-3700",
    email: "vet@konkuk.ac.kr",
    website: "www.konkuk-vet.ac.kr",
    establishedYear: "1980.03.15",
    address: "서울 광진구 능동로 120 건국대학교 수의과대학",
    staffCount: "45명",
    businessType: "개, 고양이, 소동물",
    specialties: ["내과", "외과", "안과", "피부과", "치과"],
    facilityImages: [transfer6, transfer7, transfer8, transfer1, transfer2],
    introduction: "건국대학교 수의과대학 부속동물병원은 1980년 개원 이래 40여 년간 반려동물 의료 서비스의 선두주자로서 역할을 해왔습니다.\n\n대학 부속병원의 장점을 살려 최신 의료 기술과 연구 성과를 진료에 직접 적용하며, 수의학 교육과 연구를 통해 미래의 수의사를 양성하고 있습니다.\n\n24시간 응급진료 시스템과 전문 분과별 진료를 통해 반려동물에게 최고 수준의 의료 서비스를 제공합니다.",
    jobPostings: [
      {
        id: "6",
        title: "건국대학교 동물병원 인턴",
        location: "서울 광진구",
        type: "인턴십",
        experience: "신입",
        deadline: "~5/10(금)",
        isBookmarked: false,
      },
      {
        id: "7",
        title: "수의사 정규직 채용",
        location: "서울 광진구",
        type: "정규직",
        experience: "경력 1년 이상",
        deadline: "~5/20(월)",
        isBookmarked: true,
      },
    ],
    evaluations: {
      overallAverage: 4.5,
      hospitals: [
        {
          id: 3,
          evaluatorName: "이수의학박사",
          evaluationDate: "2024.12.20",
          overallRating: 4.7,
          ratings: {
            facilities: 4.8,
            staff: 4.6,
            service: 4.7,
            cleanliness: 4.9,
            accessibility: 4.3,
          },
          detailedEvaluations: [
            {
              category: "시설 및 장비",
              comment: "대학병원답게 최첨단 장비와 넓은 시설을 보유하고 있습니다. 특히 MRI, CT 등 고급 진단장비가 인상적입니다.",
            },
            {
              category: "직원 전문성",
              comment: "교수진과 전공의들의 전문성이 매우 뛰어나며, 어려운 케이스도 잘 해결해주십니다.",
            },
            {
              category: "서비스 품질",
              comment: "교육병원이라 학생들도 많지만, 그만큼 더 세심하게 진료해주시는 느낌입니다.",
            },
          ],
        },
      ],
    },
  },
  "3": {
    id: "3",
    name: "24시간 응급동물병원",
    summary: "24시간 응급진료 전문 동물병원입니다. 야간 응급상황과 중환자 관리에 특화된 의료진과 시설을 갖추고 있습니다.",
    contact: "02-1588-7119",
    email: "emergency@24vet.co.kr",
    website: "www.24vet.co.kr",
    establishedYear: "2015.08.01",
    address: "서울 서초구 강남대로 123 24시간 응급동물병원",
    staffCount: "30명",
    businessType: "응급진료, 중환자관리",
    specialties: ["응급의학", "중환자의학", "외과", "마취과"],
    facilityImages: [transfer3, transfer4, transfer5, transfer6, transfer7],
    introduction: "24시간 응급동물병원은 반려동물의 응급상황에 신속하고 전문적으로 대응하는 것을 목표로 설립되었습니다.\n\n야간과 휴일에도 응급진료가 가능하며, 중환자실과 수술실을 24시간 운영하고 있습니다. 응급의학과 중환자의학 전문의가 상주하여 위급한 상황의 반려동물들에게 최적의 치료를 제공합니다.\n\n일반 병원에서 치료가 어려운 복잡한 응급상황과 중증 환자 관리에 특화되어 있으며, 다른 병원과의 협력 네트워크를 통해 연속적인 치료를 지원합니다.",
    jobPostings: [
      {
        id: "8",
        title: "응급진료 수의사",
        location: "서울 서초구",
        type: "정규직",
        experience: "경력 3년 이상",
        deadline: "~6/1(토)",
        isBookmarked: false,
      },
      {
        id: "9",
        title: "중환자실 간호사",
        location: "서울 서초구",
        type: "정규직",
        experience: "경력 2년 이상",
        deadline: "~6/15(토)",
        isBookmarked: true,
      },
      {
        id: "10",
        title: "야간 진료 수의사",
        location: "서울 서초구",
        type: "계약직",
        experience: "경력 1년 이상",
        deadline: "~6/30(일)",
        isBookmarked: false,
      },
    ],
    evaluations: {
      overallAverage: 4.1,
      hospitals: [
        {
          id: 4,
          evaluatorName: "응급의학과전문의",
          evaluationDate: "2024.12.10",
          overallRating: 4.3,
          ratings: {
            facilities: 4.4,
            staff: 4.5,
            service: 4.1,
            cleanliness: 4.0,
            accessibility: 4.2,
          },
          detailedEvaluations: [
            {
              category: "시설 및 장비",
              comment: "응급의료에 특화된 장비들이 잘 구비되어 있고, 중환자실 시설이 체계적으로 운영되고 있습니다.",
            },
            {
              category: "직원 전문성",
              comment: "응급상황 대응 능력이 뛰어나고, 신속한 의사결정과 처치가 인상적입니다.",
            },
            {
              category: "서비스 품질",
              comment: "응급상황의 특성상 대기시간이 있을 수 있지만, 생명을 다루는 곳답게 최선을 다하고 있습니다.",
            },
          ],
        },
      ],
    },
  },
};

export const getHospitalById = (id: string): HospitalDetailData | null => {
  return hospitalsData[id] || null;
};

export const getAllHospitals = (): HospitalDetailData[] => {
  return Object.values(hospitalsData);
};

export const getHospitalsByIds = (ids: string[]): HospitalDetailData[] => {
  return ids.map(id => hospitalsData[id]).filter(Boolean);
};