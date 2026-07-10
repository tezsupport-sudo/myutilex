import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, X } from 'lucide-react';
import { TOOLS } from '../data/tools';

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
  const [commandQuery, setCommandQuery] = useState('');

  const aiMatch = commandQuery.trim()
    ? TOOLS.find(
        (t) =>
          t.name.toLowerCase().includes(commandQuery.toLowerCase().trim()) ||
          t.globalKeywords.some((kw) => kw.toLowerCase() === commandQuery.toLowerCase().trim())
      )
    : null;

  const matchingTools = TOOLS.filter(t => 
    t.name.toLowerCase().includes(commandQuery.toLowerCase()) || 
    t.description.toLowerCase().includes(commandQuery.toLowerCase()) ||
    t.globalKeywords.some(kw => kw.toLowerCase().includes(commandQuery.toLowerCase()))
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
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
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl ring-1 ring-black/5"
          >
            {/* Header Input Area */}
            <div className="relative border-b border-gray-100 p-4">
              <Search className="absolute left-4.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                autoFocus
                placeholder="Type a tool name or describe an action... (e.g., 'prettify JSON', 'make password')"
                value={commandQuery}
                onChange={(e) => setCommandQuery(e.target.value)}
                className="w-full pl-10 pr-12 py-2 text-sm font-sans text-gray-950 placeholder-gray-400 border-0 focus:outline-none focus:ring-0 bg-transparent"
                id="command-palette-search-input"
              />
              <kbd className="absolute right-4.5 top-1/2 -translate-y-1/2 font-mono text-[10px] font-bold text-gray-400 bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded">
                ESC
              </kbd>
            </div>

            {/* Suggestions / List View */}
            <div className="max-h-[360px] overflow-y-auto p-2 space-y-2">
              
              {/* AI Assistant Insight Mode */}
              {commandQuery && (
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 mx-1">
                  <div className="flex items-center space-x-1.5 text-xs text-slate-700 font-bold mb-1">
                    <Sparkles size={13} className="text-amber-500 animate-pulse" />
                    <span>Local Intelligent Routing Assistant</span>
                  </div>
                  {aiMatch ? (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">I detected you want to use the <strong className="text-gray-900 font-semibold">{aiMatch.name}</strong>.</span>
                      <button
                        onClick={() => {
                          onNavigate(`tool-${aiMatch.id}`);
                          onClose();
                          setCommandQuery('');
                        }}
                        className="rounded-md bg-gray-950 px-2 py-1 text-[10px] font-bold text-white hover:bg-gray-800 transition-colors"
                      >
                        Launch Now &rarr;
                      </button>
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-400 leading-normal">
                      Type an action like <strong className="text-gray-500 font-mono">"format"</strong>, <strong className="text-gray-500 font-mono">"entropy"</strong>, <strong className="text-gray-500 font-mono">"age"</strong>, or <strong className="text-gray-500 font-mono">"base64"</strong> to automatically trigger NLP sandbox matches.
                    </p>
                  )}
                </div>
              )}

              {/* List categories or matching tools */}
              <div>
                <span className="px-3 py-1 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block mb-1">Matching Utilities ({matchingTools.length})</span>
                
                <div className="space-y-0.5">
                  {matchingTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => {
                        onNavigate(`tool-${tool.id}`);
                        onClose();
                        setCommandQuery('');
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg text-left text-xs font-semibold hover:bg-gray-50 active:bg-gray-100 transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 group-hover:bg-gray-200 transition-colors font-mono text-[10px] font-bold text-gray-600">
                          {tool.name.substring(0,2)}
                        </div>
                        <div>
                          <span className="text-gray-950 block">{tool.name}</span>
                          <span className="text-[10px] text-gray-400 font-normal block truncate max-w-sm">{tool.description}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5 shrink-0">
                        {tool.offlineReady && (
                          <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[8px] font-mono text-emerald-800 uppercase tracking-widest border border-emerald-100">
                            Offline Ready
                          </span>
                        )}
                        <span className="font-mono text-[9px] text-gray-400 font-bold hidden group-hover:block">
                          ENTER
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Shortcuts & OS Settings */}
              <div className="border-t border-gray-100 pt-2 mt-2">
                <span className="px-3 py-1 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block mb-1">Workspace System Settings</span>
                <div className="grid grid-cols-2 gap-1 p-1">
                  <button
                    onClick={() => {
                      const nextTheme = themeMode === 'light' ? 'dark' : 'light';
                      setThemeMode(nextTheme);
                      localStorage.setItem('smartutils_theme', nextTheme);
                    }}
                    className="flex items-center justify-between p-2 text-left rounded-lg bg-gray-50 hover:bg-gray-100/70 transition-all text-xs"
                  >
                    <span className="text-gray-600 font-medium font-sans">Toggle Dark Mode</span>
                    <kbd className="font-mono text-[9px] text-gray-400 bg-white border px-1 rounded">DM</kbd>
                  </button>
                  <button
                    onClick={() => {
                      const nextDensity = densityMode === 'standard' ? 'compact' : 'standard';
                      setDensityMode(nextDensity);
                      localStorage.setItem('smartutils_density', nextDensity);
                    }}
                    className="flex items-center justify-between p-2 text-left rounded-lg bg-gray-50 hover:bg-gray-100/70 transition-all text-xs"
                  >
                    <span className="text-gray-600 font-medium font-sans">Toggle Layout Density</span>
                    <kbd className="font-mono text-[9px] text-gray-400 bg-white border px-1 rounded">DL</kbd>
                  </button>
                </div>
              </div>

            </div>

            {/* Palette Footer Help Area */}
            <div className="border-t border-gray-100 bg-gray-50 px-4 py-2.5 flex items-center justify-between text-[10px] font-mono text-gray-400">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <kbd className="bg-white px-1 border border-gray-200 rounded shadow-sm text-[9px]">↑↓</kbd>
                  <span>to navigate</span>
                </span>
                <span className="flex items-center space-x-1">
                  <kbd className="bg-white px-1 border border-gray-200 rounded shadow-sm text-[9px]">Enter</kbd>
                  <span>to select</span>
                </span>
              </div>
              <span>Ctrl+K to close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
