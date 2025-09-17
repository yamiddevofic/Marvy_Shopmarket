import React from "react";
import Form from "../components/Form/Form";
import Layout from "../Layout/Layout";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";

const RegisterShopkeeper = ({ userName: propUserName, adminInfo: propAdminInfo, storeInfo: propStoreInfo, initial: propInitial, selectedIcon: propSelectedIcon }) => {
    
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const [ adminInfo, setAdminInfo ] = useState(null);
    const [ tenderos, setTenderos ] = useState([]);
    const { selectedOption, setSelectedOption } = useAppContext();
    const [error, setError] = useState(null);

    console.log('selectedOption estado en RegisterShopkeeper: ', selectedOption)
    console.log('adminInfo estado en RegisterShopkeeper: ', adminInfo)

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
    
      // Nueva función para obtener los tenderos registrados al cargar el componente
      useEffect(() => {
        fetchShopkeepers();
      }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

      // Función para consultar los tenderos registrados desde el backend 
      const fetchShopkeepers = async () => {
        try {
          console.log('Iniciandzo consulta de tenderos...');
          console.log('URL de la API:', import.meta.env.VITE_API_URL + '/consultar-tenderos');
          
          const response = await fetch(import.meta.env.VITE_API_URL + '/consultar-tenderos', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // Incluir cookies para la sesión
          });
          
          console.log('Response status:', response.status);
          console.log('Response ok:', response.ok);
          console.log('Response headers:', Object.fromEntries(response.headers.entries()));
          console.log('Response url:', response.url);
          console.log('Response type:', response.type);
          
          if (!response.ok) {
            let errorMessage = `Error ${response.status}: ${response.statusText}`;
            try {
              const errorData = await response.json();
              errorMessage = errorData.message || errorMessage;
              console.error('Error data:', errorData);
            } catch (e) {
              console.error('No se pudo parsear el error:', e);
              const text = await response.text();
              console.error('Response text:', text);
            }
            throw new Error(errorMessage);
          }
          
          const data = await response.json();
          console.log('Datos completos de respuesta:', data);
          console.log('Tenderos array:', data.tenderos);
          console.log('Total de tenderos:', data.total);
          setTenderos(data.tenderos || []);
        } catch (error) {
          console.error('Error al consultar los tenderos:', error);
          setError(error.message);
          setTenderos([]); // Asegurar que el array esté vacío en caso de error
        }
      };



      // Mantener sincronizado si cambian props o location.state
      useEffect(() => {
        setAdminInfo((prev) => safeObj(propAdminInfo) || prev || null);
        setStoreInfo((prev) => safeObj(propStoreInfo) || prev || null);
        setUserName((prev) => safeStr(propUserName) || prev || null);
        setSelectedOption((prev) => safeStr(location.state?.selectedOption) || localStorage.getItem('selectedOption') || prev || null);
        setSelectedIcon((prev) => propSelectedIcon || prev || null);
      }, [propAdminInfo, propStoreInfo, propUserName]);
    
    console.log('selectedOption estado en RegisterShopkeeper: ', selectedOption)
    console.log('adminInfo estado en RegisterShopkeeper: ', adminInfo)
    console.log('storeInfo estado en RegisterShopkeeper: ', storeInfo)
    console.log('userName estado en RegisterShopkeeper: ', userName)
    console.log('initial estado en RegisterShopkeeper: ', initial)
    console.log('error estado en RegisterShopkeeper: ', error)
    console.log('tenderos estado en RegisterShopkeeper: ', tenderos)
    return (
        <Layout userName={userName} error={error} adminInfo={adminInfo} storeInfo={storeInfo} initial={initial} selectedOption={selectedOption} selectedIcon={selectedIcon}>
            {/* sección para registrar tenderos */}
            <Form
            id="register-shopkeeper"
            data={tenderos}
            title="Registro de Tenderos"
            selectedIcon={selectedIcon}
            initialData={{
                tendero_Id: "",
                tendero_Nombre: "",
                tendero_Correo: "",
                tendero_Celular: "",
                tendero_Password: "",
                tienda_Id: "",
            }}
            fields={[
                { name: "tendero_Id", label: "ID Tendero", placeholder: "Ingrese el ID", required: true },
                { name: "tendero_Nombre", label: "Nombre Completo", placeholder: "Nombre completo", required: true },
                { name: "tendero_Correo", label: "Correo Electrónico", type: "email", placeholder: "correo@ejemplo.com", required: true },
                { name: "tendero_Celular", label: "Celular", placeholder: "Número de celular", required: true },
                { name: "tendero_Password", label: "Contraseña", type: "password", placeholder: "••••••••", required: true },
                { name: "tienda_Id", label: "ID Tienda", placeholder: "ID de la tienda asociada", required: true }
            ]}
            apiEndpoint="/registrar-tendero"
            submitButtonText="Completar Registro"
            onSubmitSuccess={fetchShopkeepers} />
        </Layout>
    );
};

export default RegisterShopkeeper;
