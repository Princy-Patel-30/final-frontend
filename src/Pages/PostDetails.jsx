import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import IconRenderer from '../Components/IconRenderer';
import CommentSection from '../Components/CommentSection';
import { transformPost } from '../../Utils/PostUtils';
import {
  usePostDetails,
  useToggleLike,
  useSavePost,
} from '../../Hooks/usePost';
import {
  formatTimeAgo,
  generateContentPreview,
  renderFullContent,
} from '../../Validations/posthelper';
import AvatarView from '../Components/AvatarView';
const PostDetails = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullContent, setShowFullContent] = useState(false);

  const commentRef = useRef(null);

  const { user } = useSelector((state) => state.auth);

  const { data: postData, isLoading, error, isError } = usePostDetails(postId);
  const toggleLikeMutation = useToggleLike();
  const savePostMutation = useSavePost();

  const post = postData ? transformPost(postData) : null;

  const handleImageChange = (direction) => {
    if (!post?.images?.length) return;

    const total = post.images.length;
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % total);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + total) % total);
    }
  };

  const handleLike = () => {
    if (!post) return;
    toggleLikeMutation.mutate({
      postId: post.id,
      isLiked: post.likedByCurrentUser,
    });
  };

  const handleSave = () => {
    if (!post) return;
    savePostMutation.mutate(post.id);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleScrollToComments = () => {
    commentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [postId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="space-y-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg">
            <IconRenderer
              type="spinner"
              size="24"
              className="animate-spin text-blue-600"
              isRaw={true}
            />
          </div>
          <p className="font-medium text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
            <IconRenderer
              type="more"
              size="32"
              className="text-red-500"
              isRaw={true}
            />
          </div>
          <h2 className="mb-3 text-xl font-bold text-gray-900">
            Post not found
          </h2>
          <p className="mb-8 leading-relaxed text-gray-600">
            {error?.message || 'This post may have been deleted or moved.'}
          </p>
          <button
            onClick={handleBack}
            className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="rounded-xl p-2 transition-colors hover:bg-gray-100"
              >
                <IconRenderer
                  type="left"
                  size="20"
                  className="text-gray-700"
                  isRaw={true}
                />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">
                Post Details
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Post Section */}
          <div className="max-h-[calc(100vh-8rem)] overflow-y-auto lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              {/* Post Header */}
              <div className="border-b border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AvatarView
                      src={post.avatar}
                      alt={`${post.username}'s avatar`}
                      className="border-gray-200 ring-gray-200 hover:border-gray-300"
                    />
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        {post.username}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {formatTimeAgo(new Date(post.createdAt))}
                      </p>
                    </div>
                  </div>
                  <button className="rounded-xl p-2 transition-colors hover:bg-gray-100">
                    <IconRenderer
                      type="more"
                      size="20"
                      className="text-gray-500"
                      isRaw={true}
                    />
                  </button>
                </div>
              </div>

              {/* Post Images */}
              {post.images && post.images.length > 0 && (
                <div className="relative aspect-square bg-gray-900">
                  <img
                    src={post.images[currentImageIndex] || '/default-post.jpg'}
                    alt={`Post image ${currentImageIndex + 1}`}
                    className="h-full w-full object-cover"
                  />
                  {post.images.length > 1 && (
                    <>
                      <button
                        onClick={() => handleImageChange('prev')}
                        className="absolute top-1/2 left-4 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transition-all hover:bg-white"
                      >
                        <IconRenderer type="left" size="16" isRaw />
                      </button>
                      <button
                        onClick={() => handleImageChange('next')}
                        className="absolute top-1/2 right-4 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transition-all hover:bg-white"
                      >
                        <IconRenderer type="right" size="16" isRaw />
                      </button>
                      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform space-x-2">
                        {post.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`h-2.5 w-2.5 rounded-full transition-all ${
                              index === currentImageIndex
                                ? 'bg-white'
                                : 'bg-white/50 hover:bg-white/75'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Actions & Content */}
              <div className="p-6">
                {/* Action Buttons */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={handleLike}
                      className="group flex items-center space-x-2"
                      disabled={toggleLikeMutation.isLoading}
                    >
                      <div
                        className={`rounded-xl p-2 transition-all ${
                          post.likedByCurrentUser
                            ? 'bg-red-50 text-red-600'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <IconRenderer
                          type={post.likedByCurrentUser ? 'liked' : 'like'}
                          size="20"
                          isRaw
                        />
                      </div>
                      <span className="font-semibold text-gray-900">
                        {post.likes}
                      </span>
                    </button>

                    <button
                      onClick={handleScrollToComments}
                      className="group flex items-center space-x-2"
                    >
                      <div className="rounded-xl p-2 text-gray-700 transition-colors hover:bg-gray-100">
                        <IconRenderer type="comment" size="20" isRaw />
                      </div>
                      <span className="font-semibold text-gray-900">
                        {post.comments}
                      </span>
                    </button>
                  </div>

                  <button
                    onClick={handleSave}
                    className="rounded-xl p-2 text-gray-700 transition-colors hover:bg-gray-100"
                    disabled={savePostMutation.isLoading}
                  >
                    <IconRenderer type="bookmark" size="20" isRaw />
                  </button>
                </div>

                {/* Content */}
                {post.content && (
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="text-gray-900">
                      <span className="text-center font-semibold text-gray-900">
                        Caption
                      </span>{' '}
                      {showFullContent || post.content.length <= 100 ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderFullContent(post.content),
                          }}
                        />
                      ) : (
                        <>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: generateContentPreview(post.content, 100),
                            }}
                          />
                          <button
                            onClick={() => setShowFullContent(true)}
                            className="ml-2 font-medium text-blue-600 transition-colors hover:text-blue-700"
                          >
                            more
                          </button>
                        </>
                      )}
                    </div>
                    {showFullContent && post.content.length > 100 && (
                      <button
                        onClick={() => setShowFullContent(false)}
                        className="mt-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                      >
                        show less
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Comment Section */}
          <div
            className="max-h-[calc(100vh-8rem)] overflow-y-auto lg:col-span-1"
            ref={commentRef}
          >
            <div className="flex max-h-[calc(100vh-8rem)] flex-col overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
              <CommentSection postId={postId} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostDetails;
