import React from 'react';

const OptionCard = ({ icon: Icon, title, description, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="p-3 rounded-full bg-teal-100 group-hover:bg-teal-200 transition-colors">
          <Icon className="h-6 w-6 text-teal-700" />
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </div>
    </div>
  );
};

export default OptionCard;