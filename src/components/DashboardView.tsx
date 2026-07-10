import React, { useState } from 'react';
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
  X
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

  // Helper mapping for category styles
  const getCategoryStyles = (id: string, isSelected: boolean) => {
    const baseColors = {
      text: {
        bg: 'bg-violet-50/60 dark:bg-violet-950/20',
        text: 'text-violet-600 dark:text-violet-400',
        border: 'border-violet-100/80 dark:border-violet-900/30',
        active: 'bg-violet-600 border-violet-600 text-white dark:bg-violet-500 dark:border-violet-500'
      },
      calculator: {
        bg: 'bg-emerald-50/60 dark:bg-emerald-950/20',
        text: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-100/80 dark:border-emerald-900/30',
        active: 'bg-emerald-600 border-emerald-600 text-white dark:bg-emerald-500 dark:border-emerald-500'
      },
      developer: {
        bg: 'bg-indigo-50/60 dark:bg-indigo-950/20',
        text: 'text-indigo-600 dark:text-indigo-400',
        border: 'border-indigo-100/80 dark:border-indigo-900/30',
        active: 'bg-indigo-600 border-indigo-600 text-white dark:bg-indigo-500 dark:border-indigo-500'
      },
      generator: {
        bg: 'bg-rose-50/60 dark:bg-rose-950/20',
        text: 'text-rose-600 dark:text-rose-400',
        border: 'border-rose-100/80 dark:border-rose-900/30',
        active: 'bg-rose-600 border-rose-600 text-white dark:bg-rose-500 dark:border-rose-500'
      },
      converter: {
        bg: 'bg-amber-50/60 dark:bg-amber-950/20',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-100/80 dark:border-amber-900/30',
        active: 'bg-amber-600 border-amber-600 text-white dark:bg-amber-500 dark:border-amber-500'
      }
    }[id] || {
      bg: 'bg-gray-50/60 dark:bg-gray-800/30',
      text: 'text-gray-600 dark:text-gray-400',
      border: 'border-gray-100 dark:border-gray-800',
      active: 'bg-gray-900 border-gray-900 text-white dark:bg-gray-100 dark:text-gray-950'
    };

    return isSelected ? baseColors.active : `${baseColors.bg} ${baseColors.text} ${baseColors.border}`;
  };

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
    { label: 'JSON Formatter', term: 'JSON' },
    { label: 'Word Counter', term: 'Word' },
    { label: 'Image Compressor', term: 'Image' },
    { label: 'PDF Merger', term: 'PDF' },
    { label: 'Secure Password', term: 'Password' }
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
      <section className="relative overflow-hidden border-b border-gray-200 bg-white py-16 md:py-24 text-center transition-all duration-300 dark:bg-gray-950 dark:border-gray-800" id="hero-banner-section">
        {/* Subtle decorative grid lines representing modern product sheets */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 font-mono text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 uppercase tracking-widest border border-emerald-100/80 dark:border-emerald-900/20"
          >
            <Sparkles size={11} className="text-emerald-500 animate-pulse" />
            100% Browser-Local Security • No Server Uploads
          </motion.span>
          
          <h1 className="mt-6 font-display font-extrabold text-3xl tracking-tight text-gray-950 sm:text-5xl leading-tight dark:text-white">
            Professional Utility Tools<br />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-rose-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-rose-400">
              Built for Speed. Privacy. Productivity.
            </span>
          </h1>
          
          <p className="mx-auto mt-4 max-w-2xl font-sans text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
            1000+ privacy-first browser utilities. No uploads. No tracking. No installation. Run all formats, calculations, and compression workflows entirely inside your browser cache with cryptographic speed.
          </p>

          {/* Premium Trust Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-gray-600 dark:text-gray-300">
            <span className="flex items-center gap-1 bg-gray-50/80 dark:bg-gray-900/60 px-3 py-1 rounded-full border border-gray-200/50 dark:border-gray-850">
              <span className="text-emerald-500 font-bold">✔</span> Offline
            </span>
            <span className="flex items-center gap-1 bg-gray-50/80 dark:bg-gray-900/60 px-3 py-1 rounded-full border border-gray-200/50 dark:border-gray-850">
              <span className="text-emerald-500 font-bold">✔</span> Secure
            </span>
            <span className="flex items-center gap-1 bg-gray-50/80 dark:bg-gray-900/60 px-3 py-1 rounded-full border border-gray-200/50 dark:border-gray-850">
              <span className="text-emerald-500 font-bold">✔</span> No Login
            </span>
            <span className="flex items-center gap-1 bg-gray-50/80 dark:bg-gray-900/60 px-3 py-1 rounded-full border border-gray-200/50 dark:border-gray-850">
              <span className="text-emerald-500 font-bold">✔</span> Free
            </span>
          </div>

          {/* Premium Call to Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => document.getElementById('tools-showcase-grid')?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-xl bg-gray-950 px-6 py-3 font-sans text-sm font-semibold text-white shadow-lg hover:bg-indigo-600 hover:shadow-indigo-500/10 active:scale-95 transition-all duration-200 dark:bg-white dark:text-gray-950 dark:hover:bg-indigo-500 dark:hover:text-white cursor-pointer"
            >
              Start Using Tools
            </button>
            <button
              onClick={() => document.getElementById('category-bento-grid')?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-xl border border-gray-200 bg-white/50 backdrop-blur px-6 py-3 font-sans text-sm font-semibold text-gray-800 hover:border-gray-400 hover:bg-white active:scale-95 transition-all duration-200 dark:border-gray-800 dark:bg-gray-900/40 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-900 cursor-pointer"
            >
              Explore Categories
            </button>
          </div>

          {/* Majestic Hero Central Search Hub */}
          <div className="mx-auto mt-10 max-w-xl relative" id="hero-search-hub">
            <div className="group relative rounded-xl border border-gray-200 bg-white/70 shadow-[0_2px_12px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all duration-200 hover:border-gray-400 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:border-gray-800 dark:bg-gray-900/60 dark:hover:border-gray-700">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="What tool do you need? (e.g. JSON, Word, Compressor)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border-none bg-transparent py-3.5 pl-12 pr-10 font-sans text-sm md:text-base text-gray-900 placeholder-gray-400 outline-none focus:ring-0 dark:text-white"
                id="central-search-input"
              />
              {searchQuery ? (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-950 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X size={14} />
                </button>
              ) : (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center space-x-0.5 bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 text-[9px] font-mono text-gray-400 font-bold dark:bg-gray-800 dark:border-gray-700">
                  <span>/</span>
                </div>
              )}
            </div>

            {/* Live Suggestion Badges */}
            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 text-xs text-gray-400">
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-gray-400 mr-1">Popular:</span>
              {popularSearches.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setSearchQuery(item.term)}
                  className="rounded-full border border-gray-200/60 bg-gray-50/50 px-2.5 py-1 font-medium hover:bg-gray-100 hover:text-gray-900 transition-all dark:border-gray-800 dark:bg-gray-900/40 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  {item.label}
                </button>
              ))}
            </div>
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
            const styleString = getCategoryStyles(cat.id, isSelected);

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
                      ? 'bg-indigo-600 text-white' 
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

