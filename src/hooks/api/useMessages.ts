import { useState, useEffect } from 'react';

export interface MessageData {
  id: string;
  type: 'notification' | 'inquiry';
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  senderId?: string;
  sender?: {
    id: string;
    nickname: string | null;
    userType: string;
  };
  notificationType?: string;
  subject?: string;
  job?: {
    id: string;
    title: string;
    hospitalName: string | null;
  };
  resume?: {
    id: string;
    title: string;
  };
  inquiryType?: string;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface UseMessagesParams {
  type?: 'notifications' | 'inquiries' | 'all';
  filter?: 'all' | 'read' | 'unread';
  sort?: 'recent' | 'oldest';
  page?: number;
  limit?: number;
}

export function useMessages(params: UseMessagesParams = {}) {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    type = 'all',
    filter = 'all',
    sort = 'recent',
    page = 1,
    limit = 10
  } = params;

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const queryParams = new URLSearchParams({
        type,
        filter,
        sort,
        page: page.toString(),
        limit: limit.toString()
      });

      const response = await fetch(`/api/messages?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data.messages);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching messages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (messageId: string, messageType: 'notification' | 'inquiry') => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: messageType })
      });

      if (!response.ok) {
        throw new Error('Failed to mark as read');
      }

      // 로컬 상태 업데이트
      setMessages(prev => 
        prev.map(message => 
          message.id === messageId 
            ? { ...message, isRead: true }
            : message
        )
      );

      return true;
    } catch (err) {
      console.error('Error marking message as read:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [type, filter, sort, page, limit]);

  return {
    messages,
    pagination,
    isLoading,
    error,
    refetch: fetchMessages,
    markAsRead
  };
}