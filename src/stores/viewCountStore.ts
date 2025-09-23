import { create } from 'zustand';

interface ViewCountState {
  // 각 컨텐츠 타입별 조회수 저장
  resumeViewCounts: Map<string, number>;
  jobViewCounts: Map<string, number>;
  lectureViewCounts: Map<string, number>;
  transferViewCounts: Map<string, number>;
  forumViewCounts: Map<string, number>;
  
  // 조회수 증가 처리된 컨텐츠 추적 (중복 증가 방지)
  viewedContent: Set<string>;
  
  // Resume 조회수 액션
  setResumeViewCount: (resumeId: string, viewCount: number) => void;
  incrementResumeViewCount: (resumeId: string) => number;
  getResumeViewCount: (resumeId: string) => number;
  
  // Job 조회수 액션
  setJobViewCount: (jobId: string, viewCount: number) => void;
  incrementJobViewCount: (jobId: string) => number;
  getJobViewCount: (jobId: string) => number;
  
  // Lecture 조회수 액션
  setLectureViewCount: (lectureId: string, viewCount: number) => void;
  incrementLectureViewCount: (lectureId: string) => number;
  getLectureViewCount: (lectureId: string) => number;
  
  // Transfer 조회수 액션
  setTransferViewCount: (transferId: string, viewCount: number) => void;
  incrementTransferViewCount: (transferId: string) => number;
  getTransferViewCount: (transferId: string) => number;
  
  // Forum 조회수 액션
  setForumViewCount: (forumId: string, viewCount: number) => void;
  incrementForumViewCount: (forumId: string) => number;
  getForumViewCount: (forumId: string) => number;
  
  // 조회 처리 체크
  markAsViewed: (contentType: string, contentId: string) => void;
  isAlreadyViewed: (contentType: string, contentId: string) => boolean;
}

export const useViewCountStore = create<ViewCountState>((set, get) => ({
  resumeViewCounts: new Map<string, number>(),
  jobViewCounts: new Map<string, number>(),
  lectureViewCounts: new Map<string, number>(),
  transferViewCounts: new Map<string, number>(),
  forumViewCounts: new Map<string, number>(),
  viewedContent: new Set<string>(),
  
  // Resume 조회수 관리
  setResumeViewCount: (resumeId: string, viewCount: number) => {
    set((state) => {
      const newViewCounts = new Map(state.resumeViewCounts);
      newViewCounts.set(resumeId, viewCount);
      return { resumeViewCounts: newViewCounts };
    });
  },
  
  incrementResumeViewCount: (resumeId: string) => {
    const currentCount = get().getResumeViewCount(resumeId);
    const newCount = currentCount + 1;
    get().setResumeViewCount(resumeId, newCount);
    return newCount;
  },
  
  getResumeViewCount: (resumeId: string) => {
    return get().resumeViewCounts.get(resumeId) || 0;
  },
  
  // Job 조회수 관리
  setJobViewCount: (jobId: string, viewCount: number) => {
    set((state) => {
      const newViewCounts = new Map(state.jobViewCounts);
      newViewCounts.set(jobId, viewCount);
      return { jobViewCounts: newViewCounts };
    });
  },
  
  incrementJobViewCount: (jobId: string) => {
    const currentCount = get().getJobViewCount(jobId);
    const newCount = currentCount + 1;
    get().setJobViewCount(jobId, newCount);
    return newCount;
  },
  
  getJobViewCount: (jobId: string) => {
    return get().jobViewCounts.get(jobId) || 0;
  },
  
  // Lecture 조회수 관리
  setLectureViewCount: (lectureId: string, viewCount: number) => {
    set((state) => {
      const newViewCounts = new Map(state.lectureViewCounts);
      newViewCounts.set(lectureId, viewCount);
      return { lectureViewCounts: newViewCounts };
    });
  },
  
  incrementLectureViewCount: (lectureId: string) => {
    const currentCount = get().getLectureViewCount(lectureId);
    const newCount = currentCount + 1;
    get().setLectureViewCount(lectureId, newCount);
    return newCount;
  },
  
  getLectureViewCount: (lectureId: string) => {
    return get().lectureViewCounts.get(lectureId) || 0;
  },
  
  // Transfer 조회수 관리
  setTransferViewCount: (transferId: string, viewCount: number) => {
    set((state) => {
      const newViewCounts = new Map(state.transferViewCounts);
      newViewCounts.set(transferId, viewCount);
      return { transferViewCounts: newViewCounts };
    });
  },
  
  incrementTransferViewCount: (transferId: string) => {
    const currentCount = get().getTransferViewCount(transferId);
    const newCount = currentCount + 1;
    get().setTransferViewCount(transferId, newCount);
    return newCount;
  },
  
  getTransferViewCount: (transferId: string) => {
    return get().transferViewCounts.get(transferId) || 0;
  },
  
  // Forum 조회수 관리
  setForumViewCount: (forumId: string, viewCount: number) => {
    set((state) => {
      const newViewCounts = new Map(state.forumViewCounts);
      newViewCounts.set(forumId, viewCount);
      return { forumViewCounts: newViewCounts };
    });
  },
  
  incrementForumViewCount: (forumId: string) => {
    const currentCount = get().getForumViewCount(forumId);
    const newCount = currentCount + 1;
    get().setForumViewCount(forumId, newCount);
    return newCount;
  },
  
  getForumViewCount: (forumId: string) => {
    return get().forumViewCounts.get(forumId) || 0;
  },
  
  // 조회 처리 체크
  markAsViewed: (contentType: string, contentId: string) => {
    set((state) => {
      const newViewedContent = new Set(state.viewedContent);
      newViewedContent.add(`${contentType}:${contentId}`);
      return { viewedContent: newViewedContent };
    });
  },
  
  isAlreadyViewed: (contentType: string, contentId: string) => {
    return get().viewedContent.has(`${contentType}:${contentId}`);
  },
}));