import {
  AiOutlineHeart,
  AiFillHeart,
  AiFillHome,
  AiOutlineHome,
  AiOutlineSearch,
  AiOutlineUser,
  AiFillEdit,
  AiOutlineDelete,
  AiOutlineClockCircle,
  AiOutlineCheckCircle,
  AiOutlineArrowLeft,
  AiOutlineMail,
  AiOutlineMessage,
  AiFillMessage,
} from 'react-icons/ai';

import { LuEye, LuEyeClosed } from 'react-icons/lu';

import {
  FaUserCircle,
  FaComment,
  FaUserEdit,
  FaSignOutAlt,
  FaSignInAlt,
  FaSpinner,
  FaUpload,
  FaUserPlus,
  FaUserMinus,
  FaPlusSquare,
  FaBars,
} from 'react-icons/fa';

import {
  BsBookmark,
  BsBookmarkFill,
  BsThreeDotsVertical,
} from 'react-icons/bs';

import { FiMoreHorizontal, FiSend, FiSettings } from 'react-icons/fi';
import { IoNotificationsOutline } from 'react-icons/io5';
import {
  MdEdit,
  MdDelete,
  MdEmail,
  MdClose,
  MdCloudUpload,
} from 'react-icons/md';

export const IconConfig = {
  close: {
    icon: MdClose,
    color: 'text-gray-600',
    hover: 'hover:text-gray-800',
  },
  cloudUpload: {
    icon: MdCloudUpload,
    filledIcon: null,
    color: 'text-gray-800',
    hover: 'hover:text-gray-600',
  },
  eye: {
    icon: LuEye,
    color: 'text-grey-400',
    hover: 'hover:text-gray-800',
  },
  eyeClosed: {
    icon: LuEyeClosed,
    color: 'text-grey-400',
    hover: 'hover:text-gray-800',
  },

  like: {
    icon: AiOutlineHeart,
    filledIcon: AiFillHeart,
    color: 'text-gray-800',
    hover: 'hover:text-gray-800',
  },
  liked: {
    icon: AiFillHeart,
    filledIcon: null,
    color: 'text-red-600',
    hover: 'hover:text-red-400',
  },
  comment: {
    icon: FaComment,
    filledIcon: null,
    color: 'text-gray-800',
    hover: 'hover:text-gray-600',
  },
  bookmark: {
    icon: BsBookmark,
    filledIcon: BsBookmarkFill,
    color: 'text-gray-800',
    hover: 'hover:text-gray-800',
  },
  bookmarked: {
    icon: BsBookmarkFill,
    filledIcon: null,
    color: 'text-gray-800',
    hover: 'hover:text-gray-600',
  },
  edit: {
    icon: MdEdit,
    filledIcon: null,
    color: 'text-gray-800',
    hover: 'hover:text-gray-600',
  },
  editAlt: {
    icon: AiFillEdit,
    filledIcon: null,
    color: 'text-gray-800',
    hover: 'hover:text-gray-600',
  },
  delete: {
    icon: MdDelete,
    filledIcon: null,
    color: 'text-gray-800',
    hover: 'hover:text-gray-600',
  },
  deleteAlt: {
    icon: AiOutlineDelete,
    filledIcon: MdDelete,
    color: 'text-gray-800',
    hover: 'hover:text-gray-800',
  },
  home: {
    icon: AiOutlineHome,
    filledIcon: AiFillHome,
    color: 'text-gray-800',
    hover: 'hover:text-gray-600',
  },
  homeOutline: {
    icon: AiOutlineHome,
    filledIcon: AiFillHome,
    color: 'text-gray-800',
    hover: 'hover:text-gray-800',
  },
  profile: {
    icon: FaUserCircle,
    filledIcon: null,
    color: 'text-gray-800',
    hover: 'hover:text-gray-600',
  },
  follow: {
    icon: FaUserPlus,
    filledIcon: null,
    color: 'text-gray-800',
    hover: 'hover:text-gray-600',
  },
  unfollow: {
    icon: FaUserMinus,
    filledIcon: null,
    color: 'text-gray-800',
    hover: 'hover:text-gray-600',
  },
  logout: {
    icon: FaSignOutAlt,
    filledIcon: null,
    color: 'text-gray-800',
    hover: 'hover:text-gray-600',
  },
  login: {
    icon: FaSignInAlt,
    filledIcon: null,
    color: 'text-gray-800',
    hover: 'hover:text-gray-600',
  },
  email: {
    icon: MdEmail,
    filledIcon: null,
    color: 'text-gray-800',
    hover: 'hover:text-gray-600',
  },
  mail: {
    icon: AiOutlineMail,
    filledIcon: MdEmail,
    color: 'text-gray-800',
    hover: 'hover:text-gray-800',
  },
  clock: {
    icon: AiOutlineClockCircle,
    filledIcon: null,
    color: 'text-gray-800',
    hover: 'hover:text-gray-600',
  },
  upload: {
    icon: FaUpload,
    filledIcon: null,
    color: 'text-gray-800',
    hover: 'hover:text-gray-600',
  },
  settings: {
    icon: FiSettings,
    filledIcon: null,
    color: 'text-gray-800',
    hover: 'hover:text-gray-600',
  },
  search: {
    icon: AiOutlineSearch,
    filledIcon: null,
    color: 'text-white-800',
    hover: 'hover:text-white-600',
  },
  back: {
    icon: AiOutlineArrowLeft,
    filledIcon: null,
    color: 'text-gray-800',
    hover: 'hover:text-gray-600',
  },
  success: {
    icon: AiOutlineCheckCircle,
    filledIcon: null,
    color: 'text-green-600',
    hover: 'hover:text-green-500',
  },
  spinner: {
    icon: FaSpinner,
    filledIcon: null,
    color: 'text-gray-800',
    hover: 'hover:text-gray-600',
  },
  chat: {
    icon: AiOutlineMessage,
    filledIcon: AiFillMessage,
    color: 'text-gray-800',
    hover: 'hover:text-gray-600',
  },
  more: {
    icon: BsThreeDotsVertical,
    filledIcon: null,
    color: 'text-gray-800',
    hover: 'hover:text-gray-600',
  },
  moreAlt: {
    icon: FiMoreHorizontal,
    filledIcon: null,
    color: 'text-gray-800',
    hover: 'hover:text-gray-600',
  },
  send: {
    icon: FiSend,
    filledIcon: null,
    color: 'text-gray-800',
    hover: 'hover:text-gray-600',
  },
  notification: {
    icon: IoNotificationsOutline,
    filledIcon: null,
    color: 'text-gray-800',
    hover: 'hover:text-gray-600',
  },
  userEdit: {
    icon: FaUserEdit,
    filledIcon: null,
    color: 'text-gray-800',
    hover: 'hover:text-gray-600',
  },
  plus: {
    icon: FaPlusSquare,
    filledIcon: null,
    color: 'text-gray-800',
    hover: 'hover:text-gray-600',
  },
  menu: {
    icon: FaBars,
    filledIcon: null,
    color: 'text-gray-800',
    hover: 'hover:text-gray-600',
  },
  user: {
    icon: AiOutlineUser,
    filledIcon: FaUserCircle,
    color: 'text-gray-800',
    hover: 'hover:text-gray-800',
  },
};
