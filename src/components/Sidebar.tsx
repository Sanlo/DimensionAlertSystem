/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  AlertTriangle, 
  Settings, 
  Radio, 
  Activity, 
  Database,
  Cpu
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  systemHealth: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE';
  isSimulating: boolean;
  onToggleSimulation: () => void;
  nodeStatus: 'CONNECTED' | 'DISCONNECTED';
}

export default function Sidebar({
  activeTab,
  onTabChange,
  systemHealth,
  isSimulating,
  onToggleSimulation,
  nodeStatus,
}: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 z-40 bg-[#122131] border-r border-[#414755]/20 flex flex-col pt-20 pb-4 hidden md:flex">
      {/* Brand Section */}
      <div className="px-6 mb-8">
        <div className="text-xs font-mono text-[#c1c6d7] uppercase tracking-widest">SPC DIMENSION</div>
        <div className="text-[10px] font-mono text-[#adc6ff]/80 flex items-center gap-1.5 mt-0.5">
          <Cpu className="w-3 h-3 text-[#adc6ff]" />
          <span>V2.4.0-PRO</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        <button
          onClick={() => onTabChange('dashboard')}
          className={`w-full flex items-center gap-3 px-6 py-3.5 transition-all text-left font-sans ${
            activeTab === 'dashboard'
              ? 'bg-[#4b8eff]/10 text-[#adc6ff] border-r-4 border-[#adc6ff]'
              : 'text-[#c1c6d7] hover:bg-[#273647]/50 hover:text-[#d4e4fa]'
          }`}
        >
          <LayoutDashboard className="w-4.5 h-4.5" />
          <span className="text-[11px] font-mono font-bold tracking-wider uppercase">DASHBOARD / 仪表板</span>
        </button>

        <button
          onClick={() => onTabChange('trends')}
          className={`w-full flex items-center gap-3 px-6 py-3.5 transition-all text-left font-sans ${
            activeTab === 'trends'
              ? 'bg-[#4b8eff]/10 text-[#adc6ff] border-r-4 border-[#adc6ff]'
              : 'text-[#c1c6d7] hover:bg-[#273647]/50 hover:text-[#d4e4fa]'
          }`}
        >
          <TrendingUp className="w-4.5 h-4.5" />
          <span className="text-[11px] font-mono font-bold tracking-wider uppercase">SPC TRENDS / 趋势</span>
        </button>

        <button
          onClick={() => onTabChange('incidents')}
          className={`w-full flex items-center gap-3 px-6 py-3.5 transition-all text-left font-sans ${
            activeTab === 'incidents'
              ? 'bg-[#4b8eff]/10 text-[#adc6ff] border-r-4 border-[#adc6ff]'
              : 'text-[#c1c6d7] hover:bg-[#273647]/50 hover:text-[#d4e4fa]'
          }`}
        >
          <AlertTriangle className="w-4.5 h-4.5" />
          <span className="text-[11px] font-mono font-bold tracking-wider uppercase">INCIDENT MGMT / 事件</span>
        </button>

        <button
          onClick={() => onTabChange('settings')}
          className={`w-full flex items-center gap-3 px-6 py-3.5 transition-all text-left font-sans ${
            activeTab === 'settings'
              ? 'bg-[#4b8eff]/10 text-[#adc6ff] border-r-4 border-[#adc6ff]'
              : 'text-[#c1c6d7] hover:bg-[#273647]/50 hover:text-[#d4e4fa]'
          }`}
        >
          <Settings className="w-4.5 h-4.5" />
          <span className="text-[11px] font-mono font-bold tracking-wider uppercase">SETTINGS / 设置</span>
        </button>
      </nav>

      {/* Simulator Control widget */}
      <div className="px-4 mb-4">
        <div className="p-4 bg-[#0d1c2d]/90 rounded-xl border border-[#4b8eff]/20 relative overflow-hidden">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] font-mono text-[#adc6ff] font-bold uppercase tracking-wider">Telemetry Engine</span>
            <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-[#00eefc] shadow-[0_0_8px_#00eefc]' : 'bg-[#8b90a0]'}`} />
          </div>
          <button
            onClick={onToggleSimulation}
            className={`w-full text-center py-1.5 px-3 rounded text-[10px] font-mono font-bold transition-all ${
              isSimulating 
                ? 'bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/30 hover:bg-[#ffb4ab]/20' 
                : 'bg-[#4b8eff]/20 text-[#adc6ff] border border-[#4b8eff]/30 hover:bg-[#4b8eff]/35'
            }`}
          >
            {isSimulating ? 'PAUSE LIVE FEED' : 'EMULATE DATA STREAM'}
          </button>
        </div>
      </div>

      {/* Footer System Health Status */}
      <div className="px-4 mt-auto">
        <div className="p-3 bg-[#0d1c2d]/80 backdrop-blur-md rounded-xl border border-[#414755]/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#4b8eff]/10 flex items-center justify-center">
            <Activity className="w-4 h-4 text-[#adc6ff]" />
          </div>
          <div>
            <div className="text-[9px] font-mono text-[#c1c6d7] uppercase font-bold">NODE STATUS</div>
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${nodeStatus === 'CONNECTED' ? 'bg-[#00eefc] shadow-[0_0_6px_#00eefc]' : 'bg-[#ffb4ab] shadow-[0_0_6px_#ffb4ab]'}`} />
              <span className={`text-[10px] font-mono font-bold ${nodeStatus === 'CONNECTED' ? 'text-[#00eefc]' : 'text-[#ffb4ab]'}`}>
                {nodeStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
