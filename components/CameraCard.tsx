import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  ChevronRight,
  ShieldAlert,
  AlertTriangle,
  Zap,
  Lock,
  Layers
} from 'lucide-react';
import { Camera } from '../types';

interface CameraCardProps {
  camera: Camera;
  isFeatured?: boolean;
}

export const CameraCard: React.FC<CameraCardProps> = ({ camera, isFeatured = false }) => {
  const navigate = useNavigate();

  // Status colors & badges
  const getStatusBadge = () => {
    switch (camera.status) {
      case 'alert':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            CRITICAL BREACH
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-600" />
            WARNING (1)
          </span>
        );
      case 'normal':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            NORMAL
          </span>
        );
    }
  };

  return (
    <div
      className={`bg-white rounded-xl border transition-all duration-200 shadow-2xs hover:shadow-md flex flex-col overflow-hidden ${
        isFeatured || camera.status === 'alert'
          ? 'border-rose-300 ring-1 ring-rose-300/30'
          : 'border-slate-200'
      }`}
    >
      {/* Top Header */}
      <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isFeatured && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white uppercase tracking-wider">
              Featured
            </span>
          )}
          <span className="font-display font-bold text-base text-slate-900 tracking-tight">
            {camera.code}
          </span>
          <span className="text-xs text-slate-500 font-medium truncate max-w-[140px] sm:max-w-none">
            {camera.department}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            {camera.resolution}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            LIVE
          </span>
        </div>
      </div>

      {/* Video Simulation Canvas / Image */}
      <div className="relative aspect-video bg-slate-950 overflow-hidden group">
        <img
          src={camera.image}
          alt={camera.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
        />

        {/* HUD Overlay Top */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-mono text-white/90 border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span>REC [LIVE]</span>
        </div>

        <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-mono text-white/90 border border-white/10">
          <span className="text-emerald-400">LATENCY {camera.latencyMs}ms</span>
        </div>

        {/* Bounding Boxes on Video */}
        {camera.detections.map((det) => (
          <div
            key={det.id}
            style={{
              left: `${det.x}%`,
              top: `${det.y}%`,
              width: `${det.width}%`,
              height: `${det.height}%`,
            }}
            className={`absolute border-2 pointer-events-none rounded-xs flex flex-col justify-start transition-all ${
              det.type === 'violation'
                ? 'border-rose-500 bg-rose-500/10 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                : det.type === 'warning'
                ? 'border-amber-400 bg-amber-400/10'
                : 'border-emerald-400 bg-emerald-400/10'
            }`}
          >
            <div
              className={`px-1 py-0.5 text-[9px] font-mono font-bold leading-none uppercase text-white tracking-wider self-start ${
                det.type === 'violation'
                  ? 'bg-rose-600'
                  : det.type === 'warning'
                  ? 'bg-amber-600'
                  : 'bg-emerald-600'
              }`}
            >
              {det.tag}
            </div>
          </div>
        ))}

        {/* Bottom Zone Pill */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-white/80 bg-black/60 backdrop-blur-xs px-2 py-1 rounded border border-white/10">
          <span className="truncate">{camera.zone}</span>
          <span className="text-white/60 ml-2 shrink-0">{camera.bitrate}</span>
        </div>
      </div>

      {/* Camera Telemetry Information */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>{camera.workersDetected} Workers detected</span>
          </div>
          <div>{getStatusBadge()}</div>
        </div>

        {/* Details Grid */}
        <div className="space-y-1.5 text-xs">
          <div className="flex items-start justify-between text-slate-600">
            <span className="text-slate-400 shrink-0">Current Activity:</span>
            <span className="font-medium text-slate-800 text-right truncate ml-2">
              {camera.currentActivity}
            </span>
          </div>

          <div className="flex items-start justify-between text-slate-600">
            <span className="text-slate-400 shrink-0">Latest Violation:</span>
            <span
              className={`font-semibold text-right truncate ml-2 ${
                camera.status === 'alert'
                  ? 'text-rose-600'
                  : camera.status === 'warning'
                  ? 'text-amber-700'
                  : 'text-slate-700'
              }`}
            >
              {camera.latestViolation}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            {camera.status === 'alert' ? (
              <span className="text-rose-600 font-medium flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> Breach Tripped
              </span>
            ) : camera.status === 'warning' ? (
              <span className="text-amber-700 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Warning Logged
              </span>
            ) : (
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <Lock className="w-3 h-3" /> Safe Zone
              </span>
            )}
          </div>

          <button
            onClick={() => navigate(`/cameras/${camera.id}`)}
            className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <span>View Camera</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
