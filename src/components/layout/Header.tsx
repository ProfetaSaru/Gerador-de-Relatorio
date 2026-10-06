import React from 'react';
import { ListTodo } from 'lucide-react';
import { Badge } from '../common/Badge';

interface HeaderProps {
  taskCount: number;
}

export const Header: React.FC<HeaderProps> = ({ taskCount }) => {
  const countLabel = `${taskCount} ${taskCount === 1 ? 'tarefa' : 'tarefas'}`;

  return (
    <header className="page-header">
      <div>
        <p className="eyebrow">Organizador pessoal</p>
        <h1>Relatório de atividades</h1>
        <p className="subtitle">Registre suas tarefas e mantenha tudo em ordem.</p>
      </div>
      <Badge icon={<ListTodo size={15} />}>
        {countLabel}
      </Badge>
    </header>
  );
};
