import { useState } from 'react';
import { useSelector } from 'react-redux';
import IconRenderer from './IconRenderer';
import CommentItem from './CommentItem';
import { useAddComment, usePostComments } from '../../Hooks/usePost';
import { transformComment } from '../../Utils/PostUtils';

const CommentSection = ({ postId }) => {
  const [newComment, setNewComment] = useState('');
  const { user } = useSelector((state) => state.auth);
  const addCommentMutation = useAddComment();
  const {
    data: commentsData,
    isLoading,
    isError,
    error,
  } = usePostComments(postId);

  // Transform and sort comments by createdAt descending (most recent first)
  const transformedComments = (Array.isArray(commentsData) ? commentsData : [])
    .map(transformComment)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addCommentMutation.mutate(
      { postId, content: newComment.trim() },
      {
        onSuccess: () => {
          setNewComment('');
        },
      },
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment(e);
    }
  };

  return (
    <div className="bg-pink-50">
      {/* Header */}
      <div className="border-b border-pink-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full p-2">
            <IconRenderer
              type="comment"
              size="20"
              className="text-pink-600"
              isRaw={true}
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-600">Comments</h3>
            <p className="text-m font-medium text-pink-600">
              {transformedComments.length}{' '}
              {transformedComments.length === 1 ? 'comment' : 'comments'}
            </p>
          </div>
        </div>
      </div>

      {user && (
        <div className="border-b border-pink-100 bg-white p-6">
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="relative flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share your thoughts..."
                  className="w-full resize-none rounded-2xl border-2 border-pink-200 px-4 py-3 pr-16 text-gray-800 placeholder-pink-400 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-pink-400 focus:outline-none"
                  rows="3"
                  maxLength={500}
                  disabled={addCommentMutation.isLoading}
                />
                <button
                  type="submit"
                  disabled={!newComment.trim() || addCommentMutation.isLoading}
                  className="absolute right-3 bottom-4 rounded-full bg-pink-600 p-4 shadow-lg"
                >
                  {addCommentMutation.isLoading ? (
                    <IconRenderer
                      type="spinner"
                      size="18"
                      className="animate-spin"
                      isRaw={true}
                    />
                  ) : (
                    <IconRenderer
                      type="send"
                      className="text-white"
                      size="18"
                      isRaw={true}
                    />
                  )}
                </button>
                <div className="mt-2 flex items-center justify-between px-2">
                  <span
                    className={`text-xs font-medium ${newComment.length > 400 ? 'text-rose-500' : 'text-pink-500'}`}
                  >
                    {newComment.length}/500
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Comments List */}
      <div className="bg-white">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="mb-4 inline-block rounded-full bg-white p-4 shadow-lg">
              <IconRenderer
                type="spinner"
                size="32"
                className="animate-spin text-pink-600"
                isRaw={true}
              />
            </div>
            <p className="font-medium text-pink-600">Loading comments...</p>
          </div>
        ) : isError ? (
          <div className="p-12 text-center">
            <div className="mb-6">
              <div className="inline-flex rounded-full bg-gradient-to-br from-pink-100 to-rose-100 p-4">
                <IconRenderer
                  type="more"
                  size="48"
                  className="text-black-400"
                  isRaw={true}
                />
              </div>
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-700">
              Failed to load comments
            </h3>
            <p className="mb-4 text-sm font-medium text-pink-500">
              {error?.message || 'An error occurred while fetching comments.'}
            </p>
          </div>
        ) : transformedComments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mb-6">
              {/* <div className="inline-flex p-4 bg-pink-50 rounded-full">
                <IconRenderer type="comment" size="48" className="text-pink-600" isRaw={true} />
              </div> */}
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-700">
              No comments yet
            </h3>
            <p className="mb-4 text-sm font-medium text-pink-500">
              Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          <div className="max-h-[600px] overflow-y-auto">
            <div className="divide-y divide-pink-100 pb-16">
              {transformedComments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  currentUserId={user?.id}
                  postId={postId}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
