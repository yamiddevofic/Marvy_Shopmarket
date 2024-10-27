// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('loggedIn');

  if (!isLoggedIn) {
    // Si no está autenticado, redirigir al inicio de sesión
    return <Navigate to="/" />;
  }

  // Si está autenticado, mostrar la ruta solicitada
  return children;
};

export default ProtectedRoute;
