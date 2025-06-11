import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import IconRenderer from '../Components/IconRenderer';
import RichTextEditor from '../Components/RichTextEditor';
import Crop from '../Components/Crop';
import { useCreatePost } from '../../Hooks/usePost';
import {
  validatePostContent,
  validateMediaFiles,
  buildPostFormData,
  formatErrorMessage,
  formatFileSize,
  isImageFile,
  POST_CONSTANTS,
} from '../../Validations/posthelper';
import Button from '../Components/Button';

const CreatePost = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [cropImage, setCropImage] = useState(null);
  const [cropIndex, setCropIndex] = useState(null);
  const [uploadingImages, setUploadingImages] = useState({});
  const [validationErrors, setValidationErrors] = useState([]);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      content: '<p></p>',
    },
  });

  const createPostMutation = useCreatePost();
  const content = watch('content');

  const hasContent =
    content && content.replace(/<[^>]+>/g, '').trim().length > 0;
  const isValid = hasContent || selectedImages.length > 0;

  // Process selected files with validation
  const processFiles = (files) => {
    // Clear previous validation errors
    setValidationErrors([]);

    // Check if adding these files would exceed the limit
    if (selectedImages.length + files.length > POST_CONSTANTS.MAX_MEDIA_FILES) {
      setValidationErrors([
        `You can upload a maximum of ${POST_CONSTANTS.MAX_MEDIA_FILES} files.`,
      ]);
      return;
    }

    // Validate the files
    const validation = validateMediaFiles(files);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    files.forEach((file, index) => {
      if (isImageFile(file)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage = {
            id: Date.now() + index,
            file: file,
            preview: e.target.result,
            originalFile: file,
            size: file.size,
            name: file.name,
          };
          setSelectedImages((prev) => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // React Dropzone configuration
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/gif': ['.gif'],
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm'],
    },
    maxFiles: POST_CONSTANTS.MAX_MEDIA_FILES,
    maxSize: POST_CONSTANTS.MAX_FILE_SIZE,
    multiple: true,
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles
          .map((rejection) => {
            const { file, errors } = rejection;
            return errors.map((err) => {
              if (err.code === 'file-too-large') {
                return `${file.name} is too large (max ${formatFileSize(POST_CONSTANTS.MAX_FILE_SIZE)})`;
              }
              if (err.code === 'file-invalid-type') {
                return `${file.name} has an invalid file type`;
              }
              return err.message;
            });
          })
          .flat();
        setValidationErrors(errors);
        return;
      }
      processFiles(acceptedFiles);
    },
    onDropRejected: (rejectedFiles) => {
      const errors = rejectedFiles
        .map((rejection) => {
          const { file, errors } = rejection;
          return errors.map((err) => {
            if (err.code === 'file-too-large') {
              return `${file.name} exceeds ${formatFileSize(POST_CONSTANTS.MAX_FILE_SIZE)} limit`;
            }
            if (err.code === 'file-invalid-type') {
              return `${file.name} has unsupported format`;
            }
            if (err.code === 'too-many-files') {
              return `Maximum ${POST_CONSTANTS.MAX_MEDIA_FILES} files allowed`;
            }
            return err.message;
          });
        })
        .flat();
      setValidationErrors(errors);
    },
  });

  // Dynamic styling for dropzone
  const getDropzoneStyle = () => {
    let baseClasses =
      'p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all duration-200 ';

    if (isDragActive) {
      if (isDragAccept) {
        baseClasses += 'border-green-500 bg-green-50';
      } else if (isDragReject) {
        baseClasses += 'border-red-500 bg-red-50';
      } else {
        baseClasses += 'border-blue-500 bg-blue-50';
      }
    } else {
      baseClasses += 'border-gray-300 hover:border-blue-500 hover:bg-gray-50';
    }

    return baseClasses;
  };

  const removeImage = (imageId) => {
    setSelectedImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const openCropper = (image, index) => {
    setCropImage(image.preview);
    setCropIndex(index);
  };

  const handleCropSave = (croppedBlob) => {
    if (cropIndex !== null) {
      const file = new File([croppedBlob], `cropped-${Date.now()}.jpg`, {
        type: 'image/jpeg',
      });
      const previewUrl = URL.createObjectURL(croppedBlob);
      setSelectedImages((prev) => {
        const updated = [...prev];
        updated[cropIndex] = {
          ...updated[cropIndex],
          file: file,
          preview: previewUrl,
        };
        return updated;
      });
    }
    setCropImage(null);
    setCropIndex(null);
  };

  const handleCropCancel = () => {
    setCropImage(null);
    setCropIndex(null);
  };

  const onSubmit = async (data) => {
    if (!isValid) return;

    // Clear previous validation errors
    setValidationErrors([]);

    try {
      // Validate content and media files
      const contentValidation = validatePostContent(
        data.content,
        selectedImages.map((img) => img.file),
      );
      if (!contentValidation.isValid) {
        setValidationErrors(contentValidation.errors);
        return;
      }

      const mediaValidation = validateMediaFiles(
        selectedImages.map((img) => img.file),
      );
      if (!mediaValidation.isValid) {
        setValidationErrors(mediaValidation.errors);
        return;
      }

      // Use the helper function to build form data
      const formData = buildPostFormData(
        hasContent ? data.content : '',
        selectedImages.map((img) => img.file),
      );

      await createPostMutation.mutateAsync(formData);
      reset();
      setSelectedImages([]);
      setValidationErrors([]);
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      setValidationErrors([errorMessage]);
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-lg">
      <h1 className="mb-6 text-center text-2xl font-bold text-pink-800">
        Create New Post
      </h1>

      <div className="space-y-6">
        {validationErrors.length > 0 && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="mb-2 flex items-center">
              <IconRenderer
                type="notification"
                isRaw
                className="mr-2 h-5 w-5 text-red-500"
              />
              <h3 className="text-sm font-medium text-red-800">
                {validationErrors.length === 1 ? 'Error' : 'Errors'}
              </h3>
            </div>
            <ul className="space-y-1 text-sm text-red-700">
              {validationErrors.map((error, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Drag & Drop Upload Section */}
        <div {...getRootProps()} className={getDropzoneStyle()}>
          <input {...getInputProps()} />

          {selectedImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {selectedImages.map((image, index) => (
                <div key={image.id} className="group relative">
                  <img
                    src={image.preview}
                    alt={`Preview ${index + 1}`}
                    className="h-32 w-full rounded object-cover"
                  />
                  <div className="bg-opacity-60 absolute bottom-2 left-2 rounded bg-black px-2 py-1 text-xs text-white">
                    {formatFileSize(image.size)}
                  </div>
                  <div className="absolute top-2 right-2 space-y-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openCropper(image, index);
                      }}
                      className="rounded-full bg-white p-1 shadow transition-colors hover:bg-gray-100"
                    >
                      <IconRenderer type="edit" isRaw className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(image.id);
                      }}
                      className="rounded-full bg-white p-1 shadow transition-colors hover:bg-gray-100"
                    >
                      <IconRenderer
                        type="close"
                        isRaw
                        className="h-4 w-4 text-red-500"
                      />
                    </button>
                  </div>
                  {uploadingImages[image.id] && (
                    <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center rounded bg-black">
                      <IconRenderer
                        type="spinner"
                        isRaw
                        className="h-6 w-6 animate-spin text-white"
                      />
                    </div>
                  )}
                </div>
              ))}
              {selectedImages.length < POST_CONSTANTS.MAX_MEDIA_FILES && (
                <div className="flex h-32 items-center justify-center rounded border border-dashed border-gray-300">
                  <div className="text-center">
                    <IconRenderer
                      type="upload"
                      isRaw
                      className="mx-auto mb-2 h-8 w-8 text-gray-400"
                    />
                    <p className="text-sm text-gray-500">Add more</p>
                    <p className="text-xs text-gray-400">
                      {POST_CONSTANTS.MAX_MEDIA_FILES - selectedImages.length}{' '}
                      remaining
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              {isDragActive ? (
                <>
                  <IconRenderer
                    type="upload"
                    isRaw
                    className="mx-auto mb-2 h-12 w-12 text-blue-500"
                  />
                  {isDragAccept ? (
                    <p className="font-medium text-green-600">
                      Drop your images here
                    </p>
                  ) : isDragReject ? (
                    <p className="font-medium text-red-600">
                      Invalid file type
                    </p>
                  ) : (
                    <p className="font-medium text-blue-600">
                      Drop your images here
                    </p>
                  )}
                </>
              ) : (
                <>
                  <IconRenderer
                    type="cloudUpload"
                    isRaw
                    className="mx-auto mb-2 h-12 w-12 text-gray-400"
                  />
                  <p className="font-medium text-gray-600">
                    Drag & drop images here, or click to select
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Up to 4 images • PNG, JPG, GIF, WebP
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Rich Text Editor */}
        <div className="space-y-2">
          <RichTextEditor
            name="content"
            control={control}
            placeholder="write comment for this post!"
            rules={{
              validate: (value) => {
                const validation = validatePostContent(
                  value,
                  selectedImages.map((img) => img.file),
                );
                if (!validation.isValid) {
                  return validation.errors[0];
                }
                return true;
              },
            }}
          />
          {errors.content && (
            <p className="text-sm text-red-500">{errors.content.message}</p>
          )}
        </div>

        {/* Post Button */}
        <div className="flex justify-end border-t border-gray-200 pt-4">
          <Button
            type="createpost"
            text={
              createPostMutation.isPending ? (
                <>
                  <IconRenderer
                    type="spinner"
                    isRaw
                    className="mr-2 h-4 w-4 animate-spin text-white"
                  />
                  Creating Post...
                </>
              ) : (
                'Create Post'
              )
            }
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid || createPostMutation.isPending}
          />
        </div>
      </div>

      {/* Crop Modal */}
      {cropImage && (
        <Crop
          image={cropImage}
          onSave={handleCropSave}
          onCancel={handleCropCancel}
          aspectRatio={1}
        />
      )}
    </div>
  );
};

export default CreatePost;
