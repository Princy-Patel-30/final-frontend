import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
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

export const useUserProfile = (userId, options = {}, currentUserId = null) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getUserProfile(userId, currentUserId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // Reduced from 5 minutes to 2 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  });
};

export const useSearchUsers = (
  query,
  page = 1,
  limit = 10,
  currentUserId = null,
) => {
  const queryKey = useMemo(
    () => ['users', 'search', { query: query?.trim(), page, limit }],
    [query, page, limit],
  );

  return useQuery({
    queryKey,
    queryFn: ({ queryKey, signal }) => {
      const [, , { query: searchQuery }] = queryKey;
      const trimmedQuery = searchQuery?.trim() || '';
      if (trimmedQuery.length === 1) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(
              searchUsers(trimmedQuery, page, limit, signal, currentUserId),
            );
          }, 200);
        });
      }
      return searchUsers(trimmedQuery, page, limit, signal, currentUserId);
    },
    enabled: !!(query && query.trim().length > 0),
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: (failureCount, error) => {
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
    onError: (error) => {
      console.error('Search error:', error);
      toast.error('Search failed');
    },
    select: (data) => {
      console.log('Raw API response:', data);
      const responseData = data?.data || data;
      return {
        users: responseData?.users || [],
        total: responseData?.usersfound || 0,
        page: page,
        limit: limit,
      };
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      const updatedUser = data.user || data;
      const userId = updatedUser.id;

      // Remove stale profile-related queries
      queryClient.removeQueries({
        queryKey: ['profile'],
        exact: false,
      });

      // Set new profile data
      if (userId) {
        queryClient.setQueryData(['profile', userId], updatedUser);
      }

      // Invalidate related user listings
      queryClient.invalidateQueries({
        queryKey: ['users'],
        exact: false,
      });

      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error || 'Failed to update profile');
      console.error('Update profile error:', error);
    },
  });
};

export const useFollow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => follow(userId),
    onMutate: async (userId) => {
      // Cancel all ongoing queries that might be affected
      await queryClient.cancelQueries({ queryKey: ['profile'] });
      await queryClient.cancelQueries({ queryKey: ['users'] });
      await queryClient.cancelQueries({ queryKey: ['followers'] });
      await queryClient.cancelQueries({ queryKey: ['following'] });

      // Snapshot previous values
      const previousProfile = queryClient.getQueryData(['profile', userId]);
      const previousSearchQueries = [];

      // Get all search query data to revert if needed
      queryClient
        .getQueryCache()
        .findAll(['users', 'search'])
        .forEach((query) => {
          const data = query.state.data;
          if (data) {
            previousSearchQueries.push({
              queryKey: query.queryKey,
              data: data,
            });
          }
        });

      // Optimistically update profile
      queryClient.setQueryData(['profile', userId], (old) => {
        if (!old) return old;
        const currentData = old.data || old;
        return {
          ...old,
          data: {
            ...currentData,
            isFollowing: true,
            _count: {
              ...currentData._count,
              followers: (currentData._count?.followers || 0) + 1,
            },
          },
        };
      });

      // Optimistically update ALL search results
      queryClient
        .getQueryCache()
        .findAll(['users', 'search'])
        .forEach((query) => {
          queryClient.setQueryData(query.queryKey, (old) => {
            if (!old || !old.users) return old;
            return {
              ...old,
              users: old.users.map((user) =>
                user.id === userId ? { ...user, isFollowing: true } : user,
              ),
            };
          });
        });

      return { previousProfile, previousSearchQueries };
    },
    onSuccess: (data, userId) => {
      toast.success('Followed user');

      // Invalidate and refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      queryClient.invalidateQueries({
        queryKey: ['users', 'search'],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ['followers'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['following'], exact: false });
    },
    onError: (err, userId, context) => {
      // Revert optimistic updates
      if (context?.previousProfile) {
        queryClient.setQueryData(['profile', userId], context.previousProfile);
      }

      // Revert search query updates
      if (context?.previousSearchQueries) {
        context.previousSearchQueries.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      toast.error(err?.response?.data?.error || 'Failed to follow user');
    },
  });
};

export const useUnfollow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => unfollow(userId),
    onMutate: async (userId) => {
      // Cancel all ongoing queries that might be affected
      await queryClient.cancelQueries({ queryKey: ['profile'] });
      await queryClient.cancelQueries({ queryKey: ['users'] });
      await queryClient.cancelQueries({ queryKey: ['followers'] });
      await queryClient.cancelQueries({ queryKey: ['following'] });

      // Snapshot previous values
      const previousProfile = queryClient.getQueryData(['profile', userId]);
      const previousSearchQueries = [];

      // Get all search query data to revert if needed
      queryClient
        .getQueryCache()
        .findAll(['users', 'search'])
        .forEach((query) => {
          const data = query.state.data;
          if (data) {
            previousSearchQueries.push({
              queryKey: query.queryKey,
              data: data,
            });
          }
        });

      // Optimistically update profile
      queryClient.setQueryData(['profile', userId], (old) => {
        if (!old) return old;
        const currentData = old.data || old;
        return {
          ...old,
          data: {
            ...currentData,
            isFollowing: false,
            _count: {
              ...currentData._count,
              followers: Math.max((currentData._count?.followers || 0) - 1, 0),
            },
          },
        };
      });

      // Optimistically update ALL search results
      queryClient
        .getQueryCache()
        .findAll(['users', 'search'])
        .forEach((query) => {
          queryClient.setQueryData(query.queryKey, (old) => {
            if (!old || !old.users) return old;
            return {
              ...old,
              users: old.users.map((user) =>
                user.id === userId ? { ...user, isFollowing: false } : user,
              ),
            };
          });
        });

      return { previousProfile, previousSearchQueries };
    },
    onSuccess: (data, userId) => {
      toast.success('Unfollowed user');

      // Invalidate and refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      queryClient.invalidateQueries({
        queryKey: ['users', 'search'],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ['followers'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['following'], exact: false });
    },
    onError: (err, userId, context) => {
      // Revert optimistic updates
      if (context?.previousProfile) {
        queryClient.setQueryData(['profile', userId], context.previousProfile);
      }

      // Revert search query updates
      if (context?.previousSearchQueries) {
        context.previousSearchQueries.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      toast.error(err?.response?.data?.error || 'Failed to unfollow user');
    },
  });
};

export const useFollowers = (userId, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['followers', userId, page, limit],
    queryFn: () => getFollowers(userId, page, limit),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
    onError: (error) => {
      console.error('useFollowers error:', error);
      toast.error('Failed to load followers');
    },
    select: (data) => {
      console.log('useFollowers select - raw data:', data);

      // Handle the nested response structure
      const responseData = data?.data || data;

      return {
        totalFollowers: responseData?.totalFollowers || 0,
        followers: (responseData?.followers || []).map((f) => ({
          id: f.id,
          name: f.name,
          displayName: f.displayName || f.name,
          avatarUrl: f.avatarUrl,
          bio: f.bio,
        })),
      };
    },
  });
};

export const useFollowing = (userId, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['following', userId, page, limit],
    queryFn: () => getFollowing(userId, page, limit),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
    onError: (error) => {
      console.error('useFollowing error:', error);
      toast.error('Failed to load following');
    },
    select: (data) => {
      console.log('useFollowing select - raw data:', data);

      // Handle the nested response structure
      const responseData = data?.data || data;

      return {
        totalFollowing: responseData?.totalFollowing || 0,
        following: (responseData?.following || []).map((f) => ({
          id: f.id,
          name: f.name,
          displayName: f.displayName || f.name,
          avatarUrl: f.avatarUrl,
          bio: f.bio,
        })),
      };
    },
  });
};
