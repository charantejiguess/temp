'use client';

import { FilterType, FilterTypeValues } from '@/types/todo';

interface TodoFiltersProps {
  currentFilter: FilterType;
  todoCounts: {
    active: number;
    completed: number;
    total: number;
  };
  onFilterChange: (filter: FilterType) => void;
}

const filterConfig: Array<{
  type: FilterType;
  label: string;
  icon: React.ReactNode;
  ariaLabel: string;
}> = [
  {
    type: FilterType.ALL,
    label: 'All',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
    ariaLabel: 'Show all tasks'
  },
  {
    type: FilterType.ACTIVE,
    label: 'Active',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
    ariaLabel: 'Show active tasks'
  },
  {
    type: FilterType.COMPLETED,
    label: 'Completed',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    ariaLabel: 'Show completed tasks'
  }
];

export const TodoFilters = ({ currentFilter, todoCounts, onFilterChange }: TodoFiltersProps) => {
  const getCount = (type: FilterType): number => {
    switch (type) {
      case FilterType.ALL:
        return todoCounts.total;
      case FilterType.ACTIVE:
        return todoCounts.active;
      case FilterType.COMPLETED:
        return todoCounts.completed;
      default:
        return 0;
    }
  };

  return (
    <div className="rounded-2xl p-1 backdrop-blur-md bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10">
      <div className="flex items-center gap-2">
        {filterConfig.map((filter) => {
          const count = getCount(filter.type);
          const isActive = currentFilter === filter.type;
          const showCount = count > 0;

          return (
            <button
              key={filter.type}
              onClick={() => onFilterChange(filter.type)}
              aria-label={filter.ariaLabel}
              className={`
                relative flex items-center gap-2 px-4 py-2.5 rounded-xl
                font-medium text-sm transition-all duration-200 ease-in-out
                ${isActive
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-600 dark:text-blue-400 border border-blue-200/30 dark:border-blue-400/20 shadow-md shadow-blue-500/10'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-white/10 dark:hover:bg-black/10'
                }
                active:scale-95
              `}
            >
              {/* Icon */}
              <span className={isActive ? 'text-blue-600 dark:text-blue-400' : ''}>
                {filter.icon}
              </span>

              {/* Label */}
              <span className="select-none">{filter.label}</span>

              {/* Count Badge */}
              {showCount && (
                <span
                  className={`
                    flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold
                    transition-all duration-200
                    ${isActive
                      ? 'bg-blue-500 text-white'
                      : 'bg-zinc-200/50 dark:bg-zinc-700/50 text-zinc-600 dark:text-zinc-400'
                    }
                  `}
                >
                  {count}
                </span>
              )}

              {/* Active Indicator */}
              {isActive && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};