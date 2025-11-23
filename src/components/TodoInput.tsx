'use client';

import { useState, useRef, FormEvent, KeyboardEvent } from 'react';

interface TodoInputProps {
  onAddTodo: (text: string) => boolean;
}

export const TodoInput = ({ onAddTodo }: TodoInputProps) => {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (text.trim().length === 0) return;

    const success = onAddTodo(text);
    if (success) {
      setText('');
      // Focus back to input after submission
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    } else if (e.key === 'Escape') {
      setText('');
      inputRef.current?.blur();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative group">
        <div
          className={`
            absolute inset-0 rounded-2xl transition-all duration-300 ease-in-out
            ${isFocused
              ? 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl'
              : 'bg-gradient-to-r from-zinc-200/20 via-zinc-300/20 to-zinc-400/20 blur-md'
            }
          `}
        />

        <div
          className={`
            relative rounded-2xl p-1 transition-all duration-300 ease-in-out
            backdrop-blur-xl border
            ${isFocused
              ? 'bg-white/20 dark:bg-black/20 border-white/30 dark:border-white/20 shadow-lg shadow-blue-500/10'
              : 'bg-white/10 dark:bg-black/10 border-white/20 dark:border-white/10'
            }
          `}
        >
          <div className="flex items-center gap-3">
            {/* Input Icon */}
            <div className="flex-shrink-0 pl-4">
              <svg
                className={`
                  w-5 h-5 transition-colors duration-200
                  ${isFocused
                    ? 'text-blue-500 dark:text-blue-400'
                    : 'text-zinc-400 dark:text-zinc-600'
                  }
                `}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>

            {/* Text Input */}
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Add a new task..."
              className="
                flex-1 bg-transparent text-zinc-800 dark:text-zinc-200
                placeholder-zinc-400 dark:placeholder-zinc-600
                outline-none py-4 pr-4
                text-base leading-relaxed
              "
              aria-label="Add new task"
              maxLength={200}
            />

            {/* Character Count */}
            {text.length > 0 && (
              <div className="flex-shrink-0 px-4">
                <span
                  className={`
                    text-xs transition-colors duration-200
                    ${text.length >= 200
                      ? 'text-red-500 dark:text-red-400'
                      : text.length > 150
                      ? 'text-amber-500 dark:text-amber-400'
                      : 'text-zinc-400 dark:text-zinc-600'
                    }
                  `}
                >
                  {text.length}/200
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button (visible when text is entered) */}
      {text.trim().length > 0 && (
        <div className="flex justify-end mt-3">
          <button
            type="submit"
            className="
              px-6 py-2.5 rounded-xl text-sm font-medium
              bg-gradient-to-r from-blue-500 to-purple-500
              text-white backdrop-blur-sm
              hover:from-blue-600 hover:to-purple-600
              active:scale-95 transition-all duration-200
              shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30
            "
          >
            Add Task
          </button>
        </div>
      )}

      {/* Helper Text */}
      {text.trim().length === 0 && (
        <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-2 px-2">
          Press Enter to add • Escape to cancel
        </p>
      )}
    </form>
  );
};