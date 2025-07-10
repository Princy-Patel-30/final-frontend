import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import PostService from '../Services/Post.Service';

export const useHomeFeed = (page = 1) => {
  return useQuery({
    queryKey: ['homeFeed', page],
    queryFn: () => PostService.getHomeFeed(page),
    keepPreviousData: true,
  });
};

export const useUserPosts = (userId, page = 1) => {
  return useQuery({
    queryKey: ['userPosts', userId, page],
    queryFn: () => PostService.getUserPosts(userId, page),
    enabled: !!userId,
    keepPreviousData: true,
  });
};
export const usePostDetails = (postId) => {
  return useQuery({
    queryKey: ['postDetails', postId],
    queryFn: () => PostService.getPostDetails(postId),
    enabled: !!postId,
    retry: (failureCount, error) => {
      // Don't retry if it's a 404 (post not found)
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
};
// Hook for creating a post
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => PostService.createPost(formData), // Accepts FormData directly!
    onSuccess: () => {
      queryClient.invalidateQueries(['homeFeed']);
      queryClient.invalidateQueries(['userPosts']);
      toast.success('Post created successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

// Hook for liking/unliking a post
export const useToggleLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, isLiked }) =>
      isLiked ? PostService.unlikePost(postId) : PostService.likePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries(['homeFeed']);
      queryClient.invalidateQueries(['userPosts']);
      queryClient.invalidateQueries(['postDetails']);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

// Hook for adding a comment
export const useAddComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, content }) =>
      PostService.addComment(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries(['postComments']);
      queryClient.invalidateQueries(['homeFeed']);
      queryClient.invalidateQueries(['userPosts']);
      toast.success('Comment added successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

// Hook for editing a comment
export const useEditComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, content }) =>
      PostService.editComment(commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries(['postComments']);
      toast.success('Comment updated successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

// Hook for deleting a comment
export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId) => PostService.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries(['postComments']);
      queryClient.invalidateQueries(['homeFeed']);
      queryClient.invalidateQueries(['userPosts']);
      toast.success('Comment deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const usePostComments = (postId) => {
  return useQuery({
    queryKey: ['postComments', postId],
    queryFn: () => PostService.getPostComments(postId),
    enabled: !!postId,
  });
};

// Hook for saving a post
export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId) => PostService.savePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries(['savedPosts']);
      toast.success('Post saved successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

// Hook for fetching saved posts
export const useSavedPosts = (page = 1) => {
  return useQuery({
    queryKey: ['savedPosts', page],
    queryFn: () => PostService.getSavedPosts(page),
    keepPreviousData: true,
  });
};
