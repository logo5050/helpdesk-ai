'use client';

import { useState } from 'react';
import { Button, Textarea } from './ui';
import { SECURITY_FLAGS } from '@/lib/types';

interface CyberSecurityFormProps {
  loading: boolean;
  onAssess: (flags: string[], additionalContext: string) => void;
}

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-100 mb-4 font-mono">
          Security Concern Indicators
        </h2>
        <p className="text-sm text-slate-400 mb-4">
          Select all flags that apply to this interaction:
        </p>

        <div className="space-y-2">
          {SECURITY_FLAGS.map((flag) => (
            <label
              key={flag}
              className="flex items-start gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedFlags.has(flag)}
                onChange={() => handleFlagToggle(flag)}
                className="mt-0.5 w-4 h-4 rounded border-slate-600 bg-slate-800 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-950"
              />
              <span className="text-sm text-slate-300">{flag}</span>
            </label>
          ))}

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={otherFlag.length > 0}
                readOnly
                className="mt-0.5 w-4 h-4 rounded border-slate-600 bg-slate-800 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-950"
              />
              <div className="flex-1">
                <span className="text-sm text-slate-300">Other:</span>
                <input
                  type="text"
                  value={otherFlag}
                  onChange={(e) => setOtherFlag(e.target.value)}
                  placeholder="Describe any other concerning behavior..."
                  className="w-full mt-2 px-3 py-2 rounded-lg bg-slate-800 text-slate-100 border border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none text-sm"
                />
              </div>
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Additional Context
        </label>
        <Textarea
          value={additionalContext}
          onChange={(e) => setAdditionalContext(e.target.value)}
          placeholder="Provide any additional context about the call or interaction (e.g., caller demeanor, specific requests, timeline of events)..."
          className="min-h-[120px]"
        />
      </div>

      <Button
        onClick={handleAssess}
        disabled={!canAssess || loading}
        loading={loading}
        size="lg"
        className="w-full"
      >
        {loading ? 'Assessing Risk...' : 'Assess Security Risk'}
      </Button>
    </div>
  );
}
