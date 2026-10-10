import React, { useState } from 'react';
import {
  Calendar,
  Download,
  Printer,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  Send,
  Radio,
  FileCheck,
  CheckSquare,
  Square
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { Violation } from '../types';
import { ViolationTable } from '../components/ViolationTable';
import { SafetyBadge } from '../components/SafetyBadge';

export const Violations: React.FC = () => {
  const {
    violations,
    resolveViolation,
    acknowledgeViolation,
    escalateViolation,
    updateViolationChecklist,
  } = useSafety();

  const [selectedViolation, setSelectedViolation] = useState<Violation>(
    violations[0] || null
  );

  const [triageNotes, setTriageNotes] = useState<string>('');
  const [resolutionSuccess, setResolutionSuccess] = useState<boolean>(false);

  const handleSelectViolation = (v: Violation) => {
    setSelectedViolation(v);
    setTriageNotes(v.triageNotes || '');
    setResolutionSuccess(false);
  };

  const handleMarkResolved = () => {
    if (!selectedViolation) return;
    resolveViolation(selectedViolation.id, triageNotes);
    setSelectedViolation((prev) => ({
      ...prev,
      status: 'Resolved',
      triageNotes: triageNotes || 'Physical verification confirmed. Hardhat supplied.',
      checklist: {
        audioAlertFired: true,
        supervisorNotified: true,
        ppeVerified: true,
      },
    }));
    setResolutionSuccess(true);
    setTimeout(() => setResolutionSuccess(false), 3000);
  };

  const handleEscalateToHR = () => {
    if (!selectedViolation) return;
    escalateViolation(selectedViolation.id);
    setSelectedViolation((prev) => ({
      ...prev,
      status: 'Escalated',
    }));
  };

  const handleToggleChecklist = (key: 'audioAlertFired' | 'supervisorNotified' | 'ppeVerified') => {
    if (!selectedViolation) return;
    const current = selectedViolation.checklist || {
      audioAlertFired: false,
      supervisorNotified: false,
      ppeVerified: false,
    };
    const newVal = !current[key];
    updateViolationChecklist(selectedViolation.id, key, newVal);
    setSelectedViolation((prev) => ({
      ...prev,
      checklist: {
        ...current,
        [key]: newVal,
      },
    }));
  };

  const criticalCount = violations.filter((v) => v.severity === 'Critical' && v.status !== 'Resolved').length;
  const warningsCount = violations.filter((v) => v.severity === 'Warning' && v.status !== 'Resolved').length;
  const resolvedCount = violations.filter((v) => v.status === 'Resolved').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span className="uppercase font-bold text-slate-500">Vision Audit Stream</span>
            <span>·</span>
            <span className="text-emerald-600 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Synced 2s ago
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-1">
            Safety Violations Log & Incident Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track, triage, and resolve workplace safety and PPE violations detected across all factory cameras in real time.
          </p>
        </div>

        {/* Header Tools */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Today (Shift 02)</span>
          </div>

          <button
            onClick={() => {
              // Simulated CSV download
              const csvContent =
                'data:text/csv;charset=utf-8,' +
                'ID,Employee,Activity,Department,Camera,Violation,Severity,Status,Timestamp\n' +
                violations
                  .map(
                    (v) =>
                      `"${v.id}","${v.employeeName}","${v.activity}","${v.department}","${v.cameraCode}","${v.violationType}","${v.severity}","${v.status}","${v.timestamp}"`
                  )
                  .join('\n');
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement('a');
              link.setAttribute('href', encodedUri);
              link.setAttribute('download', 'safefactory_violations_export.csv');
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Log</span>
          </button>
        </div>
      </div>

      {/* 5 Incident Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Total Violations Today</span>
            <AlertTriangle className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="font-display font-bold text-2xl sm:text-3xl text-slate-900 mt-2">
            {violations.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">+4 vs yesterday</div>
        </div>

        <div className="bg-white rounded-xl border border-rose-200 p-4 shadow-2xs bg-rose-50/20">
          <div className="flex items-center justify-between text-xs text-rose-700 font-bold uppercase">
            <span>Critical Unresolved</span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
          </div>
          <div className="font-display font-bold text-2xl sm:text-3xl text-rose-700 mt-2">
            {criticalCount}
          </div>
          <div className="text-[11px] text-rose-600 font-semibold mt-1">Immediate Action Required</div>
        </div>

        <div className="bg-white rounded-xl border border-amber-200 p-4 shadow-2xs bg-amber-50/20">
          <div className="flex items-center justify-between text-xs text-amber-800 font-bold uppercase">
            <span>Warnings Pending</span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="font-display font-bold text-2xl sm:text-3xl text-amber-800 mt-2">
            {warningsCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Triage in progress</div>
        </div>

        <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-2xs bg-emerald-50/20">
          <div className="flex items-center justify-between text-xs text-emerald-800 font-bold uppercase">
            <span>Resolved Today</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="font-display font-bold text-2xl sm:text-3xl text-emerald-700 mt-2">
            {resolvedCount}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            {((resolvedCount / violations.length) * 100).toFixed(1)}% Clear rate
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Avg Triage Time</span>
            <Clock className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="font-display font-bold text-2xl sm:text-3xl text-slate-900 mt-2">
            4.2 <span className="text-sm font-sans font-normal text-slate-400">mins</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">-1.1m (optimal &lt; 8m)</div>
        </div>
      </div>

      {/* Main Violation Table */}
      <ViolationTable
        violations={violations}
        onSelectViolation={handleSelectViolation}
        selectedViolationId={selectedViolation?.id}
        onResolve={resolveViolation}
        onAcknowledge={acknowledgeViolation}
      />

      {/* Selected Incident Telemetry Context & Triage Protocol Split View */}
      {selectedViolation && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): Telemetry Context Frame & Video Snapshot */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
                <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
                  Incident Telemetry Context — {selectedViolation.id}
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">FRAME #994821</span>
            </div>

            {/* Simulated Event Snapshot Frame */}
            <div className="relative aspect-video rounded-xl bg-slate-950 overflow-hidden border border-slate-800">
              <img
                src={selectedViolation.imageSnapshot || '/src/assets/images/cam_maintenance_bay_1791271973666.jpg'}
                alt={selectedViolation.violationType}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />

              {/* Top HUD */}
              <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-white/90 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded border border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>{selectedViolation.cameraCode} · {selectedViolation.location}</span>
                </div>
                <span>1080P · 30 FPS · {selectedViolation.timestamp}</span>
              </div>

              {/* Bounding Box on Frame */}
              <div
                style={{ left: '42%', top: '26%', width: '22%', height: '52%' }}
                className="absolute border-2 border-rose-500 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.4)] rounded-xs pointer-events-none"
              >
                <div className="bg-rose-600 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 absolute -top-5 left-0 uppercase">
                  ▲ {selectedViolation.violationType} ({selectedViolation.confidence}%)
                </div>
                <div className="bg-emerald-600 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 absolute bottom-2 left-2 uppercase">
                  VEST OK (99%)
                </div>
              </div>

              {/* Playback Sub-bar */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-white/80 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded border border-white/10">
                <span>00:04 / 00:15 (Event Clip)</span>
                <span className="text-emerald-400">Recorded Incident Capture</span>
              </div>
            </div>

            {/* Contextual Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60 font-mono">
                <span className="text-[10px] text-slate-400 uppercase block">Detection Model</span>
                <span className="font-bold text-slate-800">YOLOv9-PPE-v4.1</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60 font-mono">
                <span className="text-[10px] text-slate-400 uppercase block">Inference Latency</span>
                <span className="font-bold text-emerald-700">14.8 ms</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60">
                <span className="text-[10px] text-slate-400 uppercase block">Zone Clearance</span>
                <span className="font-bold text-slate-800 truncate block">Mandatory Zone</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60">
                <span className="text-[10px] text-slate-400 uppercase block">Supervisor On Duty</span>
                <span className="font-bold text-slate-800 truncate block">R. Sterling (Lead)</span>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Triage Protocol & Remediation */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
                Triage Protocol
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 uppercase">
                Priority 1
              </span>
            </div>

            {resolutionSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Violation status updated to Resolved in forensic ledger.</span>
              </div>
            )}

            {/* Standard Remediation Steps Checklist */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Standard Remediation Steps
              </span>

              <div
                onClick={() => handleToggleChecklist('audioAlertFired')}
                className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-2.5 text-xs"
              >
                {selectedViolation.checklist?.audioAlertFired ? (
                  <CheckSquare className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-slate-900">Automated Speaker Alert Fired</div>
                  <div className="text-[11px] text-slate-500">PA broadcast triggered to bay zone</div>
                </div>
              </div>

              <div
                onClick={() => handleToggleChecklist('supervisorNotified')}
                className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-2.5 text-xs"
              >
                {selectedViolation.checklist?.supervisorNotified ? (
                  <CheckSquare className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-slate-900">Shift Supervisor Notified</div>
                  <div className="text-[11px] text-slate-500">SMS & Radio ping dispatched to bay steward</div>
                </div>
              </div>

              <div
                onClick={() => handleToggleChecklist('ppeVerified')}
                className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-2.5 text-xs"
              >
                {selectedViolation.checklist?.ppeVerified ? (
                  <CheckSquare className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-slate-900">Physical PPE Verification</div>
                  <div className="text-[11px] text-slate-500">Confirm worker has donned compliant PPE equipment</div>
                </div>
              </div>
            </div>

            {/* Resolution Notes Textarea */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Resolution Note / Corrective Action
              </label>
              <textarea
                value={triageNotes}
                onChange={(e) => setTriageNotes(e.target.value)}
                placeholder="Document supervisor intervention, safety coaching provided, or equipment replacement..."
                rows={3}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-blue-500 outline-hidden transition-colors"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={handleEscalateToHR}
                className="flex-1 py-2 px-3 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
              >
                Escalate to HR
              </button>

              <button
                onClick={handleMarkResolved}
                className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
              >
                Mark Resolved
              </button>
            </div>

            <div className="text-center pt-1">
              <span className="text-[10px] font-mono text-slate-400">
                Logged with immutable SHA-256 audit seal #8f92b7c
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
