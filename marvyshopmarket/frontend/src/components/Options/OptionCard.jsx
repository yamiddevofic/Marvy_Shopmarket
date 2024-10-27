import React from 'react';

const OptionCard = ({ icon: Icon, title, description, onClick }) => {
  return (
    <div 
      className="bg-gray-200 dark:bg-gray-800 rounded-lg shadow-sm md:shadow-md p-6 hover:bg-green-200  hover:shadow-xl dark:hover:bg-gray-700/50 transition-all cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="p-3 rounded-full bg-teal-100 group-hover:bg-teal-200 transition-colors">
          <Icon className="h-6 w-6 text-teal-700" />
        </div>
        <h3 className="font-semibold text-lg dark:text-white">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 dark:text-white">{description}</p>
        )}
      </div>
    </div>
  );
};

export default OptionCard;