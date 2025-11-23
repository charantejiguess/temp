'use client';

import { useTodos } from '@/hooks/useTodos';
import { TodoInput } from '@/components/TodoInput';
import { TodoFilters } from '@/components/TodoFilters';
import { TodoList } from '@/components/TodoList';
import { Particles } from '@/components/Particles';

export default function Home() {
  const {
    todos,
    filter,
    todoCounts,
    hasCompletedTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    changeFilter,
    clearCompleted
  } = useTodos();

  const handleClearCompleted = () => {
    clearCompleted();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <Particles />

      {/* Main Application Container */}
      <div className="relative z-10 w-full max-w-2xl">
        <div className="rounded-3xl p-8 md:p-10 backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 shadow-2xl">

          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-800 dark:text-zinc-100 mb-3">
              Todo App
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              Organize your tasks with style
            </p>
          </header>

          {/* Task Input */}
          <div className="mb-8">
            <TodoInput onAddTodo={addTodo} />
          </div>

          {/* Filters */}
          <div className="mb-6">
            <TodoFilters
              currentFilter={filter}
              todoCounts={todoCounts}
              onFilterChange={changeFilter}
            />
          </div>

          {/* Task List */}
          <div className="mb-8">
            <TodoList
              todos={todos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          </div>

          {/* Footer with stats and clear button */}
          {todoCounts.total > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/20 dark:border-white/10">
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                <span className="font-medium">{todoCounts.active}</span> active •{' '}
                <span className="font-medium">{todoCounts.completed}</span> completed •{' '}
                <span className="font-medium">{todoCounts.total}</span> total
              </div>

              {hasCompletedTodos && (
                <button
                  onClick={handleClearCompleted}
                  className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Clear Completed
                </button>
              )}
            </div>
          )}

          {/* Empty state enhancement */}
          {todoCounts.total === 0 && (
            <div className="mt-8 text-center">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Start organizing your life, one task at a time
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
