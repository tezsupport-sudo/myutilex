import React from 'react';

export interface DevPlugin {
  id: string;
  name: string;
  description: string;
  iconName: string;
  placeholderSource: string;
  placeholderTarget: string;
  sourceLabel: string;
  targetLabel: string;
  calculateMetrics: (source: string, target: string) => { label: string; value: string | number; isAccent?: boolean }[];
  validate?: (source: string) => { isValid: boolean; message?: string } | null;
  actions: {
    id: string;
    label: string;
    isPrimary?: boolean;
    run: (source: string) => { output: string; error?: string };
  }[];
  renderInsights?: (source: string, target: string) => React.ReactNode;
}

// 1. JSON Formatter & Beautifier Plugin
const jsonFormatterPlugin: DevPlugin = {
  id: 'json-formatter',
  name: 'JSON Formatter & Beautifier',
  description: 'Validate, pretty-print, format, or compress raw JSON strings with real-time error detection.',
  iconName: 'Braces',
  placeholderSource: 'Paste your raw JSON here... e.g.\n{\n  "id": 101,\n  "project": "Utility Hub",\n  "tags": ["developer", "utility", "fast"]\n}',
  placeholderTarget: 'Your structured, human-readable pretty JSON or minified string will render here...',
  sourceLabel: 'Source JSON Raw String',
  targetLabel: 'Processed JSON Output',
  calculateMetrics: (source, target) => {
    const rawLen = source.length;
    const targetLen = target.length;
    
    let syntaxState = 'Empty';
    let keyCount = 0;
    let maxDepth = 0;

    if (source.trim() !== '') {
      try {
        const parsed = JSON.parse(source);
        syntaxState = 'Valid';
        
        // Dynamic properties calculation
        const getStats = (obj: any, depth = 1): { keys: number; depth: number } => {
          if (obj === null || typeof obj !== 'object') {
            return { keys: 0, depth };
          }
          let keys = 0;
          let subDepth = depth;
          for (const k in obj) {
            keys++;
            if (typeof obj[k] === 'object' && obj[k] !== null) {
              const res = getStats(obj[k], depth + 1);
              keys += res.keys;
              subDepth = Math.max(subDepth, res.depth);
            }
          }
          return { keys, depth: subDepth };
        };

        const stats = getStats(parsed);
        keyCount = stats.keys;
        maxDepth = stats.depth;
      } catch (e) {
        syntaxState = 'Malformed';
      }
    }

    // Compression ratio
    const ratio = rawLen > 0 && targetLen > 0 
      ? `${((targetLen / rawLen) * 100).toFixed(0)}%` 
      : '100%';

    return [
      { label: 'Syntax State', value: syntaxState, isAccent: syntaxState === 'Valid' },
      { label: 'Source Length', value: `${rawLen} chars` },
      { label: 'Target Length', value: `${targetLen} chars` },
      { label: 'Total Node Keys', value: keyCount },
      { label: 'Hierarchy Depth', value: maxDepth }
    ];
  },
  validate: (source) => {
    if (!source.trim()) return null;
    try {
      JSON.parse(source);
      return { isValid: true };
    } catch (e: any) {
      return { isValid: false, message: e.message || 'Invalid JSON format structure' };
    }
  },
  actions: [
    {
      id: 'format-pretty',
      label: 'Beautify (2 Spaces)',
      isPrimary: true,
      run: (source) => {
        try {
          const parsed = JSON.parse(source);
          return { output: JSON.stringify(parsed, null, 2) };
        } catch (e: any) {
          return { output: '', error: e.message || 'Parsing failed.' };
        }
      }
    },
    {
      id: 'format-4-spaces',
      label: 'Beautify (4 Spaces)',
      run: (source) => {
        try {
          const parsed = JSON.parse(source);
          return { output: JSON.stringify(parsed, null, 4) };
        } catch (e: any) {
          return { output: '', error: e.message || 'Parsing failed.' };
        }
      }
    },
    {
      id: 'minify',
      label: 'Minify / Compress',
      run: (source) => {
        try {
          const parsed = JSON.parse(source);
          return { output: JSON.stringify(parsed) };
        } catch (e: any) {
          return { output: '', error: e.message || 'Parsing failed.' };
        }
      }
    }
  ],
  renderInsights: (source) => {
    if (!source.trim()) return null;
    let parsed: any = null;
    try {
      parsed = JSON.parse(source);
    } catch (e) {
      return null;
    }

    const valueTypes: Record<string, number> = {};
    const extractTypes = (obj: any) => {
      if (obj === null) {
        valueTypes['null'] = (valueTypes['null'] || 0) + 1;
        return;
      }
      const t = typeof obj;
      if (t !== 'object') {
        valueTypes[t] = (valueTypes[t] || 0) + 1;
        return;
      }
      if (Array.isArray(obj)) {
        valueTypes['array'] = (valueTypes['array'] || 0) + 1;
        obj.forEach(extractTypes);
      } else {
        valueTypes['object'] = (valueTypes['object'] || 0) + 1;
        for (const k in obj) {
          extractTypes(obj[k]);
        }
      }
    };

    extractTypes(parsed);

    return (
      <div className="rounded-lg border border-gray-100 p-4 space-y-3" id="json-insights-container">
        <h4 className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest">JSON Structural Types Density</h4>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Object.entries(valueTypes).map(([type, count]) => (
            <div key={type} className="rounded-md border border-gray-100 bg-gray-50/50 p-2 text-center flex flex-col justify-center">
              <span className="font-mono text-[9px] font-bold text-gray-500 uppercase tracking-wider">{type}</span>
              <span className="mt-1 font-sans text-lg font-extrabold text-gray-900">{count}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
};

// 2. Base64 Converter Plugin
const base64Plugin: DevPlugin = {
  id: 'base64-converter',
  name: 'Base64 Encoder & Decoder',
  description: 'UTF-8 safe binary text transformations. Convert plaintext to standard Base64 string formats or restore original representation.',
  iconName: 'ArrowRightLeft',
  placeholderSource: 'Paste plain UTF-8 text here... e.g.\nHello, World! Welcome to the premium developer platform.',
  placeholderTarget: 'Paste Base64 encoded string here... e.g.\nSGVsbG8sIFdvcmxkISBXZWxjb21lIHRvIHRoZSBwcmVtaXVtIGRldmVsb3BlciBwbGF0Zm9ybS4=',
  sourceLabel: 'Plain Text (Decoded)',
  targetLabel: 'Base64 Text (Encoded)',
  calculateMetrics: (source, target) => {
    const sourceLen = source.length;
    const targetLen = target.length;
    
    // Calculate padding bits
    const paddingCount = target.trim().endsWith('==') ? 2 : target.trim().endsWith('=') ? 1 : 0;
    
    // Size overhead indicator
    const ratio = sourceLen > 0 
      ? `+${(((targetLen - sourceLen) / sourceLen) * 100).toFixed(0)}%` 
      : '0%';

    return [
      { label: 'Source length', value: `${sourceLen} B` },
      { label: 'Encoded length', value: `${targetLen} B` },
      { label: 'Size overhead', value: ratio, isAccent: sourceLen > 0 },
      { label: 'Padding signs', value: paddingCount },
      { label: 'Valid alphabet', value: target.trim() === '' ? 'Idle' : /^[a-zA-Z0-9+/]*={0,2}$/.test(target.trim().replace(/\s/g, '')) ? 'Verified' : 'Incorrect' }
    ];
  },
  validate: (source) => {
    // Plain UTF-8 doesn't have structure issues. Target Base64 is validated during decode action.
    return null;
  },
  actions: [
    {
      id: 'encode',
      label: 'Encode plaintext (UTF-8)',
      isPrimary: true,
      run: (source) => {
        try {
          const bytes = new TextEncoder().encode(source);
          const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
          const encoded = btoa(binString);
          return { output: encoded };
        } catch (e: any) {
          return { output: '', error: 'Encoding failed: invalid UTF-8 sequences.' };
        }
      }
    },
    {
      id: 'decode',
      label: 'Decode Base64 string',
      run: (source) => {
        try {
          const trimmed = source.trim().replace(/\s/g, '');
          const binString = atob(trimmed);
          const bytes = Uint8Array.from(binString, (char) => char.charCodeAt(0));
          const decoded = new TextDecoder().decode(bytes);
          return { output: decoded };
        } catch (e: any) {
          return { output: '', error: 'Decoding failed: Source is not a valid base-64 encoded string format.' };
        }
      }
    }
  ],
  renderInsights: (source, target) => {
    const isUrlSafe = !target.includes('+') && !target.includes('/') && !target.includes('=');
    
    return (
      <div className="rounded-lg border border-gray-100 p-4 space-y-3" id="base64-insights-container">
        <h4 className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest">Base64 Security & URL-Safety Audit</h4>
        <div className="text-xs space-y-2">
          <div className="flex items-center justify-between border-b border-gray-50 pb-2">
            <span className="text-gray-500">URL-safe format matching:</span>
            <span className={`font-mono font-bold px-1.5 py-0.5 rounded ${isUrlSafe ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
              {isUrlSafe ? 'URL Safe (No +, /, or = characters)' : 'Standard Base64 (Requires URL encoding for query parameters)'}
            </span>
          </div>
          <div className="text-[11px] text-gray-400 font-sans leading-relaxed">
            Standard Base64 strings can cause issues in query string arguments or REST routes due to the <code>+</code>, <code>/</code>, and <code>=</code> tokens. Consider converting them to URL-safe formats (replacing <code>+</code> with <code>-</code>, <code>/</code> with <code>_</code>, and trimming trailing <code>=</code> signs) before transmitting over HTTP protocols.
          </div>
        </div>
      </div>
    );
  }
};

export const DEV_PLUGINS: Record<string, DevPlugin> = {
  'json-formatter': jsonFormatterPlugin,
  'base64-converter': base64Plugin
};
