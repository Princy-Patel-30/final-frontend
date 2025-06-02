import PropTypes from 'prop-types';
import { Card, CardContent, Typography } from '@mui/material';

const AuthCard = ({ title, subtitle, children }) => (
  <div className="flex min-h-screen items-center justify-center bg-gray-100">
    <Card className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
      <CardContent>
        <Typography variant="h5" className="mb-6 py-4 text-center">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" className="mb-6 p-10 py-2 text-center">
            {subtitle}
          </Typography>
        )}
        <div className="mt-6 justify-center">{children}</div>
      </CardContent>
    </Card>
  </div>
);

AuthCard.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node,
};

export default AuthCard;
