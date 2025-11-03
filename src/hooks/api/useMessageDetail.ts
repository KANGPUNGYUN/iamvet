import { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';

export interface MessageDetailData {
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
    profileImage?: string | null;
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
  category: string;
  images?: string[];
}

export function useMessageDetail(messageId: string, preferredType: 'notification' | 'inquiry') {
  const [message, setMessage] = useState<MessageDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessageDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('[useMessageDetail] Making API request with cookie auth');

        // Try the preferred type first
        let response;
        try {
          response = await api.get(`/messages/${messageId}?type=${preferredType}`);
        } catch (error: any) {
          // If 404, try the other type
          if (error.response?.status === 404) {
            const otherType = preferredType === 'notification' ? 'inquiry' : 'notification';
            response = await api.get(`/messages/${messageId}?type=${otherType}`);
          } else {
            throw error;
          }
        }

        const data = response.data;
        setMessage(data.message);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching message detail:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (messageId) {
      fetchMessageDetail();
    }
  }, [messageId, preferredType]);

  return {
    message,
    isLoading,
    error
  };
}