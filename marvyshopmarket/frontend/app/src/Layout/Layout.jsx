import React from "react";
import Header from "../components/Header/Header";

const Layout = ({ children, adminInfo, storeInfo, userName, selectedOption, selectedIcon }) => {
    console.log("selectedOption estado en Layout: ", selectedOption)
    console.log("selectedIcon estado en Layout: ", selectedIcon)
    return (
        <div>
            <Header adminInfo={adminInfo} storeInfo={storeInfo} userName={userName} selectedOption={selectedOption} selectedIcon={selectedIcon}/>
            {children}
        </div>
    );
};

export default Layout;