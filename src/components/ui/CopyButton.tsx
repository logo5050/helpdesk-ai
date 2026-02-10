'use client';

import { useState, useCallback } from 'react';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className={`
        relative inline-flex items-center gap-1.5 px-3 py-1.5
        text-xs font-medium rounded-lg
        transition-all duration-200
        ${copied
          ? 'text-[#00E676] bg-[#00E67610]'
          : 'text-[#8B8FA3] hover:text-[#F0F2F5] hover:bg-[#1C1F2A]'
        }
        ${className}
      `}
      title="Copy to clipboard"
      style={{
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* Glow effect on copy */}
      {copied && (
        <div
          className="absolute inset-0 rounded-lg animate-fade-in"
          style={{
            background: 'rgba(0, 230, 118, 0.1)',
            boxShadow: '0 0 12px rgba(0, 230, 118, 0.3)',
          }}
        />
      )}

      <div className="relative flex items-center gap-1.5">
        {copied ? (
          <>
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ filter: 'drop-shadow(0 0 4px rgba(0, 230, 118, 0.5))' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Copied!</span>
          </>
        ) : (
          <>
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span>Copy</span>
          </>
        )}
      </div>
    </button>
  );
}
