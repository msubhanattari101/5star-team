import React from 'react';
import { Severity, ViolationStatus } from '../types';

interface SafetyBadgeProps {
  severity?: Severity | 'critical' | 'warning' | 'minor' | 'nominal';
  status?: ViolationStatus | string;
  size?: 'sm' | 'md';
  className?: string;
}

export const SafetyBadge: React.FC<SafetyBadgeProps> = ({
  severity,
  status,
  size = 'md',
  className = '',
}) => {
  const pad = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  if (severity) {
    const sev = severity.toLowerCase();
    if (sev === 'critical') {
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-md tracking-wider uppercase ${pad} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
          Critical
        </span>
      );
    }
    if (sev === 'warning') {
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-md tracking-wider uppercase ${pad} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
          Warning
        </span>
      );
    }
    if (sev === 'minor') {
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-md tracking-wider uppercase ${pad} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          Minor
        </span>
      );
    }
    // Nominal / Compliant
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md tracking-wider uppercase ${pad} ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
        Nominal Safe
      </span>
    );
  }

  if (status) {
    const st = status.toLowerCase();
    if (st === 'pending') {
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-md ${pad} ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Pending
        </span>
      );
    }
    if (st === 'in review' || st === 'review') {
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md ${pad} ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          In Review
        </span>
      );
    }
    if (st === 'escalated') {
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-md ${pad} ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
          Escalated
        </span>
      );
    }
    if (st === 'acknowledged') {
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-md ${pad} ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          Acknowledged
        </span>
      );
    }
    if (st === 'resolved') {
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md ${pad} ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Resolved
        </span>
      );
    }
  }

  return null;
};
