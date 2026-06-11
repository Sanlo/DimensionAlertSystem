/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Incident } from '../types';
import { 
  Plus, 
  Filter, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  FolderLock, 
  User, 
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Cpu,
  Bookmark,
  Share2,
  MoreVertical
} from 'lucide-react';

interface IncidentViewProps {
  incidents: Incident[];
  onAddIncident: (inc: Incident) => void;
  onUpdateIncidentStatus: (id: string, nextStatus: 'DETECTED' | 'ANALYZING' | 'FIXING' | 'RESOLVED') => void;
  onAddIncidentNote: (id: string, noteText: string) => void;
}

export default function IncidentView({
  incidents,
  onAddIncident,
  onUpdateIncidentStatus,
  onAddIncidentNote,
}: IncidentViewProps) {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('INC-970');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [newNote, setNewNote] = useState('');

  // Selected incident reference
  const selectedIncident = incidents.find(inc => inc.id === selectedIncidentId) || incidents[0];

  // Stats
  const stats = {
    detected: incidents.filter(i => i.status === 'DETECTED').length,
    analyzing: incidents.filter(i => i.status === 'ANALYZING').length,
    fixing: incidents.filter(i => i.status === 'FIXING').length,
    resolved: incidents.filter(i => i.status === 'RESOLVED').length,
  };

  const handleUpdateStatus = () => {
    if (!selectedIncident) return;
    const currentStatus = selectedIncident.status;
    let next: 'DETECTED' | 'ANALYZING' | 'FIXING' | 'RESOLVED' = 'RESOLVED';
    if (currentStatus === 'DETECTED') next = 'ANALYZING';
    else if (currentStatus === 'ANALYZING') next = 'FIXING';
    else if (currentStatus === 'FIXING') next = 'RESOLVED';
    
    onUpdateIncidentStatus(selectedIncident.id, next);
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedIncident) return;
    onAddIncidentNote(selectedIncident.id, newNote);
    setNewNote('');
  };

  const filteredIncidents = incidents.filter(inc => {
    if (filterSeverity === 'ALL') return true;
    return inc.severity === filterSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[#d4e4fa] font-sans font-bold text-2xl flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-[#adc6ff]" />
            Incident Command Center
          </h1>
          <p className="text-sm text-[#c1c6d7] max-w-2xl mt-1">
            Real-time tracking of dimensional anomalies and process deviations. Monitoring current mitigation progress across all sectors.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              const id = `INC-${Math.floor(100 + Math.random() * 900)}`;
              onAddIncident({
                id,
                title: 'CRITICAL FLUSHNESS DEVIATION',
                sector: 'Line 01: Sector A-12',
                severity: 'CRITICAL',
                status: 'DETECTED',
                triggerTime: 'TRIGGERED JUST NOW',
                tags: ['Manual Alert', 'Flushness'],
                progress: 0,
                timeline: [
                  { time: '02:30 PM', text: 'Alert registered by Operator-01 manually' }
                ]
              });
              setSelectedIncidentId(id);
            }}
            className="bg-[#4b8eff] hover:bg-[#4b8eff]/90 hover:scale-95 text-[#002e69] font-mono text-[11px] font-bold tracking-wider px-4 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> LOG NEW INCIDENT
          </button>
          
          <select 
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-[#122131] border border-[#414755]/35 text-[#d4e4fa] font-mono text-[11px] font-bold px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4b8eff]"
          >
            <option value="ALL">FILTER VIEW: ALL</option>
            <option value="CRITICAL">CRITICAL ONLY</option>
            <option value="WARNING">WARNING ONLY</option>
          </select>
        </div>
      </div>

      {/* Stats Counter blocks */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Detected */}
        <div className="bg-[#122131]/80 backdrop-blur-md p-4 rounded-xl border border-[#414755]/10 flex justify-between items-center group hover:border-[#ffb4ab]/20 transition-all">
          <div>
            <div className="text-[10px] font-mono font-bold text-[#c1c6d7] mb-1">ACTIVE DETECTED</div>
            <div className="text-3xl font-mono font-bold text-[#ffb4ab]">{stats.detected}</div>
          </div>
          <AlertTriangle className="w-10 h-10 text-[#ffb4ab]/25 group-hover:scale-110 transition-all" />
        </div>

        {/* Under Analysis */}
        <div className="bg-[#122131]/80 backdrop-blur-md p-4 rounded-xl border-l-4 border-[#00eefc] border-[#414755]/10 flex justify-between items-center group hover:border-[#00eefc]/20 transition-all">
          <div>
            <div className="text-[10px] font-mono font-bold text-[#c1c6d7] mb-1">UNDER ANALYSIS</div>
            <div className="text-3xl font-mono font-bold text-[#00eefc]">{stats.analyzing}</div>
          </div>
          <Cpu className="w-10 h-10 text-[#00eefc]/25 group-hover:scale-110 transition-all" />
        </div>

        {/* Fixing In Progress */}
        <div className="bg-[#122131]/80 backdrop-blur-md p-4 rounded-xl border-l-4 border-[#4b8eff] border-[#414755]/10 flex justify-between items-center group hover:border-[#4b8eff]/20 transition-all">
          <div>
            <div className="text-[10px] font-mono font-bold text-[#c1c6d7] mb-1">FIXING IN PROGRESS</div>
            <div className="text-3xl font-mono font-bold text-[#4b8eff]">{stats.fixing}</div>
          </div>
          <TrendingUp className="w-10 h-10 text-[#4b8eff]/25 group-hover:scale-110 transition-all" />
        </div>

        {/* Resolved Today */}
        <div className="bg-[#122131]/60 backdrop-blur-md p-4 rounded-xl border border-[#414755]/10 flex justify-between items-center opacity-65">
          <div>
            <div className="text-[10px] font-mono font-bold text-[#c1c6d7] mb-1">RESOLVED TODAY</div>
            <div className="text-3xl font-mono font-bold text-[#adc6ff]">{stats.resolved}</div>
          </div>
          <CheckCircle2 className="w-10 h-10 text-[#adc6ff]/20" />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Kanban Board Column container */}
        <div className="xl:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            
            {/* Column: DETECTED */}
            <div className="flex flex-col gap-3 min-h-[400px]">
              <h3 className="text-[10px] font-mono font-bold text-[#ffb4ab] border-b border-[#ffb4ab]/30 pb-2 w-full uppercase tracking-wider">
                DETECTED ({incidents.filter(i => i.status === 'DETECTED').length})
              </h3>
              {filteredIncidents.filter(i => i.status === 'DETECTED').map(inc => (
                <div 
                  key={inc.id}
                  onClick={() => setSelectedIncidentId(inc.id)}
                  className={`bg-[#1c2b3c]/60 backdrop-blur-md p-4 rounded-xl border-l-4 border-[#ffb4ab] hover:bg-[#273647]/50 transition-all cursor-pointer relative group ${
                    selectedIncidentId === inc.id ? 'bg-[#273647]/60 ring-1 ring-[#adc6ff]/25' : 'border border-[#414755]/15'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-mono font-bold bg-[#ffb4ab]/10 text-[#ffb4ab] px-1.5 py-0.5 rounded">
                      {inc.severity}
                    </span>
                    <span className="text-[9px] font-mono text-[#c1c6d7]">{inc.id}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1 group-hover:text-[#adc6ff] transition-colors">{inc.title}</h4>
                  <p className="text-[10px] text-[#c1c6d7] mb-3">{inc.sector}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] animate-ping" />
                    <span className="text-[9px] font-mono text-[#c1c6d7]/70 uppercase">{inc.triggerTime}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Column: ANALYZING */}
            <div className="flex flex-col gap-3 min-h-[400px]">
              <h3 className="text-[10px] font-mono font-bold text-[#00eefc] border-b border-[#00eefc]/30 pb-2 w-full uppercase tracking-wider">
                ANALYZING ({incidents.filter(i => i.status === 'ANALYZING').length})
              </h3>
              {filteredIncidents.filter(i => i.status === 'ANALYZING').map(inc => (
                <div 
                  key={inc.id}
                  onClick={() => setSelectedIncidentId(inc.id)}
                  className={`bg-[#1c2b3c]/60 backdrop-blur-md p-4 rounded-xl border-l-4 border-[#00eefc] hover:bg-[#273647]/50 transition-all cursor-pointer relative group ${
                    selectedIncidentId === inc.id ? 'bg-[#273647]/60 ring-1 ring-[#adc6ff]/25' : 'border border-[#414755]/15'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-mono font-bold bg-[#00eefc]/10 text-[#00eefc] px-1.5 py-0.5 rounded">
                      {inc.severity}
                    </span>
                    <span className="text-[9px] font-mono text-[#c1c6d7]">{inc.id}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1 group-hover:text-[#adc6ff] transition-colors">{inc.title}</h4>
                  <p className="text-[10px] text-[#c1c6d7] mb-3">{inc.sector}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <img alt="Engineer" src={inc.engineer?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=40&q=80'} className="w-4 h-4 rounded-full border border-teal-500" />
                      <span className="text-[9px] font-mono text-white">{inc.engineer?.name}</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-[#00eefc]" />
                  </div>
                </div>
              ))}
            </div>

            {/* Column: FIXING */}
            <div className="flex flex-col gap-3 min-h-[400px]">
              <h3 className="text-[10px] font-mono font-bold text-[#4b8eff] border-b border-[#4b8eff]/30 pb-2 w-full uppercase tracking-wider">
                FIXING ({incidents.filter(i => i.status === 'FIXING').length})
              </h3>
              {filteredIncidents.filter(i => i.status === 'FIXING').map(inc => (
                <div 
                  key={inc.id}
                  onClick={() => setSelectedIncidentId(inc.id)}
                  className={`bg-[#1c2b3c]/60 backdrop-blur-md p-4 rounded-xl border-l-4 border-[#4b8eff] hover:bg-[#273647]/50 transition-all cursor-pointer relative group ${
                    selectedIncidentId === inc.id ? 'bg-[#273647]/60 ring-1 ring-[#adc6ff]/25' : 'border border-[#414755]/15'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-mono font-bold bg-[#4b8eff]/10 text-[#4b8eff] px-1.5 py-0.5 rounded">
                      {inc.severity}
                    </span>
                    <span className="text-[9px] font-mono text-[#c1c6d7]">{inc.id}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1 group-hover:text-[#adc6ff] transition-colors">{inc.title}</h4>
                  <p className="text-[10px] text-[#c1c6d7] mb-2">{inc.sector}</p>
                  
                  {/* Progress log bar */}
                  <div className="w-full bg-[#0d1c2d] h-1 rounded-full mb-3 overflow-hidden">
                    <div className="bg-[#4b8eff] h-full transition-all" style={{ width: `${inc.progress}%` }} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <img alt="Engineer" src={inc.engineer?.avatar} className="w-4 h-4 rounded-full border border-blue-500" />
                      <span className="text-[9px] font-mono text-white">{inc.engineer?.name}</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-[#4b8eff]">{inc.progress}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Column: RESOLVED */}
            <div className="flex flex-col gap-3 min-h-[400px]">
              <h3 className="text-[10px] font-mono font-bold text-[#adc6ff] border-b border-[#adc6ff]/20 pb-2 w-full uppercase tracking-wider">
                RESOLVED ({incidents.filter(i => i.status === 'RESOLVED').length})
              </h3>
              {filteredIncidents.filter(i => i.status === 'RESOLVED').map(inc => (
                <div 
                  key={inc.id}
                  onClick={() => setSelectedIncidentId(inc.id)}
                  className={`bg-[#0d1c2d]/50 p-4 rounded-xl opacity-60 hover:opacity-100 transition-all cursor-pointer relative group ${
                    selectedIncidentId === inc.id ? 'bg-[#122131] ring-1 ring-[#00eefc]/25 opacity-100' : 'border border-[#414755]/10'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-mono font-bold bg-[#c0c6d8]/10 text-[#c0c6d8] px-1.5 py-0.5 rounded">
                      CLOSED
                    </span>
                    <span className="text-[9px] font-mono text-[#c1c6d7]">{inc.id}</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#c1c6d7] mb-1">{inc.title}</h4>
                  <p className="text-[10px] text-[#c1c6d7]/60 mb-3">{inc.sector}</p>
                  <div className="flex items-center gap-1.5 text-[#00eefc]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-mono font-bold uppercase">RESOLVED</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Selected Incident Details Panel */}
        <div className="xl:col-span-4">
          {selectedIncident ? (
            <div className="bg-[#122131]/95 backdrop-blur-md rounded-2xl overflow-hidden flex flex-col border-t-4 border-[#4b8eff] border-x border-b border-[#414755]/10 sticky top-20">
              {/* Header meta */}
              <div className="p-4 bg-[#1c2b3c]/80 border-b border-[#414755]/20 flex justify-between items-start">
                <div>
                  <h2 className="text-[#d4e4fa] font-sans font-bold text-base leading-tight">
                    {selectedIncident.title}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] font-mono font-bold text-[#adc6ff]">ID: #{selectedIncident.id}</span>
                    <span className="h-3 w-px bg-[#414755]/30"></span>
                    <span className="text-[9px] font-mono text-[#c1c6d7]">{selectedIncident.sector}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 bg-[#273647]/50 hover:bg-[#4b8eff]/10 hover:text-[#adc6ff] rounded-lg text-[#c1c6d7] transition-all">
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 bg-[#273647]/50 hover:bg-[#4b8eff]/10 hover:text-[#adc6ff] rounded-lg text-[#c1c6d7] transition-all">
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-5">
                {/* Status modifier buttons */}
                <div>
                  <div className="text-[9px] font-mono font-bold text-[#c1c6d7] tracking-wider mb-2">OPERATIONAL CONTROL</div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateStatus}
                      disabled={selectedIncident.status === 'RESOLVED'}
                      className={`flex-1 text-center py-2 px-3 rounded-lg text-[10px] font-mono font-bold transition-all border ${
                        selectedIncident.status === 'DETECTED' 
                          ? 'bg-[#00eefc]/20 text-[#00eefc] border-[#00eefc]/40 hover:bg-[#00eefc]/30'
                          : selectedIncident.status === 'ANALYZING'
                          ? 'bg-[#4b8eff]/20 text-[#adc6ff] border-[#4b8eff]/40 hover:bg-[#4b8eff]/30'
                          : selectedIncident.status === 'FIXING'
                          ? 'bg-[#4b8eff] text-[#002e69] border-[#4b8eff] hover:bg-[#4b8eff]/90'
                          : 'bg-[#0d1c2d] border-[#414755]/15 text-[#c1c6d7] cursor-not-allowed'
                      }`}
                    >
                      {selectedIncident.status === 'DETECTED' && 'INITIAL SURVEY (ANALYZING)'}
                      {selectedIncident.status === 'ANALYZING' && 'START MITIGATION (FIXING)'}
                      {selectedIncident.status === 'FIXING' && 'RESOLVE INCIDENT (CLOSE)'}
                      {selectedIncident.status === 'RESOLVED' && 'ANOMALY CLOSED'}
                    </button>
                  </div>
                </div>

                {/* Root Cause Analysis (RCA) block info */}
                <div>
                  <div className="flex items-center gap-1.5 text-[#adc6ff] mb-2 font-mono text-[10px] font-bold">
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>ROOT CAUSE ANALYSIS</span>
                  </div>
                  <div className="bg-[#273647]/40 p-3 rounded-xl border border-[#414755]/20">
                    <p className="text-xs text-[#c1c6d7] italic leading-relaxed">
                      {selectedIncident.rca || 'Under initial investigation. Mechanical calibration scans and thermal telemetry profiles have been requested.'}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {selectedIncident.tags.map((tag, tIndex) => (
                        <span 
                          key={tIndex} 
                          className="text-[9px] font-mono bg-[#adc6ff]/10 text-[#adc6ff] border border-[#adc6ff]/20 px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Assigned Field Engineer card */}
                {selectedIncident.engineer && (
                  <div className="flex items-center justify-between p-3.5 bg-[#122131] border-l-4 border-[#adc6ff] rounded-xl border border-[#414755]/10">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          alt="Technician" 
                          className="w-10 h-10 rounded-lg border border-[#adc6ff]/20" 
                          src={selectedIncident.engineer.avatar} 
                        />
                        <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#122131]" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{selectedIncident.engineer.name}</div>
                        <div className="text-[9px] font-mono text-[#c1c6d7] mt-0.5">
                          {selectedIncident.engineer.role}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => alert(`Opening alert dispatch radio to ${selectedIncident.engineer?.name}...`)}
                      className="p-2 text-[#adc6ff] hover:text-[#00eefc] hover:bg-[#adc6ff]/10 rounded-full transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Status milestones tracker */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-[#adc6ff] font-mono text-[10px] font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>STATUS TIMELINE</span>
                  </div>
                  
                  <div className="space-y-4 relative pl-4 border-l border-[#414755]/30">
                    {selectedIncident.timeline.map((mile, mIdx) => (
                      <div key={mIdx} className="relative">
                        {/* Bullet point node */}
                        <div className="absolute -left-[20.5px] top-0.5 w-2.5 h-2.5 rounded-full bg-[#adc6ff] border border-[#051424] shadow-[0_0_4px_#adc6ff]" />
                        <div className="text-[9px] font-mono text-[#adc6ff]/90">{mile.time}</div>
                        <div className="text-xs text-[#d4e4fa] mt-0.5 font-sans">{mile.text}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live logger update */}
                <form onSubmit={handleAddNoteSubmit} className="pt-3 border-t border-[#414755]/15 space-y-2">
                  <label htmlFor="newNote" className="text-[9px] font-mono font-bold text-[#c1c6d7] tracking-wider block">
                    ADD COMMAND PROGRESS NOTE / 进度备注
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="newNote"
                      type="text"
                      className="flex-1 bg-[#0d1c2d] border border-[#414755]/30 rounded-lg text-xs px-3 py-2 text-white focus:outline-none focus:border-[#4b8eff] font-sans"
                      placeholder="Type a critical update..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                    <button 
                      type="submit"
                      className="bg-[#273647]/50 hover:bg-[#adc6ff]/10 hover:text-[#adc6ff] border border-[#414755]/20 p-2 rounded-lg text-white transition-all cursor-pointer active:scale-95"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>

              </div>
            </div>
          ) : (
            <div className="bg-[#122131]/95 p-8 text-center text-[#c1c6d7] font-mono rounded-2xl border border-[#414755]/15">
              Select an incident from the Kanban board to inspect live dispatcher telemetry.
            </div>
          )}
        </div>

      </div>

      {/* Auxiliary Analytical widgets */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-40">
        <div className="h-44 bg-[#122131]/80 backdrop-blur-md rounded-2xl border border-[#414755]/10 p-5 flex flex-col justify-end relative overflow-hidden group">
          <div className="absolute inset-0 flex items-center justify-center opacity-10 font-mono text-[#adc6ff] text-2xl select-none group-hover:scale-95 transition-all">
            [ THERMAL SPECTRUM SCANNING ]
          </div>
          <div className="relative z-10 text-center">
            <div className="text-[10px] font-mono font-bold text-[#adc6ff]">SECTOR A-09 THERMAL MAP</div>
            <div className="text-[9px] font-mono text-[#c1c6d7] tracking-widest uppercase mt-0.5">LIVE TELEMETRY FEED</div>
          </div>
        </div>

        <div className="h-44 bg-[#122131]/80 backdrop-blur-md rounded-2xl border border-[#414755]/10 p-5 flex flex-col justify-end relative overflow-hidden group">
          <div className="absolute inset-0 flex items-center justify-center opacity-10 font-mono text-[#adc6ff] text-2xl select-none group-hover:scale-95 transition-all">
            [ MODAL FFT FREQUENCY SINE ]
          </div>
          <div className="relative z-10 text-center">
            <div className="text-[10px] font-mono font-bold text-[#00eefc]">VIBRATION ANALYSIS</div>
            <div className="text-[9px] font-mono text-[#c1c6d7] tracking-widest uppercase mt-0.5">FFT HARMONIC PATTERN</div>
          </div>
        </div>
      </section>

    </div>
  );
}
