import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Factory, ShieldCheck, Video, Users, AlertTriangle, ChevronRight } from 'lucide-react';
import { INITIAL_DEPARTMENTS } from '../data/departments';

export const Departments: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
          Factory Departments & Operations
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Workforce distribution, CCTV density, and comparative compliance rankings across all 8 factory divisions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {INITIAL_DEPARTMENTS.map((dept) => (
          <div
            key={dept.id}
            className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {dept.code}
                </span>
                <span
                  className={`font-display font-bold text-sm px-2 py-0.5 rounded ${
                    dept.safetyScore >= 95
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : dept.safetyScore >= 90
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {dept.safetyScore}%
                </span>
              </div>

              <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
                {dept.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {dept.description}
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Superintendent:</span>
                <span className="font-bold text-slate-800">{dept.headOfDepartment}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Workforce:</span>
                <span className="font-mono font-bold text-slate-800">{dept.employeesCount}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Active Cams:</span>
                <span className="font-mono font-bold text-blue-600">{dept.camerasCount}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/cameras')}
              className="w-full py-2 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 border border-slate-200/80"
            >
              <span>Inspect Cameras</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
