import { create } from 'zustand';

export interface Comment {
  id: string;
  forum_id?: string;
  lecture_id?: string;
  user_id: string;
  parent_id?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author_name?: string;
  author_profile_image?: string;
  author_display_name?: string;
  replies?: Comment[];
}

interface CommentState {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setComments: (comments: Comment[]) => void;
  addComment: (comment: Comment) => void;
  updateComment: (commentId: string, content: string) => void;
  deleteComment: (commentId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // API Actions
  fetchComments: (contentId: string, contentType: 'forum' | 'lecture') => Promise<void>;
  createComment: (contentId: string, contentType: 'forum' | 'lecture', content: string, parentId?: string) => Promise<void>;
  editComment: (contentId: string, contentType: 'forum' | 'lecture', commentId: string, content: string) => Promise<void>;
  removeComment: (contentId: string, contentType: 'forum' | 'lecture', commentId: string) => Promise<void>;
}

export const useCommentStore = create<CommentState>((set, get) => ({
  comments: [],
  isLoading: false,
  error: null,

  setComments: (comments) => set({ comments }),
  
  addComment: (comment) => set((state) => ({
    comments: [...state.comments, comment]
  })),
  
  updateComment: (commentId, content) => set((state) => ({
    comments: state.comments.map(comment =>
      comment.id === commentId
        ? { ...comment, content, updatedAt: new Date().toISOString() }
        : comment
    )
  })),
  
  deleteComment: (commentId) => set((state) => ({
    comments: state.comments.filter(comment => comment.id !== commentId)
  })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),

  // API Actions
  fetchComments: async (contentId: string, contentType: 'forum' | 'lecture') => {
    try {
      set({ isLoading: true, error: null });
      
      const apiPath = contentType === 'forum' ? 'forums' : 'lectures';
      const response = await fetch(`/api/${apiPath}/${contentId}/comments`);
      const data = await response.json();
      
      if (data.status === 'success') {
        // 강의 댓글의 경우 이미 계층구조로 반환됨, 포럼 댓글은 계층구조 처리 필요
        const comments = data.data;
        
        if (contentType === 'lecture') {
          // 강의 댓글은 이미 계층구조로 반환됨
          set({ comments, isLoading: false });
        } else {
          // 포럼 댓글을 계층구조로 정리
          const commentMap = new Map<string, Comment>();
          const rootComments: Comment[] = [];
          
          // 모든 댓글을 맵에 저장
          comments.forEach((comment: Comment) => {
            commentMap.set(comment.id, { ...comment, replies: [] });
          });
          
          // 부모-자식 관계 설정
          comments.forEach((comment: Comment) => {
            const commentWithReplies = commentMap.get(comment.id)!;
            
            if (comment.parent_id) {
              // 대댓글인 경우 부모 댓글의 replies에 추가
              const parentComment = commentMap.get(comment.parent_id);
              if (parentComment) {
                parentComment.replies!.push(commentWithReplies);
              }
            } else {
              // 최상위 댓글인 경우 rootComments에 추가
              rootComments.push(commentWithReplies);
            }
          });
          
          set({ comments: rootComments, isLoading: false });
        }
      } else {
        set({ error: data.message, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      set({ error: '댓글을 불러오는데 실패했습니다', isLoading: false });
    }
  },

  createComment: async (contentId: string, contentType: 'forum' | 'lecture', content: string, parentId?: string) => {
    try {
      set({ error: null });
      
      const apiPath = contentType === 'forum' ? 'forums' : 'lectures';
      const response = await fetch(`/api/${apiPath}/${contentId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, parentId })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        // 댓글 목록을 다시 불러와서 최신 상태 유지
        await get().fetchComments(contentId, contentType);
      } else {
        set({ error: data.message });
      }
    } catch (error) {
      console.error('Failed to create comment:', error);
      set({ error: '댓글 작성에 실패했습니다' });
    }
  },

  editComment: async (contentId: string, contentType: 'forum' | 'lecture', commentId: string, content: string) => {
    try {
      set({ error: null });
      
      const apiPath = contentType === 'forum' ? 'forums' : 'lectures';
      const response = await fetch(`/api/${apiPath}/${contentId}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        get().updateComment(commentId, content);
      } else {
        set({ error: data.message });
      }
    } catch (error) {
      console.error('Failed to edit comment:', error);
      set({ error: '댓글 수정에 실패했습니다' });
    }
  },

  removeComment: async (contentId: string, contentType: 'forum' | 'lecture', commentId: string) => {
    try {
      set({ error: null });
      
      const apiPath = contentType === 'forum' ? 'forums' : 'lectures';
      const response = await fetch(`/api/${apiPath}/${contentId}/comments/${commentId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        get().deleteComment(commentId);
      } else {
        set({ error: data.message });
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
      set({ error: '댓글 삭제에 실패했습니다' });
    }
  }
}));