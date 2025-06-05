import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormFieldConfig, formTypes } from '../../Config/FormConfig';
import { FormButtonConfig } from '../../Config/ButtonConfig';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import Button from './Button';
import IconRenderer from './IconRenderer';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  editProfileSchema, // Make sure this is imported
} from '../../Validations/authSchema';
import PropTypes from 'prop-types';
import { useRef, useEffect, useState } from 'react';

const schemaMap = {
  [formTypes.REGISTER]: registerSchema,
  [formTypes.LOGIN]: loginSchema,
  [formTypes.FORGOT_PASSWORD]: forgotPasswordSchema,
  [formTypes.RESET_PASSWORD]: resetPasswordSchema,
  [formTypes.EDIT_PROFILE]: editProfileSchema,
};

const Form = ({ formType, onSubmit, defaultValues = {} }) => {
  const [clickedButton, setClickedButton] = useState(null);
  const [passwordVisibility, setPasswordVisibility] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    reset,
  } = useForm({
    mode: 'onTouched',
    reValidateMode: 'onTouched',
    resolver: yupResolver(schemaMap[formType] || registerSchema),
    defaultValues: defaultValues,
  });

  const fields = FormFieldConfig[formType] || [];
  const buttons = FormButtonConfig[formType] || [];

  const inputRefs = useRef([]);

  // Reset form with new default values when they change
  useEffect(() => {
    if (Object.keys(defaultValues).length > 0) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  useEffect(() => {
    if (fields.length > 0) {
      setFocus(fields[0].name);
    }
  }, [fields, setFocus]);

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (idx < fields.length - 1) {
        const nextField = fields[idx + 1];
        setFocus(nextField.name);
      } else {
        setClickedButton(
          buttons.find((btn) => typeof btn === 'string' || btn.type)?.type ||
            null,
        );
        handleSubmit((data) => onSubmit(data, clickedButton))();
      }
    }
  };

  const togglePasswordVisibility = (fieldName) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const isPasswordField = (fieldType) => fieldType === 'password';

  const getFieldType = (field) => {
    if (isPasswordField(field.type)) {
      return passwordVisibility[field.name] ? 'text' : 'password';
    }
    return field.type;
  };

  const getPasswordToggleIcon = (fieldName) => {
    const isVisible = passwordVisibility[fieldName];
    return (
      <InputAdornment position="end">
        <IconButton
          onClick={() => togglePasswordVisibility(fieldName)}
          edge="end"
          size="small"
        >
          <IconRenderer
            type={isVisible ? 'eye' : 'eyeClosed'}
            isRaw={true}
            className="h-5 w-5"
          />
        </IconButton>
      </InputAdornment>
    );
  };

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data, clickedButton))}
      className="w-full space-y-6"
    >
      {fields.map((field, index) => (
        <div key={field.name} className="flex flex-col">
          <TextField
            {...register(field.name)}
            type={getFieldType(field)}
            label={field.placeholder}
            variant="outlined"
            error={!!errors[field.name]}
            helperText={errors[field.name]?.message}
            fullWidth
            onKeyDown={(e) => handleKeyDown(e, index)}
            inputRef={(el) => (inputRefs.current[index] = el)}
            InputProps={{
              endAdornment: isPasswordField(field.type)
                ? getPasswordToggleIcon(field.name)
                : null,
            }}
          />
        </div>
      ))}

      <div className="flex w-full gap-3 space-x-2">
        {buttons.map((btn) => {
          const type = typeof btn === 'string' ? btn : btn.type;
          const onClick =
            typeof btn === 'object' && btn.onClick ? btn.onClick : undefined;

          const isSubmitType = !['cancel', 'back', 'close'].includes(type);
          const buttonType = isSubmitType ? 'submit' : 'button';

          return (
            <Button
              key={type}
              type={type}
              text={
                type.charAt(0).toUpperCase() +
                type.slice(1).replace(/([A-Z])/g, ' $1')
              }
              onClick={(e) => {
                if (isSubmitType) {
                  setClickedButton(type);
                } else {
                  onClick?.(e);
                }
              }}
              disabled={
                formType === formTypes.RESET_PASSWORD &&
                (errors.newPassword || errors.confirmPassword)
              }
              sx={{
                flex: buttons.length > 1 ? 1 : 'auto',
                width: buttons.length === 1 ? '100%' : 'auto',
              }}
              buttonType={buttonType}
            />
          );
        })}
      </div>
    </form>
  );
};

Form.propTypes = {
  formType: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  defaultValues: PropTypes.object,
};

export default Form;
