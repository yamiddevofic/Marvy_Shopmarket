import React from "react";
import Form from "../components/Form/Form";
import Layout from "../Layout/Layout";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";

const Report = ({ userName: propUserName, adminInfo: propAdminInfo, storeInfo: propStoreInfo, initial: propInitial, selectedIcon: propSelectedIcon }) => {
    
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const [ adminInfo, setAdminInfo ] = useState(null);
    const { selectedOption, setSelectedOption } = useAppContext();
    const [error, setError] = useState(null);

    console.log('selectedOption estado en Report: ', selectedOption)
    console.log('adminInfo estado en Report: ', adminInfo)

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
    
    console.log('selectedOption estado en Report: ', selectedOption)
    console.log('adminInfo estado en Report ', adminInfo)
    console.log('storeInfo estado en Report: ', storeInfo)
    console.log('userName estado en Report: ', userName)
    console.log('initial estado en Report: ', initial)
    console.log('error estado en Report: ', error)
    return (
        <Layout userName={userName} error={error} adminInfo={adminInfo} storeInfo={storeInfo} initial={initial} selectedOption={selectedOption} selectedIcon={selectedIcon}>
            <Form
            title="Generar Reporte"
            selectedIcon={selectedIcon}
            initialData={{
                reporteId: "",
                reporteTipo: "",
                reporteFechaInicio: "",
                reporteFechaFin: "",
                tiendaId: "",
            }}
            fields={[
                { name: "reporteId", label: "ID Reporte", placeholder: "Ingrese el ID", required: true },
                { name: "reporteTipo", label: "Tipo de Reporte", placeholder: "Tipo de reporte", required: true },
                { name: "reporteFechaInicio", label: "Fecha de Inicio", type: "date", placeholder: "Fecha de inicio", required: true },
                { name: "reporteFechaFin", label: "Fecha de Fin", type: "date", placeholder: "Fecha de fin", required: true },
                { name: "tiendaId", label: "ID Tienda", placeholder: "ID de la tienda", required: true }
            ]}
            apiEndpoint="/generar-reporte"
            submitButtonText="Generar Reporte" />
        </Layout>
    );
};

export default Report;
