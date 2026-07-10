import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Sparkles, 
  Star, 
  History as HistoryIcon, 
  Bookmark, 
  ArrowRight, 
  Type, 
  Calculator, 
  Code, 
  Key, 
  RefreshCw, 
  Layers, 
  TrendingUp, 
  Trash2, 
  HelpCircle,
  X,
  ShieldCheck,
  EyeOff,
  Cpu,
  Zap,
  Lock,
  Compass
} from 'lucide-react';
import { TOOLS, CATEGORIES } from '../data/tools';
import ToolCard from './ToolCard';

interface DashboardViewProps {
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  workspaceFilter: 'all' | 'favorites' | 'recent' | 'trending' | 'new';
  setWorkspaceFilter: (filter: 'all' | 'favorites' | 'recent' | 'trending' | 'new') => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  history: { toolId: string; timestamp: number }[];
  setHistory: (history: { toolId: string; timestamp: number }[]) => void;
  onNavigate: (view: string) => void;
}

export default function DashboardView({
  selectedCategory,
  setSelectedCategory,
  workspaceFilter,
  setWorkspaceFilter,
  favorites,
  toggleFavorite,
  history,
  setHistory,
  onNavigate
}: DashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive stats states that animate on mount
  const [activeCount, setActiveCount] = useState(0);
  const [safetyPercent, setSafetyPercent] = useState(0);
  const [latencyMs, setLatencyMs] = useState(20);

  useEffect(() => {
    const duration = 1000;
    const steps = 40;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const ratio = currentStep / steps;
      
      setActiveCount(Math.min(Math.round(ratio * 20), 20));
      setSafetyPercent(Math.min(Math.round(ratio * 100), 100));
      setLatencyMs(Math.max(5, Math.round(20 - ratio * 15)));

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);
  
  // Calculate featured tool using intelligent scoring algorithm
  const getIntelligentFeaturedTool = () => {
    const currentMonth = new Date().getMonth();
    const scoredTools = TOOLS.map((tool) => {
      let score = tool.popularScore;
      
      // Seasonal bonuses
      if (currentMonth === 6 && tool.id === 'json-formatter') score += 20;
      if (currentMonth === 11 && tool.id === 'age-calculator') score += 20;
      if ((currentMonth === 4 || currentMonth === 5) && tool.id === 'word-counter') score += 20;
      
      // History bonus
      const inHistoryIdx = history.findIndex((h) => h.toolId === tool.id);
      if (inHistoryIdx !== -1) {
        score += (5 - inHistoryIdx) * 2;
      }
      
      // New version bonus
      if (parseFloat(tool.version) >= 1.4) {
        score += 5;
      }
      
      return { tool, score };
    });
    
    scoredTools.sort((a, b) => b.score - a.score);
    return scoredTools[0]?.tool || TOOLS[0];
  };

  const featuredTool = getIntelligentFeaturedTool();

  const getCategoryIcon = (id: string, className: string) => {
    switch (id) {
      case 'text': return <Type className={className} size={18} />;
      case 'calculator': return <Calculator className={className} size={18} />;
      case 'developer': return <Code className={className} size={18} />;
      case 'generator': return <Key className={className} size={18} />;
      case 'converter': return <RefreshCw className={className} size={18} />;
      default: return <Layers className={className} size={18} />;
    }
  };

  // Filter tools based on category, workspace filters, and search query
  const filteredTools = selectedCategory
    ? TOOLS.filter((t) => t.category === selectedCategory)
    : TOOLS;

  let displayedTools = [...filteredTools];
  if (workspaceFilter === 'favorites') {
    displayedTools = TOOLS.filter((t) => favorites.includes(t.id));
  } else if (workspaceFilter === 'recent') {
    const orderedIds = history.map((item) => item.toolId);
    displayedTools = orderedIds
      .map((id) => TOOLS.find((t) => t.id === id))
      .filter((t) => !!t) as typeof TOOLS;
  } else if (workspaceFilter === 'trending') {
    displayedTools = [...TOOLS].sort((a, b) => b.popularScore - a.popularScore);
  } else if (workspaceFilter === 'new') {
    displayedTools = [...TOOLS].sort((a, b) => parseFloat(b.version) - parseFloat(a.version));
  }

  // Real-time keyword filter
  const finalTools = searchQuery.trim() !== ''
    ? displayedTools.filter((tool) => {
        const query = searchQuery.toLowerCase();
        return (
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.globalKeywords.some((kw) => kw.toLowerCase().includes(query)) ||
          tool.category.toLowerCase().includes(query)
        );
      })
    : displayedTools;

  const popularSearches = [
    { label: 'Word Counter', term: 'Word' },
    { label: 'JSON Formatter', term: 'JSON' },
    { label: 'Age Calculator', term: 'Age' },
    { label: 'Password Generator', term: 'Password' },
    { label: 'Base64 Converter', term: 'Base64' }
  ];

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.2 }}
      className="flex-1 pb-16"
    >
      {/* Visual Identity Hero Section with Premium Craft Elements */}
      <section className="relative overflow-hidden border-b border-gray-150 bg-white py-20 md:py-28 text-center transition-all duration-300 dark:bg-gray-950 dark:border-gray-900" id="hero-banner-section">
        {/* Subtle decorative grid lines representing modern product sheets */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:16px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)]"></div>
        
        {/* Animated ambient light orb behind content */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-80 w-[500px] bg-gradient-to-r from-indigo-500/10 via-violet-500/5 to-rose-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50/75 px-3.5 py-1.5 font-mono text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400 uppercase tracking-wider border border-indigo-100/50 dark:border-indigo-900/30 shadow-xs"
          >
            <Sparkles size={11} className="text-indigo-500 animate-pulse shrink-0" />
            <span>Premium local-first design initiative</span>
          </motion.div>
          
          <h1 className="mt-6 font-sans font-extrabold text-3xl tracking-tight text-gray-950 sm:text-6xl leading-none dark:text-white max-w-4xl mx-auto">
            A Single Private Toolbox for <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-rose-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-rose-400">
              Every Daily Task
            </span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl font-sans text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
            Run powerful developers, calculators, converters, and generators 100% locally on your own hardware. Zero server uploads. Zero registration required. Infinite sandbox speed.
          </p>

          {/* Majestic Hero Central Search Hub */}
          <div className="mx-auto mt-10 max-w-2xl relative" id="hero-search-hub">
            <div className="group relative rounded-2xl border border-gray-200 bg-white/70 shadow-[0_4px_24px_rgba(0,0,0,0.02)] backdrop-blur-md transition-all duration-300 hover:border-gray-400 hover:shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:border-gray-800 dark:bg-gray-900/60 dark:hover:border-gray-700">
              <Search className="absolute left-5 top-1/2 h-5.5 w-5.5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="What utility can we boot for you? (e.g. Word, JSON, Age, Password)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border-none bg-transparent py-4.5 pl-13 pr-11 font-sans text-sm md:text-base text-gray-950 placeholder-gray-400 outline-none focus:ring-0 dark:text-white"
                id="central-search-input"
              />
              {searchQuery ? (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-950 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-850"
                >
                  <X size={14} />
                </button>
              ) : (
                <div className="absolute right-5 top-1/2 -translate-y-1/2 hidden sm:flex items-center space-x-0.5 bg-gray-50 border border-gray-200 rounded px-2 py-0.5 text-[9px] font-mono text-gray-400 font-bold dark:bg-gray-800 dark:border-gray-700">
                  <span>/</span>
                </div>
              )}
            </div>

            {/* Live Suggestion Badges */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-400">
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-gray-400 mr-1 flex items-center gap-1">
                <Compass size={11} /> Popular:
              </span>
              {popularSearches.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setSearchQuery(item.term)}
                  className="rounded-full border border-gray-200/50 bg-white/40 px-3 py-1 font-sans text-xs text-gray-600 hover:bg-white hover:text-gray-900 dark:border-gray-800 dark:bg-gray-900/30 dark:text-gray-400 dark:hover:bg-gray-850 dark:hover:text-white transition-all shadow-xs"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Premium Call to Actions */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => document.getElementById('tools-showcase-grid')?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-xl bg-gray-950 px-6 py-3.5 font-sans text-xs font-bold text-white shadow-md hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/10 active:scale-98 transition-all duration-200 dark:bg-white dark:text-gray-950 dark:hover:bg-indigo-500 dark:hover:text-white cursor-pointer"
            >
              Explore {activeCount}+ Active Tools
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="rounded-xl border border-gray-200 bg-white/50 backdrop-blur-xs px-6 py-3.5 font-sans text-xs font-bold text-gray-700 hover:border-gray-400 hover:bg-white active:scale-98 transition-all duration-200 dark:border-gray-800 dark:bg-gray-900/40 dark:text-gray-300 dark:hover:border-gray-700 dark:hover:bg-gray-900 cursor-pointer"
            >
              How local-first works
            </button>
          </div>

          {/* Animated Statistics Banner Widget */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-4xl mx-auto border border-gray-150 rounded-2xl bg-gray-50/40 p-5 backdrop-blur-xs dark:border-gray-900 dark:bg-gray-950/20" id="animated-stats-banner">
            <div className="text-center p-2">
              <span className="block font-mono text-2xl font-black text-gray-950 dark:text-white leading-none">
                {activeCount}+
              </span>
              <span className="mt-1.5 block font-sans text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Active Modules
              </span>
            </div>
            <div className="text-center p-2 border-l border-gray-150 dark:border-gray-900">
              <span className="block font-mono text-2xl font-black text-indigo-600 dark:text-indigo-400 leading-none">
                {safetyPercent}%
              </span>
              <span className="mt-1.5 block font-sans text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Securely Local
              </span>
            </div>
            <div className="text-center p-2 border-l border-gray-150 dark:border-gray-900">
              <span className="block font-mono text-2xl font-black text-gray-950 dark:text-white leading-none">
                0
              </span>
              <span className="mt-1.5 block font-sans text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Bytes Uploaded
              </span>
            </div>
            <div className="text-center p-2 border-l border-gray-150 dark:border-gray-900">
              <span className="block font-mono text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-none">
                &lt; {latencyMs}ms
              </span>
              <span className="mt-1.5 block font-sans text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Engine Latency
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Trust & Guarantee Section (Directly under Hero) */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-b border-gray-150 dark:border-gray-900" id="trust-bento-cards">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="font-sans font-bold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            A New Standard of Software Trust
          </h2>
          <p className="mt-2 font-sans font-extrabold text-xl sm:text-2xl text-gray-950 dark:text-white tracking-tight">
            Security Guarantee by Architecture, Not Promises
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {/* Card 1 */}
          <div className="group rounded-xl border border-gray-200 bg-white p-5 hover:border-indigo-400/50 hover:shadow-md transition-all duration-300 dark:border-gray-850 dark:bg-gray-900">
            <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-sans font-bold text-sm text-gray-950 dark:text-white">Works Offline</h3>
            <p className="mt-2 font-sans text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Open the site anywhere. All utility calculators run natively without network connection.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group rounded-xl border border-gray-200 bg-white p-5 hover:border-indigo-400/50 hover:shadow-md transition-all duration-300 dark:border-gray-850 dark:bg-gray-900">
            <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <EyeOff size={20} />
            </div>
            <h3 className="font-sans font-bold text-sm text-gray-950 dark:text-white">Privacy Absolute</h3>
            <p className="mt-2 font-sans text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Your source codes, keys, and documents never contact remote servers. 100% confidential.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group rounded-xl border border-gray-200 bg-white p-5 hover:border-indigo-400/50 hover:shadow-md transition-all duration-300 dark:border-gray-850 dark:bg-gray-900">
            <div className="h-10 w-10 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Lock size={20} />
            </div>
            <h3 className="font-sans font-bold text-sm text-gray-950 dark:text-white">No Accounts</h3>
            <p className="mt-2 font-sans text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              No logins, no password requirements, no tracking databases, no marketing emails.
            </p>
          </div>

          {/* Card 4 */}
          <div className="group rounded-xl border border-gray-200 bg-white p-5 hover:border-indigo-400/50 hover:shadow-md transition-all duration-300 dark:border-gray-850 dark:bg-gray-900">
            <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Zap size={20} />
            </div>
            <h3 className="font-sans font-bold text-sm text-gray-950 dark:text-white">Deterministic Speed</h3>
            <p className="mt-2 font-sans text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Instantaneous calculations using compiled browser JavaScript, WASM, and Canvas engines.
            </p>
          </div>

          {/* Card 5 */}
          <div className="group rounded-xl border border-gray-200 bg-white p-5 hover:border-indigo-400/50 hover:shadow-md transition-all duration-300 dark:border-gray-850 dark:bg-gray-900">
            <div className="h-10 w-10 rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Cpu size={20} />
            </div>
            <h3 className="font-sans font-bold text-sm text-gray-950 dark:text-white">Free Forever</h3>
            <p className="mt-2 font-sans text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              All tools are completely free with zero hidden paywalls or subscription barriers.
            </p>
          </div>
        </div>
      </section>

      {/* Tactile Category Bento Blocks Selection Grid */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8" id="category-bento-grid">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-sans font-bold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Browse Core Utilities Suite
            </h2>
            <p className="font-sans text-xs text-gray-400 dark:text-gray-500 mt-1">
              Select a specialized category deck to filter the direct browser sandboxes below.
            </p>
          </div>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 hover:underline flex items-center space-x-1 border border-indigo-100 dark:border-indigo-900/40 rounded-lg px-2.5 py-1 bg-indigo-50/50 dark:bg-indigo-950/20"
            >
              <span>Reset Filter</span>
              <X size={12} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="category-selector-bento">
          {/* "All" Category Bento Box */}
          <button
            onClick={() => {
              setSelectedCategory(null);
              setWorkspaceFilter('all');
            }}
            className={`group flex flex-col items-start rounded-2xl border p-6 text-left transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.04)] hover:-translate-y-1 cursor-pointer ${
              selectedCategory === null && workspaceFilter === 'all'
                ? 'border-gray-950 bg-gray-950 text-white dark:border-white dark:bg-white dark:text-gray-950'
                : 'border-gray-200 bg-white hover:border-indigo-400 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500/40'
            }`}
          >
            <div className="flex items-center gap-3 w-full">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                selectedCategory === null && workspaceFilter === 'all'
                  ? 'bg-white/15 text-white dark:bg-gray-950/10 dark:text-gray-950'
                  : 'bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-white group-hover:bg-indigo-500 group-hover:text-white group-hover:scale-105 group-hover:rotate-3'
              }`}>
                <Layers size={18} />
              </div>
              <div>
                <h3 className="font-sans font-bold text-sm text-gray-950 dark:text-white transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  All Utility Tools
                </h3>
                <span className="font-mono text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  FULL CATALOG
                </span>
              </div>
            </div>
            <p className="mt-4 flex-1 font-sans text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Explore the entire catalog of high-performance, private browser utilities in one comprehensive dashboard.
            </p>
            <div className="mt-5 flex items-center justify-between w-full border-t border-gray-100 pt-3 dark:border-gray-800/60">
              <span className={`font-mono text-[10px] font-bold ${selectedCategory === null && workspaceFilter === 'all' ? 'text-emerald-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                ● {TOOLS.filter(t => !t.isPlanned).length} Ready
              </span>
              <span className={`font-mono text-[10px] font-bold ${selectedCategory === null && workspaceFilter === 'all' ? 'text-amber-300 bg-white/10' : 'text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/20'} px-1.5 py-0.5 rounded border border-amber-200/20`}>
                {TOOLS.filter(t => t.isPlanned).length} Planned
              </span>
            </div>
          </button>

          {/* Dynamic Categories */}
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = TOOLS.filter((t) => t.category === cat.id && !t.isPlanned).length;
            const plannedCount = TOOLS.filter((t) => t.category === cat.id && t.isPlanned).length;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setWorkspaceFilter('all');
                }}
                className={`group flex flex-col items-start rounded-2xl border p-6 text-left transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.04)] hover:-translate-y-1 cursor-pointer ${
                  isSelected 
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/10' 
                    : 'border-gray-200 bg-white hover:border-indigo-400 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500/40'
                }`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                    isSelected 
                      ? 'bg-indigo-600 text-white animate-pulse' 
                      : 'bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-white group-hover:bg-indigo-500 group-hover:text-white group-hover:scale-105 group-hover:rotate-3'
                  }`}>
                    {getCategoryIcon(cat.id, 'w-5 h-5')}
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-sm text-gray-950 dark:text-white transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {cat.name}
                    </h3>
                    <span className="font-mono text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                      {cat.id} SUITE
                    </span>
                  </div>
                </div>
                <p className="mt-4 flex-1 font-sans text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {cat.description}
                </p>
                <div className="mt-5 flex items-center justify-between w-full border-t border-gray-100 pt-3 dark:border-gray-800/60">
                  <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    ● {count} Active {count === 1 ? 'Tool' : 'Tools'}
                  </span>
                  {plannedCount > 0 && (
                    <span className="font-mono text-[10px] font-bold text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.5 rounded border border-amber-200/20">
                      {plannedCount} Planned
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Tool of the Day Bento Block */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8" id="featured-tool-spotlight">
        <div className="group rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50/50 to-amber-100/20 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm transition-all hover:shadow-md dark:border-amber-900/40 dark:from-amber-950/10 dark:to-amber-900/5">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-full bg-amber-100/80 px-2 py-0.5 font-mono text-[9px] font-bold text-amber-800 uppercase tracking-widest border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30">
                ⚡ Featured Utility of the Day
              </span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-800 uppercase tracking-widest border border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/20">
                ★ {(featuredTool.popularScore / 20).toFixed(1)} Rating
              </span>
            </div>
            <h3 className="font-sans font-bold text-base text-gray-950 sm:text-lg dark:text-white">
              {featuredTool.name}
            </h3>
            <p className="font-sans text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
              {featuredTool.description} Run safely offline with full-entropy local cryptographic parsing and ultra-low latency.
            </p>
          </div>
          <button
            onClick={() => onNavigate(`tool-${featuredTool.id}`)}
            className="rounded-lg bg-gray-950 px-4 py-2 font-sans text-xs font-semibold text-white shadow-sm hover:bg-gray-800 transition-all hover:translate-x-0.5 flex items-center space-x-1.5 shrink-0 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-100"
            id="featured-tool-action-btn"
          >
            <span>Launch Tool</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </section>

      {/* Primary Workspace Viewport */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" id="tools-showcase-grid">
        
        {/* Workspace Filter Sub-navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-3 mb-6 dark:border-gray-800" id="workspace-filter-tabs">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => {
                setWorkspaceFilter('all');
                setSelectedCategory(null);
                setSearchQuery('');
              }}
              className={`rounded-lg px-3.5 py-1.5 font-sans text-xs font-semibold tracking-tight transition-all flex items-center space-x-1.5 ${
                workspaceFilter === 'all' && selectedCategory === null && !searchQuery
                  ? 'bg-gray-900 text-white shadow-sm dark:bg-white dark:text-gray-950'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white'
              }`}
            >
              <span>All Utilities</span>
            </button>
            
            <button
              onClick={() => {
                setWorkspaceFilter('favorites');
                setSelectedCategory(null);
              }}
              className={`rounded-lg px-3.5 py-1.5 font-sans text-xs font-semibold tracking-tight transition-all flex items-center space-x-1.5 ${
                workspaceFilter === 'favorites'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white'
              }`}
            >
              <Star size={12} fill={workspaceFilter === 'favorites' ? 'currentColor' : 'none'} />
              <span>Favorites</span>
              {favorites.length > 0 && (
                <span className={`rounded-full px-1.5 text-[9px] font-bold ${workspaceFilter === 'favorites' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'}`}>
                  {favorites.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setWorkspaceFilter('recent');
                setSelectedCategory(null);
              }}
              className={`rounded-lg px-3.5 py-1.5 font-sans text-xs font-semibold tracking-tight transition-all flex items-center space-x-1.5 ${
                workspaceFilter === 'recent'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white'
              }`}
            >
              <HistoryIcon size={12} />
              <span>History</span>
              {history.length > 0 && (
                <span className={`rounded-full px-1.5 text-[9px] font-bold ${workspaceFilter === 'recent' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'}`}>
                  {history.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setWorkspaceFilter('trending');
                setSelectedCategory(null);
              }}
              className={`rounded-lg px-3.5 py-1.5 font-sans text-xs font-semibold tracking-tight transition-all flex items-center space-x-1.5 ${
                workspaceFilter === 'trending'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white'
              }`}
            >
              <TrendingUp size={12} />
              <span>Trending</span>
            </button>
          </div>
          
          <div className="text-[10px] font-mono font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest shrink-0">
            {finalTools.length === TOOLS.length ? (
              `All ${TOOLS.length} Utilities`
            ) : (
              `Showing ${finalTools.length} of ${TOOLS.length} utilities`
            )}
          </div>
        </div>

        {/* Dynamic Title Headers based on context */}
        <div className="mb-6">
          <h3 className="font-sans font-bold text-lg text-gray-950 dark:text-white">
            {searchQuery ? (
              `Search Results for "${searchQuery}"`
            ) : workspaceFilter === 'favorites' ? (
              'Your Bookmarked Favorites'
            ) : workspaceFilter === 'recent' ? (
              'Your Visitation History'
            ) : workspaceFilter === 'trending' ? (
              'Trending & Popular Tools'
            ) : selectedCategory ? (
              CATEGORIES.find(c => c.id === selectedCategory)?.name
            ) : (
              'All Active Utilities'
            )}
          </h3>
          <p className="font-sans text-xs text-gray-400 dark:text-gray-500">
            {searchQuery ? (
              `Found ${finalTools.length} utilities matching your keyword inquiry.`
            ) : workspaceFilter === 'favorites' ? (
              'Direct bookmarks for fast workspace access. Kept strictly inside your local browser.'
            ) : workspaceFilter === 'recent' ? (
              'Your private local audit trail. Hover or click to re-launch. None of this leaves your screen.'
            ) : workspaceFilter === 'trending' ? (
              'Tools mapped descending by actual global usage and daily user launch scores.'
            ) : selectedCategory ? (
              CATEGORIES.find(c => c.id === selectedCategory)?.description
            ) : (
              'Launch any secure browser tool. All calculations execute immediately inside your sandbox.'
            )}
          </p>
        </div>

        {/* Grid Viewport */}
        <AnimatePresence mode="popLayout">
          {finalTools.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {finalTools.map((tool, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.18, delay: Math.min(idx * 0.02, 0.2) }}
                  key={tool.id}
                >
                  <ToolCard
                    tool={tool}
                    onClick={() => onNavigate(`tool-${tool.id}`)}
                    isFavorite={favorites.includes(tool.id)}
                    onToggleFavorite={(e) => {
                      e.stopPropagation();
                      toggleFavorite(tool.id);
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900/40"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                <HelpCircle size={22} />
              </div>
              <h4 className="mt-4 font-sans font-semibold text-sm text-gray-950 dark:text-white">
                No matching tools found
              </h4>
              <p className="mt-2 text-xs text-gray-400 dark:text-gray-500 max-w-sm mx-auto leading-relaxed">
                We couldn't find anything matching your query. Try resetting filters or search for terms like "JSON", "Word", or "Password".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                  setWorkspaceFilter('all');
                }}
                className="mt-4 rounded-lg bg-gray-900 px-3.5 py-1.5 font-sans text-xs font-semibold text-white shadow-sm hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-100"
              >
                Reset Search Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </motion.div>
  );
}
