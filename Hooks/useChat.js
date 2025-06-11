import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { chatService } from '../Services/Chat.Service';
import { useSocket } from '../Hooks/useSocket';

export const QUERY_KEYS = {
  chats: ['chats'],
  chat: (id) => ['chat', id],
  messages: (chatId) => ['messages', chatId],
};

export const useChats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.chats,
    queryFn: async () => {
      const response = await chatService.getChats();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (otherUserId) => {
      const response = await chatService.createChat(otherUserId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chats });
    },
  });
};

// Get chat details
export const useChat = (chatId) => {
  return useQuery({
    queryKey: QUERY_KEYS.chat(chatId),
    queryFn: async () => {
      const response = await chatService.getChat(chatId);
      return response.data;
    },
    enabled: !!chatId,
  });
};

// Get messages
export const useMessages = (chatId) => {
  return useQuery({
    queryKey: QUERY_KEYS.messages(chatId),
    queryFn: async () => {
      const response = await chatService.getMessages(chatId);
      return response.data;
    },
    enabled: !!chatId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Send message
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ chatId, content }) => {
      const response = await chatService.sendMessage(chatId, content);
      return response.data;
    },
    onSuccess: (newMessage, { chatId }) => {
      // Optimistic update
      queryClient.setQueryData(QUERY_KEYS.messages(chatId), (old = []) => [
        ...old,
        newMessage,
      ]);

      // Refresh chats to update preview
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chats });
    },
  });
};

// Real-time chat hook - combines everything
export const useRealTimeChat = (chatId) => {
  const user = useSelector((state) => state.auth.user);
  const queryClient = useQueryClient();

  // Socket connection
  const { socket, isConnected } = useSocket(
    import.meta.env.VITE_API_BASE_URL,
    user?.id,
  );

  // Queries and mutations
  const messagesQuery = useMessages(chatId);
  const sendMessageMutation = useSendMessage();

  // Handle incoming messages
  useEffect(() => {
    if (!socket || !chatId) return;

    const handleMessage = (message) => {
      if (message.chatId === chatId) {
        queryClient.setQueryData(QUERY_KEYS.messages(chatId), (old = []) => {
          // Prevent duplicates
          if (old.some((msg) => msg.id === message.id)) return old;
          return [...old, message];
        });

        // Update chat list
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chats });
      }
    };

    socket.on('receive_message', handleMessage);

    return () => {
      socket.off('receive_message', handleMessage);
    };
  }, [socket, chatId, queryClient]);

  // Send message function
  const sendMessage = useCallback(
    async (content, receiverId) => {
      if (!content?.trim() || !chatId) return;

      try {
        // Send via API
        const message = await sendMessageMutation.mutateAsync({
          chatId,
          content,
        });

        // Send via socket for real-time
        if (socket && receiverId) {
          socket.emit('send_message', {
            ...message,
            receiverId,
          });
        }

        return message;
      } catch (error) {
        console.error('Send message failed:', error);
        throw error;
      }
    },
    [chatId, socket, sendMessageMutation],
  );

  return {
    messages: messagesQuery.data || [],

    // Loading states
    isLoadingMessages: messagesQuery.isLoading,
    isSendingMessage: sendMessageMutation.isPending,

    // Actions
    sendMessage,
    refetchMessages: messagesQuery.refetch,

    // Socket status
    isConnected,

    // Errors
    error: messagesQuery.error || sendMessageMutation.error,
  };
};

// Chat list with real-time updates
export const useChatList = () => {
  const user = useSelector((state) => state.auth.user);
  const queryClient = useQueryClient();

  // Socket for real-time updates
  const { socket, isConnected } = useSocket(
    import.meta.env.VITE_API_BASE_URL,
    user?.id,
  );

  // Queries
  const chatsQuery = useChats();
  const createChatMutation = useCreateChat();

  // Listen for chat updates
  useEffect(() => {
    if (!socket) return;

    const handleMessage = () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chats });
    };

    socket.on('receive_message', handleMessage);

    return () => {
      socket.off('receive_message', handleMessage);
    };
  }, [socket, queryClient]);

  const startChat = useCallback(
    async (otherUserId) => {
      return createChatMutation.mutateAsync(otherUserId);
    },
    [createChatMutation],
  );

  return {
    // Data
    chats: chatsQuery.data || [],

    // Loading states
    isLoading: chatsQuery.isLoading,
    isCreating: createChatMutation.isPending,

    // Actions
    startChat,
    refetch: chatsQuery.refetch,

    // Socket status
    isConnected,

    // Errors
    error: chatsQuery.error || createChatMutation.error,
  };
};
