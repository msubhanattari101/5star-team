import { SafetyDetectionInput, SafetyDetectionResult, SafetyRule } from '../types';

/**
 * Evaluates factory safety compliance based on the 7 mandatory industrial rules
 * and active system safety rules configuration.
 */
export function evaluateSafetyRules(
  input: SafetyDetectionInput,
  activeRules?: SafetyRule[]
): SafetyDetectionResult {
  const isRuleEnabled = (code: string): boolean => {
    if (!activeRules) return true;
    const rule = activeRules.find((r) => r.code === code);
    return rule ? rule.enabled : true;
  };

  const hash = Math.random().toString(16).substring(2, 12);

  // RULE 1 — SMOKING
  // If smoking === true
  // Show: CRITICAL WARNING Smoking Detected
  // Reason: "Smoking is prohibited inside the factory."
  if (input.smoking && isRuleEnabled('R-104')) {
    return {
      hasViolation: true,
      violationType: 'Smoking Inside Factory',
      severity: 'Critical',
      ruleCode: 'R-104',
      ruleName: 'Prohibition of Smoking & Open Flames',
      reason: 'Smoking is prohibited inside the factory.',
      recommendedAction: 'Immediately extinguish flame/device, escort employee off factory floor, and log safety citation.',
      automatedResponses: [
        'Immediate smoke sensor alert dispatched to floor marshal',
        'Incident logged as zero-tolerance hazard',
        'Strobe warning light activated in sector'
      ],
      telemetryHash: hash,
    };
  }

  // RULE 6 — ELECTRICAL WORK
  // If activity === "Electrical Work"
  // Check: Helmet, Eye Protection, Safety Gloves
  // If gloves are missing: CRITICAL Safety Gloves Missing
  if (input.activity === 'Electrical Work' && isRuleEnabled('R-108')) {
    if (!input.gloves) {
      return {
        hasViolation: true,
        violationType: 'Safety Gloves Missing',
        severity: 'Critical',
        ruleCode: 'R-108',
        ruleName: 'High-Voltage Arc-Flash Gloves Protocol',
        reason: 'Employee is performing electrical work without required protective gloves.',
        recommendedAction: 'Stop task immediately. Verify dielectric arc-flash gloves (Class 0/1) are donned before touching live circuitry.',
        automatedResponses: [
          'High-voltage safety lock broadcast triggered',
          'Immediate supervisor SMS & radio call dispatched',
          'Incident logged to Electrical Safety Bureau'
        ],
        telemetryHash: hash,
      };
    }
    if (!input.helmet) {
      return {
        hasViolation: true,
        violationType: 'Safety Helmet Missing',
        severity: 'Critical',
        ruleCode: 'R-101',
        ruleName: 'Mandatory Hard Hat Protocol',
        reason: 'Employee is performing electrical work without required safety helmet.',
        recommendedAction: 'Halt work and ensure non-conductive dielectric hard hat is worn.',
        automatedResponses: [
          'Electrical bay supervisor dispatched',
          'Telemetry event logged to high-risk ledger'
        ],
        telemetryHash: hash,
      };
    }
    if (!input.eyeProtection) {
      return {
        hasViolation: true,
        violationType: 'Arc-Flash Eye Protection Missing',
        severity: 'Critical',
        ruleCode: 'R-102',
        ruleName: 'Mandatory Eye & Face Shield Protection',
        reason: 'Employee is performing electrical work without rated eye protection.',
        recommendedAction: 'Wear anti-flash safety goggles or face shield prior to opening electrical panels.',
        automatedResponses: [
          'Flash barrier alert flagged on supervisory panel'
        ],
        telemetryHash: hash,
      };
    }
  }

  // RULE 5 — WELDING
  // If activity === "Welding"
  // If eyeProtection === false
  // Show: CRITICAL Eye Protection Missing
  // Also check helmet.
  if (input.activity === 'Welding' && isRuleEnabled('R-110')) {
    if (!input.eyeProtection) {
      return {
        hasViolation: true,
        violationType: 'Eye Protection Missing',
        severity: 'Critical',
        ruleCode: 'R-110',
        ruleName: 'Welding Face Shield & Tinted Lens Protocol',
        reason: 'Employee is performing welding work without required eye protection.',
        recommendedAction: 'Stop welding arc immediately. Put on DIN-rated auto-darkening welding helmet / protective goggles.',
        automatedResponses: [
          'Welding robot cell interlock paused',
          'Audio warning buzzer triggered at welding station',
          'Shift safety steward notified via radio'
        ],
        telemetryHash: hash,
      };
    }
    if (!input.helmet) {
      return {
        hasViolation: true,
        violationType: 'Safety Helmet Missing',
        severity: 'Critical',
        ruleCode: 'R-101',
        ruleName: 'Mandatory Hard Hat Protocol',
        reason: 'Employee is performing welding work without the required safety helmet.',
        recommendedAction: 'Put on heat-resistant protective helmet with shroud.',
        automatedResponses: [
          'Safety beacon triggered in welding booth'
        ],
        telemetryHash: hash,
      };
    }
  }

  // RULE 7 — BUILDING REPAIR
  // If activity === "Building Repair"
  // Check: Helmet, Gloves, Eye Protection where required
  // If helmet is missing: CRITICAL Helmet Not Detected
  if (input.activity === 'Building Repair' && isRuleEnabled('R-109')) {
    if (!input.helmet) {
      return {
        hasViolation: true,
        violationType: 'Helmet Not Detected',
        severity: 'Critical',
        ruleCode: 'R-109',
        ruleName: 'Building Repair & Overhead Protection Policy',
        reason: 'Employee is performing building repair work without the required safety helmet.',
        recommendedAction: 'Stop the task and ensure required PPE is worn before continuing. Halt overhead scaffolding movement.',
        automatedResponses: [
          'Auto-alert dispatched to Area Supervisor',
          'Incident logged as telemetry event',
          'Audible floor beacon triggered in repair zone'
        ],
        telemetryHash: hash,
      };
    }
    if (!input.gloves) {
      return {
        hasViolation: true,
        violationType: 'Cut-Resistant Gloves Missing',
        severity: 'Warning',
        ruleCode: 'R-103',
        ruleName: 'Mandatory Hand Protection Policy',
        reason: 'Employee is handling heavy repair tools and materials without cut-resistant gloves.',
        recommendedAction: 'Don heavy-duty work gloves before operating tools or moving sheet metal.',
        automatedResponses: [
          'Minor advisory logged to shift report'
        ],
        telemetryHash: hash,
      };
    }
  }

  // RULE 4 — HELMET (General Zone Requirement)
  // If helmetRequired === true AND helmet === false
  // Show: CRITICAL Helmet Not Detected
  const isHelmetMandatory = input.helmetRequired ?? true;
  if (isHelmetMandatory && !input.helmet && isRuleEnabled('R-101')) {
    return {
      hasViolation: true,
      violationType: 'Helmet Not Detected',
      severity: 'Critical',
      ruleCode: 'R-101',
      ruleName: 'Mandatory Safety Hard Hat Policy',
      reason: 'Required safety helmet was not detected in a mandatory safety zone.',
      recommendedAction: 'Stop active operations in the zone and equip approved hard hat immediately.',
      automatedResponses: [
        'Zonal perimeter alert broadcast on overhead speaker',
        'Shift supervisor paged on channel 2'
      ],
      telemetryHash: hash,
    };
  }

  // RULE 2 — MOBILE PHONE
  // If mobilePhone === true AND workingTime === true
  // Show: WARNING Mobile Phone Usage Detected
  // Reason: "Employee is using a mobile phone during active working hours."
  if (input.mobilePhone && input.workingTime && isRuleEnabled('R-105')) {
    return {
      hasViolation: true,
      violationType: 'Mobile Phone Usage Detected',
      severity: 'Warning',
      ruleCode: 'R-105',
      ruleName: 'Mobile Device Distraction Prevention',
      reason: 'Employee is using a mobile phone during active working hours.',
      recommendedAction: 'Store mobile device in designated locker or break area. Return attention to machinery.',
      automatedResponses: [
        'Automated digital warning sent to employee console',
        'Warning count updated in employee compliance dossier',
        'Supervisor review logged for shift wrap-up'
      ],
      telemetryHash: hash,
    };
  }

  // RULE 3 — IDLE EMPLOYEE
  // If workingTime === true AND employee is inactive
  // Show: WARNING Employee Inactive
  // Reason: "Employee appears to be inactive during scheduled working hours."
  if (input.idle && input.workingTime && isRuleEnabled('R-107')) {
    return {
      hasViolation: true,
      violationType: 'Employee Inactive (>15 mins)',
      severity: 'Warning',
      ruleCode: 'R-107',
      ruleName: 'Workforce Activity & Idle Time Tracking',
      reason: 'Employee appears to be inactive during scheduled working hours.',
      recommendedAction: 'Check on employee well-being (fatigue / health check) or reassign idle labor to active backlog.',
      automatedResponses: [
        'Workforce health & activity check recommended',
        'Telemetry ping sent to bay team lead'
      ],
      telemetryHash: hash,
    };
  }

  // General gloves check if rule enabled
  if (!input.gloves && isRuleEnabled('R-103') && input.activity !== 'Break / Rest Area') {
    return {
      hasViolation: true,
      violationType: 'Protective Gloves Missing',
      severity: 'Warning',
      ruleCode: 'R-103',
      ruleName: 'Protective Gloves Protocol',
      reason: 'Employee is engaged in manual handling without standard protective gloves.',
      recommendedAction: 'Put on certified PPE gloves before handling parts.',
      automatedResponses: [
        'Advisory notification sent to shift supervisor'
      ],
      telemetryHash: hash,
    };
  }

  // All clear! Nominal compliance
  return {
    hasViolation: false,
    violationType: 'Nominal Compliance',
    severity: 'Nominal',
    ruleCode: 'NOM-100',
    ruleName: 'All Safety Protocols Satisfied',
    reason: 'Employee adheres to all active factory safety requirements and PPE mandates.',
    recommendedAction: 'Maintain continuous vigilance and nominal operation.',
    automatedResponses: [
      'Edge inference confirmed zero infractions',
      'Safety score incremented for shift record'
    ],
    telemetryHash: hash,
  };
}

/**
 * Helper to get phone warning level and handle escalation logic
 */
export function getPhoneWarningLevel(warningCount: number): {
  levelText: string;
  isEscalated: boolean;
  nextStep: string;
} {
  if (warningCount <= 1) {
    return {
      levelText: 'Warning 1 (Verbal Notice)',
      isEscalated: false,
      nextStep: 'Inform employee of distracted walking rule.',
    };
  } else if (warningCount === 2) {
    return {
      levelText: 'Warning 2 (Written Advisory)',
      isEscalated: false,
      nextStep: 'Supervisor meeting required at shift change.',
    };
  } else {
    return {
      levelText: 'Warning 3 (HR Escalation Triggered)',
      isEscalated: true,
      nextStep: 'Floor access suspended pending formal safety retraining.',
    };
  }
}
