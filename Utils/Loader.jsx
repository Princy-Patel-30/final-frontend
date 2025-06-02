// src/components/common/Loader.jsx
import { FaSpinner } from 'react-icons/fa';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const Loader = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'text-pink-400 w-2 h-2',
    medium: 'text-pink-500 w-4 h-4',
    large: 'text-pink-600 w-8 h-8',
  };

  return (
    <div className="flex items-center justify-center p-10">
      <FaSpinner
        className={clsx('animate-spin', sizeClasses[size])}
        aria-label="Loading"
      />
    </div>
  );
};

Loader.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default Loader;
