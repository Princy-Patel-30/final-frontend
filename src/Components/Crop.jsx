import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import IconRenderer from './IconRenderer';

const Crop = ({ image, onSave, onCancel, aspectRatio = 1 }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    canvas.width = safeArea;
    canvas.height = safeArea;

    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-safeArea / 2, -safeArea / 2);

    ctx.drawImage(
      image,
      safeArea / 2 - image.width * 0.5,
      safeArea / 2 - image.height * 0.5,
    );

    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.putImageData(
      data,
      Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
      Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y),
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        'image/jpeg',
        0.9,
      );
    });
  };

  const handleSave = async () => {
    if (!croppedAreaPixels) return;

    try {
      const croppedImage = await getCroppedImg(
        image,
        croppedAreaPixels,
        rotation,
      );
      onSave(croppedImage);
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  return (
    <div className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="mx-4 flex max-h-[90vh] w-full max-w-4xl flex-col rounded-lg bg-white">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold">Crop Image</h3>
          <button
            onClick={onCancel}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
          >
            <IconRenderer type="close" isRaw className="h-5 w-5" />
          </button>
        </div>

        {/* Cropper Area */}
        <div className="relative min-h-[400px] flex-1 bg-gray-900">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
          />
        </div>

        {/* Controls */}
        <div className="space-y-4 border-t bg-gray-50 p-4">
          {/* Zoom Control */}
          <div className="flex items-center space-x-3">
            <label className="w-16 text-sm font-medium text-gray-700">
              Zoom:
            </label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1"
            />
            <span className="w-12 text-sm text-gray-600">
              {zoom.toFixed(1)}x
            </span>
          </div>

          {/* Rotation Control */}
          <div className="flex items-center space-x-3">
            <label className="w-16 text-sm font-medium text-gray-700">
              Rotate:
            </label>
            <input
              type="range"
              value={rotation}
              min={0}
              max={360}
              step={1}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="flex-1"
            />
            <span className="w-12 text-sm text-gray-600">{rotation}°</span>
            <button
              onClick={() => setRotation(0)}
              className="rounded p-1 transition-colors hover:bg-gray-200"
              title="Reset rotation"
            >
              <IconRenderer type="back" isRaw className="h-4 w-4" />
            </button>
          </div>

          {/* Aspect Ratio Buttons */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Aspect:</span>
            <button
              onClick={() => aspectRatio !== 1 && window.location.reload()}
              className={`rounded px-3 py-1 text-sm ${
                aspectRatio === 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Square
            </button>
            <button
              onClick={() => aspectRatio !== 4 / 3 && window.location.reload()}
              className={`rounded px-3 py-1 text-sm ${
                aspectRatio === 4 / 3
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              4:3
            </button>
            <button
              onClick={() => aspectRatio !== 16 / 9 && window.location.reload()}
              className={`rounded px-3 py-1 text-sm ${
                aspectRatio === 16 / 9
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              16:9
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 border-t p-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 transition-colors hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600"
          >
            <IconRenderer type="success" isRaw className="h-4 w-4 text-white" />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Crop;
