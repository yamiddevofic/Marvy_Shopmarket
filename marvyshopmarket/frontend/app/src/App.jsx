// App.js
import React,{createContext, useContext, useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import ProfileSection from './pages/ProfileSection';
import Register_Shop from './pages/RegisterShopForm';
import NewProduct from './pages/NewProduct';
import ProtectedRoute from './components/ProtectedRout';
import {AppContext} from './context/AppContext';
  
const App = () => {
  const [adminInfo, setAdminInfo] = useState('default');
  const [storeInfo, setStoreInfo] = useState('default');
  const [userName, setUserName] = useState('default');
  const [initial, setInitial] = useState('default');
  const [selectedOption, setSelectedOption] = useState('default');

  const value = {
    adminInfo,
    storeInfo,
    userName,
    initial,
    selectedOption,
    setAdminInfo,
    setStoreInfo,
    setUserName,
    setInitial,
    setSelectedOption
  };


  return (
    <Router>
      <AppContext.Provider value={value}>
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
                  const storedSelectedOption = localStorage.getItem('selectedOption');
                  const adminInfo = storedAdmin ? JSON.parse(storedAdmin) : null;
                  const storeInfo = storedStore ? JSON.parse(storedStore) : null;
                  const userName = storedUser || null;
                  const initial = storedAdmInitial || null;
                  const selectedOption = storedSelectedOption || null;
                  return (
                    <ProfileSection
                      adminInfo={adminInfo}
                      storeInfo={storeInfo}
                      userName={userName}
                      initial={initial}
                      selectedOption={selectedOption}
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
          <Route
            path="/nuevo-producto"
            element={
              <ProtectedRoute>
                <NewProduct />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AppContext.Provider>
    </Router>
  );
};

export default App;
