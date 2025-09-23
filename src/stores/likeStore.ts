import { create } from 'zustand';

interface LikeState {
  likedResumes: Set<string>;
  likedJobs: Set<string>;
  
  // Resume 좋아요 액션
  setResumeLike: (resumeId: string, isLiked: boolean) => void;
  toggleResumeLike: (resumeId: string) => boolean; // 반환값: 새로운 상태
  initializeResumeLikes: (resumeIds: string[]) => void;
  
  // Job 좋아요 액션  
  setJobLike: (jobId: string, isLiked: boolean) => void;
  toggleJobLike: (jobId: string) => boolean; // 반환값: 새로운 상태
  initializeJobLikes: (jobIds: string[]) => void;
  
  // 유틸리티
  isResumeLiked: (resumeId: string) => boolean;
  isJobLiked: (jobId: string) => boolean;
}

export const useLikeStore = create<LikeState>((set, get) => ({
  likedResumes: new Set<string>(),
  likedJobs: new Set<string>(),
  
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
    set((state) => {
      const newLikedResumes = new Set([...Array.from(state.likedResumes), ...resumeIds]);
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
  
  // 유틸리티 함수
  isResumeLiked: (resumeId: string) => {
    return get().likedResumes.has(resumeId);
  },
  
  isJobLiked: (jobId: string) => {
    return get().likedJobs.has(jobId);
  },
}));