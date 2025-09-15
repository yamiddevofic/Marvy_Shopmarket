// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import ProfileSection from "./pages/ProfileSection";
import Register_Shop from "./pages/RegisterShopkeeper";
import NewProduct from "./pages/NewProduct";
import Stock from "./pages/Stock";
import RegisterSupplies from "./pages/RegisterSupplies";
import RegisterVendors from "./pages/RegisterVendors";
import RegisterSales from "./pages/RegisterSales";
import Report from "./pages/Report";
import Configurations from "./pages/Configuration";
import ProtectedRoute from "./components/ProtectedRout";
import { AppContext } from "./context/AppContext";
import ScrollToTop from "./components/ScrollToTop";

// ✅ Hook centralizado para leer datos
const useStoredData = () => {
  const storedAdmin = localStorage.getItem("adminInfo");
  const storedStore = localStorage.getItem("storeInfo");
  const storedUser = localStorage.getItem("userName");
  const storedAdmInitial = localStorage.getItem("admInitial");
  const storedSelectedOption = localStorage.getItem("selectedOption");
  const storedSelectedIcon = localStorage.getItem("selectedIcon");

  return {
    adminInfo: storedAdmin ? JSON.parse(storedAdmin) : null,
    storeInfo: storedStore ? JSON.parse(storedStore) : null,
    userName: storedUser || null,
    initial: storedAdmInitial || null,
    selectedOption: storedSelectedOption || null,
    selectedIcon: storedSelectedIcon || null,
  };
};

// ✅ Wrapper para no repetir `useStoredData()` en cada ruta
const ProtectedPage = ({ Component }) => {
  const storedData = useStoredData();
  return (
    <ProtectedRoute>
      <Component {...storedData} />
    </ProtectedRoute>
  );
};

const App = () => {
  const [adminInfo, setAdminInfo] = useState("default");
  const [storeInfo, setStoreInfo] = useState("default");
  const [userName, setUserName] = useState("default");
  const [initial, setInitial] = useState("default");
  const [selectedOption, setSelectedOption] = useState("default");
  const [selectedIcon, setSelectedIcon] = useState("default");

  const value = {
    adminInfo,
    storeInfo,
    userName,
    initial,
    selectedOption,
    selectedIcon,
    setAdminInfo,
    setStoreInfo,
    setUserName,
    setInitial,
    setSelectedOption,
    setSelectedIcon,
  };

  return (
    <Router>
      <ScrollToTop />
      <AppContext.Provider value={value}>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/registrarse" element={<SignUp />} />

          {/* Protegidas */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedPage Component={ProfileSection} />} />
          <Route path="/tenderos" element={<ProtectedPage Component={Register_Shop} />} />
          <Route path="/productos" element={<ProtectedPage Component={NewProduct} />} />
          <Route path="/inventario" element={<ProtectedPage Component={Stock} />} />
          <Route path="/suministros" element={<ProtectedPage Component={RegisterSupplies} />} />
          <Route path="/proveedores" element={<ProtectedPage Component={RegisterVendors} />} />
          <Route path="/ventas" element={<ProtectedPage Component={RegisterSales} />} />
          <Route path="/reportes" element={<ProtectedPage Component={Report} />} />
          <Route path="configuracion" element={<ProtectedPage Component={Configurations} />} />
          {/* Ruta por defecto para rutas no definidas */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </AppContext.Provider>
    </Router>
  );
};

export default App;
