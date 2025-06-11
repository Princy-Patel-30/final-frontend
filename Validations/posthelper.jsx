import DOMPurify from 'dompurify';

// Centralized sanitization configuration for DOMPurify
const SANITIZE_CONFIG = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
  ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
};

// Helper function for generating a sanitized content preview
export const generateContentPreview = (content, maxLength = 150) => {
  if (!content) return '';

  // Extract plain text for length check
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  const plainText = tempDiv.textContent || tempDiv.innerText || '';

  // If content is within limit, sanitize and return
  if (plainText.length <= maxLength) {
    return DOMPurify.sanitize(content, SANITIZE_CONFIG);
  }

  // Truncate plain text and sanitize
  const truncatedText = plainText.substring(0, maxLength).trim() + '...';
  return DOMPurify.sanitize(truncatedText, SANITIZE_CONFIG);
};

// Helper function for rendering full sanitized content
export const renderFullContent = (content) => {
  if (!content) return '';
  return DOMPurify.sanitize(content, SANITIZE_CONFIG);
};

// Post content validation
export const validatePostContent = (content, mediaFiles = []) => {
  const errors = [];

  if (!content && (!mediaFiles || mediaFiles.length === 0)) {
    errors.push('Post must have content or media');
  }

  if (content && content.trim().length > 2000) {
    errors.push('Content must be less than 2000 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Comment content validation
export const validateCommentContent = (content) => {
  const errors = [];

  if (!content || content.trim().length === 0) {
    errors.push('Comment content is required');
  }

  if (content && content.trim().length > 500) {
    errors.push('Comment must be less than 500 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Media files validation
export const validateMediaFiles = (files) => {
  const errors = [];
  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/webm',
  ];

  if (files && files.length > 4) {
    errors.push('Maximum 4 files allowed');
  }

  files?.forEach((file, index) => {
    if (file.size > maxFileSize) {
      errors.push(`File ${index + 1} exceeds 10MB limit`);
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push(`File ${index + 1} has unsupported format`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// File type checking utilities
export const isImageFile = (file) => {
  return file.type.startsWith('image/');
};

export const isVideoFile = (file) => {
  return file.type.startsWith('video/');
};

// File size formatter
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Content sanitization (for text cleanup, not HTML sanitization)
export const sanitizeContent = (content) => {
  if (!content) return '';

  return content
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\n{3,}/g, '\n\n');
};

// Form data builder for post creation
export const buildPostFormData = (content, mediaFiles = []) => {
  const formData = new FormData();

  if (content) {
    formData.append('content', sanitizeContent(content));
  }

  mediaFiles.forEach((file) => {
    formData.append('media', file);
  });

  return formData;
};

// Error message formatter
export const formatErrorMessage = (error) => {
  if (typeof error === 'string') return error;

  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  if (error?.message) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

// Batch operation result processor
export const processBatchResults = (results, operations) => {
  const successful = [];
  const failed = [];

  results.forEach((result, index) => {
    const operation = operations[index];

    if (result.status === 'fulfilled') {
      successful.push({
        ...operation,
        data: result.value,
      });
    } else {
      failed.push({
        ...operation,
        error: formatErrorMessage(result.reason),
      });
    }
  });

  return {
    successful,
    failed,
    totalCount: results.length,
    successCount: successful.length,
    failureCount: failed.length,
  };
};

// URL validation for media
export const isValidMediaUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

// Time formatting utilities
export const formatTimeAgo = (date) => {
  const now = new Date();
  const postDate = new Date(date);
  const diffInMs = now - postDate;
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return postDate.toLocaleDateString();
};

// Media type detection
export const getMediaType = (file) => {
  if (isImageFile(file)) return 'IMAGE';
  if (isVideoFile(file)) return 'VIDEO';
  return 'UNKNOWN';
};

// Pagination helpers
export const calculatePagination = (
  currentPage,
  totalItems,
  itemsPerPage = 10,
) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage,
    hasPrevPage,
    startIndex: (currentPage - 1) * itemsPerPage,
    endIndex: Math.min(currentPage * itemsPerPage - 1, totalItems - 1),
  };
};

export const POST_CONSTANTS = {
  MAX_CONTENT_LENGTH: 2000,
  MAX_COMMENT_LENGTH: 500,
  MAX_MEDIA_FILES: 4,
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  DEFAULT_PAGE_SIZE: 10,
};

export const MEDIA_TYPES = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
};

export const ALLOWED_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/gif'],
  VIDEOS: ['video/mp4', 'video/webm'],
};

export default {
  validatePostContent,
  validateCommentContent,
  validateMediaFiles,
  isImageFile,
  isVideoFile,
  formatFileSize,
  sanitizeContent,
  buildPostFormData,
  formatErrorMessage,
  processBatchResults,
  isValidMediaUrl,
  formatTimeAgo,
  generateContentPreview,
  renderFullContent,
  getMediaType,
  calculatePagination,
  POST_CONSTANTS,
  MEDIA_TYPES,
  ALLOWED_FILE_TYPES,
};
