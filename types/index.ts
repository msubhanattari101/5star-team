export type Severity = 'Critical' | 'Warning' | 'Minor' | 'Nominal';

export type ViolationStatus = 'Pending' | 'In Review' | 'Acknowledged' | 'Escalated' | 'Resolved';

export type ActivityType = 
  | 'Assembly & Conveyor'
  | 'Welding'
  | 'Building Repair'
  | 'Electrical Work'
  | 'Forklift Operation'
  | 'Component Maintenance'
  | 'Pallet Stacking'
  | 'Machining & Lathe'
  | 'Chemical Handling'
  | 'Break / Rest Area';

export interface BoundingBox {
  id: string;
  label: string;
  tag: string;
  type: 'compliant' | 'violation' | 'warning' | 'info';
  confidence: number;
  x: number; // percentage
  y: number; // percentage
  width: number; // percentage
  height: number; // percentage
}

export interface PPEChecklist {
  helmet: { status: 'Compliant' | 'Missing' | 'Not Required'; ruleId?: string };
  eyeProtection: { status: 'Compliant' | 'Missing' | 'Not Required'; ruleId?: string };
  gloves: { status: 'Compliant' | 'Missing' | 'Not Required'; ruleId?: string };
  mobilePhone: { status: 'Clear' | 'Detected' };
  smoking: { status: 'Clear' | 'Detected' };
  motionState: 'Active Work' | 'Idle' | 'Resting';
}

export interface Camera {
  id: string;
  code: string; // 'CAM-01', 'CAM-02', etc.
  name: string;
  location: string;
  department: string;
  zone: string;
  image: string;
  status: 'normal' | 'warning' | 'alert' | 'offline';
  workersDetected: number;
  currentActivity: string;
  latestViolation: string;
  latestAlert?: string;
  latestAlertTime?: string;
  latencyMs: number;
  fps: number;
  bitrate: string;
  resolution: string;
  assignedUnit: string;
  connectionLink: string;
  fallRiskTier?: string;
  detections: BoundingBox[];
  checklist: PPEChecklist;
  primaryEmployeeId?: string;
}

export interface Employee {
  id: string; // 'EMP-102'
  name: string;
  photo: string;
  department: string;
  role: string;
  shift: string; // 'Shift A (06:00 - 14:30)'
  currentActivity: string;
  currentLocation: string;
  currentCameraId: string;
  safetyScore: number;
  warnings: number;
  status: 'active' | 'idle' | 'off-shift';
  phone: string;
  email: string;
  supervisor: string;
  stats: {
    warnings: number;
    violations: number;
    resolved: number;
    safetyChecks: number;
  };
  safetyHistory: SafetyHistoryItem[];
}

export interface SafetyHistoryItem {
  id: string;
  date: string;
  time: string;
  type: string;
  severity: Severity;
  description: string;
  camera: string;
  resolved: boolean;
  actionTaken: string;
}

export interface Violation {
  id: string; // 'VIO-8492'
  employeeId: string;
  employeeName: string;
  employeePhoto?: string;
  activity: string;
  department: string;
  cameraCode: string;
  cameraName: string;
  location: string;
  zone: string;
  violationType: string;
  severity: Severity;
  timestamp: string;
  timeAgo: string;
  status: ViolationStatus;
  reason: string;
  recommendedAction: string;
  confidence: number;
  ruleCode: string;
  imageSnapshot?: string;
  triageNotes?: string;
  checklist?: {
    audioAlertFired: boolean;
    supervisorNotified: boolean;
    ppeVerified: boolean;
  };
}

export interface Alert {
  id: string;
  title: string;
  severity: 'critical' | 'warning' | 'minor';
  employeeId?: string;
  employeeName?: string;
  department: string;
  cameraCode: string;
  location: string;
  timestamp: string;
  timeAgo: string;
  description: string;
  acknowledged: boolean;
  resolved: boolean;
  autoHaltEnabled?: boolean;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headOfDepartment: string;
  employeesCount: number;
  camerasCount: number;
  safetyScore: number;
  activeAlertsCount: number;
  zones: string[];
  description: string;
  riskRating: 'Low' | 'Medium' | 'High';
}

export interface SafetyRule {
  id: string;
  code: string; // 'R-101'
  name: string;
  category: 'PPE' | 'Behavioral' | 'High Risk' | 'Workforce';
  description: string;
  reasonStatement: string;
  severity: Severity;
  enabled: boolean;
  targetActivity?: string;
  zoneRequired?: string;
  ppeRequired?: string;
  triggersToday: number;
  penaltyAction: string;
}

export interface SafetyReport {
  id: string;
  title: string;
  type: 'Daily' | 'Weekly' | 'Monthly' | 'Employee' | 'PPE' | 'Department' | 'Camera';
  period: string;
  date: string;
  complianceScore: number;
  totalViolations: number;
  criticalCount: number;
  warningsCount: number;
  author: string;
  summary: string;
  keyFindings: string[];
}

export interface SafetyDetectionInput {
  employeeId: string;
  activity: ActivityType | string;
  location: string;
  workingTime: boolean;
  helmet: boolean;
  eyeProtection: boolean;
  gloves: boolean;
  mobilePhone: boolean;
  smoking: boolean;
  idle: boolean;
  helmetRequired?: boolean;
}

export interface SafetyDetectionResult {
  hasViolation: boolean;
  violationType: string;
  severity: Severity;
  ruleCode: string;
  ruleName: string;
  reason: string;
  recommendedAction: string;
  automatedResponses: string[];
  telemetryHash: string;
}
