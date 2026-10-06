import React, { useState } from 'react';
import { Copy, Trash2, Check } from 'lucide-react';
import { Task } from '../../types/task';
import { Panel } from '../common/Panel';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';
import { TaskList } from './TaskList';
import { ReportPreview } from './ReportPreview';
import { generateReport } from '../../utils/formatReport';

interface ReportPanelProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string, title: string) => void;
  onRequestClearAll: () => void;
  onNotify: (message: string, type: 'success' | 'error') => void;
}

export const ReportPanel: React.FC<ReportPanelProps> = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onRequestClearAll,
  onNotify,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyReport = async () => {
    if (tasks.length === 0) {
      onNotify('Adicione uma tarefa antes de copiar.', 'error');
      return;
    }

    const reportText = generateReport(tasks);
    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
      onNotify('Relatório copiado com sucesso!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onNotify('Não foi possível copiar o relatório.', 'error');
    }
  };

  return (
    <Panel className="report-panel">
      <SectionHeading
        kicker="Seu registro"
        title="Atividades do dia"
        className="report-heading"
      >
        <div className="actions">
          <Button
            variant="secondary"
            icon={copied ? <Check size={14} /> : <Copy size={14} />}
            onClick={handleCopyReport}
          >
            {copied ? 'Copiado!' : 'Copiar relatório'}
          </Button>

          <Button
            variant="danger"
            icon={<Trash2 size={14} />}
            onClick={onRequestClearAll}
          >
            Limpar tudo
          </Button>
        </div>
      </SectionHeading>

      <TaskList
        tasks={tasks}
        onEdit={onEditTask}
        onDelete={onDeleteTask}
      />

      <ReportPreview
        tasks={tasks}
      />
    </Panel>
  );
};
