import React, { useState } from 'react';
import { Wand2, UserPlus, FileSpreadsheet, Mail } from 'lucide-react';
import { TemplateId } from '../../types/templates';
import { NotificationState } from '../../types/task';
import { NotificationToast } from '../common/NotificationToast';
import { NewCollaboratorTemplate } from './NewCollaboratorTemplate';

interface Props {
  notification: NotificationState;
  onNotify: (message: string, type?: 'success' | 'error' | '') => void;
}

export const QuickTemplatesHub: React.FC<Props> = ({ notification, onNotify }) => {
  const [activeTemplate, setActiveTemplate] = useState<TemplateId>('novo-colaborador');

  return (
    <div className="templates-container">
      {notification.message && (
        <NotificationToast
          message={notification.message}
          type={notification.type}
        />
      )}
      {/* Header com seleção de modelos */}
      <div className="templates-header">
        <div className="templates-header-info">
          <h2>
            <Wand2 size={24} style={{ color: 'var(--blue)' }} />
            Modelos de Textos Rápidos
          </h2>
          <p>
            Templates dinâmicos para geração de comunicados padronizados, credenciais e mensagens operacionais.
          </p>
        </div>

        {/* Abas de Modelos Disponíveis */}
        <div className="templates-tabs-bar">
          <button
            type="button"
            className={`template-tab-btn ${activeTemplate === 'novo-colaborador' ? 'active' : ''}`}
            onClick={() => setActiveTemplate('novo-colaborador')}
          >
            <UserPlus size={16} />
            Novo Colaborador
          </button>

          <button
            type="button"
            className="template-tab-btn"
            style={{ opacity: 0.6, cursor: 'not-allowed' }}
            title="Em breve novos templates"
            disabled
          >
            <Mail size={16} />
            Comunicado Geral (Em breve)
          </button>

          <button
            type="button"
            className="template-tab-btn"
            style={{ opacity: 0.6, cursor: 'not-allowed' }}
            title="Em breve novos templates"
            disabled
          >
            <FileSpreadsheet size={16} />
            Aviso de Manutenção (Em breve)
          </button>
        </div>
      </div>

      {/* Conteúdo do Template Ativo */}
      {activeTemplate === 'novo-colaborador' && (
        <NewCollaboratorTemplate onNotify={onNotify} />
      )}
    </div>
  );
};
