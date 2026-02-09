'use client';

import { useState, useCallback } from 'react';
import { InputPanel, ResponsePanel } from '@/components';
import type { SessionHistoryItem } from '@/lib/types';

export default function TroubleshootingPage() {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<SessionHistoryItem[]>([]);

  const handleAnalyze = useCallback(async () => {
    if (!category || !description.trim()) return;

    setLoading(true);
    setResponse('');
    setError(null);

    try {
      const res = await fetch('/api/troubleshoot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, description }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to analyze issue');
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;
        setResponse(fullResponse);
      }

      // Add to history
      const historyItem: SessionHistoryItem = {
        id: Date.now().toString(),
        category,
        description,
        timestamp: new Date(),
        response: fullResponse,
      };
      setHistory((prev) => [historyItem, ...prev].slice(0, 10));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setResponse('');
    } finally {
      setLoading(false);
    }
  }, [category, description]);

  const handleHistoryItemClick = useCallback((item: SessionHistoryItem) => {
    setCategory(item.category);
    setDescription(item.description);
    if (item.response) {
      setResponse(item.response);
    }
  }, []);

  return (
    <div className="h-[calc(100vh-4rem)] p-6">
      <div className="h-full max-w-7xl mx-auto flex gap-6">
        {/* Left Panel - Input (35%) */}
        <div className="w-[35%] min-w-[320px] bg-slate-900/50 rounded-xl border border-slate-800 p-6 overflow-y-auto">
          <InputPanel
            category={category}
            description={description}
            loading={loading}
            history={history}
            onCategoryChange={setCategory}
            onDescriptionChange={setDescription}
            onAnalyze={handleAnalyze}
            onHistoryItemClick={handleHistoryItemClick}
          />
        </div>

        {/* Right Panel - Response (65%) */}
        <div className="flex-1 min-w-[480px] bg-slate-900/50 rounded-xl border border-slate-800 p-6 overflow-hidden">
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
                <p className="text-sm text-rose-400 mb-4">{error}</p>
                <button
                  onClick={handleAnalyze}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg text-sm transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <ResponsePanel response={response} loading={loading} />
          )}
        </div>
      </div>
    </div>
  );
}
