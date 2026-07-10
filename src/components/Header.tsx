import { useState, useEffect } from 'react';
import { 
  Search, 
  Heart, 
  History, 
  Sparkles, 
  X, 
  Terminal, 
  ArrowRight, 
  ArrowLeft, 
  Settings, 
  Command, 
  HelpCircle, 
  Sun, 
  Moon, 
  Eye, 
  Keyboard 
} from 'lucide-react';
import { TOOLS } from '../data/tools';
import { ToolMetadata } from '../types';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  themeMode: 'light' | 'dark';
  setThemeMode: (theme: 'light' | 'dark') => void;
  densityMode: 'standard' | 'compact';
  setDensityMode: (density: 'standard' | 'compact') => void;
  fontSizeMode: 'sm' | 'base' | 'lg';
  setFontSizeMode: (size: 'sm' | 'base' | 'lg') => void;
  openCommandPalette: () => void;
  openShortcutHelp: () => void;
}

export default function Header({ 
  currentView, 
  onNavigate, 
  favorites, 
  toggleFavorite,
  themeMode,
  setThemeMode,
  densityMode,
  setDensityMode,
  fontSizeMode,
  setFontSizeMode,
  openCommandPalette,
  openShortcutHelp
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [history, setHistory] = useState<{ toolId: string; timestamp: number }[]>([]);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);
  const [showFavoritesDropdown, setShowFavoritesDropdown] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('smartutils_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing history:', e);
      }
    }
  }, [currentView]);

  const filteredTools = TOOLS.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.globalKeywords.some((kw) => kw.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelectTool = (id: string) => {
    onNavigate(`tool-${id}`);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  // Dedicated Mobile Full-Width Search Mode
  if (isMobileSearchOpen) {
    return (
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4">
          <button 
            onClick={() => {
              setIsMobileSearchOpen(false);
              setSearchQuery('');
            }}
            className="mr-3 p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100/70 active:bg-gray-100 transition-colors"
            aria-label="Close search"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search tools... (e.g., JSON, age, word)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2 pl-10 pr-9 font-sans text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-950 focus:bg-white focus:ring-1 focus:ring-gray-950"
              id="mobile-search-input-field"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-950 p-1 rounded-full hover:bg-gray-100"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
        
        {/* Live Search Overlay Results for Mobile */}
        {searchQuery && (
          <div className="absolute top-16 left-0 right-0 border-b border-gray-100 bg-white p-3 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto z-50" id="mobile-search-results">
            {filteredTools.length > 0 ? (
              <div className="space-y-1">
                <div className="px-2.5 py-1 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">Matching Utilities</div>
                {filteredTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      handleSelectTool(tool.id);
                      setIsMobileSearchOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-md px-2.5 py-2.5 text-left text-sm hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-gray-950">{tool.name}</span>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{tool.description}</p>
                    </div>
                    <ArrowRight size={14} className="text-gray-400" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-3 py-6 text-center text-sm text-gray-400">No tools found matching your request</div>
            )}
          </div>
        )}
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-850 dark:bg-gray-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex cursor-pointer items-center space-x-2.5 transition-opacity hover:opacity-90"
          id="header-brand-logo"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-950 shadow-sm">
            <Terminal size={18} />
          </div>
          <div>
            <span className="font-sans font-semibold text-gray-950 dark:text-white tracking-tight block">Utility Hub</span>
            <span className="font-mono text-[10px] text-gray-400 block -mt-1 uppercase tracking-widest font-medium">Worldwide Platform</span>
          </div>
        </div>

        {/* Dynamic Global Search Panel (Desktop) */}
        <div className="relative flex-1 max-w-md mx-6 hidden md:block" id="global-search-container">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tools... (e.g., JSON, age, word)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-1.5 pl-10 pr-4 font-sans text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-gray-900 focus:bg-white focus:ring-1 focus:ring-gray-950 dark:border-gray-800 dark:bg-gray-900/40 dark:text-white dark:focus:border-gray-700 dark:focus:bg-gray-900 dark:focus:ring-gray-800"
              id="search-input-field"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Quick Search Dropdown Result Frame (Desktop) */}
          {isSearchFocused && searchQuery && (
            <div className="absolute top-full left-0 mt-1.5 w-full rounded-lg border border-gray-200 bg-white p-2 shadow-lg ring-1 ring-black/5 dark:bg-gray-900 dark:border-gray-800" id="search-dropdown">
              {filteredTools.length > 0 ? (
                <div className="space-y-0.5">
                  <div className="px-2.5 py-1 text-[11px] font-mono font-medium text-gray-400 uppercase tracking-wider">Matching Utilities</div>
                  {filteredTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => handleSelectTool(tool.id)}
                      className="flex group w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-850 transition-colors"
                    >
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">{tool.name}</span>
                        <p className="text-xs text-gray-400 line-clamp-1">{tool.description}</p>
                      </div>
                      <ArrowRight size={14} className="text-gray-300 transition-transform group-hover:translate-x-0.5 dark:text-gray-500" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-4 text-center text-sm text-gray-400">No tools found matching your request</div>
              )}
            </div>
          )}
        </div>

        {/* Global Toolbar Action Panels */}
        <div className="flex items-center space-x-2 sm:space-x-3" id="header-toolbar-actions">
          
          {/* Mobile Search Button */}
          <button
            onClick={() => setIsMobileSearchOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100/80 md:hidden transition-colors"
            id="mobile-search-trigger"
            aria-label="Search tools"
          >
            <Search size={18} />
          </button>

          {/* Favorites Popover Button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowFavoritesDropdown(!showFavoritesDropdown);
                setShowHistoryDropdown(false);
              }}
              className={`flex items-center space-x-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-sm font-medium transition-all ${
                favorites.length > 0 ? 'text-rose-600 bg-rose-50 hover:bg-rose-100/80' : 'text-gray-600 hover:bg-gray-50'
              }`}
              id="favorites-toolbar-btn"
            >
              <Heart size={16} fill={favorites.length > 0 ? 'currentColor' : 'none'} />
              <span className="hidden sm:inline">Favorites</span>
              {favorites.length > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
                  {favorites.length}
                </span>
              )}
            </button>

            {showFavoritesDropdown && (
              <div className="absolute right-0 mt-2 w-72 rounded-lg border border-gray-100 bg-white p-2 shadow-xl ring-1 ring-black/5 z-50">
                <div className="px-2.5 py-1.5 text-[11px] font-mono font-medium text-gray-400 uppercase tracking-wider border-b border-gray-50">Saved Shortcuts</div>
                {favorites.length > 0 ? (
                  <div className="mt-1 space-y-0.5 max-h-60 overflow-y-auto">
                    {favorites.map((favId) => {
                      const t = TOOLS.find((tool) => tool.id === favId);
                      if (!t) return null;
                      return (
                        <div key={favId} className="flex items-center justify-between rounded-md px-2.5 py-1.5 hover:bg-gray-50">
                          <button
                            onClick={() => {
                              onNavigate(`tool-${favId}`);
                              setShowFavoritesDropdown(false);
                            }}
                            className="text-left text-xs font-medium text-gray-900 hover:underline truncate flex-1 pr-2"
                          >
                            {t.name}
                          </button>
                          <button 
                            onClick={() => toggleFavorite(favId)} 
                            className="text-rose-400 hover:text-rose-600 p-1 hover:bg-rose-50 rounded"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-3 py-4 text-center text-xs text-gray-400">Click the heart icon on any tool layout page to bookmark.</div>
                )}
              </div>
            )}
          </div>

          {/* User History Tracker */}
          <div className="relative">
            <button
              onClick={() => {
                setShowHistoryDropdown(!showHistoryDropdown);
                setShowFavoritesDropdown(false);
              }}
              className="flex items-center space-x-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
              id="history-toolbar-btn"
            >
              <History size={16} />
              <span className="hidden sm:inline">Recent</span>
              {history.length > 0 && (
                <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>

            {showHistoryDropdown && (
              <div className="absolute right-0 mt-2 w-72 rounded-lg border border-gray-100 bg-white p-2 shadow-xl ring-1 ring-black/5 z-50">
                <div className="px-2.5 py-1.5 text-[11px] font-mono font-medium text-gray-400 uppercase tracking-wider border-b border-gray-50">Recently Visited</div>
                {history.length > 0 ? (
                  <div className="mt-1 space-y-0.5 max-h-60 overflow-y-auto">
                    {history.slice(0, 8).map((hist, idx) => {
                      const t = TOOLS.find((tool) => tool.id === hist.toolId);
                      if (!t) return null;
                      return (
                        <button
                          key={`${hist.toolId}-${idx}`}
                          onClick={() => {
                            onNavigate(`tool-${hist.toolId}`);
                            setShowHistoryDropdown(false);
                          }}
                          className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-800 truncate pr-2">{t.name}</span>
                          <span className="text-[10px] font-mono text-gray-400 shrink-0">
                            {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-3 py-4 text-center text-xs text-gray-400">Your tool visitation history is clean and empty.</div>
                )}
              </div>
            )}
          </div>

          {/* Workspace Settings (OS Options) */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSettingsDropdown(!showSettingsDropdown);
                setShowHistoryDropdown(false);
                setShowFavoritesDropdown(false);
              }}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all ${
                showSettingsDropdown 
                  ? 'border-gray-900 bg-gray-50 text-gray-900 shadow-sm' 
                  : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300'
              }`}
              id="workspace-settings-btn"
              title="Workspace Preferences"
            >
              <Settings size={16} className={showSettingsDropdown ? 'animate-spin' : ''} />
            </button>

            {showSettingsDropdown && (
              <div className="absolute right-0 mt-2 w-72 rounded-lg border border-gray-200 bg-white p-3.5 shadow-xl ring-1 ring-black/5 z-50 animate-fadeIn text-left">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                  <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest">Workspace Preferences</span>
                  <span className="rounded bg-gray-100 px-1 py-0.5 text-[8px] font-mono text-gray-500 uppercase tracking-wider font-semibold">OS v1.4</span>
                </div>
                
                <div className="space-y-4">
                  {/* Theme Mode Option */}
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5 font-sans">Visual Theme</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => {
                          setThemeMode('light');
                          localStorage.setItem('smartutils_theme', 'light');
                        }}
                        className={`flex items-center justify-center space-x-1 py-1.5 px-2 rounded border text-xs font-semibold transition-all ${
                          themeMode === 'light'
                            ? 'bg-gray-900 border-gray-900 text-white shadow-sm'
                            : 'border-gray-200 bg-gray-50/50 text-gray-600 hover:bg-gray-100/70 hover:text-gray-900'
                        }`}
                      >
                        <Sun size={12} />
                        <span>Light</span>
                      </button>
                      <button
                        onClick={() => {
                          setThemeMode('dark');
                          localStorage.setItem('smartutils_theme', 'dark');
                        }}
                        className={`flex items-center justify-center space-x-1 py-1.5 px-2 rounded border text-xs font-semibold transition-all ${
                          themeMode === 'dark'
                            ? 'bg-gray-900 border-gray-900 text-white shadow-sm'
                            : 'border-gray-200 bg-gray-50/50 text-gray-600 hover:bg-gray-100/70 hover:text-gray-900'
                        }`}
                      >
                        <Moon size={12} />
                        <span>Dark Mode</span>
                      </button>
                    </div>
                  </div>

                  {/* Density Mode Option */}
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5 font-sans">Layout Density</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => {
                          setDensityMode('standard');
                          localStorage.setItem('smartutils_density', 'standard');
                        }}
                        className={`py-1 px-2 rounded border text-xs font-semibold text-center transition-all ${
                          densityMode === 'standard'
                            ? 'bg-gray-900 border-gray-900 text-white shadow-sm'
                            : 'border-gray-200 bg-gray-50/50 text-gray-600 hover:bg-gray-100/70'
                        }`}
                      >
                        Standard
                      </button>
                      <button
                        onClick={() => {
                          setDensityMode('compact');
                          localStorage.setItem('smartutils_density', 'compact');
                        }}
                        className={`py-1 px-2 rounded border text-xs font-semibold text-center transition-all ${
                          densityMode === 'compact'
                            ? 'bg-gray-900 border-gray-900 text-white shadow-sm'
                            : 'border-gray-200 bg-gray-50/50 text-gray-600 hover:bg-gray-100/70'
                        }`}
                      >
                        Compact
                      </button>
                    </div>
                  </div>

                  {/* Font Size Option */}
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5 font-sans">Typography Scale</label>
                    <div className="grid grid-cols-3 gap-1">
                      {(['sm', 'base', 'lg'] as const).map((sz) => (
                        <button
                          key={sz}
                          onClick={() => {
                            setFontSizeMode(sz);
                            localStorage.setItem('smartutils_fontsize', sz);
                          }}
                          className={`py-1 px-1.5 rounded border text-[10px] font-bold uppercase transition-all ${
                            fontSizeMode === sz
                              ? 'bg-gray-900 border-gray-900 text-white shadow-sm'
                              : 'border-gray-200 bg-gray-50/50 text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                          {sz === 'sm' ? 'Small' : sz === 'base' ? 'Medium' : 'Large'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Universal Command Shortcuts shortcuts */}
                  <div className="border-t border-gray-100 pt-3 mt-1 space-y-1.5">
                    <button
                      onClick={() => {
                        setShowSettingsDropdown(false);
                        openCommandPalette();
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded bg-gray-50 hover:bg-gray-100/80 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-2 text-xs font-medium text-gray-700 font-sans">
                        <Command size={13} className="text-gray-400" />
                        <span>Command Palette</span>
                      </div>
                      <span className="font-mono text-[9px] bg-white border border-gray-200 rounded px-1 py-0.25 text-gray-400 font-bold">
                        Ctrl+K
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setShowSettingsDropdown(false);
                        openShortcutHelp();
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded bg-gray-50 hover:bg-gray-100/80 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-2 text-xs font-medium text-gray-700 font-sans">
                        <Keyboard size={13} className="text-gray-400" />
                        <span>Shortcuts Map</span>
                      </div>
                      <span className="font-mono text-[9px] bg-white border border-gray-200 rounded px-1.5 py-0.25 text-gray-400 font-bold">
                        ?
                      </span>
                    </button>
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* Quick Platform Quality Indicator */}
          <div className="hidden lg:flex items-center space-x-1 bg-amber-50 rounded-full px-2.5 py-1 text-xs text-amber-800 border border-amber-100">
            <Sparkles size={12} className="text-amber-500" />
            <span className="font-medium">100% Client-Side Processing</span>
          </div>

        </div>

      </div>
    </header>
  );
}
