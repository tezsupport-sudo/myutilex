import React, { useState, useEffect } from 'react';
import { Trash2, AlertTriangle, Cpu } from 'lucide-react';
import { CALC_PLUGINS } from './calcPlugins';

interface CalculatorEngineProps {
  toolId: string;
}

export default function CalculatorEngine({ toolId }: CalculatorEngineProps) {
  const plugin = CALC_PLUGINS[toolId];
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [results, setResults] = useState<any>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Initialize input state on plugin change
  useEffect(() => {
    if (!plugin) return;
    const initialInputs: Record<string, any> = {};
    plugin.inputs.forEach((input) => {
      initialInputs[input.id] = input.defaultValue;
    });
    setInputs(initialInputs);
    setResults(null);
    setFeedback(null);
  }, [toolId]);

  // Handle auto-calculation whenever inputs change
  useEffect(() => {
    if (!plugin || Object.keys(inputs).length === 0) return;
    const calculatedResults = plugin.calculate(inputs);
    setResults(calculatedResults);
  }, [inputs, toolId]);

  if (!plugin) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 font-sans text-xs text-red-800">
        Error: Calculator engine plugin with ID "{toolId}" not found in registered active manifests.
      </div>
    );
  }

  const handleInputChange = (id: string, value: any) => {
    setInputs((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleReset = () => {
    const initialInputs: Record<string, any> = {};
    plugin.inputs.forEach((input) => {
      initialInputs[input.id] = input.defaultValue;
    });
    setInputs(initialInputs);
    setResults(null);
    triggerFeedback('Inputs reset to default');
  };

  const triggerFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2500);
  };

  const triggerRecalculate = () => {
    if (!plugin) return;
    const calculatedResults = plugin.calculate(inputs);
    setResults(calculatedResults);
  };

  // Group inputs into logical rows: we place checkboxes together in one box, and sliders/dates in another
  const checkboxes = plugin.inputs.filter((i) => i.type === 'checkbox');
  const nonCheckboxes = plugin.inputs.filter((i) => i.type !== 'checkbox');

  return (
    <div className="space-y-6 font-sans" id={`calculator-engine-${toolId}`}>
      
      {/* 1. Header Metadata Summary */}
      <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 sm:p-5 flex items-start space-x-3.5" id="calc-meta-header">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-800">
          <Cpu size={16} />
        </div>
        <div>
          <span className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            Formula Engine Active
          </span>
          <h3 className="mt-0.5 text-sm font-semibold text-gray-900">{plugin.name}</h3>
          <p className="mt-1 text-xs text-gray-500 leading-relaxed">{plugin.description}</p>
        </div>
      </div>

      {/* 2. Unified Controls & Workbench */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" id="calc-workbench-grid">
        {/* Render standard non-checkbox parameters (dates, ranges, numbers, text) */}
        {nonCheckboxes.length > 0 && (
          <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.01)]" id="calc-parameters-panel">
            <h4 className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Configuration Parameters
            </h4>
            {nonCheckboxes.map((input) => {
              const val = inputs[input.id] !== undefined ? inputs[input.id] : input.defaultValue;

              return (
                <div key={input.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <label className="text-gray-700" htmlFor={`calc-input-${input.id}`}>
                      {input.label}
                    </label>
                    {input.type === 'range' && (
                      <span className="font-mono text-gray-900 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded text-[11px]">
                        {val} chars
                      </span>
                    )}
                  </div>

                  {input.type === 'date' && (
                    <input
                      type="date"
                      value={val}
                      max={new Date().toISOString().split('T')[0]}
                      onChange={(e) => handleInputChange(input.id, e.target.value)}
                      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 font-sans text-xs text-gray-900 outline-none focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                      id={`calc-input-${input.id}`}
                    />
                  )}

                  {input.type === 'range' && (
                    <div className="space-y-1">
                      <input
                        type="range"
                        min={input.min || 8}
                        max={input.max || 64}
                        value={val}
                        onChange={(e) => handleInputChange(input.id, Number(e.target.value))}
                        className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-gray-100 accent-gray-900"
                        id={`calc-input-${input.id}`}
                      />
                      <div className="flex justify-between font-mono text-[9px] text-gray-400 font-medium">
                        <span>{input.min || 8} (Low)</span>
                        <span>{input.max || 64} (Max)</span>
                      </div>
                    </div>
                  )}

                  {input.type === 'number' && (
                    <input
                      type="number"
                      min={input.min}
                      max={input.max}
                      value={val}
                      placeholder={input.placeholder}
                      onChange={(e) => handleInputChange(input.id, Number(e.target.value))}
                      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 font-sans text-xs text-gray-900 outline-none focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                      id={`calc-input-${input.id}`}
                    />
                  )}

                  {input.type === 'select' && (
                    <select
                      value={val}
                      onChange={(e) => handleInputChange(input.id, e.target.value)}
                      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 font-sans text-xs text-gray-900 outline-none focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                      id={`calc-input-${input.id}`}
                    >
                      {input.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {input.helpText && (
                    <p className="font-sans text-[10px] text-gray-400">{input.helpText}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Render checkboxes / variety toggles in their own styled grouping */}
        {checkboxes.length > 0 && (
          <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.01)]" id="calc-checkboxes-panel">
            <h4 className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Variety Options & Rules
            </h4>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {checkboxes.map((input) => {
                const val = inputs[input.id] !== undefined ? !!inputs[input.id] : !!input.defaultValue;
                return (
                  <label key={input.id} className="flex items-center space-x-2.5 cursor-pointer text-xs text-gray-700 hover:text-gray-950 select-none py-1">
                    <input
                      type="checkbox"
                      checked={val}
                      onChange={(e) => handleInputChange(input.id, e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-gray-300 text-gray-900 focus:ring-gray-950"
                    />
                    <span className="font-sans font-medium">{input.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. Output / Result Area (Delegated to Plugin) */}
      <div className="border-t border-gray-100 pt-5" id="calc-results-block">
        {results ? (
          plugin.renderResults(results, inputs, handleInputChange, triggerRecalculate)
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center" id="calc-idle-banner">
            <span className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Awaiting parameters
            </span>
            <p className="mt-1 text-xs text-gray-400 font-sans">
              Provide necessary input values above to begin real-time dynamic formula processing.
            </p>
          </div>
        )}
      </div>

      {/* 4. Global Action Controls (Reset All) */}
      <div className="flex justify-end pt-2" id="calc-global-actions">
        <button
          onClick={handleReset}
          className="flex items-center space-x-1.5 rounded-md border border-red-100 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-100/80 transition-all cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
          id="calc-reset-btn"
        >
          <Trash2 size={13} />
          <span>Reset All Parameters</span>
        </button>
      </div>

      {/* Dynamic Feedback floating element */}
      {feedback && (
        <div className="fixed bottom-4 right-4 z-50 rounded bg-gray-900 px-3 py-1.5 font-mono text-xs font-bold text-white shadow-lg animate-fadeIn">
          {feedback}
        </div>
      )}

    </div>
  );
}
