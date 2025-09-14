import React, { useState } from "react";
import Header from "../components/Header/Header";

const Layout = ({ children, adminInfo, storeInfo, userName, selectedOption }) => {
    console.log("selectedOption estado en Layout: ", selectedOption)
    return (
        <div>
            <Header adminInfo={adminInfo} storeInfo={storeInfo} userName={userName} selectedOption={selectedOption}/>
            {children}
        </div>
    );
};

export default Layout;