import { Todo, FilterType } from '@/types/todo';

export const filterTodos = (todos: Todo[], filterType: FilterType): Todo[] => {
  switch (filterType) {
    case FilterType.ACTIVE:
      return todos.filter(todo => !todo.completed);
    case FilterType.COMPLETED:
      return todos.filter(todo => todo.completed);
    case FilterType.ALL:
    default:
      return todos;
  }
};

export const getTodoCounts = (todos: Todo[]) => {
  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return {
    active: activeCount,
    completed: completedCount,
    total: totalCount
  };
};

export const saveTodosToStorage = (todos: Todo[]): void => {
  try {
    const todosToSave = todos.map(todo => ({
      ...todo,
      createdAt: todo.createdAt.toISOString()
    }));
    localStorage.setItem('todos', JSON.stringify(todosToSave));
    localStorage.setItem('lastSaved', new Date().toISOString());
  } catch (error) {
    console.error('Failed to save todos to localStorage:', error);
  }
};

export const loadTodosFromStorage = (): Todo[] => {
  try {
    const savedTodos = localStorage.getItem('todos');
    if (!savedTodos) return [];

    const parsedTodos = JSON.parse(savedTodos);
    return parsedTodos.map((todo: Todo & { createdAt: string }) => ({
      ...todo,
      createdAt: new Date(todo.createdAt)
    }));
  } catch (error) {
    console.error('Failed to load todos from localStorage:', error);
    return [];
  }
};

export const generateId = (): string => {
  return crypto.randomUUID();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};