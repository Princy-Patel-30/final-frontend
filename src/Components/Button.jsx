import PropTypes from 'prop-types';
import ButtonMui from '@mui/material/Button';
import { ButtonClassConfig } from '../../Config/ButtonConfig';

const Button = ({
  type,
  text,
  onClick,
  disabled = false,
  sx = {},
  buttonType = 'button',
  fullWidth = true, // default true
}) => {
  const muiProps = ButtonClassConfig[type] || {};

  return (
    <ButtonMui
      type={buttonType}
      variant={muiProps.variant || 'contained'}
      color={muiProps.color || 'primary'}
      onClick={onClick}
      disabled={disabled}
      fullWidth={fullWidth}
      sx={{
        fontWeight: 'bold',
        fontSize: '1rem',
        textTransform: 'none',
        ...muiProps.sx,
        ...sx,
      }}
    >
      {text}
    </ButtonMui>
  );
};

Button.propTypes = {
  type: PropTypes.string,
  text: PropTypes.string,
  fullWidth: PropTypes.bool,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  sx: PropTypes.object,
  buttonType: PropTypes.string,
};

export default Button;
