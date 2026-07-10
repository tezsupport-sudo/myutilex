import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Keyboard, X } from 'lucide-react';

interface ShortcutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShortcutDialog({ isOpen, onClose }: ShortcutDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Shortcut Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-2xl ring-1 ring-black/5"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <Keyboard className="text-gray-900" size={18} />
                <h4 className="font-sans font-bold text-sm text-gray-950">Keyboard Shortcut Index</h4>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-950 p-1 rounded-full hover:bg-gray-100"
              >
                <X size={14} />
              </button>
            </div>

            {/* Map groups */}
            <div className="space-y-4">
              {/* Global shortcuts */}
              <div>
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block mb-2">Global Operations</span>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="text-gray-600 font-medium">Launch Command Palette</span>
                    <kbd className="font-mono text-[9px] font-bold text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded shadow-sm">
                      Ctrl + K
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="text-gray-600 font-medium">Toggle Shortcuts Dialog</span>
                    <kbd className="font-mono text-[9px] font-bold text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded shadow-sm">
                      ?
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="text-gray-600 font-medium">Close Active Panel/Overlay</span>
                    <kbd className="font-mono text-[9px] font-bold text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded shadow-sm">
                      ESC
                    </kbd>
                  </div>
                </div>
              </div>

              {/* Tool specific shortcuts */}
              <div>
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block mb-2">JSON Formatter Sandbox</span>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="text-gray-600 font-medium">Beautify &amp; Format JSON</span>
                    <kbd className="font-mono text-[9px] font-bold text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded shadow-sm">
                      Ctrl + Enter
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="text-gray-600 font-medium">Copy Formatted Output</span>
                    <kbd className="font-mono text-[9px] font-bold text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded shadow-sm">
                      Ctrl + Shift + C
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="text-gray-600 font-medium">Clear JSON Inputs</span>
                    <kbd className="font-mono text-[9px] font-bold text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded shadow-sm">
                      Ctrl + L
                    </kbd>
                  </div>
                </div>
              </div>

              {/* Password Generator specific shortcuts */}
              <div>
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block mb-2">Password Generator Sandbox</span>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="text-gray-600 font-medium">Re-Generate Safe Password</span>
                    <kbd className="font-mono text-[9px] font-bold text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded shadow-sm">
                      Ctrl + Enter
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="text-gray-600 font-medium">Copy Result to Clipboard</span>
                    <kbd className="font-mono text-[9px] font-bold text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded shadow-sm">
                      Ctrl + Shift + C
                    </kbd>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 pt-3 mt-4 text-center">
              <p className="text-[10px] font-mono text-gray-400">
                Operate our utilities suite like a professional power user.
              </p>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
