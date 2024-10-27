import React from 'react';
import { TrendingUp, TrendingDown } from "lucide-react";

const StatsCard = ({ title, value, icon: Icon, trend, color }) => {
  const TrendIcon = trend > 0 ? TrendingUp : TrendingDown;
  const trendColor = trend > 0 ? 'text-green-600' : 'text-red-600';
  
  return (
    <div className="bg-gray-200 dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:bg-green-200  hover:shadow-md transition-shadow dark:hover:bg-gray-700/50 cursor-pointer">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 ${trendColor}`}>
            <TrendIcon className="h-4 w-4" />
            <span className="text-sm font-medium">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-600 dark:text-white">{title}</p>
        <h3 className="text-2xl font-bold text-black dark:text-white">{value}</h3>
      </div>
    </div>
  );
};

export default StatsCard;
