import IconRenderer from './IconRenderer';

// Define a mapping for string sizes to pixel values
const sizeMap = {
  xs: 32,
  sm: 40,
  md: 48,
  lg: 64,
  xl: 80,
  '2xl': 96,
};

const AvatarView = ({
  src,
  size = 'md',
  className = '',
  alt = 'User Avatar',
}) => {
  // Convert size to a number: use sizeMap for strings, or the number directly, default to 48
  const pixelSize = sizeMap[size] || (typeof size === 'number' ? size : 48);
  const imageSize = `${pixelSize}px`;

  // // Calculate icon size as a percentage of avatar size for consistency
  // const iconSize = Math.max(pixelSize * 0.6, 20);

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-full border border-gray-600 bg-white shadow-sm ring-2 ring-gray-600 ${className}`}
      style={{ width: imageSize, height: imageSize }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="absolute h-full w-full object-cover"
          onError={(e) => {
            console.log('Error loading avatar image');
            // Hide broken image and show fallback
            e.target.style.display = 'none';
            const fallback =
              e.target.parentElement.querySelector('.avatar-fallback');
            if (fallback) fallback.style.display = 'flex';
          }}
        />
      ) : null}

      {/* Fallback icon - always rendered but hidden when image loads successfully */}
      <div
        className={`avatar-fallback absolute inset-0 flex items-center justify-center ${src ? 'hidden' : 'flex'}`}
      >
        <IconRenderer
          type="profile"
          isRaw
          className="h-11 w-11 text-gray-400"
        />
      </div>
    </div>
  );
};

export default AvatarView;
