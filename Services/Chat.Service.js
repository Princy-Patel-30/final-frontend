import api from '../Utils/Api.jsx';

export const chatService = {
  getChats: () => api.get('/api/chat'),

  createChat: (otherUserId) => api.post('/api/chat', { otherUserId }),

  getChat: (chatId) => api.get(`/api/chat/${chatId}`),

  getMessages: (chatId) => api.get(`/api/chat/${chatId}/messages`),

  sendMessage: (chatId, content) =>
    api.post(`/api/chat/${chatId}/messages`, { content }),
};
