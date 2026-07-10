import React from 'react';

interface StaticViewProps {
  view: string;
  onBack: () => void;
}

export default function StaticView({ view, onBack }: StaticViewProps) {
  const titles: Record<string, string> = {
    privacy: 'Privacy Commitment Policy',
    terms: 'Universal Terms of Use',
    disclaimer: 'General Operations Disclaimer',
    about: 'About Utility Hub',
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <button
        onClick={onBack}
        className="mb-4 text-xs font-mono font-semibold text-gray-500 hover:text-gray-900 transition-colors"
      >
        &larr; Back to Dashboard
      </button>
      <h1 className="text-2xl font-bold tracking-tight text-gray-950 mb-4">{titles[view]}</h1>
      <div className="text-sm text-gray-600 leading-relaxed space-y-4">
        {view === 'about' ? (
          <>
            <p>
              <strong>Utility Hub</strong> is an elegant collection of 100% browser-local client-side utilities built for individuals and developers who prioritize privacy, speed, and clean typography.
            </p>
            <p>
              Unlike standard online converters and tools that require you to upload your sensitive files, documents, or data payloads to their remote servers, Utility Hub executes all processing workflows in a secured sandboxed context on your own device.
            </p>
            <p>
              By leveraging modern web capabilities, React, and local hardware optimization, we deliver lightning-fast conversion and formatting with zero network overhead. No data ever leaves your computer.
            </p>
          </>
        ) : (
          <>
            <p>
              We take your digital privacy and operational integrity with the utmost seriousness. Our platform operates on a <strong>Local-First Client-Side model</strong>, ensuring zero analytical or technical inputs are transmitted outside your browser instance.
            </p>
            <p>
              No external tracking codes, remote servers, databases, or cookies process user metadata beyond the secure storage tools of your native client. This ensures immediate GDPR and CCPA compliance without the requirement of intricate third-party firewalls.
            </p>
            <p>
              By utilizing our standard software suite, you acknowledge that all calculations are rendered for immediate diagnostic use only. For commercial integrations, users should double-verify parameters prior to implementation.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
