'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Todo, FilterType } from '@/types/todo';
import {
  filterTodos,
  getTodoCounts,
  saveTodosToStorage,
  loadTodosFromStorage,
  generateId
} from '@/lib/utils';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>(FilterType.ALL);

  // Load todos from localStorage on initial render
  useEffect(() => {
    const loadedTodos = loadTodosFromStorage();
    setTodos(loadedTodos);
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (todos.length > 0 || loadTodosFromStorage().length > 0) {
      saveTodosToStorage(todos);
    }
  }, [todos]);

  const addTodo = useCallback((text: string) => {
    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      return false;
    }

    const newTodo: Todo = {
      id: generateId(),
      text: trimmedText,
      completed: false,
      createdAt: new Date()
    };

    setTodos(prevTodos => [newTodo, ...prevTodos]);
    return true;
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []);

  const changeFilter = useCallback((newFilter: FilterType) => {
    setFilter(newFilter);
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
  }, []);

  // Computed values
  const filteredTodos = useMemo(() => {
    return filterTodos(todos, filter);
  }, [todos, filter]);

  const todoCounts = useMemo(() => {
    return getTodoCounts(todos);
  }, [todos]);

  const hasCompletedTodos = useMemo(() => {
    return todoCounts.completed > 0;
  }, [todoCounts.completed]);

  return {
    // State
    todos: filteredTodos,
    filter,
    todoCounts,
    hasCompletedTodos,

    // Actions
    addTodo,
    toggleTodo,
    deleteTodo,
    changeFilter,
    clearCompleted
  };
};