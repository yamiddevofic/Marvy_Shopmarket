import React from "react";

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-900 text-white py-4 mt-auto">
            <div className="container mx-auto text-center">
                <p className="text-black dark:text-white">&copy; {new Date().getFullYear()} Marvy Shopmarket. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;