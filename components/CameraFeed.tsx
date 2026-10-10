import React, { useState } from 'react';
import {
  Maximize2,
  Minimize2,
  Camera as CameraIcon,
  RotateCcw,
  RotateCw,
  Bookmark,
  ZoomIn,
  Volume2,
  VolumeX,
  Radio
} from 'lucide-react';
import { Camera } from '../types';

interface CameraFeedProps {
  camera: Camera;
  onSnapshot?: () => void;
}

export const CameraFeed: React.FC<CameraFeedProps> = ({ camera, onSnapshot }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(true);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [snapshotTaken, setSnapshotTaken] = useState(false);

  const toggleZoom = () => {
    setZoomLevel((prev) => (prev === 1 ? 1.5 : 1));
  };

  const handleCaptureSnapshot = () => {
    setSnapshotTaken(true);
    setTimeout(() => setSnapshotTaken(false), 2000);
    if (onSnapshot) onSnapshot();
  };

  return (
    <div className={`relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-xl flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
      {/* Top HUD Overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 p-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between pointer-events-none text-xs font-mono text-white">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-rose-900/70 border border-rose-500/30 px-2 py-0.5 rounded text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>REC [LIVE]</span>
          </div>
          <span className="text-white/80 hidden sm:inline">2025-05-18 10:15:42 UTC</span>
          <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded">{camera.code}</span>
          <span className="text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/20 px-2 py-0.5 rounded hidden md:inline">
            60 FPS HD
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-blue-900/60 border border-blue-400/30 px-2 py-0.5 rounded text-[10px] font-bold text-blue-200">
            DEMO / SIMULATION — AI COMPUTER VISION PPE ENGINE
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative aspect-video w-full bg-slate-900 overflow-hidden flex items-center justify-center">
        <div
          className="w-full h-full transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <img
            src={camera.image}
            alt={camera.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover select-none"
          />

          {/* Interactive Simulated Bounding Boxes */}
          {showBoundingBoxes && (
            <>
              {/* Primary Subject Box (EMP-102) */}
              <div
                style={{ left: '38%', top: '22%', width: '22%', height: '54%' }}
                className="absolute border-2 border-rose-500 bg-rose-500/10 rounded-xs transition-all pointer-events-none shadow-[0_0_15px_rgba(244,63,94,0.3)]"
              >
                <div className="bg-rose-600 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 absolute -top-6 left-0 rounded-xs flex items-center gap-1 whitespace-nowrap shadow-xs">
                  <span>[EMP-102] Conf: 98.4%</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                </div>

                <div className="bg-rose-700/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded absolute top-2 left-2 flex items-center gap-1 shadow-xs">
                  <span>✕ Helmet Missing (Rule R-101)</span>
                </div>

                <div className="bg-emerald-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded absolute top-10 left-2 flex items-center gap-1">
                  <span>✓ Hi-Vis Vest</span>
                </div>

                <div className="bg-emerald-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded absolute top-18 left-2 flex items-center gap-1">
                  <span>✓ Safety Gloves (L4)</span>
                </div>

                <div className="bg-emerald-600/90 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded absolute bottom-2 left-2 flex items-center gap-1">
                  <span>✓ Steel-Toe Footwear</span>
                </div>
              </div>

              {/* Secondary Subject Box (EMP-109 Compliant) */}
              <div
                style={{ left: '62%', top: '24%', width: '18%', height: '45%' }}
                className="absolute border-2 border-emerald-400 bg-emerald-400/10 rounded-xs transition-all pointer-events-none"
              >
                <div className="bg-emerald-600 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 absolute -top-5 left-0 rounded-xs flex items-center gap-1 whitespace-nowrap">
                  <span>[EMP-109] Standard</span>
                </div>
                <div className="bg-emerald-700/90 text-white text-[9px] font-medium px-1.5 py-0.5 rounded absolute top-2 left-2 flex items-center gap-1">
                  <span>✓ Hardhat MSA-V</span>
                </div>
              </div>
            </>
          )}

          {/* Flash Snapshot Feedback */}
          {snapshotTaken && (
            <div className="absolute inset-0 bg-white/40 pointer-events-none animate-out fade-out duration-500" />
          )}
        </div>

        {/* Lower Camera Telemetry Overlay */}
        <div className="absolute bottom-16 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-white/80 bg-black/70 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/10 pointer-events-none">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>PTZ Lens: Fixed High-Angle #3</span>
            <span className="text-white/40">·</span>
            <span>Aperture: f/2.0</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Bitrate: {camera.bitrate}</span>
            <span className="text-emerald-400">Stream Online</span>
          </div>
        </div>
      </div>

      {/* Scrub & Control Toolbar */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-bold transition-colors">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>Live Feed</span>
          </button>
          <button
            title="Rewind 30s"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            title="Forward 10s"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            title="Bookmark frame"
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bookmark</span>
          </button>
        </div>

        {/* Scrub Bar */}
        <div className="flex-1 max-w-md flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>10:14:00</span>
          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden relative cursor-pointer">
            <div className="absolute left-0 top-0 bottom-0 w-3/4 bg-blue-500 rounded-full" />
            <div className="absolute left-3/4 top-0 bottom-0 w-1.5 bg-rose-500" />
          </div>
          <span className="text-rose-400 font-bold">10:15:42</span>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors ${
              showBoundingBoxes
                ? 'bg-blue-900/60 border-blue-600 text-blue-200'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            Boxes {showBoundingBoxes ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={toggleZoom}
            className={`p-1.5 rounded-lg transition-colors ${
              zoomLevel > 1 ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Toggle 1.5x Zoom"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={handleCaptureSnapshot}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Capture Snapshot"
          >
            <CameraIcon className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
