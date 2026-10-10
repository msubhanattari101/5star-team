import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Play,
  RotateCcw,
  Download,
  Flame,
  Smartphone,
  Eye,
  HardHat,
  Hand,
  Clock,
  Sparkles,
  Radio,
  Bell
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { evaluateSafetyRules } from '../utils/safetyDetection';
import { SafetyDetectionInput, SafetyDetectionResult } from '../types';

export const SafetyDetectionSimulator: React.FC = () => {
  const { employees, rules, addViolation, addAlert } = useSafety();

  // Selected Preset
  const [selectedPreset, setSelectedPreset] = useState<string>('preset-1');

  // Interactive Parameters
  const [employeeId, setEmployeeId] = useState<string>('EMP-102');
  const [location, setLocation] = useState<string>('Maintenance Bay 2 (Overhead Gantry)');
  const [activity, setActivity] = useState<string>('Building Repair');
  const [workingTime, setWorkingTime] = useState<boolean>(true);

  // PPE & Behavioral States
  const [helmet, setHelmet] = useState<boolean>(false);
  const [eyeProtection, setEyeProtection] = useState<boolean>(true);
  const [gloves, setGloves] = useState<boolean>(true);
  const [mobilePhone, setMobilePhone] = useState<boolean>(false);
  const [smoking, setSmoking] = useState<boolean>(false);
  const [idle, setIdle] = useState<boolean>(false);

  // Evaluation Result
  const [result, setResult] = useState<SafetyDetectionResult | null>(null);
  const [lastCheckedTime, setLastCheckedTime] = useState<string>('Just now');
  const [alarmFired, setAlarmFired] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Apply scenario preset
  const handleSelectPreset = (presetKey: string) => {
    setSelectedPreset(presetKey);
    switch (presetKey) {
      case 'preset-1': // Building repair without helmet
        setEmployeeId('EMP-102');
        setActivity('Building Repair');
        setLocation('Maintenance Bay 2 (Overhead Gantry)');
        setHelmet(false);
        setEyeProtection(true);
        setGloves(true);
        setMobilePhone(false);
        setSmoking(false);
        setIdle(false);
        break;

      case 'preset-2': // Electrical work without gloves
        setEmployeeId('EMP-076');
        setActivity('Electrical Work');
        setLocation('High Voltage Substation 3');
        setHelmet(true);
        setEyeProtection(true);
        setGloves(false);
        setMobilePhone(false);
        setSmoking(false);
        setIdle(false);
        break;

      case 'preset-3': // Welding without eye protection
        setEmployeeId('EMP-218');
        setActivity('Welding');
        setLocation('Welding Bay Cell C-4');
        setHelmet(true);
        setEyeProtection(false);
        setGloves(true);
        setMobilePhone(false);
        setSmoking(false);
        setIdle(false);
        break;

      case 'preset-4': // Smoking prohibited
        setEmployeeId('EMP-412');
        setActivity('Component Maintenance');
        setLocation('Repair Workshop North');
        setHelmet(true);
        setEyeProtection(true);
        setGloves(true);
        setMobilePhone(false);
        setSmoking(true);
        setIdle(false);
        break;

      case 'preset-5': // Mobile phone during working hours
        setEmployeeId('EMP-145');
        setActivity('Assembly & Conveyor');
        setLocation('Assembly Line Alpha (Bay 1)');
        setHelmet(true);
        setEyeProtection(true);
        setGloves(true);
        setMobilePhone(true);
        setSmoking(false);
        setIdle(false);
        break;

      case 'preset-6': // Idle employee
        setEmployeeId('EMP-331');
        setActivity('Assembly & Conveyor');
        setLocation('Warehouse Mezzanine B');
        setHelmet(true);
        setEyeProtection(true);
        setGloves(true);
        setMobilePhone(false);
        setSmoking(false);
        setIdle(true);
        break;

      case 'preset-7': // 100% Compliant
        setEmployeeId('EMP-102');
        setActivity('Building Repair');
        setLocation('Maintenance Bay 2 (Overhead Gantry)');
        setHelmet(true);
        setEyeProtection(true);
        setGloves(true);
        setMobilePhone(false);
        setSmoking(false);
        setIdle(false);
        break;

      default:
        break;
    }
  };

  // Run Safety Check logic
  const runCheck = () => {
    const input: SafetyDetectionInput = {
      employeeId,
      activity,
      location,
      workingTime,
      helmet,
      eyeProtection,
      gloves,
      mobilePhone,
      smoking,
      idle,
      helmetRequired: true,
    };

    const evalResult = evaluateSafetyRules(input, rules);
    setResult(evalResult);
    setLastCheckedTime(new Date().toLocaleTimeString());

    // Show temporary feedback toast
    if (evalResult.hasViolation) {
      setToastMessage(`Violation Logged: ${evalResult.violationType}`);
    } else {
      setToastMessage('Nominal Compliance: Zero Infractions Detected');
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Run on mount or preset switch
  useEffect(() => {
    runCheck();
  }, [helmet, eyeProtection, gloves, mobilePhone, smoking, idle, activity]);

  const handleResetDefaults = () => {
    handleSelectPreset('preset-1');
  };

  const handleEscalateAlarm = () => {
    setAlarmFired(true);
    setTimeout(() => setAlarmFired(false), 4000);

    if (result && result.hasViolation) {
      addAlert({
        id: `ALT-SIM-${Date.now().toString().slice(-4)}`,
        title: `${result.violationType} (Simulated Alarm)`,
        severity: result.severity === 'Critical' ? 'critical' : 'warning',
        employeeId,
        department: 'Simulation Bay',
        cameraCode: 'CAM-SIM',
        location,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timeAgo: 'Just now',
        description: result.reason,
        acknowledged: false,
        resolved: false,
        autoHaltEnabled: result.severity === 'Critical',
      });
    }
  };

  const selectedEmployee = employees.find((e) => e.id === employeeId);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Alarm Broadcast Banner */}
      {alarmFired && (
        <div className="bg-rose-600 text-white px-4 py-3 rounded-xl flex items-center justify-between shadow-lg animate-pulse">
          <div className="flex items-center gap-2.5 font-bold text-sm">
            <Radio className="w-5 h-5 animate-spin" />
            <span>AUDIBLE FLOOR ALARM BROADCAST INITIATED FOR {location.toUpperCase()}!</span>
          </div>
          <span className="text-xs bg-rose-700 px-2 py-1 rounded">Strobes Active</span>
        </div>
      )}

      {/* Main Grid: Parameters on Left, Vision Canvas & Verdict on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Simulation Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  Simulation Parameters
                </h3>
                <p className="text-xs text-slate-500">
                  Adjust state variables to test inference pipeline response.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                ENV-LIVE
              </span>
            </div>

            {/* Pre-configured Scenarios Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Pre-configured Scenarios
              </label>
              <select
                value={selectedPreset}
                onChange={(e) => handleSelectPreset(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 font-medium text-slate-800 outline-hidden focus:border-blue-500"
              >
                <option value="preset-1">Preset 1: Building repair without helmet (EMP-102)</option>
                <option value="preset-2">Preset 2: Electrical work without dielectric gloves (EMP-076)</option>
                <option value="preset-3">Preset 3: Welding without eye protection shield (EMP-218)</option>
                <option value="preset-4">Preset 4: Smoking prohibited inside facility (EMP-412)</option>
                <option value="preset-5">Preset 5: Mobile phone in hand during work shift (EMP-145)</option>
                <option value="preset-6">Preset 6: Employee idle & inactive on shift (EMP-331)</option>
                <option value="preset-7">Preset 7: 100% Full Nominal PPE Compliance</option>
              </select>
            </div>

            {/* Contextual Metadata Box */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Contextual Metadata
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Employee</label>
                  <select
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full border border-slate-200 rounded-md p-1.5 bg-white text-xs font-bold text-slate-800"
                  >
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.id} ({emp.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Assigned Activity</label>
                  <select
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    className="w-full border border-slate-200 rounded-md p-1.5 bg-white text-xs font-bold text-slate-800"
                  >
                    <option value="Building Repair">Building Repair</option>
                    <option value="Electrical Work">Electrical Work</option>
                    <option value="Welding">Welding</option>
                    <option value="Assembly & Conveyor">Assembly & Conveyor</option>
                    <option value="Component Maintenance">Component Maintenance</option>
                    <option value="Break / Rest Area">Break / Rest Area</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Sensor Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border border-slate-200 rounded-md px-2 py-1.5 bg-white text-xs text-slate-800"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">Active Shift Hours</span>
                <span className="text-xs font-mono font-bold text-slate-700">2h 15m (Active)</span>
              </div>
            </div>

            {/* Interactive PPE & Behavioral Switches */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-700">
                  Simulated PPE & Behavioral Inputs
                </span>
                <span className="text-[11px] text-slate-400">Click to toggle state</span>
              </div>

              {/* Helmet Switch */}
              <div
                onClick={() => setHelmet(!helmet)}
                className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                  helmet ? 'bg-emerald-50/50 border-emerald-300' : 'bg-rose-50/50 border-rose-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${helmet ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    <HardHat className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">Safety Helmet</div>
                    <div className={`text-[11px] font-semibold ${helmet ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {helmet ? 'Verified On Head' : 'Missing / Not Detected'}
                    </div>
                  </div>
                </div>
                <div className={`w-10 h-5 rounded-full flex items-center p-0.5 transition-colors ${helmet ? 'bg-emerald-600 justify-end' : 'bg-rose-600 justify-start'}`}>
                  <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                </div>
              </div>

              {/* Eye Protection Switch */}
              <div
                onClick={() => setEyeProtection(!eyeProtection)}
                className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                  eyeProtection ? 'bg-emerald-50/50 border-emerald-300' : 'bg-rose-50/50 border-rose-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${eyeProtection ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">Eye Protection / Visor</div>
                    <div className={`text-[11px] font-semibold ${eyeProtection ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {eyeProtection ? 'Verified On Head' : 'Missing / Not Detected'}
                    </div>
                  </div>
                </div>
                <div className={`w-10 h-5 rounded-full flex items-center p-0.5 transition-colors ${eyeProtection ? 'bg-emerald-600 justify-end' : 'bg-rose-600 justify-start'}`}>
                  <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                </div>
              </div>

              {/* Safety Gloves Switch */}
              <div
                onClick={() => setGloves(!gloves)}
                className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                  gloves ? 'bg-emerald-50/50 border-emerald-300' : 'bg-rose-50/50 border-rose-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${gloves ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    <Hand className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">Safety Gloves</div>
                    <div className={`text-[11px] font-semibold ${gloves ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {gloves ? 'Industrial Gloves On' : 'Bare Hands / Missing'}
                    </div>
                  </div>
                </div>
                <div className={`w-10 h-5 rounded-full flex items-center p-0.5 transition-colors ${gloves ? 'bg-emerald-600 justify-end' : 'bg-rose-600 justify-start'}`}>
                  <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                </div>
              </div>

              {/* Mobile Phone Switch */}
              <div
                onClick={() => setMobilePhone(!mobilePhone)}
                className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                  !mobilePhone ? 'bg-slate-50 border-slate-200' : 'bg-amber-50/70 border-amber-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${!mobilePhone ? 'bg-slate-200 text-slate-600' : 'bg-amber-100 text-amber-800'}`}>
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">Mobile Phone In Hand</div>
                    <div className={`text-[11px] font-semibold ${!mobilePhone ? 'text-slate-500' : 'text-amber-800'}`}>
                      {mobilePhone ? 'Active Phone Use Detected' : 'Not in Use (Safe)'}
                    </div>
                  </div>
                </div>
                <div className={`w-10 h-5 rounded-full flex items-center p-0.5 transition-colors ${mobilePhone ? 'bg-amber-600 justify-end' : 'bg-slate-300 justify-start'}`}>
                  <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                </div>
              </div>

              {/* Smoking Switch */}
              <div
                onClick={() => setSmoking(!smoking)}
                className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                  !smoking ? 'bg-slate-50 border-slate-200' : 'bg-rose-50/70 border-rose-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${!smoking ? 'bg-slate-200 text-slate-600' : 'bg-rose-100 text-rose-700'}`}>
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">Smoking / Vapor Incursion</div>
                    <div className={`text-[11px] font-semibold ${!smoking ? 'text-slate-500' : 'text-rose-700'}`}>
                      {smoking ? 'Smoking / Vape Detected' : 'Clear (Negative)'}
                    </div>
                  </div>
                </div>
                <div className={`w-10 h-5 rounded-full flex items-center p-0.5 transition-colors ${smoking ? 'bg-rose-600 justify-end' : 'bg-slate-300 justify-start'}`}>
                  <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                </div>
              </div>

              {/* Idle Switch */}
              <div
                onClick={() => setIdle(!idle)}
                className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                  !idle ? 'bg-slate-50 border-slate-200' : 'bg-amber-50/70 border-amber-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${!idle ? 'bg-slate-200 text-slate-600' : 'bg-amber-100 text-amber-800'}`}>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">Motion Telemetry</div>
                    <div className={`text-[11px] font-semibold ${!idle ? 'text-emerald-700' : 'text-amber-800'}`}>
                      {idle ? 'Stationary / Inactive >15m' : 'Active Task Movement'}
                    </div>
                  </div>
                </div>
                <div className={`w-10 h-5 rounded-full flex items-center p-0.5 transition-colors ${idle ? 'bg-amber-600 justify-end' : 'bg-slate-300 justify-start'}`}>
                  <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                </div>
              </div>
            </div>

            {/* Run Button */}
            <div className="pt-2">
              <button
                onClick={runCheck}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Run Safety Check</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Vision Simulation Canvas & Incident Output (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Visual Stream Simulation Viewport */}
          <div className="relative aspect-video rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 shadow-xl">
            <img
              src="/src/assets/images/cam_maintenance_bay_1791271973666.jpg"
              alt="Simulation Stream"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover select-none"
            />

            {/* HUD Header */}
            <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[11px] font-mono text-white/90 bg-black/70 backdrop-blur-xs px-3 py-1 rounded-lg border border-white/10 pointer-events-none">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>SIMULATION STREAM — {location.split('(')[0]}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 font-bold">FPS: 29.97</span>
                <span className="text-white/80">CONF: 98.2%</span>
              </div>
            </div>

            {/* Dynamic Bounding Box rendered on the canvas */}
            <div
              style={{ left: '38%', top: '24%', width: '26%', height: '52%' }}
              className={`absolute border-2 rounded-xs transition-all pointer-events-none ${
                result?.hasViolation
                  ? result.severity === 'Critical'
                    ? 'border-rose-500 bg-rose-500/10 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                    : 'border-amber-400 bg-amber-400/10 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                  : 'border-emerald-400 bg-emerald-400/10 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
              }`}
            >
              <div
                className={`font-mono text-[10px] font-bold px-2 py-0.5 absolute -top-6 left-0 rounded-xs flex items-center gap-1 uppercase tracking-wider text-white ${
                  result?.hasViolation
                    ? result.severity === 'Critical'
                      ? 'bg-rose-600'
                      : 'bg-amber-600'
                    : 'bg-emerald-600'
                }`}
              >
                <span>[{employeeId}] {activity}</span>
              </div>

              {/* Tag Overlays */}
              <div className="space-y-1 p-2">
                <div
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${
                    helmet ? 'bg-emerald-700/90 text-white' : 'bg-rose-700/90 text-white animate-pulse'
                  }`}
                >
                  <span>{helmet ? '✓ Helmet OK' : '✕ NO HELMET'}</span>
                </div>

                <div
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${
                    eyeProtection ? 'bg-emerald-700/90 text-white' : 'bg-rose-700/90 text-white'
                  }`}
                >
                  <span>{eyeProtection ? '✓ Eye Visor OK' : '✕ EYE SHIELD OFF'}</span>
                </div>

                <div
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${
                    gloves ? 'bg-emerald-700/90 text-white' : 'bg-rose-700/90 text-white'
                  }`}
                >
                  <span>{gloves ? '✓ Gloves L4' : '✕ GLOVES MISSING'}</span>
                </div>

                {mobilePhone && (
                  <div className="bg-amber-700/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 animate-bounce">
                    <span>⚠ MOBILE DETECTED</span>
                  </div>
                )}

                {smoking && (
                  <div className="bg-rose-700/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 animate-pulse">
                    <span>🔥 SMOKING DETECTED</span>
                  </div>
                )}

                {idle && (
                  <div className="bg-amber-700/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                    <span>⏳ WORKER INACTIVE</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom HUD */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-white/80 bg-black/70 backdrop-blur-xs px-3 py-1 rounded-lg border border-white/10 pointer-events-none">
              <span>CV Node: #DET-EDGE-04 · Latency: 11.4ms</span>
              <span className="text-emerald-400">Spatial IoU: 0.89 · Track ID: #9041</span>
            </div>
          </div>

          {/* Verdict Banner */}
          {result && (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  result.hasViolation
                    ? result.severity === 'Critical'
                      ? 'bg-rose-50 border-rose-300 text-rose-900'
                      : 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  {result.hasViolation ? (
                    result.severity === 'Critical' ? (
                      <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                    )
                  ) : (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  )}
                  <div>
                    <div className="font-display font-bold text-base tracking-tight">
                      {result.hasViolation
                        ? `SAFETY VIOLATION: ${result.violationType}`
                        : 'NOMINAL SAFETY COMPLIANCE VERIFIED'}
                    </div>
                    <div className="text-xs opacity-80 mt-0.5">
                      Evaluated {lastCheckedTime} · Policy Rule {result.ruleCode}
                    </div>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                    result.hasViolation
                      ? result.severity === 'Critical'
                        ? 'bg-rose-600 text-white'
                        : 'bg-amber-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {result.severity}
                </span>
              </div>

              {/* Detailed Breakdown Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column: Rule & Reason */}
                  <div className="space-y-3">
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Rule Triggered
                      </div>
                      <div className="font-display font-bold text-sm text-slate-900 mt-0.5">
                        {result.ruleCode}: {result.ruleName}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Reason Statement
                      </div>
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                        "{result.reason}"
                      </p>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Affected Personnel
                      </div>
                      <div className="text-xs text-slate-800 font-medium mt-0.5">
                        {employeeId} — {selectedEmployee ? selectedEmployee.name : 'Unknown'} ({activity})
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Recommended Action & Automated Steps */}
                  <div className="space-y-3">
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Recommended Action
                      </div>
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                        {result.recommendedAction}
                      </p>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        System Automated Responses
                      </div>
                      <div className="space-y-1.5">
                        {result.automatedResponses.map((res, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>{res}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Trigger Controls */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="font-mono text-slate-400">
                    Telemetry Hash: <span className="text-slate-600">{result.telemetryHash}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleResetDefaults}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>

                    <button
                      onClick={handleEscalateAlarm}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors shadow-xs"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>Escalate to Floor Alarm</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Vision Model Inspection Classes (10 Rules Checklist) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-bold text-sm text-slate-900">
                Active Vision Model Inspection Classes
              </h4>
              <span className="text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                10/10 Online
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {rules.map((r, idx) => {
                const isTriggered = result && result.ruleCode === r.code;
                return (
                  <div
                    key={r.id}
                    className={`p-2.5 rounded-lg border flex items-center justify-between ${
                      isTriggered
                        ? 'bg-rose-50 border-rose-300 font-bold text-rose-800'
                        : 'bg-slate-50/60 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <span className="truncate">{r.name}</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded shrink-0 ml-2 ${
                        isTriggered
                          ? 'bg-rose-600 text-white font-bold'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isTriggered ? 'Triggered' : 'Active Monitor'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
