import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Factory,
  Video,
  Users,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  Layers,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { INITIAL_DEPARTMENTS } from '../data/departments';
import { useSafety } from '../context/SafetyContext';

export const FactoryOverview: React.FC = () => {
  const navigate = useNavigate();
  const { currentPlant, stats } = useSafety();
  const [selectedDeptId, setSelectedDeptId] = useState<string>('dept-maintenance');

  const selectedDept = INITIAL_DEPARTMENTS.find((d) => d.id === selectedDeptId) || INITIAL_DEPARTMENTS[0];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span className="uppercase font-bold text-slate-500">Spatial Telemetry</span>
            <span>·</span>
            <span className="text-blue-600 font-semibold">{currentPlant}</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-1">
            Factory Floor & Hazardous Zones
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Interactive facility layout, departmental monitoring nodes, and physical perimeter zoning.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-600 shadow-2xs">
            Overall Site Safety: <strong className="text-emerald-700">{stats.safetyScore}%</strong>
          </div>
        </div>
      </div>

      {/* Interactive Facility Floor Blueprint Simulation */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold">FACILITY ZONING MATRIX · MAIN HIGH-BAY LEVEL 1</span>
          </div>
          <span className="text-xs font-mono text-slate-400">Scale: 1:250 · 42,000 sq ft</span>
        </div>

        {/* Blueprint Layout Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {INITIAL_DEPARTMENTS.map((dept) => {
            const isSelected = dept.id === selectedDeptId;
            return (
              <div
                key={dept.id}
                onClick={() => setSelectedDeptId(dept.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-blue-900/40 border-blue-400 ring-2 ring-blue-500/30'
                    : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-blue-400">{dept.code}</span>
                  <span
                    className={`text-xs font-display font-bold px-2 py-0.5 rounded ${
                      dept.safetyScore >= 95
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : dept.safetyScore >= 90
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}
                  >
                    {dept.safetyScore}%
                  </span>
                </div>

                <div className="font-display font-bold text-sm text-white truncate">
                  {dept.name}
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-700/60">
                  <span>{dept.employeesCount} Workers</span>
                  <span>{dept.camerasCount} Cams</span>
                </div>

                {dept.activeAlertsCount > 0 && (
                  <div className="absolute top-2 right-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Department Details Inspection Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-2xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-xl text-slate-900 tracking-tight">
                {selectedDept.name} ({selectedDept.code})
              </h2>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  selectedDept.riskRating === 'High'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : selectedDept.riskRating === 'Medium'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {selectedDept.riskRating} Inherent Risk
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">{selectedDept.description}</p>
          </div>

          <button
            onClick={() => navigate('/cameras')}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
          >
            <span>View Department Cameras ({selectedDept.camerasCount})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
            <div className="text-[11px] uppercase font-bold text-slate-400">Head of Department</div>
            <div className="font-bold text-sm text-slate-900 mt-1">{selectedDept.headOfDepartment}</div>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
            <div className="text-[11px] uppercase font-bold text-slate-400">Rostered Personnel</div>
            <div className="font-display font-bold text-lg text-slate-900 mt-1">{selectedDept.employeesCount}</div>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
            <div className="text-[11px] uppercase font-bold text-slate-400">Active Cameras</div>
            <div className="font-display font-bold text-lg text-blue-600 mt-1">{selectedDept.camerasCount}</div>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
            <div className="text-[11px] uppercase font-bold text-slate-400">Shift Safety Index</div>
            <div className="font-display font-bold text-lg text-emerald-700 mt-1">{selectedDept.safetyScore}%</div>
          </div>
        </div>

        {/* Sub-Zones List */}
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2">
            Active Monitored Sub-Zones
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            {selectedDept.zones.map((zone, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50/70 rounded-lg border border-slate-200 flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-medium text-slate-800 truncate">{zone}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
