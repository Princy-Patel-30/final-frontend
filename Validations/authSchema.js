import * as yup from 'yup';

const usernameSchema = yup
  .string()
  .required('Username is required')
  .matches(
    /^[a-zA-Z0-9_]+$/,
    'Username must be alphanumeric (underscores allowed)',
  );

const emailSchema = yup
  .string()
  .required('Email is required')
  .email('enter correct email address.');

const passwordSchema = yup
  .string()
  .required('Password is required')
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/,
    'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character',
  );

export const registerSchema = yup.object().shape({
  name: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
});

export const loginSchema = yup.object().shape({
  loginId: yup.string().required('Username or email is required'),
  password: yup.string().required('Password is required'),
});

export const forgotPasswordSchema = yup.object().shape({
  email: emailSchema,
});

export const resetPasswordSchema = yup.object().shape({
  newPassword: passwordSchema,
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('newPassword')], 'Passwords do not match'),
});
