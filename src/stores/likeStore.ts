import { create } from 'zustand';

interface LikeState {
  likedResumes: Set<string>;
  likedJobs: Set<string>;
  likedLectures: Set<string>;
  likedTransfers: Set<string>;
  
  // 최근 변경사항 추적 (클라이언트에서 변경된 항목들)
  recentChanges: {
    lectures: Map<string, { isLiked: boolean; timestamp: number }>;
    transfers: Map<string, { isLiked: boolean; timestamp: number }>;
    jobs: Map<string, { isLiked: boolean; timestamp: number }>;
    resumes: Map<string, { isLiked: boolean; timestamp: number }>;
  };
  
  // Resume 좋아요 액션
  setResumeLike: (resumeId: string, isLiked: boolean) => void;
  toggleResumeLike: (resumeId: string) => boolean; // 반환값: 새로운 상태
  initializeResumeLikes: (resumeIds: string[]) => void;
  syncResumeLikes: (resumeIds: string[]) => void; // 스마트 동기화
  
  // Job 좋아요 액션  
  setJobLike: (jobId: string, isLiked: boolean) => void;
  toggleJobLike: (jobId: string) => boolean; // 반환값: 새로운 상태
  initializeJobLikes: (jobIds: string[]) => void;
  syncJobLikes: (jobIds: string[]) => void; // 스마트 동기화
  
  // Lecture 좋아요 액션
  setLectureLike: (lectureId: string, isLiked: boolean) => void;
  toggleLectureLike: (lectureId: string) => boolean; // 반환값: 새로운 상태
  initializeLectureLikes: (lectureIds: string[]) => void;
  syncLectureLikes: (lectureIds: string[]) => void; // 스마트 동기화
  
  // Transfer 좋아요 액션
  setTransferLike: (transferId: string, isLiked: boolean) => void;
  toggleTransferLike: (transferId: string) => boolean; // 반환값: 새로운 상태
  initializeTransferLikes: (transferIds: string[]) => void;
  syncTransferLikes: (transferIds: string[]) => void; // 스마트 동기화
  
  // 유틸리티
  isResumeLiked: (resumeId: string) => boolean;
  isJobLiked: (jobId: string) => boolean;
  isLectureLiked: (lectureId: string) => boolean;
  isTransferLiked: (transferId: string) => boolean;
}

export const useLikeStore = create<LikeState>((set, get) => ({
  likedResumes: new Set<string>(),
  likedJobs: new Set<string>(),
  likedLectures: new Set<string>(),
  likedTransfers: new Set<string>(),
  
  // 최근 변경사항 추적 초기화
  recentChanges: {
    lectures: new Map(),
    transfers: new Map(),
    jobs: new Map(),
    resumes: new Map(),
  },
  
  // Resume 좋아요 관리
  setResumeLike: (resumeId: string, isLiked: boolean) => {
    set((state) => {
      const newLikedResumes = new Set(state.likedResumes);
      if (isLiked) {
        newLikedResumes.add(resumeId);
      } else {
        newLikedResumes.delete(resumeId);
      }
      console.log(`[LikeStore] Resume ${resumeId} 좋아요 상태: ${isLiked}`);
      return { likedResumes: newLikedResumes };
    });
  },
  
  toggleResumeLike: (resumeId: string) => {
    const currentState = get().likedResumes.has(resumeId);
    const newState = !currentState;
    get().setResumeLike(resumeId, newState);
    console.log(`[LikeStore] Resume ${resumeId} 토글: ${currentState} -> ${newState}`);
    return newState;
  },
  
  initializeResumeLikes: (resumeIds: string[]) => {
    set(() => {
      const newLikedResumes = new Set(resumeIds);
      console.log(`[LikeStore] Resume 좋아요 초기화:`, Array.from(newLikedResumes));
      return { likedResumes: newLikedResumes };
    });
  },
  
  syncResumeLikes: (resumeIds: string[]) => {
    set((state) => {
      const newLikedResumes = new Set(resumeIds);
      console.log(`[LikeStore] Resume 동기화:`, Array.from(newLikedResumes));
      return { likedResumes: newLikedResumes };
    });
  },
  
  // Job 좋아요 관리
  setJobLike: (jobId: string, isLiked: boolean) => {
    set((state) => {
      const newLikedJobs = new Set(state.likedJobs);
      if (isLiked) {
        newLikedJobs.add(jobId);
      } else {
        newLikedJobs.delete(jobId);
      }
      console.log(`[LikeStore] Job ${jobId} 좋아요 상태: ${isLiked}`);
      return { likedJobs: newLikedJobs };
    });
  },
  
  toggleJobLike: (jobId: string) => {
    const currentState = get().likedJobs.has(jobId);
    const newState = !currentState;
    get().setJobLike(jobId, newState);
    console.log(`[LikeStore] Job ${jobId} 토글: ${currentState} -> ${newState}`);
    return newState;
  },
  
  initializeJobLikes: (jobIds: string[]) => {
    set(() => {
      const newLikedJobs = new Set(jobIds);
      console.log(`[LikeStore] Job 좋아요 초기화:`, Array.from(newLikedJobs));
      return { likedJobs: newLikedJobs };
    });
  },
  
  syncJobLikes: (jobIds: string[]) => {
    set((state) => {
      const newLikedJobs = new Set(jobIds);
      console.log(`[LikeStore] Job 동기화:`, Array.from(newLikedJobs));
      return { likedJobs: newLikedJobs };
    });
  },
  
  // Lecture 좋아요 관리
  setLectureLike: (lectureId: string, isLiked: boolean) => {
    set((state) => {
      const newLikedLectures = new Set(state.likedLectures);
      const newRecentChanges = new Map(state.recentChanges.lectures);
      
      if (isLiked) {
        newLikedLectures.add(lectureId);
      } else {
        newLikedLectures.delete(lectureId);
      }
      
      // 최근 변경사항에 기록 (5분간 유지)
      newRecentChanges.set(lectureId, {
        isLiked,
        timestamp: Date.now()
      });
      
      console.log(`[LikeStore] Lecture ${lectureId} 좋아요 상태: ${isLiked} (최근변경 기록)`);
      return { 
        likedLectures: newLikedLectures,
        recentChanges: {
          ...state.recentChanges,
          lectures: newRecentChanges
        }
      };
    });
  },
  
  toggleLectureLike: (lectureId: string) => {
    const currentState = get().likedLectures.has(lectureId);
    const newState = !currentState;
    get().setLectureLike(lectureId, newState);
    console.log(`[LikeStore] Lecture ${lectureId} 토글: ${currentState} -> ${newState}`);
    return newState;
  },
  
  initializeLectureLikes: (lectureIds: string[]) => {
    set(() => {
      const newLikedLectures = new Set(lectureIds);
      console.log(`[LikeStore] Lecture 좋아요 초기화:`, Array.from(newLikedLectures));
      return { likedLectures: newLikedLectures };
    });
  },
  
  // 스마트 동기화: 최근 변경사항을 고려하여 서버 데이터와 병합
  syncLectureLikes: (lectureIds: string[]) => {
    set((state) => {
      const serverLikedLectures = new Set(lectureIds);
      const newLikedLectures = new Set(serverLikedLectures);
      const recentChanges = state.recentChanges.lectures;
      const currentTime = Date.now();
      const RECENT_CHANGE_THRESHOLD = 5 * 60 * 1000; // 5분
      
      // 최근 변경사항 중 5분 이내의 것들만 적용
      const validRecentChanges = new Map();
      recentChanges.forEach((change, lectureId) => {
        if (currentTime - change.timestamp < RECENT_CHANGE_THRESHOLD) {
          validRecentChanges.set(lectureId, change);
          // 최근 변경사항이 있으면 서버 데이터보다 우선
          if (change.isLiked) {
            newLikedLectures.add(lectureId);
          } else {
            newLikedLectures.delete(lectureId);
          }
          console.log(`[LikeStore] Lecture ${lectureId} 최근 변경사항 적용: ${change.isLiked}`);
        }
      });
      
      console.log(`[LikeStore] Lecture 스마트 동기화 완료:`, {
        서버데이터: Array.from(serverLikedLectures),
        최근변경: Array.from(validRecentChanges.keys()),
        최종결과: Array.from(newLikedLectures)
      });
      
      return { 
        likedLectures: newLikedLectures,
        recentChanges: {
          ...state.recentChanges,
          lectures: validRecentChanges
        }
      };
    });
  },
  
  // Transfer 좋아요 관리
  setTransferLike: (transferId: string, isLiked: boolean) => {
    set((state) => {
      const newLikedTransfers = new Set(state.likedTransfers);
      if (isLiked) {
        newLikedTransfers.add(transferId);
      } else {
        newLikedTransfers.delete(transferId);
      }
      console.log(`[LikeStore] Transfer ${transferId} 좋아요 상태: ${isLiked}`);
      return { likedTransfers: newLikedTransfers };
    });
  },
  
  toggleTransferLike: (transferId: string) => {
    const currentState = get().likedTransfers.has(transferId);
    const newState = !currentState;
    get().setTransferLike(transferId, newState);
    console.log(`[LikeStore] Transfer ${transferId} 토글: ${currentState} -> ${newState}`);
    return newState;
  },
  
  initializeTransferLikes: (transferIds: string[]) => {
    set(() => {
      const newLikedTransfers = new Set(transferIds);
      console.log(`[LikeStore] Transfer 좋아요 초기화:`, Array.from(newLikedTransfers));
      return { likedTransfers: newLikedTransfers };
    });
  },
  
  syncTransferLikes: (transferIds: string[]) => {
    set(() => {
      const newLikedTransfers = new Set(transferIds);
      console.log(`[LikeStor] Transfer 동기화:`, Array.from(newLikedTransfers));
      return { likedTransfers: newLikedTransfers };
    });
  },

  // 유틸리티 함수
  isResumeLiked: (resumeId: string) => {
    return get().likedResumes.has(resumeId);
  },
  
  isJobLiked: (jobId: string) => {
    return get().likedJobs.has(jobId);
  },
  
  isLectureLiked: (lectureId: string) => {
    return get().likedLectures.has(lectureId);
  },

  isTransferLiked: (transferId: string) => {
    return get().likedTransfers.has(transferId);
  },
}));