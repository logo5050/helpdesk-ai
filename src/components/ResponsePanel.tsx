'use client';

import { useMemo } from 'react';
import { CopyButton } from './ui';

interface ResponsePanelProps {
  response: string;
  loading: boolean;
}

interface Section {
  title: string;
  icon: string;
  content: string;
}

function parseResponse(response: string): Section[] {
  const sections: Section[] = [];

  const sectionPatterns = [
    { icon: '🔍', title: 'REASON FOR THE CALL', pattern: /##\s*🔍\s*REASON FOR THE CALL\s*\n([\s\S]*?)(?=##\s*[🛠📋⚠]|$)/i },
    { icon: '🛠️', title: 'TROUBLESHOOTING STEPS', pattern: /##\s*🛠️?\s*TROUBLESHOOTING STEPS\s*\n([\s\S]*?)(?=##\s*[📋⚠]|$)/i },
    { icon: '📋', title: 'TICKET NOTES', pattern: /##\s*📋\s*TICKET NOTES\s*\n([\s\S]*?)(?=##\s*[⚠]|$)/i },
    { icon: '⚠️', title: 'ESCALATION CRITERIA', pattern: /##\s*⚠️?\s*ESCALATION CRITERIA\s*\n([\s\S]*?)$/i },
  ];

  for (const { icon, title, pattern } of sectionPatterns) {
    const match = response.match(pattern);
    if (match) {
      sections.push({
        icon,
        title,
        content: match[1].trim(),
      });
    }
  }

  return sections;
}

function renderContent(content: string) {
  // Check if content contains a code block
  const codeBlockMatch = content.match(/```([\s\S]*?)```/);
  if (codeBlockMatch) {
    const beforeCode = content.substring(0, codeBlockMatch.index);
    const code = codeBlockMatch[1].trim();
    const afterCode = content.substring((codeBlockMatch.index || 0) + codeBlockMatch[0].length);

    return (
      <>
        {beforeCode && <div className="whitespace-pre-wrap">{beforeCode.trim()}</div>}
        <pre className="mt-3 p-4 bg-slate-950 rounded-lg overflow-x-auto text-sm font-mono text-slate-300 border border-slate-800">
          {code}
        </pre>
        {afterCode && <div className="mt-3 whitespace-pre-wrap">{afterCode.trim()}</div>}
      </>
    );
  }

  // Render numbered lists
  const lines = content.split('\n');
  const hasNumberedList = lines.some((line) => /^\d+\.\s/.test(line.trim()));

  if (hasNumberedList) {
    return (
      <div className="space-y-2">
        {lines.map((line, i) => {
          const trimmedLine = line.trim();
          if (!trimmedLine) return null;

          const numberedMatch = trimmedLine.match(/^(\d+)\.\s(.*)$/);
          if (numberedMatch) {
            return (
              <div key={i} className="flex gap-3">
                <span className="text-sky-400 font-mono font-bold min-w-[1.5rem]">
                  {numberedMatch[1]}.
                </span>
                <span>{numberedMatch[2]}</span>
              </div>
            );
          }

          // Bullet points
          if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
            return (
              <div key={i} className="flex gap-3 ml-6">
                <span className="text-slate-500">•</span>
                <span>{trimmedLine.substring(2)}</span>
              </div>
            );
          }

          return <div key={i}>{trimmedLine}</div>;
        })}
      </div>
    );
  }

  // Render bullet lists
  const hasBulletList = lines.some((line) => /^[-*]\s/.test(line.trim()));

  if (hasBulletList) {
    return (
      <ul className="space-y-1.5">
        {lines.map((line, i) => {
          const trimmedLine = line.trim();
          if (!trimmedLine) return null;

          if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
            return (
              <li key={i} className="flex gap-2">
                <span className="text-sky-400">•</span>
                <span>{trimmedLine.substring(2)}</span>
              </li>
            );
          }

          return <div key={i}>{trimmedLine}</div>;
        })}
      </ul>
    );
  }

  return <div className="whitespace-pre-wrap">{content}</div>;
}

export function ResponsePanel({ response, loading }: ResponsePanelProps) {
  const sections = useMemo(() => parseResponse(response), [response]);

  if (!response && !loading) {
    return (
      <div className="h-full flex items-center justify-center">
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
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-300 mb-2">
            Ready to Assist
          </h3>
          <p className="text-sm text-slate-500">
            Select a category and describe the issue to receive AI-powered troubleshooting guidance.
          </p>
        </div>
      </div>
    );
  }

  if (loading && !response) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400">Analyzing issue...</p>
        </div>
      </div>
    );
  }

  // If we have sections, render them nicely
  if (sections.length > 0) {
    return (
      <div className="space-y-6 h-full overflow-y-auto pr-2">
        {sections.map((section, index) => (
          <div
            key={index}
            className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-b border-slate-800">
              <h3 className="font-semibold text-slate-100 font-mono flex items-center gap-2">
                <span>{section.icon}</span>
                <span>{section.title}</span>
              </h3>
              <CopyButton text={section.content} />
            </div>
            <div className="p-4 text-slate-300 text-sm leading-relaxed">
              {renderContent(section.content)}
            </div>
          </div>
        ))}
        {loading && (
          <span className="inline-block w-2 h-4 bg-sky-400 cursor-blink ml-1" />
        )}
      </div>
    );
  }

  // Fallback: render raw response with streaming cursor
  return (
    <div className="h-full overflow-y-auto pr-2">
      <div className="bg-slate-900 rounded-lg border border-slate-800 p-4">
        <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
          {response}
          {loading && (
            <span className="inline-block w-2 h-4 bg-sky-400 cursor-blink ml-1" />
          )}
        </div>
      </div>
    </div>
  );
}
