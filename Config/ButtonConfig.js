export const ButtonTypes = {
  REGISTER: 'register',
  LOGIN: 'login',
  CANCEL: 'cancel',
  SEND_RESET_LINK: 'sendResetLink',
  RESET_PASSWORD: 'resetPassword',
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
      '&:hover': { backgroundColor: '#6b7280' },
    },
  },
};

export const FormButtonConfig = {
  Register: ['register'],
  Login: ['login'],
  ForgotPassword: ['sendResetLink'],
  ResetPassword: ['resetPassword', 'cancel'],
};
