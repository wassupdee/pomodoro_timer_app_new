import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';

const PrivateRoute = ({ children }) => {
	// ログイン中のユーザー情報を受けとる
  const { user } = useAuth();

  return user ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;
