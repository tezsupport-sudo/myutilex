import React from 'react';
import { motion } from 'motion/react';
import { 
  Cpu, HardDrive, ShieldAlert, Sparkles, Flame, CheckCircle, 
  Settings, Terminal, History, ArrowRight, Eye, RefreshCw, Layers, ShieldCheck
} from 'lucide-react';
import { designTokens } from '../designSystem';

export function WhyBrowserOnly() {
  return (
    <section className="border-b border-gray-150 py-16 transition-colors dark:border-gray-900" id="why-browser-only">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-12">
          
          {/* Narrative copy column */}
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-flex items-center gap-1 font-mono text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <Sparkles size={10} /> Localized Mainframe Architecture
            </span>
            <h2 className={designTokens.typography.displayL}>
              Why Running Tools Strictly <br />
              Inside Your Browser Matters.
            </h2>
            <p className={designTokens.typography.body}>
              Standard online text formatters, image converters, and development scratchpads operate on a remote server-proxy model. Every payload, draft, and configuration key you paste is sent over public connections to unknown cloud computing clusters.
            </p>
            <p className={designTokens.typography.body}>
              We turn your web browser into the mainframe. By loading executable logic directly into your CPU memory, we achieve three fundamental improvements over remote API servers:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={14} />
                <div>
                  <h4 className="font-sans font-bold text-xs text-gray-950 dark:text-white">Zero Server Ingress</h4>
                  <p className="font-sans text-[11px] text-gray-500 leading-normal">Data blocks are processed in RAM memory and are never written to any remote database.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={14} />
                <div>
                  <h4 className="font-sans font-bold text-xs text-gray-950 dark:text-white">Bypass Network Gaps</h4>
                  <p className="font-sans text-[11px] text-gray-500 leading-normal">Calculations complete in microseconds, immune to slow web connections or latency.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive visual diagnostic representation */}
          <div className="mt-10 lg:mt-0 lg:col-span-6">
            <div className="rounded-2xl border border-gray-150 bg-gray-50/50 p-6 dark:border-gray-800 dark:bg-gray-950/20 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/5 blur-[50px] rounded-full pointer-events-none" />
              
              <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                Architecture Visual Comparison
              </h3>

              {/* Server model */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-[11px] font-sans font-bold text-gray-500">
                  <span>Standard Remote Toolkits (Server Proxy)</span>
                  <span className="text-rose-500">Sluggish • 150-500ms</span>
                </div>
                <div className="relative rounded-lg bg-white border border-gray-150 p-3 flex items-center justify-between dark:bg-gray-900 dark:border-gray-800">
                  <span className="font-sans text-xs text-gray-700 dark:text-gray-300">You (Data Input)</span>
                  <div className="flex-1 mx-3 border-t-2 border-dashed border-rose-300 relative">
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] bg-rose-50 px-1 border border-rose-100 text-rose-600 rounded font-mono">Transit</span>
                  </div>
                  <span className="font-sans text-xs text-gray-700 dark:text-gray-300">Remote Cloud Server</span>
                </div>
              </div>

              {/* Local-first model */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-sans font-bold text-gray-500">
                  <span>SmartUtils Private Engine (Browser Mainframe)</span>
                  <span className="text-emerald-500 font-extrabold flex items-center gap-1">
                    <Flame size={12} /> Instantaneous • &lt; 5ms
                  </span>
                </div>
                <div className="rounded-lg bg-indigo-50/40 border border-indigo-100 p-3.5 flex items-center justify-between dark:bg-indigo-950/15 dark:border-indigo-900/40">
                  <span className="font-sans text-xs font-bold text-indigo-900 dark:text-indigo-300">You (Data Input)</span>
                  <div className="flex-1 mx-3 border-t-2 border-emerald-400 relative">
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] bg-emerald-50 px-1 border border-emerald-100 text-emerald-700 rounded font-mono uppercase tracking-widest">Local RAM</span>
                  </div>
                  <span className="font-sans text-xs font-bold text-indigo-900 dark:text-indigo-300">CPU Thread</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Type, Paste, or Drop',
      desc: 'Input text draft blocks, standard JSON, timestamps, or system parameters into any sandbox workspace.',
      icon: <Terminal size={18} className="text-indigo-600 dark:text-indigo-400" />
    },
    {
      num: '02',
      title: 'Local Client Compile',
      desc: 'SmartUtils executes targeted algorithms in sub-millisecond compiled routines entirely inside browser tab memory.',
      icon: <Cpu size={18} className="text-emerald-600 dark:text-emerald-400" />
    },
    {
      num: '03',
      title: 'Deterministic Output',
      desc: 'Results are displayed immediately. Export instantly via single-tap copy actions, clean text files, or direct downloads.',
      icon: <Settings size={18} className="text-amber-600 dark:text-amber-400" />
    }
  ];

  return (
    <section className="border-b border-gray-150 py-16 transition-colors dark:border-gray-900" id="how-it-works">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1 font-mono text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Settings size={11} /> Unified Workflow Engine
          </span>
          <h2 className={designTokens.typography.displayL + ' mt-1'}>
            Deterministic Local Workflow Cycle
          </h2>
          <p className="mt-2 font-sans text-xs text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Three simple, secure, offline-ready actions to convert, test, or generate parameters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group rounded-xl border border-gray-150 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 hover:border-indigo-400/50 hover:shadow-md transition-all duration-300">
              <span className="absolute right-6 top-6 font-mono text-3xl font-black text-gray-100 dark:text-gray-800 transition-colors group-hover:text-indigo-100/50">
                {step.num}
              </span>
              <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center mb-5 dark:bg-gray-850">
                {step.icon}
              </div>
              <h3 className="font-sans font-bold text-sm text-gray-950 dark:text-white">
                {step.title}
              </h3>
              <p className="mt-2 font-sans text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DeveloperQuality() {
  return (
    <section className="border-b border-gray-150 py-16 transition-colors dark:border-gray-900" id="developer-quality">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-12">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="inline-flex items-center gap-1 font-mono text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <CheckCircle size={10} /> ISO-Level Standards
            </span>
            <h2 className={designTokens.typography.displayL}>
              Engineering Quality & Reliability
            </h2>
            <p className={designTokens.typography.body}>
              SmartUtils is written with strict TypeScript type-safety, ensuring zero runtime undefined behaviors. We avoid heavy web-bloat or tracking scripts to load the entire engine suite in under 300 milliseconds.
            </p>
            <p className={designTokens.typography.body}>
              Our calculation engines use high-precision IEEE 754 math, custom cryptographic entropy generators, and standard compliant parsers (RFC 8259 for JSON) so that your configurations, hashes, and files are created with perfect deterministic accuracy.
            </p>
          </div>

          <div className="mt-8 lg:mt-0 lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-white border border-gray-150 dark:bg-gray-900 dark:border-gray-850">
              <h4 className="font-mono text-[10px] font-bold text-indigo-600 uppercase tracking-widest dark:text-indigo-400">
                01 • Typescript Compliant
              </h4>
              <p className="mt-2 font-sans text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Compile-verified structures mean stable, reliable local sandboxes without silent console crash cycles.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-white border border-gray-150 dark:bg-gray-900 dark:border-gray-850">
              <h4 className="font-mono text-[10px] font-bold text-indigo-600 uppercase tracking-widest dark:text-indigo-400">
                02 • Sub-Millisecond Speed
              </h4>
              <p className="mt-2 font-sans text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Compiled client scripts process 1,000,000 math operations or format 10,000 JSON lines in under 5ms.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-white border border-gray-150 dark:bg-gray-900 dark:border-gray-850">
              <h4 className="font-mono text-[10px] font-bold text-indigo-600 uppercase tracking-widest dark:text-indigo-400">
                03 • Cryptographic Entropy
              </h4>
              <p className="mt-2 font-sans text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Generators leverage cryptographically strong pseudo-random number generators (CSPRNG) inside Web APIs.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-white border border-gray-150 dark:bg-gray-900 dark:border-gray-850">
              <h4 className="font-mono text-[10px] font-bold text-indigo-600 uppercase tracking-widest dark:text-indigo-400">
                04 • Zero analytical cookies
              </h4>
              <p className="mt-2 font-sans text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Absolute clean network inspector audit. No Google Analytics, no Facebook Pixels, no remote scripts.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export function PrivacyPromise() {
  return (
    <section className="bg-indigo-900 text-white py-16 dark:bg-slate-950 border-y border-indigo-800 dark:border-gray-900" id="privacy-promise">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="inline-flex items-center gap-1 font-mono text-[9px] font-bold uppercase tracking-wider text-indigo-200">
          <ShieldCheck size={11} className="animate-pulse" /> Local-First Privacy Promise
        </span>
        <h2 className="font-sans font-bold text-2xl sm:text-4xl tracking-tight text-white">
          Our Architectural Privacy Guarantee.
        </h2>
        <p className="font-sans text-sm text-indigo-100 max-w-2xl mx-auto leading-relaxed">
          Unlike standard legal terms and disclaimers that can be altered or modified at will, our privacy promise is enforced directly by our <strong>Local-First client-side architecture</strong>.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs font-mono text-indigo-200">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>GDPR COMPLIANT (BY ARCHITECTURE)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>ZERO CLOUD COOKIES</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>NO DATA STORAGE INGRESS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
