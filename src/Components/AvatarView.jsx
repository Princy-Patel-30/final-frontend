import IconRenderer from './IconRenderer';

// Define a mapping for string sizes to pixel values
const sizeMap = {
  sm: 50,
  md: 75,
  lg: 100,
  xl: 150,
};

const AvatarView = ({ src, size = 'md' }) => {
  // Convert size to a number: use sizeMap for strings, or the number directly, default to 100
  const pixelSize = sizeMap[size] || (typeof size === 'number' ? size : 100);
  const imageSize = `${pixelSize}px`;

  return (
    <div
      className="relative flex items-center justify-center overflow-hidden rounded-full border border-gray-600 bg-white shadow-sm ring-2 ring-gray-600"
      style={{ width: imageSize, height: imageSize }}
    >
      {src ? (
        <img
          src={src}
          alt="User Avatar"
          className="absolute h-full w-full object-cover"
          onError={() => console.log('Error loading avatar image')}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <IconRenderer
            type="profile"
            size={pixelSize * 0.6}
            isRaw
            className="h-full w-full text-gray-400"
          />
        </div>
      )}
    </div>
  );
};

export default AvatarView;
