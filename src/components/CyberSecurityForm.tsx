'use client';

import { useState } from 'react';

interface CyberSecurityFormProps {
  loading: boolean;
  onAssess: (flags: string[], additionalContext: string) => void;
}

const FLAG_GROUPS = [
  {
    title: 'Identity Verification',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    flags: [
      'Caller could not verify their full name',
      'Caller failed security questions',
      'Caller refused to provide employee ID',
    ],
  },
  {
    title: 'Behavioral Red Flags',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    flags: [
      'Caller is pressuring for immediate action / urgency',
      'Caller has unusual knowledge of internal systems',
      "Caller's phone number doesn't match records",
    ],
  },
  {
    title: 'Request Anomalies',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    flags: [
      "Caller is requesting access to another user's account",
      'Caller is requesting password reset for a VIP/admin account',
      'Request involves disabling security features (MFA, etc.)',
    ],
  },
];

export function CyberSecurityForm({ loading, onAssess }: CyberSecurityFormProps) {
  const [selectedFlags, setSelectedFlags] = useState<Set<string>>(new Set());
  const [otherFlag, setOtherFlag] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');

  const handleFlagToggle = (flag: string) => {
    setSelectedFlags((prev) => {
      const next = new Set(prev);
      if (next.has(flag)) {
        next.delete(flag);
      } else {
        next.add(flag);
      }
      return next;
    });
  };

  const handleAssess = () => {
    const flags = Array.from(selectedFlags);
    if (otherFlag.trim()) {
      flags.push(`Other: ${otherFlag.trim()}`);
    }
    onAssess(flags, additionalContext);
  };

  const canAssess = selectedFlags.size > 0 || otherFlag.trim().length > 0;
  const selectedCount = selectedFlags.size + (otherFlag.trim() ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 200, 255, 0.1) 0%, rgba(0, 200, 255, 0.05) 100%)',
            border: '1px solid rgba(0, 200, 255, 0.2)',
          }}
        >
          <svg
            className="w-8 h-8"
            style={{ color: '#00C8FF' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <h2
          className="text-2xl font-bold mb-2"
          style={{
            fontFamily: 'var(--font-mono)',
            color: '#F0F2F5',
          }}
        >
          Security Assessment
        </h2>
        <p style={{ color: '#8B8FA3', fontSize: '0.875rem' }}>
          Evaluate caller interactions for potential threats
        </p>
      </div>

      {/* Flag Groups */}
      <div className="space-y-4">
        {FLAG_GROUPS.map((group) => (
          <div
            key={group.title}
            className="rounded-xl overflow-hidden"
            style={{
              background: '#12141C',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            {/* Group Header */}
            <div
              className="px-4 py-3 flex items-center gap-2"
              style={{
                background: 'rgba(28, 31, 42, 0.5)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <span style={{ color: '#00C8FF' }}>{group.icon}</span>
              <span
                className="text-sm font-medium"
                style={{ color: '#8B8FA3' }}
              >
                {group.title}
              </span>
            </div>

            {/* Flags */}
            <div className="p-2">
              {group.flags.map((flag) => {
                const isSelected = selectedFlags.has(flag);
                return (
                  <label
                    key={flag}
                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200"
                    style={{
                      background: isSelected
                        ? 'rgba(0, 200, 255, 0.08)'
                        : 'transparent',
                      borderLeft: isSelected
                        ? '2px solid #00C8FF'
                        : '2px solid transparent',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleFlagToggle(flag)}
                    />
                    <span
                      className="text-sm transition-colors duration-200"
                      style={{
                        color: isSelected ? '#F0F2F5' : '#8B8FA3',
                      }}
                    >
                      {flag}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        {/* Other Flag */}
        <div
          className="rounded-xl p-4"
          style={{
            background: '#12141C',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={otherFlag.length > 0}
              readOnly
              className="mt-1"
            />
            <div className="flex-1">
              <span
                className="text-sm font-medium block mb-2"
                style={{ color: '#8B8FA3' }}
              >
                Other Concern
              </span>
              <input
                type="text"
                value={otherFlag}
                onChange={(e) => setOtherFlag(e.target.value)}
                placeholder="Describe any other suspicious behavior..."
                className="w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 input-glow"
                style={{
                  background: '#1C1F2A',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#F0F2F5',
                  outline: 'none',
                }}
              />
            </div>
          </label>
        </div>
      </div>

      {/* Additional Context */}
      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: '#8B8FA3' }}
        >
          Additional Context
        </label>
        <textarea
          value={additionalContext}
          onChange={(e) => setAdditionalContext(e.target.value)}
          placeholder="Provide any additional context about the interaction..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 input-glow resize-none"
          style={{
            background: '#1C1F2A',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#F0F2F5',
            outline: 'none',
          }}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleAssess}
        disabled={!canAssess || loading}
        className="w-full py-4 px-6 rounded-xl font-semibold text-white btn-gradient flex items-center justify-center gap-3 relative overflow-hidden"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.9375rem',
        }}
      >
        {loading ? (
          <>
            <div className="absolute inset-0 loading-shimmer" />
            <svg
              className="w-5 h-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Analyzing Threat...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span>Analyze Threat</span>
            {selectedCount > 0 && (
              <span
                className="px-2 py-0.5 rounded-full text-xs"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                }}
              >
                {selectedCount} selected
              </span>
            )}
          </>
        )}
      </button>
    </div>
  );
}
