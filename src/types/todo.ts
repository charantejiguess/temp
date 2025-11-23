export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export enum FilterType {
  ALL = "all",
  ACTIVE = "active",
  COMPLETED = "completed"
}