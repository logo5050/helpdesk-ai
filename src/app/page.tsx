'use client';

import { useState, useCallback } from 'react';
import { CyberSecurityForm, RiskAssessment } from '@/components';
import type { SecurityAssessResponse } from '@/lib/types';

export default function HomePage() {
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
    <div
      className="min-h-[calc(100vh-4rem)] py-8 px-6"
      style={{
        background: 'linear-gradient(180deg, #0A0B10 0%, #0D0E14 100%)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-[minmax(400px,1fr)_minmax(500px,1.2fr)]">
          {/* Left Column - Form */}
          <div
            className="rounded-2xl p-6 animate-fade-in-up"
            style={{
              background: 'rgba(18, 20, 28, 0.6)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
          >
            <CyberSecurityForm loading={loading} onAssess={handleAssess} />
          </div>

          {/* Right Column - Results */}
          <div
            className="rounded-2xl p-6 animate-fade-in-up"
            style={{
              background: 'rgba(18, 20, 28, 0.6)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              animationDelay: '100ms',
              animationFillMode: 'backwards',
            }}
          >
            {error ? (
              <div className="h-full flex items-center justify-center min-h-[500px]">
                <div className="text-center max-w-md animate-fade-in">
                  <div
                    className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 61, 87, 0.15) 0%, rgba(255, 61, 87, 0.05) 100%)',
                      border: '1px solid rgba(255, 61, 87, 0.2)',
                      boxShadow: '0 0 30px rgba(255, 61, 87, 0.2)',
                    }}
                  >
                    <svg
                      className="w-10 h-10"
                      style={{ color: '#FF3D57' }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <h3
                    className="text-xl font-semibold mb-3"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: '#F0F2F5',
                    }}
                  >
                    Error Occurred
                  </h3>
                  <p
                    className="text-sm mb-6"
                    style={{ color: '#FF3D57' }}
                  >
                    {error}
                  </p>
                  <button
                    onClick={() => setError(null)}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                    style={{
                      background: 'rgba(255, 61, 87, 0.1)',
                      border: '1px solid rgba(255, 61, 87, 0.3)',
                      color: '#FF3D57',
                    }}
                  >
                    Dismiss
                  </button>
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
              <div className="h-full flex items-center justify-center min-h-[500px]">
                <div className="text-center animate-fade-in">
                  {/* Animated scanning effect */}
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: 'linear-gradient(135deg, rgba(0, 200, 255, 0.1) 0%, rgba(0, 200, 255, 0.05) 100%)',
                        border: '1px solid rgba(0, 200, 255, 0.2)',
                      }}
                    />
                    <div
                      className="absolute inset-2 rounded-xl overflow-hidden"
                      style={{
                        background: 'rgba(0, 200, 255, 0.05)',
                      }}
                    >
                      {/* Scanning line */}
                      <div
                        className="absolute left-0 right-0 h-1"
                        style={{
                          background: 'linear-gradient(90deg, transparent, #00C8FF, transparent)',
                          animation: 'scan 1.5s ease-in-out infinite',
                          boxShadow: '0 0 20px rgba(0, 200, 255, 0.5)',
                        }}
                      />
                    </div>
                    <svg
                      className="absolute inset-0 w-full h-full p-5"
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
                  <p
                    className="text-sm font-medium"
                    style={{
                      color: '#00C8FF',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    Analyzing Threat Indicators...
                  </p>
                  <p
                    className="text-xs mt-2"
                    style={{ color: '#555970' }}
                  >
                    Processing security flags
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center min-h-[500px]">
                <div className="text-center max-w-sm animate-fade-in">
                  <div
                    className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(85, 89, 112, 0.2) 0%, rgba(85, 89, 112, 0.1) 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <svg
                      className="w-10 h-10"
                      style={{ color: '#555970' }}
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
                  <h3
                    className="text-lg font-semibold mb-3"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: '#8B8FA3',
                    }}
                  >
                    Awaiting Assessment
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: '#555970' }}
                  >
                    Select security concern indicators from the form and click &quot;Analyze Threat&quot; to generate a comprehensive risk assessment.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add scanning animation keyframe */}
      <style jsx>{`
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: calc(100% - 4px); }
        }
      `}</style>
    </div>
  );
}
