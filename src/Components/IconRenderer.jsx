import { useState } from 'react';
import { IconConfig } from '../../Config/IconConfig';

const IconRenderer = ({
  type,
  text,
  textPosition = 'right',
  onClick,
  className: additionalClassName,
  isActive = false,
  isRaw = false,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!IconConfig[type]) {
    console.error(`Icon type "${type}" not found in IconConfig`);
    return null;
  }

  const { icon: BaseIcon, filledIcon, color, hover } = IconConfig[type];
  const IconComponent = isHovered && filledIcon ? filledIcon : BaseIcon;

  const baseClassName = `${color} ${hover}`;
  const iconClassName = `${baseClassName} ${additionalClassName || ''}`.trim();

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  if (isRaw) {
    // No wrapper, return only the icon component
    return (
      <IconComponent
        className={iconClassName}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      />
    );
  }

  const textElement = text && <span className="text-base">{text}</span>;
  const iconElement = (
    <IconComponent
      className={`${iconClassName} ${onClick ? 'cursor-pointer' : ''}`}
      {...props}
    />
  );

  const isColumn = textPosition === 'top' || textPosition === 'bottom';
  const flexDirection = isColumn ? 'flex-col' : 'flex-row';
  const childrenOrder =
    textPosition === 'left' || textPosition === 'top'
      ? [textElement, iconElement]
      : [iconElement, textElement];

  return (
    <div
      className={`flex ${flexDirection} w-full items-center gap-6 rounded-lg px-3 py-2 ${onClick ? 'cursor-pointer' : ''} ${isActive ? 'bg-gray-200' : 'hover:bg-gray-100'} `}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {childrenOrder.map((child, idx) =>
        child ? <span key={idx}>{child}</span> : null,
      )}
    </div>
  );
};

export default IconRenderer;
