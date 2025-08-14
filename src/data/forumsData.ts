export interface Comment {
  id: string;
  author: string;
  authorProfile: string;
  content: string;
  date: string;
  replies: Comment[];
}

export interface ForumData {
  id: string;
  title: string;
  content: string;
  author: string;
  authorProfile: string;
  createdAt: Date;
  viewCount: number;
  commentCount: number;
  tags: string[];
  isBookmarked?: boolean;
  comments: Comment[];
}

export const allForumsData: ForumData[] = [
  {
    id: "1",
    title: "만성 신부전 고양이 식이요법 관련 최신 연구",
    content: `
      <div>
        <p>안녕하세요.</p>
        <p>최근 만성 신부전(CKD)을 앓는 고양이의 식이 관리에 대한 최신 연구 결과가 발표되어 관련 내용을 공유하고자 합니다.</p>
        
        <img src="/assets/images/transfer/transfer1.jpg" alt="고양이 신부전 연구 이미지" style="width: 100%; max-width: 500px; margin: 20px 0; border-radius: 8px;" />
        
        <h3>주요 연구 결과:</h3>
        <p>1. 인의 제한: 기존 대비 30% 감소된 인 함량의 식이가 효과적</p>
        <p>2. 단백질 조절: 후기 단계에서는 고품질 단백질로 제한 필요</p>
        <p>3. 오메가-3 지방산: 신장 보호 효과 확인</p>
        
        <h3>임상에서의 적용 경험:</h3>
        <p>직접 임상에서 적용해본 결과 다음과 같은 개선 사항을 관찰할 수 있었습니다:</p>
        <ul>
          <li>혈중 크레아티닌 수치 안정화</li>
          <li>식욕 개선 및 체중 증가</li>
          <li>구토 빈도 감소</li>
        </ul>
        
        <p>경험을 공유해주세요. 같은 경험을 하신 분들의 의견이나 추가 정보가 있으시면 댓글로 남겨주시면 감사하겠습니다.</p>
      </div>
    `,
    author: "홍길동수의사",
    authorProfile: "",
    createdAt: new Date("2025-04-14"),
    viewCount: 234,
    commentCount: 12,
    tags: ["내과", "고양이"],
    isBookmarked: false,
    comments: [
      {
        id: "1",
        author: "홍길동수의사",
        authorProfile: "",
        content: "좋은 정보 감사합니다. 저희 병원에서도 적용해보겠습니다.",
        date: "2025-04-14",
        replies: [
          {
            id: "1-1",
            author: "김수의사",
            authorProfile: "",
            content: "네, 도움이 되었다면 좋겠습니다. 추가 질문 있으시면 언제든 댓글 남겨주세요!",
            date: "2025-04-14",
            replies: [],
          },
        ],
      },
      {
        id: "2",
        author: "이동물병원",
        authorProfile: "",
        content: "오메가-3 지방산 효과에 대해 더 자세히 알고 싶습니다.",
        date: "2025-04-15",
        replies: [],
      },
    ],
  },
  {
    id: "2",
    title: "강아지 피부염 치료 사례 공유",
    content: `
      <div>
        <p>3세 리트리버 아토피 피부염 치료 사례를 공유합니다.</p>
        <p>기존 스테로이드 치료에서 벗어나 새로운 접근법을 시도한 결과입니다.</p>
        
        <img src="/assets/images/transfer/transfer2.jpg" alt="강아지 피부염 치료 전후 사진" style="width: 100%; max-width: 500px; margin: 20px 0; border-radius: 8px;" />
        
        <h3>치료 과정:</h3>
        <p>1. 알레르기 유발 요소 제거</p>
        <p>2. 약욕 및 보습 관리</p>
        <p>3. 면역 조절제 사용</p>
        
        <img src="/assets/images/transfer/transfer3.jpg" alt="치료 과정 중 피부 상태" style="width: 100%; max-width: 400px; margin: 20px 0; border-radius: 8px;" />
        
        <p>4주간의 치료 후 현저한 개선을 보였습니다. 비슷한 경험이 있으신 분들의 의견을 듣고 싶습니다.</p>
      </div>
    `,
    author: "박수의사",
    authorProfile: "",
    createdAt: new Date("2025-04-13"),
    viewCount: 189,
    commentCount: 8,
    tags: ["피부과", "강아지"],
    isBookmarked: true,
    comments: [],
  },
  {
    id: "3",
    title: "응급 수술 시 마취 관리 포인트",
    content: `
      <div>
        <p>응급 상황에서의 마취 관리에 대해 논의하고 싶습니다.</p>
        <p>특히 쇼크 상태 환자의 마취 유도에 대한 경험을 공유해주세요.</p>
        
        <img src="/assets/images/transfer/transfer4.jpg" alt="응급 수술실 모습" style="width: 100%; max-width: 500px; margin: 20px 0; border-radius: 8px;" />
        
        <h3>주요 고려사항:</h3>
        <ul>
          <li>환자 상태 평가 및 안정화</li>
          <li>마취제 선택 및 용량 조절</li>
          <li>수액 및 혈압 관리</li>
          <li>체온 유지</li>
        </ul>
        
        <img src="/assets/images/transfer/transfer5.jpg" alt="마취 모니터링 장비" style="width: 100%; max-width: 400px; margin: 20px 0; border-radius: 8px;" />
        
        <p>최근 쇼크 상태의 고양이 응급 수술을 진행하면서 얻은 경험을 바탕으로 논의해보고자 합니다.</p>
      </div>
    `,
    author: "정응급의",
    authorProfile: "",
    createdAt: new Date("2025-04-12"),
    viewCount: 156,
    commentCount: 15,
    tags: ["외과", "응급"],
    isBookmarked: false,
    comments: [],
  },
  {
    id: "4",
    title: "고양이 아토피성 피부염 치료 경험 공유",
    content: `
      <div>
        <p>3년째 아토피로 고생하는 페르시안 고양이 치료 경험을 공유합니다.</p>
        
        <img src="/assets/images/transfer/transfer6.jpg" alt="아토피 치료 과정" style="width: 100%; max-width: 500px; margin: 20px 0; border-radius: 8px;" />
        
        <h3>치료 과정:</h3>
        <ul>
          <li>알레르기 검사를 통한 원인 파악</li>
          <li>식이 요법 병행</li>
          <li>스테로이드 사용 최소화</li>
        </ul>
        
        <p>현재 많이 호전되어 일상생활에 지장이 없는 상태입니다.</p>
      </div>
    `,
    author: "김피부과수의사",
    authorProfile: "",
    createdAt: new Date("2025-04-11"),
    viewCount: 312,
    commentCount: 18,
    tags: ["피부과", "고양이"],
    isBookmarked: false,
    comments: [],
  },
  {
    id: "5",
    title: "강아지 파보바이러스 예방접종 프로토콜",
    content: `
      <div>
        <p>강아지 파보바이러스 예방을 위한 최신 백신 프로토콜을 소개합니다.</p>
        
        <img src="/assets/images/transfer/transfer7.jpg" alt="백신 접종 모습" style="width: 100%; max-width: 500px; margin: 20px 0; border-radius: 8px;" />
        
        <h3>접종 스케줄:</h3>
        <p>6-8주: 1차 접종</p>
        <p>10-12주: 2차 접종</p>
        <p>14-16주: 3차 접종</p>
        
        <p>부스터 접종과 관련된 최신 연구 결과도 함께 논의하고 싶습니다.</p>
      </div>
    `,
    author: "이예방의학과",
    authorProfile: "",
    createdAt: new Date("2025-04-10"),
    viewCount: 278,
    commentCount: 9,
    tags: ["예방의학", "강아지"],
    isBookmarked: true,
    comments: [],
  },
  {
    id: "6",
    title: "페럿 인슐린종 진단과 치료 사례",
    content: `
      <div>
        <p>5세 페럿의 인슐린종 진단부터 수술까지의 전 과정을 공유합니다.</p>
        
        <img src="/assets/images/transfer/transfer8.jpg" alt="페럿 수술 모습" style="width: 100%; max-width: 500px; margin: 20px 0; border-radius: 8px;" />
        
        <h3>진단 과정:</h3>
        <ul>
          <li>임상 증상 관찰 (저혈당 발작)</li>
          <li>혈당 측정 및 인슐린 수치 확인</li>
          <li>초음파 검사로 종양 위치 확인</li>
        </ul>
        
        <p>수술 후 예후가 양호하여 정상적인 생활을 하고 있습니다.</p>
      </div>
    `,
    author: "특수동물전문의",
    authorProfile: "",
    createdAt: new Date("2025-04-09"),
    viewCount: 145,
    commentCount: 5,
    tags: ["내과", "특수동물"],
    isBookmarked: false,
    comments: [],
  },
];

export const getForumById = (id: string): ForumData | undefined => {
  return allForumsData.find(forum => forum.id === id);
};