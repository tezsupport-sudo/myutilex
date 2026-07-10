import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Footer from './components/Footer';
import ToolLayout from './components/ToolLayout';
import { TOOLS } from './data/tools';
import { useToast } from './components/Toast';

// Decoupled Router & Platform components
import CommandPalette from './components/CommandPalette';
import ShortcutDialog from './components/ShortcutDialog';
import ComingSoonModal from './components/ComingSoonModal';
import StaticView from './components/StaticView';
import DashboardView from './components/DashboardView';
import ReviewView from './components/ReviewView';
import DesignSystemView from './components/DesignSystemView';
import HistoryCenterView from './components/HistoryCenterView';
import DocumentationCenter from './components/DocumentationCenter';

// Core Tool Engines
import TextEngine from './components/TextEngine';
import DeveloperEngine from './components/DeveloperEngine';
import CalculatorEngine from './components/CalculatorEngine';
import ImageEngine from './components/ImageEngine';
import PDFEngine from './components/PDFEngine';

export default function App() {
  const { showToast } = useToast();
  const [currentView, setCurrentView] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState('global');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<{ toolId: string; timestamp: number }[]>([]);
  const [comingSoonTool, setComingSoonTool] = useState<any>(null);

  // OS Settings States
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutHelpOpen, setIsShortcutHelpOpen] = useState(false);
  const [densityMode, setDensityMode] = useState<'standard' | 'compact'>('standard');
  const [fontSizeMode, setSizeMode] = useState<'sm' | 'base' | 'lg'>('base');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [workspaceFilter, setWorkspaceFilter] = useState<'all' | 'favorites' | 'recent' | 'trending' | 'new'>('all');

  // Load custom settings on mount
  useEffect(() => {
    const savedDensity = localStorage.getItem('smartutils_density');
    if (savedDensity) setDensityMode(savedDensity as 'standard' | 'compact');
    const savedFontSize = localStorage.getItem('smartutils_fontsize');
    if (savedFontSize) setSizeMode(savedFontSize as 'sm' | 'base' | 'lg');
    const savedTheme = localStorage.getItem('smartutils_theme');
    if (savedTheme) setThemeMode(savedTheme as 'light' | 'dark');
  }, []);

  // Set category filter listener from Command Palette
  useEffect(() => {
    const handleSetCategory = (e: Event) => {
      const catId = (e as CustomEvent).detail;
      setSelectedCategory(catId);
    };
    window.addEventListener('smartutils-set-category', handleSetCategory);
    return () => window.removeEventListener('smartutils-set-category', handleSetCategory);
  }, []);

  // Global Keydown Event Listeners for Command Center and Hotkeys
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Toggle Command Palette: Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        setIsShortcutHelpOpen(false);
      }
      
      // Toggle Keyboard Shortcut Dialog: '?' (when not in an input/textarea)
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsShortcutHelpOpen((prev) => !prev);
        setIsCommandPaletteOpen(false);
      }

      // Close overlays with Escape
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsShortcutHelpOpen(false);
        setComingSoonTool(null);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Load bookmarks on mount
  useEffect(() => {
    const savedFavs = localStorage.getItem('smartutils_favorites');
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Load history whenever currentView shifts back to dashboard
  useEffect(() => {
    const savedHistory = localStorage.getItem('smartutils_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error(e);
      }
    }
  }, [currentView]);

  const toggleFavorite = (id: string) => {
    let updated: string[];
    const tool = TOOLS.find(t => t.id === id);
    const toolName = tool ? tool.name : 'Tool';
    if (favorites.includes(id)) {
      updated = favorites.filter((favId) => favId !== id);
      showToast(`Removed "${toolName}" from bookmarked tools`, 'info');
    } else {
      updated = [...favorites, id];
      showToast(`Saved "${toolName}" to bookmarked tools!`, 'success');
    }
    setFavorites(updated);
    localStorage.setItem('smartutils_favorites', JSON.stringify(updated));
  };

  const navigateTo = (view: string) => {
    if (view.startsWith('tool-')) {
      const toolId = view.replace('tool-', '');
      const tool = TOOLS.find((t) => t.id === toolId);
      if (tool?.isPlanned) {
        setComingSoonTool(tool);
        return;
      }
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Track visitation history if navigating to a tool
    if (view.startsWith('tool-')) {
      const toolId = view.replace('tool-', '');
      const savedHistory = localStorage.getItem('smartutils_history');
      let historyList: { toolId: string; timestamp: number }[] = [];
      if (savedHistory) {
        try {
          historyList = JSON.parse(savedHistory);
        } catch (e) {
          console.error(e);
        }
      }
      historyList = historyList.filter((item) => item.toolId !== toolId);
      historyList.unshift({ toolId, timestamp: Date.now() });
      localStorage.setItem('smartutils_history', JSON.stringify(historyList.slice(0, 20)));
    }
  };

  // Render individual tools dynamically inside ToolLayout template
  const renderToolView = (toolId: string) => {
    const tool = TOOLS.find((t) => t.id === toolId);
    if (!tool) return <div>Tool not found.</div>;

    const isFav = favorites.includes(tool.id);

    return (
      <ToolLayout
        tool={tool}
        onBack={() => navigateTo('home')}
        onNavigate={navigateTo}
        isFavorite={isFav}
        onToggleFavorite={() => toggleFavorite(tool.id)}
      >
        {['word-counter', 'character-counter', 'line-counter', 'case-converter', 'remove-extra-spaces'].includes(tool.id) ? (
          <TextEngine toolId={tool.id} />
        ) : ['json-formatter', 'base64-converter'].includes(tool.id) ? (
          <DeveloperEngine toolId={tool.id} />
        ) : ['age-calculator', 'password-generator'].includes(tool.id) ? (
          <CalculatorEngine toolId={tool.id} />
        ) : ['image-compressor'].includes(tool.id) ? (
          <ImageEngine toolId={tool.id} />
        ) : ['pdf-merger'].includes(tool.id) ? (
          <PDFEngine toolId={tool.id} />
        ) : (
          <div className="text-sm text-gray-500">Tool component coming soon...</div>
        )}
      </ToolLayout>
    );
  };

  return (
    <div className={`flex min-h-screen flex-col transition-colors duration-200 font-sans antialiased ${
      themeMode === 'dark' ? 'bg-gray-950 text-gray-100 dark' : 'bg-[#FAF9F6] text-gray-900'
    } ${
      densityMode === 'compact' ? 'compact' : ''
    } ${
      fontSizeMode === 'sm' ? 'text-xs' : fontSizeMode === 'lg' ? 'text-base' : 'text-sm'
    }`}>
      
      {/* Header Container */}
      <Header
        currentView={currentView}
        onNavigate={navigateTo}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        densityMode={densityMode}
        setDensityMode={setDensityMode}
        fontSizeMode={fontSizeMode}
        setFontSizeMode={setSizeMode}
        openCommandPalette={() => setIsCommandPaletteOpen(true)}
        openShortcutHelp={() => setIsShortcutHelpOpen(true)}
      />

      <AnimatePresence mode="wait">
        {currentView === 'home' ? (
          <DashboardView
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            workspaceFilter={workspaceFilter}
            setWorkspaceFilter={setWorkspaceFilter}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            history={history}
            setHistory={setHistory}
            onNavigate={navigateTo}
          />
        ) : (
          <motion.div
            key={currentView}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="flex-1"
          >
            {currentView.startsWith('tool-')
              ? renderToolView(currentView.replace('tool-', ''))
              : currentView === 'history-center'
              ? <HistoryCenterView 
                  favorites={favorites} 
                  toggleFavorite={toggleFavorite} 
                  history={history} 
                  setHistory={setHistory} 
                  onNavigate={navigateTo} 
                  onBack={() => navigateTo('home')} 
                />
              : ['docs', 'architecture', 'privacy-ledger', 'faq', 'personality'].includes(currentView)
              ? <DocumentationCenter 
                  onBack={() => navigateTo('home')} 
                  initialTab={currentView === 'privacy-ledger' ? 'privacy' : currentView === 'docs' ? 'architecture' : currentView} 
                />
              : currentView === 'review'
              ? <ReviewView onBack={() => navigateTo('home')} onNavigate={navigateTo} />
              : currentView === 'design-system'
              ? <DesignSystemView onBack={() => navigateTo('home')} />
              : <StaticView view={currentView} onBack={() => navigateTo('home')} />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Container */}
      <Footer
        onNavigate={navigateTo}
        selectedRegion={selectedRegion}
        onSetRegion={setSelectedRegion}
      />

      {/* Universal Command Palette Overlay (Ctrl+K / Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={navigateTo}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        densityMode={densityMode}
        setDensityMode={setDensityMode}
      />

      {/* Universal Keyboard Shortcuts Help Dialog Overlay (?) */}
      <ShortcutDialog
        isOpen={isShortcutHelpOpen}
        onClose={() => setIsShortcutHelpOpen(false)}
      />

      {/* Planned / Coming Soon Tool Modal Overlay */}
      <ComingSoonModal
        tool={comingSoonTool}
        onClose={() => setComingSoonTool(null)}
      />

    </div>
  );
}
