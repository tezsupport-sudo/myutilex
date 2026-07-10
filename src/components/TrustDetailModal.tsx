import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, EyeOff, Lock, Zap, Cpu, X, Sparkles } from 'lucide-react';
import { designTokens } from '../designSystem';

interface TrustDetailModalProps {
  cardId: string | null;
  onClose: () => void;
}

export default function TrustDetailModal({ cardId, onClose }: TrustDetailModalProps) {
  if (!cardId) return null;

  const cardsInfo: Record<string, {
    title: string;
    icon: React.ReactNode;
    colorClass: string;
    description: string;
    technicalDetails: string[];
  }> = {
    offline: {
      title: 'Works 100% Offline',
      icon: <ShieldCheck size={28} />,
      colorClass: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400',
      description: 'The entire application suite is packaged directly into client-side asset bundles. All calculators, text analyzers, and image compressors execute without ever sending a network packet.',
      technicalDetails: [
        'Zero network API requests or dependencies',
        'Service Worker ready for standard network disconnections',
        'Safe to use in deep sandboxed high-security environments',
        'Load once, use forever even without Wi-Fi or cellular service'
      ]
    },
    privacy: {
      title: 'Privacy Guaranteed by Architecture',
      icon: <EyeOff size={28} />,
      colorClass: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400',
      description: 'Your sensitive text blocks, database keys, base64 strings, and uploaded files are restricted to your local tab memory. Absolutely no external remote tracking is present.',
      technicalDetails: [
        'Zero telemetry, analytical logging, or cookie trackers',
        'Variables are stored strictly in dynamic RAM and discarded instantly on tab close',
        'No server-side proxying is used for any formatting or conversion',
        'Fully GDPR, HIPAA, and CCPA compliant by design'
      ]
    },
    accounts: {
      title: 'No Registration or Accounts Required',
      icon: <Lock size={28} />,
      colorClass: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400',
      description: 'We do not capture your email, billing, or identification metrics. You are completely anonymous. No registration queues, signups, or database profiles.',
      technicalDetails: [
        'No marketing newsletters or promotional email spam',
        'Favorites and history are stored locally in your browser\'s LocalStorage',
        'Completely friction-free workflows without sign-in prompts',
        'Immediate startup with single-click launcher buttons'
      ]
    },
    speed: {
      title: 'Deterministic Local Hardware Speed',
      icon: <Zap size={28} />,
      colorClass: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400',
      description: 'Sluggish API servers and round-trip ping times are eliminated. Code execution happens instantly at local processing speed using highly-optimized JavaScript and Canvas rendering.',
      technicalDetails: [
        'Sub-millisecond computational loops',
        'Bypass heavy cloud queues and multi-user throttling',
        'Parallel processing using Web Workers and local hardware threading',
        'Direct RAM-to-screen pipeline visualization'
      ]
    },
    free: {
      title: 'Free Forever',
      icon: <Cpu size={28} />,
      colorClass: 'text-violet-600 bg-violet-50 dark:bg-violet-950/40 dark:text-violet-400',
      description: 'Our software has no premium upsells, tier limits, file caps, or credit card forms. The complete toolkit is freely available and runs directly inside your standard web layout.',
      technicalDetails: [
        'No features hidden behind premium paywalls',
        'No ads, popups, or intrusive sponsored banners',
        'Self-hosted sandbox running entirely on your computer',
        'Open-access developer ecosystem for absolute trust'
      ]
    }
  };

  const info = cardsInfo[cardId];
  if (!info) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Modal body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={designTokens.animations.spring}
          className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-150 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-650 transition-colors dark:hover:text-white cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Icon Header */}
          <div className="flex items-center space-x-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${info.colorClass}`}>
              {info.icon}
            </div>
            <div>
              <span className="inline-flex items-center gap-1 font-mono text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <Sparkles size={10} /> Certified Architecture
              </span>
              <h3 className="font-sans font-bold text-lg text-gray-950 dark:text-white mt-0.5">
                {info.title}
              </h3>
            </div>
          </div>

          {/* Description Section */}
          <div className="mt-5">
            <p className="font-sans text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {info.description}
            </p>
          </div>

          {/* Technical features list */}
          <div className="mt-6 border-t border-gray-100 pt-5 dark:border-gray-800">
            <h4 className="font-sans font-bold text-[11px] uppercase tracking-wider text-gray-400 mb-3">
              Technical Specifications
            </h4>
            <ul className="space-y-2.5">
              {info.technicalDetails.map((detail, idx) => (
                <li key={idx} className="flex items-start space-x-2.5">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                  <span className="font-sans text-xs text-gray-700 dark:text-gray-300 font-medium">
                    {detail}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-xl bg-gray-950 px-5 py-2.5 font-sans text-xs font-bold text-white hover:bg-indigo-600 transition-colors dark:bg-white dark:text-gray-950 dark:hover:bg-indigo-500 dark:hover:text-white cursor-pointer"
            >
              Understand & Acknowledge
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
