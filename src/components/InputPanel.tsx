'use client';

import { Select, Textarea, Button } from './ui';
import { CATEGORIES, SessionHistoryItem } from '@/lib/types';

interface InputPanelProps {
  category: string;
  description: string;
  loading: boolean;
  history: SessionHistoryItem[];
  onCategoryChange: (category: string) => void;
  onDescriptionChange: (description: string) => void;
  onAnalyze: () => void;
  onHistoryItemClick: (item: SessionHistoryItem) => void;
}

export function InputPanel({
  category,
  description,
  loading,
  history,
  onCategoryChange,
  onDescriptionChange,
  onAnalyze,
  onHistoryItemClick,
}: InputPanelProps) {
  const canAnalyze = category && description.trim().length > 0 && !loading;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Issue Category
          </label>
          <Select
            options={CATEGORIES}
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            placeholder="Select a category..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Issue Description
          </label>
          <Textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Describe the user's issue in detail. Include error messages, what they've already tried, and any relevant context..."
            className="min-h-[200px]"
            autoResize
          />
        </div>

        <Button
          onClick={onAnalyze}
          disabled={!canAnalyze}
          loading={loading}
          size="lg"
          className="w-full"
        >
          {loading ? 'Analyzing...' : 'Analyze Issue'}
        </Button>
      </div>

      {history.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-800">
          <h3 className="text-sm font-medium text-slate-400 mb-3">
            Session History
          </h3>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => onHistoryItemClick(item)}
                className="w-full text-left p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="text-xs text-sky-400 font-medium truncate">
                  {item.category}
                </div>
                <div className="text-sm text-slate-300 truncate mt-1">
                  {item.description}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {item.timestamp.toLocaleTimeString()}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
