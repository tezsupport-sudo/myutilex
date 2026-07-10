import React, { useState, useEffect } from 'react';
import { Copy, Trash2, Check, Download, Upload, AlertTriangle, ArrowRightLeft } from 'lucide-react';
import { DEV_PLUGINS } from './devPlugins';

interface DeveloperEngineProps {
  toolId: string;
}

export default function DeveloperEngine({ toolId }: DeveloperEngineProps) {
  const plugin = DEV_PLUGINS[toolId];
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [copiedTarget, setCopiedTarget] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'source' | 'target'>('source');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Clear states when switching toolId
  useEffect(() => {
    setSourceText('');
    setTargetText('');
    setErrorMsg(null);
    setFeedback(null);
    setActiveTab('source');
  }, [toolId]);

  if (!plugin) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 font-sans text-xs text-red-800">
        Error: Developer engine plugin with ID "{toolId}" not found in registered active manifests.
      </div>
    );
  }

  // Real-time validation
  const validation = plugin.validate ? plugin.validate(sourceText) : null;

  // Real-time metrics
  const metrics = plugin.calculateMetrics(sourceText, targetText);

  const handleCopy = (type: 'source' | 'target') => {
    const textToCopy = type === 'source' ? sourceText : targetText;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    if (type === 'source') {
      setCopiedSource(true);
      setTimeout(() => setCopiedSource(false), 2000);
    } else {
      setCopiedTarget(true);
      setTimeout(() => setCopiedTarget(false), 2000);
    }
    triggerFeedback('Copied to clipboard');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        setSourceText(result);
        setTargetText('');
        setErrorMsg(null);
        triggerFeedback('File uploaded successfully');
      }
    };
    reader.readAsText(file);
  };

  const handleDownload = (type: 'source' | 'target') => {
    const textToDownload = type === 'source' ? sourceText : targetText;
    if (!textToDownload) return;
    const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${toolId}-${type}-output.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerFeedback('Download completed');
  };

  const triggerFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2500);
  };

  const executeAction = (run: (source: string) => { output: string; error?: string }, actionLabel: string) => {
    if (!sourceText) {
      triggerFeedback('Please provide input first');
      return;
    }
    setErrorMsg(null);
    try {
      const res = run(sourceText);
      if (res.error) {
        setErrorMsg(res.error);
        setTargetText('');
        triggerFeedback('Process failed');
      } else {
        setTargetText(res.output);
        setActiveTab('target'); // Auto navigate on success for better UX
        triggerFeedback(`Executed: ${actionLabel}`);
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Operation failed');
      triggerFeedback('Action error');
    }
  };

  const handleReset = () => {
    setSourceText('');
    setTargetText('');
    setErrorMsg(null);
    setActiveTab('source');
    triggerFeedback('Scratchpad fields reset');
  };

  return (
    <div className="space-y-6 font-sans" id={`developer-engine-${toolId}`}>
      
      {/* 1. Dynamic Metric Dashboard Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5" id="de-metrics-grid">
        {metrics.map((m, idx) => (
          <div 
            key={idx}
            className={`rounded-lg border p-3.5 text-center transition-all ${
              m.isAccent 
                ? 'border-emerald-200 bg-emerald-50/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]' 
                : m.value === 'Malformed' || m.value === 'Incorrect'
                ? 'border-red-200 bg-red-50/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]'
                : 'border-gray-200 bg-gray-50/80 shadow-[0_1px_2px_rgba(0,0,0,0.01)]'
            }`}
          >
            <span className={`block font-mono text-[9px] font-bold uppercase tracking-widest ${
              m.isAccent ? 'text-emerald-700' : m.value === 'Malformed' || m.value === 'Incorrect' ? 'text-red-700' : 'text-gray-500'
            }`}>
              {m.label}
            </span>
            <span className={`mt-1 block font-sans text-xl font-extrabold truncate ${
              m.isAccent ? 'text-emerald-950' : m.value === 'Malformed' || m.value === 'Incorrect' ? 'text-red-950' : 'text-gray-950'
            }`}>
              {m.value}
            </span>
          </div>
        ))}
      </div>

      {/* 2. Error Message banner */}
      {errorMsg && (
        <div className="flex items-start space-x-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 animate-fadeIn" id="de-error-banner">
          <AlertTriangle size={15} className="shrink-0 mt-0.5 text-red-500" />
          <div className="font-mono">{errorMsg}</div>
        </div>
      )}

      {/* 3. Validation Warnings (Non-blocking) */}
      {validation && !validation.isValid && validation.message && (
        <div className="flex items-start space-x-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800" id="de-warning-banner">
          <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-500" />
          <div className="font-mono">Validation notice: {validation.message}</div>
        </div>
      )}

      {/* 4. Toolbar with File Operations */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <span className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Computational Workbench
        </span>
        
        <div className="flex items-center space-x-2">
          {/* File Upload Button */}
          <label className="flex items-center space-x-1.5 cursor-pointer rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            <Upload size={12} />
            <span>Import File</span>
            <input 
              type="file" 
              accept=".txt,.csv,.json,.xml,.md,.js,.css" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
          </label>
        </div>
      </div>

      {/* 5. Mobile-Only Tabs Navigation */}
      <div className="flex border-b border-gray-200 md:hidden" id="de-mobile-tabs">
        <button
          onClick={() => setActiveTab('source')}
          className={`flex-1 py-3 text-center text-xs font-semibold tracking-tight border-b-2 transition-all ${
            activeTab === 'source'
              ? 'border-gray-950 text-gray-950 bg-gray-50/50'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          {plugin.sourceLabel}
        </button>
        <button
          onClick={() => setActiveTab('target')}
          className={`flex-1 py-3 text-center text-xs font-semibold tracking-tight border-b-2 transition-all ${
            activeTab === 'target'
              ? 'border-gray-950 text-gray-950 bg-gray-50/50'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          {plugin.targetLabel} {targetText && '•'}
        </button>
      </div>

      {/* 6. Side-by-Side Dual-Columns Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2" id="de-dual-workbench">
        
        {/* Column A: Source input */}
        <div className={`flex flex-col space-y-2 ${activeTab === 'source' ? 'flex' : 'hidden md:flex'}`}>
          <div className="flex items-center justify-between">
            <label className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {plugin.sourceLabel}
            </label>
            <div className="flex items-center space-x-2">
              {sourceText && (
                <>
                  <button
                    onClick={() => handleCopy('source')}
                    className="flex items-center space-x-1 font-sans text-[11px] text-gray-400 hover:text-gray-950 transition-colors"
                  >
                    {copiedSource ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={() => handleDownload('source')}
                    className="flex items-center space-x-1 font-sans text-[11px] text-gray-400 hover:text-gray-950 transition-colors"
                  >
                    <Download size={11} />
                    <span>Download</span>
                  </button>
                </>
              )}
            </div>
          </div>
          <textarea
            rows={12}
            value={sourceText}
            onChange={(e) => {
              setSourceText(e.target.value);
              // Clean target output if source changes to maintain dynamic alignment
              setTargetText('');
            }}
            placeholder={plugin.placeholderSource}
            className="w-full rounded-lg border border-gray-200 bg-white p-3.5 font-mono text-xs text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-gray-950 focus:ring-1 focus:ring-gray-950 shadow-inner"
            id="de-source-textarea"
          />
        </div>

        {/* Column B: Target output */}
        <div className={`flex flex-col space-y-2 ${activeTab === 'target' ? 'flex' : 'hidden md:flex'}`}>
          <div className="flex items-center justify-between">
            <label className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {plugin.targetLabel}
            </label>
            <div className="flex items-center space-x-2">
              {targetText && (
                <>
                  <button
                    onClick={() => handleCopy('target')}
                    className="flex items-center space-x-1 font-sans text-[11px] text-gray-400 hover:text-gray-950 transition-colors"
                  >
                    {copiedTarget ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={() => handleDownload('target')}
                    className="flex items-center space-x-1 font-sans text-[11px] text-gray-400 hover:text-gray-950 transition-colors"
                  >
                    <Download size={11} />
                    <span>Download</span>
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="relative flex-1">
            <textarea
              readOnly
              rows={12}
              value={targetText}
              placeholder={plugin.placeholderTarget}
              className="w-full rounded-lg border border-gray-200 bg-gray-50/80 p-3.5 font-mono text-xs text-gray-800 placeholder-gray-400 outline-none select-text"
              id="de-target-textarea"
            />
          </div>
        </div>

      </div>

      {/* 7. Action Command Trigger Panel & Scratchpad feedback */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4" id="de-actions-row">
        
        {/* Dynamic plugin quick actions */}
        <div className="flex flex-wrap items-center gap-2">
          {plugin.actions.map((act) => (
            <button
              key={act.id}
              onClick={() => executeAction(act.run, act.label)}
              disabled={!sourceText}
              className={`flex items-center space-x-1.5 rounded-md px-4 py-2 text-xs font-semibold transition-all cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.03)] ${
                act.isPrimary 
                  ? 'bg-gray-950 text-white hover:bg-gray-800 disabled:opacity-40 disabled:hover:bg-gray-950' 
                  : 'border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white'
              }`}
            >
              <ArrowRightLeft size={13} />
              <span>{act.label}</span>
            </button>
          ))}
        </div>

        {/* Global Control: Reset */}
        <button
          onClick={handleReset}
          disabled={!sourceText && !targetText}
          className="flex items-center space-x-1.5 rounded-md border border-red-100 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-100/80 disabled:opacity-40 disabled:hover:bg-red-50 transition-all cursor-pointer"
          id="de-reset-btn"
        >
          <Trash2 size={13} />
          <span>Reset All</span>
        </button>

      </div>

      {/* Live notification feedback floating tag */}
      {feedback && (
        <div className="fixed bottom-4 right-4 z-50 rounded bg-gray-900 px-3 py-1.5 font-mono text-xs font-bold text-white shadow-lg animate-fadeIn">
          {feedback}
        </div>
      )}

      {/* 8. Detailed Insights Panel */}
      {plugin.renderInsights && plugin.renderInsights(sourceText, targetText)}

    </div>
  );
}
