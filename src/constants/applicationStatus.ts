// 지원 상태 enum
export enum ApplicationStatus {
  APPLYING = "APPLYING", // 지원 중
  DOCUMENT_REVIEW = "DOCUMENT_REVIEW", // 서류 검토
  DOCUMENT_PASS = "DOCUMENT_PASS", // 서류 합격
  INTERVIEW_PASS = "INTERVIEW_PASS", // 면접 합격
  FINAL_PASS = "FINAL_PASS", // 최종 합격
  REJECTED = "REJECTED", // 불합격
}

// 지원 상태 한글 라벨
export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.APPLYING]: "지원 중",
  [ApplicationStatus.DOCUMENT_REVIEW]: "서류 검토",
  [ApplicationStatus.DOCUMENT_PASS]: "서류 합격",
  [ApplicationStatus.INTERVIEW_PASS]: "면접 합격",
  [ApplicationStatus.FINAL_PASS]: "최종 합격",
  [ApplicationStatus.REJECTED]: "불합격",
};

// 지원 상태별 색상 (Tag variant)
export const APPLICATION_STATUS_COLORS: Record<ApplicationStatus, 1 | 2 | 3 | 4 | 5 | 6> = {
  [ApplicationStatus.APPLYING]: 4, // 회색
  [ApplicationStatus.DOCUMENT_REVIEW]: 2, // 파란색
  [ApplicationStatus.DOCUMENT_PASS]: 5, // 연한 초록
  [ApplicationStatus.INTERVIEW_PASS]: 1, // 진한 초록
  [ApplicationStatus.FINAL_PASS]: 1, // 진한 초록
  [ApplicationStatus.REJECTED]: 3, // 빨간색
};

// SelectBox 옵션 형식
export const APPLICATION_STATUS_OPTIONS = Object.entries(APPLICATION_STATUS_LABELS).map(
  ([value, label]) => ({ value, label })
);

// 지원 상태 변경 가능 여부 확인
export const canChangeStatus = (currentStatus: ApplicationStatus, newStatus: ApplicationStatus): boolean => {
  // 최종 합격이나 불합격 상태에서는 다른 상태로 변경 불가
  if (currentStatus === ApplicationStatus.FINAL_PASS || currentStatus === ApplicationStatus.REJECTED) {
    return newStatus === currentStatus;
  }
  
  // 그 외의 경우는 모든 상태로 변경 가능
  return true;
};

// 다음 단계로 진행 가능한 상태 확인
export const getNextPossibleStatuses = (currentStatus: ApplicationStatus): ApplicationStatus[] => {
  switch (currentStatus) {
    case ApplicationStatus.APPLYING:
      return [ApplicationStatus.DOCUMENT_REVIEW, ApplicationStatus.REJECTED];
    case ApplicationStatus.DOCUMENT_REVIEW:
      return [ApplicationStatus.DOCUMENT_PASS, ApplicationStatus.REJECTED];
    case ApplicationStatus.DOCUMENT_PASS:
      return [ApplicationStatus.INTERVIEW_PASS, ApplicationStatus.REJECTED];
    case ApplicationStatus.INTERVIEW_PASS:
      return [ApplicationStatus.FINAL_PASS, ApplicationStatus.REJECTED];
    case ApplicationStatus.FINAL_PASS:
    case ApplicationStatus.REJECTED:
      return []; // 최종 상태에서는 변경 불가
    default:
      return [];
  }
};

// 데이터베이스 호환성을 위한 임시 매핑 (마이그레이션 전까지 사용)
export const mapToLegacyStatus = (status: ApplicationStatus): string => {
  switch (status) {
    case ApplicationStatus.APPLYING:
      return 'PENDING';
    case ApplicationStatus.DOCUMENT_REVIEW:
      return 'REVIEWING';
    case ApplicationStatus.DOCUMENT_PASS:
    case ApplicationStatus.INTERVIEW_PASS:
    case ApplicationStatus.FINAL_PASS:
      return 'ACCEPTED';
    case ApplicationStatus.REJECTED:
      return 'REJECTED';
    default:
      return 'PENDING';
  }
};

// 레거시 상태에서 새 상태로 변환
export const mapFromLegacyStatus = (legacyStatus: string): ApplicationStatus => {
  switch (legacyStatus) {
    case 'PENDING':
      return ApplicationStatus.APPLYING;
    case 'REVIEWING':
      return ApplicationStatus.DOCUMENT_REVIEW;
    case 'ACCEPTED':
      return ApplicationStatus.FINAL_PASS;
    case 'REJECTED':
      return ApplicationStatus.REJECTED;
    default:
      return ApplicationStatus.APPLYING;
  }
};