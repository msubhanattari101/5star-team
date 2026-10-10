import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: React.ReactNode;
  icon?: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: string;
  trendPositive?: boolean;
  scoreCircle?: number;
  badges?: Array<{ color: string; count: number }>;
  onClick?: () => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-blue-600',
  iconBg = 'bg-blue-50',
  scoreCircle,
  badges,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-slate-200/90 rounded-xl p-4 transition-all duration-200 shadow-2xs hover:shadow-xs ${
        onClick ? 'cursor-pointer hover:border-blue-300' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
          {title}
        </span>
        {Icon && (
          <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <div className="font-display font-bold text-2xl lg:text-3xl text-slate-900 tracking-tight">
          {value}
        </div>

        {scoreCircle !== undefined && (
          <div className="relative w-10 h-10 flex items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-50/50">
            <span className="font-display font-bold text-xs text-emerald-800">
              {scoreCircle}
            </span>
          </div>
        )}
      </div>

      {badges && badges.length > 0 && (
        <div className="flex items-center gap-2 mt-2">
          {badges.map((b, idx) => (
            <div key={idx} className="flex items-center gap-1 text-xs font-semibold text-slate-600 font-mono">
              <span className={`w-2 h-2 rounded-full ${b.color}`} />
              <span>{b.count}</span>
            </div>
          ))}
        </div>
      )}

      {subtitle && (
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          {subtitle}
        </div>
      )}
    </div>
  );
};
