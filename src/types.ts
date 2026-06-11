/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AlarmSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export interface AlarmLog {
  id: string;
  timestamp: string; // ISO string or time string
  severity: AlarmSeverity;
  dimensionName: string;
  dimensionId: string;
  value: number;
  limitLabel: string;
  nominalValue: number;
  status: 'UNRESOLVED' | 'IN REVIEW' | 'RESOLVED' | 'FIXING';
  workshop: string;
  carModel: string;
  acknowledgedBy?: string;
  notes?: string;
}

export interface Incident {
  id: string; // e.g., INC-970
  title: string;
  sector: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO' | 'CLOSED';
  status: 'DETECTED' | 'ANALYZING' | 'FIXING' | 'RESOLVED';
  triggerTime: string; // e.g., 'TRIGGERED 4M AGO' or timestamp
  rca?: string; // Root Cause Analysis
  tags: string[];
  engineer?: {
    name: string;
    avatar: string;
    role: string;
  };
  progress: number; // 0 to 100
  timeline: {
    time: string;
    text: string;
    completed?: boolean;
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'ENGINEER' | 'OPERATOR';
  lastAccess: string;
  status: 'ACTIVE' | 'OFFLINE';
}

export interface AlarmRule {
  id: string;
  ruleId: string;
  dimension: string;
  condition: '>' | '<';
  value: number;
  severity: AlarmSeverity | 'SHUTDOWN' | 'MAINTENANCE';
  action: string;
  active: boolean;
}

export interface SPCDataPoint {
  index: number;
  value: number;
  ucl: number;
  lcl: number;
  mean: number;
  scanTime: string;
  batchId: string;
  isViolation?: boolean;
}
