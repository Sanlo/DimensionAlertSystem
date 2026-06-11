/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AlarmLog, Incident, User, AlarmRule, SPCDataPoint, AlarmSeverity } from './types';

// Standard storage keys
export const STORAGE_KEYS = {
  ALARM_LOGS: 'spc_alarm_logs',
  INCIDENTS: 'spc_incidents',
  USERS: 'spc_users',
  ALARM_RULES: 'spc_alarm_rules',
  SPC_DATA: 'spc_data_points',
};

// Initial data values matching screenshots precisely
export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Zhang Wei',
    email: 'z.wei@factory-spc.io',
    role: 'ADMIN',
    lastAccess: '2023-11-24 09:42',
    status: 'ACTIVE',
  },
  {
    id: 'usr-2',
    name: 'Li Na',
    email: 'l.na@factory-spc.io',
    role: 'ENGINEER',
    lastAccess: '2023-11-23 18:15',
    status: 'ACTIVE',
  },
  {
    id: 'usr-3',
    name: 'Chen Bo',
    email: 'c.bo@factory-spc.io',
    role: 'OPERATOR',
    lastAccess: '2023-11-20 14:02',
    status: 'OFFLINE',
  }
];

export const INITIAL_ALARM_RULES: AlarmRule[] = [
  {
    id: 'rule-1',
    ruleId: '992-X',
    dimension: 'EXTERIOR_DIAMETER_X1',
    condition: '>',
    value: 0.50,
    severity: 'CRITICAL',
    action: 'Push Alert + STOP_LINE',
    active: true,
  },
  {
    id: 'rule-2',
    ruleId: '841-Y',
    dimension: 'INTERIOR_CLEARANCE_Y2',
    condition: '<',
    value: 0.20,
    severity: 'WARNING',
    action: 'Maintenance Ticket',
    active: true,
  }
];

export const INITIAL_ALARM_LOGS: AlarmLog[] = [
  {
    id: 'log-1',
    timestamp: '14:22:05',
    severity: 'CRITICAL',
    dimensionName: 'Rear Door Alignment (RD-04)',
    dimensionId: 'DIM_GAP_001',
    value: 45.24,
    limitLabel: 'UCL 45.10',
    nominalValue: 45.00,
    status: 'UNRESOLVED',
    workshop: 'Workshop B',
    carModel: 'Model X3',
  },
  {
    id: 'log-2',
    timestamp: '14:18:12',
    severity: 'WARNING',
    dimensionName: 'Chassis Clearance (CH-89)',
    dimensionId: 'DIM_O_022',
    value: 110.05,
    limitLabel: 'LCL 110.10',
    nominalValue: 110.15,
    status: 'IN REVIEW',
    workshop: 'Workshop A',
    carModel: 'Model S',
  },
  {
    id: 'log-3',
    timestamp: '14:15:44',
    severity: 'INFO',
    dimensionName: 'Panel Gap Tolerance (PG-22)',
    dimensionId: 'DIM_S_005',
    value: 3.12,
    limitLabel: 'Nominal 3.00',
    nominalValue: 3.00,
    status: 'RESOLVED',
    workshop: 'Workshop C',
    carModel: 'Model 3',
  },
  {
    id: 'log-4',
    timestamp: '14:10:02',
    severity: 'CRITICAL',
    dimensionName: 'Wheelbase Precision (WB-01)',
    dimensionId: 'DIM_GAP_001',
    value: 2850.5,
    limitLabel: 'UCL 2850.2',
    nominalValue: 2850.0,
    status: 'UNRESOLVED',
    workshop: 'Workshop B',
    carModel: 'Model X3',
  },
  {
    id: 'log-5',
    timestamp: '14:05:30',
    severity: 'WARNING',
    dimensionName: 'Roof Panel Weld (RW-44)',
    dimensionId: 'DIM_GAP_001',
    value: 1.25,
    limitLabel: 'LCL 1.20',
    nominalValue: 1.22,
    status: 'FIXING',
    workshop: 'Workshop A',
    carModel: 'Model Y',
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-982',
    title: 'AXLE-WIDTH DEVIATION',
    sector: 'Line 04: Sector C-12',
    severity: 'CRITICAL',
    status: 'DETECTED',
    triggerTime: 'TRIGGERED 4M AGO',
    tags: ['Axle Width', 'Mechanical', 'Calibration'],
    progress: 0,
    timeline: [
      { time: '02:15 PM', text: 'Deviation identified on Axle Alignment rig' },
      { time: '02:12 PM', text: 'Telemetry alert threshold exceeded (>0.75mm)' }
    ],
  },
  {
    id: 'INC-985',
    title: 'HYDRAULIC SPIKE',
    sector: 'Press-B Unit',
    severity: 'CRITICAL',
    status: 'DETECTED',
    triggerTime: 'TRIGGERED 12M AGO',
    tags: ['Hydraulic', 'Pressure Rig', 'Sector B'],
    progress: 5,
    timeline: [
      { time: '02:02 PM', text: 'Pressure overload alert triggered (310 Bar)' }
    ],
  },
  {
    id: 'INC-978',
    title: 'CALIBRATION DRIFT',
    sector: 'Milling Center 02',
    severity: 'WARNING',
    status: 'ANALYZING',
    triggerTime: 'TRIGGERED 1H AGO',
    tags: ['Milling', 'Spindle Drift', 'Sector C'],
    rca: 'Continuous friction heat is causing minor spindle misalignment.',
    progress: 35,
    engineer: {
      name: 'M. CHEN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
      role: 'Production Engineer',
    },
    timeline: [
      { time: '01:30 PM', text: 'Thermal scan requested for spindle base' },
      { time: '01:10 PM', text: 'Spindle wear profile initiated' },
      { time: '01:02 PM', text: 'Telemetry indicated 3 consecutive warnings' }
    ]
  },
  {
    id: 'INC-970',
    title: 'SENSOR TIMEOUT',
    sector: 'Sector A-09 (Primary)',
    severity: 'CRITICAL',
    status: 'FIXING',
    triggerTime: 'TRIGGERED 2H AGO',
    tags: ['Sensor Fail', 'Ultrasonic', 'Sector A-09'],
    rca: 'Ultrasonic sensor failed to transmit signal due to excessive vibration harmonics in Sector A-09 frame.',
    progress: 65,
    engineer: {
      name: 'Siddharth Varma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop',
      role: 'Senior Field Engineer',
    },
    timeline: [
      { time: '09:42 AM', text: 'Mitigation protocol started' },
      { time: '09:15 AM', text: 'Technician assigned to case' },
      { time: '09:02 AM', text: 'Anomaly detected by Central Core' }
    ]
  },
  {
    id: 'INC-965',
    title: 'VOLTAGE FLUCTUATION',
    sector: 'Main Power Grid',
    severity: 'CLOSED',
    status: 'RESOLVED',
    triggerTime: 'RESOLVED BY SYSTEM',
    tags: ['Power Regulator', 'Grid Spike'],
    rca: 'Temporary phase switchover from substation triggered minor ripple.',
    progress: 100,
    timeline: [
      { time: '08:45 AM', text: 'Voltage stabilized at nominal 12.04kV' },
      { time: '08:40 AM', text: 'Automatic power shunt completed' },
      { time: '08:35 AM', text: 'Transient ripple of +4% detected' }
    ]
  }
];

export const INITIAL_SPC_POINTS: SPCDataPoint[] = [
  { index: 1, value: 1.00, ucl: 1.25, lcl: 0.75, mean: 1.00, scanTime: '08:00:00', batchId: 'BX-992-K' },
  { index: 2, value: 0.90, ucl: 1.25, lcl: 0.75, mean: 1.00, scanTime: '08:20:00', batchId: 'BX-992-K' },
  { index: 3, value: 1.05, ucl: 1.25, lcl: 0.75, mean: 1.00, scanTime: '08:40:00', batchId: 'BX-992-K' },
  { index: 4, value: 0.95, ucl: 1.25, lcl: 0.75, mean: 1.00, scanTime: '09:00:00', batchId: 'BX-992-K' },
  { index: 5, value: 1.02, ucl: 1.25, lcl: 0.75, mean: 1.00, scanTime: '09:20:00', batchId: 'BX-992-K' },
  { index: 6, value: 1.32, ucl: 1.25, lcl: 0.75, mean: 1.00, scanTime: '09:40:00', batchId: 'BX-992-K', isViolation: true }, // Out of UCL
  { index: 7, value: 1.01, ucl: 1.25, lcl: 0.75, mean: 1.00, scanTime: '10:00:00', batchId: 'BX-992-K' },
  { index: 8, value: 0.92, ucl: 1.25, lcl: 0.75, mean: 1.00, scanTime: '10:20:00', batchId: 'BX-992-K' },
  { index: 9, value: 1.08, ucl: 1.25, lcl: 0.75, mean: 1.00, scanTime: '10:40:00', batchId: 'BX-992-K' },
  { index: 10, value: 0.97, ucl: 1.25, lcl: 0.75, mean: 1.00, scanTime: '11:00:00', batchId: 'BX-992-K' },
  { index: 11, value: 1.00, ucl: 1.25, lcl: 0.75, mean: 1.00, scanTime: '11:20:00', batchId: 'BX-992-K' },
  { index: 12, value: 1.03, ucl: 1.25, lcl: 0.75, mean: 1.00, scanTime: '11:40:00', batchId: 'BX-992-K' },
  { index: 13, value: 0.94, ucl: 1.25, lcl: 0.75, mean: 1.00, scanTime: '12:00:00', batchId: 'BX-992-K' },
  { index: 14, value: 0.61, ucl: 1.25, lcl: 0.75, mean: 1.00, scanTime: '12:20:00', batchId: 'BX-992-K', isViolation: true }, // Out of LCL
  { index: 15, value: 1.05, ucl: 1.25, lcl: 0.75, mean: 1.00, scanTime: '12:40:00', batchId: 'BX-992-K' },
  { index: 16, value: 0.96, ucl: 1.25, lcl: 0.75, mean: 1.00, scanTime: '13:00:00', batchId: 'BX-992-K' },
  { index: 17, value: 1.00, ucl: 1.25, lcl: 0.75, mean: 1.00, scanTime: '13:20:00', batchId: 'BX-992-K' },
  { index: 18, value: 1.02, ucl: 1.25, lcl: 0.75, mean: 1.00, scanTime: '13:40:00', batchId: 'BX-992-K' },
  { index: 19, value: 1.35, ucl: 1.25, lcl: 0.75, mean: 1.00, scanTime: '14:00:00', batchId: 'BX-992-K', isViolation: true }, // Extreme out
  { index: 20, value: 1.04, ucl: 1.25, lcl: 0.75, mean: 1.00, scanTime: '14:20:00', batchId: 'BX-992-K' },
  { index: 21, value: 0.99, ucl: 1.25, lcl: 0.75, mean: 1.00, scanTime: '14:40:00', batchId: 'BX-992-K' }
];

// Helper functions for persistent state loading & saving
export function loadFromLocalStorage<T>(key: string, initialData: T): T {
  try {
    const value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value) as T;
    }
  } catch (e) {
    console.warn(`Error loading state from localStorage for: ${key}`, e);
  }
  // Store default
  saveToLocalStorage(key, initialData);
  return initialData;
}

export function saveToLocalStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving state to localStorage for: ${key}`, e);
  }
}
