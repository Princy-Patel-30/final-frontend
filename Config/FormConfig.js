const commonInputStyle =
  'px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 transition';

export const formTypes = {
  REGISTER: 'Register',
  LOGIN: 'Login',
  FORGOT_PASSWORD: 'ForgotPassword',
  RESET_PASSWORD: 'ResetPassword',
  EDIT_PROFILE: 'EditProfile',
};

export const FormFieldConfig = {
  [formTypes.REGISTER]: [
    {
      name: 'name',
      type: 'text',
      placeholder: 'Name',
      className: commonInputStyle,
    },
    {
      name: 'email',
      type: 'email',
      placeholder: 'Email',
      className: commonInputStyle,
    },
    {
      name: 'password',
      type: 'password',
      placeholder: 'Password',
      className: commonInputStyle,
    },
    {
      name: 'confirmPassword',
      type: 'password',
      placeholder: 'Confirm Password',
      className: commonInputStyle,
    },
  ],
  [formTypes.LOGIN]: [
    {
      name: 'loginId',
      type: 'email',
      placeholder: 'Username or Email',
      className: commonInputStyle,
    },
    {
      name: 'password',
      type: 'password',
      placeholder: 'Password',
      className: commonInputStyle,
    },
  ],
  [formTypes.FORGOT_PASSWORD]: [
    {
      name: 'email',
      type: 'email',
      placeholder: 'Enter your email',
      className: commonInputStyle,
    },
  ],
  [formTypes.RESET_PASSWORD]: [
    {
      name: 'newPassword',
      type: 'password',
      placeholder: 'New password',
      className: commonInputStyle,
    },
    {
      name: 'confirmPassword',
      type: 'password',
      placeholder: 'Confirm password',
      className: commonInputStyle,
    },
  ],
  [formTypes.EDIT_PROFILE]: [
    {
      name: 'name',
      type: 'text',
      placeholder: 'edit username',
      className: commonInputStyle,
    },
    {
      name: 'bio',
      type: 'text',
      placeholder: 'edit bio',
      className: commonInputStyle,
    },
  ],
};
