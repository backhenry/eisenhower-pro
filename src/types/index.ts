export type QuadrantId = 'q1' | 'q2' | 'q3' | 'q4';

export interface Task {
  id: string;
  title: string;
  isUrgent: boolean;
  isImportant: boolean;
  isCompleted: boolean;
  quadrantId: QuadrantId;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}
