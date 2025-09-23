import { useState, useEffect } from 'react';

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

        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Try the preferred type first
        let response = await fetch(`/api/messages/${messageId}?type=${preferredType}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // If 404, try the other type
        if (response.status === 404) {
          const otherType = preferredType === 'notification' ? 'inquiry' : 'notification';
          response = await fetch(`/api/messages/${messageId}?type=${otherType}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        }

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication required');
          } else if (response.status === 404) {
            throw new Error('Message not found');
          } else if (response.status === 403) {
            throw new Error('Access denied');
          }
          throw new Error('Failed to fetch message');
        }

        const data = await response.json();
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