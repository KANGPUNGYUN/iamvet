// 경험 카테고리 매핑 및 계층적 필터링 유틸리티

export interface ExperienceMapping {
  [key: string]: string[];
}

// 경험 카테고리를 계층적으로 매핑
// 필터 선택 시 포함할 수 있는 경험 범위들
export const EXPERIENCE_HIERARCHY: ExperienceMapping = {
  신입: ["신입", "경력무관", "신입/경력무관"],
  "1-3년": [
    "1-3년",
    "1년",
    "2년",
    "3년",
    "1-2년",
    "2-3년",
    "경력무관",
    "신입/경력무관",
  ],
  "3-5년": [
    "3-5년",
    "3년",
    "4년",
    "5년",
    "3-5년",
    "3-4년",
    "4-5년",
    "경력무관",
  ],
  "5년 이상": [
    "5년 이상",
    "5년",
    "6년",
    "7년",
    "8년",
    "9년",
    "10년",
    "5-10년",
    "5-10년",
    "10년 이상",
    "경력무관",
  ],
};

// 추가 매핑 (다양한 형식 지원)
export const EXPERIENCE_ALIASES: { [key: string]: string } = {
  "1년 이상": "1-3년",
  "3년 이상": "3-5년",
  "5년 이상": "5년이상",
  경력무관: "신입",
};

// 레거시 매핑 (기존 코드와의 호환성을 위해)
export const LEGACY_EXPERIENCE_MAPPING: { [key: string]: string[] } = {
  new: ["신입"],
  junior: ["1년 이상"],
  mid: ["3년 이상"],
  senior: ["5년 이상"],
};

/**
 * 선택된 경험 카테고리들을 계층적으로 확장
 * @param selectedExperiences 사용자가 선택한 경험 카테고리들
 * @returns 확장된 경험 카테고리 배열
 */
export function expandExperienceCategories(
  selectedExperiences: string[]
): string[] {
  const expandedCategories = new Set<string>();

  selectedExperiences.forEach((experience) => {
    // Alias 매핑 처리 (다양한 형식 지원)
    const normalizedExperience = EXPERIENCE_ALIASES[experience] || experience;

    // 레거시 매핑 처리
    if (LEGACY_EXPERIENCE_MAPPING[normalizedExperience]) {
      const mappedExperience =
        LEGACY_EXPERIENCE_MAPPING[normalizedExperience][0];
      const hierarchicalCategories = EXPERIENCE_HIERARCHY[mappedExperience] || [
        mappedExperience,
      ];
      hierarchicalCategories.forEach((cat) => expandedCategories.add(cat));
    } else {
      // 직접 매핑
      const hierarchicalCategories = EXPERIENCE_HIERARCHY[
        normalizedExperience
      ] || [normalizedExperience];
      hierarchicalCategories.forEach((cat) => expandedCategories.add(cat));
    }
  });

  return Array.from(expandedCategories);
}

/**
 * 구직자의 경험과 구인 조건이 매칭되는지 확인
 * @param jobExperience 구인공고의 경험 요구사항
 * @param candidateExperience 구직자의 경험
 * @returns 매칭 여부
 */
export function isExperienceMatching(
  jobExperience: string[],
  candidateExperience: string
): boolean {
  // 구직자 경험을 기준으로 해당하는 모든 구인 조건 확인
  const expandedCandidateExperience = expandExperienceCategories([
    candidateExperience,
  ]);

  // 구인공고의 요구사항 중 하나라도 구직자의 확장된 경험과 일치하면 매칭
  return jobExperience.some((reqExp) =>
    expandedCandidateExperience.includes(reqExp)
  );
}

/**
 * 필터링을 위한 SQL WHERE 조건 생성
 * @param selectedExperiences 선택된 경험 카테고리들
 * @returns SQL에서 사용할 수 있는 경험 카테고리 배열
 */
export function getExperienceFilterConditions(
  selectedExperiences: string[]
): string[] {
  if (!selectedExperiences || selectedExperiences.length === 0) {
    return [];
  }

  return expandExperienceCategories(selectedExperiences);
}
