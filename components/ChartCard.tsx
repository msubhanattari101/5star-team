import React from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  action,
  children,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
      <div className="flex items-start justify-between mb-4 border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
};
