import React from "react";
import Form from "../components/Form/Form";
import Layout from "../Layout/Layout";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";

const RegisterSupplies = ({ userName: propUserName, adminInfo: propAdminInfo, storeInfo: propStoreInfo, initial: propInitial, selectedIcon: propSelectedIcon }) => {
    
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const [ adminInfo, setAdminInfo ] = useState(null);
    const { selectedOption, setSelectedOption } = useAppContext();
    const [error, setError] = useState(null);

    console.log('selectedOption estado en NewProduct: ', selectedOption)
    console.log('adminInfo estado en NewProduct: ', adminInfo)

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
    
    console.log('selectedOption estado en NewProduct: ', selectedOption)
    console.log('adminInfo estado en NewProduct: ', adminInfo)
    console.log('storeInfo estado en NewProduct: ', storeInfo)
    console.log('userName estado en NewProduct: ', userName)
    console.log('initial estado en NewProduct: ', initial)
    console.log('error estado en NewProduct: ', error)
    return (
        <Layout userName={userName} error={error} adminInfo={adminInfo} storeInfo={storeInfo} initial={initial} selectedOption={selectedOption} selectedIcon={selectedIcon}>
            {/* sección para registrar suministros */}
            <Form
            id="register-supplies"
            title="Registro de Suministros"
            selectedIcon={selectedIcon}
            initialData={{
                suministroId: "",
                suministroNombre: "",
                suministroDescripcion: "",
                suministroCantidad: "",
                suministroPrecio: "",
                suministroProveedor: "",
            }}
            fields={[
                { name: "suministroId", label: "ID del suministro", placeholder: "Ej. S-001", required: true },
                { name: "suministroNombre", label: "Nombre del suministro", placeholder: "Ej. Bolsas de empaque", required: true },
                { name: "suministroDescripcion", label: "Descripción (opcional)", placeholder: "Detalles del pedido", required: false },
                { name: "suministroCantidad", label: "Cantidad", type: "number", placeholder: "Ej. 100", required: true },
                { name: "suministroPrecio", label: "Precio", type: "number", placeholder: "Ej. 35000", required: true },
                { name: "suministroProveedor", label: "Proveedor", placeholder: "Ej. Distribuidora El Llano", required: true }
            ]}
            apiEndpoint="/registrar-suministro"
            submitButtonText="Registrar suministro" />
        </Layout>
    );
};

export default RegisterSupplies;
