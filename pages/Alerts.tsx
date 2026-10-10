import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Radio,
  Flame,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Bell,
  Volume2,
  VolumeX,
  Filter,
  Eye,
  Plus,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { Alert } from '../types';
import { SafetyBadge } from '../components/SafetyBadge';
import { soundManager } from '../utils/soundEffects';

export const Alerts: React.FC = () => {
  const navigate = useNavigate();
  const { alerts, acknowledgeAlert, resolveAlert, addAlert, stats } = useSafety();

  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [alarmSoundEnabled, setAlarmSoundEnabled] = useState<boolean>(true);
  const [activeHornAnimation, setActiveHornAnimation] = useState<boolean>(false);
  const [testChimePlaying, setTestChimePlaying] = useState<boolean>(false);

  const handleToggleSound = () => {
    const nextState = !alarmSoundEnabled;
    setAlarmSoundEnabled(nextState);
    soundManager.setSoundEnabled(nextState);
  };

  const handleTestChime = () => {
    setTestChimePlaying(true);
    soundManager.playWarningChime();
    setTimeout(() => setTestChimePlaying(false), 2000);
  };

  const handleTestSiren = () => {
    setActiveHornAnimation(true);
    soundManager.playIndustrialSiren();
    setTimeout(() => setActiveHornAnimation(false), 2800);
  };

  const handleSimulateAlert = () => {
    const id = `ALT-${Date.now().toString().slice(-4)}`;
    const newAlert: Alert = {
      id,
      title: 'Restricted Hazardous Zone Perimeter Breach',
      severity: 'critical',
      employeeId: 'EMP-145',
      employeeName: 'David Miller',
      department: 'Heavy Maintenance',
      cameraCode: 'CAM-03',
      location: 'Maintenance Bay 2 (Under Overhead Crane)',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeAgo: 'Just now',
      description: 'Technician stepped across perimeter boundary while crane hoist was cycling overhead.',
      acknowledged: false,
      resolved: false,
      autoHaltEnabled: true,
    };
    addAlert(newAlert);
    handleTestSiren();
  };

  const filteredAlerts = alerts.filter((a) => {
    if (severityFilter !== 'All' && a.severity !== severityFilter.toLowerCase()) return false;
    if (statusFilter === 'Pending' && (a.acknowledged || a.resolved)) return false;
    if (statusFilter === 'Acknowledged' && (!a.acknowledged || a.resolved)) return false;
    if (statusFilter === 'Resolved' && !a.resolved) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span className="uppercase font-bold text-slate-500">Emergency Dispatch</span>
            <span>·</span>
            <span className="text-rose-600 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
              Active Warning Siren Network
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-1">
            Factory Safety Warning & Alert Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time critical incursion stream, hazardous zone breaches, and automated PPE non-compliance alarms.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleToggleSound}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
              alarmSoundEnabled
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-slate-200 text-slate-500'
            }`}
          >
            {alarmSoundEnabled ? <Volume2 className="w-3.5 h-3.5 text-blue-600" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
            <span>Audible Bell Sound: {alarmSoundEnabled ? 'ENABLED' : 'MUTED'}</span>
          </button>

          <button
            onClick={handleSimulateAlert}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Simulate Hazardous Alert</span>
          </button>
        </div>
      </div>

      {/* Industrial Warning Siren & Bell Console Hero Banner */}
      <div className="bg-linear-to-r from-slate-950 via-rose-950/80 to-slate-900 border border-rose-500/40 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            {/* Animated Industrial Bell Icon */}
            <div
              onClick={handleTestChime}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border cursor-pointer transition-all shadow-xl ${
                testChimePlaying || activeHornAnimation
                  ? 'bg-rose-500 border-amber-300 ring-4 ring-rose-500/40'
                  : 'bg-rose-600 border-rose-400/50 hover:bg-rose-500'
              }`}
              title="Click to ring safety warning bell"
            >
              <Bell className="w-7 h-7 text-white animate-bell-ring" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-600 text-white uppercase tracking-wider">
                  BELL SIREN ACTIVE
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  PA HORN CHANNELS: 100% ONLINE (95 dB)
                </span>
              </div>
              <div className="font-display font-bold text-lg text-white">
                Workforce Incident Warning & Siren Telemetry Controller
              </div>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Edge vision AI sensors automatically ring the station warning bell and trigger audible floor chimes when unmitigated safety infractions occur.
              </p>
            </div>
          </div>

          {/* Sound Controls */}
          <div className="flex flex-wrap items-center gap-2.5 sm:self-auto self-start">
            <button
              onClick={handleTestChime}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Volume2 className="w-4 h-4 text-amber-300" />
              <span>Ring Warning Bell</span>
            </button>

            <button
              onClick={handleTestSiren}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/30 cursor-pointer active:scale-95"
            >
              <Radio className="w-4 h-4" />
              <span>Trigger Siren</span>
            </button>
          </div>
        </div>

        {/* Warning Level Escalation Tier Strip */}
        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Level 1: Verbal Notice</span>
              <span className="text-xs font-bold text-white mt-0.5 block">Automated Console Chime</span>
            </div>
            <span className="font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
              8 Active
            </span>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Level 2: Written Warning</span>
              <span className="text-xs font-bold text-white mt-0.5 block">Supervisor Floor Dispatch</span>
            </div>
            <span className="font-mono font-bold text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded">
              3 Active
            </span>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Level 3: Escalation Tier</span>
              <span className="text-xs font-bold text-white mt-0.5 block">Floor Access Suspension</span>
            </div>
            <span className="font-mono font-bold text-rose-300 bg-rose-600/20 px-2 py-0.5 rounded">
              1 Escalated
            </span>
          </div>
        </div>
      </div>

      {/* Alarm Broadcast Banner if siren active */}
      {activeHornAnimation && (
        <div className="p-4 bg-rose-600 text-white rounded-xl flex items-center justify-between shadow-xl animate-bounce">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 animate-bell-ring" />
            <div>
              <div className="font-bold text-sm">EMERGENCY DISPATCH INITIATED!</div>
              <div className="text-xs opacity-90">Simulated hazardous breach transmitted to PA channel and bay supervisors.</div>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-white text-rose-700 px-3 py-1 rounded-md">
            SIREN LEVEL 1 ACTIVE
          </span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Severity:</span>
          {['All', 'Critical', 'Warning'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                severityFilter === sev
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Status:</span>
          {['All', 'Pending', 'Acknowledged', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3.5">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
            No active safety alerts matching your filter criteria.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 rounded-xl border bg-white shadow-2xs transition-all hover:shadow-xs ${
                alert.severity === 'critical'
                  ? alert.resolved
                    ? 'border-slate-200'
                    : 'border-rose-300 ring-1 ring-rose-300/30'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      alert.severity === 'critical'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    <Bell className={`w-5 h-5 ${!alert.acknowledged ? 'animate-bell-ring' : ''}`} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
                        {alert.title}
                      </h3>
                      <SafetyBadge severity={alert.severity} size="sm" />
                      {alert.resolved ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Resolved
                        </span>
                      ) : alert.acknowledged ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          Acknowledged
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                          Pending Triage
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                      {alert.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono text-slate-500">
                      <span>Camera: <strong className="text-slate-800">{alert.cameraCode}</strong></span>
                      <span>·</span>
                      <span>Dept: <strong className="text-slate-800">{alert.department}</strong></span>
                      <span>·</span>
                      <span>Location: <strong className="text-slate-800">{alert.location}</strong></span>
                      {alert.employeeId && (
                        <>
                          <span>·</span>
                          <span className="text-blue-600 font-bold">{alert.employeeId}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => {
                      soundManager.playWarningChime();
                    }}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                    title="Ring audio bell for this station"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                  </button>

                  <button
                    onClick={() => navigate(`/cameras/${alert.cameraCode === 'CAM-03' ? 'cam-03' : 'cam-01'}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>View Feed</span>
                  </button>

                  {!alert.acknowledged && (
                    <button
                      onClick={() => {
                        acknowledgeAlert(alert.id);
                        soundManager.playAcknowledgeBeep();
                      }}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs cursor-pointer"
                    >
                      Acknowledge
                    </button>
                  )}

                  {alert.acknowledged && !alert.resolved && (
                    <button
                      onClick={() => {
                        resolveAlert(alert.id);
                        soundManager.playAcknowledgeBeep();
                      }}
                      className="flex items-center gap-1 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Resolve</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
