import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { SafetyBadge } from '../components/SafetyBadge';

export const SafetyRules: React.FC = () => {
  const { rules, toggleRule, resetToDefaults } = useSafety();

  const enabledCount = rules.filter((r) => r.enabled).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Safety Rules & AI Vision Protocols
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure automated policy enforcement algorithms across all factory camera sensors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-mono font-bold text-emerald-800">
            {enabledCount} of {rules.length} Rules Active
          </div>

          <button
            onClick={resetToDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Defaults</span>
          </button>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`p-5 rounded-xl border bg-white shadow-2xs transition-all flex flex-col justify-between space-y-4 ${
              rule.enabled ? 'border-slate-200' : 'border-slate-200/60 opacity-60 bg-slate-50/50'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {rule.code}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {rule.category}
                  </span>
                </div>

                {/* Toggle Switch */}
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`w-12 h-6 rounded-full flex items-center p-0.5 transition-colors cursor-pointer ${
                    rule.enabled ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
                </button>
              </div>

              <div className="flex items-center justify-between mt-1">
                <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
                  {rule.name}
                </h3>
                <SafetyBadge severity={rule.severity} size="sm" />
              </div>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {rule.description}
              </p>
            </div>

            {/* Rule Specifics Box */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60 space-y-2 text-xs">
              <div className="flex items-start justify-between">
                <span className="text-slate-400 shrink-0 mr-2">Mandatory Zone:</span>
                <span className="font-semibold text-slate-800 text-right">{rule.zoneRequired}</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-slate-400 shrink-0 mr-2">Equipment Spec:</span>
                <span className="font-mono text-slate-800 text-right">{rule.ppeRequired}</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-slate-400 shrink-0 mr-2">Violation Penalty:</span>
                <span className="text-rose-700 font-medium text-right">{rule.penaltyAction}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
              <span>Triggers Today: <strong className="text-slate-800">{rule.triggersToday}</strong></span>
              <span className={rule.enabled ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                {rule.enabled ? 'ENFORCEMENT: ACTIVE' : 'ENFORCEMENT: PAUSED'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
