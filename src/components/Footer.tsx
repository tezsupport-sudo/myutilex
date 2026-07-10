import { Globe } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  selectedRegion: string;
  onSetRegion: (region: string) => void;
}

export default function Footer({ onNavigate, selectedRegion, onSetRegion }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const regions = [
    { id: 'global', label: '🌐 Global standard' },
    { id: 'us', label: '🇺🇸 United States' },
    { id: 'in', label: '🇮🇳 India' },
    { id: 'uk', label: '🇬🇧 United Kingdom' },
    { id: 'au', label: '🇦🇺 Australia' }
  ];

  return (
    <footer className="mt-auto border-t border-gray-200 bg-white/80 py-6 dark:border-gray-850 dark:bg-gray-950/80 transition-all duration-200" id="site-footer">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Modern Compact Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start text-xs border-b border-gray-100 dark:border-gray-850 pb-5" id="footer-main-grid">
          
          {/* Column 1: Core Brand Identity */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-sans font-bold text-gray-900 dark:text-white tracking-tight text-sm">Utility Hub</span>
              <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 font-mono text-[9px] font-bold text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-750">v1.6</span>
            </div>
            <p className="max-w-xs font-sans text-gray-400 dark:text-gray-500 leading-normal">
              A private, client-side toolkit executing secure parser operations strictly in-browser. Maximum confidentiality.
            </p>
            {/* Region select inline */}
            <div className="flex items-center space-x-2 pt-1">
              <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-wider">Region:</span>
              <select
                value={selectedRegion}
                onChange={(e) => onSetRegion(e.target.value)}
                className="rounded border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 px-1.5 py-0.5 font-sans text-[10px] text-gray-500 dark:text-gray-400 outline-none hover:border-gray-300 dark:hover:border-gray-700"
                id="footer-region-select"
              >
                {regions.map((reg) => (
                  <option key={reg.id} value={reg.id}>
                    {reg.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Column 2: Popular Tools Index */}
          <div>
            <h4 className="font-mono text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Popular Tools</h4>
            <div className="grid grid-cols-2 gap-1 text-gray-500 dark:text-gray-400 font-semibold">
              <button onClick={() => onNavigate('tool-json-formatter')} className="hover:text-gray-900 dark:hover:text-white text-left transition-colors">
                JSON Beautifier
              </button>
              <button onClick={() => onNavigate('tool-password-generator')} className="hover:text-gray-900 dark:hover:text-white text-left transition-colors">
                Pass Generator
              </button>
              <button onClick={() => onNavigate('tool-word-counter')} className="hover:text-gray-900 dark:hover:text-white text-left transition-colors">
                Word Counter
              </button>
              <button onClick={() => onNavigate('tool-age-calculator')} className="hover:text-gray-900 dark:hover:text-white text-left transition-colors">
                Age Calculator
              </button>
            </div>
          </div>

          {/* Column 3: Platform & Editorial Quick links as requested */}
          <div>
            <h4 className="font-mono text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Platform Quicklinks</h4>
            <div className="grid grid-cols-2 gap-1 text-gray-500 dark:text-gray-400 font-semibold">
              <button onClick={() => onNavigate('review')} className="hover:text-indigo-600 dark:hover:text-indigo-400 text-left transition-colors font-bold text-indigo-500 flex items-center space-x-1">
                <span>QA Review Board</span>
                <span className="text-[8px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-1 py-0.2 rounded font-mono">NEW</span>
              </button>
              <button onClick={() => onNavigate('about')} className="hover:text-gray-900 dark:hover:text-white text-left transition-colors">
                About Us
              </button>
              <button onClick={() => onNavigate('privacy')} className="hover:text-gray-900 dark:hover:text-white text-left transition-colors">
                Privacy Policy
              </button>
              <button onClick={() => onNavigate('terms')} className="hover:text-gray-900 dark:hover:text-white text-left transition-colors">
                Terms of Use
              </button>
              <button onClick={() => onNavigate('disclaimer')} className="hover:text-gray-900 dark:hover:text-white text-left transition-colors">
                Disclaimer
              </button>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-white text-left transition-colors">
                GitHub Repo
              </a>
            </div>
          </div>

        </div>

        {/* Dynamic Legal & Safety Sub-Banner */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-gray-400 dark:text-gray-500" id="footer-sub-banner">
          <div>
            &copy; {currentYear} Utility Hub. Made with ❤️ for a private web experience.
          </div>
          <div className="flex items-center space-x-3 font-medium">
            <span>CSPRNG Secure</span>
            <span>•</span>
            <span>GDPR Compliant</span>
            <span>•</span>
            <span>Keyboard Accessible</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
