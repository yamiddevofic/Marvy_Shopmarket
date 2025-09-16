import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const Layout = ({ children, adminInfo, storeInfo, userName, selectedOption, selectedIcon }) => {
    console.log("selectedOption estado en Layout: ", selectedOption)
    console.log("selectedIcon estado en Layout: ", selectedIcon)
    return (
        <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-green-300 dark:from-gray-900 dark:to-gray-800 rounded-lg shadow-lg transition-colors duration-200 text-gray-900 dark:text-gray-100 transition-colors duration-200 flex flex-col min-h-screen">
            <Header adminInfo={adminInfo} storeInfo={storeInfo} userName={userName} selectedOption={selectedOption} selectedIcon={selectedIcon}/>
            {children}
            <Footer />
        </div>
    );
};

export default Layout;