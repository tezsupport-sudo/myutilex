import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, X, Terminal, FolderKanban, HelpCircle, Laptop, RotateCcw, ShieldAlert, Palette, Heart } from 'lucide-react';
import { TOOLS, CATEGORIES } from '../data/tools';
import { useToast } from './Toast';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
  themeMode: 'light' | 'dark';
  setThemeMode: (theme: 'light' | 'dark') => void;
  densityMode: 'standard' | 'compact';
  setDensityMode: (density: 'standard' | 'compact') => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onNavigate,
  themeMode,
  setThemeMode,
  densityMode,
  setDensityMode
}: CommandPaletteProps) {
  const { showToast } = useToast();
  const [commandQuery, setCommandQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setCommandQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const toggleTheme = (mode: 'light' | 'dark') => {
    setThemeMode(mode);
    localStorage.setItem('smartutils_theme', mode);
    showToast(`Switched system design style to ${mode.toUpperCase()} mode!`, 'success');
  };

  const clearWorkspace = () => {
    localStorage.removeItem('smartutils_history');
    localStorage.removeItem('smartutils_recent_searches');
    showToast('Cleaned entire workspace and local history stack!', 'success');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  // Commands lookup table
  const COMMANDS = [
    { id: 'theme-dark', label: 'Theme: Switch to Dark Mode', syntax: '>theme dark', desc: 'Sets the visual theme of the platform to Dark', action: () => toggleTheme('dark') },
    { id: 'theme-light', label: 'Theme: Switch to Light Mode', syntax: '>theme light', desc: 'Sets the visual theme of the platform to Light', action: () => toggleTheme('light') },
    { id: 'clear-history', label: 'System: Clear All Workspace History', syntax: '>clear history', desc: 'Resets history logs and clear recent query items', action: clearWorkspace },
    { id: 'nav-design', label: 'Navigate: Open Design System Showcase', syntax: '>design-system', desc: 'Opens interactive visual tokens and specifications page', action: () => onNavigate('design-system') },
    { id: 'nav-review', label: 'Navigate: Open Product Review Board', syntax: '>review board', desc: 'Reviews developer feedback on platform features', action: () => onNavigate('review') },
    { id: 'nav-privacy', label: 'Navigate: Open Privacy Promise', syntax: '>privacy', desc: 'Opens local security policies and data safety commitment', action: () => onNavigate('privacy-policy') },
    { id: 'nav-home', label: 'Navigate: Go to Dashboard Home', syntax: '>home', desc: 'Returns to the main utilities workspace dashboard', action: () => onNavigate('home') },
  ];

  // Parse prefixes
  const queryTrim = commandQuery.trim();
  const isCommandMode = queryTrim.startsWith('>');
  const isCategoryMode = queryTrim.startsWith(':');
  const isToolMode = queryTrim.startsWith('@');
  const isHelpMode = queryTrim.startsWith('?');

  let results: any[] = [];
  let modeTitle = 'All Matching Utilities';

  if (isCommandMode) {
    const term = queryTrim.substring(1).toLowerCase().trim();
    results = COMMANDS.filter(cmd => 
      cmd.syntax.toLowerCase().includes(term) || 
      cmd.label.toLowerCase().includes(term) ||
      cmd.desc.toLowerCase().includes(term)
    ).map(cmd => ({ ...cmd, type: 'command' }));
    modeTitle = 'Matching Executable Commands (>)';
  } else if (isCategoryMode) {
    const term = queryTrim.substring(1).toLowerCase().trim();
    results = CATEGORIES.filter(cat => 
      cat.name.toLowerCase().includes(term) || 
      cat.id.toLowerCase().includes(term) ||
      cat.description.toLowerCase().includes(term)
    ).map(cat => ({ ...cat, type: 'category' }));
    modeTitle = 'Matching Categories (:)';
  } else if (isToolMode) {
    const term = queryTrim.substring(1).toLowerCase().trim();
    results = TOOLS.filter(tool => 
      tool.name.toLowerCase().includes(term) || 
      tool.description.toLowerCase().includes(term) ||
      tool.globalKeywords.some(kw => kw.toLowerCase().includes(term))
    ).map(tool => ({ ...tool, type: 'tool' }));
    modeTitle = 'Matching Tools Scoped Search (@)';
  } else if (isHelpMode) {
    // Show static instruction guidelines
    results = [
      { id: 'help-cmd', label: 'Execute Action Commands', syntax: '>...', desc: 'Type > followed by theme dark, theme light, or design-system' },
      { id: 'help-cat', label: 'Filter Categories', syntax: ':...', desc: 'Type : followed by category keywords (e.g. :text, :dev)' },
      { id: 'help-tool', label: 'Scoped Tools Search', syntax: '@...', desc: 'Type @ followed by specific tool names (e.g. @json)' },
    ].map(h => ({ ...h, type: 'help-instruction' }));
    modeTitle = 'Command Center Operators Guide (?)';
  } else {
    // Default search across tools and matches
    results = TOOLS.filter(t => 
      t.name.toLowerCase().includes(queryTrim.toLowerCase()) || 
      t.description.toLowerCase().includes(queryTrim.toLowerCase()) ||
      t.globalKeywords.some(kw => kw.toLowerCase().includes(queryTrim.toLowerCase()))
    ).map(t => ({ ...t, type: 'tool' }));
    modeTitle = queryTrim ? `Search Results for "${queryTrim}"` : 'All Available Sandboxed Utilities';
  }

  // Keyboard navigation within list results
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      executeItem(results[selectedIndex]);
    }
  };

  const executeItem = (item: any) => {
    if (!item) return;
    
    if (item.type === 'command') {
      item.action();
      onClose();
    } else if (item.type === 'category') {
      window.dispatchEvent(new CustomEvent('smartutils-set-category', { detail: item.id }));
      onNavigate('home');
      onClose();
      showToast(`Selected category: ${item.name}`, 'info');
    } else if (item.type === 'tool') {
      onNavigate(`tool-${item.id}`);
      onClose();
    } else if (item.type === 'help-instruction') {
      setCommandQuery(item.syntax.substring(0, 1));
    }
  };

  // Autodetect natural phrases to guide users to prefix commands
  const getLocalNLPAdvice = () => {
    if (!commandQuery) return null;
    const lower = commandQuery.toLowerCase();
    if (lower.includes('dark') || lower.includes('light') || lower.includes('theme') || lower.includes('color')) {
      return { msg: 'Protip: Type ">theme dark" or ">theme light" directly in the launcher to trigger dark/light theme!', action: () => setCommandQuery('>theme ') };
    }
    if (lower.includes('category') || lower.includes('filter') || lower.includes('group')) {
      return { msg: 'Protip: Type ":" to filter tools by category instantly!', action: () => setCommandQuery(':') };
    }
    if (lower.includes('how') || lower.includes('help') || lower.includes('guide')) {
      return { msg: 'Protip: Type "?" to display our command operators helper!', action: () => setCommandQuery('?') };
    }
    return null;
  };

  const nlpAdvice = getLocalNLPAdvice();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4" onKeyDown={handleKeyDown}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Palette Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', damping: 26, stiffness: 350 }}
            className="relative w-full max-w-xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl ring-1 ring-black/5 dark:bg-gray-900 dark:border-gray-800"
          >
            {/* Header Input Area */}
            <div className="relative border-b border-gray-150 p-4 dark:border-gray-800">
              <Search className="absolute left-4.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type '>', ':', '@', or '?' to query commands, categories, tools..."
                value={commandQuery}
                onChange={(e) => {
                  setCommandQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="w-full pl-10 pr-12 py-2 text-sm font-sans text-gray-950 placeholder-gray-400 border-0 focus:outline-none focus:ring-0 bg-transparent dark:text-white dark:placeholder-gray-500"
                id="command-palette-search-input"
              />
              <kbd className="absolute right-4.5 top-1/2 -translate-y-1/2 font-mono text-[10px] font-bold text-gray-400 bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded dark:bg-gray-800 dark:border-gray-700">
                ESC
              </kbd>
            </div>

            {/* Suggestions / List View */}
            <div className="max-h-[360px] overflow-y-auto p-2 space-y-2">
              
              {/* Intelligent NLP Advice Banner */}
              {nlpAdvice && (
                <div 
                  onClick={nlpAdvice.action}
                  className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-2.5 mx-1 cursor-pointer hover:bg-indigo-50 transition-all dark:bg-indigo-950/20 dark:border-indigo-900/40"
                >
                  <div className="flex items-center space-x-1.5 text-xs text-indigo-700 font-bold mb-0.5 dark:text-indigo-400">
                    <Sparkles size={13} className="text-indigo-500 animate-pulse" />
                    <span>Command advice detected</span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-normal">
                    {nlpAdvice.msg}
                  </p>
                </div>
              )}

              {/* List items matching current prefix/query */}
              <div>
                <span className="px-3 py-1 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block mb-1">
                  {modeTitle} ({results.length})
                </span>
                
                {results.length === 0 ? (
                  <div className="text-center py-6 text-xs text-gray-400 dark:text-gray-500">
                    No executable matches found. Try typing <span className="font-mono bg-gray-50 dark:bg-gray-800 px-1 py-0.5 rounded">?</span> for help.
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {results.map((item, idx) => {
                      const isSel = idx === selectedIndex;
                      return (
                        <button
                          key={item.id}
                          onClick={() => executeItem(item)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left text-xs font-semibold transition-colors group cursor-pointer ${
                            isSel 
                              ? 'bg-indigo-50/70 text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-200' 
                              : 'hover:bg-gray-50 dark:hover:bg-gray-800/40 text-gray-800 dark:text-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`flex h-6 w-6 items-center justify-center rounded font-mono text-[10px] font-bold ${
                              isSel 
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-400' 
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                            }`}>
                              {item.type === 'command' && <Terminal size={12} />}
                              {item.type === 'category' && <FolderKanban size={12} />}
                              {item.type === 'help-instruction' && <HelpCircle size={12} />}
                              {item.type === 'tool' && item.name.substring(0, 2)}
                            </div>
                            <div>
                              <span className="text-gray-950 dark:text-white block">{item.name || item.label || item.syntax}</span>
                              <span className="text-[10px] text-gray-400 font-normal block truncate max-w-sm dark:text-gray-500">{item.description || item.desc}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1.5 shrink-0">
                            {item.syntax && (
                              <span className="font-mono text-[9px] text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded dark:bg-indigo-950/40 dark:text-indigo-400">
                                {item.syntax}
                              </span>
                            )}
                            {item.offlineReady && (
                              <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[8px] font-mono text-emerald-800 uppercase tracking-widest border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400">
                                Offline
                              </span>
                            )}
                            {isSel && (
                              <span className="font-mono text-[9px] text-gray-400 font-bold">
                                ENTER
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Operators Help quick bar if query is empty */}
              {!commandQuery && (
                <div className="border-t border-gray-150 dark:border-gray-800 pt-3 mt-3">
                  <span className="px-3 py-1 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
                    Command Operators Quickstart
                  </span>
                  <div className="grid grid-cols-2 gap-2 p-1">
                    <button 
                      onClick={() => setCommandQuery('>')}
                      className="flex items-center space-x-2 text-left p-2 rounded-lg bg-gray-50 hover:bg-indigo-50/30 transition-all dark:bg-gray-800/40 dark:hover:bg-indigo-950/20 cursor-pointer text-xs"
                    >
                      <span className="font-mono text-xs font-black text-indigo-600 dark:text-indigo-400">&gt;</span>
                      <span className="text-gray-500 font-sans">Run commands</span>
                    </button>
                    <button 
                      onClick={() => setCommandQuery(':')}
                      className="flex items-center space-x-2 text-left p-2 rounded-lg bg-gray-50 hover:bg-indigo-50/30 transition-all dark:bg-gray-800/40 dark:hover:bg-indigo-950/20 cursor-pointer text-xs"
                    >
                      <span className="font-mono text-xs font-black text-indigo-600 dark:text-indigo-400">:</span>
                      <span className="text-gray-500 font-sans">Filter categories</span>
                    </button>
                    <button 
                      onClick={() => setCommandQuery('@')}
                      className="flex items-center space-x-2 text-left p-2 rounded-lg bg-gray-50 hover:bg-indigo-50/30 transition-all dark:bg-gray-800/40 dark:hover:bg-indigo-950/20 cursor-pointer text-xs"
                    >
                      <span className="font-mono text-xs font-black text-indigo-600 dark:text-indigo-400">@</span>
                      <span className="text-gray-500 font-sans">Scoped tools</span>
                    </button>
                    <button 
                      onClick={() => setCommandQuery('?')}
                      className="flex items-center space-x-2 text-left p-2 rounded-lg bg-gray-50 hover:bg-indigo-50/30 transition-all dark:bg-gray-800/40 dark:hover:bg-indigo-950/20 cursor-pointer text-xs"
                    >
                      <span className="font-mono text-xs font-black text-indigo-600 dark:text-indigo-400">?</span>
                      <span className="text-gray-500 font-sans">Help and guidelines</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Palette Footer Help Area */}
            <div className="border-t border-gray-150 bg-gray-50 px-4 py-2.5 flex items-center justify-between text-[10px] font-mono text-gray-400 dark:bg-gray-950/40 dark:border-gray-800">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <kbd className="bg-white px-1 border border-gray-200 rounded shadow-sm text-[9px] dark:bg-gray-800 dark:border-gray-700">↑↓</kbd>
                  <span>to navigate</span>
                </span>
                <span className="flex items-center space-x-1">
                  <kbd className="bg-white px-1 border border-gray-200 rounded shadow-sm text-[9px] dark:bg-gray-800 dark:border-gray-700">Enter</kbd>
                  <span>to run</span>
                </span>
              </div>
              <span>ESC to close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

