import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Cpu,
  Radio,
  Bell,
  Save,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Building
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';

export const Settings: React.FC = () => {
  const { currentPlant, setCurrentPlant, autoBroadcastPA, setAutoBroadcastPA, resetToDefaults, user } = useSafety();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [inferenceFps, setInferenceFps] = useState('60');
  const [edgeNodeCluster, setEdgeNodeCluster] = useState('Edge Node #4 (TensorRT Cluster)');
  const [hornDecibels, setHornDecibels] = useState('95');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
          System & Vision Telemetry Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure hardware edge nodes, audio siren decibels, floor PA automation, and facility profiles.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>System configuration parameters saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        {/* Plant Facility Settings */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building className="w-4 h-4 text-blue-600" />
            <h3 className="font-display font-bold text-sm text-slate-900">
              Facility Node & Plant Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Active Assembly Plant</label>
              <select
                value={currentPlant}
                onChange={(e) => setCurrentPlant(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 font-medium"
              >
                <option value="Detroit Assembly Plant #4">Detroit Assembly Plant #4</option>
                <option value="Munich Component Plant #1">Munich Component Plant #1</option>
                <option value="Tokyo Fab Robotics Plant #7">Tokyo Fab Robotics Plant #7</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Current Shift Schedule</label>
              <select className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50">
                <option>Shift 02 · Morning Assembly (06:00 - 14:30)</option>
                <option>Shift 03 · Afternoon Overhaul (14:00 - 22:30)</option>
                <option>Shift 01 · Night Maintenance (22:00 - 06:30)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Edge Node CV Telemetry */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Cpu className="w-4 h-4 text-blue-600" />
            <h3 className="font-display font-bold text-sm text-slate-900">
              Computer Vision & Edge Hardware
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Edge Compute Node</label>
              <input
                type="text"
                value={edgeNodeCluster}
                onChange={(e) => setEdgeNodeCluster(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Target Ingestion FPS</label>
              <select
                value={inferenceFps}
                onChange={(e) => setInferenceFps(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50"
              >
                <option value="30">30 FPS (Standard Latency)</option>
                <option value="60">60 FPS (Sub-second Ultra Telemetry)</option>
                <option value="120">120 FPS (High-Speed Lathe & Crane Mode)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Emergency PA & Alert Automation */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Radio className="w-4 h-4 text-rose-600" />
            <h3 className="font-display font-bold text-sm text-slate-900">
              Audible Floor PA & Emergency Siren
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
              <div>
                <div className="font-bold text-slate-900">Auto-broadcast alerts to floor PA</div>
                <div className="text-[11px] text-slate-500">
                  Automatically announce critical overhead crane and electrical infractions over facility speaker horns.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAutoBroadcastPA(!autoBroadcastPA)}
                className={`w-11 h-6 rounded-full flex items-center p-0.5 transition-colors ${
                  autoBroadcastPA ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
              </button>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Audible Beacon Decibel Level ({hornDecibels} dB)
              </label>
              <input
                type="range"
                min="70"
                max="110"
                value={hornDecibels}
                onChange={(e) => setHornDecibels(e.target.value)}
                className="w-full"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>70 dB (Office Ambient)</span>
                <span>95 dB (Standard Factory Floor)</span>
                <span>110 dB (Industrial Siren)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={resetToDefaults}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Demo Data</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
