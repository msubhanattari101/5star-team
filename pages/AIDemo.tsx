import React from 'react';
import { Cpu, RotateCcw, Sparkles } from 'lucide-react';
import { SafetyDetectionSimulator } from '../components/SafetyDetectionSimulator';
import { useSafety } from '../context/SafetyContext';

export const AIDemo: React.FC = () => {
  const { resetToDefaults } = useSafety();

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono font-bold text-blue-700 mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>DEMO / SIMULATION — INTERACTIVE AI RULE ENGINE</span>
          </div>

          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            AI Safety Detection Demo
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Test computer vision rule triggers and simulate industrial workplace safety scenarios in real-time.
            Adjust variables, simulate missing PPE or prohibited actions, and observe instantaneous edge policy decisions.
          </p>
        </div>

        {/* Model Spec & Reset */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono shadow-2xs">
            <Cpu className="w-4 h-4 text-blue-600" />
            <span className="text-slate-800 font-bold">Model: YOLO-v9-PPE-Enterprise</span>
            <span className="text-emerald-600 font-bold">99.4% mAP</span>
          </div>

          <button
            onClick={resetToDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Interactive Simulator */}
      <SafetyDetectionSimulator />
    </div>
  );
};
