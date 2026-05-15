export type QuadrantId = 'q1' | 'q2' | 'q3' | 'q4';

export interface Subtask {
  id?: string;
  title: string;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  isUrgent: boolean;
  isImportant: boolean;
  isCompleted: boolean;
  quadrantId: QuadrantId;
  dueDate?: string | null;
  timeSpent?: number;
  subtasks?: Subtask[];
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}
