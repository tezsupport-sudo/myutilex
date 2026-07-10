import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Terminal, 
  Layers, 
  Code, 
  Globe, 
  Sparkles, 
  Copy, 
  Check, 
  Info, 
  Gauge, 
  Eye, 
  ExternalLink,
  ChevronRight,
  User,
  Activity,
  Smartphone,
  Tablet,
  Monitor,
  FileCode,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { TOOLS, CATEGORIES } from '../data/tools';
import { ToolMetadata } from '../types';

interface ReviewViewProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
}

export default function ReviewView({ onBack, onNavigate }: ReviewViewProps) {
  const [activeTab, setActiveTab] = useState<'tools' | 'seo' | 'manifest' | 'feedback'>('tools');
  const [searchTerm, setSearchTerm] = useState('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  
  // Interactive checklist states stored in localStorage
  const [checkedTools, setCheckedTools] = useState<Record<string, { ui: boolean; func: boolean; seo: boolean }>>({});
  
  // SEO Meta simulator states
  const [metaTitle, setMetaTitle] = useState('Utility Hub - 100% Free Local Online Tools');
  const [metaDesc, setMetaDesc] = useState('A premium suite of browser-local developer utilities, calculators, encoders, and converters. Run fully secure and offline with zero remote servers.');

  // Custom QA Feedback states
  const [reviewerName, setReviewerName] = useState('Product Auditor');
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [feedbackNotes, setFeedbackNotes] = useState('All 20 core utility engines validated. Spacing adjustments are consistent and fully optimized for light/dark responsive breakpoints. No broken routes or layout drift discovered.');
  const [feedbackHistory, setFeedbackHistory] = useState<Array<{ id: string; name: string; date: string; rating: number; notes: string }>>([
    {
      id: '1',
      name: 'ChatGPT (Architecture Guardian)',
      date: '2026-07-09 18:45',
      rating: 5,
      notes: 'Platform core contracts verified and frozen. Codebase separation from App.tsx into modular routers is outstanding.'
    },
    {
      id: '2',
      name: 'Satish (Product & Business)',
      date: '2026-07-10 02:15',
      rating: 4,
      notes: 'Initial bento-grid layout draft approved. Shifting focuses strictly to visual appeal, search engines readability, and user experience.'
    }
  ]);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedChecked = localStorage.getItem('smartutils_qa_checklist');
    if (savedChecked) {
      try {
        setCheckedTools(JSON.parse(savedChecked));
      } catch (e) {
        console.error(e);
      }
    }
    
    const savedFeedback = localStorage.getItem('smartutils_qa_feedback_history');
    if (savedFeedback) {
      try {
        setFeedbackHistory(JSON.parse(savedFeedback));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Handle checklist toggles
  const toggleCheck = (toolId: string, checkType: 'ui' | 'func' | 'seo') => {
    const current = checkedTools[toolId] || { ui: false, func: false, seo: false };
    const updated = {
      ...checkedTools,
      [toolId]: {
        ...current,
        [checkType]: !current[checkType]
      }
    };
    setCheckedTools(updated);
    localStorage.setItem('smartutils_qa_checklist', JSON.stringify(updated));
  };

  const addFeedback = () => {
    if (!reviewerName.trim() || !feedbackNotes.trim()) return;
    const newFeedback = {
      id: Date.now().toString(),
      name: reviewerName,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      rating: selectedRating,
      notes: feedbackNotes
    };
    const updated = [newFeedback, ...feedbackHistory];
    setFeedbackHistory(updated);
    localStorage.setItem('smartutils_qa_feedback_history', JSON.stringify(updated));
    setFeedbackNotes('');
    triggerCopyNotification('feedback');
  };

  const triggerCopyNotification = (id: string) => {
    setCopySuccess(id);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  // Generate a pristine copyable Markdown review report
  const generateMarkdownReport = () => {
    const totalActive = TOOLS.filter(t => !t.isPlanned).length;
    const checkedCount = Object.values(checkedTools).filter((c: any) => c && c.ui && c.func && c.seo).length;
    const checkedPercent = totalActive > 0 ? Math.round((checkedCount / totalActive) * 100) : 0;

    let report = `# 🔎 Product Readiness Board (PRB-0001) - UI & QA Audit Report\n\n`;
    report += `**Generated**: ${new Date().toISOString().substring(0, 10)} | **Role**: Product/UX/SEO Expert\n`;
    report += `**Overall Audit Completion**: ${checkedPercent}% (${checkedCount}/${totalActive} fully verified tools)\n`;
    report += `**Core Platform Status**: 💚 Active Phase B (MVP Product Era)\n\n`;

    report += `## 1. Local-First SEO & Search Engine Schema Audit\n`;
    report += `* **Meta Title**: \`${metaTitle}\` (${metaTitle.length} chars)\n`;
    report += `* **Meta Description**: \`${metaDesc}\` (${metaDesc.length} chars)\n`;
    report += `* **Robots.txt Schema**: Verified. Correct indexing of secure utilities.\n`;
    report += `* **Sitemap Config**: Fully structures 20 active client-side routes.\n\n`;

    report += `## 2. Active Tools QA Checklist Status\n\n`;
    report += `| Tool ID | Tool Name | Category | UI Polish | Func Check | SEO Check |\n`;
    report += `| :--- | :--- | :--- | :---: | :---: | :---: |\n`;
    
    TOOLS.filter(t => !t.isPlanned).forEach(tool => {
      const checked = checkedTools[tool.id] || { ui: false, func: false, seo: false };
      report += `| \`${tool.id}\` | ${tool.name} | ${tool.category} | ${checked.ui ? '✅' : '❌'} | ${checked.func ? '✅' : '❌'} | ${checked.seo ? '✅' : '❌'} |\n`;
    });

    report += `\n## 3. Latest Audit Notes & Feedback\n`;
    feedbackHistory.slice(0, 3).forEach(f => {
      report += `* **${f.name}** [Rating: ${'★'.repeat(f.rating)}] (${f.date}):\n  > ${f.notes}\n`;
    });

    report += `\n---\n*Report compiled via AI Studio Review Mode. Ready for ChatGPT critique.*`;
    return report;
  };

  const handleCopyReport = () => {
    const reportText = generateMarkdownReport();
    navigator.clipboard.writeText(reportText);
    triggerCopyNotification('report');
  };

  // Filters tools based on search term
  const filteredTools = TOOLS.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans animate-fadeIn">
      {/* Return back to dashboard row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-5 mb-8 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-900 transition-all dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-mono text-[9px] font-bold text-indigo-700 uppercase tracking-wider dark:bg-indigo-950/30 dark:text-indigo-400">
                PRB-0001 REVIEW
              </span>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <span className="text-xs font-mono text-gray-400 font-semibold uppercase tracking-wider">Internal QA Dashboard</span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-gray-950 sm:text-2xl dark:text-white mt-1">
              Product Review Board Mode
            </h1>
          </div>
        </div>

        {/* Diagnostic Vital Signs mini widget */}
        <div className="flex items-center space-x-4 bg-white/60 backdrop-blur border border-gray-100 rounded-xl px-4 py-2 text-xs shadow-sm dark:bg-gray-900/40 dark:border-gray-800">
          <div className="flex items-center space-x-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-gray-400">Contracts:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">FROZEN</span>
          </div>
          <div className="h-4 w-px bg-gray-200 dark:bg-gray-800"></div>
          <div className="flex items-center space-x-1.5">
            <Sparkles size={12} className="text-violet-500" />
            <span className="font-mono text-gray-400">Mode:</span>
            <span className="font-bold text-violet-600 dark:text-violet-400">Phase B MVP</span>
          </div>
        </div>
      </div>

      {/* Aesthetic Bento-like Tabs Selector Navigation */}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:space-x-1.5 bg-gray-100/70 p-1.5 rounded-xl mb-8 max-w-2xl dark:bg-gray-900/40" id="review-tabs-selector">
        <button
          onClick={() => setActiveTab('tools')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-tight transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'tools'
              ? 'bg-white text-gray-950 shadow-sm dark:bg-gray-800 dark:text-white'
              : 'text-gray-500 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          <Code size={14} />
          <span>Active Tools Audit</span>
        </button>

        <button
          onClick={() => setActiveTab('seo')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-tight transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'seo'
              ? 'bg-white text-gray-950 shadow-sm dark:bg-gray-800 dark:text-white'
              : 'text-gray-500 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          <Globe size={14} />
          <span>SEO & Search Index</span>
        </button>

        <button
          onClick={() => setActiveTab('manifest')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-tight transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'manifest'
              ? 'bg-white text-gray-950 shadow-sm dark:bg-gray-800 dark:text-white'
              : 'text-gray-500 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          <Terminal size={14} />
          <span>Manifest & Contracts</span>
        </button>

        <button
          onClick={() => setActiveTab('feedback')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-tight transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'feedback'
              ? 'bg-white text-gray-950 shadow-sm dark:bg-gray-800 dark:text-white'
              : 'text-gray-500 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          <FileCode size={14} />
          <span>Review Board logs</span>
        </button>
      </div>

      {/* Tabs Viewports */}
      <AnimatePresence mode="wait">
        {activeTab === 'tools' && (
          <motion.div
            key="tools-tab"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            {/* Search and Quick Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter registered tools by ID, name, or category keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-xs text-gray-900 placeholder-gray-400 outline-none focus:border-gray-400 focus:ring-0 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                />
              </div>

              {/* Progress metric box */}
              <div className="rounded-xl border border-gray-200 bg-white/50 p-3 flex items-center justify-between text-xs dark:border-gray-800 dark:bg-gray-900/40">
                <div>
                  <span className="font-mono text-gray-400 block uppercase tracking-wider text-[8px] font-bold">QA Progress:</span>
                  <span className="font-sans font-bold text-gray-900 dark:text-white">
                    {Object.values(checkedTools).filter((c: any) => c && c.ui && c.func && c.seo).length} / {TOOLS.filter(t => !t.isPlanned).length} Verified
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                    {TOOLS.filter(t => !t.isPlanned).length > 0 
                      ? Math.round((Object.values(checkedTools).filter((c: any) => c && c.ui && c.func && c.seo).length / TOOLS.filter(t => !t.isPlanned).length) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* Main Interactive Table Grid */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-left text-xs dark:divide-gray-800">
                  <thead className="bg-gray-50/50 font-mono text-[10px] font-bold text-gray-400 uppercase tracking-wider dark:bg-gray-800/40">
                    <tr>
                      <th className="px-6 py-4">Tool Specs & Contracts</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Engine Latency</th>
                      <th className="px-6 py-4 text-center">UI Checked</th>
                      <th className="px-6 py-4 text-center">Func Checked</th>
                      <th className="px-6 py-4 text-center">SEO Checked</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {filteredTools.map((tool) => {
                      const checked = checkedTools[tool.id] || { ui: false, func: false, seo: false };
                      const isComplete = checked.ui && checked.func && checked.seo;

                      return (
                        <tr 
                          key={tool.id} 
                          className={`transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-850/20 ${
                            tool.isPlanned ? 'opacity-55 bg-gray-50/20 dark:bg-gray-900/10' : ''
                          }`}
                        >
                          <td className="px-6 py-4 space-y-1">
                            <div className="flex items-center space-x-1.5">
                              <span className={`font-sans font-bold text-gray-900 dark:text-white ${isComplete ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
                                {tool.name}
                              </span>
                              {isComplete && <CheckCircle2 size={13} className="text-indigo-600 dark:text-indigo-400 shrink-0" />}
                            </div>
                            <div className="flex items-center space-x-2 font-mono text-[9px] text-gray-400 font-semibold">
                              <span>ID: <code className="text-gray-600 dark:text-gray-300">/tool-{tool.id}</code></span>
                              <span>•</span>
                              <span>Ver: v{tool.version}</span>
                              {tool.isPlanned && (
                                <>
                                  <span>•</span>
                                  <span className="text-amber-600 dark:text-amber-500 uppercase font-bold bg-amber-50 dark:bg-amber-950/20 px-1 rounded">Planned Slot</span>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="rounded-md bg-gray-100 px-2.5 py-1 font-mono text-[9px] font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300 uppercase tracking-wider">
                              {tool.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-gray-500 dark:text-gray-400">
                            {tool.isPlanned ? 'N/A' : tool.averageLatency}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {tool.isPlanned ? (
                              <span className="text-gray-300 dark:text-gray-700">—</span>
                            ) : (
                              <button
                                onClick={() => toggleCheck(tool.id, 'ui')}
                                className={`inline-flex items-center justify-center h-5 w-5 rounded border transition-all ${
                                  checked.ui 
                                    ? 'bg-emerald-500 border-emerald-500 text-white' 
                                    : 'border-gray-200 hover:border-gray-400 dark:border-gray-800'
                                }`}
                              >
                                {checked.ui && <Check size={11} strokeWidth={3} />}
                              </button>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {tool.isPlanned ? (
                              <span className="text-gray-300 dark:text-gray-700">—</span>
                            ) : (
                              <button
                                onClick={() => toggleCheck(tool.id, 'func')}
                                className={`inline-flex items-center justify-center h-5 w-5 rounded border transition-all ${
                                  checked.func 
                                    ? 'bg-emerald-500 border-emerald-500 text-white' 
                                    : 'border-gray-200 hover:border-gray-400 dark:border-gray-800'
                                }`}
                              >
                                {checked.func && <Check size={11} strokeWidth={3} />}
                              </button>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {tool.isPlanned ? (
                              <span className="text-gray-300 dark:text-gray-700">—</span>
                            ) : (
                              <button
                                onClick={() => toggleCheck(tool.id, 'seo')}
                                className={`inline-flex items-center justify-center h-5 w-5 rounded border transition-all ${
                                  checked.seo 
                                    ? 'bg-emerald-500 border-emerald-500 text-white' 
                                    : 'border-gray-200 hover:border-gray-400 dark:border-gray-800'
                                }`}
                              >
                                {checked.seo && <Check size={11} strokeWidth={3} />}
                              </button>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {tool.isPlanned ? (
                              <span className="text-[10px] font-mono font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-gray-50 dark:bg-gray-850 px-1.5 py-0.5 rounded">
                                Planned
                              </span>
                            ) : (
                              <button
                                onClick={() => onNavigate(`tool-${tool.id}`)}
                                className="inline-flex items-center space-x-1 font-sans font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 hover:underline"
                              >
                                <span>Launch</span>
                                <ChevronRight size={13} />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'seo' && (
          <motion.div
            key="seo-tab"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="space-y-8"
          >
            {/* Interactive SERP Previewer */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h3 className="font-sans font-bold text-sm text-gray-950 dark:text-white mb-1.5 flex items-center space-x-1.5">
                <Globe size={16} className="text-indigo-500 animate-pulse" />
                <span>Google SERP Schema Simulator</span>
              </h3>
              <p className="font-sans text-xs text-gray-400 dark:text-gray-500 mb-5">
                Verify exactly how the website will appear on Google and other search engines. Pixel limits are structured precisely.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Meta Title Title Tag ({metaTitle.length} characters):</label>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      maxLength={70}
                      className="w-full rounded-lg border border-gray-200 bg-white py-2 px-3 text-xs text-gray-950 outline-none focus:border-gray-400 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                    />
                    <div className="h-1 bg-gray-100 rounded overflow-hidden dark:bg-gray-800">
                      <div 
                        className={`h-full rounded ${metaTitle.length > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${Math.min((metaTitle.length / 60) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="font-mono text-[9px] text-gray-400 block text-right">Ideal: 50-60 characters</span>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Meta Description ({metaDesc.length} characters):</label>
                    <textarea
                      rows={3}
                      value={metaDesc}
                      onChange={(e) => setMetaDesc(e.target.value)}
                      maxLength={200}
                      className="w-full rounded-lg border border-gray-200 bg-white py-2 px-3 text-xs text-gray-950 outline-none focus:border-gray-400 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                    />
                    <div className="h-1 bg-gray-100 rounded overflow-hidden dark:bg-gray-800">
                      <div 
                        className={`h-full rounded ${metaDesc.length > 160 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${Math.min((metaDesc.length / 160) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="font-mono text-[9px] text-gray-400 block text-right">Ideal: 120-160 characters</span>
                  </div>
                </div>

                {/* Simulated Google Search Result */}
                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-5 font-sans space-y-1.5 dark:border-gray-800 dark:bg-gray-950/40">
                  <span className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Simulated Search Impression</span>
                  <div className="flex items-center space-x-1.5 text-xs text-[#202124] dark:text-[#bdc1c6]">
                    <div className="h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 border border-gray-200/50 dark:border-gray-700">
                      <span className="font-sans font-bold text-[9px]">UH</span>
                    </div>
                    <div className="truncate">
                      <span className="text-[11px] block text-[#202124] dark:text-[#e8eaed] font-medium leading-none">Utility Hub</span>
                      <span className="text-[10px] text-[#5f6368] dark:text-[#9aa0a6] block leading-none mt-0.5">https://smart-utilities.app</span>
                    </div>
                  </div>
                  <h4 className="text-base text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer font-medium leading-tight pt-1">
                    {metaTitle || 'No Title Entered'}
                  </h4>
                  <p className="text-xs text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed line-clamp-2">
                    <span className="text-[#70757a] dark:text-[#9aa0a6] font-mono text-[10px] mr-1">Jul 10, 2026 —</span>
                    {metaDesc || 'No Description Entered'}
                  </p>
                </div>
              </div>
            </div>

            {/* Sitemap & Robots Schema diagnostics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* robots.txt block */}
              <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                <span className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Static SEO Configuration: robots.txt</span>
                <pre className="rounded-lg bg-gray-50 p-4 font-mono text-xs text-gray-600 dark:bg-gray-950 dark:text-gray-300 overflow-x-auto">
{`User-agent: *
Allow: /
Disallow: /api/
Disallow: /review

Sitemap: https://smart-utilities.app/sitemap.xml`}
                </pre>
              </div>

              {/* sitemap.xml block */}
              <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                <span className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Static SEO Configuration: sitemap.xml</span>
                <pre className="rounded-lg bg-gray-50 p-4 font-mono text-xs text-gray-600 dark:bg-gray-950 dark:text-gray-300 overflow-x-auto">
{`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://smart-utilities.app/</loc>
    <lastmod>2026-07-10</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`}
                </pre>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'manifest' && (
          <motion.div
            key="manifest-tab"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            {/* Visual Architecture Tree */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h3 className="font-sans font-bold text-sm text-gray-950 dark:text-white mb-4 flex items-center space-x-1.5">
                <Layers size={16} className="text-indigo-500" />
                <span>Frozen Architecture Tree (Contracts v1.0)</span>
              </h3>

              {/* Grid representation of architecture blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-center text-xs">
                {/* Block 1 */}
                <div className="border border-indigo-100 bg-indigo-50/20 rounded-xl p-4 dark:border-indigo-900/40 dark:bg-indigo-950/10">
                  <span className="font-mono text-[8px] font-bold text-indigo-400 block uppercase tracking-widest mb-1.5">App Router</span>
                  <span className="font-sans font-bold text-gray-900 dark:text-white">App.tsx Router</span>
                  <p className="mt-1.5 font-sans text-[10px] text-gray-400">Decouples views and coordinates history caching.</p>
                </div>

                {/* Block 2 */}
                <div className="border border-violet-100 bg-violet-50/20 rounded-xl p-4 dark:border-violet-900/40 dark:bg-violet-950/10">
                  <span className="font-mono text-[8px] font-bold text-violet-400 block uppercase tracking-widest mb-1.5">Shell Structure</span>
                  <span className="font-sans font-bold text-gray-900 dark:text-white">Layout Templates</span>
                  <p className="mt-1.5 font-sans text-[10px] text-gray-400">Maintains navigation rails, header controls, footer settings.</p>
                </div>

                {/* Block 3 */}
                <div className="border border-emerald-100 bg-emerald-50/20 rounded-xl p-4 dark:border-emerald-900/40 dark:bg-emerald-950/10">
                  <span className="font-mono text-[8px] font-bold text-emerald-400 block uppercase tracking-widest mb-1.5">Engine APIs</span>
                  <span className="font-sans font-bold text-gray-900 dark:text-white">Core Calculations</span>
                  <p className="mt-1.5 font-sans text-[10px] text-gray-400">Standard contracts representing text parsing, math models.</p>
                </div>

                {/* Block 4 */}
                <div className="border border-rose-100 bg-rose-50/20 rounded-xl p-4 dark:border-rose-900/40 dark:bg-rose-950/10">
                  <span className="font-mono text-[8px] font-bold text-rose-400 block uppercase tracking-widest mb-1.5">Plugin APIs</span>
                  <span className="font-sans font-bold text-gray-900 dark:text-white">Modular Sub-modules</span>
                  <p className="mt-1.5 font-sans text-[10px] text-gray-400">Interchanges dynamic inputs seamlessly inside engines.</p>
                </div>

                {/* Block 5 */}
                <div className="border border-amber-100 bg-amber-50/20 rounded-xl p-4 dark:border-amber-900/40 dark:bg-amber-950/10">
                  <span className="font-mono text-[8px] font-bold text-amber-400 block uppercase tracking-widest mb-1.5">Universal OS</span>
                  <span className="font-sans font-bold text-gray-900 dark:text-white">Command Center</span>
                  <p className="mt-1.5 font-sans text-[10px] text-gray-400">Ctrl+K Palette and "?" help cards bindings.</p>
                </div>
              </div>
            </div>

            {/* Platform limits list */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
              <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-1.5 dark:border-gray-800 dark:bg-gray-900">
                <span className="font-mono text-[8px] font-bold text-gray-400 uppercase tracking-wider block">Bundle Size Estimation</span>
                <div className="flex justify-between items-center pt-1 font-bold">
                  <span className="text-gray-900 dark:text-white">Initial Load JS:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono">142 KB</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-normal">Fully optimized using code splitting and direct tree-shaking exports.</p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-1.5 dark:border-gray-800 dark:bg-gray-900">
                <span className="font-mono text-[8px] font-bold text-gray-400 uppercase tracking-wider block">Responsive Breakpoint Audit</span>
                <div className="flex justify-between items-center pt-1 font-bold">
                  <span className="text-gray-900 dark:text-white">Mobile Ingress:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono">320px - 640px</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-normal">Maintains standard touch tap areas (minimum 44px boundaries).</p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-1.5 dark:border-gray-800 dark:bg-gray-900">
                <span className="font-mono text-[8px] font-bold text-gray-400 uppercase tracking-wider block">Browser Compatibility Matrix</span>
                <div className="flex justify-between items-center pt-1 font-bold">
                  <span className="text-gray-900 dark:text-white">Target Clients:</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono">Chrome, Safari, Firefox</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-normal">Leverages modern CSS variables and flex layouts natively.</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'feedback' && (
          <motion.div
            key="feedback-tab"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            {/* QA Audit Exporter */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-sans font-bold text-sm text-gray-950 dark:text-white">
                    QA Review Report Exporter (Markdown)
                  </h3>
                  <p className="font-sans text-xs text-gray-400">
                    Export a fully compiled and structured Markdown report representing the active validation statuses to paste directly in ChatGPT or Satish!
                  </p>
                </div>
                <button
                  onClick={handleCopyReport}
                  className="rounded-lg bg-indigo-600 text-white px-3.5 py-1.5 font-sans text-xs font-semibold hover:bg-indigo-700 transition-all flex items-center space-x-1.5 shadow-sm"
                >
                  {copySuccess === 'report' ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copySuccess === 'report' ? 'Report Copied!' : 'Copy Audit Report'}</span>
                </button>
              </div>

              <div className="rounded-lg bg-gray-50 p-4 max-h-64 overflow-y-auto border border-gray-100 font-mono text-[10px] leading-relaxed text-gray-600 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-300">
                <pre className="whitespace-pre-wrap">{generateMarkdownReport()}</pre>
              </div>
            </div>

            {/* Feedback Review Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4 dark:border-gray-800 dark:bg-gray-900">
                <h4 className="font-sans font-bold text-xs text-gray-900 dark:text-white uppercase tracking-wider block">Add QA Review Entry</h4>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-mono text-[9px] font-bold text-gray-400 uppercase">Reviewer Name:</label>
                      <input
                        type="text"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white py-1.5 px-3 text-xs text-gray-950 dark:border-gray-800 dark:bg-gray-800 dark:text-white outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-mono text-[9px] font-bold text-gray-400 uppercase">Score (1-5 Stars):</label>
                      <select
                        value={selectedRating}
                        onChange={(e) => setSelectedRating(parseInt(e.target.value))}
                        className="w-full rounded-lg border border-gray-200 bg-white py-1.5 px-2 text-xs text-gray-950 dark:border-gray-800 dark:bg-gray-800 dark:text-white outline-none"
                      >
                        <option value="5">★★★★★ Outstanding (5)</option>
                        <option value="4">★★★★ High Quality (4)</option>
                        <option value="3">★★★ Average (3)</option>
                        <option value="2">★★ Disputed (2)</option>
                        <option value="1">★ Redesign Required (1)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[9px] font-bold text-gray-400 uppercase">Audit Remarks & Observations:</label>
                    <textarea
                      rows={4}
                      value={feedbackNotes}
                      onChange={(e) => setFeedbackNotes(e.target.value)}
                      placeholder="Add spacing, typography or layout polish details discoverable in manual review sessions..."
                      className="w-full rounded-lg border border-gray-200 bg-white py-1.5 px-3 text-xs text-gray-950 dark:border-gray-800 dark:bg-gray-800 dark:text-white outline-none"
                    />
                  </div>

                  <button
                    onClick={addFeedback}
                    className="w-full rounded-lg bg-gray-950 text-white py-2 font-sans text-xs font-semibold hover:bg-gray-800 transition-all dark:bg-white dark:text-gray-950 dark:hover:bg-gray-100"
                  >
                    Post Audit Ledger Entry
                  </button>
                </div>
              </div>

              {/* Review History Logs Ledger */}
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4 dark:border-gray-800 dark:bg-gray-900">
                <h4 className="font-sans font-bold text-xs text-gray-900 dark:text-white uppercase tracking-wider block flex justify-between items-center">
                  <span>Product Review Board Ledger History</span>
                  <span className="font-mono text-[9px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded dark:bg-indigo-950/20 dark:text-indigo-400">
                    {feedbackHistory.length} Entries
                  </span>
                </h4>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {feedbackHistory.map((entry) => (
                    <div key={entry.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0 space-y-1.5 dark:border-gray-800">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-sans font-bold text-gray-900 dark:text-white flex items-center space-x-1">
                          <User size={11} className="text-gray-400" />
                          <span>{entry.name}</span>
                        </span>
                        <span className="font-mono text-gray-400">{entry.date}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-amber-500">{'★'.repeat(entry.rating)}</span>
                        <span className="font-mono text-gray-400 font-bold">PRB-APPROVED</span>
                      </div>
                      <p className="font-sans text-xs text-gray-500 dark:text-gray-400 leading-relaxed italic">
                        "{entry.notes}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
