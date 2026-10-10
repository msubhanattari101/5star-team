import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Video,
  ShieldAlert,
  AlertTriangle,
  Flame,
  ShieldCheck,
  UserX,
  Radio,
  Calendar,
  Download,
  Filter,
  CheckCircle2,
  ChevronRight,
  TrendingDown,
  Layers,
  Sparkles,
  Bell,
  Volume2,
  VolumeX
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { useSafety } from '../context/SafetyContext';
import { soundManager } from '../utils/soundEffects';
import { DashboardCard } from '../components/DashboardCard';
import { SafetyBadge } from '../components/SafetyBadge';
import { SafetyAlertCard } from '../components/SafetyAlert';
import { Modal } from '../components/Modal';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    stats,
    violations,
    alerts,
    cameras,
    acknowledgeAlert,
    resolveAlert,
    acknowledgeViolation,
    resolveViolation,
    autoBroadcastPA,
    setAutoBroadcastPA
  } = useSafety();

  const [dossierModalOpen, setDossierModalOpen] = useState(false);
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [bellRinging, setBellRinging] = useState(false);

  const handleTriggerWarningBell = () => {
    setBellRinging(true);
    soundManager.playWarningChime();
    setTimeout(() => setBellRinging(false), 2400);
  };

  // 7-day violation trend data for stacked chart
  const weeklyTrendData = [
    { day: 'Fri', helmet: 5, eye: 4, mobile: 4, idle: 3, gloves: 3, total: 19 },
    { day: 'Sat', helmet: 4, eye: 3, mobile: 3, idle: 2, gloves: 2, total: 14 },
    { day: 'Sun', helmet: 2, eye: 2, mobile: 2, idle: 1, gloves: 1, total: 8 },
    { day: 'Mon', helmet: 6, eye: 5, mobile: 4, idle: 3, gloves: 4, total: 22 },
    { day: 'Tue', helmet: 4, eye: 3, mobile: 3, idle: 3, gloves: 3, total: 16 },
    { day: 'Wed', helmet: 5, eye: 4, mobile: 4, idle: 4, gloves: 3, total: 20 },
    { day: 'Today', helmet: 5, eye: 3, mobile: 3, idle: 2, gloves: 4, total: 17 },
  ];

  // Department compliance ranking
  const departmentRankings = [
    { name: 'Warehouse Logistics', score: 98, color: 'bg-emerald-500' },
    { name: 'Electrical Engineering', score: 96, color: 'bg-emerald-500' },
    { name: 'Packaging & Dispatch', score: 95, color: 'bg-emerald-500' },
    { name: 'General Production', score: 92, color: 'bg-blue-600' },
    { name: 'Heavy Maintenance', score: 91, color: 'bg-blue-600' },
    { name: 'Robotic Welding Bay', score: 88, color: 'bg-amber-500' },
  ];

  const recentViolations = violations.slice(0, 5);
  const urgentAlerts = alerts.filter((a) => !a.resolved).slice(0, 3);
  const activeWarningViolations = violations.filter((v) => v.status !== 'Resolved');

  return (
    <div className="space-y-6">
      {/* Subheader & Dossier Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase font-bold text-slate-400">
            <span>PLANT 04</span>
            <span>/</span>
            <span>ASSEMBLY LINE ALPHA & BETA</span>
            <span>/</span>
            <span className="text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE REALTIME STREAM
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-1">
            Factory Safety Dashboard
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Telemetry Refresh Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 font-mono shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Telemetry Refresh: <strong className="text-slate-800">Live (1.2s)</strong></span>
          </div>

          {/* Shift Date Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Shift 02 · Oct 24, 2024</span>
          </div>

          {/* Export Shift Dossier Button */}
          <button
            onClick={() => setDossierModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Shift Safety Dossier</span>
          </button>
        </div>
      </div>

      {/* Interactive Active Warning & Bell Incident Bar */}
      <div className="bg-linear-to-r from-slate-900 via-rose-950/70 to-slate-900 border border-rose-500/50 rounded-2xl p-4 sm:p-5 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start sm:items-center gap-3.5">
            {/* Ringing Warning Bell Icon Box */}
            <div
              onClick={handleTriggerWarningBell}
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border cursor-pointer transition-all shadow-lg ${
                bellRinging
                  ? 'bg-rose-500 border-amber-300 ring-4 ring-rose-500/30 shadow-rose-500/50'
                  : 'bg-rose-600/90 border-rose-400/40 hover:bg-rose-500 shadow-rose-600/30'
              }`}
              title="Click to test/ring factory warning bell chime"
            >
              <Bell className={`w-6 h-6 text-white ${bellRinging ? 'animate-bell-ring scale-110 text-amber-200' : 'animate-bell-ring'}`} />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-600 text-white uppercase tracking-wider">
                  ACTIVE WARNING SIREN
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {stats.activeWarnings} WARNINGS PENDING
                </span>
                <span className="text-[11px] font-mono text-emerald-400 hidden sm:inline">
                  ● Floor PA Horns Synchronized (95 dB)
                </span>
              </div>

              <div className="font-display font-bold text-base sm:text-lg text-white tracking-tight">
                Crane Proximity Breach & Mandatory Hardhat Incursion Active
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                Computer vision edge node CAM-03 detected technician in overhead gantry swing radius without certified hardhat. Auto-siren beacon fired.
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:self-auto self-start">
            <button
              onClick={handleTriggerWarningBell}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Volume2 className="w-4 h-4 text-amber-300" />
              <span>Ring Warning Bell</span>
            </button>

            <button
              onClick={() => setWarningModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/30 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Inspect All Warnings ({stats.activeWarnings})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 8 Primary KPI Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Employees"
          value="1,248"
          subtitle={
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <span className="text-xs">↗</span> +12% vs last mo
            </span>
          }
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          onClick={() => navigate('/employees')}
        />

        <DashboardCard
          title="Currently Working"
          value="786"
          subtitle={
            <span className="text-slate-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Active on floor (63%)
            </span>
          }
          icon={UserCheck}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          onClick={() => navigate('/employees')}
        />

        <DashboardCard
          title="Active Cameras"
          value={`${stats.activeCameras} / ${stats.totalCameras}`}
          subtitle={
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              100% operational
            </span>
          }
          icon={Video}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          onClick={() => navigate('/cameras')}
        />

        <DashboardCard
          title="Violations Today"
          value={stats.violationsToday}
          badges={[
            { color: 'bg-rose-600', count: 3 },
            { color: 'bg-amber-500', count: 8 },
            { color: 'bg-slate-400', count: 6 },
          ]}
          subtitle="3 Critical · 8 Warnings · 6 Minor"
          icon={ShieldAlert}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
          onClick={() => navigate('/violations')}
        />

        <DashboardCard
          title="Active Warnings"
          value={stats.activeWarnings}
          subtitle={
            <span className="text-amber-800 font-semibold flex items-center gap-1">
              <Bell className="w-3.5 h-3.5 text-rose-600 animate-bell-ring" />
              <span>Tap to inspect & ring bell</span>
            </span>
          }
          icon={Bell}
          iconColor="text-rose-600"
          iconBg="bg-rose-50 ring-1 ring-rose-200"
          onClick={() => setWarningModalOpen(true)}
        />

        <DashboardCard
          title="Critical Alerts"
          value={stats.criticalAlerts}
          subtitle={<span className="text-rose-600 font-bold">Action Required</span>}
          icon={Flame}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
          onClick={() => navigate('/alerts')}
        />

        <DashboardCard
          title="Safety Index"
          value={`${stats.safetyScore}%`}
          subtitle="Nominal safe"
          scoreCircle={stats.safetyScore}
          icon={ShieldCheck}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          onClick={() => navigate('/analytics')}
        />

        <DashboardCard
          title="Employees Idle"
          value={stats.employeesIdle}
          subtitle="4.3% workforce idle"
          icon={UserX}
          iconColor="text-slate-600"
          iconBg="bg-slate-100"
          onClick={() => navigate('/employees')}
        />
      </div>

      {/* Middle Grid: Safety Trend Chart & Camera/Department Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Safety Violations Trend (7 Days) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
                  Safety Violations Trend (7 Days)
                </h3>
                <p className="text-xs text-slate-500">
                  Telemetry categorized by industrial safety infractions
                </p>
              </div>

              {/* Legend Badges */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  Helmet
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  Eye Protection
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                  Mobile Phone
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  Idle In Zone
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                  Gloves
                </span>
              </div>
            </div>

            {/* Recharts Stacked Bar Chart */}
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="gloves" stackId="a" fill="#dc2626" />
                  <Bar dataKey="idle" stackId="a" fill="#64748b" />
                  <Bar dataKey="mobile" stackId="a" fill="#334155" />
                  <Bar dataKey="eye" stackId="a" fill="#059669" />
                  <Bar dataKey="helmet" stackId="a" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart Sub-Metric Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
            <div>Average: <strong className="text-slate-800">16.5 infractions/day</strong></div>
            <div className="flex items-center gap-1 text-emerald-700 font-bold">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>-14.2% reduction vs last week</span>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Camera Status Network & Department Scores */}
        <div className="lg:col-span-4 space-y-5">
          {/* Camera Status Network Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-display font-bold text-sm text-slate-900 tracking-tight">
                  Camera Status Network
                </h3>
                <p className="text-[11px] text-slate-500">Real-time edge device telemetry</p>
              </div>
              <Video className="w-4 h-4 text-blue-600" />
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                <div className="font-display font-bold text-base text-slate-900">42</div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Total</div>
              </div>
              <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200/60">
                <div className="font-display font-bold text-base text-emerald-800">38</div>
                <div className="text-[10px] uppercase font-bold text-emerald-600">Normal</div>
              </div>
              <div className="bg-amber-50 p-2 rounded-lg border border-amber-200/60">
                <div className="font-display font-bold text-base text-amber-800">3</div>
                <div className="text-[10px] uppercase font-bold text-amber-600">Warn</div>
              </div>
              <div className="bg-rose-50 p-2 rounded-lg border border-rose-200/60">
                <div className="font-display font-bold text-base text-rose-800">1</div>
                <div className="text-[10px] uppercase font-bold text-rose-600">Alert</div>
              </div>
            </div>

            {/* Sample Camera Nodes */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg border border-rose-200 bg-rose-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                  <span className="font-bold text-slate-900">CAM-08 (Assembly Bay 3)</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                  Incursion Alert
                </span>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="font-medium text-slate-800">CAM-22 (High Voltage Stn)</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-600 bg-slate-200">
                  Bandwidth 45%
                </span>
              </div>
            </div>
          </div>

          {/* Department Safety Scores Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-display font-bold text-sm text-slate-900 tracking-tight">
                  Department Safety Scores
                </h3>
                <p className="text-[11px] text-slate-500">Shift compliance ranking</p>
              </div>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-2.5">
              {departmentRankings.map((dept) => (
                <div key={dept.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-medium">{dept.name}</span>
                    <span className="font-display font-bold text-slate-900">{dept.score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${dept.color} rounded-full`}
                      style={{ width: `${dept.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Violations Quick Feed & Live Urgent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Recent Violations Quick Feed */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
                Recent Violations Quick Feed
              </h3>
              <p className="text-xs text-slate-500">
                Live audit log with auto-captured bounding box verification
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                Total Logged: {violations.length}
              </span>
              <button
                onClick={() => navigate('/violations')}
                className="flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filter Feed</span>
              </button>
            </div>
          </div>

          {/* Quick Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="p-3">Violation Type</th>
                  <th className="p-3">Employee</th>
                  <th className="p-3">Location / Cam</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentViolations.map((v) => (
                  <tr
                    key={v.id}
                    onClick={() => navigate(`/cameras/${v.cameraCode === 'CAM-03' ? 'cam-03' : 'cam-01'}`)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2 font-semibold text-slate-900">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            v.severity === 'Critical' ? 'bg-rose-600' : 'bg-amber-500'
                          }`}
                        />
                        <span>{v.violationType}</span>
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-mono text-blue-600 font-bold">{v.employeeId}</div>
                      <div className="text-[11px] text-slate-400">{v.employeeName}</div>
                    </td>

                    <td className="p-3 font-mono text-[11px]">
                      <div className="text-slate-800 font-bold">{v.cameraCode}</div>
                      <div className="text-slate-400 truncate max-w-[120px]">{v.zone}</div>
                    </td>

                    <td className="p-3 font-mono text-slate-500">
                      {v.timestamp.replace(' Today', '')}
                    </td>

                    <td className="p-3">
                      <SafetyBadge severity={v.severity} size="sm" />
                    </td>

                    <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                      {v.severity === 'Critical' ? (
                        <button
                          onClick={() => navigate(`/cameras/cam-03`)}
                          className="px-2.5 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                        >
                          Dispatch
                        </button>
                      ) : (
                        <button
                          onClick={() => acknowledgeViolation(v.id)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors"
                        >
                          Review
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Link */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Showing latest 5 of {violations.length} violations
            </span>
            <button
              onClick={() => navigate('/violations')}
              className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
            >
              <span>View full forensic event archive</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column (4 cols): Live Urgent Alerts */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
                <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
                  Live Urgent Alerts
                </h3>
              </div>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                {urgentAlerts.length} Pending Action
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Active notifications triggered by edge computer vision inference engines
            </p>

            {/* List of Urgent Alerts */}
            <div className="space-y-3 mt-4">
              {urgentAlerts.map((alt) => (
                <SafetyAlertCard
                  key={alt.id}
                  alert={alt}
                  onAcknowledge={acknowledgeAlert}
                  onResolve={resolveAlert}
                />
              ))}
            </div>
          </div>

          {/* PA Broadcast Toggle */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <Radio className="w-4 h-4 text-blue-600" />
              <span>Auto-broadcast alerts to floor PA</span>
            </div>
            <button
              onClick={() => setAutoBroadcastPA(!autoBroadcastPA)}
              className={`w-11 h-6 rounded-full flex items-center p-0.5 transition-colors ${
                autoBroadcastPA ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
            </button>
          </div>
        </div>
      </div>

      {/* Export Shift Safety Dossier Modal */}
      <Modal
        isOpen={dossierModalOpen}
        onClose={() => setDossierModalOpen(false)}
        title="Shift Safety Dossier — Shift 02"
        maxWidth="2xl"
      >
        <div className="space-y-4 text-xs text-slate-700">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">SafeFactory Operational Dossier #2024-D24</span>
              <span className="font-mono text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                COMPLIANCE: 94.0%
              </span>
            </div>
            <p className="text-slate-600">
              Generated by Marcus Cole (Chief Safety Officer) · Detroit Assembly Plant #4 · Shift 02
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center font-mono">
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="text-lg font-bold text-slate-900">1,248</div>
              <div className="text-[10px] text-slate-400 uppercase">Workforce Total</div>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="text-lg font-bold text-rose-600">17</div>
              <div className="text-[10px] text-slate-400 uppercase">Violations Today</div>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="text-lg font-bold text-emerald-600">4.2 min</div>
              <div className="text-[10px] text-slate-400 uppercase">Avg Triage Speed</div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-2">Key Critical Events Logged:</h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>CAM-03 Maintenance Bay 2: Hardhat missing during overhead crane scaffolding (Mitigated).</li>
              <li>CAM-04 Substation 3: Dielectric safety gloves absent in 480V cabinet zone (Escalated).</li>
              <li>CAM-05 Repair Area: Electronic vape violation intercepted near solvent degreaser line.</li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              onClick={() => {
                window.print();
                setDossierModalOpen(false);
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg"
            >
              Print / Save PDF Dossier
            </button>
          </div>
        </div>
      </Modal>

      {/* Warning Center & Bell Siren Inspection Modal */}
      <Modal
        isOpen={warningModalOpen}
        onClose={() => setWarningModalOpen(false)}
        title="Industrial Safety Warning & Bell Siren Console"
        maxWidth="2xl"
      >
        <div className="space-y-4 text-xs text-slate-700">
          {/* Top Warning Bell Console Header */}
          <div className="p-4 bg-linear-to-r from-slate-900 via-rose-950 to-slate-900 text-white rounded-xl border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center shrink-0 shadow-lg shadow-rose-600/40">
                <Bell className="w-5 h-5 text-white animate-bell-ring" />
              </div>
              <div>
                <div className="font-display font-bold text-sm text-white">
                  Active Audible Warning Network ({stats.activeWarnings} Warnings Triaged)
                </div>
                <div className="text-[11px] text-slate-300 font-mono">
                  Synthesized Alarm Protocol · PA Horn Coverage 100%
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => soundManager.playWarningChime()}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Test Bell Chime</span>
              </button>
              <button
                onClick={() => soundManager.playIndustrialSiren()}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Emergency Siren</span>
              </button>
            </div>
          </div>

          {/* Active Warnings List */}
          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {activeWarningViolations.map((v) => (
              <div
                key={v.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  v.severity === 'Critical'
                    ? 'bg-rose-50/50 border-rose-200'
                    : 'bg-amber-50/40 border-amber-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        v.severity === 'Critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      <Bell className="w-4 h-4 animate-bell-ring" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-600">{v.id}</span>
                        <span className="font-bold text-slate-900 text-sm">{v.violationType}</span>
                        <SafetyBadge severity={v.severity} size="sm" />
                      </div>

                      <p className="text-slate-600 leading-relaxed text-xs">
                        {v.reason}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-slate-500">
                        <span>Subject: <strong className="text-slate-800">{v.employeeName} ({v.employeeId})</strong></span>
                        <span>·</span>
                        <span>Camera: <strong className="text-slate-800">{v.cameraCode}</strong></span>
                        <span>·</span>
                        <span>Zone: {v.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => {
                        soundManager.playWarningChime();
                      }}
                      className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                      title="Ring audible chime for this zone"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                    </button>

                    <button
                      onClick={() => {
                        acknowledgeViolation(v.id);
                        soundManager.playAcknowledgeBeep();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                    >
                      Acknowledge
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Sound alerts powered by Web Audio API synthesizers</span>
            <button
              onClick={() => {
                setWarningModalOpen(false);
                navigate('/violations');
              }}
              className="text-blue-600 font-bold hover:text-blue-800"
            >
              Open Full Forensic Violations Ledger &rarr;
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
