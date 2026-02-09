'use client';

import { CopyButton } from './ui';
import { getRiskColor } from '@/lib/types';

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
  const riskColor = getRiskColor(riskLevel);

  const riskBgClass =
    riskLevel === 'LOW'
      ? 'bg-emerald-500/10 border-emerald-500/30'
      : riskLevel === 'MEDIUM'
      ? 'bg-amber-500/10 border-amber-500/30'
      : 'bg-rose-500/10 border-rose-500/30';

  const riskTextClass =
    riskLevel === 'LOW'
      ? 'text-emerald-400'
      : riskLevel === 'MEDIUM'
      ? 'text-amber-400'
      : 'text-rose-400';

  return (
    <div className="space-y-6">
      {/* Risk Score Display */}
      <div className={`p-6 rounded-lg border ${riskBgClass}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-100 font-mono">
            Risk Assessment
          </h3>
          <span className={`text-2xl font-bold font-mono ${riskTextClass}`}>
            {riskLevel}
          </span>
        </div>

        {/* Score Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Low Risk</span>
            <span>High Risk</span>
          </div>
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${riskScore * 10}%`,
                backgroundColor: riskColor,
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <span
                key={n}
                className={`text-xs ${
                  n <= riskScore ? riskTextClass : 'text-slate-600'
                }`}
              >
                {n}
              </span>
            ))}
          </div>
        </div>

        <p className="text-sm text-slate-400">
          Score: <span className={`font-bold ${riskTextClass}`}>{riskScore}</span> / 10
        </p>
      </div>

      {/* Assessment Text */}
      <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
        <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-800">
          <h3 className="font-semibold text-slate-100 font-mono">
            Risk Analysis
          </h3>
        </div>
        <div className="p-4 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
          {assessment}
        </div>
      </div>

      {/* Supervisor Notification */}
      <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-b border-slate-800">
          <h3 className="font-semibold text-slate-100 font-mono flex items-center gap-2">
            <span>📋</span>
            <span>SUPERVISOR NOTIFICATION</span>
          </h3>
          <CopyButton text={supervisorNotification} />
        </div>
        <pre className="p-4 text-sm text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap">
          {supervisorNotification}
        </pre>
      </div>

      {/* Ticket Documentation */}
      <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-b border-slate-800">
          <h3 className="font-semibold text-slate-100 font-mono flex items-center gap-2">
            <span>📋</span>
            <span>TICKET DOCUMENTATION</span>
          </h3>
          <CopyButton text={ticketDocumentation} />
        </div>
        <pre className="p-4 text-sm text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap">
          {ticketDocumentation}
        </pre>
      </div>
    </div>
  );
}
