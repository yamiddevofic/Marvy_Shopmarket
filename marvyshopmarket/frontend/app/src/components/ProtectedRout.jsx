// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = Cookies.get('loggedIn');

  if (isLoggedIn !== 'true') {
    // Si no está autenticado, redirigir al inicio de sesión
    return <Navigate to="/" replace />;
  }

  // Si está autenticado, mostrar el contenido de la ruta
  return children || <Outlet />;
};

export default ProtectedRoute;
