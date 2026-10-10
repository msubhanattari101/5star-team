import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  UserCheck,
  Video,
  FileText,
  Plus,
  ArrowLeft,
  Calendar,
  Building
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { SafetyBadge } from '../components/SafetyBadge';
import { Modal } from '../components/Modal';

export const EmployeeProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employees } = useSafety();

  const employee = employees.find((e) => e.id === (id || 'EMP-102')) || employees[0];

  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [warningType, setWarningType] = useState('Mobile Phone Prohibited');
  const [warningNotes, setWarningNotes] = useState('');
  const [warningIssuedSuccess, setWarningIssuedSuccess] = useState(false);

  const handleIssueWarning = (e: React.FormEvent) => {
    e.preventDefault();
    setWarningIssuedSuccess(true);
    setTimeout(() => {
      setWarningIssuedSuccess(false);
      setWarningModalOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/employees')}
          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="text-xs text-slate-500 font-mono">
          <span>Workforce</span> &gt; <span className="text-slate-800 font-bold">{employee.name} ({employee.id})</span>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <img
              src={employee.photo}
              alt={employee.name}
              referrerPolicy="no-referrer"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
            />

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
                  {employee.name}
                </h1>
                <span className="font-mono text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-md border border-blue-200">
                  {employee.id}
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    employee.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {employee.status === 'active' ? 'Active On Floor' : 'Idle / Inactive'}
                </span>
              </div>

              <div className="text-sm font-semibold text-slate-700">{employee.role}</div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {employee.department}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {employee.shift}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {employee.email}
                </span>
              </div>
            </div>
          </div>

          {/* Safety Score Large Gauge */}
          <div className="flex items-center gap-4 self-start md:self-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
            <div className="text-right">
              <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                Safety Score
              </div>
              <div className="font-display font-bold text-3xl sm:text-4xl text-slate-900">
                {employee.safetyScore}%
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold">Tier 1 Nominal</div>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center font-display font-bold text-xl text-emerald-800 shadow-2xs">
              <ShieldCheck className="w-7 h-7 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Current Activity & Location Strip */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
            <span className="text-[11px] text-slate-400 uppercase font-bold block">Current Task Assignment</span>
            <span className="font-bold text-slate-800 mt-0.5 block">{employee.currentActivity}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
            <span className="text-[11px] text-slate-400 uppercase font-bold block">Current Location / Camera</span>
            <span className="font-bold text-slate-800 mt-0.5 block">{employee.currentLocation}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-bold block">Supervisor</span>
              <span className="font-bold text-slate-800 mt-0.5 block">{employee.supervisor}</span>
            </div>
            <button
              onClick={() => navigate(`/cameras/${employee.currentCameraId}`)}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="View Live Camera Feed"
            >
              <Video className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="text-xs uppercase font-bold text-slate-400">Total Warnings</div>
          <div className="font-display font-bold text-2xl text-amber-700 mt-2">
            {employee.stats.warnings}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Written advisories</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="text-xs uppercase font-bold text-slate-400">Total Violations</div>
          <div className="font-display font-bold text-2xl text-rose-700 mt-2">
            {employee.stats.violations}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">CV detections logged</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="text-xs uppercase font-bold text-slate-400">Resolved Incidents</div>
          <div className="font-display font-bold text-2xl text-emerald-700 mt-2">
            {employee.stats.resolved}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">100% remediated</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="text-xs uppercase font-bold text-slate-400">Safety Checks</div>
          <div className="font-display font-bold text-2xl text-blue-600 mt-2">
            {employee.stats.safetyChecks}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Automated scans</div>
        </div>
      </div>

      {/* Safety History Timeline */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900 tracking-tight">
              Safety History Timeline
            </h3>
            <p className="text-xs text-slate-500">
              Chronological log of vision checks, warnings, and supervisor interventions.
            </p>
          </div>

          <button
            onClick={() => setWarningModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Issue Formal Warning</span>
          </button>
        </div>

        <div className="space-y-4">
          {employee.safetyHistory.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-600">{item.id}</span>
                  <span className="text-slate-400">·</span>
                  <span className="font-display font-bold text-slate-900 text-sm">{item.type}</span>
                  <SafetyBadge severity={item.severity} size="sm" />
                </div>

                <p className="text-slate-600 leading-relaxed max-w-2xl">{item.description}</p>

                <div className="text-[11px] text-slate-500 font-mono pt-1">
                  Action Taken: <span className="font-semibold text-slate-800">{item.actionTaken}</span>
                </div>
              </div>

              <div className="text-right shrink-0 font-mono text-[11px] text-slate-400">
                <div className="font-bold text-slate-700">{item.date}</div>
                <div>{item.time}</div>
                <div className="text-blue-600">{item.camera}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warning Modal */}
      <Modal
        isOpen={warningModalOpen}
        onClose={() => setWarningModalOpen(false)}
        title={`Issue Safety Warning to ${employee.name} (${employee.id})`}
      >
        {warningIssuedSuccess ? (
          <div className="p-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-base text-slate-900">Warning Recorded!</h4>
            <p className="text-xs text-slate-600">
              Notification dispatched to employee console and supervisor ledger.
            </p>
          </div>
        ) : (
          <form onSubmit={handleIssueWarning} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Violation Category</label>
              <select
                value={warningType}
                onChange={(e) => setWarningType(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              >
                <option>Mobile Phone Prohibited</option>
                <option>Missing Safety Helmet</option>
                <option>Missing Eye Protection</option>
                <option>Missing Safety Gloves</option>
                <option>Restricted Area Incursion</option>
                <option>Workforce Inactivity / Idle Time</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Supervisor Notes</label>
              <textarea
                value={warningNotes}
                onChange={(e) => setWarningNotes(e.target.value)}
                placeholder="Detail the circumstances of this safety warning..."
                rows={3}
                required
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setWarningModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-rose-600 text-white font-bold"
              >
                Log Warning Notice
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
