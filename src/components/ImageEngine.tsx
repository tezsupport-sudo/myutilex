import React, { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, Download, Image as ImageIcon, Sparkles, Check, RefreshCw, AlertCircle, Maximize2 } from 'lucide-react';
import { IMAGE_PLUGINS } from './imagePlugins';

interface ImageEngineProps {
  toolId: string;
}

export default function ImageEngine({ toolId }: ImageEngineProps) {
  const plugin = IMAGE_PLUGINS[toolId];
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [originalStats, setOriginalStats] = useState<{ width: number; height: number; size: number } | null>(null);
  
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [results, setResults] = useState<{
    blob: Blob;
    url: string;
    width: number;
    height: number;
    originalSize: number;
    optimizedSize: number;
    format: string;
  } | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'side' | 'split'>('side');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize input state on plugin change
  useEffect(() => {
    if (!plugin) return;
    const initialInputs: Record<string, any> = {};
    plugin.inputs.forEach((input) => {
      initialInputs[input.id] = input.defaultValue;
    });
    setInputs(initialInputs);
    setSelectedFile(null);
    setOriginalUrl('');
    setOriginalStats(null);
    setResults(null);
    setErrorMsg(null);
  }, [toolId]);

  // Clean up object URLs on unmount or file reset
  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (results?.url) URL.revokeObjectURL(results.url);
    };
  }, [originalUrl, results?.url]);

  // Handle image processing reactively when inputs or file changes
  useEffect(() => {
    if (!plugin || !selectedFile) return;

    let active = true;
    const runProcessing = async () => {
      setIsProcessing(true);
      setErrorMsg(null);
      try {
        const res = await plugin.process(selectedFile, inputs);
        if (active) {
          // Revoke old result URL to avoid leaks
          if (results?.url) {
            URL.revokeObjectURL(results.url);
          }
          setResults(res);
        }
      } catch (err: any) {
        if (active) {
          setErrorMsg(err.message || 'Failed to process image.');
        }
      } finally {
        if (active) {
          setIsProcessing(false);
        }
      }
    };

    const delayDebounce = setTimeout(() => {
      runProcessing();
    }, 200);

    return () => {
      active = false;
      clearTimeout(delayDebounce);
    };
  }, [inputs, selectedFile, toolId]);

  if (!plugin) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 font-sans text-xs text-red-800" id="image-engine-error">
        Error: Image engine plugin with ID "{toolId}" not found in registered active manifests.
      </div>
    );
  }

  const handleInputChange = (id: string, value: any) => {
    setInputs((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPEG, PNG, or WebP).');
      return;
    }

    // Revoke old urls
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (results?.url) URL.revokeObjectURL(results.url);

    const origUrl = URL.createObjectURL(file);
    setOriginalUrl(origUrl);
    setSelectedFile(file);
    setResults(null);
    setErrorMsg(null);

    // Get original image width and height
    const img = new Image();
    img.onload = () => {
      setOriginalStats({
        width: img.width,
        height: img.height,
        size: file.size
      });
    };
    img.src = origUrl;

    triggerFeedback('Image loaded. Configuring optimize parameters...');
  };

  // Drag and drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleReset = () => {
    setSelectedFile(null);
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    setOriginalUrl('');
    setOriginalStats(null);
    if (results?.url) URL.revokeObjectURL(results.url);
    setResults(null);
    setErrorMsg(null);
    
    // Re-initialize default inputs
    const initialInputs: Record<string, any> = {};
    plugin.inputs.forEach((input) => {
      initialInputs[input.id] = input.defaultValue;
    });
    setInputs(initialInputs);
    triggerFeedback('Workspace cleared successfully');
  };

  const handleDownload = () => {
    if (!results || !selectedFile) return;

    // Figure out download extension from format type
    let extension = 'jpg';
    if (results.format === 'image/png') extension = 'png';
    else if (results.format === 'image/webp') extension = 'webp';

    const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
    const finalName = `${baseName}-optimized.${extension}`;

    const link = document.createElement('a');
    link.href = results.url;
    link.download = finalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerFeedback('Download completed!');
  };

  const triggerFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2500);
  };

  // Format bytes for display
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Calculate optimization ratio
  const getSavings = () => {
    if (!results || !originalStats) return null;
    const diff = originalStats.size - results.optimizedSize;
    const pct = (diff / originalStats.size) * 100;
    return {
      bytesSaved: Math.max(0, diff),
      percentage: Math.max(0, parseFloat(pct.toFixed(1))),
      isSmaller: diff > 0
    };
  };

  const savings = getSavings();

  return (
    <div className="space-y-6 font-sans" id={`image-engine-${toolId}`}>
      {/* 1. Header Metadata Summary */}
      <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 sm:p-5 flex items-start space-x-3.5" id="image-meta-header">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-800">
          <ImageIcon size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            Client-Side Graphics Resampler
          </span>
          <h3 className="mt-0.5 text-sm font-semibold text-gray-900">{plugin.name}</h3>
          <p className="mt-1 text-xs text-gray-500 leading-relaxed">{plugin.description}</p>
        </div>
      </div>

      {/* Error Boundary Banner */}
      {errorMsg && (
        <div className="flex items-start space-x-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 animate-fadeIn" id="image-error-banner">
          <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-500" />
          <div className="font-mono">{errorMsg}</div>
        </div>
      )}

      {/* 2. Upload and Setup Screen */}
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-12 text-center cursor-pointer select-none transition-all duration-150 ${
            isDragging
              ? 'border-gray-900 bg-gray-100/50'
              : 'border-gray-200 bg-white hover:border-gray-400'
          }`}
          id="image-dropzone"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-400 mb-4 border border-gray-100 group-hover:scale-105 transition-transform">
            <Upload size={20} />
          </div>
          <span className="font-sans font-bold text-sm text-gray-950">
            Drag &amp; drop your image here, or <span className="text-gray-600 underline">browse</span>
          </span>
          <p className="mt-1.5 text-xs text-gray-400 max-w-xs leading-relaxed font-sans">
            Supports high-resolution JPEGs, PNGs, and WebPs up to 25MB. Executed 100% locally on your computer.
          </p>
        </div>
      ) : (
        /* 3. Interactive Split Workspace */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="image-workspace">
          
          {/* Controls Panel (Left Col) */}
          <div className="lg:col-span-4 space-y-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.01)]" id="image-controls-pane">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <h4 className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Optimization Settings
              </h4>
              {isProcessing && (
                <div className="flex items-center space-x-1.5 text-gray-400 font-mono text-[9px] font-bold uppercase">
                  <RefreshCw size={10} className="animate-spin text-gray-500" />
                  <span>Syncing...</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {plugin.inputs.map((input) => {
                const val = inputs[input.id] !== undefined ? inputs[input.id] : input.defaultValue;

                // Dynamic parameters view logic to keep interface clean
                const isFormatPNG = inputs.format === 'image/png';
                const isResizeModeNone = inputs.resizeMode === 'none';
                const isResizeModeWidth = inputs.resizeMode === 'width';
                const isResizeModeHeight = inputs.resizeMode === 'height';

                // Hide quality slider if output format is lossless PNG
                if (input.id === 'quality' && isFormatPNG) {
                  return (
                    <div key={input.id} className="rounded-lg border border-dashed border-gray-100 bg-gray-50 p-3 text-[11px] text-gray-400 leading-normal font-sans">
                      💡 <strong>PNG is a Lossless Format</strong>: PNG ignores compression quality levels to ensure absolute pixel fidelity.
                    </div>
                  );
                }

                // Hide width and height inputs if resizing is disabled
                if (input.id === 'customWidth' && (isResizeModeNone || isResizeModeHeight)) return null;
                if (input.id === 'customHeight' && (isResizeModeNone || isResizeModeWidth)) return null;
                if (input.id === 'maintainRatio' && isResizeModeNone) return null;

                return (
                  <div key={input.id} className="space-y-1.5 animate-fadeIn">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <label className="text-gray-700" htmlFor={`img-input-${input.id}`}>
                        {input.label}
                      </label>
                      {input.type === 'range' && (
                        <span className="font-mono text-gray-900 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded text-[11px]">
                          {val}%
                        </span>
                      )}
                    </div>

                    {input.type === 'select' && (
                      <select
                        id={`img-input-${input.id}`}
                        value={val}
                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 font-sans text-xs text-gray-900 outline-none focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                      >
                        {input.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}

                    {input.type === 'range' && (
                      <div className="space-y-1">
                        <input
                          type="range"
                          id={`img-input-${input.id}`}
                          min={input.min}
                          max={input.max}
                          step={input.step || 1}
                          value={val}
                          onChange={(e) => handleInputChange(input.id, Number(e.target.value))}
                          className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-gray-100 accent-gray-900"
                        />
                        <div className="flex justify-between font-mono text-[9px] text-gray-400 font-medium">
                          <span>{input.min}% (Max Compress)</span>
                          <span>{input.max}% (Highest Quality)</span>
                        </div>
                      </div>
                    )}

                    {input.type === 'number' && (
                      <input
                        type="number"
                        id={`img-input-${input.id}`}
                        min={input.min}
                        max={input.max}
                        value={val}
                        onChange={(e) => handleInputChange(input.id, Number(e.target.value))}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 font-sans text-xs text-gray-900 outline-none focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                      />
                    )}

                    {input.type === 'checkbox' && (
                      <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          id={`img-input-${input.id}`}
                          checked={!!val}
                          onChange={(e) => handleInputChange(input.id, e.target.checked)}
                          className="h-3.5 w-3.5 rounded border-gray-300 text-gray-900 focus:ring-gray-950"
                        />
                        <span className="font-sans text-xs text-gray-600">{input.helpText}</span>
                      </label>
                    )}

                    {input.type !== 'checkbox' && input.helpText && (
                      <p className="font-sans text-[10px] text-gray-400 leading-normal">{input.helpText}</p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-100 pt-4 flex flex-col space-y-2">
              <button
                onClick={handleDownload}
                disabled={!results}
                className="w-full flex items-center justify-center space-x-2 rounded-lg bg-gray-950 py-2.5 text-xs font-semibold text-white hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed shadow-sm transition-all"
                id="image-download-btn"
              >
                <Download size={14} />
                <span>Download Optimized File</span>
              </button>
              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center space-x-1.5 rounded-lg border border-red-100 bg-red-50 py-2 text-xs font-semibold text-red-600 hover:bg-red-100/60 transition-all cursor-pointer"
                id="image-reset-btn"
              >
                <Trash2 size={13} />
                <span>Upload Another Image</span>
              </button>
            </div>
          </div>

          {/* Workbench Display (Right Col) */}
          <div className="lg:col-span-8 space-y-6" id="image-workbench-view">
            
            {/* Live Analytics Banner */}
            {results && originalStats && (
              <div className="grid grid-cols-3 gap-3" id="image-analytics-metrics">
                <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
                  <span className="block font-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest">Original Size</span>
                  <span className="mt-1 block font-sans text-lg font-bold text-gray-500 sm:text-xl">
                    {formatBytes(originalStats.size)}
                  </span>
                  <span className="block font-mono text-[9px] text-gray-400 mt-0.5">{originalStats.width} × {originalStats.height}px</span>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
                  <span className="block font-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest">Optimized Size</span>
                  <span className="mt-1 block font-sans text-lg font-bold text-gray-950 sm:text-xl">
                    {formatBytes(results.optimizedSize)}
                  </span>
                  <span className="block font-mono text-[9px] text-gray-400 mt-0.5">{results.width} × {results.height}px</span>
                </div>

                <div className={`rounded-xl border p-4 text-center shadow-sm flex flex-col justify-center items-center ${
                  savings?.isSmaller 
                    ? 'border-emerald-200 bg-emerald-50/50 text-emerald-800' 
                    : 'border-amber-200 bg-amber-50/50 text-amber-800'
                }`}>
                  <span className="block font-mono text-[9px] font-bold uppercase tracking-widest text-gray-400">Bandwidth Savings</span>
                  {savings ? (
                    <>
                      <span className="mt-1 block font-sans text-xl font-black leading-none">
                        {savings.isSmaller ? `${savings.percentage}%` : '0%'}
                      </span>
                      <span className="block font-mono text-[8px] mt-1 uppercase font-bold tracking-tight">
                        {savings.isSmaller ? `Saved ${formatBytes(savings.bytesSaved)}` : 'Size unchanged'}
                      </span>
                    </>
                  ) : (
                    <span className="mt-1 font-sans text-sm font-semibold text-gray-400">Loading...</span>
                  )}
                </div>
              </div>
            )}

            {/* Main Graphics Split Viewer Panel */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4 shadow-[0_1px_2px_rgba(0,0,0,0.01)]" id="image-viewer-card">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Live Interactive Comparison View
                </span>
                
                {/* Mode Selector */}
                <div className="flex items-center space-x-1 border border-gray-100 rounded-lg p-0.5 bg-gray-50">
                  <button
                    onClick={() => setViewMode('side')}
                    className={`rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide transition-all ${
                      viewMode === 'side' 
                        ? 'bg-white text-gray-900 shadow-xs border border-gray-100/50' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    Side-by-Side
                  </button>
                  <button
                    onClick={() => setViewMode('split')}
                    className={`rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide transition-all ${
                      viewMode === 'split' 
                        ? 'bg-white text-gray-900 shadow-xs border border-gray-100/50' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    Overlay
                  </button>
                </div>
              </div>

              {/* Side-by-Side View */}
              {viewMode === 'side' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="image-side-by-side">
                  {/* Left (Original) */}
                  <div className="space-y-1.5">
                    <span className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest block text-center">
                      Original Image
                    </span>
                    <div className="relative rounded-lg border border-gray-100 bg-gray-50/50 p-2 overflow-hidden flex items-center justify-center min-h-[220px] max-h-[360px]">
                      {originalUrl && (
                        <img
                          src={originalUrl}
                          alt="Original view"
                          className="max-w-full max-h-[340px] rounded object-contain select-none pointer-events-none"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <span className="absolute bottom-2 left-2 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[9px] text-white">
                        {originalStats ? `${originalStats.width} × ${originalStats.height}px` : 'Original'}
                      </span>
                    </div>
                  </div>

                  {/* Right (Optimized) */}
                  <div className="space-y-1.5">
                    <span className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest block text-center flex items-center justify-center space-x-1">
                      <Sparkles size={10} className="text-amber-500 animate-pulse" />
                      <span>Optimized Output</span>
                    </span>
                    <div className="relative rounded-lg border border-gray-100 bg-gray-50/50 p-2 overflow-hidden flex items-center justify-center min-h-[220px] max-h-[360px]">
                      {isProcessing ? (
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <RefreshCw size={24} className="animate-spin text-gray-400" />
                          <span className="font-mono text-[10px] text-gray-400 uppercase tracking-wider font-bold">Resampling image...</span>
                        </div>
                      ) : results?.url ? (
                        <img
                          src={results.url}
                          alt="Optimized output view"
                          className="max-w-full max-h-[340px] rounded object-contain select-none pointer-events-none animate-fadeIn"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="font-mono text-xs text-gray-400">Waiting for config sync...</span>
                      )}
                      {results && (
                        <span className="absolute bottom-2 left-2 rounded bg-gray-900 px-1.5 py-0.5 font-mono text-[9px] text-white">
                          {results.width} × {results.height}px &bull; {formatBytes(results.optimizedSize)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Overlay / Slide-Over Comparison View */
                <div className="relative rounded-lg border border-gray-100 bg-gray-50 p-2 overflow-hidden flex items-center justify-center min-h-[320px] max-h-[440px]" id="image-overlay-view">
                  {isProcessing ? (
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <RefreshCw size={24} className="animate-spin text-gray-400" />
                      <span className="font-mono text-[10px] text-gray-400 uppercase tracking-wider font-bold">Resampling image...</span>
                    </div>
                  ) : results?.url && originalUrl ? (
                    <div className="relative w-full max-h-[420px] flex items-center justify-center overflow-hidden select-none">
                      {/* Left side original, right side optimized with slider or simple hover reveal. Let's make an extremely elegant split frame hover slider or dual image frame! */}
                      <div className="relative max-w-full max-h-[400px] overflow-hidden rounded shadow-sm">
                        <img
                          src={results.url}
                          alt="Optimized frame"
                          className="max-w-full max-h-[400px] object-contain select-none pointer-events-none block"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-y-0 left-0 overflow-hidden w-1/2 border-r-2 border-white shadow-xl hover:w-full transition-all duration-300 group">
                          <div className="absolute inset-0 w-[200%] max-w-none">
                            <img
                              src={originalUrl}
                              alt="Original base"
                              className="w-full h-full object-contain select-none pointer-events-none"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <span className="absolute top-2 left-2 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[9px] text-white">
                            Original &larr; (Hover to reveal)
                          </span>
                        </div>
                        <span className="absolute top-2 right-2 rounded bg-gray-900 px-1.5 py-0.5 font-mono text-[9px] text-white">
                          Optimized Output
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="font-mono text-xs text-gray-400">Loading frames comparison...</span>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Global floating notification */}
      {feedback && (
        <div className="fixed bottom-4 right-4 z-50 rounded bg-gray-900 px-3 py-1.5 font-mono text-xs font-bold text-white shadow-lg animate-fadeIn">
          {feedback}
        </div>
      )}
    </div>
  );
}
