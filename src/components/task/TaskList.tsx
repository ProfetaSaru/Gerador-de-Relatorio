import React from 'react';
import { Task } from '../../types/task';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string, title: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete }) => {
  if (tasks.length === 0) {
    return <p className="empty-state">Nenhuma tarefa registrada ainda.</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
