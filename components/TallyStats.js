import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const TallyStats = ({ stats, className = "" }) => {
  const getChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="h-3 w-3 text-green-600" />;
    if (change < 0) return <TrendingDown className="h-3 w-3 text-red-600" />;
    return <Minus className="h-3 w-3 text-gray-400" />;
  };

  const getChangeColor = (change) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-gray-400";
  };

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
            </div>
            {stat.change !== undefined && (
              <div className="flex items-center gap-1">
                {getChangeIcon(stat.change)}
                <span className={`text-xs font-medium ${getChangeColor(stat.change)}`}>
                  {Math.abs(stat.change)}%
                </span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <div className={`text-2xl font-bold ${stat.valueColor || 'text-gray-900'}`}>
              {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
            </div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TallyStats;
