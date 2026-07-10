import React, { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, Download, FileText, Check, RefreshCw, AlertCircle, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { PDF_PLUGINS } from './pdfPlugins';

interface PDFEngineProps {
  toolId: string;
}

interface SelectedPDFFile {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount?: number;
}

export default function PDFEngine({ toolId }: PDFEngineProps) {
  const plugin = PDF_PLUGINS[toolId];
  const [selectedFiles, setSelectedFiles] = useState<SelectedPDFFile[]>([]);
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  
  const [results, setResults] = useState<{
    blob: Blob;
    url: string;
    fileName: string;
    pageCount: number;
    infoList?: string[];
  } | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize inputs when plugin changes
  useEffect(() => {
    if (!plugin) return;
    const initialInputs: Record<string, any> = {};
    plugin.inputs.forEach((input) => {
      initialInputs[input.id] = input.defaultValue;
    });
    setInputs(initialInputs);
    setSelectedFiles([]);
    setResults(null);
    setErrorMsg(null);
  }, [toolId]);

  // Clean up object URLs on unmount or result reset
  useEffect(() => {
    return () => {
      if (results?.url) {
        URL.revokeObjectURL(results.url);
      }
    };
  }, [results?.url]);

  if (!plugin) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 font-sans text-xs text-red-800" id="pdf-engine-error">
        Error: PDF engine plugin with ID "{toolId}" not found in registered active manifests.
      </div>
    );
  }

  const handleInputChange = (id: string, value: any) => {
    setInputs((prev) => ({
      ...prev,
      [id]: value
    }));
    // Reset output when params shift so user is prompted to run again or update
    setResults(null);
  };

  const addFiles = (newFiles: File[]) => {
    const pdfFiles = newFiles.filter((f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    if (pdfFiles.length < newFiles.length) {
      setErrorMsg('Some selected files were skipped. Only PDF files are supported.');
    }

    const nextFiles: SelectedPDFFile[] = [...selectedFiles];
    pdfFiles.forEach((file) => {
      // Avoid duplicate file names if same file is added
      const id = `${file.name}-${file.size}-${Date.now()}-${Math.random()}`;
      nextFiles.push({
        id,
        file,
        name: file.name,
        size: file.size
      });
    });

    setSelectedFiles(nextFiles);
    setResults(null);
    setErrorMsg(null);
    triggerFeedback(`Added ${pdfFiles.length} file(s)`);
  };

  // Drag and drop handlers
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
    const files = Array.from(e.dataTransfer.files) as File[];
    addFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? (Array.from(e.target.files) as File[]) : [];
    addFiles(files);
    // Reset file input value to allow selecting same file again
    if (e.target) e.target.value = '';
  };

  // Reordering handlers for merging list
  const moveFile = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === selectedFiles.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const nextFiles = [...selectedFiles];
    const temp = nextFiles[index];
    nextFiles[index] = nextFiles[targetIndex];
    nextFiles[targetIndex] = temp;

    setSelectedFiles(nextFiles);
    setResults(null);
    triggerFeedback('File processing queue order updated');
  };

  const removeFile = (id: string) => {
    setSelectedFiles(selectedFiles.filter((f) => f.id !== id));
    setResults(null);
    triggerFeedback('File removed from queue');
  };

  const handleReset = () => {
    setSelectedFiles([]);
    if (results?.url) URL.revokeObjectURL(results.url);
    setResults(null);
    setErrorMsg(null);
    triggerFeedback('Workspace cleared');
  };

  const triggerFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2500);
  };

  // Execution handler
  const handleProcess = async () => {
    if (selectedFiles.length === 0) {
      setErrorMsg('Please select or drop at least one PDF file before processing.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const nativeFiles = selectedFiles.map((sf) => sf.file);
      const res = await plugin.process(nativeFiles, inputs);
      setResults(res);
      triggerFeedback('PDF compilation complete!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process PDF documents.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!results) return;
    const link = document.createElement('a');
    link.href = results.url;
    link.download = results.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerFeedback('Download completed!');
  };

  // Format bytes for display
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const operationMode = inputs.operation || 'merge';

  return (
    <div className="space-y-6 font-sans" id={`pdf-engine-${toolId}`}>
      {/* 1. Header Area */}
      <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 sm:p-5 flex items-start space-x-3.5" id="pdf-meta-header">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-800">
          <FileText size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            Client-Side Document Processor
          </span>
          <h3 className="mt-0.5 text-sm font-semibold text-gray-900">{plugin.name}</h3>
          <p className="mt-1 text-xs text-gray-500 leading-relaxed">{plugin.description}</p>
        </div>
      </div>

      {/* Error Boundary Banner */}
      {errorMsg && (
        <div className="flex items-start space-x-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 animate-fadeIn" id="pdf-error-banner">
          <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-500" />
          <div className="font-mono">{errorMsg}</div>
        </div>
      )}

      {/* 2. Drag & Drop PDF Uploader */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 text-center cursor-pointer select-none transition-all duration-150 ${
          isDragging
            ? 'border-gray-900 bg-gray-100/50'
            : 'border-gray-200 bg-white hover:border-gray-400'
        }`}
        onClick={() => fileInputRef.current?.click()}
        id="pdf-dropzone"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="application/pdf"
          multiple={operationMode === 'merge'}
          className="hidden"
        />
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-50 text-gray-400 mb-3 border border-gray-100">
          <Upload size={18} />
        </div>
        <span className="font-sans font-bold text-sm text-gray-950">
          {operationMode === 'merge' ? 'Drag & drop multiple PDFs, or ' : 'Drag & drop your PDF, or '}
          <span className="text-gray-600 underline">browse</span>
        </span>
        <p className="mt-1 text-xs text-gray-400 max-w-xs leading-normal">
          Only PDF files are supported. Combined completely in browser memory without server uploads.
        </p>
      </div>

      {/* 3. Main Workspace layout (Active files & configuration inputs) */}
      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="pdf-workspace">
          
          {/* Left Column: Active Queue list */}
          <div className="lg:col-span-7 space-y-4" id="pdf-queue-pane">
            <div className="flex items-center justify-between">
              <h4 className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Active PDF Document Queue ({selectedFiles.length})
              </h4>
              <button
                onClick={handleReset}
                className="font-mono text-[10px] font-bold text-red-500 hover:text-red-700 uppercase"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1" id="pdf-queue-list">
              {selectedFiles.map((sf, index) => (
                <div
                  key={sf.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-white p-3 hover:border-gray-200 shadow-xs transition-all duration-100"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-red-600 shrink-0">
                      <FileText size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-sans text-xs font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-[320px]">
                        {sf.name}
                      </p>
                      <span className="font-mono text-[9px] text-gray-400 font-medium">
                        {formatBytes(sf.size)}
                      </span>
                    </div>
                  </div>

                  {/* Move Up, Down & Delete controls */}
                  <div className="flex items-center space-x-1.5 shrink-0">
                    {operationMode === 'merge' && (
                      <>
                        <button
                          onClick={() => moveFile(index, 'up')}
                          disabled={index === 0}
                          className="p-1 rounded text-gray-400 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none"
                          title="Move up"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          onClick={() => moveFile(index, 'down')}
                          disabled={index === selectedFiles.length - 1}
                          className="p-1 rounded text-gray-400 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none"
                          title="Move down"
                        >
                          <ArrowDown size={13} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => removeFile(sf.id)}
                      className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50/50"
                      title="Remove file"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick add CTA */}
            {operationMode === 'merge' && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center space-x-1.5 rounded-lg border border-dashed border-gray-200 py-2.5 text-xs font-semibold text-gray-500 hover:border-gray-400 hover:text-gray-800 transition-all bg-white/50"
              >
                <Plus size={13} />
                <span>Add More PDF Documents</span>
              </button>
            )}
          </div>

          {/* Right Column: Parameters and actions */}
          <div className="lg:col-span-5 space-y-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.01)]" id="pdf-config-pane">
            <h4 className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
              Parameters &amp; Compiler
            </h4>

            <div className="space-y-4">
              {plugin.inputs.map((input) => {
                const val = inputs[input.id] !== undefined ? inputs[input.id] : input.defaultValue;

                // Only show range input if mode is "extract"
                if (input.id === 'pageRange' && operationMode !== 'extract') return null;

                return (
                  <div key={input.id} className="space-y-1.5 animate-fadeIn">
                    <label className="text-xs font-semibold text-gray-700" htmlFor={`pdf-input-${input.id}`}>
                      {input.label}
                    </label>

                    {input.type === 'select' && (
                      <select
                        id={`pdf-input-${input.id}`}
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

                    {input.type === 'text' && (
                      <input
                        type="text"
                        id={`pdf-input-${input.id}`}
                        value={val}
                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                        placeholder="e.g., 1-3, 5"
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 font-mono text-xs text-gray-900 outline-none focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                      />
                    )}

                    {input.helpText && (
                      <p className="font-sans text-[10px] text-gray-400 leading-normal">{input.helpText}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Warnings / Infos for Extract mode */}
            {operationMode === 'extract' && selectedFiles.length > 1 && (
              <div className="rounded-lg border border-dashed border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-800 leading-normal font-sans animate-fadeIn">
                ⚠️ <strong>Note</strong>: Extraction mode only processes the first active file listed in your document queue (<code>{selectedFiles[0]?.name}</code>).
              </div>
            )}

            <button
              onClick={handleProcess}
              disabled={isProcessing}
              className="w-full flex items-center justify-center space-x-2 rounded-lg bg-gray-950 py-2.5 text-xs font-semibold text-white hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 transition-all shadow-sm cursor-pointer"
              id="pdf-process-btn"
            >
              {isProcessing ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  <span>Processing documents...</span>
                </>
              ) : (
                <span>Compile PDF Document</span>
              )}
            </button>
          </div>

        </div>
      )}

      {/* 4. Compilation Results Panel */}
      {results && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm space-y-4 animate-fadeIn" id="pdf-results-panel">
          <div className="flex items-center space-x-2 text-emerald-700">
            <Check size={16} className="bg-emerald-100 rounded-full p-0.5 shrink-0" />
            <h4 className="font-sans text-xs font-bold uppercase tracking-wider">PDF Compiling Complete!</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Stats */}
            <div className="md:col-span-5 space-y-1.5 font-sans">
              <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Generated Asset</p>
              <p className="text-sm font-semibold text-gray-950 truncate" title={results.fileName}>
                {results.fileName}
              </p>
              <div className="flex items-center space-x-2 font-mono text-[10px] text-gray-500 font-medium">
                <span>Size: <strong className="text-gray-900">{formatBytes(results.blob.size)}</strong></span>
                <span>•</span>
                <span>Pages: <strong className="text-gray-900">{results.pageCount}</strong></span>
              </div>
            </div>

            {/* Actions */}
            <div className="md:col-span-7 flex flex-col sm:flex-row gap-2 justify-end">
              <a
                href={results.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center space-x-1.5 rounded-lg border border-gray-200 py-2 px-4 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all text-center"
              >
                <span>Preview Document</span>
              </a>
              <button
                onClick={handleDownload}
                className="flex items-center justify-center space-x-1.5 rounded-lg bg-gray-950 py-2 px-4 text-xs font-semibold text-white hover:bg-gray-800 transition-all shadow-sm"
              >
                <Download size={13} />
                <span>Download Optimized PDF</span>
              </button>
            </div>
          </div>

          {/* Logs / Audit Trail */}
          {results.infoList && results.infoList.length > 0 && (
            <div className="rounded-lg bg-gray-50 p-3.5 border border-gray-100 space-y-1">
              <span className="block font-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                Compiler Execution Logs:
              </span>
              <ul className="font-mono text-[10px] text-gray-500 space-y-1 list-disc list-inside">
                {results.infoList.map((info, idx) => (
                  <li key={idx} className="leading-relaxed">{info}</li>
                ))}
              </ul>
            </div>
          )}
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
