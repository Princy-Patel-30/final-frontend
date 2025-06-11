import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IconRenderer from './IconRenderer';
import { useSavePost, useToggleLike, useAddComment } from '../../Hooks/usePost';
import {
  formatTimeAgo,
  generateContentPreview,
} from '../../Validations/posthelper';
import AvatarView from './AvatarView';
const PostCard = ({ post, onImageChange }) => {
  const navigate = useNavigate();
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentContent, setCommentContent] = useState('');

  const savePostMutation = useSavePost();
  const toggleLikeMutation = useToggleLike();
  const addCommentMutation = useAddComment();

  const handleCardClick = (e) => {
    if (
      e.target.closest('button') ||
      e.target.closest('svg') ||
      e.target.closest('textarea')
    )
      return;
    navigate(`/post/${post.id}`);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    savePostMutation.mutate(post.id);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    toggleLikeMutation.mutate({
      postId: post.id,
      isLiked: post.likedByCurrentUser,
    });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!commentContent.trim()) return;
    addCommentMutation.mutate(
      { postId: post.id, content: commentContent },
      {
        onSuccess: () => {
          setCommentContent('');
          setShowCommentInput(false);
        },
      },
    );
  };

  // const handleCommentToggle = (e) => {
  //   e.stopPropagation();
  //   setShowCommentInput((prev) => !prev);
  // };

  return (
    <div
      className="relative mx-auto mb-5 w-full max-w-full cursor-pointer overflow-hidden rounded-xl bg-white shadow-md md:max-w-md"
      onClick={handleCardClick}
    >
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <AvatarView
            src={post.avatar}
            alt={`${post.username}'s avatar`}
            className="border-pink-200 ring-gray-200 hover:border-pink-300"
          />
          <span className="text-sm font-medium text-gray-800">
            {post.username}
          </span>
        </div>
        <IconRenderer
          type="more"
          size="20"
          className="absolute top-3 right-3 text-gray-500"
          isRaw={true}
        />
      </div>

      <div className="relative h-64 w-full bg-white md:h-72">
        <img
          src={post.images[post.currentImageIndex] || '/default-post.jpg'}
          alt={`Post ${post.id}`}
          className="h-full w-full object-cover"
        />
        {post.images.length > 1 && (
          <>
            <button
              className="bg-opacity-50 hover:bg-opacity-80 absolute top-1/2 left-2 -translate-y-1/2 transform rounded-full bg-white p-1.5 transition md:p-1"
              onClick={(e) => {
                e.stopPropagation();
                onImageChange(post.id, 'prev');
              }}
            >
              <IconRenderer
                type="left"
                size="16"
                className="text-gray-700"
                isRaw={true}
              />
            </button>
            <button
              className="bg-opacity-50 hover:bg-opacity-80 absolute top-1/2 right-2 -translate-y-1/2 transform rounded-full bg-white p-1.5 transition md:p-1"
              onClick={(e) => {
                e.stopPropagation();
                onImageChange(post.id, 'next');
              }}
            >
              <IconRenderer
                type="right"
                size="16"
                className="text-gray-700"
                isRaw={true}
              />
            </button>
          </>
        )}
      </div>

      {post.content && (
        <div
          className="px-4 py-2 text-sm text-gray-800"
          dangerouslySetInnerHTML={{
            __html: generateContentPreview(post.content),
          }}
        />
      )}

      <div className="flex items-center gap-4 px-4 py-3 text-gray-700 md:gap-6">
        <button className="flex items-center gap-1" onClick={handleLike}>
          <IconRenderer
            type={post.likedByCurrentUser ? 'liked' : 'like'}
            size="22"
            className="text-pink-600"
            isRaw={true}
          />
          <span className="text-xs md:text-sm">{post.likes}</span>
        </button>
        <button
          className="flex items-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/post/${post.id}`);
          }}
        >
          <IconRenderer
            type="comment"
            size="22"
            className="text-pink-600"
            isRaw={true}
          />
          <span className="text-xs md:text-sm">{post.comments}</span>
        </button>
        <button className="ml-auto" onClick={handleSave}>
          <IconRenderer
            type="bookmark"
            size="22"
            className="text-pink-600"
            isRaw={true}
          />
        </button>
      </div>

      {showCommentInput && (
        <div className="px-4 pb-3">
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Add a comment..."
              className="flex-1 resize-none rounded border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
              rows="2"
              maxLength={500}
            />
            <button
              type="submit"
              disabled={!commentContent.trim() || addCommentMutation.isLoading}
              className="rounded bg-pink-600 px-3 py-1 text-xs text-white hover:bg-pink-700 disabled:opacity-50"
            >
              Post
            </button>
          </form>
        </div>
      )}

      <div className="px-4 pb-3 text-xs text-gray-500">
        {formatTimeAgo(new Date(post.createdAt))}
      </div>
    </div>
  );
};

export default PostCard;
