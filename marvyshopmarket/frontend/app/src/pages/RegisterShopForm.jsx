import React from "react";
import Form from "../components/Form/Form";

const RegisterShopForm  = () => {
    return (
        <Form formData={{
            tenderoId: "",
            tenderoNombre: "",
            tenderoCorreo: "",
            tenderoCelular: "",
            tenderoPassword: "",
            tiendaId: "",
        }} />
    );
};

export default RegisterShopForm;
