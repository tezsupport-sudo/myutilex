import React, { useState, useEffect } from 'react';
import { Copy, Trash2, Check, Download, Upload } from 'lucide-react';
import { TEXT_PLUGINS } from './textPlugins';

interface TextEngineProps {
  toolId: string;
}

export default function TextEngine({ toolId }: TextEngineProps) {
  const plugin = TEXT_PLUGINS[toolId];
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Clear text on engine tool change
  useEffect(() => {
    setText('');
    setFeedback(null);
  }, [toolId]);

  if (!plugin) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 font-sans text-xs text-red-800">
        Error: Text engine plugin with ID "{toolId}" not found in registered active manifests.
      </div>
    );
  }

  // Calculate dynamic metrics from plugin
  const metrics = plugin.calculateMetrics(text);

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
        setText(result);
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

  const triggerFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2500);
  };

  const executeAction = (run: (text: string) => string, actionLabel: string) => {
    if (!text) return;
    try {
      const result = run(text);
      setText(result);
      triggerFeedback(`Executed: ${actionLabel}`);
    } catch (e) {
      triggerFeedback('Action failed to run');
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 font-sans" id={`text-engine-${toolId}`}>
      
      {/* 1. Real-time Metric Cards Layout */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5" id="te-metrics-grid">
        {metrics.map((m, idx) => (
          <div 
            key={idx}
            className={`rounded-lg border p-3.5 text-center transition-all ${
              m.isAccent 
                ? 'border-emerald-200 bg-emerald-50/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]' 
                : 'border-gray-200 bg-gray-50/80 shadow-[0_1px_2px_rgba(0,0,0,0.01)]'
            }`}
          >
            <span className={`block font-mono text-[9px] font-bold uppercase tracking-widest ${m.isAccent ? 'text-emerald-700' : 'text-gray-500'}`}>
              {m.label}
            </span>
            <span className={`mt-1 block font-sans text-xl font-extrabold ${m.isAccent ? 'text-emerald-950' : 'text-gray-950'}`}>
              {m.value}
            </span>
          </div>
        ))}
      </div>

      {/* 2. Main File Operations and Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <span className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Interactive Scratchpad
        </span>
        
        <div className="flex items-center space-x-2">
          {/* File Upload Button */}
          <label className="flex items-center space-x-1.5 cursor-pointer rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            <Upload size={12} />
            <span>Upload File</span>
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
            className="flex items-center space-x-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
          >
            <Download size={12} />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* 3. Main Text Input Area */}
      <div className="relative">
        <textarea
          rows={9}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Start typing or paste your content here to begin dynamic ${plugin.name} processes...`}
          className="w-full rounded-lg border border-gray-200 bg-white p-4 font-sans text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
          id="te-textarea-field"
        />

        {feedback && (
          <div className="absolute top-2 right-2 rounded bg-gray-900 px-2 py-1 font-mono text-[10px] font-bold text-white shadow-sm animate-fadeIn">
            {feedback}
          </div>
        )}
        
        {/* Helper Action Buttons Overlaid on Textarea Footer */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-50 pt-2.5">
          {/* Plugin Specific Quick Actions */}
          <div className="flex flex-wrap items-center gap-1.5">
            {plugin.actions.map((act) => (
              <button
                key={act.id}
                onClick={() => executeAction(act.run, act.label)}
                disabled={!text}
                className="rounded-md border border-gray-200 px-2.5 py-1 text-[11px] font-semibold text-gray-600 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
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
              className="flex items-center space-x-1.5 rounded-md bg-gray-950 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-gray-800 disabled:opacity-40 disabled:hover:bg-gray-950 transition-all shadow-sm"
              id="te-copy-btn"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
            <button
              onClick={() => {
                setText('');
                triggerFeedback('Scratchpad cleared');
              }}
              disabled={!text}
              className="flex items-center space-x-1.5 rounded-md border border-red-100 bg-red-50 px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100/80 disabled:opacity-40 disabled:hover:bg-red-50 transition-all"
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
