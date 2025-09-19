import React from 'react';

const PlaceholderComponent = ({Archive, id}) => {
    return (
        <div className='text-black w-full h-[100vh] px-8 py-10 rounded-lg dark:text-white flex flex-col justify-center items-center'>
            <div>
              <Archive className="h-16 w-16 text-emerald-500 mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">¡Oh, oh!, parece que ocurrió algo</h3>
            <p className="text-gray-600 dark:text-gray-300">No hay {id === "register-shopkeeper" ? "tenderos" : "productos"} registrados.</p>
        </div>
    );
};

export default PlaceholderComponent;
