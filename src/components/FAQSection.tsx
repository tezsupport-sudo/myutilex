import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { designTokens } from '../designSystem';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: 'Does my uploaded, typed, or pasted data ever contact a remote server?',
      answer: 'Absolutely not. All computations, text parsing, formatting, conversions, and cryptographies execute strictly within your local browser sandbox memory. You can verify this anytime by opening your browser DevTools (F12) Network panel: zero network data blocks leave your computer.'
    },
    {
      question: 'Can I use SmartUtils when I am completely disconnected from the internet?',
      answer: 'Yes! All required scripts, stylesheets, and fonts are compiled directly into the offline-ready web application bundle. Once the application loads in your tab, you can disconnect your internet, go into airplane mode, and use all utilities with perfect functionality.'
    },
    {
      question: 'Where are my bookmarks, history, and custom settings stored?',
      answer: 'All configuration preferences, recent search records, favorites, and history items are saved locally in your own browser using standard Web Storage (LocalStorage). No user database profiles are maintained on our cloud servers.'
    },
    {
      question: 'Is there a file size limit or processing capacity cap on these tools?',
      answer: 'Because all processes execute on your own hardware, limits are governed entirely by your local machine\'s processing thread and RAM capacity. This bypasses sluggish shared remote server queues, delivering infinite scalability governed by your device.'
    },
    {
      question: 'Are the random password generators and crypto keys truly secure?',
      answer: 'Yes. Our utilities leverage the native browser cryptographic library (window.crypto.getRandomValues), which uses a secure cryptographically strong pseudo-random number generator (CSPRNG) backed by your hardware system entropy.'
    },
    {
      question: 'Why is this platform entirely free and without accounts?',
      answer: 'Because the computational overhead is loaded onto your local device, we do not require expensive cloud database arrays, load-balancing servers, or multi-tenant database clusters. This keeps our operational footprint near-zero, allowing us to keep this sandbox entirely free and anonymous.'
    }
  ];

  return (
    <section className="py-16 transition-colors" id="homepage-faq-section">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1 font-mono text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <HelpCircle size={11} /> Transparent Operations FAQ
          </span>
          <h2 className={designTokens.typography.displayL + ' mt-1'}>
            Answering Your Questions
          </h2>
          <p className="mt-2 font-sans text-xs text-gray-500 dark:text-gray-400">
            Have queries about how local browser compilation guarantees security? We have answers.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx} 
                className="rounded-xl border border-gray-150 bg-white dark:border-gray-800 dark:bg-gray-900 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-sans font-bold text-xs sm:text-sm text-gray-900 dark:text-white hover:bg-gray-50/50 dark:hover:bg-gray-850/30 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp size={16} className="text-indigo-500 shrink-0 ml-4" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-400 shrink-0 ml-4" />
                  )}
                </button>
                
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-gray-50 dark:border-gray-850/50">
                    <p className="font-sans text-xs text-gray-550 dark:text-gray-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
