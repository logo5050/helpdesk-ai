'use client';

import { useState, useCallback } from 'react';
import { CopyButton } from '@/components/ui';
import type { SecurityAssessResponse } from '@/lib/types';

// Clean up any residual markdown symbols from AI response
function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove **bold**
    .replace(/\*(.*?)\*/g, '$1')       // Remove *italic*
    .replace(/^#{1,6}\s+/gm, '')       // Remove ## headings
    .replace(/^---+$/gm, '')           // Remove horizontal rules
    .replace(/`([^`]+)`/g, '$1')       // Remove inline code
    .replace(/\n{3,}/g, '\n\n')        // Collapse multiple newlines
    .trim();
}

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<SecurityAssessResponse | null>(null);
  const [description, setDescription] = useState('');

  const handleAssess = useCallback(async () => {
    if (!description.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/security-assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: description.trim() }),
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
  }, [description]);

  const handleReset = () => {
    setAssessment(null);
    setError(null);
    setDescription('');
  };

  const canSubmit = description.trim().length > 0 && !loading;

  return (
    <div
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-8 px-6"
      style={{
        background: 'linear-gradient(180deg, #0A0B10 0%, #0D0E14 100%)',
      }}
    >
      {/* Single Card Container */}
      <div
        className="w-full max-w-[680px] relative"
        style={{ minHeight: '500px' }}
      >
        {/* The Card */}
        <div
          className={`
            rounded-2xl p-8 transition-all duration-700 ease-out
            ${assessment && assessment.riskLevel === 'HIGH' ? 'animate-pulse-glow' : ''}
            ${assessment && assessment.riskScore >= 9 ? 'animate-pulse-glow-critical' : ''}
          `}
          style={{
            background: 'rgba(18, 20, 28, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: assessment
              ? `1px solid ${
                  assessment.riskLevel === 'HIGH'
                    ? 'rgba(255, 61, 87, 0.4)'
                    : assessment.riskLevel === 'MEDIUM'
                    ? 'rgba(255, 179, 0, 0.3)'
                    : 'rgba(0, 230, 118, 0.3)'
                }`
              : '1px solid rgba(255, 255, 255, 0.06)',
            boxShadow: assessment
              ? assessment.riskLevel === 'HIGH'
                ? '0 0 60px rgba(255, 61, 87, 0.2), 0 8px 32px rgba(0, 0, 0, 0.4)'
                : assessment.riskLevel === 'MEDIUM'
                ? '0 0 40px rgba(255, 179, 0, 0.15), 0 8px 32px rgba(0, 0, 0, 0.4)'
                : '0 0 40px rgba(0, 230, 118, 0.15), 0 8px 32px rgba(0, 0, 0, 0.4)'
              : '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Content transitions between states */}
          <div className="relative">
            {/* STATE 1: Input State */}
            <div
              className={`transition-all duration-500 ${
                assessment || loading ? 'opacity-0 absolute inset-0 pointer-events-none scale-95' : 'opacity-100'
              }`}
            >
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
                <p style={{ color: '#555970', fontSize: '0.9rem' }}>
                  Describe the caller interaction in your own words
                </p>
              </div>

              {/* Textarea */}
              <div className="mb-8">
                <label
                  className="block text-sm font-medium mb-3"
                  style={{ color: '#8B8FA3' }}
                >
                  What happened on the call?
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="The caller said they were a manager needing urgent access to an employee's account but couldn't provide their own employee ID and got aggressive when I asked security questions..."
                  className="w-full px-5 py-4 rounded-xl text-sm transition-all duration-200 input-glow resize-none"
                  style={{
                    background: '#1C1F2A',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#F0F2F5',
                    outline: 'none',
                    minHeight: '180px',
                    maxHeight: '300px',
                    lineHeight: '1.6',
                  }}
                />
              </div>

              {/* Error display */}
              {error && (
                <div
                  className="mb-6 p-4 rounded-xl text-sm animate-fade-in"
                  style={{
                    background: 'rgba(255, 61, 87, 0.1)',
                    border: '1px solid rgba(255, 61, 87, 0.2)',
                    color: '#FF3D57',
                  }}
                >
                  {error}
                </div>
              )}

              {/* Prominent Pill Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleAssess}
                  disabled={!canSubmit}
                  className="analyze-button"
                  style={{
                    minWidth: '220px',
                    padding: '16px 32px',
                    borderRadius: '9999px',
                    background: canSubmit
                      ? 'linear-gradient(135deg, #00C8FF 0%, #0099CC 100%)'
                      : 'linear-gradient(135deg, #3A3F52 0%, #2A2E3D 100%)',
                    boxShadow: canSubmit
                      ? '0 0 30px rgba(0, 200, 255, 0.4), 0 0 60px rgba(0, 200, 255, 0.2), 0 4px 20px rgba(0, 0, 0, 0.3)'
                      : 'none',
                    border: 'none',
                    cursor: canSubmit ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: canSubmit ? '#FFFFFF' : '#555970',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                  }}
                  onMouseEnter={(e) => {
                    if (canSubmit) {
                      e.currentTarget.style.transform = 'scale(1.03)';
                      e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 200, 255, 0.5), 0 0 80px rgba(0, 200, 255, 0.3), 0 6px 24px rgba(0, 0, 0, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    if (canSubmit) {
                      e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 200, 255, 0.4), 0 0 60px rgba(0, 200, 255, 0.2), 0 4px 20px rgba(0, 0, 0, 0.3)';
                    }
                  }}
                  onMouseDown={(e) => {
                    if (canSubmit) {
                      e.currentTarget.style.transform = 'scale(0.97)';
                    }
                  }}
                  onMouseUp={(e) => {
                    if (canSubmit) {
                      e.currentTarget.style.transform = 'scale(1.03)';
                    }
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span>Analyze Threat</span>
                </button>
              </div>
            </div>

            {/* Loading State */}
            <div
              className={`transition-all duration-500 ${
                loading ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'
              }`}
            >
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative w-24 h-24 mb-6">
                  <div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0, 200, 255, 0.1) 0%, rgba(0, 200, 255, 0.05) 100%)',
                      border: '1px solid rgba(0, 200, 255, 0.2)',
                    }}
                  />
                  <div
                    className="absolute inset-2 rounded-xl overflow-hidden"
                    style={{ background: 'rgba(0, 200, 255, 0.05)' }}
                  >
                    <div
                      className="absolute left-0 right-0 h-1 scanning-line"
                      style={{
                        background: 'linear-gradient(90deg, transparent, #00C8FF, transparent)',
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
                  style={{ color: '#00C8FF', fontFamily: 'var(--font-mono)' }}
                >
                  Analyzing Threat Indicators...
                </p>
                <p className="text-xs mt-2" style={{ color: '#555970' }}>
                  Processing interaction details
                </p>
              </div>
            </div>

            {/* STATE 2: Result State */}
            <div
              className={`transition-all duration-500 ${
                assessment && !loading ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none scale-105'
              }`}
            >
              {assessment && (
                <ResultDisplay
                  assessment={assessment}
                  onReset={handleReset}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scanning animation */}
      <style jsx>{`
        .scanning-line {
          animation: scan 1.5s ease-in-out infinite;
        }
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: calc(100% - 4px); }
        }
      `}</style>
    </div>
  );
}

// Result display component (inside the same card)
function ResultDisplay({
  assessment,
  onReset
}: {
  assessment: SecurityAssessResponse;
  onReset: () => void;
}) {
  const getRiskStyles = () => {
    switch (assessment.riskLevel) {
      case 'LOW':
        return {
          color: '#00E676',
          bgGradient: 'linear-gradient(135deg, rgba(0, 230, 118, 0.15) 0%, rgba(0, 230, 118, 0.05) 100%)',
        };
      case 'MEDIUM':
        return {
          color: '#FFB300',
          bgGradient: 'linear-gradient(135deg, rgba(255, 179, 0, 0.15) 0%, rgba(255, 179, 0, 0.05) 100%)',
        };
      case 'HIGH':
        return {
          color: '#FF3D57',
          bgGradient: 'linear-gradient(135deg, rgba(255, 61, 87, 0.15) 0%, rgba(255, 61, 87, 0.05) 100%)',
        };
    }
  };

  const styles = getRiskStyles();

  // Clean the assessment text of any markdown artifacts
  const cleanedAssessment = cleanMarkdown(assessment.assessment);

  return (
    <div className="animate-fade-in">
      {/* Threat Level Header */}
      <div className="text-center mb-6">
        <span
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: styles.color, opacity: 0.8 }}
        >
          Threat Level
        </span>

        {/* Large Score */}
        <div
          className="text-7xl font-bold my-2"
          style={{
            fontFamily: 'var(--font-mono)',
            color: styles.color,
            textShadow: `0 0 40px ${styles.color}`,
          }}
        >
          {assessment.riskScore}
          <span className="text-3xl opacity-50">/10</span>
        </div>

        {/* Risk Level Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            background: `${styles.color}20`,
            border: `1px solid ${styles.color}40`,
          }}
        >
          {assessment.riskLevel === 'HIGH' && (
            <svg className="w-4 h-4" style={{ color: styles.color }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          <span className="text-sm font-bold tracking-wider" style={{ color: styles.color }}>
            {assessment.riskLevel} RISK
          </span>
        </div>

        {/* Risk Bar */}
        <div className="max-w-xs mx-auto mt-4">
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: 'rgba(255, 255, 255, 0.1)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${assessment.riskScore * 10}%`,
                background: `linear-gradient(90deg, ${styles.color}80, ${styles.color})`,
                boxShadow: `0 0 10px ${styles.color}`,
              }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs" style={{ color: '#555970' }}>
            <span>Low</span>
            <span>Critical</span>
          </div>
        </div>
      </div>

      {/* Assessment Text */}
      <div
        className="p-4 rounded-xl mb-4"
        style={{
          background: 'rgba(28, 31, 42, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <p className="text-sm leading-relaxed" style={{ color: '#C8CAD0' }}>
          {cleanedAssessment}
        </p>
      </div>

      {/* Copy Buttons */}
      <div className="space-y-2 mb-6">
        <div
          className="flex items-center justify-between p-3 rounded-lg"
          style={{ background: 'rgba(28, 31, 42, 0.3)' }}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" style={{ color: '#FFB300' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="text-sm" style={{ color: '#8B8FA3', fontFamily: 'var(--font-mono)' }}>
              Supervisor Alert
            </span>
          </div>
          <CopyButton text={assessment.supervisorNotification} />
        </div>

        <div
          className="flex items-center justify-between p-3 rounded-lg"
          style={{ background: 'rgba(28, 31, 42, 0.3)' }}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" style={{ color: '#00C8FF' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm" style={{ color: '#8B8FA3', fontFamily: 'var(--font-mono)' }}>
              Ticket Notes
            </span>
          </div>
          <CopyButton text={assessment.ticketDocumentation} />
        </div>
      </div>

      {/* Reset Link */}
      <button
        onClick={onReset}
        className="w-full text-center py-3 text-sm transition-colors duration-200"
        style={{ color: '#555970' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#8B8FA3')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#555970')}
      >
        <span className="inline-flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          New Assessment
        </span>
      </button>
    </div>
  );
}
