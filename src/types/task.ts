export interface Task {
  id: string;
  start: string;
  end: string;
  title: string;
  description: string;
}

export type TaskFormData = Omit<Task, 'id'>;

export type NotificationType = 'success' | 'error' | '';

export interface NotificationState {
  message: string;
  type: NotificationType;
}

export interface SavedReport {
  id: string;
  title: string;
  createdAt: string; // ISO string
  displayDate: string; // YYYY-MM-DD
  displayTime: string; // HH:mm
  tasks: Task[];
  reportText: string;
  taskCount: number;
  periodSummary: string;
  note?: string;
}
