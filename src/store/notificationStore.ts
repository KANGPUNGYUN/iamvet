import { create } from 'zustand';

interface NotificationState {
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUnreadCount: (count: number) => void;
  incrementUnreadCount: () => void;
  decrementUnreadCount: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // API Actions
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  unreadCount: 0,
  isLoading: false,
  error: null,

  setUnreadCount: (count) => set({ unreadCount: count }),
  
  incrementUnreadCount: () => set((state) => ({ 
    unreadCount: state.unreadCount + 1 
  })),
  
  decrementUnreadCount: () => set((state) => ({ 
    unreadCount: Math.max(0, state.unreadCount - 1) 
  })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),

  // API Actions
  fetchUnreadCount: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // 토큰 가져오기
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.log('No access token found for notifications');
        set({ isLoading: false });
        return;
      }

      const response = await fetch('/api/messages?type=notifications&filter=unread&limit=1', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const data = await response.json();
      
      if (response.ok && data.pagination) {
        // totalCount를 사용하여 전체 읽지 않은 알림 수 설정
        set({ 
          unreadCount: data.pagination.totalCount || 0,
          isLoading: false 
        });
      } else {
        set({ 
          error: 'Failed to fetch unread count',
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('Failed to fetch unread notifications count:', error);
      set({ 
        error: '읽지 않은 알림 수를 불러오는데 실패했습니다',
        isLoading: false 
      });
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      set({ error: null });
      
      // 토큰 가져오기
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return;
      }

      const response = await fetch(`/api/messages/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        // 성공적으로 읽음 처리된 경우 카운트 감소
        get().decrementUnreadCount();
      } else {
        set({ error: data.message || 'Failed to mark as read' });
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      set({ error: '알림 읽음 처리에 실패했습니다' });
    }
  }
}));