import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  History, 
  Trash2, 
  Bookmark, 
  Layers, 
  Search, 
  Calendar, 
  ArrowLeft,
  AlertCircle,
  TrendingUp,
  Cpu,
  Clock
} from 'lucide-react';
import { TOOLS, CATEGORIES } from '../data/tools';
import { useToast } from './Toast';

interface HistoryCenterViewProps {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  history: { toolId: string; timestamp: number }[];
  setHistory: (history: { toolId: string; timestamp: number }[]) => void;
  onNavigate: (view: string) => void;
  onBack: () => void;
}

export default function HistoryCenterView({
  favorites,
  toggleFavorite,
  history,
  setHistory,
  onNavigate,
  onBack
}: HistoryCenterViewProps) {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to permanently clear your private local visitation history?')) {
      setHistory([]);
      localStorage.removeItem('smartutils_history');
      showToast('Visitation history cleared successfully', 'success');
    }
  };

  const removeHistoryItem = (timestamp: number) => {
    const updated = history.filter(item => item.timestamp !== timestamp);
    setHistory(updated);
    localStorage.setItem('smartutils_history', JSON.stringify(updated));
    showToast('Removed item from history log', 'info');
  };

  // Helper to format timestamp
  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return 'Just now';
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(diff / 86400000);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  // Filter bookmarked tools
  const bookmarkedTools = TOOLS.filter(t => favorites.includes(t.id));

  // Compute stats
  const totalLaunches = history.length;
  const bookmarksCount = favorites.length;
  
  // Find most active category
  const categoryCounts: Record<string, number> = {};
  history.forEach(h => {
    const tool = TOOLS.find(t => t.id === h.toolId);
    if (tool) {
      categoryCounts[tool.category] = (categoryCounts[tool.category] || 0) + 1;
    }
  });
  let mostActiveCategory = 'None';
  let maxCount = 0;
  Object.entries(categoryCounts).forEach(([catId, count]) => {
    if (count > maxCount) {
      maxCount = count;
      const catObj = CATEGORIES.find(c => c.id === catId);
      mostActiveCategory = catObj ? catObj.name : catId;
    }
  });

  // Filter history list by search query
  const filteredHistory = history.filter(item => {
    const tool = TOOLS.find(t => t.id === item.toolId);
    if (!tool) return false;
    const query = searchQuery.toLowerCase();
    return tool.name.toLowerCase().includes(query) || tool.category.toLowerCase().includes(query);
  });

  // Filter bookmarks by search query
  const filteredBookmarks = bookmarkedTools.filter(tool => {
    const query = searchQuery.toLowerCase();
    return tool.name.toLowerCase().includes(query) || tool.category.toLowerCase().includes(query);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans"
      id="history-center-view-container"
    >
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between border-b border-gray-150 pb-5 mb-8 dark:border-gray-900">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-850 cursor-pointer transition-all"
        >
          <ArrowLeft size={14} />
          <span>Dashboard</span>
        </button>
        <div className="text-right">
          <h1 className="text-xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-2xl">
            Private History &amp; Bookmarks
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Persisted 100% inside your local sandbox. No data is synchronized to any server.
          </p>
        </div>
      </div>

      {/* Bento Statistics Deck */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8" id="history-bento-metrics">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-850 dark:bg-gray-900">
          <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
            <Heart size={16} fill="currentColor" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gray-400">Active Bookmarks</span>
          </div>
          <span className="mt-3 block font-mono text-3xl font-black text-gray-950 dark:text-white">
            {bookmarksCount}
          </span>
          <p className="mt-1 font-sans text-xs text-gray-500 dark:text-gray-400">Saved shortcuts for immediate dashboard boot-ups.</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-850 dark:bg-gray-900">
          <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400">
            <Clock size={16} />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Launches</span>
          </div>
          <span className="mt-3 block font-mono text-3xl font-black text-gray-950 dark:text-white">
            {totalLaunches}
          </span>
          <p className="mt-1 font-sans text-xs text-gray-500 dark:text-gray-400">Historical calculation sequences parsed locally.</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-850 dark:bg-gray-900">
          <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
            <Layers size={16} />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gray-400">Primary Core Focus</span>
          </div>
          <span className="mt-3 block font-sans text-lg font-bold text-gray-950 dark:text-white truncate" title={mostActiveCategory}>
            {mostActiveCategory}
          </span>
          <p className="mt-3.5 font-sans text-xs text-gray-500 dark:text-gray-400">The tool category deck utilized most on this browser.</p>
        </div>
      </div>

      {/* Universal Workspace Filters & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-150 pb-4 dark:border-gray-900">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search your history and bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2 font-sans text-xs md:text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
          />
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50/50 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-950/40 cursor-pointer transition-all self-end md:self-auto"
          >
            <Trash2 size={13} />
            <span>Clear Private History</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bookmarks Column */}
        <div>
          <div className="flex items-center gap-2 mb-4 border-b border-gray-150 pb-2 dark:border-gray-900">
            <Heart size={15} className="text-rose-500 fill-rose-500" />
            <h2 className="font-sans font-bold text-sm text-gray-950 dark:text-white">Your Bookmarks ({filteredBookmarks.length})</h2>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredBookmarks.length > 0 ? (
              <div className="space-y-3.5" id="history-bookmarks-grid">
                {filteredBookmarks.map((tool) => (
                  <motion.div
                    layout
                    key={`bookmark-${tool.id}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center justify-between p-4 border border-gray-200 bg-white hover:border-indigo-400 rounded-xl dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-900/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 font-bold">
                        {tool.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-sans font-bold text-xs text-gray-900 dark:text-white">
                          {tool.name}
                        </h4>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          {tool.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => toggleFavorite(tool.id)}
                        className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer transition-colors"
                        title="Remove bookmark"
                      >
                        <Heart size={14} fill="currentColor" />
                      </button>
                      <button
                        onClick={() => onNavigate(`tool-${tool.id}`)}
                        className="rounded-lg bg-gray-950 hover:bg-indigo-600 px-3 py-1.5 font-mono text-[10px] font-semibold text-white dark:bg-white dark:text-gray-950 dark:hover:bg-indigo-500 dark:hover:text-white cursor-pointer transition-colors"
                      >
                        Launch
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center bg-gray-50/20 dark:border-gray-800 dark:bg-gray-900/20">
                <Bookmark size={20} className="mx-auto text-gray-300 dark:text-gray-700" />
                <h4 className="mt-3 font-sans font-bold text-xs text-gray-500 dark:text-gray-400">No bookmarks saved</h4>
                <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500 max-w-xs mx-auto leading-normal">
                  Tap the heart icon on any tool card inside the dashboard to save your favorite helpers here.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Private History Log Column */}
        <div>
          <div className="flex items-center gap-2 mb-4 border-b border-gray-150 pb-2 dark:border-gray-900">
            <History size={15} className="text-indigo-500" />
            <h2 className="font-sans font-bold text-sm text-gray-950 dark:text-white">Visitation History ({filteredHistory.length})</h2>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredHistory.length > 0 ? (
              <div className="relative border-l-2 border-indigo-100/60 dark:border-indigo-950/40 pl-4 ml-2.5 space-y-4" id="history-timeline-list">
                {filteredHistory.map((item, idx) => {
                  const tool = TOOLS.find(t => t.id === item.toolId);
                  if (!tool) return null;

                  return (
                    <motion.div
                      layout
                      key={`hist-${item.timestamp}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="relative group"
                    >
                      {/* Timeline Dot Indicator */}
                      <span className="absolute -left-6 top-3 h-2.5 w-2.5 rounded-full border border-indigo-200 bg-white dark:border-indigo-850 dark:bg-gray-950 group-hover:bg-indigo-500 transition-colors" />

                      <div className="flex items-center justify-between p-3.5 border border-gray-150 bg-white/70 hover:border-gray-300 rounded-xl dark:border-gray-850 dark:bg-gray-900/60 dark:hover:border-gray-800 transition-all shadow-xs">
                        <div className="flex items-center gap-3">
                          <div>
                            <h4 className="font-sans font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5">
                              <span>{tool.name}</span>
                              <span className="inline-flex items-center rounded-sm bg-gray-100 px-1 py-0.2 text-[9px] font-mono text-gray-400 dark:bg-gray-800">
                                {tool.category}
                              </span>
                            </h4>
                            <span className="font-mono text-[9px] text-gray-400 flex items-center gap-1 mt-1">
                              <Clock size={10} /> {formatTimeAgo(item.timestamp)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => removeHistoryItem(item.timestamp)}
                            className="rounded-lg p-2 text-gray-400 hover:text-rose-500 hover:bg-gray-50 dark:hover:bg-gray-850/50 cursor-pointer transition-colors"
                            title="Remove from history log"
                          >
                            <Trash2 size={13} />
                          </button>
                          <button
                            onClick={() => onNavigate(`tool-${tool.id}`)}
                            className="rounded-lg border border-gray-200 hover:border-indigo-400 hover:text-indigo-600 dark:border-gray-800 dark:hover:border-indigo-500 dark:hover:text-indigo-400 bg-white dark:bg-gray-900 px-2.5 py-1 font-sans text-[10px] font-semibold text-gray-700 dark:text-gray-300 cursor-pointer transition-colors"
                          >
                            Launch &rarr;
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center bg-gray-50/20 dark:border-gray-800 dark:bg-gray-900/20">
                <History size={20} className="mx-auto text-gray-300 dark:text-gray-700" />
                <h4 className="mt-3 font-sans font-bold text-xs text-gray-500 dark:text-gray-400">No visitation history</h4>
                <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500 max-w-xs mx-auto leading-normal">
                  Launch any local utility module from the home dashboard to generate a secure local audit trail.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
