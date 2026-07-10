import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Type, LayoutGrid, Square, Sparkles, 
  Palette, Sun, Moon, Zap, ShieldCheck, Heart, Share2, Info
} from 'lucide-react';
import { designTokens } from '../designSystem';
import { useToast } from './Toast';

interface DesignSystemViewProps {
  onBack: () => void;
}

export default function DesignSystemView({ onBack }: DesignSystemViewProps) {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'tokens' | 'components' | 'motion'>('tokens');
  const [animationTrigger, setAnimationTrigger] = useState(0);

  const handleTestToast = (type: 'success' | 'error' | 'warning' | 'info') => {
    showToast(`Design System active state triggered: ${type.toUpperCase()}`, type);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-150 pb-6 dark:border-gray-800">
        <div>
          <button
            onClick={onBack}
            className="group mb-3 flex items-center space-x-1 font-sans text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors dark:text-indigo-400 dark:hover:text-indigo-300 cursor-pointer"
          >
            <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className={designTokens.typography.displayL}>
            Design System Guidelines
          </h1>
          <p className="mt-1 font-sans text-xs text-gray-500 dark:text-gray-400">
            Sprint 4.4 "Professional Product Intelligence" — Visual tokens and interactive showcases.
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex rounded-xl bg-gray-100 p-1 dark:bg-gray-900/60 self-start md:self-center">
          {(['tokens', 'components', 'motion'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-3.5 py-1.5 font-sans text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-gray-800 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Pane */}
      {activeTab === 'tokens' && (
        <div className="space-y-8 animate-fade-in">
          {/* Colors */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
            <h3 className="mb-4 font-sans font-bold text-sm text-gray-900 dark:text-white flex items-center space-x-2">
              <Palette size={16} className="text-indigo-500" />
              <span>Color Token Palette</span>
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-950/30 dark:bg-emerald-950/10">
                <span className="font-sans text-xs font-bold text-emerald-800 dark:text-emerald-400">Success Token</span>
                <span className="mt-1 block font-mono text-[10px] text-emerald-600 dark:text-emerald-500">colors.success</span>
                <p className="mt-2 font-sans text-xs text-gray-500">Used for valid calculations, completions, and positive status.</p>
              </div>
              <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 dark:border-amber-950/30 dark:bg-amber-950/10">
                <span className="font-sans text-xs font-bold text-amber-800 dark:text-amber-400">Warning Token</span>
                <span className="mt-1 block font-mono text-[10px] text-amber-600 dark:text-amber-500">colors.warning</span>
                <p className="mt-2 font-sans text-xs text-gray-500">Used for pending actions, batch execution state, and data alerts.</p>
              </div>
              <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-4 dark:border-rose-950/30 dark:bg-rose-950/10">
                <span className="font-sans text-xs font-bold text-rose-800 dark:text-rose-400">Danger Token</span>
                <span className="mt-1 block font-mono text-[10px] text-rose-600 dark:text-rose-500">colors.danger</span>
                <p className="mt-2 font-sans text-xs text-gray-500">Used for errors, deletions, limitations, and invalid formats.</p>
              </div>
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-950/30 dark:bg-indigo-950/10">
                <span className="font-sans text-xs font-bold text-indigo-800 dark:text-indigo-400">Info Token</span>
                <span className="mt-1 block font-mono text-[10px] text-indigo-600 dark:text-indigo-500">colors.info</span>
                <p className="mt-2 font-sans text-xs text-gray-500">Used for details, metadata indicators, guides, and notifications.</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/40">
                <span className="font-sans text-xs font-bold text-gray-700 dark:text-gray-300">Neutral Token</span>
                <span className="mt-1 block font-mono text-[10px] text-gray-500">colors.neutral</span>
                <p className="mt-2 font-sans text-xs text-gray-500">Used for secondary buttons, logs, passive states, and headers.</p>
              </div>
              <div className="rounded-xl border border-transparent bg-indigo-600 p-4 text-white dark:bg-indigo-500 shadow-sm">
                <span className="font-sans text-xs font-bold">Accent Token</span>
                <span className="mt-1 block font-mono text-[10px] text-indigo-200">colors.accent</span>
                <p className="mt-2 font-sans text-xs text-indigo-100">Primary branding color. Drives attention to key conversion steps.</p>
              </div>
            </div>
          </section>

          {/* Typography */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
            <h3 className="mb-4 font-sans font-bold text-sm text-gray-900 dark:text-white flex items-center space-x-2">
              <Type size={16} className="text-indigo-500" />
              <span>Typography Scale Hierarchy</span>
            </h3>
            <div className="space-y-5">
              <div className="border-b border-gray-100 pb-3 dark:border-gray-800">
                <span className="font-mono text-[10px] text-gray-400">Display XL (font-sans, font-extrabold, tracking-tight, 32px-48px)</span>
                <div className={designTokens.typography.displayXl}>Hello world.</div>
              </div>
              <div className="border-b border-gray-100 pb-3 dark:border-gray-800">
                <span className="font-mono text-[10px] text-gray-400">Display L (font-sans, font-bold, tracking-tight, 24px-30px)</span>
                <div className={designTokens.typography.displayL}>Professional Intelligence</div>
              </div>
              <div className="border-b border-gray-100 pb-3 dark:border-gray-800">
                <span className="font-mono text-[10px] text-gray-400">Heading (font-sans, font-bold, tracking-tight, 18px-20px)</span>
                <div className={designTokens.typography.heading}>Engine Configuration Console</div>
              </div>
              <div className="border-b border-gray-100 pb-3 dark:border-gray-800">
                <span className="font-mono text-[10px] text-gray-400">Subheading (font-sans, font-semibold, color-muted, 14px)</span>
                <div className={designTokens.typography.subheading}>Interactive Client-Side Security Sandbox</div>
              </div>
              <div className="border-b border-gray-100 pb-3 dark:border-gray-800">
                <span className="font-mono text-[10px] text-gray-400">Body (font-sans, color-balanced, line-relaxed, 12px-14px)</span>
                <div className={designTokens.typography.body}>
                  All user variables, payloads, and files are processed strictly inside your local browser tab. No remote upload happens.
                </div>
              </div>
              <div className="border-b border-gray-100 pb-3 dark:border-gray-800">
                <span className="font-mono text-[10px] text-gray-400">Caption (font-sans, color-muted, 11px)</span>
                <div className={designTokens.typography.caption}>Created on 2026-07-10 • Standard ISO Compliance</div>
              </div>
              <div>
                <span className="font-mono text-[10px] text-gray-400">Mono (font-mono, 12px)</span>
                <div className={designTokens.typography.mono}>UTC_TIMESTAMP: 2026-07-10T13:44:00Z</div>
              </div>
            </div>
          </section>

          {/* Spacing & Corner Radius */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Spacing */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
              <h3 className="mb-4 font-sans font-bold text-sm text-gray-900 dark:text-white flex items-center space-x-2">
                <LayoutGrid size={16} className="text-indigo-500" />
                <span>Pixel Spacing Scale</span>
              </h3>
              <div className="space-y-3">
                {[
                  { label: 's4 (4px)', width: 'w-1', class: 'bg-indigo-100 dark:bg-indigo-950/40' },
                  { label: 's8 (8px)', width: 'w-2', class: 'bg-indigo-200 dark:bg-indigo-900/40' },
                  { label: 's12 (12px)', width: 'w-3', class: 'bg-indigo-300 dark:bg-indigo-850/40' },
                  { label: 's16 (16px)', width: 'w-4', class: 'bg-indigo-400 dark:bg-indigo-800/40' },
                  { label: 's20 (20px)', width: 'w-5', class: 'bg-indigo-500 dark:bg-indigo-750/40' },
                  { label: 's24 (24px)', width: 'w-6', class: 'bg-indigo-600 dark:bg-indigo-700/40' },
                  { label: 's32 (32px)', width: 'w-8', class: 'bg-indigo-700 dark:bg-indigo-650/40' },
                  { label: 's48 (48px)', width: 'w-12', class: 'bg-indigo-800 dark:bg-indigo-600/40' },
                  { label: 's64 (64px)', width: 'w-16', class: 'bg-indigo-900 dark:bg-indigo-500/40' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center space-x-4">
                    <span className="w-24 font-mono text-[11px] text-gray-500">{item.label}</span>
                    <div className={`h-4 rounded ${item.width} ${item.class}`} />
                  </div>
                ))}
              </div>
            </section>

            {/* Corner Radius */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
              <h3 className="mb-4 font-sans font-bold text-sm text-gray-900 dark:text-white flex items-center space-x-2">
                <Square size={16} className="text-indigo-500" />
                <span>Corner Radius Scale</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-md border border-gray-200 p-4 text-center dark:border-gray-800">
                  <span className="block font-mono text-[10px] text-gray-400">Small (6px)</span>
                  <span className="mt-1 block font-sans text-xs font-bold">rounded-md</span>
                </div>
                <div className="rounded-lg border border-gray-200 p-4 text-center dark:border-gray-800">
                  <span className="block font-mono text-[10px] text-gray-400">Medium (8px)</span>
                  <span className="mt-1 block font-sans text-xs font-bold">rounded-lg</span>
                </div>
                <div className="rounded-xl border border-gray-200 p-4 text-center dark:border-gray-800">
                  <span className="block font-mono text-[10px] text-gray-400">Large (12px)</span>
                  <span className="mt-1 block font-sans text-xs font-bold">rounded-xl</span>
                </div>
                <div className="rounded-2xl border border-gray-200 p-4 text-center dark:border-gray-800">
                  <span className="block font-mono text-[10px] text-gray-400">XL (16px)</span>
                  <span className="mt-1 block font-sans text-xs font-bold">rounded-2xl</span>
                </div>
              </div>

              {/* Shadow System */}
              <h3 className="mb-4 mt-6 font-sans font-bold text-xs text-gray-900 dark:text-white uppercase tracking-wider">
                Shadow System Elevation
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-white p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-gray-150/40 dark:bg-gray-800/20 dark:border-gray-800">
                  <span className="font-sans text-xs text-gray-600 dark:text-gray-400">Elevation 1 (Light)</span>
                  <span className="font-mono text-[9px] text-gray-400">shadow-light</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white p-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-150/40 dark:bg-gray-800/20 dark:border-gray-800">
                  <span className="font-sans text-xs text-gray-600 dark:text-gray-400">Elevation 2 (Medium)</span>
                  <span className="font-mono text-[9px] text-gray-400">shadow-medium</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white p-2.5 shadow-[0_12px_30px_rgba(99,102,241,0.06)] border border-gray-150/40 dark:bg-gray-800/20 dark:border-gray-800">
                  <span className="font-sans text-xs text-gray-600 dark:text-gray-400">Elevation 3 (Large)</span>
                  <span className="font-mono text-[9px] text-gray-400">shadow-large</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {activeTab === 'components' && (
        <div className="space-y-8 animate-fade-in">
          {/* Button tokens */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
            <h3 className="mb-4 font-sans font-bold text-sm text-gray-900 dark:text-white">
              Button Components
            </h3>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => handleTestToast('success')}
                className="rounded-lg bg-indigo-600 px-4 py-2 font-sans text-xs font-bold text-white hover:bg-indigo-700 transition-all cursor-pointer shadow-sm active:scale-95"
              >
                Primary Button
              </button>
              <button 
                onClick={() => handleTestToast('info')}
                className="rounded-lg border border-gray-250 bg-white px-4 py-2 font-sans text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-850 active:scale-95"
              >
                Secondary Button
              </button>
              <button 
                onClick={() => handleTestToast('info')}
                className="rounded-lg px-4 py-2 font-sans text-xs font-semibold text-gray-500 hover:bg-gray-150 hover:text-gray-800 transition-all cursor-pointer dark:hover:bg-gray-800 dark:hover:text-white"
              >
                Ghost Button
              </button>
              <button 
                onClick={() => handleTestToast('error')}
                className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-2 font-sans text-xs font-bold text-rose-700 hover:bg-rose-100 transition-all cursor-pointer dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-400 active:scale-95"
              >
                Danger Button
              </button>
              <button 
                onClick={() => handleTestToast('success')}
                className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-2 font-sans text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-all cursor-pointer dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-400 active:scale-95"
              >
                Success Button
              </button>
            </div>
          </section>

          {/* Card Styles */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tool Card & Category Card */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
                <h4 className="mb-4 font-sans font-bold text-xs text-gray-500 uppercase tracking-wider">Tool Card Demo</h4>
                <div className="group relative cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-light hover:border-indigo-500/50 hover:shadow-large transition-all duration-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-400/30">
                  <div className="flex items-start space-x-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-all group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950/40 dark:text-indigo-400 dark:group-hover:bg-indigo-500">
                      <Sparkles size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-sans text-sm font-semibold text-gray-900 dark:text-white truncate">JSON Validator</h4>
                      <p className="mt-1 font-sans text-xs text-gray-500 dark:text-gray-400 line-clamp-1">Inspect, structure and clean code strings</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
                <h4 className="mb-4 font-sans font-bold text-xs text-gray-500 uppercase tracking-wider">Category Selector Card</h4>
                <div className="flex rounded-lg border border-indigo-100 bg-indigo-50/10 px-3 py-2 text-xs font-semibold text-indigo-600 dark:border-indigo-900/30 dark:bg-indigo-950/20 dark:text-indigo-400">
                  Active Filter: Developer Tools
                </div>
              </div>
            </div>

            {/* Metric & Glass Notification Cards */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
                <h4 className="mb-4 font-sans font-bold text-xs text-gray-500 uppercase tracking-wider">Live Metric Cards</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-gray-150 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-950/20">
                    <span className="block font-mono text-2xl font-black text-gray-900 dark:text-white leading-none">0 Bytes</span>
                    <span className="mt-1 block font-sans text-[10px] font-bold text-gray-400 uppercase tracking-widest">Uploaded</span>
                  </div>
                  <div className="rounded-xl border border-emerald-100 bg-emerald-500/[0.02] p-4 dark:border-emerald-900/20">
                    <span className="block font-mono text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-none">100% Secure</span>
                    <span className="mt-1 block font-sans text-[10px] font-bold text-gray-400 uppercase tracking-widest">Safe Sandbox</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
                <h4 className="mb-4 font-sans font-bold text-xs text-gray-500 uppercase tracking-wider">Glass Notification Card</h4>
                <div className="flex items-center justify-between rounded-xl border border-indigo-100 bg-white p-3.5 shadow-lg backdrop-blur-md dark:border-indigo-950/40 dark:bg-gray-900">
                  <div className="flex items-center space-x-3">
                    <Info className="h-4.5 w-4.5 text-indigo-500" />
                    <span className="font-sans text-xs font-semibold text-gray-800 dark:text-gray-200">System is ready for local validation</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'motion' && (
        <div className="space-y-8 animate-fade-in">
          {/* Spring Playground */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
            <h3 className="mb-4 font-sans font-bold text-sm text-gray-900 dark:text-white">
              Framer Motion Active Testing Console
            </h3>
            <p className="mb-6 font-sans text-xs text-gray-500">
              Test live spring configurations and interactive hover triggers that align with Notion, Linear, and Apple experiences.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Box 1: Spring Default */}
              <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
                <span className="font-sans text-xs font-bold text-gray-700 dark:text-gray-300">Standard Spring</span>
                <span className="mt-1 block font-mono text-[9px] text-gray-400">damping: 26, stiffness: 350</span>
                
                <div className="mt-6 flex justify-center">
                  <motion.div
                    animate={{ rotate: animationTrigger * 18, rotateX: animationTrigger * 15 }}
                    transition={designTokens.animations.spring}
                    className="h-16 w-16 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-lg cursor-pointer flex items-center justify-center text-white font-bold text-xs"
                    onClick={() => setAnimationTrigger(prev => prev + 1)}
                  >
                    Click Me
                  </motion.div>
                </div>
              </div>

              {/* Box 2: Spring Tight */}
              <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
                <span className="font-sans text-xs font-bold text-gray-700 dark:text-gray-300">Tight Elastic Spring</span>
                <span className="mt-1 block font-mono text-[9px] text-gray-400">damping: 20, stiffness: 400</span>
                
                <div className="mt-6 flex justify-center">
                  <motion.div
                    animate={{ scale: animationTrigger % 2 === 0 ? 1 : 1.25 }}
                    transition={designTokens.animations.springTight}
                    className="h-16 w-16 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 shadow-lg cursor-pointer flex items-center justify-center text-white font-bold text-xs"
                    onClick={() => setAnimationTrigger(prev => prev + 1)}
                  >
                    Test Scale
                  </motion.div>
                </div>
              </div>

              {/* Box 3: Hover Elastic scale */}
              <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
                <span className="font-sans text-xs font-bold text-gray-700 dark:text-gray-300">Hover Translation</span>
                <span className="mt-1 block font-mono text-[9px] text-gray-400">y: -4, scale: 1.01</span>
                
                <div className="mt-6 flex justify-center">
                  <motion.div
                    whileHover={designTokens.animations.hoverScale}
                    transition={designTokens.animations.spring}
                    className="h-16 w-16 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-600 shadow-lg cursor-pointer flex items-center justify-center text-white font-bold text-xs"
                  >
                    Hover Me
                  </motion.div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
