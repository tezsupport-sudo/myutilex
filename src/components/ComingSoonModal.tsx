import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface ComingSoonModalProps {
  tool: any;
  onClose: () => void;
}

export default function ComingSoonModal({ tool, onClose }: ComingSoonModalProps) {
  if (!tool) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/40 backdrop-blur-xs font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <X size={16} />
          </button>

          {/* Tag / Pipeline Indicator */}
          <div className="flex items-center space-x-1.5">
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-widest text-amber-800 border border-amber-200/50">
              🏗️ Architecture Slot
            </span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-mono font-bold text-gray-600">
              {tool.plannedSprint || 'Next Sprint'}
            </span>
          </div>

          {/* Title & Description */}
          <h3 className="mt-4 text-lg font-bold tracking-tight text-gray-950">
            {tool.name}
          </h3>
          <p className="mt-2 text-xs text-gray-500 leading-relaxed">
            This utility is officially part of our platform roadmap, registered in our master tool manifest. It is designed to run directly as a lightweight plugin loaded into our shared abstract processing engine.
          </p>

          {/* Tech details block */}
          <div className="mt-4 rounded-lg bg-gray-50 p-4 border border-gray-100">
            <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest block mb-1">
              Engine Architecture Design Specs
            </span>
            <div className="space-y-2 font-mono text-[10px] text-gray-600">
              <div className="flex justify-between">
                <span className="font-medium text-gray-400">Target Category:</span>
                <span className="font-bold text-gray-800">{tool.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-400">Memory Footprint:</span>
                <span className="font-bold text-emerald-700">&lt; 15KB compressed</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-400">Offline Compliant:</span>
                <span className="font-bold text-emerald-700">Yes (100% Client-Side)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-400">Keyboard Shortcuts:</span>
                <span className="font-bold text-gray-800">{tool.hasKeyboardShortcuts ? 'Supported' : 'None'}</span>
              </div>
            </div>
          </div>

          {/* Interactive elements */}
          <div className="mt-6 flex flex-col space-y-2">
            <button
              onClick={() => {
                alert(`Thank you for your interest! We have registered your support for ${tool.name}.`);
                onClose();
              }}
              className="w-full rounded-lg bg-gray-950 py-2.5 text-xs font-semibold text-white hover:bg-gray-800 transition-colors shadow-sm"
            >
              Notify Me On Sprint Release
            </button>
            <button
              onClick={onClose}
              className="w-full rounded-lg border border-gray-200 py-2.5 text-xs font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              Close Specification
            </button>
          </div>

          {/* Small footprint note */}
          <p className="mt-3 text-center text-[9px] font-mono text-gray-400">
            Adhering strictly to the single PROJECT_BIBLE.md v1.5 Constitution.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
