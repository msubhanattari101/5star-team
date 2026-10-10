import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, AlertTriangle, ShieldCheck, User } from 'lucide-react';
import { Employee } from '../types';

interface EmployeeTableProps {
  employees: Employee[];
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = employees.filter((emp) => {
    const matchSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.id.toLowerCase().includes(search.toLowerCase()) ||
      emp.role.toLowerCase().includes(search.toLowerCase()) ||
      emp.currentActivity.toLowerCase().includes(search.toLowerCase());

    if (!matchSearch) return false;
    if (deptFilter !== 'All' && !emp.department.includes(deptFilter)) return false;
    if (statusFilter !== 'All' && emp.status !== statusFilter) return false;

    return true;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
      {/* Search and Filters */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Employee name, ID, role..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700 outline-hidden"
          >
            <option value="All">All Departments</option>
            <option value="Production">General Production</option>
            <option value="Welding">Robotic Welding</option>
            <option value="Maintenance">Heavy Maintenance</option>
            <option value="Electrical">Electrical</option>
            <option value="Warehouse">Warehouse Logistics</option>
            <option value="Packaging">Packaging</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700 outline-hidden"
          >
            <option value="All">All Statuses</option>
            <option value="active">Active On Floor</option>
            <option value="idle">Inactive / Idle</option>
            <option value="off-shift">Off Shift</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="p-3">Employee</th>
              <th className="p-3">Role & Dept</th>
              <th className="p-3">Shift</th>
              <th className="p-3">Current Activity</th>
              <th className="p-3">Current Location</th>
              <th className="p-3 text-center">Safety Score</th>
              <th className="p-3 text-center">Warnings</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((emp) => (
              <tr
                key={emp.id}
                onClick={() => navigate(`/employees/${emp.id}`)}
                className="hover:bg-slate-50/80 transition-colors cursor-pointer"
              >
                <td className="p-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={emp.photo}
                      alt={emp.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="font-bold text-slate-900">{emp.name}</div>
                      <div className="font-mono text-[10px] text-blue-600">{emp.id}</div>
                    </div>
                  </div>
                </td>

                <td className="p-3">
                  <div className="font-medium text-slate-800">{emp.role}</div>
                  <div className="text-[11px] text-slate-400">{emp.department}</div>
                </td>

                <td className="p-3 font-mono text-[11px] text-slate-500">
                  {emp.shift}
                </td>

                <td className="p-3 text-slate-700 font-medium">
                  {emp.currentActivity}
                </td>

                <td className="p-3 text-slate-500 truncate max-w-[140px]">
                  {emp.currentLocation}
                </td>

                <td className="p-3 text-center">
                  <span
                    className={`inline-block font-display font-bold px-2 py-0.5 rounded text-xs ${
                      emp.safetyScore >= 90
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : emp.safetyScore >= 80
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {emp.safetyScore}%
                  </span>
                </td>

                <td className="p-3 text-center">
                  {emp.warnings > 0 ? (
                    <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-xs">
                      <AlertTriangle className="w-3 h-3" />
                      {emp.warnings}
                    </span>
                  ) : (
                    <span className="text-slate-400">0</span>
                  )}
                </td>

                <td className="p-3">
                  {emp.status === 'active' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  ) : emp.status === 'idle' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Idle
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600">
                      Off Shift
                    </span>
                  )}
                </td>

                <td className="p-3 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/employees/${emp.id}`);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                  >
                    <span>Profile</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
