import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation
} from 'react-router-dom';
import { SafetyProvider, useSafety } from './context/SafetyContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { LiveCameras } from './pages/LiveCameras';
import { CameraDetails } from './pages/CameraDetails';
import { Violations } from './pages/Violations';
import { Alerts } from './pages/Alerts';
import { FactoryOverview } from './pages/FactoryOverview';
import { Departments } from './pages/Departments';
import { Employees } from './pages/Employees';
import { EmployeeProfile } from './pages/EmployeeProfile';
import { SafetyRules } from './pages/SafetyRules';
import { Analytics } from './pages/Analytics';
import { Reports } from './pages/Reports';
import { AIDemo } from './pages/AIDemo';
import { Settings } from './pages/Settings';

/**
 * Main application layout enclosing the Sidebar, Header, and content viewport
 */
const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSafety();
  const location = useLocation();

  if (!user.isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex text-[#0b1c30]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <SafetyProvider>
      <Router>
        <Routes>
          {/* Public login */}
          <Route path="/login" element={<Login />} />

          {/* Authenticated routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cameras" element={<LiveCameras />} />
            <Route path="/cameras/:id" element={<CameraDetails />} />
            <Route path="/violations" element={<Violations />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/factory" element={<FactoryOverview />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/employees/:id" element={<EmployeeProfile />} />
            <Route path="/safety-rules" element={<SafetyRules />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/ai-demo" element={<AIDemo />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </SafetyProvider>
  );
}
