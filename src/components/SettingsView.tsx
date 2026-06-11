/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, AlarmRule } from '../types';
import { 
  Save, 
  PlusCircle, 
  Edit2, 
  Trash2, 
  ShieldAlert, 
  Info, 
  Check, 
  Circle, 
  Activity, 
  ArrowDown, 
  Database,
  Search,
  BookOpen
} from 'lucide-react';

interface SettingsViewProps {
  users: User[];
  onAddUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
  alarmRules: AlarmRule[];
  onAddRule: (rule: AlarmRule) => void;
  onRemoveRule: (id: string) => void;
}

export default function SettingsView({
  users,
  onAddUser,
  onDeleteUser,
  alarmRules,
  onAddRule,
  onRemoveRule,
}: SettingsViewProps) {
  // Tabs: 'users' | 'alarms' | 'logs'
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'alarms' | 'logs'>('users');
  
  // New User form
  const [newUserOpen, setNewUserOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<'ADMIN' | 'ENGINEER' | 'OPERATOR'>('OPERATOR');

  // New Rule Builder state
  const [triggerDimension, setTriggerDimension] = useState('EXTERIOR_DIAMETER_X1');
  const [condition, setCondition] = useState<'>' | '<'>('>');
  const [threshold, setThreshold] = useState(0.50);
  const [severity, setSeverity] = useState<'CRITICAL' | 'WARNING' | 'INFO'>('WARNING');
  const [actionLabel, setActionLabel] = useState('Maintenance Ticket');

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) return;

    onAddUser({
      id: `usr-${Date.now()}`,
      name: userName,
      email: userEmail,
      role: userRole,
      lastAccess: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'ACTIVE',
    });

    setUserName('');
    setUserEmail('');
    setNewUserOpen(false);
  };

  const handleAddRuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ruleIdNum = `${Math.floor(100 + Math.random() * 899)}-Z`;
    onAddRule({
      id: `rule-${Date.now()}`,
      ruleId: ruleIdNum,
      dimension: triggerDimension,
      condition,
      value: threshold,
      severity,
      action: actionLabel,
      active: true,
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header section with Global Save action */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#414755]/10 pb-4">
        <div>
          <h1 className="text-[#adc6ff] font-sans font-bold text-2xl tracking-tight leading-snug">
            System Settings &amp; Configuration
          </h1>
          <p className="text-[#c1c6d7] text-sm max-w-2xl mt-1">
            Configure global alert thresholds, manage user access hierarchies, and audit system performance logs for the SPC Dimension pipeline.
          </p>
        </div>
        <button 
          onClick={() => alert('All system calibrations, user hierarchies, and threshold parameters saved to live database.')}
          className="bg-[#adc6ff] hover:bg-[#4b8eff] text-[#002e69] font-mono text-[11px] font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 tracking-wider transform transition-all active:scale-95 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          SAVE ALL CHANGES
        </button>
      </header>

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-4 border-b border-[#414755]/20 pb-0.5">
        <button 
          onClick={() => setActiveSubTab('users')}
          className={`pb-3 text-xs font-mono font-bold tracking-wider transition-all border-b-2 uppercase px-3 ${
            activeSubTab === 'users'
              ? 'border-[#adc6ff] text-[#adc6ff]'
              : 'border-transparent text-[#c1c6d7] hover:text-[#d4e4fa]'
          }`}
        >
          用户权限 (USER &amp; PERMISSIONS)
        </button>
        <button 
          onClick={() => setActiveSubTab('alarms')}
          className={`pb-3 text-xs font-mono font-bold tracking-wider transition-all border-b-2 uppercase px-3 ${
            activeSubTab === 'alarms'
              ? 'border-[#adc6ff] text-[#adc6ff]'
              : 'border-transparent text-[#c1c6d7] hover:text-[#d4e4fa]'
          }`}
        >
          报警规则 (ALARM RULES)
        </button>
        <button 
          onClick={() => setActiveSubTab('logs')}
          className={`pb-3 text-xs font-mono font-bold tracking-wider transition-all border-b-2 uppercase px-3 ${
            activeSubTab === 'logs'
              ? 'border-[#adc6ff] text-[#adc6ff]'
              : 'border-transparent text-[#c1c6d7] hover:text-[#d4e4fa]'
          }`}
        >
          系统日志 (SYSTEM LOGS)
        </button>
      </div>

      {/* Tab Pane: User Registry */}
      {activeSubTab === 'users' && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* User operational register */}
            <div className="lg:col-span-8 bg-[#122131]/80 backdrop-blur-md rounded-2xl border border-[#414755]/15 overflow-hidden">
              <div className="p-4 border-b border-[#414755]/15 flex justify-between items-center">
                <h2 className="text-[10px] font-mono font-bold text-[#c1c6d7] tracking-wider uppercase">
                  OPERATIONAL STAFF REGISTRY
                </h2>
                {!newUserOpen && (
                  <button 
                    onClick={() => setNewUserOpen(true)}
                    className="text-[#adc6ff] hover:text-[#00c5fc] hover:underline text-[10px] font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> ADD NEW USER
                  </button>
                )}
              </div>

              {/* Toggleable New User Add Form */}
              {newUserOpen && (
                <form onSubmit={handleAddUserSubmit} className="p-5 bg-[#1c2b3c]/50 border-b border-[#414755]/20 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[9px] font-mono font-bold text-[#c1c6d7] uppercase block mb-1">Staff Name</label>
                      <input 
                        type="text" 
                        required
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="e.g. David King"
                        className="w-full bg-[#0d1c2d] border border-[#414755]/40 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#4b8eff]"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono font-bold text-[#c1c6d7] uppercase block mb-1">Corporate Email</label>
                      <input 
                        type="email" 
                        required
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="e.g. d.king@factory-spc.io"
                        className="w-full bg-[#0d1c2d] border border-[#414755]/40 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#4b8eff]"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono font-bold text-[#c1c6d7] uppercase block mb-1">Access Tier / Role</label>
                      <select 
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value as any)}
                        className="w-full bg-[#0d1c2d] border border-[#414755]/40 rounded px-2 py-1 text-xs text-[#d4e4fa]"
                      >
                        <option value="OPERATOR">OPERATOR</option>
                        <option value="ENGINEER">ENGINEER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button 
                      type="button" 
                      onClick={() => setNewUserOpen(false)}
                      className="px-3 py-1.5 border border-[#414755]/30 rounded text-[10px] font-mono text-[#c1c6d7] hover:bg-[#273647]/50"
                    >
                      CANCEL
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-1.5 bg-[#4b8eff]/20 text-[#adc6ff] border border-[#adc6ff]/35 rounded text-[10px] font-mono font-bold hover:bg-[#4b8eff]/30"
                    >
                      ADD REGISTRATION
                    </button>
                  </div>
                </form>
              )}

              {/* Users tables */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#1c2b3c]/60 text-[10px] font-mono text-[#c1c6d7] border-b border-[#414755]/20">
                      <th className="p-4 font-bold">USER IDENTITY</th>
                      <th className="p-4 font-bold">SYSTEM ROLE</th>
                      <th className="p-4 font-bold">LAST ACCESS</th>
                      <th className="p-4 font-bold">STATUS</th>
                      <th className="p-4 font-bold text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#414755]/15 text-sm">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-[#4b8eff]/5 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#273647] border border-[#414755]/30 flex items-center justify-center">
                              <span className="font-mono text-xs text-[#adc6ff] font-bold">
                                {u.name.substring(0, 2).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-bold text-white text-xs">{u.name}</div>
                              <div className="text-[10px] text-[#c1c6d7]/60 font-mono mt-0.5">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded ${
                            u.role === 'ADMIN'
                              ? 'bg-[#adc6ff]/20 text-[#adc6ff] border border-[#adc6ff]/30'
                              : u.role === 'ENGINEER'
                              ? 'bg-[#00eefc]/15 text-[#00eefc] border border-[#00eefc]/25'
                              : 'bg-[#c0c6d8]/15 text-[#c0c6d8]'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-mono text-[#c1c6d7]">{u.lastAccess}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${u.status === 'ACTIVE' ? 'bg-[#00eefc] shadow-[0_0_6px_#00eefc]' : 'bg-[#414755]'}`} />
                            <span className={`text-[10px] font-mono font-bold ${u.status === 'ACTIVE' ? 'text-[#00eefc]' : 'text-[#c1c6d7]/40'}`}>
                              {u.status}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <button className="p-1 hover:text-[#4b8eff] transition-all cursor-pointer">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            disabled={users.length <= 3}
                            onClick={() => onDeleteUser(u.id)}
                            className="p-1 hover:text-[#ffb4ab] transition-all ml-2 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                            title={users.length <= 3 ? "Keep at least 3 benchmark profiles" : "Revoke staff permissions"}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Role permission rules hierarchy summary card */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-[#122131]/80 backdrop-blur-md rounded-2xl p-5 border border-[#414755]/15">
                <h3 className="text-xs font-mono font-bold text-[#d4e4fa] mb-4 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#adc6ff]" />
                  PERMISSION HIERARCHY
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-[#1c2b3c] rounded-xl border-l-4 border-[#adc6ff]">
                    <div className="text-[10px] font-mono font-bold text-[#adc6ff] mb-1">SYSTEM ADMIN TIER</div>
                    <p className="text-[11px] text-[#c1c6d7] leading-relaxed">Full system override, live alert rules calibration, and personnel management.</p>
                  </div>
                  <div className="p-3 bg-[#1c2b3c] rounded-xl border-l-4 border-[#00eefc]">
                    <div className="text-[10px] font-mono font-bold text-[#00eefc] mb-1">QUALITY ENGINEER TIER</div>
                    <p className="text-[11px] text-[#c1c6d7] leading-relaxed">Configure alarm thresholds, deploy ruleset buffers, export historic analytics.</p>
                  </div>
                  <div className="p-3 bg-[#1c2b3c] rounded-xl border-l-4 border-[#8b90a0]">
                    <div className="text-[10px] font-mono font-bold text-[#c1c6d7] mb-1">OPERATOR TIER</div>
                    <p className="text-[11px] text-[#c1c6d7] leading-relaxed">Acknowledge stream logs, file command reports, monitor visual analytics maps.</p>
                  </div>
                </div>
              </div>

              {/* Security Backdrop */}
              <div className="relative rounded-2xl overflow-hidden h-[155px] border border-[#414755]/20 bg-[#0d1c2d]/70 flex items-center justify-center p-4">
                <div className="absolute inset-x-2 inset-y-2 border border-[#414755]/10 rounded-xl" />
                <div className="z-10 text-center">
                  <span className="text-[10px] font-mono font-bold text-[#adc6ff] tracking-wider uppercase">SECURITY ENFORCED</span>
                  <p className="text-[11px] text-[#c1c6d7]/60 mt-1 max-w-[200px] mx-auto font-mono">
                    All terminal command profiles logged &amp; verified via local hardware keys.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Tab Pane: Alarm Rules builder */}
      {activeSubTab === 'alarms' && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Rule builder form */}
            <div className="lg:col-span-8 bg-[#122131]/80 backdrop-blur-md rounded-2xl p-6 border border-[#414755]/15 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-[#adc6ff] font-sans font-bold text-lg">Threshold Rule Builder</h3>
                  <p className="text-[#c1c6d7] text-xs mt-1">Define the mathematical limits for triggering dimension telemetry alarms.</p>
                </div>
                <span className="bg-[#93000a]/30 text-[#ffb4ab] border border-[#ffb4ab]/20 px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-wider uppercase animate-pulse">
                  ALARM ENGINE ACTIVE
                </span>
              </div>

              <form onSubmit={handleAddRuleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="space-y-4">
                  {/* Select Trigger Target */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-[#c1c6d7] uppercase tracking-wider mb-1.5">
                      TRIGGER TARGET DIMENSION
                    </label>
                    <select 
                      value={triggerDimension}
                      onChange={(e) => setTriggerDimension(e.target.value)}
                      className="w-full bg-[#0d1c2d] border border-[#414755]/30 text-white rounded-lg p-2.5 text-xs font-mono"
                    >
                      <option value="EXTERIOR_DIAMETER_X1">EXTERIOR_DIAMETER_X1 (Gap Axis)</option>
                      <option value="INTERIOR_CLEARANCE_Y2">INTERIOR_CLEARANCE_Y2 (O-Diameter)</option>
                      <option value="AXIAL_ALIGNMENT_Z">AXIAL_ALIGNMENT_Z (Stepped Profile)</option>
                    </select>
                  </div>

                  {/* Conditions check */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-[#c1c6d7] uppercase tracking-wider mb-1.5">
                      TRIG CONDITION
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setCondition('>')}
                        className={`flex-1 p-2.5 rounded-lg text-xs font-bold font-mono border ${
                          condition === '>'
                            ? 'bg-[#4b8eff]/10 border-[#adc6ff] text-[#adc6ff]'
                            : 'bg-[#0d1c2d] border-[#414755]/20 text-[#c1c6d7]/50'
                        }`}
                      >
                        MEASUREMENT VALUE &gt;
                      </button>
                      <button
                        type="button"
                        onClick={() => setCondition('<')}
                        className={`flex-1 p-2.5 rounded-lg text-xs font-bold font-mono border ${
                          condition === '<'
                            ? 'bg-[#4b8eff]/10 border-[#adc6ff] text-[#adc6ff]'
                            : 'bg-[#0d1c2d] border-[#414755]/20 text-[#c1c6d7]/50'
                        }`}
                      >
                        MEASUREMENT VALUE &lt;
                      </button>
                    </div>
                  </div>

                  {/* Offset threshold limit */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-[#c1c6d7] uppercase tracking-wider mb-1.5">
                      LIMIT OFFSET (THETA) (MM)
                    </label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="number" 
                        step="0.01"
                        value={threshold}
                        onChange={(e) => setThreshold(parseFloat(e.target.value) || 0)}
                        placeholder="0.05"
                        className="flex-1 bg-[#0d1c2d] border border-[#414755]/30 text-white text-lg font-mono font-bold p-2 rounded-lg"
                      />
                      <span className="text-[#adc6ff] font-mono font-bold">mm</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Select Severity */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-[#c1c6d7] uppercase tracking-wider mb-1.5">
                      ALARM DISPATCH SEVERITY
                    </label>
                    <div className="space-y-2">
                      {[
                        { level: 'CRITICAL', label: 'CRITICAL (SHUTDOWN / STOP_LINE)' },
                        { level: 'WARNING', label: 'WARNING (FIELD WORK MAINTENANCE)' },
                        { level: 'INFO', label: 'INFO (AUDIT LOG ENTRY ONLY)' }
                      ].map((sevObj) => (
                        <div 
                          key={sevObj.level}
                          onClick={() => {
                            setSeverity(sevObj.level as any);
                            setActionLabel(
                              sevObj.level === 'CRITICAL' 
                                ? 'Push Alert + STOP_LINE' 
                                : sevObj.level === 'WARNING'
                                ? 'Maintenance Ticket' 
                                : 'Audit Profile Entry'
                            );
                          }}
                          className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                            severity === sevObj.level
                              ? 'bg-[#1c2b3c] border-[#adc6ff]/50 text-white'
                              : 'bg-[#0d1c2d] border-[#414755]/15 text-[#c1c6d7]/60 hover:bg-[#273647]/20'
                          }`}
                        >
                          <span className="text-[10px] font-mono font-bold leading-none">{sevObj.label}</span>
                          {severity === sevObj.level ? (
                            <Check className="w-3.5 h-3.5 text-[#00eefc]" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 opacity-30 text-[#c1c6d7]" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-[#c1c6d7] uppercase tracking-wider mb-1.5">
                      AUTOMATED DOWNSTREAM ACTION
                    </label>
                    <input 
                      type="text"
                      className="w-full bg-[#0d1c2d] border border-[#414755]/30 text-xs font-sans p-2.5 rounded-lg text-white"
                      value={actionLabel}
                      onChange={(e) => setActionLabel(e.target.value)}
                    />
                  </div>
                </div>

                {/* Submits rules */}
                <div className="sm:col-span-2 pt-4 border-t border-[#414755]/15 flex gap-4">
                  <button 
                    type="submit"
                    className="bg-[#4b8eff]/15 hover:bg-[#4b8eff]/25 border border-[#adc6ff]/50 text-[#adc6ff] font-mono text-[10px] font-bold px-5 py-2.5 rounded-lg transition-all active:scale-95 cursor-pointer"
                  >
                    APPEND CALIBRATION RULE
                  </button>
                  <button 
                    type="reset"
                    onClick={() => {
                      setTriggerDimension('EXTERIOR_DIAMETER_X1');
                      setCondition('>');
                      setThreshold(0.50);
                      setSeverity('WARNING');
                      setActionLabel('Maintenance Ticket');
                    }}
                    className="text-[#c1c6d7] hover:text-white font-mono text-[10px] font-bold px-4 py-2 hover:bg-[#273647]/30 rounded-lg"
                  >
                    RESET BUILDER
                  </button>
                </div>
              </form>
            </div>

            {/* List active active rules */}
            <div className="lg:col-span-4 flex flex-col h-full bg-[#122131]/80 backdrop-blur-md rounded-2xl border border-[#414755]/15 overflow-hidden">
              <div className="p-4 bg-[#1c2b3c]/50 border-b border-[#414755]/15">
                <h3 className="text-[10px] font-mono font-bold text-[#d4e4fa] tracking-widest uppercase">
                  ACTIVE CRITERIA RULESET
                </h3>
              </div>
              <div className="p-4 flex-1 overflow-y-auto space-y-3 max-h-[360px] custom-scrollbar">
                {alarmRules.map((rule) => {
                  const isCritical = rule.severity === 'CRITICAL' || rule.severity === 'SHUTDOWN';
                  return (
                    <div 
                      key={rule.id}
                      className="p-3 bg-[#1c2b3c] rounded-xl border border-[#414755]/20 flex justify-between items-start relative group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-mono text-[#c1c6d7] font-bold">RULE_ID: {rule.ruleId}</span>
                          <span className={`w-1.5 h-1.5 rounded-full ${isCritical ? 'bg-[#ffb4ab]' : 'bg-[#adc6ff]'}`} />
                        </div>
                        <div className="text-xs font-mono font-bold text-white">
                          IF Val {rule.condition} {rule.value.toFixed(2)}mm on {rule.dimension.split('_').slice(-1)[0]}
                        </div>
                        <div className="text-[10px] text-[#c1c6d7]/70 font-sans">
                          Action: {rule.action}
                        </div>
                      </div>
                      <button 
                        onClick={() => onRemoveRule(rule.id)}
                        className="text-[#c1c6d7]/30 hover:text-[#ffb4ab] opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                        title="Delete trigger"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
                <div className="p-4 bg-[#0d1c2d]/50 border border-dashed border-[#414755]/20 rounded-xl flex items-center justify-center text-[10px] font-mono text-[#c1c6d7]/50 select-none uppercase">
                  DRAG &amp; REORDER ALARM QUEUE
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Tab Pane: Telemetry Logs */}
      {activeSubTab === 'logs' && (
        <section className="space-y-6">
          <div className="bg-[#122131]/80 backdrop-blur-md rounded-2xl border border-[#414755]/15 overflow-hidden">
            <div className="p-4 bg-[#1c2b3c]/50 border-b border-[#414755]/15 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <h3 className="text-xs font-mono font-bold text-[#d4e4fa] tracking-wider uppercase">
                  SYSTEM TELEMETRY LOGS
                </h3>
                <span className="inline-flex items-center gap-1 bg-[#122131] px-2 py-0.5 rounded text-[9px] font-mono font-bold text-[#00eefc]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00eefc] animate-pulse" />
                  STREAMING LIVE
                </span>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => alert('Download requested.')}
                  className="bg-[#1c2b3c] border border-[#414755]/30 text-[#d4e4fa] px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-bold hover:bg-[#273647] cursor-pointer"
                >
                  DOWNLOAD CSV
                </button>
                <button className="bg-[#1c2b3c] border border-[#414755]/30 text-[#d4e4fa] px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-bold hover:bg-[#273647] cursor-pointer">
                  FILTER BY TIME
                </button>
              </div>
            </div>

            {/* Simulated Live Logs terminal */}
            <div className="overflow-x-auto bg-[#051424] p-2 leading-none max-h-[350px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left font-mono text-[11px] leading-relaxed">
                <thead>
                  <tr className="text-[#c1c6d7]/50 border-b border-[#414755]/20">
                    <th className="p-2 gap-1 uppercase">TIMESTAMP [UTC]</th>
                    <th className="p-2 uppercase">SUBSYSTEM</th>
                    <th className="p-2 uppercase">EVENT</th>
                    <th className="p-2 uppercase">STATUS</th>
                    <th className="p-2 uppercase">PAYLOAD INFO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#414755]/10 text-slate-300">
                  <tr className="hover:bg-[#122131]/60">
                    <td className="p-2 text-[#c1c6d7]/70">2026-06-11T13:30:12.920Z</td>
                    <td className="p-2 text-[#adc6ff] font-bold">CORE_ENGINE</td>
                    <td className="p-2">Calibration_Sync_Complete</td>
                    <td className="p-2 text-[#00eefc]">200 OK</td>
                    <td className="p-2 text-[#c1c6d7]/60">{"{ node: N-04, delta: 0.002, lot: 2361 }"}</td>
                  </tr>
                  <tr className="hover:bg-[#122131]/60">
                    <td className="p-2 text-[#c1c6d7]/70">2026-06-11T13:28:44.103Z</td>
                    <td className="p-2 text-[#adc6ff] font-bold">RULE_DISPATCH</td>
                    <td className="p-2 text-[#ffb4ab]">Threshold_Violation_Detected</td>
                    <td className="p-2 text-[#ffb4ab]">ALARM_HI</td>
                    <td className="p-2 text-[#c1c6d7]/60">{"{ rule: 992-X, dimension: FLUSH_C12, value: 0.58 }"}</td>
                  </tr>
                  <tr className="hover:bg-[#122131]/60">
                    <td className="p-2 text-[#c1c6d7]/70">2026-06-11T13:25:31.002Z</td>
                    <td className="p-2 text-[#adc6ff] font-bold">AUTH_SERVICE</td>
                    <td className="p-2">User_Login_Success</td>
                    <td className="p-2 text-[#00eefc]">200 OK</td>
                    <td className="p-2 text-[#c1c6d7]/60">{"{ uid: z_wei, client_ip: 10.0.12.33, session: active }"}</td>
                  </tr>
                  <tr className="hover:bg-[#122131]/60">
                    <td className="p-2 text-[#c1c6d7]/70">2026-06-11T13:20:00.000Z</td>
                    <td className="p-2 text-[#adc6ff] font-bold">DATABASE</td>
                    <td className="p-2 text-[#adc6ff]/80">Auto_Pruning_Complete</td>
                    <td className="p-2 text-[#00eefc]">200 OK</td>
                    <td className="p-2 text-[#c1c6d7]/60">{"{ tables_purged: [ raw_metrics, events_audit ] }"}</td>
                  </tr>
                  <tr className="hover:bg-[#122131]/60">
                    <td className="p-2 text-[#c1c6d7]/70">2026-06-11T13:15:30.402Z</td>
                    <td className="p-2 text-[#adc6ff] font-bold">CORE_ENGINE</td>
                    <td className="p-2">Sample_Point_Stored</td>
                    <td className="p-2 text-[#00eefc]">200 OK</td>
                    <td className="p-2 text-[#c1c6d7]/60">{"{ serial: CH-A12-22002, dev_gap: 0.042 }"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick logs stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#122131]/80 backdrop-blur-md p-4 rounded-xl text-center border border-[#414755]/10">
              <div className="text-xl font-mono font-bold text-[#adc6ff]">12.4 GB</div>
              <div className="text-[9px] font-mono text-[#c1c6d7]/70 font-bold uppercase mt-1">Storage Used</div>
            </div>
            <div className="bg-[#122131]/80 backdrop-blur-md p-4 rounded-xl text-center border border-[#414755]/10">
              <div className="text-xl font-mono font-bold text-[#00eefc]">0.02 ms</div>
              <div className="text-[9px] font-mono text-[#c1c6d7]/70 font-bold uppercase mt-1">Avg Latency</div>
            </div>
            <div className="bg-[#122131]/80 backdrop-blur-md p-4 rounded-xl text-center border border-[#414755]/10">
              <div className="text-xl font-mono font-bold text-[#adc6ff]">99.98%</div>
              <div className="text-[9px] font-mono text-[#c1c6d7]/70 font-bold uppercase mt-1">Pipeline Uptime</div>
            </div>
            <div className="bg-[#122131]/80 backdrop-blur-md p-4 rounded-xl text-center border border-[#414755]/10">
              <div className="text-xl font-mono font-bold text-[#ffb4ab]">0</div>
              <div className="text-[9px] font-mono text-[#c1c6d7]/70 font-bold uppercase mt-1">Fatal Errors (24H)</div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
