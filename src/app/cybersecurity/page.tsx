'use client';

import { useState, useCallback } from 'react';
import { CyberSecurityForm, RiskAssessment } from '@/components';
import type { SecurityAssessResponse } from '@/lib/types';

export default function CybersecurityPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<SecurityAssessResponse | null>(null);

  const handleAssess = useCallback(async (flags: string[], additionalContext: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/security-assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flags, additionalContext }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to assess security risk');
      }

      const data = await res.json();
      setAssessment(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setAssessment(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-100 font-mono mb-2">
            Cybersecurity Risk Assessment
          </h1>
          <p className="text-slate-400">
            Identify and document potential social engineering or security threats during support calls.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Form */}
          <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
            <CyberSecurityForm loading={loading} onAssess={handleAssess} />
          </div>

          {/* Right Column - Results */}
          <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
            {error ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/10 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-rose-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-slate-100 mb-2">
                    Error
                  </h3>
                  <p className="text-sm text-rose-400">{error}</p>
                </div>
              </div>
            ) : assessment ? (
              <RiskAssessment
                riskScore={assessment.riskScore}
                riskLevel={assessment.riskLevel}
                assessment={assessment.assessment}
                supervisorNotification={assessment.supervisorNotification}
                ticketDocumentation={assessment.ticketDocumentation}
              />
            ) : loading ? (
              <div className="h-full flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-slate-400">Assessing risk...</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center min-h-[400px]">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-slate-500"
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
                  <h3 className="text-lg font-medium text-slate-300 mb-2">
                    Security Assessment
                  </h3>
                  <p className="text-sm text-slate-500">
                    Select security concern indicators and click &quot;Assess Security Risk&quot; to generate a risk assessment.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
