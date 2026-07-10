import React from 'react';
import { Type, Hash, AlignLeft, RefreshCw, Eraser } from 'lucide-react';

export interface TextPlugin {
  id: string;
  name: string;
  description: string;
  iconName: string;
  calculateMetrics: (text: string) => { label: string; value: string | number; isAccent?: boolean }[];
  actions: {
    id: string;
    label: string;
    description?: string;
    run: (text: string) => string;
  }[];
  renderInsights?: (text: string) => React.ReactNode;
}

// 1. Word Counter Plugin
const wordCounterPlugin: TextPlugin = {
  id: 'word-counter',
  name: 'Word Counter & Text Analyzer',
  description: 'Calculate real-time word count, character count, estimated reading time, sentence count, and paragraphs with detailed analytics.',
  iconName: 'Type',
  calculateMetrics: (text) => {
    const charCount = text.length;
    const words = text.trim() === '' ? [] : text.trim().split(/\s+/);
    const wordCount = words.length;

    const sentences = text.trim() === '' ? [] : text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceCount = sentences.length;

    const paragraphs = text.trim() === '' ? [] : text.split(/\n+/).filter(p => p.trim().length > 0);
    const paragraphCount = paragraphs.length;

    const readingTime = Math.ceil(wordCount / 200);

    return [
      { label: 'Words', value: wordCount },
      { label: 'Characters', value: charCount },
      { label: 'Sentences', value: sentenceCount },
      { label: 'Paragraphs', value: paragraphCount },
      { label: 'Reading Time', value: `${readingTime} ${readingTime === 1 ? 'min' : 'mins'}`, isAccent: true }
    ];
  },
  actions: [
    {
      id: 'upper',
      label: 'UPPERCASE',
      run: (text) => text.toUpperCase()
    },
    {
      id: 'lower',
      label: 'lowercase',
      run: (text) => text.toLowerCase()
    },
    {
      id: 'title',
      label: 'Title Case',
      run: (text) => text
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
    }
  ],
  renderInsights: (text) => {
    if (text.trim() === '') return null;
    
    // Character density excluding space
    const charNoSpacesCount = text.replace(/\s/g, '').length;
    const words = text.trim().split(/\s+/);
    const wordCount = words.length;
    const averageWordLength = wordCount > 0 ? (charNoSpacesCount / wordCount).toFixed(1) : '0.0';

    // Top words calculation
    const wordFreq: Record<string, number> = {};
    words.forEach(w => {
      const clean = w.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
      if (clean && clean.length > 1) {
        wordFreq[clean] = (wordFreq[clean] || 0) + 1;
      }
    });

    const sortedWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return (
      <div className="rounded-lg border border-gray-100 p-4 space-y-4" id="wc-insights-container">
        <div>
          <h4 className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest">Character Density Insights</h4>
          <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
            <div className="flex justify-between border-b border-gray-50 pb-2">
              <span className="text-gray-500">Characters (excluding spaces)</span>
              <span className="font-semibold text-gray-900">{charNoSpacesCount}</span>
            </div>
            <div className="flex justify-between border-b border-gray-50 pb-2">
              <span className="text-gray-500">Average Word Length</span>
              <span className="font-semibold text-gray-900">{averageWordLength} chars</span>
            </div>
          </div>
        </div>

        {sortedWords.length > 0 && (
          <div>
            <h4 className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest">Keyword Density Index</h4>
            <div className="mt-2.5 space-y-2">
              {sortedWords.map(([word, freq]) => {
                const pct = Math.min(100, (freq / wordCount) * 100).toFixed(0);
                return (
                  <div key={word} className="flex items-center justify-between text-xs font-mono">
                    <span className="text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded font-bold">"{word}"</span>
                    <div className="flex items-center space-x-2 w-1/2">
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-900 rounded-full" style={{ width: `${pct}%` }}></div>
                      </div>
                      <span className="text-gray-500 text-[10px] font-semibold min-w-10 text-right">{freq}x ({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
};

// 2. Character Counter Plugin
const characterCounterPlugin: TextPlugin = {
  id: 'character-counter',
  name: 'Character Counter & Frequency Analyzer',
  description: 'Track exact letter, number, and symbol occurrences. Analyze text distribution with inline progression indices.',
  iconName: 'Hash',
  calculateMetrics: (text) => {
    const totalChars = text.length;
    const noSpaces = text.replace(/\s/g, '').length;
    const letters = text.replace(/[^a-zA-Z]/g, '').length;
    const numbers = text.replace(/[^0-9]/g, '').length;
    const symbols = totalChars - (letters + numbers + text.replace(/[^\s]/g, '').length);

    return [
      { label: 'Total Characters', value: totalChars },
      { label: 'No Spaces', value: noSpaces },
      { label: 'Letters', value: letters },
      { label: 'Numbers', value: numbers },
      { label: 'Symbols', value: symbols, isAccent: true }
    ];
  },
  actions: [
    {
      id: 'strip-spaces',
      label: 'Strip All Whitespace',
      run: (text) => text.replace(/\s/g, '')
    },
    {
      id: 'strip-numbers',
      label: 'Strip Numbers',
      run: (text) => text.replace(/[0-9]/g, '')
    },
    {
      id: 'strip-symbols',
      label: 'Strip Punctuation',
      run: (text) => text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    }
  ],
  renderInsights: (text) => {
    if (text.trim() === '') return null;

    // Calculate frequency distribution of top letters
    const frequencies: Record<string, number> = {};
    const lowerText = text.toLowerCase();
    let totalAlpha = 0;

    for (let char of lowerText) {
      if (char >= 'a' && char <= 'z') {
        frequencies[char] = (frequencies[char] || 0) + 1;
        totalAlpha++;
      }
    }

    const sortedChars = Object.entries(frequencies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    return (
      <div className="rounded-lg border border-gray-100 p-4 space-y-3" id="cc-insights-container">
        <h4 className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest">Character Frequency Index (Top Letters)</h4>
        {sortedChars.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {sortedChars.map(([letter, freq]) => {
              const pct = totalAlpha > 0 ? ((freq / totalAlpha) * 100).toFixed(0) : '0';
              return (
                <div key={letter} className="rounded-md border border-gray-100 bg-gray-50/50 p-2 text-center flex flex-col items-center">
                  <span className="font-mono font-bold text-sm text-gray-900 uppercase">"{letter}"</span>
                  <span className="mt-1 font-sans text-xs font-semibold text-gray-600">{freq} times</span>
                  <div className="mt-1.5 h-1 w-16 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-900" style={{ width: `${pct}%` }}></div>
                  </div>
                  <span className="mt-1 font-mono text-[9px] text-gray-400">{pct}% distribution</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-gray-400">Type letters in the scratchpad to see active density statistics.</p>
        )}
      </div>
    );
  }
};

// 3. Line Counter Plugin
const lineCounterPlugin: TextPlugin = {
  id: 'line-counter',
  name: 'Line Counter & Text Segmenter',
  description: 'Calculate total lines, non-empty lines, empty lines, and standard structural segment counts.',
  iconName: 'AlignLeft',
  calculateMetrics: (text) => {
    if (!text) {
      return [
        { label: 'Total Lines', value: 0 },
        { label: 'Non-Empty Lines', value: 0 },
        { label: 'Empty Lines', value: 0 },
        { label: 'Max Line Length', value: 0 },
        { label: 'Avg Line Length', value: 0, isAccent: true }
      ];
    }

    const lines = text.split(/\r?\n/);
    const totalLines = lines.length;
    const nonEmptyLines = lines.filter(l => l.trim().length > 0).length;
    const emptyLines = totalLines - nonEmptyLines;
    
    let maxLen = 0;
    let sumLen = 0;
    lines.forEach(l => {
      maxLen = Math.max(maxLen, l.length);
      sumLen += l.length;
    });
    
    const avgLen = totalLines > 0 ? Math.round(sumLen / totalLines) : 0;

    return [
      { label: 'Total Lines', value: totalLines },
      { label: 'Non-Empty Lines', value: nonEmptyLines },
      { label: 'Empty Lines', value: emptyLines },
      { label: 'Max Row Size', value: maxLen },
      { label: 'Avg Row Size', value: avgLen, isAccent: true }
    ];
  },
  actions: [
    {
      id: 'sort-asc',
      label: 'Sort Lines (A-Z)',
      run: (text) => text.split(/\r?\n/).sort((a, b) => a.localeCompare(b)).join('\n')
    },
    {
      id: 'sort-desc',
      label: 'Sort Lines (Z-A)',
      run: (text) => text.split(/\r?\n/).sort((a, b) => b.localeCompare(a)).join('\n')
    },
    {
      id: 'strip-blanks',
      label: 'Strip All Blank Lines',
      run: (text) => text.split(/\r?\n/).filter(l => l.trim().length > 0).join('\n')
    },
    {
      id: 'reverse-lines',
      label: 'Reverse Line Order',
      run: (text) => text.split(/\r?\n/).reverse().join('\n')
    }
  ],
  renderInsights: (text) => {
    if (!text) return null;
    const lines = text.split(/\r?\n/);
    
    return (
      <div className="rounded-lg border border-gray-100 p-4 space-y-2" id="lc-insights-container">
        <h4 className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Structural Line Registry</h4>
        <div className="max-h-40 overflow-y-auto border border-gray-50 rounded bg-gray-50/30 p-2 space-y-1.5 scrollbar-thin">
          {lines.slice(0, 20).map((line, idx) => (
            <div key={idx} className="flex items-center justify-between font-mono text-[10px] text-gray-600 border-b border-gray-100/40 pb-1">
              <span className="text-gray-400">Row #{idx + 1}</span>
              <span className="truncate max-w-xs px-2 text-gray-900 font-medium">
                {line.trim() === '' ? <span className="text-red-400 italic">[Blank]</span> : line}
              </span>
              <span className="text-gray-500 font-semibold">{line.length} Chars &bull; {line.trim() === '' ? 0 : line.trim().split(/\s+/).length} Words</span>
            </div>
          ))}
          {lines.length > 20 && (
            <div className="text-center font-mono text-[9px] text-gray-400 py-1">
              And {lines.length - 20} more lines...
            </div>
          )}
        </div>
      </div>
    );
  }
};

// 4. Case Converter Plugin
const caseConverterPlugin: TextPlugin = {
  id: 'case-converter',
  name: 'Smart Case Converter',
  description: 'Instantly convert your text blocks between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and Sentence case.',
  iconName: 'RefreshCw',
  calculateMetrics: (text) => {
    const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const charCount = text.length;
    const upperCount = text.replace(/[^A-Z]/g, '').length;
    const lowerCount = text.replace(/[^a-z]/g, '').length;

    return [
      { label: 'Words Counted', value: wordCount },
      { label: 'Chars Counted', value: charCount },
      { label: 'Uppercase Letters', value: upperCount },
      { label: 'Lowercase Letters', value: lowerCount, isAccent: true }
    ];
  },
  actions: [
    {
      id: 'upper',
      label: 'UPPERCASE',
      run: (text) => text.toUpperCase()
    },
    {
      id: 'lower',
      label: 'lowercase',
      run: (text) => text.toLowerCase()
    },
    {
      id: 'title',
      label: 'Title Case',
      run: (text) => text
        .toLowerCase()
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    },
    {
      id: 'sentence',
      label: 'Sentence case',
      run: (text) => text
        .toLowerCase()
        .replace(/(^\s*|[.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase())
    },
    {
      id: 'camel',
      label: 'camelCase',
      run: (text) => text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
        .replace(/^[A-Z]/, (m) => m.toLowerCase())
    },
    {
      id: 'snake',
      label: 'snake_case',
      run: (text) => text
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '')
    },
    {
      id: 'kebab',
      label: 'kebab-case',
      run: (text) => text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
    },
    {
      id: 'pascal',
      label: 'PascalCase',
      run: (text) => text
        .toLowerCase()
        .replace(/(?:^|\s|-|_)(.)/g, (m, chr) => chr.toUpperCase())
        .replace(/[^a-zA-Z0-9]/g, '')
    },
    {
      id: 'constant',
      label: 'CONSTANT_CASE',
      run: (text) => text
        .toUpperCase()
        .replace(/\s+/g, '_')
        .replace(/[^A-Z0-9_]/g, '')
    },
    {
      id: 'toggle',
      label: 'tOgGlE cAsE',
      run: (text) => text
        .split('')
        .map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase())
        .join('')
    }
  ]
};

// 5. Remove Extra Spaces Plugin
const removeExtraSpacesPlugin: TextPlugin = {
  id: 'remove-extra-spaces',
  name: 'Extra Space Remover & Trim Utility',
  description: 'Clean up ragged formatting by removing double spaces, trailing tabs, excess blank lines, and line indentation discrepancies.',
  iconName: 'Eraser',
  calculateMetrics: (text) => {
    const rawLen = text.length;
    const spacesCount = (text.match(/ /g) || []).length;
    
    // Check redundancy
    const doubleSpaces = (text.match(/  +/g) || []).length;
    const trailingSpaces = text.split(/\n/).filter(line => /[ \t]+$/.test(line)).length;
    const blankLines = (text.match(/^\s*$/gm) || []).length;

    return [
      { label: 'Character Count', value: rawLen },
      { label: 'Total Whitespaces', value: spacesCount },
      { label: 'Double Spaces', value: doubleSpaces },
      { label: 'Lines with Trailing Tabs', value: trailingSpaces },
      { label: 'Blank Rows Tracked', value: blankLines, isAccent: true }
    ];
  },
  actions: [
    {
      id: 'collapse-spaces',
      label: 'Collapse Double Spaces',
      run: (text) => text.replace(/  +/g, ' ')
    },
    {
      id: 'trim-lines',
      label: 'Trim Leading & Trailing Spaces',
      run: (text) => text.split(/\r?\n/).map(line => line.trim()).join('\n')
    },
    {
      id: 'remove-blanks',
      label: 'Collapse Multi-Blank Lines',
      run: (text) => text.replace(/\n\s*\n\s*\n/g, '\n\n')
    },
    {
      id: 'tabs-to-spaces',
      label: 'Convert Tabs to 4 Spaces',
      run: (text) => text.replace(/\t/g, '    ')
    },
    {
      id: 'clean-everything',
      label: 'Complete Smart Cleanup',
      run: (text) => text
        .split(/\r?\n/)
        .map(line => line.trim().replace(/  +/g, ' '))
        .filter(line => line.length > 0)
        .join('\n')
    }
  ]
};

export const TEXT_PLUGINS: Record<string, TextPlugin> = {
  'word-counter': wordCounterPlugin,
  'character-counter': characterCounterPlugin,
  'line-counter': lineCounterPlugin,
  'case-converter': caseConverterPlugin,
  'remove-extra-spaces': removeExtraSpacesPlugin
};
