/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AlarmLog } from '../types';
import { 
  BellRing, 
  HelpCircle, 
  Clock, 
  TrendingUp, 
  AlertOctagon, 
  Download, 
  History, 
  Cpu, 
  Layers, 
  Workflow, 
  Eye, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  Filter
} from 'lucide-react';

interface DashboardViewProps {
  logs: AlarmLog[];
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
  searchQuery: string;
}

export default function DashboardView({
  logs,
  onAcknowledge,
  onResolve,
  searchQuery,
}: DashboardViewProps) {
  const [selectedShift, setSelectedShift] = useState('CURRENT SHIFT');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Filter logs based on search standard and category
  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchQuery 
      ? log.dimensionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.carModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.workshop.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    const matchesCategory = categoryFilter === 'ALL' 
      ? true 
      : log.severity === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const criticalCount = logs.filter(l => l.severity === 'CRITICAL' && l.status !== 'RESOLVED').length;
  const warningCount = logs.filter(l => l.severity === 'WARNING' && l.status !== 'RESOLVED').length;
  const activeCount = logs.filter(l => l.status !== 'RESOLVED').length;

  return (
    <div className="space-y-6">
      {/* Welcome & Fast Stats Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-[#d4e4fa] font-sans font-bold text-2xl tracking-tight">Real-time Dimension Analytics</h1>
          <p className="text-[#c1c6d7] text-sm mt-1">
            Monitoring status for 12,402 points across 3 active shifts.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute("download", "spc_alarm_report.json");
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="bg-[#4b8eff] hover:bg-[#4b8eff]/90 text-[#002e69] font-mono text-[11px] font-bold tracking-wider px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-[#4b8eff]/10 cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5" /> EXPORT REPORT
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="border border-[#414755]/30 hover:bg-[#273647]/50 text-[#d4e4fa] font-mono text-[11px] font-bold tracking-wider px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <History className="w-3.5 h-3.5" /> REFRESH
          </button>
        </div>
      </div>

      {/* Bento Grid layout for fast production metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Alarms */}
        <div className="bg-[#122131]/80 backdrop-blur-md p-5 rounded-2xl border border-[#414755]/10 hover:border-[#adc6ff]/35 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <BellRing className="w-24 h-24 text-[#adc6ff]" />
          </div>
          <div className="text-[10px] font-mono font-bold text-[#c1c6d7] uppercase tracking-wider mb-2">
            Total Alarms / 总报警数
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-mono font-bold text-[#adc6ff]">{logs.length + 123}</span>
            <span className="text-[11px] font-mono font-bold text-[#ffb4ab] mb-1 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3 text-[#ffb4ab]" /> 12%
            </span>
          </div>
          <div className="text-xs font-mono text-[#c1c6d7]/60 mt-1">
            Shift: {activeCount + 38} | Day: {logs.length + 123} | Week: 940
          </div>
        </div>

        {/* Active Incidents */}
        <div className="bg-[#122131]/80 backdrop-blur-md p-5 rounded-2xl border border-[#414755]/10 hover:border-[#adc6ff]/35 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <AlertOctagon className="w-24 h-24 text-[#ffb4ab]" />
          </div>
          <div className="text-[10px] font-mono font-bold text-[#c1c6d7] uppercase tracking-wider mb-2">
            Active Incidents / 活跃事件
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-mono font-bold text-[#ffb4ab]">{activeCount + 9}</span>
            <span className="px-1.5 py-0.5 bg-[#93000a] text-[#ffdad6] border border-[#ffb4ab]/20 rounded text-[9px] font-mono font-bold mb-1.5 animate-pulse">
              URGENT
            </span>
          </div>
          <div className="text-xs font-mono text-[#c1c6d7]/60 mt-1">
            {criticalCount + 6} critical, {warningCount + 3} warnings requiring attention
          </div>
        </div>

        {/* MTTR */}
        <div className="bg-[#122131]/80 backdrop-blur-md p-5 rounded-2xl border border-[#414755]/10 hover:border-[#adc6ff]/35 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Clock className="w-24 h-24 text-[#00eefc]" />
          </div>
          <div className="text-[10px] font-mono font-bold text-[#c1c6d7] uppercase tracking-wider mb-2">
            MTTR / 平均修复时间
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-mono font-bold text-[#00eefc]">18.4</span>
            <span className="text-[11px] font-mono text-[#c1c6d7] mb-1">MIN</span>
          </div>
          <div className="text-xs font-mono text-[#c1c6d7]/60 mt-1">
            Efficiency target: &lt;20.0 MIN
          </div>
        </div>

        {/* Yield Stability */}
        <div className="bg-[#122131]/80 backdrop-blur-md p-5 rounded-2xl border border-[#414755]/10 hover:border-[#adc6ff]/35 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Workflow className="w-24 h-24 text-[#adc6ff]" />
          </div>
          <div className="text-[10px] font-mono font-bold text-[#c1c6d7] uppercase tracking-wider mb-2">
            Yield Stability / 良率
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-mono font-bold text-[#d4e4fa]">99.82</span>
            <span className="text-[11px] font-mono text-[#c1c6d7] mb-1">%</span>
          </div>
          <div className="text-xs font-mono text-[#c1c6d7]/60 mt-1">
            Target: 99.95% | Variance: -0.13%
          </div>
        </div>
      </div>

      {/* Primary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie/Donut Chart: Alarm Distribution */}
        <div className="bg-[#122131]/80 backdrop-blur-md p-6 rounded-2xl border border-[#414755]/15 flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-mono font-bold text-[#d4e4fa] tracking-wider uppercase">
              ALARM DISTRIBUTION / 报警分布
            </h3>
            <select 
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="bg-[#1c2b3c] border-none text-[10px] text-[#d4e4fa] rounded-lg font-mono py-1 pl-2 pr-7 focus:ring-1 focus:ring-[#4b8eff]"
            >
              <option>CURRENT SHIFT</option>
              <option>LAST 24 HOURS</option>
              <option>MONTH TO DATE</option>
            </select>
          </div>

          {/* Interactive Responsive SVG Donut Chart */}
          <div className="flex-1 flex items-center justify-center relative">
            <div className="w-44 h-44 rounded-full border-8 border-[#4b8eff]/10 flex items-center justify-center relative">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Simulated segments using dashboard color theme */}
                {/* Segment 1: Critical (32%) - Red color */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ffb4ab" strokeWidth="8" strokeDasharray="80.4 170.8" strokeDashoffset="0" />
                {/* Segment 2: Warning (45%) - Cyan color */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#00eefc" strokeWidth="8" strokeDasharray="113.1 138.1" strokeDashoffset="-80.4" />
                {/* Segment 3: Info (23%) - Blue color */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#4b8eff" strokeWidth="8" strokeDasharray="57.8 193.4" strokeDashoffset="-193.5" />
              </svg>
              <div className="text-center z-10">
                <div className="text-2xl font-mono font-bold text-[#d4e4fa]">{logs.length}</div>
                <div className="text-[9px] text-[#c1c6d7] font-mono tracking-widest font-bold">TOTAL</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#ffb4ab]" />
              <span className="text-[11px] font-sans text-[#c1c6d7]">Critical (32%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00eefc]" />
              <span className="text-[11px] font-sans text-[#c1c6d7]">Warning (45%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#4b8eff]" />
              <span className="text-[11px] font-sans text-[#c1c6d7]">Info (23%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#8b90a0]" />
              <span className="text-[11px] font-sans text-[#c1c6d7]">Other (5%)</span>
            </div>
          </div>
        </div>

        {/* Bar Chart: Frequency by Plant/Model */}
        <div className="bg-[#122131]/80 backdrop-blur-md p-6 rounded-2xl border border-[#414755]/15 lg:col-span-2 h-[410px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-mono font-bold text-[#d4e4fa] tracking-wider uppercase">
              FREQUENCY BY DIMENSION / 报警频率统计
            </h3>
            <div className="flex gap-1.5">
              <button className="px-2 py-1 bg-[#4b8eff]/20 border border-[#4b8eff]/45 text-[#adc6ff] text-[9px] font-mono font-bold rounded">PLANT</button>
              <button className="px-2 py-1 bg-[#273647]/50 text-[#c1c6d7] text-[9px] font-mono font-bold rounded">CAR MODEL</button>
              <button className="px-2 py-1 bg-[#273647]/50 text-[#c1c6d7] text-[9px] font-mono font-bold rounded">WORKSHOP</button>
            </div>
          </div>

          {/* Graphical Bar Grid */}
          <div className="flex-1 flex items-end gap-4 border-b border-[#414755]/20 pb-1 relative">
            {/* Background alignment lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
              <div className="w-full border-t border-[#d4e4fa]" />
              <div className="w-full border-t border-[#d4e4fa]" />
              <div className="w-full border-t border-[#d4e4fa]" />
              <div className="w-full border-t border-[#d4e4fa]" />
            </div>

            {/* Bars */}
            <div className="flex-1 flex flex-col items-center group relative z-10 h-full justify-end">
              <div className="w-full bg-[#4b8eff]/40 group-hover:bg-[#4b8eff] transition-all rounded-t-xs" style={{ height: '60%' }} />
              <span className="mt-2 text-[10px] font-mono text-[#c1c6d7]">NORTH</span>
            </div>
            <div className="flex-1 flex flex-col items-center group relative z-10 h-full justify-end">
              <div className="w-full bg-[#4b8eff]/40 group-hover:bg-[#4b8eff] transition-all rounded-t-xs" style={{ height: '85%' }} />
              <span className="mt-2 text-[10px] font-mono text-[#c1c6d7]">EAST</span>
            </div>
            <div className="flex-1 flex flex-col items-center group relative z-10 h-full justify-end">
              <div className="w-full bg-[#4b8eff]/40 group-hover:bg-[#4b8eff] transition-all rounded-t-xs" style={{ height: '40%' }} />
              <span className="mt-2 text-[10px] font-mono text-[#c1c6d7]">SOUTH</span>
            </div>
            <div className="flex-1 flex flex-col items-center group relative z-10 h-full justify-end">
              <div className="w-full bg-[#ffb4ab]/40 group-hover:bg-[#ffb4ab] transition-all rounded-t-xs border-t border-[#ffb4ab]" style={{ height: '95%' }} />
              <span className="mt-2 text-[10px] font-mono text-[#c1c6d7]">WEST (A)</span>
            </div>
            <div className="flex-1 flex flex-col items-center group relative z-10 h-full justify-end">
              <div className="w-full bg-[#4b8eff]/40 group-hover:bg-[#4b8eff] transition-all rounded-t-xs" style={{ height: '55%' }} />
              <span className="mt-2 text-[10px] font-mono text-[#c1c6d7]">MAIN</span>
            </div>
            <div className="flex-1 flex flex-col items-center group relative z-10 h-full justify-end">
              <div className="w-full bg-[#4b8eff]/40 group-hover:bg-[#4b8eff] transition-all rounded-t-xs" style={{ height: '70%' }} />
              <span className="mt-2 text-[10px] font-mono text-[#c1c6d7]">LOGS</span>
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#4b8eff]/40 rounded-xs" />
              <span className="text-[10px] font-mono text-[#c1c6d7]">NORMAL FREQ</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#ffb4ab]/40 rounded-xs border border-[#ffb4ab]/30" />
              <span className="text-[10px] font-mono text-[#c1c6d7]">HIGH FREQ (&gt;80)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Analytics / 高级分析 Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#adc6ff]" />
          <h2 className="text-lg font-sans font-bold text-[#d4e4fa]">Advanced Analytics / 高级分析</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Donut Chart: Alarm Source Distribution */}
          <div className="bg-[#122131]/80 backdrop-blur-md p-5 rounded-xl border border-[#414755]/15 flex flex-col h-[320px]">
            <h3 className="text-xs font-mono font-bold text-[#d4e4fa] tracking-wider uppercase mb-4">
              ALARM SOURCE / 报警来源分布
            </h3>
            <div className="flex-1 flex items-center justify-center relative">
              <div className="w-28 h-28 rounded-full border border-[#414755]/20 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="35" fill="transparent" stroke="#adc6ff" strokeWidth="8" strokeDasharray="184.7 219.9" />
                  <circle cx="50" cy="50" r="35" fill="transparent" stroke="#00eefc" strokeWidth="8" strokeDasharray="35.1 219.9" strokeDashoffset="-184.7" />
                </svg>
                <div className="text-center">
                  <div className="text-lg font-mono font-bold text-[#d4e4fa]">84%</div>
                  <div className="text-[8px] text-[#c1c6d7] font-mono tracking-widest font-bold">AUTO</div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#adc6ff]" />
                <span className="text-[10px] font-mono text-[#c1c6d7]">Sensor (84%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00eefc]" />
                <span className="text-[10px] font-mono text-[#c1c6d7]">Manual (16%)</span>
              </div>
            </div>
          </div>

          {/* Multi-series Bar Chart: Production vs Alarms */}
          <div className="bg-[#122131]/80 backdrop-blur-md p-5 rounded-xl border border-[#414755]/15 flex flex-col h-[320px]">
            <h3 className="text-xs font-mono font-bold text-[#d4e4fa] tracking-wider uppercase mb-4">
              PROD VS ALARMS / 产量与报警
            </h3>
            <div className="flex-1 flex items-end gap-3 pb-2 border-b border-[#414755]/10 relative">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
                <hr className="border-[#d4e4fa]" /><hr className="border-[#d4e4fa]" /><hr className="border-[#d4e4fa]" />
              </div>
              
              <div className="flex-1 flex flex-col justify-end gap-1 h-full">
                <div className="w-full bg-[#4b8eff]/60 h-[80%] rounded-t-xs" />
                <div className="w-full bg-[#ffb4ab]/40 h-[15%] rounded-b-xs border-r border-l border-[#ffb4ab]/30" />
              </div>
              <div className="flex-1 flex flex-col justify-end gap-1 h-full">
                <div className="w-full bg-[#4b8eff]/60 h-[70%] rounded-t-xs" />
                <div className="w-full bg-[#ffb4ab]/40 h-[10%] rounded-b-xs border-r border-l border-[#ffb4ab]/30" />
              </div>
              <div className="flex-1 flex flex-col justify-end gap-1 h-full">
                <div className="w-full bg-[#4b8eff]/60 h-[90%] rounded-t-xs" />
                <div className="w-full bg-[#ffb4ab]/40 h-[20%] rounded-b-xs border-r border-l border-[#ffb4ab]/30" />
              </div>
            </div>
            <div className="mt-4 flex gap-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-[#4b8eff]/60 rounded-xs" />
                <span className="text-[10px] font-mono text-[#c1c6d7]">Prod</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-[#ffb4ab]/40 rounded-xs border border-[#ffb4ab]/30" />
                <span className="text-[10px] font-mono text-[#c1c6d7]">Alarm</span>
              </div>
            </div>
          </div>

          {/* Radar Chart: Process Capability */}
          <div className="bg-[#122131]/80 backdrop-blur-md p-5 rounded-xl border border-[#414755]/15 flex flex-col h-[320px]">
            <h3 className="text-xs font-mono font-bold text-[#d4e4fa] tracking-wider uppercase mb-4">
              PROCESS CAP. / 过程能力分析
            </h3>
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 border border-[#414755]/30 rotate-45" />
                <div className="absolute inset-x-2 inset-y-2 border border-[#414755]/20 rounded-full" />
                <div className="absolute inset-5 bg-[#adc6ff]/10 rounded-full border border-[#adc6ff]/35 animate-pulse" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[8px] font-mono font-bold text-[#adc6ff]">PRECISION</div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px] font-mono font-bold text-[#adc6ff]">STABILITY</div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[8px] font-mono font-bold text-[#adc6ff]/50">LCL</div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[8px] font-mono font-bold text-[#adc6ff]/50">UCL</div>
              </div>
            </div>
          </div>

          {/* Line Chart: Yield Stability Trend */}
          <div className="bg-[#122131]/80 backdrop-blur-md p-5 rounded-xl border border-[#414755]/15 flex flex-col h-[320px]">
            <h3 className="text-xs font-mono font-bold text-[#d4e4fa] tracking-wider uppercase mb-4">
              YIELD TREND / 良率趋势
            </h3>
            <div className="flex-1 relative border-b border-l border-[#414755]/15 p-2">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#00eefc', stopOpacity: 0.3 }} />
                    <stop offset="100%" style={{ stopColor: '#00eefc', stopOpacity: 0 }} />
                  </linearGradient>
                </defs>
                <path d="M0,80 L20,75 L40,85 L60,70 L80,72 L100,65" fill="none" stroke="#00eefc" strokeWidth="2.5" />
                <path d="M0,80 L20,75 L40,85 L60,70 L80,72 L100,65 V100 H0 Z" fill="url(#grad1)" />
              </svg>
              <span className="absolute bottom-1 right-2 text-[8px] font-mono text-[#c1c6d7]">SHIFT 3</span>
            </div>
            <div className="mt-4 text-center">
              <span className="text-xs font-mono font-bold text-[#00eefc] bg-[#00eefc]/10 px-2 py-1 rounded-md border border-[#00eefc]/20">
                +0.45% vs Last Week
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Feed: Historical Alarm Log */}
      <div className="bg-[#122131]/80 backdrop-blur-md rounded-2xl border border-[#414755]/15 flex flex-col">
        {/* Header / Table meta info */}
        <div className="px-6 py-4 border-b border-[#414755]/15 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2.5">
            <BellRing className="w-4 h-4 text-[#00eefc]" />
            <h3 className="text-xs font-mono font-bold text-[#d4e4fa] tracking-wider uppercase">
              LIVE ALARM LOG / 实时报警日志
            </h3>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex gap-1">
              <button 
                onClick={() => setCategoryFilter('ALL')}
                className={`px-2 py-0.5 text-[9px] font-mono rounded ${categoryFilter === 'ALL' ? 'bg-[#adc6ff] text-[#002e69]' : 'bg-[#1c2b3c] text-[#c1c6d7]'}`}
              >
                ALL
              </button>
              <button 
                onClick={() => setCategoryFilter('CRITICAL')}
                className={`px-2 py-0.5 text-[9px] font-mono rounded ${categoryFilter === 'CRITICAL' ? 'bg-[#ffb4ab] text-[#690005]' : 'bg-[#1c2b3c] text-[#c1c6d7]'}`}
              >
                CRITICAL
              </button>
              <button 
                onClick={() => setCategoryFilter('WARNING')}
                className={`px-2 py-0.5 text-[9px] font-mono rounded ${categoryFilter === 'WARNING' ? 'bg-[#00eefc]/20 text-[#00eefc]' : 'bg-[#1c2b3c] text-[#c1c6d7]'}`}
              >
                WARNING
              </button>
            </div>
            <span className="text-[10px] font-mono text-[#00eefc] flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#00eefc] animate-ping" />
              STREAMING ACTIVE
            </span>
          </div>
        </div>

        {/* Dynamic Table with live log events */}
        <div className="overflow-x-auto min-h-[350px]">
          <table className="w-full text-left font-sans text-sm pb-1">
            <thead className="bg-[#1c2b3c] sticky top-0 z-10">
              <tr className="text-[10px] font-mono font-bold text-[#c1c6d7] border-b border-[#414755]/30">
                <th className="px-6 py-3 uppercase tracking-wider">TIMESTAMP / 时间</th>
                <th className="px-6 py-3 uppercase tracking-wider">SEVERITY / 级别</th>
                <th className="px-6 py-3 uppercase tracking-wider">DIMENSION / 尺寸详情</th>
                <th className="px-6 py-3 uppercase tracking-wider">VALUE / 测值</th>
                <th className="px-6 py-3 uppercase tracking-wider">STATUS / 状态</th>
                <th className="px-6 py-3 uppercase tracking-wider">ACTION / 操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#414755]/15 text-[#d4e4fa]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#c1c6d7]/60 font-mono">
                    No active alarm telemetry matches the current filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#273647]/20 transition-colors">
                    {/* Timestamp */}
                    <td className="px-6 py-4 font-mono text-xs">{log.timestamp}</td>
                    
                    {/* Severity tag */}
                    <td className="px-6 py-4">
                      {log.severity === 'CRITICAL' ? (
                        <span className="px-2 py-0.5 bg-[#ffb4ab]/10 text-[#ffb4ab] rounded text-[10px] font-mono font-bold border border-[#ffb4ab]/30">
                          CRITICAL
                        </span>
                      ) : log.severity === 'WARNING' ? (
                        <span className="px-2 py-0.5 bg-[#adc6ff]/10 text-[#adc6ff] rounded text-[10px] font-mono font-bold border border-[#adc6ff]/20">
                          WARNING
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-[#c0c6d8]/10 text-[#c0c6d8] rounded text-[10px] font-mono font-bold">
                          INFO
                        </span>
                      )}
                    </td>

                    {/* Dimension Detail info */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#d4e4fa] text-xs">{log.dimensionName}</div>
                      <div className="text-[10px] text-[#c1c6d7]/60 font-mono mt-0.5">
                        {log.workshop} - {log.carModel} ({log.dimensionId})
                      </div>
                    </td>

                    {/* Value */}
                    <td className="px-6 py-4 font-mono font-bold text-xs">
                      <span className={log.severity === 'CRITICAL' ? 'text-[#ffb4ab]' : 'text-[#adc6ff]'}>
                        {log.value.toFixed(2)}mm
                      </span>
                      <span className="text-[10px] text-[#c1c6d7]/50 font-normal ml-1.5">
                        ({log.limitLabel})
                      </span>
                    </td>

                    {/* Status badge */}
                    <td className="px-6 py-4">
                      {log.status === 'UNRESOLVED' ? (
                        <span className="text-[#ffb4ab] flex items-center gap-1 text-[11px] font-mono font-bold">
                          <Eye className="w-3.5 h-3.5 animate-pulse" /> UNRESOLVED
                        </span>
                      ) : log.status === 'IN REVIEW' ? (
                        <span className="text-[#adc6ff] flex items-center gap-1 text-[11px] font-mono font-bold">
                          <History className="w-3.5 h-3.5" /> IN REVIEW
                        </span>
                      ) : log.status === 'FIXING' ? (
                        <span className="text-[#00eefc] flex items-center gap-1 text-[11px] font-mono font-bold">
                          <Cpu className="w-3.5 h-3.5 animate-spin" /> FIXING
                        </span>
                      ) : (
                        <span className="text-[#00eefc] flex items-center gap-1 text-[11px] font-mono font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> RESOLVED
                        </span>
                      )}
                    </td>

                    {/* Quick Trigger actions */}
                    <td className="px-6 py-4">
                      {log.status === 'UNRESOLVED' ? (
                        <button
                          onClick={() => onAcknowledge(log.id)}
                          className="text-[#4b8eff] hover:text-[#00eefc] hover:underline font-mono text-[10px] font-bold cursor-pointer"
                        >
                          ACKNOWLEDGE
                        </button>
                      ) : log.status === 'IN REVIEW' || log.status === 'FIXING' ? (
                        <button
                          onClick={() => onResolve(log.id)}
                          className="text-[#00eefc] hover:text-[#4b8eff] hover:underline font-mono text-[10px] font-bold cursor-pointer"
                        >
                          MARK RESOLVED
                        </button>
                      ) : (
                        <span className="text-[#c1c6d7]/30 font-mono text-[10px] select-none">
                          VIEWED / AUDITED
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="px-6 py-3 bg-[#122131]/40 border-t border-[#414755]/15 flex justify-between items-center rounded-b-2xl">
          <div className="text-[10px] font-mono text-[#c1c6d7]">
            Showing {filteredLogs.length} of {logs.length} entries
          </div>
          <div className="flex gap-1">
            <button className="p-1 hover:bg-[#273647]/50 rounded text-[#c1c6d7] hover:text-[#adc6ff] transition-all cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-[#273647]/50 rounded text-[#c1c6d7] hover:text-[#adc6ff] transition-all cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
