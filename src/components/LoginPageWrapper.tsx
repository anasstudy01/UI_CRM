import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';

import  type {OutletContext} from '../types/index';

const LoginPageWrapper: React.FC = () => {
  const { handleLogin } = useOutletContext<OutletContext>();
  const navigate = useNavigate();

  const onSwitchToSignup = () => {
    navigate('/signup');
  };

  return (
    <LoginPage 
      onLogin={handleLogin} 
      onSwitchToSignup={onSwitchToSignup}
    />
  );
};

export default LoginPageWrapper;
