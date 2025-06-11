import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import PostCard from './PostCard';
import IconRenderer from './IconRenderer';
import { transformPost } from '../../Utils/PostUtils';
import { useSavedPosts } from '../../Hooks/usePost';

const SavedPosts = () => {
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState([]);
  const loader = useRef(null);

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const {
    data: savedPostsData,
    isLoading,
    error,
    isError,
  } = useSavedPosts(page);

  useEffect(() => {
    if (savedPostsData?.posts) {
      const transformedPosts = savedPostsData.posts.map(transformPost);
      if (page === 1) {
        setAllPosts(transformedPosts);
      } else {
        setAllPosts((prev) => [...prev, ...transformedPosts]);
      }
    }
  }, [savedPostsData, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoading &&
          savedPostsData?.hasMore
        ) {
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
  }, [isLoading, savedPostsData?.hasMore]);

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

  if (!isAuthenticated || !user) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">
            Please log in to view your saved posts
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <p className="mb-2 text-red-500">Failed to load saved posts</p>
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
          Saved Posts
        </h1>
        {allPosts.length === 0 && !isLoading ? (
          <div className="mt-8 text-center text-gray-500">
            <p>No saved posts</p>
            <p className="text-sm">Save posts to view them here!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {allPosts.map((post) => (
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
          ) : savedPostsData?.hasMore === false ? (
            <div className="text-center text-sm text-gray-500">
              No more saved posts <span className="text-yellow-500">😊</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SavedPosts;
