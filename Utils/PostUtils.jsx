// PostUtils.jsx
const sanitizeContent = (content) => {
  if (!content || typeof content !== 'string') return '';

  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

export const transformPost = (apiPost) => {
  if (!apiPost) {
    console.warn('transformPost: apiPost is null or undefined');
    return {
      id: '',
      userId: '',
      username: 'Unknown User',
      avatar: '/default-avatar.png',
      content: '',
      images: [],
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      currentImageIndex: 0,
      likedByCurrentUser: false,
    };
  }

  let content = '';
  if (typeof apiPost.content === 'string') {
    content = sanitizeContent(apiPost.content);
  } else if (apiPost.content) {
    console.warn('Non-string content detected:', apiPost.content);
    content = JSON.stringify(apiPost.content);
  } else {
    console.warn('Content is missing in apiPost:', apiPost);
  }

  return {
    id: apiPost.id || '',
    userId: apiPost.userId || apiPost.user?.id || '',
    username: apiPost.user?.name || apiPost.username || 'Unknown User',
    avatar: apiPost.user?.avatarUrl || apiPost.avatar || '/default-avatar.png',
    content,
    images: apiPost.media?.map((media) => media.url).filter(Boolean) || [],
    createdAt: apiPost.createdAt || new Date().toISOString(),
    likes: apiPost._count?.likes || apiPost.likes || 0,
    comments: apiPost._count?.comments || apiPost.comments || 0,
    currentImageIndex: 0,
    likedByCurrentUser: apiPost.likedByCurrentUser || false,
  };
};

// New function to transform comments
export const transformComment = (apiComment) => {
  if (!apiComment) {
    console.warn('transformComment: apiComment is null or undefined');
    return {
      id: '',
      userId: '',
      username: 'Unknown User',
      avatar: '/default-avatar.png',
      content: '',
      createdAt: new Date().toISOString(),
      likes: 0,
      isEdited: false,
    };
  }

  return {
    id: apiComment.id || '',
    userId: apiComment.userId || apiComment.user?.id || '',
    username: apiComment.user?.name || apiComment.username || 'Unknown User',
    avatar:
      apiComment.user?.avatarUrl || apiComment.avatar || '/default-avatar.png',
    content:
      typeof apiComment.content === 'string'
        ? sanitizeContent(apiComment.content)
        : '',
    createdAt: apiComment.createdAt || new Date().toISOString(),
    likes: apiComment._count?.likes || apiComment.likes || 0,
    isEdited: apiComment.isEdited || false,
  };
};
