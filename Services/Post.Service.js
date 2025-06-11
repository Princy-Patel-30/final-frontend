import api from '../Utils/Api.jsx';
import {
  validatePostContent,
  validateCommentContent,
  validateMediaFiles,
  buildPostFormData,
} from '../Validations/posthelper.jsx';

// Create a new post with optional media files
export const createPost = async (content, mediaFiles = []) => {
  const { isValid, errors } = validatePostContent(content, mediaFiles);
  if (!isValid) throw new Error(errors[0]);

  const { isValid: isMediaValid, errors: mediaErrors } =
    validateMediaFiles(mediaFiles);
  if (!isMediaValid) throw new Error(mediaErrors[0]);

  try {
    const formData = buildPostFormData(content, mediaFiles);
    const response = await api.post('/post', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create post');
  }
};

export const getUserPosts = async (userId, page = 1) => {
  try {
    const response = await api.get(`/post/user/${userId}?page=${page}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 'Failed to fetch user posts',
    );
  }
};
// Get home feed with pagination
export const getHomeFeed = async (page = 1) => {
  try {
    const response = await api.get(`/post/feed?page=${page}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch home feed');
  }
};

// Get specific post details by ID
export const getPostDetails = async (postId) => {
  try {
    const response = await api.get(`/post/${postId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 'Failed to fetch post details',
    );
  }
};

// Like a post
export const likePost = async (postId) => {
  try {
    const response = await api.post(`/post/like/${postId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to like post');
  }
};

// Unlike a post
export const unlikePost = async (postId) => {
  try {
    const response = await api.delete(`/post/unlike/${postId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to unlike post');
  }
};

// Add a comment to a post
export const addComment = async (postId, content) => {
  const { isValid, errors } = validateCommentContent(content);
  if (!isValid) throw new Error(errors[0]);

  try {
    const response = await api.post(`/post/${postId}/comments`, {
      content: content.trim(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to add comment');
  }
};

// Edit an existing comment
export const editComment = async (commentId, content) => {
  const { isValid, errors } = validateCommentContent(content);
  if (!isValid) throw new Error(errors[0]);

  try {
    const response = await api.put(`/post/comments/${commentId}`, {
      content: content.trim(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to edit comment');
  }
};

// Delete a comment
export const deleteComment = async (commentId) => {
  try {
    const response = await api.delete(`/post/comments/${commentId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete comment');
  }
};

// Get all comments for a specific post
export const getPostComments = async (postId) => {
  try {
    const response = await api.get(`/post/${postId}/comments`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch comments');
  }
};

// Save a post
export const savePost = async (postId) => {
  try {
    const response = await api.post(`/post/save/${postId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to save post');
  }
};

// Get saved posts
export const getSavedPosts = async (page = 1) => {
  try {
    const response = await api.get(`/post/saved?page=${page}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 'Failed to fetch saved posts',
    );
  }
};

export default {
  createPost,
  getUserPosts,
  getHomeFeed,
  getPostDetails,
  likePost,
  unlikePost,
  addComment,
  editComment,
  deleteComment,
  getPostComments,
  savePost,
  getSavedPosts,
};
