import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { formTypes } from '../../Config/FormConfig';
import Form from '../Components/Form';
import IconRenderer from '../Components/IconRenderer';
import { useUpdateProfile } from '../../Hooks/useProfile';
import { setUser } from '../../Redux/Slices/Auth.Slice';
import { toast } from 'react-toastify';

const EditProfileModal = ({
  isOpen,
  onClose,
  onSubmit,
  currentProfile,
  username,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Use the mutation hook
  const updateProfileMutation = useUpdateProfile();

  // Pre-populate form with current profile data
  useEffect(() => {
    if (currentProfile && isOpen) {
      setFormData({
        name: currentProfile.name || '',
        bio: currentProfile.bio || '',
      });
    }
  }, [currentProfile, isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setFormData({
        name: '',
        bio: '',
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const preventDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    preventDefault(e);
    setIsDragActive(true);
  };

  const handleDragOver = (e) => {
    preventDefault(e);
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    preventDefault(e);
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    preventDefault(e);
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    } else {
      toast.error('Please select a valid image file');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    } else {
      toast.error('Please select a valid image file');
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = async (formData, buttonType) => {
    console.log('EditProfileModal - handleSubmit called with:', {
      formData,
      buttonType,
    });

    // Only proceed if the save button was clicked
    if (buttonType !== 'saveProfile') {
      console.log('Not a save operation, skipping...');
      return;
    }

    try {
      // Create FormData for multipart upload
      const submitData = new FormData();

      // Add text fields - ensure they're not empty strings
      if (formData.name && formData.name.trim()) {
        submitData.append('name', formData.name.trim());
      }
      if (formData.bio && formData.bio.trim()) {
        submitData.append('bio', formData.bio.trim());
      }

      // Add avatar file if selected
      if (selectedFile) {
        submitData.append('avatar', selectedFile);
      }

      console.log('Submitting profile update...');

      // Log FormData contents for debugging
      for (let [key, value] of submitData.entries()) {
        console.log(`FormData ${key}:`, value);
      }

      // Call the mutation using mutateAsync for better error handling
      const result = await updateProfileMutation.mutateAsync(submitData);

      console.log('Profile updated successfully:', result);

      // Check if username was changed
      const updatedUser = result.user || result;
      const oldUsername = username;
      const newUsername = updatedUser.name;

      // Update Redux store with new user data
      dispatch(setUser(updatedUser));

      // Also update localStorage
      try {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Failed to update user in localStorage:', error);
      }

      toast.success('Profile updated successfully!');

      // Close modal and clear file
      setSelectedFile(null);
      onClose();

      // If username changed, navigate to new profile URL
      if (oldUsername !== newUsername) {
        console.log(
          `Username changed from ${oldUsername} to ${newUsername}, navigating...`,
        );
        navigate(`/profile/${newUsername}`, { replace: true });
      }

      // Call parent onSubmit if provided
      if (onSubmit) {
        onSubmit({ ...formData, avatar: selectedFile });
      }
    } catch (error) {
      console.error('Error updating profile:', error);

      // Extract error message
      let errorMessage = 'Failed to update profile';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
  };

  return (
    <div className="bg-blur bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 transition-colors hover:text-black"
          disabled={updateProfileMutation.isPending}
        >
          <IconRenderer type="close" isRaw={true} className="h-5 w-5" />
        </button>

        <h2 className="mb-4 text-center text-lg font-semibold">Edit Profile</h2>

        {/* Avatar Upload Section */}
        <div
          className={`relative mb-6 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors ${
            isDragActive ? 'border-gray-500 bg-gray-100' : 'border-gray-300'
          }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="avatar-upload"
            disabled={updateProfileMutation.isPending}
          />
          <label
            htmlFor="avatar-upload"
            className="flex cursor-pointer flex-col items-center"
          >
            <IconRenderer
              type="cloudUpload"
              isRaw={true}
              className="mb-2 h-8 w-8 text-gray-400"
            />
            <span className="text-center text-sm text-gray-600">
              {selectedFile
                ? `Selected: ${selectedFile.name}`
                : 'Drag and drop an image or click to upload'}
            </span>
          </label>
          {selectedFile && (
            <button
              onClick={handleClearFile}
              className="absolute top-2 right-2 text-gray-500 transition-colors hover:text-black"
              type="button"
              disabled={updateProfileMutation.isPending}
            >
              <IconRenderer type="close" isRaw={true} className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Form Section */}
        <Form
          formType={formTypes.EDIT_PROFILE}
          onSubmit={handleSubmit}
          defaultValues={formData}
        />

        {/* Loading Overlay */}
        {updateProfileMutation.isPending && (
          <div className="bg-opacity-75 absolute inset-0 flex items-center justify-center rounded-xl bg-white">
            <div className="text-center">
              <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-pink-500"></div>
              <p className="text-sm text-gray-600">Updating profile...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(EditProfileModal);
