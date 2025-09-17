import React from "react";
import Form from "../components/Form/Form";
import Layout from "../Layout/Layout";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";

const Configuration = ({ userName: propUserName, adminInfo: propAdminInfo, storeInfo: propStoreInfo, initial: propInitial, selectedIcon: propSelectedIcon }) => {
    
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const [ adminInfo, setAdminInfo ] = useState(null);
    const { selectedOption, setSelectedOption } = useAppContext();
    const [error, setError] = useState(null);

    console.log('selectedOption estado en Configuration: ', selectedOption)
    console.log('adminInfo estado en Configuration: ', adminInfo)

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
    
    console.log('selectedOption estado en Configuration: ', selectedOption)
    console.log('adminInfo estado en Configuration: ', adminInfo)
    console.log('storeInfo estado en Configuration. ', storeInfo)
    console.log('userName estado en Configuration. ', userName)
    console.log('initial estado en Configuration. ', initial)
    console.log('error estado en Configuration. ', error)
    return (
        <Layout userName={userName} error={error} adminInfo={adminInfo} storeInfo={storeInfo} initial={initial} selectedOption={selectedOption} selectedIcon={selectedIcon}>
            <Form
            id="configuration"
            title="Configuración"
            selectedIcon={selectedIcon}
            initialData={{
                reporteId: "",
                reporteNombre: "",
                reportePrecio: "",
                reporteStock: "",
                reporteImagen: "",
                tiendaId: "",
            }}
            fields={[
                { name: "reporteId", label: "ID Configuración", placeholder: "Ingrese el ID", required: true },
                { name: "reporteNombre", label: "Nombre de Configuración", placeholder: "Nombre de la configuración", required: true },
                { name: "reportePrecio", label: "Valor", type: "number", placeholder: "Valor de la configuración", required: true },
                { name: "reporteStock", label: "Stock", type: "number", placeholder: "Cantidad en stock", required: false },
                { name: "reporteImagen", label: "Imagen", placeholder: "URL de la imagen", required: false },
                { name: "tiendaId", label: "ID Tienda", placeholder: "ID de la tienda", required: true }
            ]}
            apiEndpoint="/actualizar-configuracion"
            submitButtonText="Guardar Configuración" />
        </Layout>
    );
};

export default Configuration;
