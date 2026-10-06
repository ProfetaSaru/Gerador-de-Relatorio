import { useState, useCallback } from 'react';
import { Task, TaskFormData } from '../types/task';
import { loadStoredTasks, saveStoredTasks } from '../utils/storage';

function sortTaskList(items: Task[]): Task[] {
  return [...items].sort((a, b) => a.start.localeCompare(b.start));
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const initial = loadStoredTasks();
    return sortTaskList(initial);
  });

  const addTask = useCallback((formData: TaskFormData): Task => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      ...formData,
    };

    setTasks((prev) => {
      const updated = sortTaskList([...prev, newTask]);
      saveStoredTasks(updated);
      return updated;
    });

    return newTask;
  }, []);

  const updateTask = useCallback((id: string, formData: TaskFormData): boolean => {
    let wasUpdated = false;

    setTasks((prev) => {
      const taskIndex = prev.findIndex((t) => t.id === id);
      if (taskIndex === -1) {
        return prev;
      }

      wasUpdated = true;
      const updatedList = [...prev];
      updatedList[taskIndex] = { id, ...formData };
      const sorted = sortTaskList(updatedList);
      saveStoredTasks(sorted);
      return sorted;
    });

    return wasUpdated;
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveStoredTasks(updated);
      return updated;
    });
  }, []);

  const clearAllTasks = useCallback(() => {
    setTasks([]);
    saveStoredTasks([]);
  }, []);

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    clearAllTasks,
  };
}
