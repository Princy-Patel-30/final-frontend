import { useEffect } from 'react';
import IconRenderer from '../Components/IconRenderer';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonClass = 'bg-red-600 hover:bg-red-700',
  isLoading = false,
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative mx-4 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl p-2 transition-colors hover:bg-gray-100 disabled:opacity-50"
          >
            <IconRenderer
              type="close"
              size="20"
              className="text-gray-500"
              isRaw={true}
            />
          </button>
        </div>
        <div className="p-6">
          <p className="mb-8 leading-relaxed text-gray-700">{message}</p>
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="rounded-xl bg-gray-100 px-6 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex items-center space-x-2 rounded-xl px-6 py-2.5 font-medium text-white transition-colors ${confirmButtonClass} disabled:opacity-50`}
            >
              {isLoading && (
                <IconRenderer
                  type="spinner"
                  size="16"
                  className="animate-spin"
                  isRaw={true}
                />
              )}
              <span>{confirmText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
