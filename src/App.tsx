/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AlarmLog, Incident, User, AlarmRule, SPCDataPoint } from './types';
import { 
  loadFromLocalStorage, 
  saveToLocalStorage, 
  STORAGE_KEYS, 
  INITIAL_ALARM_LOGS, 
  INITIAL_INCIDENTS, 
  INITIAL_USERS, 
  INITIAL_ALARM_RULES, 
  INITIAL_SPC_POINTS 
} from './mockData';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import SPCTrendsView from './components/SPCTrendsView';
import IncidentView from './components/IncidentView';
import SettingsView from './components/SettingsView';
import { Plus, X, AlertOctagon, Sliders, CheckCircle } from 'lucide-react';

export default function App() {
  // Navigation Tabs: 'dashboard' | 'trends' | 'incidents' | 'settings'
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Primary SPC States
  const [logs, setLogs] = useState<AlarmLog[]>(() => 
    loadFromLocalStorage(STORAGE_KEYS.ALARM_LOGS, INITIAL_ALARM_LOGS)
  );
  const [incidents, setIncidents] = useState<Incident[]>(() => 
    loadFromLocalStorage(STORAGE_KEYS.INCIDENTS, INITIAL_INCIDENTS)
  );
  const [users, setUsers] = useState<User[]>(() => 
    loadFromLocalStorage(STORAGE_KEYS.USERS, INITIAL_USERS)
  );
  const [alarmRules, setAlarmRules] = useState<AlarmRule[]>(() => 
    loadFromLocalStorage(STORAGE_KEYS.ALARM_RULES, INITIAL_ALARM_RULES)
  );
  const [dataPoints, setDataPoints] = useState<SPCDataPoint[]>(() => 
    loadFromLocalStorage(STORAGE_KEYS.SPC_DATA, INITIAL_SPC_POINTS)
  );

  // Simulation parameters
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [nodeStatus, setNodeStatus] = useState<'CONNECTED' | 'DISCONNECTED'>('CONNECTED');
  const [manualAlertOpen, setManualAlertOpen] = useState(false);

  // Manual Alarm state
  const [manualDimName, setManualDimName] = useState('Manual Core Alignment Failure - RD-09');
  const [manualValue, setManualValue] = useState(1.42);
  const [manualSeverity, setManualSeverity] = useState<'CRITICAL' | 'WARNING' | 'INFO'>('CRITICAL');

  // Sync to outer localStorage upon mutations
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.ALARM_LOGS, logs);
  }, [logs]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.INCIDENTS, incidents);
  }, [incidents]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.USERS, users);
  }, [users]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.ALARM_RULES, alarmRules);
  }, [alarmRules]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.SPC_DATA, dataPoints);
  }, [dataPoints]);

  // Real-time automatic telemetry engine
  useEffect(() => {
    if (!isSimulating || nodeStatus === 'DISCONNECTED') return;

    const interval = setInterval(() => {
      // Simulate real-time 50Hz sensor data aggregate (periodically checking bounds)
      const nominal = 1.00;
      // 15% chance of out-of-control deviation or spike
      const isOutlier = Math.random() < 0.15;
      const noise = (Math.random() - 0.5) * (isOutlier ? 0.65 : 0.14);
      const newValue = parseFloat((nominal + noise).toFixed(3));

      // Append new point to SPC Chart tracking lines (maintain maximum of 25 nodes to scroll)
      setDataPoints(prev => {
        const nextIdx = prev.length + 1;
        const scanHours = new Date().toLocaleTimeString('en-US', { hour12: false });
        const newPoint: SPCDataPoint = {
          index: nextIdx,
          value: newValue,
          ucl: 1.25,
          lcl: 0.75,
          mean: nominal,
          scanTime: scanHours,
          batchId: `BX-993-${Math.random() > 0.5 ? 'K' : 'L'}`,
          isViolation: newValue > 1.25 || newValue < 0.75,
        };
        const updated = [...prev, newPoint];
        if (updated.length > 25) {
          updated.shift();
        }
        return updated;
      });

      // Match measurement value against active alarm rule parameters
      const violatedRule = alarmRules.find(rule => {
        if (!rule.active) return false;
        if (rule.condition === '>') return newValue > rule.value;
        if (rule.condition === '<') return newValue < rule.value;
        return false;
      });

      if (violatedRule) {
        // Automatically dispatch live log alert
        const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false });
        const isCrit = violatedRule.severity === 'CRITICAL' || violatedRule.severity === 'SHUTDOWN';
        
        const newLog: AlarmLog = {
          id: `log-${Date.now()}`,
          timestamp: nowStr,
          severity: isCrit ? 'CRITICAL' : 'WARNING',
          dimensionName: `${violatedRule.dimension.replace(/_/g, ' ')} Drift (Auto-Trig)`,
          dimensionId: violatedRule.ruleId,
          value: newValue,
          limitLabel: `${violatedRule.condition} ${violatedRule.value}mm`,
          nominalValue: 1.00,
          status: 'UNRESOLVED',
          workshop: 'East Wing Assembly (东区)',
          carModel: 'Model-S30 (豪华版)',
        };

        setLogs(prev => [newLog, ...prev]);

        // Automatically log custom Kanban card incident for critical limits failures
        if (isCrit) {
          const incId = `INC-${Math.floor(100 + Math.random() * 899)}`;
          const newInc: Incident = {
            id: incId,
            title: `${violatedRule.dimension.replace(/_/g, ' ')} ANOMALY`,
            sector: 'East Wing Assembly - Spindle 04',
            severity: 'CRITICAL',
            status: 'DETECTED',
            triggerTime: 'TRIGGERED JUST NOW',
            tags: [violatedRule.dimension, 'Auto Sensor', 'Alarm Rule'],
            rca: `Auto trigger rule ${violatedRule.ruleId} met. Measurement value (${newValue}mm) exceeded limits. Action: ${violatedRule.action}`,
            progress: 0,
            timeline: [
              { time: nowStr, text: `Continuous alarm rule limit exceeded with ${newValue}mm` },
              { time: nowStr, text: `Dispatched auto-remediation protocols: ${violatedRule.action}` }
            ]
          };

          setIncidents(prev => [newInc, ...prev]);
        }
      }

    }, 8000); // Trigger every 8 seconds to prevent excessive logging clutter while feeling live

    return () => clearInterval(interval);
  }, [isSimulating, alarmRules, nodeStatus]);

  // Operational state mutators passed of to child cards
  const handleAcknowledgeLog = (logId: string) => {
    setLogs(prev => prev.map(log => {
      if (log.id === logId) {
        return { ...log, status: 'FIXING' };
      }
      return log;
    }));

    // Check if there is an active incident linked to update
    const matchingLog = logs.find(l => l.id === logId);
    if (matchingLog) {
      setIncidents(prev => prev.map(inc => {
        // Move related auto incident tracking along the kanban board
        if (inc.status === 'DETECTED') {
          return { 
            ...inc, 
            status: 'FIXING', 
            progress: 30,
            timeline: [
              { time: new Date().toLocaleTimeString(), text: 'Operational technician acknowledged anomaly log and assigned field support.' },
              ...inc.timeline
            ]
          };
        }
        return inc;
      }));
    }
  };

  const handleResolveLog = (logId: string) => {
    setLogs(prev => prev.map(log => {
      if (log.id === logId) {
        return { ...log, status: 'RESOLVED' };
      }
      return log;
    }));
  };

  // Manual alarm log addition (Floating Action Modal panel)
  const handleRaiseManualAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false });
    
    const newLog: AlarmLog = {
      id: `log-${Date.now()}`,
      timestamp: nowStr,
      severity: manualSeverity,
      dimensionName: manualDimName,
      dimensionId: 'DIM_GAP_022',
      value: manualValue,
      limitLabel: `Limit Triggered manually`,
      nominalValue: 1.00,
      status: 'UNRESOLVED',
      workshop: 'Workshop X',
      carModel: 'Model-X10 (旗舰版)',
    };

    setLogs(prev => [newLog, ...prev]);

    // Add matched manual Incident Kanban ticket
    const incId = `INC-${Math.floor(100 + Math.random() * 899)}`;
    const newInc: Incident = {
      id: incId,
      title: manualDimName.toUpperCase(),
      sector: 'Workshop X: Custom Core Align Line',
      severity: manualSeverity,
      status: 'DETECTED',
      triggerTime: 'TRIGGERED MANUALLY',
      tags: ['Manual Dispatch', 'Emergency Override'],
      rca: `Manual operator log filed by engineer. Action required: Inspect spindle alignment and recalibrate lasers.`,
      progress: 0,
      timeline: [
        { time: nowStr, text: `Operational override trigger logged manually by ZHANG WEI with val ${manualValue}mm.` }
      ]
    };

    setIncidents(prev => [newInc, ...prev]);
    setManualAlertOpen(false);
  };

  // Incident callbacks
  const handleAddIncident = (newInc: Incident) => {
    setIncidents(prev => [newInc, ...prev]);
  };

  const handleUpdateIncidentStatus = (id: string, nextStatus: 'DETECTED' | 'ANALYZING' | 'FIXING' | 'RESOLVED') => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        const updatedTimeline = [
          { time: new Date().toLocaleTimeString('en-US', { hour12: false }), text: `Incident state changed to: ${nextStatus}` },
          ...inc.timeline
        ];
        return { 
          ...inc, 
          status: nextStatus, 
          progress: nextStatus === 'RESOLVED' ? 100 : nextStatus === 'FIXING' ? 65 : 30,
          timeline: updatedTimeline
        };
      }
      return inc;
    }));
  };

  const handleAddIncidentNote = (id: string, noteText: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        const timeNow = new Date().toLocaleTimeString('en-US', { hour12: false });
        return {
          ...inc,
          timeline: [
            { time: timeNow, text: `Supervisor note: "${noteText}"` },
            ...inc.timeline
          ]
        };
      }
      return inc;
    }));
  };

  // User list overrides
  const handleAddUser = (user: User) => {
    setUsers(prev => [...prev, user]);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  // Rules overrides
  const handleAddRule = (rule: AlarmRule) => {
    setAlarmRules(prev => [...prev, rule]);
  };

  const handleRemoveRule = (id: string) => {
    setAlarmRules(prev => prev.filter(r => r.id !== id));
  };

  const activeUnresolvedAlarms = logs.filter(l => l.status === 'UNRESOLVED').length;

  return (
    <div className="min-h-screen bg-[#051424] text-[#d4e4fa]">
      
      {/* Layout Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        unreadCount={activeUnresolvedAlarms}
        onOpenManualAlertModal={() => setManualAlertOpen(true)}
        isSimulating={isSimulating}
      />

      {/* Sidebar navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isSimulating={isSimulating}
        onToggleSimulation={() => setIsSimulating(!isSimulating)}
        nodeStatus={nodeStatus}
        systemHealth={logs.some(l => l.status === 'UNRESOLVED' && l.severity === 'CRITICAL') ? 'DEGRADED' : 'OPERATIONAL'}
      />

      {/* Main Content Pane */}
      <main className="md:ml-64 pt-20 px-4 md:px-6 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto py-4">
          {activeTab === 'dashboard' && (
            <DashboardView
              logs={logs}
              onAcknowledge={handleAcknowledgeLog}
              onResolve={handleResolveLog}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'trends' && (
            <SPCTrendsView
              dataPoints={dataPoints}
              onGenerateAnalysis={() => {
                // Simulate quick update
                const nominal = 1.00;
                setDataPoints(prev => {
                  const refreshed = prev.map(pt => {
                    const deviation = (Math.random() - 0.5) * 0.12;
                    return { ...pt, value: parseFloat((nominal + deviation).toFixed(3)) };
                  });
                  return refreshed;
                });
              }}
              violationsCount={logs.filter(l => l.status === 'UNRESOLVED').length}
            />
          )}

          {activeTab === 'incidents' && (
            <IncidentView
              incidents={incidents}
              onAddIncident={handleAddIncident}
              onUpdateIncidentStatus={handleUpdateIncidentStatus}
              onAddIncidentNote={handleAddIncidentNote}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              users={users}
              onAddUser={handleAddUser}
              onDeleteUser={handleDeleteUser}
              alarmRules={alarmRules}
              onAddRule={handleAddRule}
              onRemoveRule={handleRemoveRule}
            />
          )}
        </div>
      </main>

      {/* Floating Action Button (FAB) on bottom right for instant alarm trigger */}
      <button 
        onClick={() => setManualAlertOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#4b8eff] text-[#002e69] hover:bg-[#00eefc] rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group border border-[#adc6ff]/50 cursor-pointer"
        title="MANUAL EMERGENCY OVERRIDE"
      >
        <Plus className="w-6 h-6 stroke-[3]" />
        
        {/* Hover popover tooltip banner */}
        <span className="absolute right-16 bg-[#273647] text-[#d4e4fa] px-3 py-1.5 rounded-lg font-mono text-[9px] uppercase tracking-wider font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-[#414755]/40 whitespace-nowrap">
          MANUAL OVERRIDE ALARM
        </span>
      </button>

      {/* Manual Emergency Alert Modal Popup */}
      {manualAlertOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#122131] border border-[#adc6ff]/25 rounded-2xl p-6 max-w-md w-full relative overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Background design accents */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#ffb4ab] animate-pulse" />

            {/* Title */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-[#ffb4ab]" />
                <h3 className="text-sm font-sans font-bold text-white uppercase tracking-wider">
                  Manual Alert Dispatcher
                </h3>
              </div>
              <button 
                onClick={() => setManualAlertOpen(false)}
                className="text-[#c1c6d7] hover:text-[#ffb4ab] transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#c1c6d7] leading-relaxed mb-4 font-sans">
              Enter the parameters below to trigger a real-time manual alarm stream event. This will register immediately across the active live logs, metrics, and incident kanban boards.
            </p>

            <form onSubmit={handleRaiseManualAlarm} className="space-y-4">
              <div>
                <label className="text-[9px] font-mono font-bold text-[#c1c6d7] tracking-wider block mb-1">
                  DIMENSION SPECIFICATION / EVENT LABEL
                </label>
                <input 
                  type="text" 
                  value={manualDimName}
                  onChange={(e) => setManualDimName(e.target.value)}
                  className="w-full bg-[#0d1c2d] border border-[#414755]/40 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#4b8eff]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-mono font-bold text-[#c1c6d7] tracking-wider block mb-1">
                    MEASUREMENT VALUE (MM)
                  </label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={manualValue}
                    onChange={(e) => setManualValue(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#0d1c2d] border border-[#414755]/40 rounded-lg p-2 text-xs text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono font-bold text-[#c1c6d7] tracking-wider block mb-1">
                    SEVERITY LEVEL
                  </label>
                  <select 
                    value={manualSeverity}
                    onChange={(e) => setManualSeverity(e.target.value as any)}
                    className="w-full bg-[#0d1c2d] border border-[#414755]/40 rounded-lg p-2 text-xs text-white font-mono"
                  >
                    <option value="CRITICAL">CRITICAL (STOP_LINE)</option>
                    <option value="WARNING">WARNING (MAINTENANCE)</option>
                    <option value="INFO">INFO (LOG ONLY)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-[#414755]/15 flex gap-2 justify-end text-xs">
                <button 
                  type="button" 
                  onClick={() => setManualAlertOpen(false)}
                  className="px-4 py-2 border border-[#414755]/30 rounded-lg text-[#c1c6d7] hover:bg-[#273647]/50"
                >
                  CANCEL
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#ffb4ab]/15 text-[#ffb4ab] border border-[#ffb4ab]/30 rounded-lg font-mono font-bold hover:bg-[#ffb4ab]/25"
                >
                  DISPATCH EVENT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
