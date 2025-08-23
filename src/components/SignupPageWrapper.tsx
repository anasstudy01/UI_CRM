import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import SignupPage from '../pages/SignupPage';
import  type {OutletContext} from '../types/index';

const SignupPageWrapper: React.FC = () => {
  const { handleSignup } = useOutletContext<OutletContext>();
  const navigate = useNavigate();

  const onSwitchToLogin = () => {
    navigate('/login');
  };

  return (
    <SignupPage 
      onSignup={handleSignup} 
      onSwitchToLogin={onSwitchToLogin}
    />
  );
};

export default SignupPageWrapper;
