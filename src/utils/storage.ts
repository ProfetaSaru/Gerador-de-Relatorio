import { Task } from '../types/task';

export const STORAGE_KEY = 'relatorio-atividades';

export function loadStoredTasks(): Task[] {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      return [];
    }

    const parsed = JSON.parse(rawData);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

export function saveStoredTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Falha ao salvar tarefas no localStorage:', error);
  }
}
