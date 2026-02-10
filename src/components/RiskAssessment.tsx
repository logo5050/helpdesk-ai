'use client';

import { useEffect, useState } from 'react';
import { CopyButton } from './ui';

interface RiskAssessmentProps {
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  assessment: string;
  supervisorNotification: string;
  ticketDocumentation: string;
}

export function RiskAssessment({
  riskScore,
  riskLevel,
  assessment,
  supervisorNotification,
  ticketDocumentation,
}: RiskAssessmentProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showContent, setShowContent] = useState(false);

  // Animate score counting up
  useEffect(() => {
    setAnimatedScore(0);
    setShowContent(false);

    const duration = 1000;
    const steps = 20;
    const increment = riskScore / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= riskScore) {
        setAnimatedScore(riskScore);
        clearInterval(timer);
        setTimeout(() => setShowContent(true), 200);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [riskScore]);

  const getRiskStyles = () => {
    switch (riskLevel) {
      case 'LOW':
        return {
          color: '#00E676',
          bgGradient: 'linear-gradient(135deg, rgba(0, 230, 118, 0.15) 0%, rgba(0, 230, 118, 0.05) 100%)',
          border: 'rgba(0, 230, 118, 0.3)',
          glow: '0 0 30px rgba(0, 230, 118, 0.2)',
          barColor: '#00E676',
        };
      case 'MEDIUM':
        return {
          color: '#FFB300',
          bgGradient: 'linear-gradient(135deg, rgba(255, 179, 0, 0.15) 0%, rgba(255, 179, 0, 0.05) 100%)',
          border: 'rgba(255, 179, 0, 0.3)',
          glow: '0 0 30px rgba(255, 179, 0, 0.2)',
          barColor: '#FFB300',
        };
      case 'HIGH':
        return {
          color: '#FF3D57',
          bgGradient: 'linear-gradient(135deg, rgba(255, 61, 87, 0.15) 0%, rgba(255, 61, 87, 0.05) 100%)',
          border: 'rgba(255, 61, 87, 0.3)',
          glow: '0 0 30px rgba(255, 61, 87, 0.3)',
          barColor: '#FF3D57',
        };
    }
  };

  const styles = getRiskStyles();
  const isCritical = riskScore >= 9;

  return (
    <div className="space-y-6">
      {/* Risk Score Hero Card */}
      <div
        className={`rounded-2xl p-8 text-center relative overflow-hidden ${
          isCritical ? 'animate-pulse-glow-critical' : riskLevel === 'HIGH' ? 'animate-pulse-glow' : ''
        }`}
        style={{
          background: styles.bgGradient,
          border: `1px solid ${styles.border}`,
          boxShadow: styles.glow,
        }}
      >
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${styles.color} 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative">
          <div className="mb-2">
            <span
              className="text-sm font-medium uppercase tracking-wider"
              style={{ color: styles.color, opacity: 0.8 }}
            >
              Threat Level
            </span>
          </div>

          {/* Large Score Display */}
          <div
            className="text-7xl font-bold mb-2 animate-count-up"
            style={{
              fontFamily: 'var(--font-mono)',
              color: styles.color,
              textShadow: `0 0 40px ${styles.color}`,
            }}
          >
            {animatedScore}
            <span className="text-3xl opacity-50">/10</span>
          </div>

          {/* Risk Level Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: `${styles.color}20`,
              border: `1px solid ${styles.color}40`,
            }}
          >
            {riskLevel === 'HIGH' && (
              <svg className="w-4 h-4" style={{ color: styles.color }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <span
              className="text-sm font-bold tracking-wider"
              style={{ color: styles.color }}
            >
              {riskLevel} RISK
            </span>
          </div>

          {/* Risk Bar */}
          <div className="max-w-xs mx-auto">
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ background: 'rgba(255, 255, 255, 0.1)' }}
            >
              <div
                className="h-full rounded-full risk-bar-fill"
                style={{
                  width: `${animatedScore * 10}%`,
                  background: `linear-gradient(90deg, ${styles.barColor}80, ${styles.barColor})`,
                  boxShadow: `0 0 10px ${styles.barColor}`,
                }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs" style={{ color: '#555970' }}>
              <span>Low</span>
              <span>Critical</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Card */}
      <div
        className={`rounded-xl overflow-hidden opacity-0 ${showContent ? 'animate-fade-in-up' : ''}`}
        style={{
          background: '#12141C',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          animationDelay: '0ms',
          animationFillMode: 'forwards',
        }}
      >
        <div
          className="px-5 py-4 flex items-center gap-3"
          style={{
            background: 'rgba(28, 31, 42, 0.5)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(0, 200, 255, 0.1)' }}
          >
            <svg className="w-4 h-4" style={{ color: '#00C8FF' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3
            className="font-semibold"
            style={{ color: '#F0F2F5', fontFamily: 'var(--font-mono)' }}
          >
            Threat Analysis
          </h3>
        </div>
        <div
          className="p-5 text-sm leading-relaxed"
          style={{ color: '#8B8FA3' }}
        >
          {assessment}
        </div>
      </div>

      {/* Documentation Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Supervisor Notification */}
        <div
          className={`rounded-xl overflow-hidden opacity-0 ${showContent ? 'animate-fade-in-up' : ''}`}
          style={{
            background: '#12141C',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            animationDelay: '100ms',
            animationFillMode: 'forwards',
          }}
        >
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{
              background: 'rgba(28, 31, 42, 0.5)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(255, 179, 0, 0.1)' }}
              >
                <svg className="w-4 h-4" style={{ color: '#FFB300' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3
                className="font-semibold text-sm"
                style={{ color: '#F0F2F5', fontFamily: 'var(--font-mono)' }}
              >
                Supervisor Alert
              </h3>
            </div>
            <CopyButton text={supervisorNotification} />
          </div>
          <pre
            className="p-5 text-xs leading-relaxed overflow-x-auto"
            style={{
              color: '#8B8FA3',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {supervisorNotification}
          </pre>
        </div>

        {/* Ticket Documentation */}
        <div
          className={`rounded-xl overflow-hidden opacity-0 ${showContent ? 'animate-fade-in-up' : ''}`}
          style={{
            background: '#12141C',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            animationDelay: '200ms',
            animationFillMode: 'forwards',
          }}
        >
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{
              background: 'rgba(28, 31, 42, 0.5)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(0, 200, 255, 0.1)' }}
              >
                <svg className="w-4 h-4" style={{ color: '#00C8FF' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3
                className="font-semibold text-sm"
                style={{ color: '#F0F2F5', fontFamily: 'var(--font-mono)' }}
              >
                Ticket Notes
              </h3>
            </div>
            <CopyButton text={ticketDocumentation} />
          </div>
          <pre
            className="p-5 text-xs leading-relaxed overflow-x-auto"
            style={{
              color: '#8B8FA3',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {ticketDocumentation}
          </pre>
        </div>
      </div>
    </div>
  );
}
