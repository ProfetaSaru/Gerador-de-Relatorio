import { useState, useCallback } from 'react';
import { Task, TaskFormData } from '../types/task';

const INITIAL_FORM_DATA: TaskFormData = {
  start: '',
  end: '',
  title: '',
  description: '',
};

export function useTaskForm() {
  const [formData, setFormData] = useState<TaskFormData>(INITIAL_FORM_DATA);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const setFieldValue = useCallback((field: keyof TaskFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const startEditing = useCallback((task: Task) => {
    setEditingTaskId(task.id);
    setFormData({
      start: task.start,
      end: task.end,
      title: task.title,
      description: task.description,
    });
  }, []);

  const resetForm = useCallback(() => {
    setEditingTaskId(null);
    setFormData(INITIAL_FORM_DATA);
  }, []);

  const validate = useCallback((): { valid: boolean; error?: string } => {
    if (!formData.start || !formData.end || !formData.title.trim()) {
      return { valid: false, error: 'Preencha os campos obrigatórios.' };
    }

    if (formData.end < formData.start) {
      return { valid: false, error: 'A hora final não pode ser anterior à hora inicial.' };
    }

    return { valid: true };
  }, [formData]);

  return {
    formData,
    editingTaskId,
    isEditing: editingTaskId !== null,
    setFieldValue,
    startEditing,
    resetForm,
    validate,
  };
}
