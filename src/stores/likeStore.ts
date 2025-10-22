import { create } from 'zustand';

interface LikeState {
  likedResumes: Set<string>;
  likedJobs: Set<string>;
  likedLectures: Set<string>;
  likedTransfers: Set<string>;
  
  // Resume 좋아요 액션
  setResumeLike: (resumeId: string, isLiked: boolean) => void;
  toggleResumeLike: (resumeId: string) => boolean; // 반환값: 새로운 상태
  initializeResumeLikes: (resumeIds: string[]) => void;
  
  // Job 좋아요 액션  
  setJobLike: (jobId: string, isLiked: boolean) => void;
  toggleJobLike: (jobId: string) => boolean; // 반환값: 새로운 상태
  initializeJobLikes: (jobIds: string[]) => void;
  
  // Lecture 좋아요 액션
  setLectureLike: (lectureId: string, isLiked: boolean) => void;
  toggleLectureLike: (lectureId: string) => boolean; // 반환값: 새로운 상태
  initializeLectureLikes: (lectureIds: string[]) => void;
  
  // Transfer 좋아요 액션
  setTransferLike: (transferId: string, isLiked: boolean) => void;
  toggleTransferLike: (transferId: string) => boolean; // 반환값: 새로운 상태
  initializeTransferLikes: (transferIds: string[]) => void;
  
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
    set((state) => {
      const newLikedJobs = new Set([...Array.from(state.likedJobs), ...jobIds]);
      console.log(`[LikeStore] Job 좋아요 초기화:`, Array.from(newLikedJobs));
      return { likedJobs: newLikedJobs };
    });
  },
  
  // Lecture 좋아요 관리
  setLectureLike: (lectureId: string, isLiked: boolean) => {
    set((state) => {
      const newLikedLectures = new Set(state.likedLectures);
      if (isLiked) {
        newLikedLectures.add(lectureId);
      } else {
        newLikedLectures.delete(lectureId);
      }
      console.log(`[LikeStore] Lecture ${lectureId} 좋아요 상태: ${isLiked}`);
      return { likedLectures: newLikedLectures };
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
    set((state) => {
      const newLikedLectures = new Set([...Array.from(state.likedLectures), ...lectureIds]);
      console.log(`[LikeStore] Lecture 좋아요 초기화:`, Array.from(newLikedLectures));
      return { likedLectures: newLikedLectures };
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
    set((state) => {
      const newLikedTransfers = new Set([...Array.from(state.likedTransfers), ...transferIds]);
      console.log(`[LikeStore] Transfer 좋아요 초기화:`, Array.from(newLikedTransfers));
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