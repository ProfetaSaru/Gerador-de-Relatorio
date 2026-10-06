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
