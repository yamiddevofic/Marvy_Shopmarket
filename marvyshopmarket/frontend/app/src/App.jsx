// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import ProfileSection from './pages/ProfileSection';
import Register_Shop from './pages/RegisterShopForm';
import ProtectedRoute from './components/ProtectedRout';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registrarse" element={<SignUp />} />
        
        {/* Rutas protegidas */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              {(() => {
                const storedAdmin = localStorage.getItem('adminInfo');
                const storedStore = localStorage.getItem('storeInfo');
                const storedUser = localStorage.getItem('userName');
                const storedAdmInitial = localStorage.getItem('admInitial');
                const adminInfo = storedAdmin ? JSON.parse(storedAdmin) : null;
                const storeInfo = storedStore ? JSON.parse(storedStore) : null;
                const userName = storedUser || null;
                const initial = storedAdmInitial || null;
                return (
                  <ProfileSection
                    adminInfo={adminInfo}
                    storeInfo={storeInfo}
                    userName={userName}
                    initial={initial}
                  />
                );
              })()}
            </ProtectedRoute>
          }
        />
        <Route
          path="/tenderos"
          element={
            <ProtectedRoute>
              <Register_Shop />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
