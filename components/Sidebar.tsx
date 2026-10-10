import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Video,
  ScanEye,
  AlertTriangle,
  Cpu,
  Factory,
  Users,
  BarChart3,
  ShieldCheck,
  Settings,
  LogOut,
  X,
  Radio,
  FileText
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout, violations, stats } = useSafety();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      to: '/cameras',
      label: 'Live Cameras',
      icon: Video,
      badge: `${stats.activeCameras} Active`,
      badgeColor: 'bg-blue-100 text-blue-700 font-semibold',
    },
    {
      to: '/cameras/cam-03',
      label: 'Camera Details',
      icon: ScanEye,
    },
    {
      to: '/violations',
      label: 'Safety Violations',
      icon: AlertTriangle,
      badge: `${violations.length} Today`,
      badgeColor: 'bg-rose-100 text-rose-700 font-semibold',
    },
    {
      to: '/ai-demo',
      label: 'AI Detection Demo',
      icon: Cpu,
      badge: 'Simulation',
      badgeColor: 'bg-emerald-100 text-emerald-700 font-semibold',
    },
    {
      to: '/factory',
      label: 'Factory Floor (Zones)',
      icon: Factory,
    },
    {
      to: '/departments',
      label: 'Departments',
      icon: Factory,
    },
    {
      to: '/employees',
      label: 'Employees & Shifts',
      icon: Users,
    },
    {
      to: '/alerts',
      label: 'Alerts Center',
      icon: Radio,
      badge: `${stats.criticalAlerts} Critical`,
      badgeColor: 'bg-rose-100 text-rose-700 font-semibold',
    },
    {
      to: '/analytics',
      label: 'Analytics',
      icon: BarChart3,
    },
    {
      to: '/reports',
      label: 'Reports & Dossiers',
      icon: FileText,
    },
    {
      to: '/safety-rules',
      label: 'Safety Rules',
      icon: ShieldCheck,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-lg text-slate-900 tracking-tight">SafeFactory</span>
              </div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Vision Telemetry OS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg lg:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Edge Node Telemetry Badge */}
        <div className="px-4 pt-3 pb-2">
          <div className="bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-2 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-slate-700">EDGE NODE #4</span>
            </div>
            <span className="text-slate-500 text-[11px]">12ms</span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-white/20 text-white' : item.badgeColor
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Area */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50 space-y-2">
          {/* Compliance Guard pill */}
          <div className="px-3 py-2 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs text-slate-600 shadow-2xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Compliance Guard</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400">v4.8.2-prod</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
          </div>

          {/* User profile & Logout */}
          <div className="pt-1 flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900 truncate">{user.name}</div>
                <div className="text-[10px] text-slate-500 truncate">{user.role}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
