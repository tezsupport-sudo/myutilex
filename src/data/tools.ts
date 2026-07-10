import { ToolMetadata } from '../types';

export const CATEGORIES = [
  { id: 'text', name: 'Text Utility Tools', description: 'Modify, count, and analyze text instantly in your browser.', icon: 'Type' },
  { id: 'calculator', name: 'Calculators', description: 'Accurate financial, age, and mathematical calculation tools.', icon: 'Calculator' },
  { id: 'developer', name: 'Developer Utilities', description: 'JSON formatting, code converters, and testing helper tools.', icon: 'Code' },
  { id: 'generator', name: 'Generators', description: 'Create secure passwords, QR codes, and random test data.', icon: 'Key' },
  { id: 'converter', name: 'Data Converters', description: 'Fast encoding, decoding, and metric unit converters.', icon: 'RefreshCw' },
] as const;

export const TOOLS: ToolMetadata[] = [
  {
    id: 'word-counter',
    name: 'Word Counter & Text Analyzer',
    description: 'Calculate real-time word count, character count, estimated reading time, sentence count, and paragraphs with detailed analytics.',
    category: 'text',
    iconName: 'Type',
    globalKeywords: ['word counter', 'character counter', 'reading time', 'text statistics', 'free tool'],
    howToUse: [
      'Type or paste your content into the main input textarea.',
      'Check the real-time statistic cards above the input field.',
      'Review additional insights like average word length and paragraph density instantly.',
      'Click "Clear All" or "Copy Text" to manage your scratchpad.'
    ],
    formulaTitle: 'How Text Statistics Are Calculated',
    formulaDescription: 'Words are split by spaces and word-boundary regex patterns. Reading time is determined using the international average reading standard of 200 Words Per Minute (WPM). Sentences are calculated using typical punctuation marks (., !, ?).',
    faqs: [
      {
        question: 'Is my text sent to a server?',
        answer: 'Absolutely not. All processing is executed 100% locally in your browser. Your text never leaves your device.'
      },
      {
        question: 'How is Reading Time calculated?',
        answer: 'It uses the standard human reading pace of 200 words per minute. For example, a 400-word article takes exactly 2 minutes to read.'
      },
      {
        question: 'Does it support multiple spaces and newlines?',
        answer: 'Yes, our smart parsing algorithm collapses multiple sequential whitespaces and blank line boundaries to prevent inflated counts.'
      }
    ],
    difficulty: 'Easy',
    estimatedTime: '5 seconds',
    version: '1.2',
    changelog: ['Added real-time word limit alerts', 'Fixed foreign word UTF-8 parsing boundaries', 'Optimized text block paragraph counter'],
    averageLatency: '< 5ms',
    popularScore: 98,
    offlineReady: true,
    apiRequired: false,
    aiPowered: false,
    supportsDragDrop: true,
    supportsBatch: false,
    fileSizeLimit: '10MB',
    browserCompatibility: 'All Modern Browsers (Chrome, Safari, Firefox, Edge)',
    mobileReady: true,
    hasKeyboardShortcuts: false
  },
  {
    id: 'age-calculator',
    name: 'Precise Age & Countdown Calculator',
    description: 'Find your exact age down to years, months, weeks, days, and hours. Get a live countdown to your next birthday and custom zodiac details.',
    category: 'calculator',
    iconName: 'CalendarDays',
    globalKeywords: ['age calculator', 'birthday countdown', 'days lived', 'exact age finder'],
    howToUse: [
      'Select your exact Date of Birth from the date picker.',
      'Click the "Calculate" button to view your comprehensive life dashboard.',
      'Explore your age represented in months, weeks, days, and total hours lived.',
      'Observe the remaining countdown timer for your upcoming birthday celebration!'
    ],
    formulaTitle: 'The Date-Diff Calculation Standard',
    formulaDescription: 'Our system utilizes Gregorian calendar arithmetic, calculating exact leap year adjustments, varying month lengths (28, 29, 30, or 31 days), and precise timezone differentials from your local device clock.',
    faqs: [
      {
        question: 'How does the calculator handle leap years?',
        answer: 'It accurately checks the year status for every year between your birth date and the current date, adding exactly 29 days for February in leap years.'
      },
      {
        question: 'What is the date format used?',
        answer: 'For global accessibility, we accept native date selectors and output results in a globally recognized "Day Month Year" text format (e.g., 25 June 2026).'
      }
    ],
    difficulty: 'Easy',
    estimatedTime: '10 seconds',
    version: '1.3',
    changelog: ['Added Zodiac mapping calculations', 'Fixed Gregorian calendar leap gap', 'Added live precise microsecond clock'],
    averageLatency: '< 8ms',
    popularScore: 94,
    offlineReady: true,
    apiRequired: false,
    aiPowered: false,
    supportsDragDrop: false,
    supportsBatch: false,
    fileSizeLimit: 'None',
    browserCompatibility: 'All Modern Browsers (Chrome, Safari, Firefox, Edge)',
    mobileReady: true,
    hasKeyboardShortcuts: false
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter, Validator & Minifier',
    description: 'Clean, pretty-print, validate, minify, and inspect JSON structures instantly with inline syntax validation indicators.',
    category: 'developer',
    iconName: 'Braces',
    globalKeywords: ['json formatter', 'pretty print json', 'json minifier', 'json validator', 'beautify json'],
    howToUse: [
      'Paste raw, unformatted, or minified JSON text into the source panel.',
      'Use "Format JSON" to prettify with standard 2-space tab indentations.',
      'Click "Minify JSON" to compress the structure into a single tight line.',
      'Check the status bar for any syntax validation warnings or error messages.'
    ],
    formulaTitle: 'JSON parsing and serialization rules',
    formulaDescription: 'Validates code adherence using the RFC 8259 JSON standard. Serialization parses JSON native strings and maps keys with indentations or minifies using optimized regex whitespace stripping.',
    faqs: [
      {
        question: 'What happens if there is an error in my JSON?',
        answer: 'The validator displays an inline warning showing the exact structural token error and approximate line number so you can fix it quickly.'
      },
      {
        question: 'Does this tool support JSON5 or comments?',
        answer: 'This utility enforces the strict standard JSON specifications. Comments and unquoted keys will be highlighted as invalid to keep your payload production-ready.'
      }
    ],
    difficulty: 'Medium',
    estimatedTime: '15 seconds',
    version: '1.4',
    changelog: ['Added RFC 8259 compliance tests', 'Optimized key-quote auto parsing speeds', 'Fixed nested object minifier whitespace bugs'],
    averageLatency: '< 12ms',
    popularScore: 99,
    offlineReady: true,
    apiRequired: false,
    aiPowered: false,
    supportsDragDrop: true,
    supportsBatch: true,
    fileSizeLimit: '25MB',
    browserCompatibility: 'All Modern Browsers (Chrome, Safari, Firefox, Edge)',
    mobileReady: true,
    hasKeyboardShortcuts: true
  },
  {
    id: 'password-generator',
    name: 'Secure Password Generator',
    description: 'Create high-entropy cryptographically secure random passwords with adjustable length, complexity filters, and custom characters.',
    category: 'generator',
    iconName: 'ShieldAlert',
    globalKeywords: ['password generator', 'random password', 'secure key generator', 'password strength tool'],
    howToUse: [
      'Choose your preferred password length using the slider (8 to 64 characters).',
      'Toggle checkboxes to include uppercase letters, numbers, and special symbols.',
      'Click "Generate Password" to run the secure random generator.',
      'Review the live password strength score and copy it directly to your clipboard.'
    ],
    formulaTitle: 'Cryptographic Entropy Formula',
    formulaDescription: 'The generator uses the browser\'s secure Web Cryptography API (window.crypto.getRandomValues) rather than standard Math.random. Password entropy is calculated in bits using: E = L × log2(R), where L is length and R is pool size.',
    faqs: [
      {
        question: 'Is this safer than standard random generators?',
        answer: 'Yes. It uses cryptographically secure pseudo-random number generators (CSPRNG), making the output completely unpredictable and resistant to reverse engineering.'
      },
      {
        question: 'Are my generated passwords stored anywhere?',
        answer: 'No. They are generated in volatile browser memory and are discarded as soon as you close or refresh the tab.'
      }
    ],
    difficulty: 'Medium',
    estimatedTime: '5 seconds',
    version: '1.5',
    changelog: ['Upgraded to window.crypto CSPRNG API', 'Added character set visual distribution index', 'Optimized password entropy formula indicator'],
    averageLatency: '< 3ms',
    popularScore: 97,
    offlineReady: true,
    apiRequired: false,
    aiPowered: false,
    supportsDragDrop: false,
    supportsBatch: true,
    fileSizeLimit: 'None',
    browserCompatibility: 'All Modern Browsers (Chrome, Safari, Firefox, Edge)',
    mobileReady: true,
    hasKeyboardShortcuts: false
  },
  {
    id: 'base64-converter',
    name: 'Base64 Encoder & Decoder',
    description: 'Encode plain text to standard Base64 string formats, or decode Base64 output back into highly legible text, 100% offline.',
    category: 'converter',
    iconName: 'RefreshCw',
    globalKeywords: ['base64 encoder', 'base64 decoder', 'base64 convert', 'text encoder'],
    howToUse: [
      'Type or paste your text into the corresponding panel (Plain Text or Base64 encoded).',
      'Click "Encode" to transform plain text to Base64, or "Decode" to revert base64 characters.',
      'Use the instant copy and clear buttons to manage your processed text fields.'
    ],
    formulaTitle: 'RFC 4648 Base64 Encoding standard',
    formulaDescription: 'Converts 8-bit binary bytes into a series of 6-bit index characters from a custom 64-character table (A-Z, a-z, 0-9, +, /) with "=" character padding adjustments.',
    faqs: [
      {
        question: 'What encoding is used during conversion?',
        answer: 'It uses standard UTF-8 string-to-byte conversion to ensure foreign language characters and emojis are preserved and decoded accurately.'
      },
      {
        question: 'Can I decode binary files?',
        answer: 'This version is specialized for text-based payloads. It guarantees clean translations for XML, JSON, URLs, and general textual parameters.'
      }
    ],
    difficulty: 'Medium',
    estimatedTime: '15 seconds',
    version: '1.2',
    changelog: ['Added UTF-8 Unicode compatibility bytes', 'Optimized large buffer memory recycling', 'Added immediate reactive output caching'],
    averageLatency: '< 10ms',
    popularScore: 95,
    offlineReady: true,
    apiRequired: false,
    aiPowered: false,
    supportsDragDrop: true,
    supportsBatch: false,
    fileSizeLimit: '5MB',
    browserCompatibility: 'All Modern Browsers (Chrome, Safari, Firefox, Edge)',
    mobileReady: true,
    hasKeyboardShortcuts: false
  },
  {
    id: 'character-counter',
    name: 'Character Counter & Frequency Analyzer',
    description: 'Track exact letter, number, and symbol occurrences. Analyze text distribution with inline progression indices.',
    category: 'text',
    iconName: 'Type',
    globalKeywords: ['character counter', 'letter counts', 'frequency analyzer'],
    howToUse: [
      'Type or paste your content into the main input textarea.',
      'Check the real-time statistic cards for characters, letters, numbers, and symbol metrics.',
      'Review the character frequency distribution index visually to see the most frequent letters.'
    ],
    faqs: [
      {
        question: 'What is the difference between total characters and no spaces?',
        answer: 'Total characters includes spaces, newlines, and tabs. "No Spaces" strips all whitespace before counting, representing only letters, numbers, and symbols.'
      }
    ],
    difficulty: 'Easy',
    estimatedTime: '5 seconds',
    version: '1.0',
    changelog: ['Released character frequency progress indicators'],
    averageLatency: '< 3ms',
    popularScore: 92,
    offlineReady: true,
    apiRequired: false,
    aiPowered: false,
    supportsDragDrop: true,
    supportsBatch: false,
    browserCompatibility: 'All Modern Browsers',
    mobileReady: true,
    hasKeyboardShortcuts: false
  },
  {
    id: 'line-counter',
    name: 'Line Counter & Text Segmenter',
    description: 'Calculate total lines, non-empty lines, empty lines, and standard structural segment counts.',
    category: 'text',
    iconName: 'Type',
    globalKeywords: ['line counter', 'text segmenter', 'row count'],
    howToUse: [
      'Paste your formatted content or program code into the input field.',
      'Review total, non-empty, and empty line statistics instantly.',
      'Use the utility actions to sort your text lines or strip blank spaces.'
    ],
    faqs: [],
    difficulty: 'Easy',
    estimatedTime: '3 seconds',
    version: '1.0',
    changelog: ['First release'],
    averageLatency: '0ms',
    popularScore: 80,
    offlineReady: true,
    apiRequired: false,
    aiPowered: false,
    supportsDragDrop: true,
    supportsBatch: false,
    browserCompatibility: 'All Modern Browsers',
    mobileReady: true,
    hasKeyboardShortcuts: false
  },
  {
    id: 'case-converter',
    name: 'Smart Case Converter',
    description: 'Instantly convert your text blocks between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and sentence case.',
    category: 'text',
    iconName: 'Type',
    globalKeywords: ['case converter', 'uppercase', 'lowercase', 'camelcase'],
    howToUse: [
      'Paste your text into the main scratchpad.',
      'Click on any of the supported casing formats like UPPERCASE, lowercase, snake_case, or Title Case.',
      'Copy the converted text immediately.'
    ],
    faqs: [],
    difficulty: 'Easy',
    estimatedTime: '3 seconds',
    version: '1.0',
    changelog: ['Added PascalCase and kebab-case conversions'],
    averageLatency: '0ms',
    popularScore: 85,
    offlineReady: true,
    apiRequired: false,
    aiPowered: false,
    supportsDragDrop: false,
    supportsBatch: false,
    browserCompatibility: 'All Modern Browsers',
    mobileReady: true,
    hasKeyboardShortcuts: false
  },
  {
    id: 'remove-extra-spaces',
    name: 'Extra Space Remover & Trim Utility',
    description: 'Clean up ragged formatting by removing double spaces, trailing tabs, excess blank lines, and line indentation discrepancies.',
    category: 'text',
    iconName: 'Type',
    globalKeywords: ['trim spaces', 'remove whitespace', 'clean formatting'],
    howToUse: [
      'Paste your content into the text window.',
      'Apply actions like Collapse Double Spaces or Trim Spaces.',
      'Use Complete Smart Cleanup to clean all extra tabs, whitespace, and empty lines at once.'
    ],
    faqs: [],
    difficulty: 'Easy',
    estimatedTime: '3 seconds',
    version: '1.0',
    changelog: ['Smart double space collapser launched'],
    averageLatency: '0ms',
    popularScore: 82,
    offlineReady: true,
    apiRequired: false,
    aiPowered: false,
    supportsDragDrop: true,
    supportsBatch: false,
    browserCompatibility: 'All Modern Browsers',
    mobileReady: true,
    hasKeyboardShortcuts: false
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder & Decoder',
    description: 'Safely percent-encode query strings or decode parameters into highly readable characters matching the RFC 3986 spec. (Coming Soon)',
    category: 'converter',
    iconName: 'RefreshCw',
    globalKeywords: ['url encode', 'url decode', 'percent encoding'],
    howToUse: ['Paste URL or query string parameters to convert.'],
    faqs: [],
    difficulty: 'Easy',
    estimatedTime: '3 seconds',
    version: '1.0',
    changelog: [],
    averageLatency: '0ms',
    popularScore: 88,
    offlineReady: true,
    apiRequired: false,
    aiPowered: false,
    supportsDragDrop: false,
    supportsBatch: false,
    browserCompatibility: 'All Modern Browsers',
    mobileReady: true,
    hasKeyboardShortcuts: false,
    isPlanned: true,
    plannedSprint: 'Sprint 3.4'
  },
  {
    id: 'minify-beautify',
    name: 'Code Minifier & Beautifier',
    description: 'Compress or pretty-print HTML, CSS, JavaScript, and XML source files using clean tab spacing filters. (Coming Soon)',
    category: 'developer',
    iconName: 'Braces',
    globalKeywords: ['minify', 'beautify', 'pretty print code', 'compress code'],
    howToUse: ['Select code language and trigger minification or formatting.'],
    faqs: [],
    difficulty: 'Medium',
    estimatedTime: '10 seconds',
    version: '1.0',
    changelog: [],
    averageLatency: '0ms',
    popularScore: 90,
    offlineReady: true,
    apiRequired: false,
    aiPowered: false,
    supportsDragDrop: true,
    supportsBatch: true,
    browserCompatibility: 'All Modern Browsers',
    mobileReady: true,
    hasKeyboardShortcuts: true,
    isPlanned: true,
    plannedSprint: 'Sprint 3.4'
  },
  {
    id: 'percentage-calculator',
    name: 'Advanced Percentage Formula Suite',
    description: 'Instantly resolve percentages: increases, decreases, standard ratios, fraction conversions, and compound values. (Coming Soon)',
    category: 'calculator',
    iconName: 'Calculator',
    globalKeywords: ['percentage calculator', 'percent decrease', 'discount calculator'],
    howToUse: ['Enter base and target parameters.'],
    faqs: [],
    difficulty: 'Easy',
    estimatedTime: '5 seconds',
    version: '1.0',
    changelog: [],
    averageLatency: '0ms',
    popularScore: 87,
    offlineReady: true,
    apiRequired: false,
    aiPowered: false,
    supportsDragDrop: false,
    supportsBatch: false,
    browserCompatibility: 'All Modern Browsers',
    mobileReady: true,
    hasKeyboardShortcuts: false,
    isPlanned: true,
    plannedSprint: 'Sprint 3.5'
  },
  {
    id: 'bmi-calculator',
    name: 'Precise Body Mass Index (BMI) Finder',
    description: 'Calculate BMI ratios with metric and imperial units. Check standard WHO classification indices and healthy weight target zones. (Coming Soon)',
    category: 'calculator',
    iconName: 'Calculator',
    globalKeywords: ['bmi finder', 'body mass index', 'weight calculator'],
    howToUse: ['Enter weight and height parameters.'],
    faqs: [],
    difficulty: 'Easy',
    estimatedTime: '5 seconds',
    version: '1.0',
    changelog: [],
    averageLatency: '0ms',
    popularScore: 83,
    offlineReady: true,
    apiRequired: false,
    aiPowered: false,
    supportsDragDrop: false,
    supportsBatch: false,
    browserCompatibility: 'All Modern Browsers',
    mobileReady: true,
    hasKeyboardShortcuts: false,
    isPlanned: true,
    plannedSprint: 'Sprint 3.5'
  },
  {
    id: 'image-compressor',
    name: 'Smart client-side Image Compressor',
    description: 'Reduce JPEG, PNG, and WebP image file sizes by up to 90% without losing visual clarity using pure browser canvas API bounds.',
    category: 'converter',
    iconName: 'RefreshCw',
    globalKeywords: ['compress image', 'reduce image size', 'client side resize', 'transcode image', 'image converter'],
    howToUse: [
      'Drag and drop an image file (JPEG, PNG, or WebP) or select one manually.',
      'Adjust the compression quality slider to control the target image size.',
      'Optionally set resize constraints (e.g., scale to target width or custom bounds).',
      'Download your optimized client-side compressed image file instantly.'
    ],
    faqs: [
      {
        question: 'Are my images uploaded to any server?',
        answer: 'Absolutely not. This compressor executes 100% locally on your computer inside browser memory using the HTML5 Canvas API. Your files are completely safe.'
      },
      {
        question: 'Does the PNG output support transparency?',
        answer: 'Yes! PNG conversions maintain alpha channel transparency. However, note that PNG is lossless, so it ignores the compression quality slider.'
      }
    ],
    difficulty: 'Medium',
    estimatedTime: '15 seconds',
    version: '1.0',
    changelog: ['Initial client-side high-fidelity compressor launch', 'Added WebP modern transcode support', 'Integrated smart aspect-ratio resizer'],
    averageLatency: '< 15ms',
    popularScore: 92,
    offlineReady: true,
    apiRequired: false,
    aiPowered: false,
    supportsDragDrop: true,
    supportsBatch: false,
    browserCompatibility: 'All Modern Browsers',
    mobileReady: true,
    hasKeyboardShortcuts: false
  },
  {
    id: 'pdf-merger',
    name: 'Client-Side PDF Merger & Page Extractor',
    description: 'Securely combine multiple PDF streams or split individual documents into independent single-page files, entirely locally.',
    category: 'converter',
    iconName: 'RefreshCw',
    globalKeywords: ['merge pdf', 'split pdf', 'extract pdf pages', 'pdf compiler', 'pdf joiner'],
    howToUse: [
      'Add or drop one or multiple PDF files to initialize the document workspace queue.',
      'For merging: Arrange the files in your desired sequence using the queue controls.',
      'For extraction: Specify custom page ranges like "1-3, 5, 8" to split or cut pages.',
      'Click "Compile PDF Document" and download your newly compiled local PDF.'
    ],
    faqs: [
      {
        question: 'Are my PDF documents uploaded to external servers?',
        answer: 'No. Just like all our engines, PDF compiling and extraction run 100% locally inside your web browser using high-performance stream handlers. Your private documents never touch the cloud.'
      },
      {
        question: 'How do I specify page ranges for extraction?',
        answer: 'You can use individual page numbers separated by commas (e.g., "1, 3, 5") or ranges (e.g., "2-6"). You can also combine them (e.g., "1-3, 5, 7-9"). Type "all" to copy the entire document.'
      }
    ],
    difficulty: 'Medium',
    estimatedTime: '20 seconds',
    version: '1.0',
    changelog: [
      'Initial release of client-side PDF Engine v1.0',
      'Implemented secure local pdf-lib compiler framework',
      'Added dynamic drag-and-drop document queue with custom ordering controls'
    ],
    averageLatency: '< 50ms',
    popularScore: 89,
    offlineReady: true,
    apiRequired: false,
    aiPowered: false,
    supportsDragDrop: true,
    supportsBatch: true,
    browserCompatibility: 'All Modern Browsers',
    mobileReady: true,
    hasKeyboardShortcuts: false
  }
];
