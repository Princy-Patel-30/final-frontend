import api from '../Utils/Api';

const pendingRequests = new Map();

// Get user profile by ID
export const getUserProfile = async (id, currentUserId = null) => {
  const res = await api.get(`/user/id/${id}`, {
    params: { currentUserId },
  });
  return res.data;
};

// Search users by name or bio
export const searchUsers = async (
  query = '',
  page = 1,
  limit = 10,
  signal,
  currentUserId = null,
) => {
  const trimmedQuery = query.trim();
  if (!trimmedQuery)
    return {
      data: {
        users: [],
        usersfound: 0,
      },
    };

  const requestKey = `search_${trimmedQuery}_${page}_${limit}`;
  if (pendingRequests.has(requestKey)) {
    console.log('Returning existing request for:', trimmedQuery);
    try {
      return await pendingRequests.get(requestKey);
    } catch (error) {
      pendingRequests.delete(requestKey);
      throw error;
    }
  }

  const requestPromise = api
    .get('/user/search', {
      params: { q: trimmedQuery, page, limit, currentUserId },
      signal,
    })
    .then((res) => {
      pendingRequests.delete(requestKey);
      console.log('Search API response:', res.data);
      return res.data;
    })
    .catch((error) => {
      pendingRequests.delete(requestKey);
      console.error('Search API error:', error);
      throw error;
    });

  pendingRequests.set(requestKey, requestPromise);
  return requestPromise;
};

// Update logged-in user's profile
export const updateProfile = async (formData) => {
  const res = await api.put('/user/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// Follow a user by ID
export const follow = async (id) => {
  const res = await api.post(`/user/id/${id}/follow`);
  return res.data;
};

// Unfollow a user by ID
export const unfollow = async (id) => {
  const res = await api.post(`/user/id/${id}/unfollow`);
  return res.data;
};

// Get followers of a user by ID
export const getFollowers = async (id, page = 1, limit = 10) => {
  if (!id) throw new Error('User ID is required');
  const res = await api.get(`/user/id/${id}/followers`, {
    params: { page, limit },
  });
  console.log('Follower API response:', res.data);
  return {
    totalFollowers: res.data.data.totalFollowers,
    followers: res.data.data.followers.map((f) => ({
      id: f.id,
      name: f.name,
      avatarUrl: f.avatarUrl,
    })),
  };
};

export const getFollowing = async (id, page = 1, limit = 10) => {
  if (!id) throw new Error('User ID is required');
  const res = await api.get(`/user/id/${id}/following`, {
    params: { page, limit },
  });
  console.log('Following API response:', res.data);
  return {
    totalFollowing: res.data.data.totalFollowing,
    following: res.data.data.following.map((f) => ({
      id: f.id,
      name: f.name,
      avatarUrl: f.avatarUrl,
    })),
  };
};

export const clearPendingSearchRequests = () => {
  pendingRequests.clear();
};
