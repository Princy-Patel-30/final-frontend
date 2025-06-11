import { useState } from 'react';
import IconRenderer from './IconRenderer';
import ConfirmModal from '../Modals/ConfirmModal';
import { useEditComment, useDeleteComment } from '../../Hooks/usePost';
import { formatTimeAgo } from '../../Validations/posthelper';
import AvatarView from './AvatarView';

const CommentItem = ({ comment, currentUserId, postId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content || '');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const editCommentMutation = useEditComment();
  const deleteCommentMutation = useDeleteComment();

  const isOwnComment = currentUserId && comment.userId === currentUserId;

  const handleEdit = (e) => {
    e.preventDefault();
    if (!editContent.trim() || editContent === comment.content) {
      setIsEditing(false);
      setEditContent(comment.content);
      return;
    }
    setShowEditModal(true);
  };

  const confirmEdit = () => {
    editCommentMutation.mutate(
      { commentId: comment.id, content: editContent.trim() },
      {
        onSuccess: () => {
          setIsEditing(false);
          setShowEditModal(false);
        },
      },
    );
  };

  const confirmDelete = () => {
    deleteCommentMutation.mutate(comment.id, {
      onSuccess: () => {
        setShowDeleteModal(false);
      },
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEdit(e);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <>
      <div className="border-b border-pink-100 bg-white p-4 transition-colors duration-200">
        <div className="flex gap-3">
          <AvatarView
            src={comment.avatar}
            size="sm"
            alt={`${comment.username}'s avatar`}
            className="border-gray-200 ring-gray-200 hover:border-gray-300"
          />
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-semibold text-gray-800">
                  {comment.username}
                </span>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-pink-500">
                  {formatTimeAgo(new Date(comment.createdAt))}
                </span>
                {comment.isEdited && (
                  <span className="rounded-full bg-pink-50 px-2 py-0.5 text-xs text-pink-400">
                    edited
                  </span>
                )}
              </div>
              {isOwnComment && (
                <div className="relative">
                  <button
                    onClick={() => setShowOptions((prev) => !prev)}
                    className="rounded-full p-1 transition-colors duration-150 hover:bg-pink-100"
                  >
                    <IconRenderer
                      type="more"
                      size="20"
                      className="text-pink-400 hover:text-pink-500"
                      isRaw={true}
                    />
                  </button>
                  {showOptions && (
                    <div className="absolute top-full right-0 z-20 mt-1 min-w-[100px] rounded-lg border border-gray-200 bg-white py-1 shadow-md">
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setShowOptions(false);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-1 text-left text-sm text-gray-700 transition-colors duration-150 hover:bg-pink-50"
                      >
                        <IconRenderer
                          type="edit"
                          size="14"
                          className="text-gray-600"
                          isRaw={true}
                        />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteModal(true);
                          setShowOptions(false);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-1 text-left text-sm text-red-600 transition-colors duration-150 hover:bg-red-50"
                      >
                        <IconRenderer
                          type="delete"
                          size="14"
                          className="text-red-600"
                          isRaw={true}
                        />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 transition-all duration-150 focus:border-pink-300 focus:ring-2 focus:ring-pink-300 focus:outline-none"
                  rows="2"
                  maxLength={500}
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleEdit}
                    disabled={
                      !editContent.trim() || editCommentMutation.isLoading
                    }
                    className="rounded-lg bg-pink-500 px-3 py-1 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:bg-pink-600 disabled:opacity-50"
                  >
                    {editCommentMutation.isLoading ? (
                      <div className="flex items-center gap-1">
                        <IconRenderer
                          type="spinner"
                          size="14"
                          className="animate-spin text-white"
                          isRaw={true}
                        />
                        <span>Saving</span>
                      </div>
                    ) : (
                      'Save'
                    )}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 text-sm font-medium text-pink-600 transition-colors duration-150 hover:text-pink-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-sm leading-relaxed break-words text-gray-800">
                  {comment.content}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showOptions && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowOptions(false)}
        />
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Comment"
        message="Are you sure you want to delete this comment?"
        confirmText="Delete"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isLoading={deleteCommentMutation.isLoading}
      />

      <ConfirmModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditContent(comment.content);
        }}
        onConfirm={confirmEdit}
        title="Confirm Edit"
        message="Are you sure you want to save changes to this comment?"
        confirmText="Save"
        confirmButtonClass="bg-pink-500 hover:bg-pink-600"
        isLoading={editCommentMutation.isLoading}
      />
    </>
  );
};

export default CommentItem;
