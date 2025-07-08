import React from "react";

const QuickActionButton = ({ text }) => {
    return (
        <button className="p-4 bg-gray-200 dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 dark:text-gray-200 hover:bg-green-200 dark:hover:bg-gray-700 text-sm font-medium">
            {text}
        </button>
    )
};

export default QuickActionButton;