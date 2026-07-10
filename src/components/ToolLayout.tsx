import React, { useState } from 'react';
import { ArrowLeft, Heart, BookOpen, FileText, HelpCircle, ChevronDown, ChevronUp, Settings2, Server, Cpu, Database, EyeOff, Layers, Key } from 'lucide-react';
import { ToolMetadata } from '../types';
import { TOOLS } from '../data/tools';

interface ToolLayoutProps {
  tool: ToolMetadata;
  onBack: () => void;
  onNavigate: (view: string) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  children: React.ReactNode;
}

export default function ToolLayout({
  tool,
  onBack,
  onNavigate,
  isFavorite,
  onToggleFavorite,
  children,
}: ToolLayoutProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Find related tools in the same category (excluding current tool)
  const relatedTools = TOOLS.filter((t) => t.category === tool.category && t.id !== tool.id).slice(0, 3);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8" id={`tool-layout-${tool.id}`}>
      
      {/* Sleek Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center space-x-2 font-sans text-xs text-gray-400" id="tool-breadcrumbs">
        <button onClick={onBack} className="hover:text-gray-900 transition-colors">Home</button>
        <span>/</span>
        <span className="capitalize">{tool.category}</span>
        <span>/</span>
        <span className="text-gray-600 font-medium truncate">{tool.name}</span>
      </nav>

      {/* Back Button & Tool Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4" id="tool-header">
        <div className="flex-1">
          <button
            onClick={onBack}
            className="group mb-3 inline-flex items-center space-x-1 font-mono text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
            <span>Go to Dashboard</span>
          </button>
          
          <h1 className="font-sans font-bold text-2xl text-gray-950 tracking-tight sm:text-3xl">
            {tool.name}
          </h1>
          <p className="mt-2 font-sans text-sm text-gray-500 leading-relaxed max-w-2xl">
            {tool.description}
          </p>
        </div>

        {/* Favorite Bookmark Button */}
        <button
          onClick={onToggleFavorite}
          className={`flex items-center space-x-2 self-start rounded-lg border px-3.5 py-2 text-xs font-medium transition-all ${
            isFavorite
              ? 'border-rose-100 bg-rose-50 text-rose-700 hover:bg-rose-100/80'
              : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
          }`}
          id="tool-favorite-toggle-btn"
        >
          <Heart size={14} fill={isFavorite ? 'currentColor' : 'none'} className={isFavorite ? 'text-rose-600' : ''} />
          <span>{isFavorite ? 'Bookmarked' : 'Add to Favorites'}</span>
        </button>
      </div>

      {/* Dynamic Quality & Compliance Indicators Section */}
      <div className="mb-6 grid grid-cols-2 gap-3.5 rounded-xl border border-gray-200 bg-gray-50/40 p-4 md:grid-cols-3 lg:grid-cols-6" id="tool-quality-indicators">
        <div className="flex items-center space-x-2 text-[11px] font-sans">
          <span className="text-emerald-600 font-bold shrink-0">✓</span>
          <span className="font-semibold text-gray-700">100% Browser Run</span>
        </div>
        <div className="flex items-center space-x-2 text-[11px] font-sans">
          <span className="text-emerald-600 font-bold shrink-0">✓</span>
          <span className="font-semibold text-gray-700">No Data Uploads</span>
        </div>
        <div className="flex items-center space-x-2 text-[11px] font-sans">
          <span className="text-indigo-600 font-bold shrink-0">✦</span>
          <span className="font-semibold text-gray-700">Difficulty: {tool.difficulty}</span>
        </div>
        <div className="flex items-center space-x-2 text-[11px] font-sans">
          <span className="text-amber-600 font-bold shrink-0">⏱</span>
          <span className="font-semibold text-gray-700">Est. Time: {tool.estimatedTime}</span>
        </div>
        <div className="flex items-center space-x-2 text-[11px] font-sans">
          <span className="text-emerald-600 font-bold shrink-0">✓</span>
          <span className="font-semibold text-gray-700">Engine: v{tool.version}</span>
        </div>
        <div className="flex items-center space-x-2 text-[11px] font-sans">
          <span className="text-emerald-600 font-bold shrink-0">✓</span>
          <span className="font-semibold text-gray-700">Latency: {tool.averageLatency}</span>
        </div>
      </div>

      {/* Main Core Tool Content Window */}
      <main className="mb-8 rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)]" id="tool-content-viewport">
        {children}
      </main>

      {/* Google AdSense Ready Container Placeholder */}
      <div className="mb-10 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-4 px-6 text-center sm:text-left" id="tool-adsense-banner">
        <div>
          <span className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Secure Utility Ad Partner</span>
          <span className="font-sans text-xs font-semibold text-gray-500">Supports free local client-side calculators</span>
        </div>
        <div className="text-[10px] font-sans text-gray-400 max-w-xs leading-normal sm:text-right">
          AdSense compliance spot. All computations are 100% private and execute locally inside your browser.
        </div>
      </div>

      {/* Informational Guides & Technical Specifications Drawer */}
      <section className="space-y-6 border-t border-gray-100 pt-8" id="tool-documentation">
        
        {/* Step-by-Step Guide */}
        <div className="rounded-xl bg-gray-50/80 p-6 border border-gray-200">
          <h3 className="font-sans font-semibold text-sm text-gray-950 flex items-center space-x-2">
            <BookOpen size={16} className="text-gray-400" />
            <span>How to use this tool</span>
          </h3>
          <ol className="mt-3.5 space-y-2.5 font-sans text-xs text-gray-500 list-decimal list-inside pl-1 leading-relaxed">
            {tool.howToUse.map((step, idx) => (
              <li key={idx} className="marker:text-gray-400">
                <span className="text-gray-600 pl-1.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Tool Metadata Engine & System Specifications */}
        <div className="rounded-xl border border-gray-200 bg-white p-6" id="tool-metadata-spec-sheet">
          <div className="border-b border-gray-100 pb-4 mb-4">
            <h3 className="font-sans font-semibold text-sm text-gray-950 flex items-center space-x-2">
              <Settings2 size={16} className="text-gray-400" />
              <span>Tool Metadata Engine &amp; System Specifications</span>
            </h3>
            <p className="font-sans text-[11px] text-gray-400 mt-0.5">Live configuration variables compiled from the operational sandbox environment.</p>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col space-y-1">
              <span className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest">Execution Sandbox</span>
              <span className="font-sans text-xs text-gray-700 font-semibold flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span>100% Client-Side Browser</span>
              </span>
            </div>

            <div className="flex flex-col space-y-1">
              <span className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest">Offline Capacity</span>
              <span className="font-sans text-xs text-gray-700 font-semibold flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span>Works 100% Offline</span>
              </span>
            </div>

            <div className="flex flex-col space-y-1">
              <span className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest">API Dependencies</span>
              <span className="font-sans text-xs text-gray-700 font-semibold flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span>No API Calls (Self-Contained)</span>
              </span>
            </div>

            <div className="flex flex-col space-y-1">
              <span className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest">AI Enhancement</span>
              <span className="font-sans text-xs text-gray-700 font-semibold flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                <span>Deterministic Native Engine</span>
              </span>
            </div>

            <div className="flex flex-col space-y-1">
              <span className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest">Drag &amp; Drop Parsing</span>
              <span className="font-sans text-xs text-gray-700 font-semibold flex items-center space-x-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${tool.supportsDragDrop ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
                <span>{tool.supportsDragDrop ? 'Fully Supported' : 'Manual Entry Only'}</span>
              </span>
            </div>

            <div className="flex flex-col space-y-1">
              <span className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest">Batch Processing</span>
              <span className="font-sans text-xs text-gray-700 font-semibold flex items-center space-x-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${tool.supportsBatch ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
                <span>{tool.supportsBatch ? 'Active Support' : 'Single Payload only'}</span>
              </span>
            </div>

            <div className="flex flex-col space-y-1">
              <span className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest">Buffered Payload Limit</span>
              <span className="font-sans text-xs text-gray-700 font-semibold flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                <span>{tool.fileSizeLimit || 'None'}</span>
              </span>
            </div>

            <div className="flex flex-col space-y-1">
              <span className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest">Certified Compatibility</span>
              <span className="font-sans text-xs text-gray-700 font-semibold truncate leading-normal" title={tool.browserCompatibility}>
                {tool.browserCompatibility}
              </span>
            </div>

            <div className="flex flex-col space-y-1">
              <span className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest">Device Viewport Ready</span>
              <span className="font-sans text-xs text-gray-700 font-semibold flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span>Mobile Responsive &amp; Touch-ready</span>
              </span>
            </div>

            <div className="flex flex-col space-y-1">
              <span className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest">Keyboard Acceleration</span>
              <span className="font-sans text-xs text-gray-700 font-semibold flex items-center space-x-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${tool.hasKeyboardShortcuts ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                <span>{tool.hasKeyboardShortcuts ? 'Shortcuts Configured' : 'Standard Accessibility'}</span>
              </span>
            </div>

            <div className="flex flex-col space-y-1">
              <span className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest">Execution Engine</span>
              <span className="font-sans text-xs text-gray-700 font-semibold">
                Version {tool.version}
              </span>
            </div>

            <div className="flex flex-col space-y-1">
              <span className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest">Response Latency baseline</span>
              <span className="font-sans text-xs text-gray-700 font-semibold">
                {tool.averageLatency}
              </span>
            </div>
          </div>
        </div>

        {/* Technical/Formula Specification */}
        {tool.formulaTitle && (
          <div className="rounded-xl bg-slate-50/80 p-6 border border-slate-200">
            <h3 className="font-sans font-semibold text-sm text-slate-900 flex items-center space-x-2">
              <FileText size={16} className="text-slate-400" />
              <span>{tool.formulaTitle}</span>
            </h3>
            <p className="mt-2.5 font-mono text-xs text-slate-600 leading-relaxed">
              {tool.formulaDescription}
            </p>
          </div>
        )}

        {/* Structured FAQs */}
        {tool.faqs.length > 0 && (
          <div>
            <h3 className="font-sans font-semibold text-sm text-gray-950 flex items-center space-x-2 mb-4">
              <HelpCircle size={16} className="text-gray-400" />
              <span>Frequently Asked Questions</span>
            </h3>
            <div className="space-y-2.5">
              {tool.faqs.map((faq, index) => (
                <div key={index} className="rounded-lg border border-gray-200 bg-white">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex w-full items-center justify-between px-4 py-3.5 text-left text-xs font-semibold text-gray-800 hover:bg-gray-50/50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    {openFaqIndex === index ? (
                      <ChevronUp size={14} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={14} className="text-gray-400" />
                    )}
                  </button>
                  {openFaqIndex === index && (
                    <div className="border-t border-gray-200 px-4 py-3 text-xs text-gray-500 leading-relaxed font-sans bg-gray-50/30">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Related Tools Recommendation Bar */}
        {relatedTools.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
              Similar utilities you might like
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {relatedTools.map((rt) => (
                <button
                  key={rt.id}
                  onClick={() => onNavigate(`tool-${rt.id}`)}
                  className="flex flex-col items-start rounded-lg border border-gray-200 bg-white p-3.5 text-left transition-all hover:border-gray-400 hover:shadow-sm"
                >
                  <span className="font-sans font-semibold text-xs text-gray-900 line-clamp-1">{rt.name}</span>
                  <span className="mt-1 font-sans text-[11px] text-gray-400 line-clamp-1">{rt.description}</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </section>

    </div>
  );
}
