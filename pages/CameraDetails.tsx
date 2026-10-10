import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Radio,
  Sliders,
  Users,
  Activity,
  Layers,
  Sparkles,
  PhoneCall,
  User,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { CameraFeed } from '../components/CameraFeed';
import { SafetyBadge } from '../components/SafetyBadge';
import { Modal } from '../components/Modal';

export const CameraDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cameras, employees, violations, acknowledgeAlert, resolveViolation } = useSafety();

  const camera = cameras.find((c) => c.id === (id || 'cam-03')) || cameras[2];
  const primaryEmployee = employees.find((e) => e.id === camera.primaryEmployeeId) || employees[0];

  const [isResolved, setIsResolved] = useState(false);
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [thresholdsModalOpen, setThresholdsModalOpen] = useState(false);
  const [radioPaging, setRadioPaging] = useState(false);

  const handleResolveAndDispatch = () => {
    setIsResolved(true);
    // Resolve matching violation if exists
    const matchingViolation = violations.find((v) => v.employeeId === primaryEmployee.id);
    if (matchingViolation) {
      resolveViolation(matchingViolation.id, 'Floor supervisor dispatched with replacement hardhat.');
    }
  };

  const handleAcknowledge = () => {
    setIsAcknowledged(true);
  };

  const handlePageRadio = () => {
    setRadioPaging(true);
    setTimeout(() => setRadioPaging(false), 2500);
  };

  // Chronological incident audit log for this camera
  const auditLogs = [
    {
      timestamp: '10:15:22 AM',
      event: 'Missing Helmet (Overhead Hazard)',
      subjectId: 'EMP-102 (Ahmed Khan)',
      severity: 'Critical' as const,
      confidence: '99.2%',
      resolution: isResolved ? 'Resolved by Dispatch' : 'Unresolved',
      isRecent: true,
    },
    {
      timestamp: '09:44:10 AM',
      event: 'Forklift Pathway Trespass (Zone Incursion)',
      subjectId: 'EMP-088 (David R.)',
      severity: 'Warning' as const,
      confidence: '94.8%',
      resolution: 'Auto-Alerter Buzzer',
    },
    {
      timestamp: '08:12:05 AM',
      event: 'Missing Cut-Resistant Gloves during Lathe use',
      subjectId: 'EMP-102 (Ahmed Khan)',
      severity: 'Warning' as const,
      confidence: '91.0%',
      resolution: 'Supervisor Notified',
    },
    {
      timestamp: '07:05:50 AM',
      event: 'No High-Visibility Vest in Transit Corridor',
      subjectId: 'VISITOR-14 (Contractor)',
      severity: 'Warning' as const,
      confidence: '97.6%',
      resolution: 'PPE Station Issued',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & RTSP Telemetry */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <button
              onClick={() => navigate('/cameras')}
              className="hover:text-blue-600 transition-colors"
            >
              Live Cameras
            </button>
            <span>&gt;</span>
            <span className="text-slate-800 font-bold">{camera.name} (Detailed Inspection)</span>
          </div>

          <div className="flex items-center gap-3 mt-1">
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              {camera.name}
            </h1>
            {camera.status === 'alert' && !isResolved && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wider animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-600" />
                Active Breach Tripped
              </span>
            )}
          </div>
        </div>

        {/* Telemetry Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono shadow-2xs">
            <span className="text-blue-600 font-bold">Inference Rate:</span>
            <span className="text-slate-800 font-bold">58.4 FPS (Edge Tensor-RT)</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-800 font-bold">RTSP Stream Sub-second 32ms</span>
          </div>

          <button
            onClick={() => setThresholdsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Thresholds</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Large Camera Preview & Detection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Video Feed & Chronological Log (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Large Feed View */}
          <CameraFeed camera={camera} />

          {/* Quick Camera Info Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
              <div className="text-[10px] uppercase font-bold text-slate-400">Assigned Unit</div>
              <div className="text-xs font-bold text-slate-900 mt-0.5 truncate">{camera.assignedUnit}</div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
              <div className="text-[10px] uppercase font-bold text-slate-400">Facility Zone</div>
              <div className="text-xs font-bold text-slate-900 mt-0.5 truncate">{camera.zone}</div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
              <div className="text-[10px] uppercase font-bold text-slate-400">Field of View</div>
              <div className="text-xs font-bold text-slate-900 mt-0.5 truncate">{camera.workersDetected} Workers</div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
              <div className="text-[10px] uppercase font-bold text-slate-400">Connection Link</div>
              <div className="text-xs font-bold text-emerald-700 mt-0.5 flex items-center gap-1 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{camera.connectionLink}</span>
              </div>
            </div>
          </div>

          {/* Chronological Incident Audit Log */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
                  {camera.code} — Chronological Incident Audit Log
                </h3>
                <p className="text-xs text-slate-500">
                  Last 24 Hours ({auditLogs.length} Events Logged)
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500">
                Live Audit
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-semibold uppercase tracking-wider text-slate-500 font-mono">
                  <tr>
                    <th className="p-2.5">Timestamp</th>
                    <th className="p-2.5">Violation Event</th>
                    <th className="p-2.5">Subject ID</th>
                    <th className="p-2.5">Severity</th>
                    <th className="p-2.5">AI Confidence</th>
                    <th className="p-2.5 text-right">Resolution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {auditLogs.map((log, idx) => (
                    <tr key={idx} className={`hover:bg-slate-50 ${log.isRecent ? 'bg-rose-50/30' : ''}`}>
                      <td className="p-2.5 text-slate-500 whitespace-nowrap">
                        {log.isRecent && <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-600 mr-1 animate-pulse" />}
                        {log.timestamp}
                      </td>
                      <td className="p-2.5 font-bold text-slate-800">{log.event}</td>
                      <td className="p-2.5 text-blue-600 font-semibold">{log.subjectId}</td>
                      <td className="p-2.5">
                        <SafetyBadge severity={log.severity} size="sm" />
                      </td>
                      <td className="p-2.5 text-slate-700">{log.confidence}</td>
                      <td className="p-2.5 text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            log.resolution === 'Unresolved'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {log.resolution}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Detection Panel & PPE Checklist (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Safety Violation Detected Box */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <span className="font-display font-bold text-base text-rose-700 tracking-tight">
                  SAFETY VIOLATION DETECTED
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-rose-600 text-white shadow-2xs">
                CRITICAL
              </span>
            </div>

            <div>
              <div className="font-display font-bold text-lg text-slate-900">
                Helmet Not Detected
              </div>
              <div className="text-xs font-semibold text-rose-700 mt-0.5">
                Violation Rule R-101 (Mandatory Head Protection)
              </div>
              <p className="text-xs text-slate-600 mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200/80 leading-relaxed italic">
                "Employee is performing building repair and overhead structure inspection without the required safety helmet in an active lifting overhead crane zone."
              </p>
            </div>

            {/* Employee Information Card */}
            <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={primaryEmployee.photo}
                  alt={primaryEmployee.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <div>
                  <div className="font-bold text-sm text-slate-900">{primaryEmployee.name}</div>
                  <div className="text-xs text-slate-500">{primaryEmployee.role}</div>
                  <div className="text-[11px] font-mono text-blue-600 font-semibold">{primaryEmployee.shift}</div>
                </div>
              </div>
              <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded-md text-blue-700 border border-blue-200 shadow-2xs">
                {primaryEmployee.id}
              </span>
            </div>

            {/* Inference Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60">
                <span className="text-[11px] text-slate-400 block">Activity Inferred</span>
                <span className="font-bold text-slate-800">{primaryEmployee.currentActivity.split('&')[0]}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60">
                <span className="text-[11px] text-slate-400 block">Detection Time</span>
                <span className="font-bold text-slate-800 font-mono">10:15:22 AM Today</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60">
                <span className="text-[11px] text-slate-400 block">AI Model Confidence</span>
                <span className="font-bold text-emerald-700 font-mono">99.2% (High-Fi)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60">
                <span className="text-[11px] text-slate-400 block">Zone Fall Risk</span>
                <span className="font-bold text-rose-700">Tier 1 Severe</span>
              </div>
            </div>

            {/* Automated PPE Inspection Audit Checklist */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                Automated PPE Inspection Audit Checklist
              </div>

              {/* Checklist items */}
              <div className="space-y-1.5 text-xs">
                <div className="p-2 bg-rose-50 rounded-lg border border-rose-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-900 font-bold">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Hardhat / Helmet</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-rose-600 text-white px-2 py-0.5 rounded">
                    MISSING (Rule R-101)
                  </span>
                </div>

                <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-900 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Eye Protection</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    ✓ Compliant (Goggles)
                  </span>
                </div>

                <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-900 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Hand Gloves</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    ✓ Compliant (Cut-Level 4)
                  </span>
                </div>

                <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-900 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Mobile Phone Distraction</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    ✓ Not Detected
                  </span>
                </div>

                <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-900 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Smoking / Flame Incursion</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    ✓ Clear
                  </span>
                </div>

                <div className="p-2 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-900 font-medium">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <span>Physical Engagement</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                    Active Mechanical Work
                  </span>
                </div>
              </div>
            </div>

            {/* Remediation Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleResolveAndDispatch}
                disabled={isResolved}
                className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  isResolved
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>{isResolved ? 'Resolved & Dispatch Confirmed' : 'Resolve & Dispatch Supervisor'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleAcknowledge}
                  disabled={isAcknowledged || isResolved}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                    isAcknowledged || isResolved
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isAcknowledged || isResolved ? 'Acknowledged' : 'Acknowledge Alert'}</span>
                </button>

                <button
                  onClick={() => navigate(`/employees/${primaryEmployee.id}`)}
                  className="py-2 px-3 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Employee Profile</span>
                </button>
              </div>
            </div>

            {/* Assigned Bay Floor Lead & Radio Paging */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Bay Floor Lead</span>
                <span className="text-xs font-bold text-slate-800 block">Elena Rostova (Radio Ch. 4)</span>
              </div>
              <button
                onClick={handlePageRadio}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  radioPaging
                    ? 'bg-emerald-600 text-white animate-pulse'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>{radioPaging ? 'Paging Ch. 4...' : 'Page Radio'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Thresholds Modal */}
      <Modal
        isOpen={thresholdsModalOpen}
        onClose={() => setThresholdsModalOpen(false)}
        title="AI Computer Vision Detection Thresholds"
      >
        <div className="space-y-4 text-xs text-slate-700">
          <div>
            <label className="font-bold text-slate-900 block mb-1">Hardhat Detection Sensitivity (IoU)</label>
            <input type="range" min="70" max="99" defaultValue="92" className="w-full" />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>70% (High Recall)</span>
              <span>92% (Current)</span>
              <span>99% (High Precision)</span>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-900 block mb-1">Arc-Flash Glove Verification Threshold</label>
            <input type="range" min="80" max="99" defaultValue="95" className="w-full" />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>80%</span>
              <span>95% (Current)</span>
              <span>99%</span>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-900 block mb-1">Idle Workforce Inactivity Timeout</label>
            <select className="w-full p-2 border border-slate-200 rounded-lg text-xs">
              <option>10 Minutes</option>
              <option selected>15 Minutes (Default)</option>
              <option>20 Minutes</option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setThresholdsModalOpen(false)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs"
            >
              Apply Calibration
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
