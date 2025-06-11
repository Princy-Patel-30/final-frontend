import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useUserPosts } from '../../Hooks/usePost';
import PostCard from './PostCard';
import IconRenderer from './IconRenderer';
import { transformPost } from '../../Utils/PostUtils';

const PostGrid = ({ userId: propUserId }) => {
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState([]);
  const loader = useRef(null);

  const { id: paramUserId } = useParams();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Use the userId from props, URL params, or fallback to logged-in user
  const userId = propUserId || paramUserId || user?.id;

  const {
    data: userPostsData,
    isLoading,
    error,
    isError,
  } = useUserPosts(userId, page);

  // Reset posts when userId changes
  useEffect(() => {
    setPage(1);
    setAllPosts([]);
  }, [userId]);

  useEffect(() => {
    if (userPostsData?.posts) {
      const transformedPosts = userPostsData.posts.map(transformPost);
      if (page === 1) {
        setAllPosts(transformedPosts);
      } else {
        setAllPosts((prev) => [...prev, ...transformedPosts]);
      }
    }
  }, [userPostsData, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && userPostsData?.hasMore) {
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
  }, [isLoading, userPostsData?.hasMore]);

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
      <div className="rounded-lg bg-white p-4 shadow">
        <div className="py-8 text-center">
          <p className="text-gray-500">Please log in to view posts</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-white p-4 shadow">
        <div className="py-8 text-center">
          <p className="mb-2 text-red-500">Failed to load posts</p>
          <p className="text-sm text-gray-400">{error?.message}</p>
        </div>
      </div>
    );
  }

  if (isLoading && page === 1) {
    return (
      <div className="rounded-lg bg-white p-4 shadow">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="aspect-square w-full animate-pulse rounded-md bg-pink-200"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      {allPosts.length === 0 && !isLoading ? (
        <div className="py-8 text-center">
          <div className="mb-4">
            <IconRenderer
              type="more"
              size="48"
              className="mx-auto text-gray-300"
              isRaw={true}
            />
          </div>
          <p className="mb-1 text-gray-500">No posts yet</p>
          <p className="text-sm text-gray-400">
            {userId === user?.id
              ? 'Create your first post to get started!'
              : "This user hasn't posted anything yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {allPosts.map((post) => (
            <div key={post.id} className="w-full">
              <PostCard post={post} onImageChange={handleImageChange} />
            </div>
          ))}
        </div>
      )}
      <div ref={loader} className="mt-4 flex justify-center">
        {isLoading ? (
          <IconRenderer
            type="spinner"
            size="20"
            className="animate-spin text-pink-600"
            isRaw={true}
          />
        ) : userPostsData?.hasMore === false && allPosts.length > 0 ? (
          <p className="text-sm text-gray-400">All posts loaded</p>
        ) : null}
      </div>
    </div>
  );
};

export default PostGrid;
