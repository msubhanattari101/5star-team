import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { ShieldCheck, BarChart3, TrendingUp, PieChart as PieIcon, Layers } from 'lucide-react';
import { ChartCard } from '../components/ChartCard';
import { useSafety } from '../context/SafetyContext';

export const Analytics: React.FC = () => {
  const { stats } = useSafety();
  const [timeframe, setTimeframe] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');

  // Daily Violations Data
  const dailyData = [
    { time: '06:00', count: 2, critical: 0 },
    { time: '08:00', count: 4, critical: 1 },
    { time: '10:00', count: 6, critical: 2 },
    { time: '12:00', count: 1, critical: 0 },
    { time: '14:00', count: 3, critical: 0 },
    { time: '16:00', count: 1, critical: 0 },
  ];

  // Weekly Violations Data
  const weeklyData = [
    { period: 'Mon', total: 22, critical: 4, warnings: 12 },
    { period: 'Tue', total: 16, critical: 2, warnings: 9 },
    { period: 'Wed', total: 20, critical: 3, warnings: 11 },
    { period: 'Thu', total: 17, critical: 3, warnings: 8 },
    { period: 'Fri', total: 19, critical: 4, warnings: 10 },
    { period: 'Sat', total: 14, critical: 1, warnings: 8 },
    { period: 'Sun', total: 8, critical: 0, warnings: 5 },
  ];

  // Monthly Violations Data
  const monthlyData = [
    { period: 'Week 1', total: 98, critical: 14 },
    { period: 'Week 2', total: 112, critical: 18 },
    { period: 'Week 3', total: 124, critical: 19 },
    { period: 'Week 4', total: 98, critical: 13 },
  ];

  // Violation Categories Pie Data
  const categoryData = [
    { name: 'Helmet Missing', value: 32, color: '#2563eb' },
    { name: 'Eye Protection', value: 24, color: '#059669' },
    { name: 'Gloves Missing', value: 18, color: '#d97706' },
    { name: 'Mobile Phone Distraction', value: 14, color: '#475569' },
    { name: 'Idle Inactivity', value: 8, color: '#94a3b8' },
    { name: 'Smoking Prohibited', value: 4, color: '#dc2626' },
  ];

  // PPE Compliance Rates
  const ppeComplianceData = [
    { item: 'Hardhats', rate: 97.4, target: 100 },
    { item: 'Hi-Vis Vest', rate: 99.1, target: 100 },
    { item: 'Hand Gloves', rate: 94.6, target: 95 },
    { item: 'Eye Visors', rate: 91.8, target: 95 },
    { item: 'Steel-Toe', rate: 98.5, target: 100 },
  ];

  // Workforce State Breakdown
  const workforceBreakdown = [
    { name: 'Active Working', value: 786, color: '#16a34a' },
    { name: 'Idle / Break', value: 34, color: '#eab308' },
    { name: 'Off-Shift / Training', value: 428, color: '#94a3b8' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Safety Analytics & Trends
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Statistical breakdown of workplace hazard distribution, PPE compliance rates, and shift correlations.
          </p>
        </div>

        {/* Timeframe Switcher & Site Score */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs text-xs">
            {(['Daily', 'Weekly', 'Monthly'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  timeframe === t
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-bold font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Site Score: {stats.safetyScore}%</span>
          </div>
        </div>
      </div>

      {/* Top Main Trend Chart */}
      <ChartCard
        title={`${timeframe} Violations & Incident Progression`}
        subtitle="Chronological distribution comparing total vs critical incidents"
      >
        <div className="h-72 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            {timeframe === 'Weekly' ? (
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
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
                <Legend />
                <Bar dataKey="warnings" fill="#3b82f6" name="Warnings" radius={[4, 4, 0, 0]} />
                <Bar dataKey="critical" fill="#dc2626" name="Critical Breaches" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : timeframe === 'Daily' ? (
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
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
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} name="Total Hourly Incidents" />
                <Line type="monotone" dataKey="critical" stroke="#dc2626" strokeWidth={3} name="Critical Breaches" />
              </LineChart>
            ) : (
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
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
                <Legend />
                <Bar dataKey="total" fill="#2563eb" name="Total Month Incidents" radius={[4, 4, 0, 0]} />
                <Bar dataKey="critical" fill="#dc2626" name="Critical" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Middle Grid: Categories Donut & PPE Compliance Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Violation Categories Donut Chart */}
        <ChartCard
          title="Violation Categories Breakdown"
          subtitle="Proportion of infractions recorded by type over the last 30 days"
        >
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* PPE Compliance Checklist Bar */}
        <ChartCard
          title="PPE Compliance Index by Item"
          subtitle="Observed compliance vs strict 100% target baseline"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ppeComplianceData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[80, 100]} tick={{ fontSize: 11 }} />
                <YAxis dataKey="item" type="category" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="rate" fill="#10b981" radius={[0, 4, 4, 0]} name="Compliance %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Workforce Inactivity & Idle Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Working vs Idle Workforce Distribution"
          subtitle="Real-time personnel motion status across 1,248 workforce members"
        >
          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={workforceBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {workforceBreakdown.map((entry, index) => (
                    <Cell key={`wf-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Executive Summary Card */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
              Executive Safety Conclusions
            </h3>
            <p className="text-xs text-slate-500">Continuous edge vision telemetry analysis</p>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <strong className="text-emerald-800 block mb-0.5">High Compliance Standard Maintained</strong>
              The plant maintains a 94.0% safety compliance rating, outperforming the industrial sector average of 89.2%.
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <strong className="text-blue-800 block mb-0.5">Rapid Incident Mitigation</strong>
              Average time from optical computer vision detection to supervisor resolution is 4.2 minutes.
            </div>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <strong className="text-amber-800 block mb-0.5">Focus Recommendation</strong>
              Reinforce eye protection visor compliance in manual repair and welding cells where adherence lags at 91.8%.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
