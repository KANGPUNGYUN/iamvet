// 지원 상태 enum - 데이터베이스와 호환되는 값 사용
export enum ApplicationStatus {
  PENDING = "PENDING", // 지원 중
  REVIEWING = "REVIEWING", // 서류 검토
  DOCUMENT_PASS = "DOCUMENT_PASS", // 서류 합격 (ACCEPTED의 세부 상태)
  INTERVIEW_PASS = "INTERVIEW_PASS", // 면접 합격 (ACCEPTED의 세부 상태)
  ACCEPTED = "ACCEPTED", // 최종 합격
  REJECTED = "REJECTED", // 불합격
}

// 지원 상태 한글 라벨
export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PENDING]: "지원 중",
  [ApplicationStatus.REVIEWING]: "서류 검토",
  [ApplicationStatus.DOCUMENT_PASS]: "서류 합격",
  [ApplicationStatus.INTERVIEW_PASS]: "면접 합격",
  [ApplicationStatus.ACCEPTED]: "최종 합격",
  [ApplicationStatus.REJECTED]: "불합격",
};

// 지원 상태별 색상 (Tag variant)
export const APPLICATION_STATUS_COLORS: Record<ApplicationStatus, 1 | 2 | 3 | 4 | 5 | 6> = {
  [ApplicationStatus.PENDING]: 4, // 회색
  [ApplicationStatus.REVIEWING]: 2, // 파란색
  [ApplicationStatus.DOCUMENT_PASS]: 5, // 연한 초록
  [ApplicationStatus.INTERVIEW_PASS]: 1, // 진한 초록
  [ApplicationStatus.ACCEPTED]: 1, // 진한 초록
  [ApplicationStatus.REJECTED]: 3, // 빨간색
};

// SelectBox 옵션 형식
export const APPLICATION_STATUS_OPTIONS = Object.entries(APPLICATION_STATUS_LABELS).map(
  ([value, label]) => ({ value, label })
);

// 지원 상태 변경 가능 여부 확인
export const canChangeStatus = (currentStatus: ApplicationStatus, newStatus: ApplicationStatus): boolean => {
  // 최종 합격이나 불합격 상태에서는 다른 상태로 변경 불가
  if (currentStatus === ApplicationStatus.ACCEPTED || currentStatus === ApplicationStatus.REJECTED) {
    return newStatus === currentStatus;
  }
  
  // 그 외의 경우는 모든 상태로 변경 가능
  return true;
};

// 다음 단계로 진행 가능한 상태 확인
export const getNextPossibleStatuses = (currentStatus: ApplicationStatus): ApplicationStatus[] => {
  switch (currentStatus) {
    case ApplicationStatus.PENDING:
      return [ApplicationStatus.REVIEWING, ApplicationStatus.REJECTED];
    case ApplicationStatus.REVIEWING:
      return [ApplicationStatus.DOCUMENT_PASS, ApplicationStatus.REJECTED];
    case ApplicationStatus.DOCUMENT_PASS:
      return [ApplicationStatus.INTERVIEW_PASS, ApplicationStatus.REJECTED];
    case ApplicationStatus.INTERVIEW_PASS:
      return [ApplicationStatus.ACCEPTED, ApplicationStatus.REJECTED];
    case ApplicationStatus.ACCEPTED:
    case ApplicationStatus.REJECTED:
      return []; // 최종 상태에서는 변경 불가
    default:
      return [];
  }
};

// 데이터베이스 호환성을 위한 매핑 (마이그레이션 후에는 불필요)
export const mapToLegacyStatus = (status: ApplicationStatus): string => {
  // 마이그레이션 후에는 그대로 반환
  return status;
};

// 레거시 상태에서 새 상태로 변환
export const mapFromLegacyStatus = (legacyStatus: string): ApplicationStatus => {
  // 이미 새로운 상태값이면 그대로 반환
  if (Object.values(ApplicationStatus).includes(legacyStatus as ApplicationStatus)) {
    return legacyStatus as ApplicationStatus;
  }
  
  // 레거시 매핑
  switch (legacyStatus) {
    case 'PENDING':
      return ApplicationStatus.PENDING;
    case 'REVIEWING':
      return ApplicationStatus.REVIEWING;
    case 'ACCEPTED':
      return ApplicationStatus.ACCEPTED; // 기본적으로 최종 합격으로
    case 'REJECTED':
      return ApplicationStatus.REJECTED;
    default:
      return ApplicationStatus.PENDING;
  }
};