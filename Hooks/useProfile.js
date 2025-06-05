import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserProfile,
  updateProfile,
  searchUsers,
  follow,
  unfollow,
  getFollowers,
  getFollowing,
} from '../Services/Profile.Service';
import { toast } from 'react-toastify';

export const useUserProfile = (username, options = {}) => {
  return useQuery({
    queryKey: ['profile', username],
    queryFn: () => getUserProfile(username),
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1, // Only retry once by default
    ...options, // Allow overriding default options
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      console.log('Update profile success:', data);

      // Get the updated user data from the response
      const updatedUser = data.user || data;

      // Clear all profile-related queries first to avoid stale data
      queryClient.removeQueries({
        queryKey: ['profile'],
        exact: false,
      });

      // Set the new profile data with the updated username
      if (updatedUser.name) {
        queryClient.setQueryData(['profile', updatedUser.name], updatedUser);
      }

      // Also invalidate user search queries in case the profile appears there
      queryClient.invalidateQueries({
        queryKey: ['users'],
        exact: false,
      });

      console.log('Profile cache cleared and updated with new data');
    },
    onError: (error) => {
      console.error('Update profile error:', error);
    },
  });
};

export const useSearchUsers = (query, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['users', { query, page, limit }],
    queryFn: () => searchUsers(query, page, limit),
    keepPreviousData: true,
    enabled: !!query,
  });
};

export const useFollow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: follow,
    onSuccess: (_, username) => {
      toast.success(`Followed ${username}`);
      queryClient.invalidateQueries({ queryKey: ['profile', username] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to follow user');
    },
  });
};

export const useUnfollow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unfollow,
    onSuccess: (_, username) => {
      toast.success(`Unfollowed ${username}`);
      queryClient.invalidateQueries({ queryKey: ['profile', username] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to unfollow user');
    },
  });
};

export const useFollowers = (username, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['followers', username, page, limit],
    queryFn: () => getFollowers(username, page, limit),
    enabled: !!username,
  });
};

export const useFollowing = (username, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['following', username, page, limit],
    queryFn: () => getFollowing(username, page, limit),
    enabled: !!username,
  });
};
