import React from 'react';
import { Users, UserCheck, UserX, AlertTriangle, UserPlus } from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { EmployeeTable } from '../components/EmployeeTable';

export const Employees: React.FC = () => {
  const { employees, stats } = useSafety();

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Workforce Safety Roster
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time shift presence, real-time activity assignments, individual safety scores, and warning logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 shadow-2xs font-mono">
            Roster: <strong className="text-slate-800">{employees.length} Technicians Tracked</strong>
          </div>
        </div>
      </div>

      {/* Workforce Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Total Workforce</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="font-display font-bold text-2xl text-slate-900 mt-2">1,248</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">3 active shifts</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Currently Active</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-display font-bold text-2xl text-slate-900 mt-2">786</div>
          <div className="text-[11px] text-slate-500 mt-1">63% of workforce</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Workforce Idle</span>
            <UserX className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-display font-bold text-2xl text-amber-700 mt-2">34</div>
          <div className="text-[11px] text-slate-500 mt-1">4.3% inactivity rate</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Active Warnings</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="font-display font-bold text-2xl text-rose-700 mt-2">{stats.activeWarnings}</div>
          <div className="text-[11px] text-rose-600 font-semibold mt-1">Pending reviews</div>
        </div>
      </div>

      {/* Main Employee Table */}
      <EmployeeTable employees={employees} />
    </div>
  );
};
