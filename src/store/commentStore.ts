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
    comments: state.comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, content, updatedAt: new Date().toISOString() };
      }
      
      // 대댓글도 확인하여 업데이트
      if (comment.replies) {
        const updatedReplies = comment.replies.map(reply => 
          reply.id === commentId 
            ? { ...reply, content, updatedAt: new Date().toISOString() }
            : reply
        );
        
        // 대댓글 중 수정된 것이 있으면 댓글 전체를 업데이트
        if (updatedReplies.some((reply, idx) => reply !== comment.replies![idx])) {
          return { ...comment, replies: updatedReplies };
        }
      }
      
      return comment;
    })
  })),
  
  deleteComment: (commentId) => set((state) => ({
    comments: state.comments
      .map(comment => {
        // 대댓글 중에서 삭제할 댓글이 있는지 확인
        if (comment.replies) {
          const filteredReplies = comment.replies.filter(reply => reply.id !== commentId);
          if (filteredReplies.length !== comment.replies.length) {
            return { ...comment, replies: filteredReplies };
          }
        }
        return comment;
      })
      .filter(comment => comment.id !== commentId) // 최상위 댓글 삭제
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
      console.log('[CommentStore] createComment 시작:', { contentId, contentType, content: content.substring(0, 50), parentId });
      set({ error: null });
      
      const apiPath = contentType === 'forum' ? 'forums' : 'lectures';
      console.log('[CommentStore] API 요청:', `POST /api/${apiPath}/${contentId}/comments`);
      
      const response = await fetch(`/api/${apiPath}/${contentId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 쿠키 포함
        body: JSON.stringify({ content, parentId })
      });
      
      const data = await response.json();
      console.log('[CommentStore] API 응답:', { status: response.status, data });
      
      if (data.status === 'success') {
        console.log('[CommentStore] 댓글 생성 성공, 댓글 목록 새로고침 중...');
        // 댓글 목록을 다시 불러와서 최신 상태 유지
        await get().fetchComments(contentId, contentType);
        console.log('[CommentStore] 댓글 목록 새로고침 완료');
      } else {
        console.error('[CommentStore] 댓글 생성 실패:', data.message);
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
      console.log('[CommentStore] removeComment 시작:', { contentId, contentType, commentId });
      set({ error: null });
      
      const apiPath = contentType === 'forum' ? 'forums' : 'lectures';
      console.log('[CommentStore] API 요청:', `DELETE /api/${apiPath}/${contentId}/comments/${commentId}`);
      
      const response = await fetch(`/api/${apiPath}/${contentId}/comments/${commentId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      console.log('[CommentStore] API 응답:', { status: response.status, data });
      
      if (data.status === 'success') {
        console.log('[CommentStore] deleteComment 호출 전 댓글 수:', get().comments.length);
        get().deleteComment(commentId);
        console.log('[CommentStore] deleteComment 호출 후 댓글 수:', get().comments.length);
      } else {
        console.error('[CommentStore] API 에러:', data.message);
        set({ error: data.message });
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
      set({ error: '댓글 삭제에 실패했습니다' });
    }
  }
}));