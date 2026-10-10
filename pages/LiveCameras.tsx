import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Grid2X2,
  Grid3X3,
  RotateCw,
  Cpu,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Radio,
  Layers
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { CameraCard } from '../components/CameraCard';

export const LiveCameras: React.FC = () => {
  const navigate = useNavigate();
  const { cameras, currentPlant } = useSafety();

  const [search, setSearch] = useState('');
  const [selectedZone, setSelectedZone] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [gridCols, setGridCols] = useState<'2x3' | '3x3'>('3x3');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const zones = [
    'All',
    'Production',
    'Welding',
    'Maintenance',
    'Electrical',
    'Repair',
    'Warehouse',
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const filteredCameras = cameras.filter((cam) => {
    const matchSearch =
      cam.name.toLowerCase().includes(search.toLowerCase()) ||
      cam.code.toLowerCase().includes(search.toLowerCase()) ||
      cam.location.toLowerCase().includes(search.toLowerCase()) ||
      cam.department.toLowerCase().includes(search.toLowerCase()) ||
      cam.zone.toLowerCase().includes(search.toLowerCase());

    if (!matchSearch) return false;

    if (selectedZone !== 'All') {
      const zLower = selectedZone.toLowerCase();
      if (
        !cam.department.toLowerCase().includes(zLower) &&
        !cam.zone.toLowerCase().includes(zLower) &&
        !cam.name.toLowerCase().includes(zLower)
      ) {
        return false;
      }
    }

    if (selectedStatus !== 'All') {
      if (selectedStatus === 'Normal' && cam.status !== 'normal') return false;
      if (selectedStatus === 'Warning' && cam.status !== 'warning') return false;
      if (selectedStatus === 'Critical' && cam.status !== 'alert') return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Real-time Stream Banner */}
      <div className="bg-slate-900 text-white px-4 py-2.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-white">AI COMPUTER VISION STREAM ACTIVE</span>
          <span className="text-white/40 hidden sm:inline">·</span>
          <span className="text-white/80 hidden sm:inline">42 streams monitored in real-time</span>
          <span className="text-white/40 hidden sm:inline">·</span>
          <span className="text-emerald-400 font-semibold hidden md:inline">99.98% Edge Node Uptime</span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-white/70">
          <span>07:18:39 UTC</span>
          <span className="text-emerald-400 font-bold">Global Sync: 18ms</span>
        </div>
      </div>

      {/* Main Header & Search Tools */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Live Camera Monitoring
            </h1>
            <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200">
              {currentPlant}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            High-frequency inference monitoring hardhats, eye-protection, hi-vis zoning, and hazardous area incursions.
          </p>
        </div>

        {/* Search, Layout Grid Switch, and Refresh */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Camera ID, Tag, Area..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 outline-hidden focus:border-blue-500 shadow-2xs"
            />
          </div>

          {/* Grid Toggle Buttons */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
            <button
              onClick={() => setGridCols('2x3')}
              className={`p-1.5 rounded text-xs font-bold flex items-center gap-1 transition-colors ${
                gridCols === '2x3'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="2 Columns Grid"
            >
              <Grid2X2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">2x3</span>
            </button>
            <button
              onClick={() => setGridCols('3x3')}
              className={`p-1.5 rounded text-xs font-bold flex items-center gap-1 transition-colors ${
                gridCols === '3x3'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="3 Columns Grid"
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">3x3</span>
            </button>
          </div>

          {/* Refresh Feeds Button */}
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors shadow-2xs"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Feeds</span>
          </button>
        </div>
      </div>

      {/* Filter Row: Zones & Status Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
        {/* Zone Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            ZONE:
          </span>
          {zones.map((z) => (
            <button
              key={z}
              onClick={() => setSelectedZone(z)}
              className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                selectedZone === z
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {z}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 text-xs shrink-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            STATUS:
          </span>
          <button
            onClick={() => setSelectedStatus('All')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              selectedStatus === 'All'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All (6)
          </button>
          <button
            onClick={() => setSelectedStatus('Normal')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
              selectedStatus === 'Normal'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Normal (2)
          </button>
          <button
            onClick={() => setSelectedStatus('Warning')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
              selectedStatus === 'Warning'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Warning (3)
          </button>
          <button
            onClick={() => setSelectedStatus('Critical')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
              selectedStatus === 'Critical'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Critical (1)
          </button>
        </div>
      </div>

      {/* Cameras Grid */}
      <div
        className={`grid gap-5 ${
          gridCols === '2x3'
            ? 'grid-cols-1 md:grid-cols-2'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {filteredCameras.map((cam) => (
          <CameraCard
            key={cam.id}
            camera={cam}
            isFeatured={cam.code === 'CAM-03'}
          />
        ))}
      </div>

      {/* Bottom Telemetry Status Banner */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
              Edge Node Inference Status
            </h3>
            <p className="text-xs text-slate-500">
              AI models checking: Hardhat, Safety Goggles, High-Vis Vest, Mobile Restriction & Arc Flash protocol.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-bold">41 / 42</span>
            <span>Feeds Nominal</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="font-bold">0.03 sec</span>
            <span>Inference Delay</span>
          </div>

          <div className="flex items-center gap-2 bg-rose-50 text-rose-800 px-3 py-1.5 rounded-lg border border-rose-200">
            <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
            <span className="font-bold">1 Critical</span>
            <span>Z-04 High Voltage</span>
          </div>
        </div>
      </div>
    </div>
  );
};
