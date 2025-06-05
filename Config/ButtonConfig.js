export const ButtonTypes = {
  REGISTER: 'register',
  LOGIN: 'login',
  CANCEL: 'cancel',
  SEND_RESET_LINK: 'sendResetLink',
  RESET_PASSWORD: 'resetPassword',
  EDIT_PROFILE: 'editProfile',
  SAVE: 'saveProfile',
  FOLLOW: 'follow',
  UNFOLLOW: 'unfollow',
  FOLLOWERS: 'followers',
  FOLLOWING: 'following',
  POSTS: 'posts',
  SEARCH: 'search',
};

export const ButtonClassConfig = {
  register: {
    variant: 'contained',
    color: 'secondary',
    sx: {
      backgroundColor: '#ff1493',
      '&:hover': { backgroundColor: '#6b7280' },
    },
  },
  login: {
    variant: 'contained',
    color: 'primary',
    sx: {
      backgroundColor: '#ff1493',
      '&:hover': { backgroundColor: '#6b7280' },
    },
  },
  cancel: {
    variant: 'outlined',
    color: 'inherit',
    sx: {
      color: '#ff1493',
      borderColor: '#ff1493',
      '&:hover': { backgroundColor: '#f3f4f6' },
    },
  },
  sendResetLink: {
    variant: 'contained',
    color: 'primary',
    sx: {
      backgroundColor: '#ff1493',
      '&:hover': { backgroundColor: '#6b7280' },
    },
  },
  resetPassword: {
    variant: 'contained',
    color: 'primary',
    sx: {
      backgroundColor: '#ff1493',
      '&:hover': { backgroundColor: '#fffff' },
    },
  },
  editProfile: {
    variant: 'outlined',
    color: 'inherit',
    sx: {
      color: '#ff1493',
      borderWidth: '2px',
      borderColor: '#ff1493',
      '&:hover': {
        backgroundColor: '#f3f4f6',
        borderColor: '#ff1493',
      },
    },
  },
  saveProfile: {
    variant: 'contained',
    color: 'primary',
    sx: {
      backgroundColor: '#ff1493',
      '&:hover': { backgroundColor: '#6b7280' },
    },
  },
  follow: {
    variant: 'contained',
    color: 'primary',
    sx: {
      backgroundColor: '#ff1493',
      '&:hover': { backgroundColor: '#6b7280' },
    },
  },
  unfollow: {
    variant: 'contained',
    color: 'primary',
    sx: {
      backgroundColor: '#ff1493',
      '&:hover': { backgroundColor: '#6b7280' },
    },
  },
  followers: {
    variant: 'outlined',
    color: 'inherit',
    sx: {
      color: '#ff1493',
      borderWidth: '2px',
      borderColor: '#ff1493',
      '&:hover': {
        backgroundColor: '#f3f4f6',
        borderColor: '#ff1493',
      },
    },
  },
  following: {
    variant: 'outlined',
    color: 'inherit',
    sx: {
      color: '#ff1493',
      borderWidth: '2px',
      borderColor: '#ff1493',
      '&:hover': {
        backgroundColor: '#f3f4f6',
        borderColor: '#ff1493',
      },
    },
  },
  posts: {
    variant: 'outlined',
    color: 'inherit',
    sx: {
      color: '#ff1493',
      borderWidth: '2px',
      borderColor: '#ff1493',
      '&:hover': {
        backgroundColor: '#f3f4f6',
        borderColor: '#ff1493',
      },
    },
  },
  search: {
    variant: 'contained',
    color: 'primary',
    sx: {
      backgroundColor: '#6b7280',
      '&:hover': { backgroundColor: '#ff1493' },
    },
  },
};

export const FormButtonConfig = {
  Register: ['register'],
  Login: ['login'],
  ForgotPassword: ['sendResetLink'],
  ResetPassword: ['resetPassword', 'cancel'],
  EditProfile: ['saveProfile'],
};
