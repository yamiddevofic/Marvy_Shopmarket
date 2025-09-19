import React from "react";
import Form from "../components/Form/Form";
import Layout from "../Layout/Layout";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";

const NewProduct = ({ userName: propUserName, adminInfo: propAdminInfo, storeInfo: propStoreInfo, initial: propInitial, selectedIcon: propSelectedIcon }) => {
    
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const [ adminInfo, setAdminInfo ] = useState(null);
    const { selectedOption, setSelectedOption } = useAppContext();
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

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

      const consultarProductos = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/listar-productos`);
          const data = await response.json();
          console.log('Productos consultados:', data);
          return data;
        } catch (error) {
          console.error('Error al consultar productos:', error);
        }
      };
      
      useEffect(() => {
        const fetchProductos = async () => {
          try {
            const data = await consultarProductos();
            setData(data || []); // Guardar en estado
          } catch (err) {
            setError('Error cargando productos');
          }
        };
      
        fetchProductos();
      }, []);

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
    console.log('Productos registrados en NewProduct: ', data)
    return (
        <Layout userName={userName} error={error} adminInfo={adminInfo} storeInfo={storeInfo} initial={initial} selectedOption={selectedOption} selectedIcon={selectedIcon}>
            <Form
            id="new-product"
            data={data}
            title="Registro de Producto"
            selectedIcon={selectedIcon}
            initialData={{
                _id: "",
                nombre: "",
                categoria: "",
                precio: [],
                stock: 0,
                tienda_Id: storeInfo?.id || ""
            }}
            fields={[
                { name: "nombre", label: "Nombre del Producto", placeholder: "Nombre del producto", required: true },
                { name: "categoria", label: "Categoria", placeholder: "Categoria del producto", required: true },
                { name: "precio", label: "Precio", type: "number", placeholder: "Precio del producto", required: true },
                { name: "stock", label: "Stock", type: "number", placeholder: "Cantidad en stock", required: true },
            ]}
            storeInfo={storeInfo}
            apiEndpoint="/registrar-producto"
            submitButtonText="Completar Registro" />
        </Layout>
    );
};

export default NewProduct;
