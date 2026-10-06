import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const Layout = ({ children, adminInfo, storeInfo, userName, selectedOption, selectedIcon }) => (
    <div className="panel">
        <Header adminInfo={adminInfo} storeInfo={storeInfo} userName={userName} selectedOption={selectedOption} selectedIcon={selectedIcon} />
        <div className="panel__contenido">{children}</div>
        <Footer />
    </div>
);

export default Layout;
