import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  ShieldCheck, 
  HelpCircle, 
  BookOpen, 
  ArrowLeft, 
  Search, 
  Layers, 
  CheckCircle, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Fingerprint,
  Lock,
  Compass
} from 'lucide-react';
import { FAQItem } from '../types';

interface DocumentationCenterProps {
  onBack: () => void;
  initialTab?: string;
}

export default function DocumentationCenter({ onBack, initialTab = 'architecture' }: DocumentationCenterProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [faqSearch, setFaqSearch] = useState('');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const tabs = [
    { id: 'architecture', label: 'System Architecture', icon: Cpu },
    { id: 'privacy', label: 'Privacy Assurances', icon: ShieldCheck },
    { id: 'faq', label: 'Interactive FAQs', icon: HelpCircle },
    { id: 'personality', label: 'Platform Personality', icon: BookOpen },
  ];

  const faqs: FAQItem[] = [
    {
      question: 'How does Utility Hub process files and inputs offline?',
      answer: 'Utility Hub is designed around a strictly local execution model. When you upload a text file, paste JSON payload, or process calculations, the system invokes standard web APIs (such as the File Reader API, Web Workers, or native browser engines) running directly inside your client-side container. No network sockets or external servers are contacted during formatting or compilation.'
    },
    {
      question: 'Are there any hidden cloud logs or telemetry reporting mechanisms?',
      answer: 'Absolutely none. We operate under a strict zero-telemetry principle. While typical utility websites load heavy analytics, session recording, and marketing pixels that harvest your technical payload and IP addresses, Utility Hub contains no server trackers or analytical callouts. Your local browser statistics are saved only in local state to enrich your immediate dashboard.'
    },
    {
      question: 'Does Utility Hub support keyboard-first access and shortcuts?',
      answer: 'Yes. The entire operating deck is fully optimized for keyboard navigation. You can summon the universal Command Palette at any point using Cmd+K (macOS) or Ctrl+K (Windows/Linux). Pressing the ? key anywhere outside form inputs will launch the Shortcuts Help panel detailing precise key combinations for prompt actions.'
    },
    {
      question: 'What are the technical file boundaries for local client-side tools?',
      answer: 'Since formatting is processed directly on your system memory (RAM), files of up to 50MB (for JSON payloads) and 100MB (for character counters) are parsed in milliseconds. For heavy multi-megabyte compressions, the background threads ensure the browser interface remains fluid and non-blocking.'
    },
    {
      question: 'Is Utility Hub open source and safe for institutional enterprise tasks?',
      answer: 'Utility Hub is fully transparent and open source. All libraries, including text processing filters and mathematical structures, run sandbox environments. We make zero external database calls, satisfying the most stringent GDPR, CCPA, and corporate compliance benchmarks.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(faqSearch.toLowerCase()) || 
    faq.answer.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans"
      id="doc-center-container"
    >
      {/* Navigation Header */}
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
            Knowledge &amp; Documentation
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Standard specifications, data flow, architecture standards, and voice style-guides.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8" id="doc-grid-layout">
        {/* Left Side Navigation Tabs */}
        <div className="w-full lg:w-64 shrink-0 space-y-1" id="doc-left-sidebar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-bold transition-all border cursor-pointer ${
                  isSelected 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-850'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Side Content Pane */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 md:p-8 dark:bg-gray-900 dark:border-gray-850" id="doc-content-pane">
          <AnimatePresence mode="wait">
            {activeTab === 'architecture' && (
              <motion.div
                key="architecture"
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-lg font-bold text-gray-950 dark:text-white flex items-center gap-2">
                    <Layers className="text-indigo-600 dark:text-indigo-400" size={18} />
                    <span>System Architecture Overview</span>
                  </h2>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    How Utility Hub coordinates memory-safe browser-local compilation.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-850/60 border border-gray-100 dark:border-gray-800">
                    <span className="font-mono text-[9px] font-bold text-indigo-600 uppercase tracking-widest block mb-1">Layer 1</span>
                    <h3 className="font-sans font-bold text-xs text-gray-900 dark:text-white">Secure Sandbox Runtime</h3>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      Every tool component is running inside a reactive virtual node wrapper. All inputs are evaluated strictly within memory buffers, bypassing traditional file-write leaks.
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-850/60 border border-gray-100 dark:border-gray-800">
                    <span className="font-mono text-[9px] font-bold text-emerald-600 uppercase tracking-widest block mb-1">Layer 2</span>
                    <h3 className="font-sans font-bold text-xs text-gray-900 dark:text-white">Zero Server Transfers</h3>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      All calculations are performed by standard browser processors (V8 JavaScript engine). No server endpoints are invoked, making executions immune to cloud hacks or remote interception.
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-150 pt-5 dark:border-gray-800 space-y-3">
                  <h3 className="font-sans font-bold text-xs text-gray-900 dark:text-white">Core Technologies</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px]">
                    <div className="p-2 border border-gray-150 rounded bg-white text-center dark:border-gray-800 dark:bg-gray-950">React 18 + Vite</div>
                    <div className="p-2 border border-gray-150 rounded bg-white text-center dark:border-gray-800 dark:bg-gray-950">Tailwind CSS v4</div>
                    <div className="p-2 border border-gray-150 rounded bg-white text-center dark:border-gray-800 dark:bg-gray-950">Lucide UI Core</div>
                    <div className="p-2 border border-gray-150 rounded bg-white text-center dark:border-gray-800 dark:bg-gray-950">Web Cryptography</div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'privacy' && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-lg font-bold text-gray-950 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="text-emerald-600 dark:text-emerald-400" size={18} />
                    <span>Privacy Assurances Ledger</span>
                  </h2>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Our technical guarantees of data confidentiality and complete isolation.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3.5 items-start p-4 bg-emerald-50/40 rounded-xl border border-emerald-100/50 dark:bg-emerald-950/10 dark:border-emerald-900/10 text-emerald-850 dark:text-emerald-350">
                    <Lock className="shrink-0 mt-0.5" size={16} />
                    <div>
                      <h4 className="font-sans font-bold text-xs">The Offline Guarantee</h4>
                      <p className="mt-1 text-xs text-emerald-700/80 dark:text-emerald-400/80 leading-normal">
                        Utility Hub relies solely on native browser compilers. In contrast to online convertors that stream text to cloud storage, we execute 100% of the conversions inside client memory space.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 font-sans text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    <h4 className="font-bold text-gray-900 dark:text-white">Strict Compliance Standards</h4>
                    <p>
                      We conform completely to strict international guidelines:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>GDPR Protocol:</strong> Since no personal tracking information, cookies, or payloads are stored or passed to telemetry processors, user privacy is inherently protected.</li>
                      <li><strong>Zero Cookie Payload:</strong> We set zero tracking cookies, preventing behavioral marketing profiling.</li>
                      <li><strong>Secure Local Sandboxing:</strong> All data stored in localStorage (such as favorites or history logs) is fully controlled by your native web browser and cleared instantly when cache is purged.</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'faq' && (
              <motion.div
                key="faq"
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <h2 className="text-lg font-bold text-gray-950 dark:text-white flex items-center gap-2">
                      <HelpCircle className="text-indigo-600 dark:text-indigo-400" size={18} />
                      <span>Interactive FAQ Center</span>
                    </h2>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Frequently asked questions about safety and operations.
                    </p>
                  </div>
                  <div className="relative max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search FAQs..."
                      value={faqSearch}
                      onChange={(e) => setFaqSearch(e.target.value)}
                      className="rounded-lg border border-gray-200 bg-white pl-8.5 pr-3 py-1 font-sans text-xs text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-3" id="faq-accordions">
                  {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq, idx) => {
                      const isOpen = openFaqIdx === idx;
                      return (
                        <div 
                          key={idx}
                          className="border border-gray-150 rounded-xl bg-gray-50/40 dark:border-gray-850 dark:bg-gray-900/40 overflow-hidden"
                        >
                          <button
                            onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                            className="w-full flex items-center justify-between px-5 py-4 text-left font-sans font-bold text-xs text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-850 cursor-pointer transition-colors"
                          >
                            <span>{faq.question}</span>
                            {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                          {isOpen && (
                            <div className="px-5 pb-4 text-xs text-gray-500 dark:text-gray-400 leading-relaxed border-t border-gray-150 dark:border-gray-850 pt-3">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-xs text-gray-400">
                      No FAQs found matching &quot;{faqSearch}&quot;.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'personality' && (
              <motion.div
                key="personality"
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-lg font-bold text-gray-950 dark:text-white flex items-center gap-2">
                    <BookOpen className="text-violet-600 dark:text-violet-400" size={18} />
                    <span>Platform Content Style Guide</span>
                  </h2>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Priority 18 Compliance: Principles that keep our copy professional and distraction-free.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl border border-dashed border-gray-200 p-4 dark:border-gray-800">
                    <h3 className="font-sans font-bold text-xs text-gray-950 dark:text-white flex items-center gap-1.5 mb-2">
                      <Compass size={14} className="text-violet-500" />
                      <span>Minimalist Tone of Voice</span>
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      We never use emotional self-praise or marketing sales-pitch wording (such as &quot;spectacular&quot;, &quot;mind-blowing&quot;, or &quot;revolutionary&quot;). Our words should remain quiet, precise, objective, and humbleness. We represent facts exactly as they operate.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans text-gray-500 dark:text-gray-400 leading-normal">
                    <div className="space-y-2">
                      <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                        <CheckCircle size={12} className="text-emerald-500" /> Correct Vocabulary
                      </h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>&quot;Execute client-side calculation&quot;</li>
                        <li>&quot;Secure offline storage&quot;</li>
                        <li>&quot;Input validation checklist&quot;</li>
                        <li>&quot;CSPRNG Entropy Engine&quot;</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-rose-600 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Prohibited Overhype
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-400 dark:text-gray-500">
                        <li>&quot;The ultimate mind-blowing converter&quot;</li>
                        <li>&quot;Harness next-gen magical cloud intelligence&quot;</li>
                        <li>&quot;Stellar state-of-the-art revolutionary tool&quot;</li>
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-xl bg-violet-50/30 p-4 dark:bg-violet-950/10 border border-violet-100/50 dark:border-violet-900/10 text-xs text-violet-900/80 dark:text-violet-400/85">
                    <h4 className="font-bold flex items-center gap-1">
                      <Sparkles size={13} /> Visual Consistency Standards
                    </h4>
                    <p className="mt-1 leading-normal">
                      Maintain Inter as primary body font, JetBrains Mono for telemetry metrics, and a clean slate color palette. Micro-interactions should utilize a soft easing curves with 150ms to 200ms durations to reduce mental strain.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
