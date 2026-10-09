import React from 'react';
import { ArrowLeft, CheckCircle2, Construction } from 'lucide-react';
import { NavigationItem } from '../../types/navigation';

interface ToolPlaceholderProps {
  tool: NavigationItem;
  onBackToReports: () => void;
}

export const ToolPlaceholder: React.FC<ToolPlaceholderProps> = ({
  tool,
  onBackToReports,
}) => {
  return (
    <div className="tool-placeholder-card">
      <div className="tool-placeholder-badge">
        <Construction size={14} />
        <span>Módulo em Construção</span>
      </div>

      <div className="tool-placeholder-icon">
        {tool.icon}
      </div>

      <h2>{tool.name}</h2>
      <p className="tool-placeholder-desc">{tool.description}</p>

      <div className="tool-placeholder-features">
        <h3>Recursos previstos nesta automação:</h3>
        <ul>
          <li>
            <CheckCircle2 size={16} className="feature-check" />
            Processamento instantâneo 100% no navegador (privacidade total)
          </li>
          <li>
            <CheckCircle2 size={16} className="feature-check" />
            Atalhos rápidos para copiar para a área de transferência
          </li>
          <li>
            <CheckCircle2 size={16} className="feature-check" />
            Exportação padronizada compatível com e-mails, relatórios e planilhas
          </li>
          <li>
            <CheckCircle2 size={16} className="feature-check" />
            Integração com o Gerador de Relatórios existente
          </li>
        </ul>
      </div>

      <div className="tool-placeholder-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={onBackToReports}
        >
          <ArrowLeft size={16} />
          Voltar ao Gerador de Relatórios
        </button>
      </div>
    </div>
  );
};
