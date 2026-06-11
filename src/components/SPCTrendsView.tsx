/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SPCDataPoint } from '../types';
import { INITIAL_SPC_POINTS } from '../mockData';
import { 
  Info, 
  AlertTriangle, 
  Zap, 
  HelpCircle, 
  Calendar, 
  Activity, 
  Settings, 
  RefreshCw,
  LineChart,
  AreaChart,
  ShieldCheck,
  Award,
  TrendingUp
} from 'lucide-react';

interface SPCTrendsViewProps {
  dataPoints: SPCDataPoint[];
  onGenerateAnalysis: () => void;
  violationsCount: number;
}

export default function SPCTrendsView({
  dataPoints = INITIAL_SPC_POINTS,
  onGenerateAnalysis,
  violationsCount = 3,
}: SPCTrendsViewProps) {
  // Filter variables
  const [dateRange, setDateRange] = useState('OCT 12, 2023 - OCT 19, 2023');
  const [partName, setPartName] = useState('CHASSIS-A12-FRONT');
  const [dimensionId, setDimensionId] = useState('DIM_GAP_001 (Flushness)');
  const [plant, setPlant] = useState('East Wing Assembly (东区)');
  const [carModel, setCarModel] = useState('Model-S30 (豪华版)');
  const [assembly, setAssembly] = useState('Underbody Group (下车体)');
  const [timeRange, setTimeRange] = useState('LAST 24H');
  
  // Interactive nodes
  const [hoveredNode, setHoveredNode] = useState<SPCDataPoint | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTriggerAnalysis = () => {
    setIsGenerating(true);
    setTimeout(() => {
      onGenerateAnalysis();
      setIsGenerating(false);
    }, 800);
  };

  // Convert array coordinate points to SVG format
  const widthVal = 1000;
  const heightVal = 300;
  
  const getCoordinates = (pt: SPCDataPoint, index: number, total: number) => {
    const x = (index / (total - 1)) * (widthVal - 80) + 40;
    // value ranges from 0.5 to 1.5, map 0.5 to bottom (height-40) and 1.5 to top (40)
    const normalized = (pt.value - 0.5) / 1.0; 
    const y = heightVal - 40 - normalized * (heightVal - 80);
    return { x, y };
  };

  const trendPath = dataPoints.map((pt, i) => {
    const { x, y } = getCoordinates(pt, i, dataPoints.length);
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <div className="space-y-6">
      {/* Filters Card Panel */}
      <section className="space-y-4">
        <div className="bg-[#122131]/80 backdrop-blur-md p-5 rounded-2xl border border-[#414755]/10 flex flex-wrap items-end gap-4">
          
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className="text-[10px] font-mono font-bold text-[#c1c6d7] uppercase block tracking-wider">
              Date Range <span className="text-[9px] text-[#adc6ff]/60">| 日期范围</span>
            </label>
            <div className="relative">
              <input 
                type="text" 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full bg-[#0d1c2d] border border-[#414755]/20 focus:border-[#4b8eff] focus:outline-none focus:ring-1 focus ring-[#4b8eff]/30 rounded-lg px-3 py-2 text-xs text-[#adc6ff] font-mono cursor-pointer"
              />
              <Calendar className="absolute right-3 top-2.5 w-3.5 h-3.5 text-[#c1c6d7]/60" />
            </div>
          </div>

          <div className="space-y-1.5 min-w-[180px] flex-1">
            <label className="text-[10px] font-mono font-bold text-[#c1c6d7] uppercase block tracking-wider">
              Part Name <span className="text-[9px] text-[#adc6ff]/60">| 零件名称</span>
            </label>
            <select 
              value={partName}
              onChange={(e) => setPartName(e.target.value)}
              className="w-full bg-[#0d1c2d] border border-[#414755]/20 focus:border-[#4b8eff] focus:outline-none rounded-lg px-3 py-2 text-xs text-[#d4e4fa] font-mono"
            >
              <option value="CHASSIS-A12-FRONT">CHASSIS-A12-FRONT</option>
              <option value="CHASSIS-B04-REAR">CHASSIS-B04-REAR</option>
              <option value="SUPPORT-X01-LAT">SUPPORT-X01-LAT</option>
            </select>
          </div>

          <div className="space-y-1.5 min-w-[180px] flex-1">
            <label className="text-[10px] font-mono font-bold text-[#c1c6d7] uppercase block tracking-wider">
              Dimension ID <span className="text-[9px] text-[#adc6ff]/60">| 尺寸编号</span>
            </label>
            <select 
              value={dimensionId}
              onChange={(e) => setDimensionId(e.target.value)}
              className="w-full bg-[#0d1c2d] border border-[#414755]/20 focus:border-[#4b8eff] focus:outline-none rounded-lg px-3 py-2 text-xs text-[#d4e4fa] font-mono"
            >
              <option value="DIM_GAP_001 (Flushness)">DIM_GAP_001 (Flushness)</option>
              <option value="DIM_O_022 (Opening)">DIM_O_022 (Opening)</option>
              <option value="DIM_S_005 (Stepped)">DIM_S_005 (Stepped)</option>
            </select>
          </div>

          <button 
            onClick={handleTriggerAnalysis}
            disabled={isGenerating}
            className="bg-[#adc6ff] hover:bg-[#4b8eff] text-[#002e69] font-mono text-[10px] font-bold px-5 py-2.5 rounded-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer border border-transparent select-none shadow-md"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'ANALYZING...' : 'GENERATE ANALYSIS'}
          </button>
        </div>

        {/* Quick Secondary Filters Row */}
        <div className="bg-[#122131]/80 backdrop-blur-md p-4 rounded-2xl border border-[#414755]/10 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] font-mono font-bold text-[#c1c6d7] block uppercase tracking-wider">Plant | 厂区</label>
            <select 
              value={plant}
              onChange={(e) => setPlant(e.target.value)}
              className="w-full bg-[#0d1c2d] border border-[#414755]/10 rounded-lg px-3 py-1.5 text-xs text-[#d4e4fa] focus:border-[#4b8eff] focus:outline-none"
            >
              <option>East Wing Assembly (东区)</option>
              <option>North Logistics (北区)</option>
              <option>South Casting (南区)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-mono font-bold text-[#c1c6d7] block uppercase tracking-wider">Car Model | 车型</label>
            <select 
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
              className="w-full bg-[#0d1c2d] border border-[#414755]/10 rounded-lg px-3 py-1.5 text-xs text-[#d4e4fa] focus:border-[#4b8eff] focus:outline-none"
            >
              <option>Model-S30 (豪华版)</option>
              <option>Model-X10 (旗舰版)</option>
              <option>Model-V05 (标准版)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-mono font-bold text-[#c1c6d7] block uppercase tracking-wider">Assembly | 总成</label>
            <select 
              value={assembly}
              onChange={(e) => setAssembly(e.target.value)}
              className="w-full bg-[#0d1c2d] border border-[#414755]/10 rounded-lg px-3 py-1.5 text-xs text-[#d4e4fa] focus:border-[#4b8eff] focus:outline-none"
            >
              <option>Underbody Group (下车体)</option>
              <option>Side Frame Group (侧围)</option>
              <option>Body Shell Group (白车身)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-mono font-bold text-[#c1c6d7] block uppercase tracking-wider">Time Range | 时间范围</label>
            <div className="flex gap-2">
              {['LAST 24H', 'SHIFT 1', 'SHIFT 2'].map((shift) => (
                <button
                  key={shift}
                  onClick={() => setTimeRange(shift)}
                  className={`flex-1 rounded-lg py-1.5 text-[9px] font-mono font-bold transition-all uppercase border ${
                    timeRange === shift
                      ? 'bg-[#4b8eff]/15 border-[#adc6ff] text-[#adc6ff]'
                      : 'bg-[#0d1c2d] border-[#414755]/15 text-[#c1c6d7]/70 hover:border-[#adc6ff]/3d'
                  }`}
                >
                  {shift}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SPC Advanced Metrics Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Statistical KPI cards */}
        <div className="col-span-12 lg:col-span-3 space-y-4 flex flex-col justify-between">
          
          {/* Cp Card */}
          <div className="bg-[#122131]/80 backdrop-blur-md p-5 rounded-2xl border border-[#414755]/10 flex-1 flex flex-col justify-between relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono font-bold text-[#c1c6d7] uppercase tracking-wider">Capability Index (Cp)</span>
              <span className="p-1 hover:bg-[#4b8eff]/10 rounded-full cursor-help text-[#00eefc]">
                <Info className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="text-4xl font-mono text-[#00dbe9] leading-tight font-bold my-2">1.68</div>
            <div className="text-[9px] font-mono text-[#00eefc] flex items-center gap-1 font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              +0.12 FROM PREV. SHIFT
            </div>
          </div>

          {/* Mean Variation Card */}
          <div className="bg-[#122131]/80 backdrop-blur-md p-5 rounded-2xl border border-[#414755]/10 flex-1 flex flex-col justify-between relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono font-bold text-[#c1c6d7] uppercase tracking-wider">Mean Variation</span>
              <span className="text-[#c1c6d7]/60">
                <LineChart className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="text-4xl font-mono text-[#d4e4fa] leading-tight font-bold my-2">
              ±0.04<span className="text-sm text-[#c1c6d7]/40 ml-1">mm</span>
            </div>
            <div className="h-1 bg-[#273647] rounded-full overflow-hidden mt-1 shadow-inner">
              <div className="h-full bg-[#adc6ff] w-2/3 shadow-[0_0_8px_#adc6ff]" />
            </div>
          </div>

          {/* Violations Counter */}
          <div className="bg-[#122131]/80 backdrop-blur-md p-5 rounded-2xl border-l-4 border-[#ffb4ab] border-[#414755]/10 flex-1 flex flex-col justify-between relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono font-bold text-[#ffb4ab] uppercase tracking-wider">Violations Found</span>
              <AlertTriangle className="w-3.5 h-3.5 text-[#ffb4ab]" />
            </div>
            <div className="text-4xl font-mono text-[#ffb4ab] leading-tight font-bold my-2">
              {violationsCount < 10 ? `0${violationsCount}` : violationsCount}
            </div>
            <div className="text-[9px] font-mono text-[#c1c6d7] font-bold">
              WESTERN ELECTRIC RULE 1 FAIL
            </div>
          </div>
        </div>

        {/* Main interactive SPC Trend Line Chart */}
        <div className="col-span-12 lg:col-span-9 bg-[#122131]/85 backdrop-blur-md rounded-2xl p-6 border border-[#adc6ff]/10 flex flex-col relative overflow-hidden">
          
          {/* Subtle Grid Dot Pattern Background overlay */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #adc6ff 1px, transparent 0)', backgroundSize: '16px 16px' }} />
          </div>

          <div className="flex justify-between items-center mb-6 relative z-10">
            <div>
              <h2 className="text-lg font-sans font-bold text-[#adc6ff] tracking-tight">
                {dimensionId.split(' ')[0]} Trend Analysis
              </h2>
              <p className="text-[9px] font-mono font-bold text-[#c1c6d7] tracking-wider uppercase">
                REAL-TIME TELEMETRY | FREQUENCY: 50HZ
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-0 border-t border-dashed border-[#00eefc]" />
                <span className="text-[9px] font-mono font-bold text-[#c1c6d7] uppercase">UCL/LCL (3σ)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-px bg-[#adc6ff]" />
                <span className="text-[9px] font-mono font-bold text-[#c1c6d7] uppercase">Mean</span>
              </div>
            </div>
          </div>

          {/* SVG Trend view with Custom markers */}
          <div className="flex-1 w-full min-h-[260px] relative z-10">
            <svg 
              className="w-full h-[230px]" 
              preserveAspectRatio="none" 
              viewBox={`0 0 ${widthVal} ${heightVal}`}
            >
              {/* UCL Limit dashed */}
              <line opacity="0.4" stroke="#00eefc" strokeDasharray="6,4" strokeWidth="1.5" x1="0" x2={widthVal} y1="60" y2="60" />
              {/* LCL Limit dashed */}
              <line opacity="0.4" stroke="#00eefc" strokeDasharray="6,4" strokeWidth="1.5" x1="0" x2={widthVal} y1="240" y2="240" />
              {/* Mean central line */}
              <line opacity="0.6" stroke="#adc6ff" strokeWidth="1.5" x1="0" x2={widthVal} y1="150" y2="150" />

              {/* Main Line path */}
              <path 
                d={trendPath} 
                fill="none" 
                stroke="#4b8eff" 
                strokeWidth="2.5" 
                className="stroke-cyan-500" 
              />

              {/* Node plotting */}
              <g>
                {dataPoints.map((pt, i) => {
                  const { x, y } = getCoordinates(pt, i, dataPoints.length);
                  const isAnomaly = pt.value > pt.ucl || pt.value < pt.lcl || pt.isViolation;
                  
                  return (
                    <g key={i}>
                      {/* Interactive hover circle hit box */}
                      <circle
                        cx={x}
                        cy={y}
                        r="12"
                        fill="transparent"
                        className="cursor-crosshair"
                        onMouseEnter={() => setHoveredNode(pt)}
                        onMouseLeave={() => setHoveredNode(null)}
                      />

                      {/* Visual rendering of point */}
                      {isAnomaly ? (
                        <polygon
                          points={`${x},${y - 6} ${x + 6},${y} ${x},${y + 6} ${x - 6},${y}`}
                          fill="#ffb4ab"
                          stroke="#ffb4ab"
                          strokeWidth="2.5"
                          className={`${hoveredNode?.index === pt.index ? 'scale-150' : ''} transition-all duration-150`}
                        />
                      ) : (
                        <circle
                          cx={x}
                          cy={y}
                          r={hoveredNode?.index === pt.index ? "6" : "4"}
                          fill="#adc6ff"
                          className="transition-all duration-150 ease-out"
                        />
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* Float values on side */}
            <div className="absolute left-0 top-3 text-[9px] font-mono font-bold text-[#00eefc]/75">UCL: 1.25mm</div>
            <div className="absolute left-0 bottom-3 text-[9px] font-mono font-bold text-[#00eefc]/75">LCL: 0.75mm</div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold text-[#adc6ff]/70">μ: 1.00mm</div>

            {/* Floating Custom Tooltip */}
            {hoveredNode && (
              <div 
                className="absolute bg-[#1c2b3c] border border-[#adc6ff]/20 p-2.5 rounded-lg shadow-xl z-30 font-mono text-[10px] text-[#d4e4fa] pointer-events-none w-44"
                style={{
                  left: `${Math.min(
                    800,
                    (hoveredNode.index / dataPoints.length) * (widthVal - 80) + 40
                  ) / 1.1}px`,
                  top: `35px`
                }}
              >
                <div className="text-[#adc6ff] font-bold border-b border-[#414755]/30 pb-1 mb-1">
                  POINT INFO (#0{hoveredNode.index})
                </div>
                <div>Measurement: <span className="font-bold text-white">{hoveredNode.value.toFixed(3)}mm</span></div>
                <div>Spec mean: <span>{hoveredNode.mean.toFixed(2)}mm</span></div>
                <div>Scan Time: <span>{hoveredNode.scanTime}</span></div>
                <div>Batch ID: <span className="text-[#00eefc]">{hoveredNode.batchId}</span></div>
                {hoveredNode.isViolation && (
                  <div className="text-[#ffb4ab] font-bold mt-1 animate-pulse">⚠️ OUT OF CONTROL</div>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-between border-t border-[#414755]/15 pt-3">
            <span className="text-[9px] font-mono text-[#c1c6d7]/60">SCAN_TIME: 08:00:00</span>
            <span className="text-[9px] font-mono text-[#adc6ff]/60 font-bold">BATCH_ID: BX-992-K</span>
            <span className="text-[9px] font-mono text-[#c1c6d7]/60">SCAN_TIME: 16:00:00</span>
          </div>
        </div>
      </div>

      {/* Advanced Control Subgroups Grid (X-Bar, Range R, S-Chart) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* X-Bar Chart */}
        <div className="bg-[#122131]/80 backdrop-blur-md p-5 rounded-2xl border border-[#414755]/10 flex flex-col min-h-[290px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-mono font-bold text-[#adc6ff] uppercase">
              X-Bar Chart <span className="text-[9px] font-sans text-[#c1c6d7]/70">| 均值控制图</span>
            </h3>
            <ShieldCheck className="w-4 h-4 text-[#00eefc]" />
          </div>
          <div className="flex-1 relative border-b border-[#414755]/15 py-1">
            <svg className="w-full h-[140px]" preserveAspectRatio="none" viewBox="0 0 300 150">
              <line stroke="#414755" strokeDasharray="3,3" strokeWidth="0.5" x1="0" x2="300" y1="30" y2="30" />
              <line stroke="#414755" strokeWidth="1" x1="0" x2="300" y1="75" y2="75" />
              <line stroke="#414755" strokeDasharray="3,3" strokeWidth="0.5" x1="0" x2="300" y1="120" y2="120" />
              
              <line opacity="0.5" stroke="#ffb4ab" strokeWidth="1" x1="0" x2="300" y1="18" y2="18" />
              <line opacity="0.5" stroke="#ffb4ab" strokeWidth="1" x1="0" x2="300" y1="132" y2="132" />

              {/* Process line */}
              <path d="M0,75 L30,85 L60,65 L90,70 L120,40 L150,80 L180,75 L210,110 L240,75 L270,85 L300,70" fill="none" stroke="#adc6ff" strokeWidth="1.5" />
              <circle cx="120" cy="40" fill="#adc6ff" r="3" />
              <circle cx="210" cy="110" fill="#adc6ff" r="3" />
            </svg>
            <div className="absolute left-1 top-0.5 text-[8px] font-mono text-[#ffb4ab]/60">UCL</div>
            <div className="absolute left-1 bottom-1.5 text-[8px] font-mono text-[#ffb4ab]/60">LCL</div>
            <div className="absolute right-1 top-1/2 -translate-y-1/2 text-[8px] font-mono text-[#adc6ff]/40">MEAN</div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#414755]/10 flex justify-between">
            <span className="text-[10px] font-mono text-[#c1c6d7]/60">SENSITIVITY: HIGH</span>
            <span className="text-[10px] font-mono text-[#00eefc] font-bold">STABLE (稳)</span>
          </div>
        </div>

        {/* Range R Chart */}
        <div className="bg-[#122131]/80 backdrop-blur-md p-5 rounded-2xl border border-[#414755]/10 flex flex-col min-h-[290px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-mono font-bold text-[#adc6ff] uppercase">
              Range (R) Chart <span className="text-[9px] font-sans text-[#c1c6d7]/70">| 极差控制图</span>
            </h3>
            <AlertTriangle className="w-4 h-4 text-[#ffb4ab]" />
          </div>
          <div className="flex-1 relative border-b border-[#414755]/15 py-1">
            <svg className="w-full h-[140px]" preserveAspectRatio="none" viewBox="0 0 300 150">
              <line stroke="#414755" strokeWidth="1" x1="0" x2="300" y1="130" y2="130" />
              <line opacity="0.4" stroke="#00eefc" strokeDasharray="4,2" strokeWidth="1" x1="0" x2="300" y1="40" y2="40" />

              <path d="M0,130 L30,120 L60,110 L90,125 L120,45 L150,115 L180,120 L210,130 L240,110 L270,125 L300,120" fill="none" stroke="#00eefc" strokeWidth="1.5" />
              <polygon points="120,38 126,45 120,52 114,45" fill="#ffb4ab" stroke="#ffb4ab" className="animate-pulse" />
            </svg>
            <div className="absolute left-1 top-4 text-[8px] font-mono text-[#00eefc]/60">UCL_R</div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#414755]/10 flex justify-between">
            <span className="text-[10px] font-mono text-[#c1c6d7]/60">OUTLIER DETECTED AT #12</span>
            <span className="text-[10px] font-mono text-[#ffb4ab] font-bold">ALARM (警)</span>
          </div>
        </div>

        {/* Standard Deviation S-Chart */}
        <div className="bg-[#122131]/80 backdrop-blur-md p-5 rounded-2xl border border-[#414755]/10 flex flex-col min-h-[290px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-mono font-bold text-[#adc6ff] uppercase">
              S-Chart <span className="text-[9px] font-sans text-[#c1c6d7]/70">| 标准差图</span>
            </h3>
            <Award className="w-4 h-4 text-[#00eefc]" />
          </div>
          <div className="flex-1 relative border-b border-[#414755]/15 py-1">
            <svg className="w-full h-[140px]" preserveAspectRatio="none" viewBox="0 0 300 150">
              <rect fill="rgba(173,198,255,0.05)" height="70" width="300" x="0" y="40" />
              <line stroke="#414755" strokeWidth="1" x1="0" x2="300" y1="75" y2="75" />
              <path d="M0,70 L30,72 L60,68 L90,80 L120,75 L150,73 L180,78 L210,72 L240,75 L270,71 L300,74" fill="none" stroke="#4b8eff" strokeWidth="1" />
              <path d="M120,75 L120,40 M120,75 L120,110" stroke="#4b8eff" strokeDasharray="2,2" strokeWidth="0.5" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <span className="font-mono text-5xl font-bold text-[#adc6ff]">σ</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#414755]/10 flex justify-between">
            <span className="text-[10px] font-mono text-[#c1c6d7]/60">SIGMA LEVEL: 6σ</span>
            <span className="text-[10px] font-mono text-[#00eefc] font-bold">EXCELLENT (优)</span>
          </div>
        </div>
      </section>
    </div>
  );
}
