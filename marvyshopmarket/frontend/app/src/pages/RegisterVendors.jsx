import React from "react";
import Form from "../components/Form/Form";
import Layout from "../Layout/Layout";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";

const RegisterVendors = ({ userName: propUserName, adminInfo: propAdminInfo, storeInfo: propStoreInfo, initial: propInitial, selectedIcon: propSelectedIcon }) => {
    
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const [ adminInfo, setAdminInfo ] = useState(null);
    const { selectedOption, setSelectedOption } = useAppContext();
    const [error, setError] = useState(null);

    console.log('selectedOption estado en RegisterVendors: ', selectedOption)
    console.log('adminInfo estado en RegisterVendors: ', adminInfo)

    // Utilidades para validar datos seguros
    const safeObj = (obj) => (obj && typeof obj === 'object' && Object.keys(obj).length > 0 ? obj : null);
    const safeStr = (str) => (typeof str === 'string' && str.trim().length > 0 ? str : null);

    // Prefiere location.state (si navegas desde Home), luego props (App.jsx), sino null
      const [storeInfo, setStoreInfo] = useState(safeObj(propStoreInfo) || null);
      const [userName, setUserName] = useState(safeStr(propUserName) || null);
      const [selectedIcon, setSelectedIcon] = useState(propSelectedIcon || null);

      const [initial, setInitial] = useState(
        safeStr(propInitial) || 
        (userName ? userName.charAt(0).toUpperCase() : '?')
      );
    
      // Mantener sincronizado si cambian props o location.state
      useEffect(() => {
        setAdminInfo((prev) => safeObj(propAdminInfo) || prev || null);
        setStoreInfo((prev) => safeObj(propStoreInfo) || prev || null);
        setUserName((prev) => safeStr(propUserName) || prev || null);
        setSelectedOption((prev) => safeStr(location.state?.selectedOption) || localStorage.getItem('selectedOption') || prev || null);
        setSelectedIcon((prev) => propSelectedIcon || prev || null);
      }, [propAdminInfo, propStoreInfo, propUserName]);
    
    console.log('selectedOption estado en RegisterVendors: ', selectedOption)
    console.log('adminInfo estado en RegisterVendors: ', adminInfo)
    console.log('storeInfo estado en RegisterVendors: ', storeInfo)
    console.log('userName estado en RegisterVendors: ', userName)
    console.log('initial estado en RegisterVendors: ', initial)
    console.log('error estado en RegisterVendors: ', error)
    return (
        <Layout userName={userName} error={error} adminInfo={adminInfo} storeInfo={storeInfo} initial={initial} selectedOption={selectedOption} selectedIcon={selectedIcon}>
            <Form 
            title="Registro de Proveedores"
            selectedIcon={selectedIcon}
            formData={{
                proveedorId: "",
                proveedorNombre: "",
                proveedorTelefono: "",
                proveedorCorreo: "",
                tiendaId: "",
            }} />
        </Layout>
    );
};

export default RegisterVendors;
