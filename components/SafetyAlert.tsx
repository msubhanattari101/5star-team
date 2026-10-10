import React from 'react';
import { Alert } from '../types';
import { ShieldAlert, AlertTriangle, CheckCircle2, Radio, Bell, Volume2 } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface SafetyAlertCardProps {
  alert: Alert;
  onAcknowledge: (id: string) => void;
  onResolve?: (id: string) => void;
}

export const SafetyAlertCard: React.FC<SafetyAlertCardProps> = ({
  alert,
  onAcknowledge,
  onResolve,
}) => {
  return (
    <div
      className={`p-3.5 rounded-xl border transition-all ${
        alert.severity === 'critical'
          ? alert.resolved
            ? 'bg-slate-50/50 border-slate-200'
            : 'bg-rose-50/50 border-rose-200 ring-1 ring-rose-200/50'
          : 'bg-amber-50/40 border-amber-200'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
              alert.severity === 'critical'
                ? 'bg-rose-100 text-rose-700'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            <Bell className={`w-3.5 h-3.5 ${!alert.acknowledged ? 'animate-bell-ring' : ''}`} />
          </div>
          <span className="font-display font-bold text-sm text-slate-900 tracking-tight">
            {alert.title}
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 shrink-0">
          {alert.timeAgo}
        </span>
      </div>

      <p className="mt-2 text-xs text-slate-600 leading-relaxed">
        {alert.description}
      </p>

      <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
          <span className="font-bold text-slate-700">{alert.cameraCode}</span>
          <span>·</span>
          <span>{alert.location}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Direct sound test button */}
          <button
            onClick={() => soundManager.playWarningChime()}
            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
            title="Ring warning chime"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>

          {!alert.acknowledged ? (
            alert.autoHaltEnabled ? (
              <button
                onClick={() => {
                  onAcknowledge(alert.id);
                  soundManager.playAcknowledgeBeep();
                }}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                Acknowledge & Halt
              </button>
            ) : (
              <button
                onClick={() => {
                  onAcknowledge(alert.id);
                  soundManager.playAcknowledgeBeep();
                }}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                Acknowledge
              </button>
            )
          ) : !alert.resolved && onResolve ? (
            <button
              onClick={() => {
                onResolve(alert.id);
                soundManager.playAcknowledgeBeep();
              }}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Mark Resolved</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" />
              Resolved
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
