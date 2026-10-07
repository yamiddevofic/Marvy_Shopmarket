import React, { useCallback, useRef, useState } from "react";
import Header from "../components/Header/Header";
import MenuLateral from "../components/Header/MenuLateral";
import Footer from "../components/Footer/Footer";

const CLAVE_COLAPSADO = "menu-colapsado";

const leerColapsado = () => {
    try {
        return localStorage.getItem(CLAVE_COLAPSADO) === "1";
    } catch {
        return false;
    }
};

const Layout = ({ children, storeInfo, userName }) => {
    const [menuAbierto, setMenuAbierto] = useState(false);
    // Barra lateral colapsada a íconos (solo escritorio); se recuerda entre visitas.
    const [colapsado, setColapsado] = useState(leerColapsado);
    const botonMenuRef = useRef(null);
    const cerrarMenu = useCallback(() => setMenuAbierto(false), []);

    const alternarColapsado = () => {
        const siguiente = !colapsado;
        setColapsado(siguiente);
        try {
            localStorage.setItem(CLAVE_COLAPSADO, siguiente ? "1" : "0");
        } catch {
            // sin persistencia: el estado dura la sesión
        }
    };

    return (
        <div className="panel panel--lateral">
            <MenuLateral abierto={menuAbierto} onCerrar={cerrarMenu} botonRef={botonMenuRef} colapsado={colapsado} onColapsar={alternarColapsado} userName={userName} storeInfo={storeInfo} />
            <div className="panel__principal">
                <Header storeInfo={storeInfo} menuAbierto={menuAbierto} onAbrirMenu={() => setMenuAbierto(true)} botonRef={botonMenuRef} />
                <div className="panel__contenido">{children}</div>
                <Footer />
            </div>
        </div>
    );
};

export default Layout;
