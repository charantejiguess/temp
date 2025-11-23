'use client';

import { useState, useEffect } from 'react';
import { Todo } from '@/types/todo';
import { truncateText } from '@/lib/utils';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && isHovered) {
        setIsDeleting(true);
        setTimeout(() => onDelete(todo.id), 200);
      }
    };

    if (isHovered) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isHovered, onDelete, todo.id]);

  const handleToggle = () => {
    onToggle(todo.id);
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => onDelete(todo.id), 200);
  };

  return (
    <div
      className={`
        relative group rounded-2xl p-4 transition-all duration-300 ease-in-out
        backdrop-blur-md border border-white/20 dark:border-white/10
        bg-white/15 dark:bg-black/15
        hover:bg-white/25 dark:hover:bg-black/25
        hover:border-white/30 dark:hover:border-white/20
        hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10
        ${isDeleting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
        ${todo.completed ? 'opacity-75' : 'opacity-100'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-4">
        {/* Custom Checkbox */}
        <div className="relative flex-shrink-0 mt-1">
          <input
            type="checkbox"
            id={`todo-${todo.id}`}
            checked={todo.completed}
            onChange={handleToggle}
            className="sr-only"
            aria-label={`Mark task as ${todo.completed ? 'incomplete' : 'complete'}`}
          />
          <label
            htmlFor={`todo-${todo.id}`}
            className={`
              flex items-center justify-center w-6 h-6 rounded-lg border-2 cursor-pointer
              transition-all duration-200 ease-in-out
              ${todo.completed
                ? 'bg-emerald-500/80 border-emerald-500/80 shadow-lg shadow-emerald-500/20'
                : 'bg-white/20 dark:bg-black/20 border-white/40 dark:border-white/30 hover:bg-white/30 dark:hover:bg-black/30'
              }
            `}
          >
            {todo.completed && (
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </label>
        </div>

        {/* Task Text */}
        <div className="flex-1 min-w-0">
          <p
            className={`
              text-base leading-relaxed transition-all duration-200
              ${todo.completed
                ? 'line-through text-zinc-500 dark:text-zinc-500'
                : 'text-zinc-800 dark:text-zinc-200'
              }
            `}
          >
            {truncateText(todo.text, 100)}
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
            {todo.createdAt.toLocaleDateString()} • {todo.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className={`
            flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg
            transition-all duration-200 ease-in-out
            ${isHovered
              ? 'opacity-100 bg-red-500/10 text-red-500 hover:bg-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20'
              : 'opacity-0 bg-transparent text-transparent'
            }
          `}
          aria-label="Delete task"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {/* Hover Effect Overlay */}
      {isHovered && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none" />
      )}
    </div>
  );
};