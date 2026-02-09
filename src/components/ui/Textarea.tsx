'use client';

import { clsx } from 'clsx';
import { TextareaHTMLAttributes, forwardRef, useEffect, useRef, useCallback } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoResize?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoResize = false, onChange, ...props }, ref) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;

    const adjustHeight = useCallback(() => {
      const textarea = textareaRef.current;
      if (textarea && autoResize) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [autoResize, textareaRef]);

    useEffect(() => {
      adjustHeight();
    }, [adjustHeight, props.value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        adjustHeight();
      }
      onChange?.(e);
    };

    return (
      <textarea
        ref={textareaRef}
        className={clsx(
          'w-full px-4 py-3 rounded-lg',
          'bg-slate-900 text-slate-100 border border-slate-700',
          'hover:border-slate-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500',
          'focus:outline-none transition-colors',
          'placeholder:text-slate-500',
          'resize-none font-sans text-base',
          'min-h-[120px]',
          className
        )}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
