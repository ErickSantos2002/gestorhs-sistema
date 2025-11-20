import React from 'react';
import { cn } from '@/utils';

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  subtitle: string;
  color?: 'blue' | 'red' | 'yellow' | 'green' | 'purple' | 'orange' | 'gray';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  title,
  value,
  subtitle,
  color = 'blue',
  onClick,
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
    orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
    gray: 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800',
  };

  const iconColorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    red: 'text-red-600 dark:text-red-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    green: 'text-green-600 dark:text-green-400',
    purple: 'text-purple-600 dark:text-purple-400',
    orange: 'text-orange-600 dark:text-orange-400',
    gray: 'text-gray-600 dark:text-gray-400',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-lg border-2 p-6 transition-all',
        colorClasses[color],
        onClick && 'cursor-pointer hover:shadow-lg hover:scale-105'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn('text-4xl', iconColorClasses[color])}>
          {icon}
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {value}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>
      </div>
    </div>
  );
};
