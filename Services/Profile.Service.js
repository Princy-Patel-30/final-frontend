import api from '../Utils/Api';

export const getUserProfile = async (username) => {
  const res = await api.get(`/user/${username}`);
  return res.data;
};

export const updateProfile = async (formData) => {
  const res = await api.put('/user/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const searchUsers = async (query = '', page = 1, limit = 10) => {
  const res = await api.get('/user/search', {
    params: { q: query, page, limit },
  });
  return res.data;
};

export const follow = async (username) => {
  const res = await api.post(`/profile/${username}/follow`);
  return res.data;
};

export const unfollow = async (username) => {
  const res = await api.post(`/profile/${username}/unfollow`);
  return res.data;
};

export const getFollowers = async (username, page = 1, limit = 10) => {
  const res = await api.get(`/user/${username}/followers`, {
    params: { page, limit },
  });
  return res.data;
};

export const getFollowing = async (username, page = 1, limit = 10) => {
  const res = await api.get(`/user/${username}/following`, {
    params: { page, limit },
  });
  return res.data;
};
