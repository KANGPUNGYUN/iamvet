import { create } from 'zustand';

interface BookmarkState {
  bookmarkedJobs: Set<string>;
  bookmarkedResumes: Set<string>;
  bookmarkedLectures: Set<string>;
  bookmarkedTransfers: Set<string>;
  bookmarkedForums: Set<string>;
  
  // 최근 변경사항 추적 (클라이언트에서 변경된 항목들)
  recentChanges: {
    jobs: Map<string, { isBookmarked: boolean; timestamp: number }>;
    resumes: Map<string, { isBookmarked: boolean; timestamp: number }>;
    lectures: Map<string, { isBookmarked: boolean; timestamp: number }>;
    transfers: Map<string, { isBookmarked: boolean; timestamp: number }>;
    forums: Map<string, { isBookmarked: boolean; timestamp: number }>;
  };
  
  // Job 북마크 액션
  setJobBookmark: (jobId: string, isBookmarked: boolean) => void;
  toggleJobBookmark: (jobId: string) => boolean;
  initializeJobBookmarks: (jobIds: string[]) => void;
  syncJobBookmarks: (jobIds: string[]) => void;
  
  // Resume 북마크 액션
  setResumeBookmark: (resumeId: string, isBookmarked: boolean) => void;
  toggleResumeBookmark: (resumeId: string) => boolean;
  initializeResumeBookmarks: (resumeIds: string[]) => void;
  syncResumeBookmarks: (resumeIds: string[]) => void;
  
  // Lecture 북마크 액션
  setLectureBookmark: (lectureId: string, isBookmarked: boolean) => void;
  toggleLectureBookmark: (lectureId: string) => boolean;
  initializeLectureBookmarks: (lectureIds: string[]) => void;
  syncLectureBookmarks: (lectureIds: string[]) => void;
  
  // Transfer 북마크 액션
  setTransferBookmark: (transferId: string, isBookmarked: boolean) => void;
  toggleTransferBookmark: (transferId: string) => boolean;
  initializeTransferBookmarks: (transferIds: string[]) => void;
  syncTransferBookmarks: (transferIds: string[]) => void;
  
  // Forum 북마크 액션
  setForumBookmark: (forumId: string, isBookmarked: boolean) => void;
  toggleForumBookmark: (forumId: string) => boolean;
  initializeForumBookmarks: (forumIds: string[]) => void;
  syncForumBookmarks: (forumIds: string[]) => void;
  
  // 유틸리티
  isJobBookmarked: (jobId: string) => boolean;
  isResumeBookmarked: (resumeId: string) => boolean;
  isLectureBookmarked: (lectureId: string) => boolean;
  isTransferBookmarked: (transferId: string) => boolean;
  isForumBookmarked: (forumId: string) => boolean;
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  bookmarkedJobs: new Set<string>(),
  bookmarkedResumes: new Set<string>(),
  bookmarkedLectures: new Set<string>(),
  bookmarkedTransfers: new Set<string>(),
  bookmarkedForums: new Set<string>(),
  
  // 최근 변경사항 추적 초기화
  recentChanges: {
    jobs: new Map(),
    resumes: new Map(),
    lectures: new Map(),
    transfers: new Map(),
    forums: new Map(),
  },
  
  // Job 북마크 관리
  setJobBookmark: (jobId: string, isBookmarked: boolean) => {
    set((state) => {
      const newBookmarkedJobs = new Set(state.bookmarkedJobs);
      const newRecentChanges = new Map(state.recentChanges.jobs);
      
      if (isBookmarked) {
        newBookmarkedJobs.add(jobId);
      } else {
        newBookmarkedJobs.delete(jobId);
      }
      
      // 최근 변경사항에 기록 (5분간 유지)
      newRecentChanges.set(jobId, {
        isBookmarked,
        timestamp: Date.now()
      });
      
      console.log(`[BookmarkStore] Job ${jobId} 북마크 상태: ${isBookmarked}`);
      return { 
        bookmarkedJobs: newBookmarkedJobs,
        recentChanges: {
          ...state.recentChanges,
          jobs: newRecentChanges
        }
      };
    });
  },
  
  toggleJobBookmark: (jobId: string) => {
    const currentState = get().bookmarkedJobs.has(jobId);
    const newState = !currentState;
    get().setJobBookmark(jobId, newState);
    console.log(`[BookmarkStore] Job ${jobId} 토글: ${currentState} -> ${newState}`);
    return newState;
  },
  
  initializeJobBookmarks: (jobIds: string[]) => {
    set(() => {
      const newBookmarkedJobs = new Set(jobIds);
      console.log(`[BookmarkStore] Job 북마크 초기화:`, Array.from(newBookmarkedJobs));
      return { bookmarkedJobs: newBookmarkedJobs };
    });
  },
  
  syncJobBookmarks: (jobIds: string[]) => {
    set((state) => {
      const serverBookmarkedJobs = new Set(jobIds);
      const newBookmarkedJobs = new Set(serverBookmarkedJobs);
      const recentChanges = state.recentChanges.jobs;
      const currentTime = Date.now();
      const RECENT_CHANGE_THRESHOLD = 5 * 60 * 1000; // 5분
      
      // 최근 변경사항 중 5분 이내의 것들만 적용
      const validRecentChanges = new Map();
      recentChanges.forEach((change, jobId) => {
        if (currentTime - change.timestamp < RECENT_CHANGE_THRESHOLD) {
          validRecentChanges.set(jobId, change);
          // 최근 변경사항이 있으면 서버 데이터보다 우선
          if (change.isBookmarked) {
            newBookmarkedJobs.add(jobId);
          } else {
            newBookmarkedJobs.delete(jobId);
          }
          console.log(`[BookmarkStore] Job ${jobId} 최근 변경사항 적용: ${change.isBookmarked}`);
        }
      });
      
      console.log(`[BookmarkStore] Job 스마트 동기화 완료:`, {
        서버데이터: Array.from(serverBookmarkedJobs),
        최근변경: Array.from(validRecentChanges.keys()),
        최종결과: Array.from(newBookmarkedJobs)
      });
      
      return { 
        bookmarkedJobs: newBookmarkedJobs,
        recentChanges: {
          ...state.recentChanges,
          jobs: validRecentChanges
        }
      };
    });
  },
  
  // Resume 북마크 관리
  setResumeBookmark: (resumeId: string, isBookmarked: boolean) => {
    set((state) => {
      const newBookmarkedResumes = new Set(state.bookmarkedResumes);
      if (isBookmarked) {
        newBookmarkedResumes.add(resumeId);
      } else {
        newBookmarkedResumes.delete(resumeId);
      }
      console.log(`[BookmarkStore] Resume ${resumeId} 북마크 상태: ${isBookmarked}`);
      return { bookmarkedResumes: newBookmarkedResumes };
    });
  },
  
  toggleResumeBookmark: (resumeId: string) => {
    const currentState = get().bookmarkedResumes.has(resumeId);
    const newState = !currentState;
    get().setResumeBookmark(resumeId, newState);
    console.log(`[BookmarkStore] Resume ${resumeId} 토글: ${currentState} -> ${newState}`);
    return newState;
  },
  
  initializeResumeBookmarks: (resumeIds: string[]) => {
    set(() => {
      const newBookmarkedResumes = new Set(resumeIds);
      console.log(`[BookmarkStore] Resume 북마크 초기화:`, Array.from(newBookmarkedResumes));
      return { bookmarkedResumes: newBookmarkedResumes };
    });
  },
  
  syncResumeBookmarks: (resumeIds: string[]) => {
    set(() => {
      const newBookmarkedResumes = new Set(resumeIds);
      console.log(`[BookmarkStore] Resume 동기화:`, Array.from(newBookmarkedResumes));
      return { bookmarkedResumes: newBookmarkedResumes };
    });
  },
  
  // Lecture 북마크 관리
  setLectureBookmark: (lectureId: string, isBookmarked: boolean) => {
    set((state) => {
      const newBookmarkedLectures = new Set(state.bookmarkedLectures);
      const newRecentChanges = new Map(state.recentChanges.lectures);
      
      if (isBookmarked) {
        newBookmarkedLectures.add(lectureId);
      } else {
        newBookmarkedLectures.delete(lectureId);
      }
      
      // 최근 변경사항에 기록 (5분간 유지)
      newRecentChanges.set(lectureId, {
        isBookmarked,
        timestamp: Date.now()
      });
      
      console.log(`[BookmarkStore] Lecture ${lectureId} 북마크 상태: ${isBookmarked}`);
      return { 
        bookmarkedLectures: newBookmarkedLectures,
        recentChanges: {
          ...state.recentChanges,
          lectures: newRecentChanges
        }
      };
    });
  },
  
  toggleLectureBookmark: (lectureId: string) => {
    const currentState = get().bookmarkedLectures.has(lectureId);
    const newState = !currentState;
    get().setLectureBookmark(lectureId, newState);
    console.log(`[BookmarkStore] Lecture ${lectureId} 토글: ${currentState} -> ${newState}`);
    return newState;
  },
  
  initializeLectureBookmarks: (lectureIds: string[]) => {
    set(() => {
      const newBookmarkedLectures = new Set(lectureIds);
      console.log(`[BookmarkStore] Lecture 북마크 초기화:`, Array.from(newBookmarkedLectures));
      return { bookmarkedLectures: newBookmarkedLectures };
    });
  },
  
  syncLectureBookmarks: (lectureIds: string[]) => {
    set((state) => {
      const serverBookmarkedLectures = new Set(lectureIds);
      const newBookmarkedLectures = new Set(serverBookmarkedLectures);
      const recentChanges = state.recentChanges.lectures;
      const currentTime = Date.now();
      const RECENT_CHANGE_THRESHOLD = 5 * 60 * 1000; // 5분
      
      // 최근 변경사항 중 5분 이내의 것들만 적용
      const validRecentChanges = new Map();
      recentChanges.forEach((change, lectureId) => {
        if (currentTime - change.timestamp < RECENT_CHANGE_THRESHOLD) {
          validRecentChanges.set(lectureId, change);
          // 최근 변경사항이 있으면 서버 데이터보다 우선
          if (change.isBookmarked) {
            newBookmarkedLectures.add(lectureId);
          } else {
            newBookmarkedLectures.delete(lectureId);
          }
          console.log(`[BookmarkStore] Lecture ${lectureId} 최근 변경사항 적용: ${change.isBookmarked}`);
        }
      });
      
      console.log(`[BookmarkStore] Lecture 스마트 동기화 완료:`, {
        서버데이터: Array.from(serverBookmarkedLectures),
        최근변경: Array.from(validRecentChanges.keys()),
        최종결과: Array.from(newBookmarkedLectures)
      });
      
      return { 
        bookmarkedLectures: newBookmarkedLectures,
        recentChanges: {
          ...state.recentChanges,
          lectures: validRecentChanges
        }
      };
    });
  },
  
  // Transfer 북마크 관리
  setTransferBookmark: (transferId: string, isBookmarked: boolean) => {
    set((state) => {
      const newBookmarkedTransfers = new Set(state.bookmarkedTransfers);
      if (isBookmarked) {
        newBookmarkedTransfers.add(transferId);
      } else {
        newBookmarkedTransfers.delete(transferId);
      }
      console.log(`[BookmarkStore] Transfer ${transferId} 북마크 상태: ${isBookmarked}`);
      return { bookmarkedTransfers: newBookmarkedTransfers };
    });
  },
  
  toggleTransferBookmark: (transferId: string) => {
    const currentState = get().bookmarkedTransfers.has(transferId);
    const newState = !currentState;
    get().setTransferBookmark(transferId, newState);
    console.log(`[BookmarkStore] Transfer ${transferId} 토글: ${currentState} -> ${newState}`);
    return newState;
  },
  
  initializeTransferBookmarks: (transferIds: string[]) => {
    set(() => {
      const newBookmarkedTransfers = new Set(transferIds);
      console.log(`[BookmarkStore] Transfer 북마크 초기화:`, Array.from(newBookmarkedTransfers));
      return { bookmarkedTransfers: newBookmarkedTransfers };
    });
  },
  
  syncTransferBookmarks: (transferIds: string[]) => {
    set(() => {
      const newBookmarkedTransfers = new Set(transferIds);
      console.log(`[BookmarkStore] Transfer 동기화:`, Array.from(newBookmarkedTransfers));
      return { bookmarkedTransfers: newBookmarkedTransfers };
    });
  },
  
  // Forum 북마크 관리
  setForumBookmark: (forumId: string, isBookmarked: boolean) => {
    set((state) => {
      const newBookmarkedForums = new Set(state.bookmarkedForums);
      const newRecentChanges = new Map(state.recentChanges.forums);
      
      if (isBookmarked) {
        newBookmarkedForums.add(forumId);
      } else {
        newBookmarkedForums.delete(forumId);
      }
      
      // 최근 변경사항에 기록 (5분간 유지)
      newRecentChanges.set(forumId, {
        isBookmarked,
        timestamp: Date.now()
      });
      
      console.log(`[BookmarkStore] Forum ${forumId} 북마크 상태: ${isBookmarked}`);
      return { 
        bookmarkedForums: newBookmarkedForums,
        recentChanges: {
          ...state.recentChanges,
          forums: newRecentChanges
        }
      };
    });
  },
  
  toggleForumBookmark: (forumId: string) => {
    const currentState = get().bookmarkedForums.has(forumId);
    const newState = !currentState;
    get().setForumBookmark(forumId, newState);
    console.log(`[BookmarkStore] Forum ${forumId} 토글: ${currentState} -> ${newState}`);
    return newState;
  },
  
  initializeForumBookmarks: (forumIds: string[]) => {
    set(() => {
      const newBookmarkedForums = new Set(forumIds);
      console.log(`[BookmarkStore] Forum 북마크 초기화:`, Array.from(newBookmarkedForums));
      return { bookmarkedForums: newBookmarkedForums };
    });
  },
  
  syncForumBookmarks: (forumIds: string[]) => {
    set((state) => {
      const serverBookmarkedForums = new Set(forumIds);
      const newBookmarkedForums = new Set(serverBookmarkedForums);
      const recentChanges = state.recentChanges.forums;
      const currentTime = Date.now();
      const RECENT_CHANGE_THRESHOLD = 5 * 60 * 1000; // 5분
      
      // 최근 변경사항 중 5분 이내의 것들만 적용
      const validRecentChanges = new Map();
      recentChanges.forEach((change, forumId) => {
        if (currentTime - change.timestamp < RECENT_CHANGE_THRESHOLD) {
          validRecentChanges.set(forumId, change);
          // 최근 변경사항이 있으면 서버 데이터보다 우선
          if (change.isBookmarked) {
            newBookmarkedForums.add(forumId);
          } else {
            newBookmarkedForums.delete(forumId);
          }
          console.log(`[BookmarkStore] Forum ${forumId} 최근 변경사항 적용: ${change.isBookmarked}`);
        }
      });
      
      console.log(`[BookmarkStore] Forum 스마트 동기화 완료:`, {
        서버데이터: Array.from(serverBookmarkedForums),
        최근변경: Array.from(validRecentChanges.keys()),
        최종결과: Array.from(newBookmarkedForums)
      });
      
      return { 
        bookmarkedForums: newBookmarkedForums,
        recentChanges: {
          ...state.recentChanges,
          forums: validRecentChanges
        }
      };
    });
  },

  // 유틸리티 함수
  isJobBookmarked: (jobId: string) => {
    return get().bookmarkedJobs.has(jobId);
  },
  
  isResumeBookmarked: (resumeId: string) => {
    return get().bookmarkedResumes.has(resumeId);
  },
  
  isLectureBookmarked: (lectureId: string) => {
    return get().bookmarkedLectures.has(lectureId);
  },

  isTransferBookmarked: (transferId: string) => {
    return get().bookmarkedTransfers.has(transferId);
  },
  
  isForumBookmarked: (forumId: string) => {
    return get().bookmarkedForums.has(forumId);
  },
}));