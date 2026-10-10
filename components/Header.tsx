import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  ChevronDown,
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Radio,
  ExternalLink
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { soundManager } from '../utils/soundEffects';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const {
    user,
    currentPlant,
    setCurrentPlant,
    alerts,
    acknowledgeAlert,
    stats
  } = useSafety();

  const [plantDropdownOpen, setPlantDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifRef = useRef<HTMLDivElement>(null);
  const plantRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (plantRef.current && !plantRef.current.contains(event.target as Node)) {
        setPlantDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged);

  const plantOptions = [
    { name: 'Detroit Assembly Plant #4', cameras: '42/42 Cameras Online' },
    { name: 'Munich Component Plant #1', cameras: '36/36 Cameras Online' },
    { name: 'Tokyo Fab Robotics Plant #7', cameras: '54/54 Cameras Online' },
  ];

  const handleSearchResultClick = (path: string) => {
    setSearchModalOpen(false);
    navigate(path);
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left Side: Hamburger & Plant Selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg lg:hidden"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Plant Dropdown */}
          <div className="relative" ref={plantRef}>
            <button
              onClick={() => setPlantDropdownOpen(!plantDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="hidden sm:block">
                <span className="text-xs font-bold text-slate-800 block leading-tight">{currentPlant}</span>
                <span className="text-[10px] text-slate-500 block leading-tight">42/42 Cameras Online</span>
              </div>
              <span className="sm:hidden text-xs font-bold text-slate-800">Plant #4</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {plantDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Select Facility Node
                </div>
                {plantOptions.map((opt) => (
                  <button
                    key={opt.name}
                    onClick={() => {
                      setCurrentPlant(opt.name);
                      setPlantDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between transition-colors ${
                      currentPlant === opt.name ? 'bg-blue-50/70 font-semibold' : ''
                    }`}
                  >
                    <div>
                      <div className="text-xs text-slate-800">{opt.name}</div>
                      <div className="text-[10px] text-emerald-600 font-mono">{opt.cameras}</div>
                    </div>
                    {currentPlant === opt.name && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Middle: Search Trigger */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={() => setSearchModalOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search cameras, EMP ID, safety rules, zones...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-200/70 text-slate-500 rounded border border-slate-300">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Side: KPI Status Pills, Alerts & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Safety Score Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Safety Score {stats.safetyScore}%</span>
          </div>

          {/* Critical Alerts Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>{stats.criticalAlerts} Critical</span>
          </div>

          {/* Warnings Pill */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>{stats.activeWarnings} Warnings</span>
          </div>

          {/* Notification Bell Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setNotifDropdownOpen(!notifDropdownOpen);
                if (!notifDropdownOpen && unacknowledgedAlerts.length > 0) {
                  soundManager.playWarningChime();
                }
              }}
              className={`relative p-2 rounded-lg transition-all ${
                unacknowledgedAlerts.length > 0
                  ? 'text-rose-600 bg-rose-50/80 hover:bg-rose-100/80 ring-1 ring-rose-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              aria-label="View notifications and warning alerts"
              title={`${unacknowledgedAlerts.length} Active Safety Warnings`}
            >
              <Bell className={`w-5 h-5 ${unacknowledgedAlerts.length > 0 ? 'animate-bell-ring text-rose-600' : ''}`} />
              {unacknowledgedAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs ring-2 ring-white animate-pulse">
                  {unacknowledgedAlerts.length}
                </span>
              )}
            </button>

            {/* Notification Menu */}
            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95 overflow-hidden">
                <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                      <Bell className="w-4 h-4 animate-bell-ring" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">Safety Warning Bell Monitor</span>
                      <span className="text-[10px] text-slate-500 font-mono">Live Edge Incursion Stream</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => soundManager.playWarningChime()}
                      className="px-2 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-[10px] font-bold text-slate-700 flex items-center gap-1 shadow-2xs"
                      title="Play factory warning chime"
                    >
                      <Radio className="w-3 h-3 text-blue-600" />
                      <span>Ring Bell</span>
                    </button>
                    <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-mono">
                      {unacknowledgedAlerts.length} Alerts
                    </span>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {alerts.slice(0, 5).map((a) => (
                    <div key={a.id} className="p-3 hover:bg-slate-50/80 transition-colors text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {a.severity === 'critical' ? (
                            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                          )}
                          <span className="font-bold text-slate-900">{a.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{a.timeAgo}</span>
                      </div>
                      <p className="mt-1 text-slate-600 text-[11px] leading-relaxed line-clamp-2">
                        {a.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-500 font-medium">
                          {a.cameraCode} · {a.department}
                        </span>
                        {!a.acknowledged ? (
                          <button
                            onClick={() => {
                              acknowledgeAlert(a.id);
                              soundManager.playAcknowledgeBeep();
                            }}
                            className="text-[11px] px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 font-bold hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1"
                          >
                            <Bell className="w-3 h-3" />
                            <span>Acknowledge</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Acknowledged
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">Audio synthesized by Web Audio API</span>
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(false);
                      navigate('/alerts');
                    }}
                    className="font-bold text-blue-600 hover:text-blue-800"
                  >
                    Open Warning Center &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Button */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <img
              src={user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
            />
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">{user.name}</div>
              <div className="text-[10px] text-slate-500 leading-tight">{user.role}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Global Quick Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 pt-20">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-3 border-b border-slate-200 flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cameras, EMP-102, rules, or alerts..."
                className="flex-1 text-sm outline-hidden text-slate-800 placeholder-slate-400"
                autoFocus
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                ESC
              </button>
            </div>

            <div className="p-3 max-h-80 overflow-y-auto space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-2 py-1">
                Quick Navigation
              </div>
              <button
                onClick={() => handleSearchResultClick('/cameras/cam-03')}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-left text-xs"
              >
                <div>
                  <span className="font-bold text-slate-800">Camera 03 — Maintenance Bay 2</span>
                  <span className="text-slate-400 ml-2 font-mono">CAM-03</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => handleSearchResultClick('/employees/EMP-102')}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-left text-xs"
              >
                <div>
                  <span className="font-bold text-slate-800">Ahmed Khan</span>
                  <span className="text-slate-400 ml-2 font-mono">EMP-102 (Maintenance)</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => handleSearchResultClick('/ai-demo')}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-left text-xs"
              >
                <div>
                  <span className="font-bold text-slate-800">AI Safety Detection Demo</span>
                  <span className="text-emerald-600 ml-2">Interactive Simulation</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => handleSearchResultClick('/safety-rules')}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-left text-xs"
              >
                <div>
                  <span className="font-bold text-slate-800">Safety Rules Management</span>
                  <span className="text-slate-400 ml-2 font-mono">10 Active Rules</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
