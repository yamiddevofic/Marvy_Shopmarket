import React, { useState } from 'react';

const RegisterShopForm = () => {
  const [formData, setFormData] = useState({
    tenderoId: '',
    tenderoNombre: '',
    tenderoCorreo: '',
    tenderoCelular: '',
    tenderoPassword: '',
    tiendaId: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Preparar los datos para que coincidan con lo que espera el back-end
    const dataToSend = {
      tendero_Id: formData.tenderoId,
      tendero_Nombre: formData.tenderoNombre,
      tendero_Correo: formData.tenderoCorreo,
      tendero_Celular: formData.tenderoCelular,
      tendero_Password: formData.tenderoPassword,
      tienda_Id: formData.tiendaId,
    };
  
    fetch('/api/registrar-tendero', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Registro de tendero exitoso') {
          // Manejar registro exitoso
          alert('¡Registro exitoso!');
          // Opcionalmente, reiniciar el formulario o redirigir al usuario
        } else {
          // Manejar errores devueltos por el back-end
          alert(`Error: ${data.message}`);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Error al registrar. Por favor, intenta nuevamente.');
      });
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <div className="text-center mb-8">
          <img src="/marvyshopmarket.png" alt="Logo" className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-700">Registro de Tendero</h2>
          <p className="text-gray-600">Complete la información requerida</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-gray-700">ID Tendero</label>
              <input
                type="text"
                name="tenderoId"
                value={formData.tenderoId}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:border-green-500"
                placeholder="Ingrese el ID"
              />
            </div>
            <div>
              <label className="block text-gray-700">Nombre</label>
              <input
                type="text"
                name="tenderoNombre"
                value={formData.tenderoNombre}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:border-green-500"
                placeholder="Nombre completo"
              />
            </div>
            <div>
              <label className="block text-gray-700">Correo</label>
              <input
                type="email"
                name="tenderoCorreo"
                value={formData.tenderoCorreo}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:border-green-500"
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div>
              <label className="block text-gray-700">Celular</label>
              <input
                type="text"
                name="tenderoCelular"
                value={formData.tenderoCelular}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:border-green-500"
                placeholder="Número de celular"
              />
            </div>
            <div>
              <label className="block text-gray-700">Contraseña</label>
              <input
                type="password"
                name="tenderoPassword"
                value={formData.tenderoPassword}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:border-green-500"
                placeholder="Contraseña"
              />
            </div>
            <div>
              <label className="block text-gray-700">ID Tienda</label>
              <input
                type="text"
                name="tiendaId"
                value={formData.tiendaId}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:border-green-500"
                placeholder="ID de la tienda asociada"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Completar Registro
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterShopForm;
