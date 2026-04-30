import {
  Navigate
} from 'react-router-dom';

import {
  useAuth
} from './AuthContext';
import { JSX } from 'react';


interface Props {
  children: JSX.Element;
}


export function ProtectedRoute({
  children
}: Props) {

  const {
    isAuthenticated
  } = useAuth();


  if (!isAuthenticated) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }

  return children;

}