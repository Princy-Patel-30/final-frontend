import { useState, useEffect, useRef, useOptimistic } from 'react';
import PostCard from './PostCard';
import IconRenderer from './IconRenderer';
import { useHomeFeed } from '../../Hooks/usePost';
import { transformPost } from '../../Utils/PostUtils';

const PostFeed = () => {
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState([]);
  const loader = useRef(null);

  const { data: feedData, isLoading, error, isError } = useHomeFeed(page);

  const [optimisticPosts, setOptimisticPosts] = useOptimistic(
    allPosts,
    (state, action) => {
      switch (action.type) {
        case 'LIKE':
          return state.map((post) =>
            post.id === action.postId
              ? {
                  ...post,
                  likes: action.isLiked ? post.likes - 1 : post.likes + 1,
                  likedByCurrentUser: !post.likedByCurrentUser,
                }
              : post,
          );
        case 'COMMENT':
          return state.map((post) =>
            post.id === action.postId
              ? { ...post, comments: post.comments + 1 }
              : post,
          );
        default:
          return state;
      }
    },
  );

  useEffect(() => {
    if (feedData?.posts) {
      const transformedPosts = feedData.posts.map(transformPost);
      if (page === 1) {
        setAllPosts(transformedPosts);
      } else {
        setAllPosts((prev) => [...prev, ...transformedPosts]);
      }
    }
  }, [feedData, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && feedData?.hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 },
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [isLoading, feedData?.hasMore]);

  const handleImageChange = (postId, direction) => {
    setAllPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;
        const total = post.images.length;
        const nextIndex =
          direction === 'next'
            ? (post.currentImageIndex + 1) % total
            : (post.currentImageIndex - 1 + total) % total;
        return { ...post, currentImageIndex: nextIndex };
      }),
    );
  };

  if (isError) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <p className="mb-2 text-red-500">Failed to load feed</p>
          <p className="text-sm text-gray-500">{error?.message}</p>
        </div>
      </div>
    );
  }

  if (isLoading && page === 1) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <IconRenderer
          type="spinner"
          size="24"
          className="animate-spin text-pink-600"
          isRaw={true}
        />
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto">
      <style>
        {`
          .scrollbar-none::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <div className="post-feed h-full">
        <h1 className="mb-4 text-center text-2xl font-bold text-pink-800">
          Sociofeed
        </h1>
        {optimisticPosts.length === 0 && !isLoading ? (
          <div className="mt-8 text-center text-gray-500">
            <p>No posts available</p>
            <p className="text-sm">Be the first to create a post!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {optimisticPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onImageChange={handleImageChange}
              />
            ))}
          </div>
        )}
        <div ref={loader} className="flex h-10 items-center justify-center">
          {isLoading ? (
            <IconRenderer
              type="spinner"
              size="20"
              className="animate-spin text-pink-600"
              isRaw={true}
            />
          ) : feedData?.hasMore === false ? (
            <div className="text-center text-sm text-gray-500">
              You're all caught up <span className="text-yellow-500">😊</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PostFeed;
