import React, { createContext, useContext, useState, useEffect } from 'react';
import { Violation, Alert, Camera, Employee, SafetyRule, SafetyReport } from '../types';
import { INITIAL_VIOLATIONS } from '../data/violations';
import { INITIAL_ALERTS } from '../data/alerts';
import { INITIAL_CAMERAS } from '../data/cameras';
import { INITIAL_EMPLOYEES } from '../data/employees';
import { INITIAL_SAFETY_RULES } from '../data/safetyRules';
import { INITIAL_REPORTS } from '../data/reports';

interface User {
  name: string;
  role: string;
  email: string;
  avatar: string;
  isLoggedIn: boolean;
}

interface SafetyContextType {
  user: User;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  violations: Violation[];
  alerts: Alert[];
  cameras: Camera[];
  employees: Employee[];
  rules: SafetyRule[];
  reports: SafetyReport[];
  currentPlant: string;
  setCurrentPlant: (plant: string) => void;
  autoBroadcastPA: boolean;
  setAutoBroadcastPA: (val: boolean) => void;
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  acknowledgeViolation: (violationId: string) => void;
  resolveViolation: (violationId: string, notes?: string) => void;
  escalateViolation: (violationId: string) => void;
  updateViolationChecklist: (
    violationId: string,
    key: 'audioAlertFired' | 'supervisorNotified' | 'ppeVerified',
    val: boolean
  ) => void;
  toggleRule: (ruleId: string) => void;
  addViolation: (newVio: Violation) => void;
  addAlert: (newAlert: Alert) => void;
  resetToDefaults: () => void;
  stats: {
    totalEmployees: number;
    currentlyWorking: number;
    activeCameras: number;
    totalCameras: number;
    violationsToday: number;
    activeWarnings: number;
    criticalAlerts: number;
    employeesIdle: number;
    safetyScore: number;
  };
}

const SafetyContext = createContext<SafetyContextType | undefined>(undefined);

export const SafetyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User Authentication State
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('safefactory_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {
      name: 'Marcus Cole',
      role: 'Chief Safety Officer',
      email: 'admin@safeFactory.com',
      avatar: '/src/assets/images/avatar_safety_officer_1791272143086.jpg',
      isLoggedIn: true, // pre-authenticated for quick exploration
    };
  });

  const [currentPlant, setCurrentPlant] = useState<string>('Detroit Assembly Plant #4');
  const [autoBroadcastPA, setAutoBroadcastPA] = useState<boolean>(true);

  // Violations
  const [violations, setViolations] = useState<Violation[]>(() => {
    const saved = localStorage.getItem('safefactory_violations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return INITIAL_VIOLATIONS;
  });

  // Alerts
  const [alerts, setAlerts] = useState<Alert[]>(() => {
    const saved = localStorage.getItem('safefactory_alerts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return INITIAL_ALERTS;
  });

  // Cameras
  const [cameras, setCameras] = useState<Camera[]>(() => {
    const saved = localStorage.getItem('safefactory_cameras');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return INITIAL_CAMERAS;
  });

  // Employees
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('safefactory_employees');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return INITIAL_EMPLOYEES;
  });

  // Safety Rules
  const [rules, setRules] = useState<SafetyRule[]>(() => {
    const saved = localStorage.getItem('safefactory_rules');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return INITIAL_SAFETY_RULES;
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('safefactory_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('safefactory_violations', JSON.stringify(violations));
  }, [violations]);

  useEffect(() => {
    localStorage.setItem('safefactory_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('safefactory_cameras', JSON.stringify(cameras));
  }, [cameras]);

  useEffect(() => {
    localStorage.setItem('safefactory_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('safefactory_rules', JSON.stringify(rules));
  }, [rules]);

  // Auth methods
  const login = (email: string, pass: string): boolean => {
    if (email === 'admin@safeFactory.com' && pass === 'admin123') {
      setUser({
        name: 'Marcus Cole',
        role: 'Chief Safety Officer',
        email: 'admin@safeFactory.com',
        avatar: '/src/assets/images/avatar_safety_officer_1791272143086.jpg',
        isLoggedIn: true,
      });
      return true;
    }
    // Also allow any credentials if user types something reasonable
    if (email.trim().length > 3 && pass.length >= 4) {
      setUser({
        name: email.split('@')[0],
        role: 'Safety Lead',
        email,
        avatar: '/src/assets/images/avatar_safety_officer_1791272143086.jpg',
        isLoggedIn: true,
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser((prev) => ({ ...prev, isLoggedIn: false }));
  };

  // Alert methods
  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
  };

  const resolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true, resolved: true } : a))
    );
  };

  const addAlert = (newAlert: Alert) => {
    setAlerts((prev) => [newAlert, ...prev]);
  };

  // Violation methods
  const acknowledgeViolation = (violationId: string) => {
    setViolations((prev) =>
      prev.map((v) => (v.id === violationId ? { ...v, status: 'Acknowledged' } : v))
    );
  };

  const resolveViolation = (violationId: string, notes?: string) => {
    setViolations((prev) =>
      prev.map((v) =>
        v.id === violationId
          ? {
              ...v,
              status: 'Resolved',
              triageNotes: notes || v.triageNotes || 'Verified and resolved by safety supervisor.',
              checklist: {
                audioAlertFired: true,
                supervisorNotified: true,
                ppeVerified: true,
              },
            }
          : v
      )
    );
  };

  const escalateViolation = (violationId: string) => {
    setViolations((prev) =>
      prev.map((v) =>
        v.id === violationId
          ? {
              ...v,
              status: 'Escalated',
              triageNotes: 'Formal escalation issued to HR Safety & Operations Directorate.',
            }
          : v
      )
    );
  };

  const updateViolationChecklist = (
    violationId: string,
    key: 'audioAlertFired' | 'supervisorNotified' | 'ppeVerified',
    val: boolean
  ) => {
    setViolations((prev) =>
      prev.map((v) => {
        if (v.id !== violationId) return v;
        const currentChecklist = v.checklist || {
          audioAlertFired: false,
          supervisorNotified: false,
          ppeVerified: false,
        };
        return {
          ...v,
          checklist: {
            ...currentChecklist,
            [key]: val,
          },
        };
      })
    );
  };

  const addViolation = (newVio: Violation) => {
    setViolations((prev) => [newVio, ...prev]);
  };

  // Rule toggle
  const toggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    );
  };

  // Reset demo
  const resetToDefaults = () => {
    localStorage.removeItem('safefactory_violations');
    localStorage.removeItem('safefactory_alerts');
    localStorage.removeItem('safefactory_cameras');
    localStorage.removeItem('safefactory_employees');
    localStorage.removeItem('safefactory_rules');
    setViolations(INITIAL_VIOLATIONS);
    setAlerts(INITIAL_ALERTS);
    setCameras(INITIAL_CAMERAS);
    setEmployees(INITIAL_EMPLOYEES);
    setRules(INITIAL_SAFETY_RULES);
  };

  // Dynamic system statistics matching specifications
  const activeAlerts = alerts.filter((a) => !a.resolved);
  const criticalCount = activeAlerts.filter((a) => a.severity === 'critical').length;
  const warningsCount = violations.filter((v) => v.severity === 'Warning' && v.status !== 'Resolved').length;

  const stats = {
    totalEmployees: 1248,
    currentlyWorking: 786,
    activeCameras: 42,
    totalCameras: 42,
    violationsToday: violations.length,
    activeWarnings: Math.max(8, warningsCount),
    criticalAlerts: Math.max(3, criticalCount),
    employeesIdle: 34,
    safetyScore: 94,
  };

  return (
    <SafetyContext.Provider
      value={{
        user,
        login,
        logout,
        violations,
        alerts,
        cameras,
        employees,
        rules,
        reports: INITIAL_REPORTS,
        currentPlant,
        setCurrentPlant,
        autoBroadcastPA,
        setAutoBroadcastPA,
        acknowledgeAlert,
        resolveAlert,
        acknowledgeViolation,
        resolveViolation,
        escalateViolation,
        updateViolationChecklist,
        toggleRule,
        addViolation,
        addAlert,
        resetToDefaults,
        stats,
      }}
    >
      {children}
    </SafetyContext.Provider>
  );
};

export const useSafety = (): SafetyContextType => {
  const context = useContext(SafetyContext);
  if (!context) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
};
