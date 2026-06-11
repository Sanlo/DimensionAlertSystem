/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  Globe, 
  Bell, 
  Menu, 
  Settings, 
  FileText, 
  SlidersHorizontal,
  X
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadCount: number;
  onOpenManualAlertModal: () => void;
  isSimulating: boolean;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  activeTab,
  onTabChange,
  unreadCount,
  onOpenManualAlertModal,
  isSimulating,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-[#051424]/85 backdrop-blur-md border-b border-[#414755]/20 flex justify-between items-center h-16 px-6">
      {/* Brand & Burger Menu */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-[#adc6ff] hover:text-[#00eefc] transition-colors cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-4">
          <div 
            onClick={() => onTabChange('dashboard')}
            className="text-lg font-sans font-bold text-white tracking-tight cursor-pointer active:scale-95 transition-all text-ellipsis overflow-hidden whitespace-nowrap flex items-center gap-2.5"
          >
            <div className="flex items-center gap-1.5 bg-[#4b8eff]/10 px-2.5 py-0.5 border border-[#4b8eff]/30 rounded">
              <span className="text-xs font-mono font-black text-[#00eefc] tracking-wider">SAIC-GM</span>
            </div>
            <span className="text-[#adc6ff] hover:text-[#00eefc] transition-colors text-base md:text-lg">SPC Dimension Monitoring</span>
          </div>
          <div className="h-6 w-px bg-[#414755]/30 hidden md:block"></div>
          
          {/* Top Tabs */}
          <nav className="hidden md:flex gap-4">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`font-mono text-[11px] font-bold tracking-wider h-16 flex items-center px-1 transition-all border-b-2 hover:text-[#d4e4fa] ${
                activeTab === 'dashboard'
                  ? 'border-[#adc6ff] text-[#adc6ff]'
                  : 'border-transparent text-[#c1c6d7]'
              }`}
            >
              OVERVIEW / 总览
            </button>
            <button
              onClick={() => onTabChange('trends')}
              className={`font-mono text-[11px] font-bold tracking-wider h-16 flex items-center px-1 transition-all border-b-2 hover:text-[#d4e4fa] ${
                activeTab === 'trends'
                  ? 'border-[#adc6ff] text-[#adc6ff]'
                  : 'border-transparent text-[#c1c6d7]'
              }`}
            >
              REPORTS / 报告
            </button>
          </nav>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Search Parameter */}
        <div className="relative hidden lg:block">
          <input
            type="text"
            className="bg-[#0d1c2d] text-xs pb-2 pt-2 pl-10 pr-4 text-[#d4e4fa] border border-[#414755]/20 focus:border-[#4b8eff] focus:outline-none focus:ring-1 focus:ring-[#4b8eff]/30 rounded-lg w-64 placeholder:text-[#c1c6d7]/30 font-mono"
            placeholder="Search parameters or logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3.5 top-2.5 text-[#c1c6d7]/50 w-3.5 h-3.5 animate-pulse" />
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          {isSimulating && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold text-[#00eefc] bg-[#00eefc]/10 border border-[#00eefc]/20 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00eefc]" />
              STREAM LIVE
            </span>
          )}

          <button 
            title="Toggle Manual Alert Dispatch"
            onClick={onOpenManualAlertModal}
            className="p-2 text-[#c1c6d7]/80 hover:text-[#adc6ff] hover:bg-[#4b8eff]/10 rounded-full transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <button className="p-2 text-[#c1c6d7]/80 hover:text-[#adc6ff] hover:bg-[#4b8eff]/10 rounded-full transition-all cursor-pointer">
            <Globe className="w-4 h-4" />
          </button>

          <button className="p-2 text-[#c1c6d7]/80 hover:text-[#adc6ff] hover:bg-[#4b8eff]/10 rounded-full transition-all relative cursor-pointer">
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ffb4ab] border-2 border-[#051424] rounded-full shadow-[0_0_8px_#ffb4ab]" />
            )}
          </button>
        </div>

        {/* User profile details */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#414755]/20">
          <img
            alt="User Profile"
            className="w-8 h-8 rounded-full border border-[#adc6ff]/20 overflow-hidden"
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&q=80"
          />
          <div className="hidden xl:block text-left">
            <div className="text-[10px] font-mono leading-tight font-bold text-[#adc6ff]">ZHANG WEI</div>
            <div className="text-[8px] font-mono leading-none text-[#c1c6d7]">Administrator</div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-[#051424] border-b border-[#414755]/30 p-4 md:hidden flex flex-col gap-3 transition-all">
          <div className="text-[10px] font-mono text-[#c1c6d7] uppercase tracking-widest border-b border-[#414755]/20 pb-1 mb-1">
            SPC Navigation
          </div>
          <button
            onClick={() => {
              onTabChange('dashboard');
              setMobileMenuOpen(false);
            }}
            className={`text-left p-2.5 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
              activeTab === 'dashboard' ? 'bg-[#4b8eff]/10 text-[#adc6ff]' : 'text-[#c1c6d7] hover:bg-[#122131]'
            }`}
          >
            Dashboard / 仪表板
          </button>
          <button
            onClick={() => {
              onTabChange('trends');
              setMobileMenuOpen(false);
            }}
            className={`text-left p-2.5 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
              activeTab === 'trends' ? 'bg-[#4b8eff]/10 text-[#adc6ff]' : 'text-[#c1c6d7] hover:bg-[#122131]'
            }`}
          >
            SPC Trends / 趋势
          </button>
          <button
            onClick={() => {
              onTabChange('incidents');
              setMobileMenuOpen(false);
            }}
            className={`text-left p-2.5 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
              activeTab === 'incidents' ? 'bg-[#4b8eff]/10 text-[#adc6ff]' : 'text-[#c1c6d7] hover:bg-[#122131]'
            }`}
          >
            Incident Command / 事件
          </button>
          <button
            onClick={() => {
              onTabChange('settings');
              setMobileMenuOpen(false);
            }}
            className={`text-left p-2.5 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
              activeTab === 'settings' ? 'bg-[#4b8eff]/10 text-[#adc6ff]' : 'text-[#c1c6d7] hover:bg-[#122131]'
            }`}
          >
            Settings / 设置
          </button>
          
          <div className="relative mt-2">
            <input
              type="text"
              className="bg-[#0d1c2d] text-xs pb-2 pt-2 pl-9 pr-4 text-[#d4e4fa] border border-[#414755]/20 focus:border-[#4b8eff] rounded-lg w-full placeholder:text-[#c1c6d7]/30"
              placeholder="Search parameter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-[#c1c6d7]/50 w-3.5 h-3.5" />
          </div>
        </div>
      )}
    </header>
  );
}
