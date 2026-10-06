import React from 'react';
import { HardDrive } from 'lucide-react';
import { Task } from '../../types/task';
import { generateReport } from '../../utils/formatReport';

interface ReportPreviewProps {
  tasks: Task[];
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({ tasks }) => {
  const reportText = generateReport(tasks);

  return (
    <div className="report-preview">
      <div className="preview-heading">
        <span>Formato do relatório</span>
        <span className="storage-status">
          <HardDrive size={13} />
          Salvo neste navegador
        </span>
      </div>
      <pre>{reportText}</pre>
    </div>
  );
};
