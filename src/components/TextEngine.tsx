import React, { useState, useEffect, useRef } from 'react';
import { 
  Copy, 
  Trash2, 
  Check, 
  Download, 
  Upload, 
  Undo, 
  Redo, 
  Printer, 
  FileText, 
  Sparkles, 
  BookOpen, 
  Code
} from 'lucide-react';
import { TEXT_PLUGINS } from './textPlugins';

interface TextEngineProps {
  toolId: string;
}

export default function TextEngine({ toolId }: TextEngineProps) {
  const plugin = TEXT_PLUGINS[toolId];
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Undo/Redo States
  const [historyStack, setHistoryStack] = useState<string[]>(['']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isInternalChangeRef = useRef(false);

  // Sample templates to load instantly
  const samples = {
    'word-counter': {
      title: 'Academic Essay Sample',
      icon: <BookOpen size={13} />,
      content: `In the contemporary era of technological convergence, the architecture of digital interfaces has emerged as a primary determinant of user trust. Rather than relying on speculative backend calculations, modern software engineering favors local-first data integrity. This model guarantees near-zero latency, absolute confidentiality, and offline capability. By empowering the user's browser to execute heavy parsing, developers eliminate the cognitive overhead of continuous authentication and network instability. Ultimately, local-first architectures promote a more humane, secure, and resilient digital ecosystem.`
    },
    'character-counter': {
      title: 'Cryptographic Frequency Sample',
      icon: <FileText size={13} />,
      content: `The quick brown fox jumps over the lazy dog. 1234567890! SPECIAL_CHARACTERS: @#%&*()_+=[]{}|;:,.<>?`
    },
    'line-counter': {
      title: 'Structured Log Registry Sample',
      icon: <Code size={13} />,
      content: `[2026-07-10 12:00:01] INFO  - Booting local-first sandbox environment.
[2026-07-10 12:00:02] DEBUG - Loading active utility manifests.
[2026-07-10 12:00:03] WARN  - Offloading server processing. (Local Sandbox Active)
[2026-07-10 12:00:04] INFO  - All systems running 100% locally.
[2026-07-10 12:00:05] FATAL - Server connection lost... (Retrying: Offline fallback enabled automatically!)`
    },
    'case-converter': {
      title: 'Variable Naming Sample',
      icon: <Code size={13} />,
      content: `local_first_sandbox_engine_variable_name`
    },
    'remove-extra-spaces': {
      title: 'Ragged Indentation Sample',
      icon: <Sparkles size={13} />,
      content: `This is   a text   with    ragged spaces.
  It also  contains   trailing whitespace on several rows.   \t
\t\tTabs are   mixed in   as well.   
  
Let's see if we can   clean   it all up with the   smart   remover.`
    }
  }[toolId] || {
    title: 'Generic Placeholder Text',
    icon: <FileText size={13} />,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  };

  // Reset state on tool change
  useEffect(() => {
    setText('');
    setHistoryStack(['']);
    setHistoryIndex(0);
    setFeedback(null);
  }, [toolId]);

  // Debounce typing to push onto the history stack
  useEffect(() => {
    if (isInternalChangeRef.current) {
      isInternalChangeRef.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const currentInHistory = historyStack[historyIndex];
      if (currentInHistory !== text) {
        const nextStack = historyStack.slice(0, historyIndex + 1);
        setHistoryStack([...nextStack, text]);
        setHistoryIndex(nextStack.length);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [text, historyStack, historyIndex]);

  if (!plugin) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 font-sans text-xs text-red-800">
        Error: Text engine plugin with ID "{toolId}" not found in registered active manifests.
      </div>
    );
  }

  // Calculate dynamic metrics from plugin
  const metrics = plugin.calculateMetrics(text);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      isInternalChangeRef.current = true;
      setHistoryIndex(prevIndex);
      setText(historyStack[prevIndex]);
      triggerFeedback('Undo executed');
    }
  };

  const handleRedo = () => {
    if (historyIndex < historyStack.length - 1) {
      const nextIndex = historyIndex + 1;
      isInternalChangeRef.current = true;
      setHistoryIndex(nextIndex);
      setText(historyStack[nextIndex]);
      triggerFeedback('Redo executed');
    }
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        isInternalChangeRef.current = true;
        setText(result);
        const nextStack = historyStack.slice(0, historyIndex + 1);
        setHistoryStack([...nextStack, result]);
        setHistoryIndex(nextStack.length);
        triggerFeedback('File uploaded successfully');
      }
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${toolId}-output.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerFeedback('File downloaded successfully');
  };

  const handlePrint = () => {
    if (!text) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      triggerFeedback('Pop-up blocked. Please enable pop-ups to print.');
      return;
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>Print - TezSupport Utilities</title>
          <style>
            body { font-family: monospace; white-space: pre-wrap; padding: 40px; color: #111; line-height: 1.5; }
            h1 { font-family: sans-serif; font-size: 14px; margin-bottom: 20px; border-b: 1px solid #ccc; pb: 10px; }
          </style>
        </head>
        <body>
          <h1>TezSupport Utility Export - ${plugin.name}</h1>
          <div>${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
    triggerFeedback('Sent to print cue');
  };

  const triggerFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2500);
  };

  const executeAction = (run: (text: string) => string, actionLabel: string) => {
    if (!text) return;
    try {
      const result = run(text);
      isInternalChangeRef.current = true;
      setText(result);
      const nextStack = historyStack.slice(0, historyIndex + 1);
      setHistoryStack([...nextStack, result]);
      setHistoryIndex(nextStack.length);
      triggerFeedback(`Executed: ${actionLabel}`);
    } catch (e) {
      triggerFeedback('Action failed to run');
      console.error(e);
    }
  };

  const loadSample = () => {
    isInternalChangeRef.current = true;
    setText(samples.content);
    const nextStack = historyStack.slice(0, historyIndex + 1);
    setHistoryStack([...nextStack, samples.content]);
    setHistoryIndex(nextStack.length);
    triggerFeedback('Loaded sample template');
  };

  return (
    <div className="space-y-6 font-sans" id={`text-engine-${toolId}`}>
      
      {/* 1. Real-time Metric Cards Layout */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-6" id="te-metrics-grid">
        {metrics.map((m, idx) => (
          <div 
            key={idx}
            className={`rounded-xl border p-4 text-center transition-all ${
              m.isAccent 
                ? 'border-indigo-150 bg-indigo-50/40 dark:border-indigo-900/40 dark:bg-indigo-950/20 shadow-xs' 
                : 'border-gray-150 bg-white dark:border-gray-900 dark:bg-gray-950/20 shadow-xs'
            }`}
          >
            <span className={`block font-mono text-[9px] font-bold uppercase tracking-widest ${m.isAccent ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`}>
              {m.label}
            </span>
            <span className={`mt-1.5 block font-sans text-lg font-extrabold tracking-tight ${m.isAccent ? 'text-indigo-950 dark:text-indigo-200' : 'text-gray-950 dark:text-white'}`}>
              {m.value}
            </span>
          </div>
        ))}
      </div>

      {/* 2. Main File Operations and Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-150 pb-3 dark:border-gray-900">
        <span className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
          Interactive Local Scratchpad
        </span>
        
        {/* Undo, Redo, File Exporters, & Printers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Local History Management */}
          <div className="flex items-center space-x-1 border-r border-gray-150 pr-2 dark:border-gray-900">
            <button
              onClick={handleUndo}
              disabled={historyIndex === 0}
              title="Undo change (Ctrl+Z)"
              className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-850 cursor-pointer"
            >
              <Undo size={13} />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex === historyStack.length - 1}
              title="Redo change (Ctrl+Y)"
              className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-850 cursor-pointer"
            >
              <Redo size={13} />
            </button>
          </div>

          {/* File Upload Button */}
          <label className="flex items-center space-x-1.5 cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-850 dark:hover:text-white">
            <Upload size={12} />
            <span>Upload</span>
            <input 
              type="file" 
              accept=".txt,.csv,.json,.xml,.md,.js,.css" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
          </label>

          {/* File Download Button */}
          <button
            onClick={handleDownload}
            disabled={!text}
            className="flex items-center space-x-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-35 disabled:hover:bg-white transition-colors dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-850 dark:hover:text-white cursor-pointer"
          >
            <Download size={12} />
            <span>Download</span>
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            disabled={!text}
            className="flex items-center space-x-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-35 disabled:hover:bg-white transition-colors dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-850 dark:hover:text-white cursor-pointer"
          >
            <Printer size={12} />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* 3. Main Text Input Area */}
      <div className="relative">
        <textarea
          rows={11}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Start typing or paste your content here to begin dynamic ${plugin.name} processes...`}
          className="w-full rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-indigo-500"
          id="te-textarea-field"
        />

        {/* Quick Sample Template Loader Overlay for Empty State */}
        {!text && (
          <div className="absolute inset-x-0 bottom-4 flex flex-col items-center justify-center pointer-events-none">
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/95 p-4 text-center pointer-events-auto max-w-sm shadow-xs dark:border-gray-800 dark:bg-gray-950/95">
              <span className="block font-sans text-[11px] font-semibold text-gray-400 dark:text-gray-500">
                Scratchpad is empty
              </span>
              <button
                onClick={loadSample}
                className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-gray-950 px-3 py-1.5 font-sans text-xs font-bold text-white shadow-xs hover:bg-indigo-600 active:scale-98 transition-all cursor-pointer dark:bg-white dark:text-gray-950 dark:hover:bg-indigo-500 dark:hover:text-white"
              >
                {samples.icon}
                <span>Load {samples.title}</span>
              </button>
            </div>
          </div>
        )}

        {feedback && (
          <div className="absolute top-4 right-4 rounded-lg bg-gray-950 px-3 py-1.5 font-mono text-[10px] font-bold text-white shadow-md animate-fadeIn dark:bg-white dark:text-gray-950 border border-white/10">
            {feedback}
          </div>
        )}
        
        {/* Helper Action Buttons Overlaid on Textarea Footer */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-150 pt-3 dark:border-gray-900">
          {/* Plugin Specific Quick Actions */}
          <div className="flex flex-wrap items-center gap-1.5">
            {plugin.actions.map((act) => (
              <button
                key={act.id}
                onClick={() => executeAction(act.run, act.label)}
                disabled={!text}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-35 disabled:hover:bg-white transition-all shadow-xs dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-white cursor-pointer"
              >
                {act.label}
              </button>
            ))}
          </div>

          {/* Standard Clear & Copy */}
          <div className="flex items-center space-x-1.5 ml-auto">
            <button
              onClick={handleCopy}
              disabled={!text}
              className="flex items-center space-x-1.5 rounded-lg bg-gray-950 px-4 py-2 text-xs font-bold text-white hover:bg-gray-800 disabled:opacity-35 disabled:hover:bg-gray-950 transition-all shadow-md dark:bg-white dark:text-gray-950 dark:hover:bg-gray-100 cursor-pointer"
              id="te-copy-btn"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
            <button
              onClick={() => {
                setText('');
                const nextStack = historyStack.slice(0, historyIndex + 1);
                setHistoryStack([...nextStack, '']);
                setHistoryIndex(nextStack.length);
                triggerFeedback('Scratchpad cleared');
              }}
              disabled={!text}
              className="flex items-center space-x-1.5 rounded-lg border border-red-100 bg-red-50/60 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-35 disabled:hover:bg-red-50/60 transition-all dark:border-red-950/20 dark:bg-red-950/10 dark:text-red-400 dark:hover:bg-red-950/20 cursor-pointer"
              id="te-clear-btn"
            >
              <Trash2 size={12} />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Secondary Detailed Insights Panel */}
      {plugin.renderInsights && plugin.renderInsights(text)}

    </div>
  );
}
