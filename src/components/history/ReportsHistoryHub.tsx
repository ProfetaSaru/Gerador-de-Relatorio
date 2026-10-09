import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Copy,
  Download,
  RotateCcw,
  Trash2,
  Calendar,
  Clock,
  FileText,
  ChevronDown,
  ChevronUp,
  Check,
  Edit2,
  CheckCircle,
} from 'lucide-react';
import { SavedReport, Task } from '../../types/task';

interface ReportsHistoryHubProps {
  savedReports: SavedReport[];
  onDeleteReport: (id: string) => void;
  onRenameReport: (id: string, newTitle: string) => void;
  onClearAllReports: () => void;
  onRestoreTasks: (tasks: Task[], reportTitle: string) => void;
  onNotify: (message: string, type: 'success' | 'error' | '') => void;
  onNavigateToGenerator: () => void;
}

export const ReportsHistoryHub: React.FC<ReportsHistoryHubProps> = ({
  savedReports,
  onDeleteReport,
  onRenameReport,
  onClearAllReports,
  onRestoreTasks,
  onNotify,
  onNavigateToGenerator,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Edição inline de título
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitleValue, setEditTitleValue] = useState('');

  // Filtragem
  const filteredReports = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return savedReports;

    return savedReports.filter((report) => {
      const matchTitle = report.title.toLowerCase().includes(q);
      const matchNote = report.note ? report.note.toLowerCase().includes(q) : false;
      const matchDate = report.displayDate.includes(q);
      const matchTasks = report.tasks.some(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
      return matchTitle || matchNote || matchDate || matchTasks;
    });
  }, [savedReports, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = async (report: SavedReport) => {
    try {
      await navigator.clipboard.writeText(report.reportText);
      setCopiedId(report.id);
      onNotify('Relatório copiado para a área de transferência!', 'success');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      onNotify('Erro ao copiar texto do relatório.', 'error');
    }
  };

  const handleDownloadTxt = (report: SavedReport) => {
    try {
      const blob = new Blob([report.reportText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const safeTitle = report.title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
      link.download = `${safeTitle}.txt`;
      link.click();
      URL.revokeObjectURL(url);
      onNotify('Download do arquivo .txt iniciado!', 'success');
    } catch {
      onNotify('Erro ao baixar arquivo do relatório.', 'error');
    }
  };

  const handleRestore = (report: SavedReport) => {
    const confirmed = window.confirm(
      `Restaurar as ${report.taskCount} atividades de "${report.title}" para o Gerador de Relatórios?\n\nAs tarefas ativas atuais serão substituídas.`
    );

    if (confirmed) {
      onRestoreTasks(report.tasks, report.title);
      onNavigateToGenerator();
      onNotify(`Atividades restauradas de "${report.title}".`, 'success');
    }
  };

  const handleDelete = (report: SavedReport) => {
    const confirmed = window.confirm(`Excluir o relatório "${report.title}" permanentemente?`);
    if (confirmed) {
      onDeleteReport(report.id);
      onNotify('Relatório excluído do histórico.', '');
    }
  };

  const handleStartRename = (report: SavedReport) => {
    setEditingId(report.id);
    setEditTitleValue(report.title);
  };

  const handleSaveRename = (id: string) => {
    if (editTitleValue.trim()) {
      onRenameReport(id, editTitleValue.trim());
      onNotify('Título do relatório atualizado.', 'success');
    }
    setEditingId(null);
  };

  const handleClearAll = () => {
    if (savedReports.length === 0) return;
    const confirmed = window.confirm(
      'Tem certeza de que deseja excluir TODOS os relatórios salvos no histórico? Esta ação não pode ser desfeita.'
    );
    if (confirmed) {
      onClearAllReports();
      onNotify('Todo o histórico de relatórios foi limpo.', '');
    }
  };

  return (
    <div className="history-container">
      {/* Header do Histórico */}
      <div className="history-header">
        <div className="history-header-info">
          <h2>
            <History size={24} style={{ color: 'var(--yellow)' }} />
            Histórico & Arquivos de Relatórios
          </h2>
          <p>
            Consolidação dos relatórios diários salvos no navegador. Consulte, copie, baixe ou restaure atividades anteriores.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className="history-badge-count">
            {savedReports.length} {savedReports.length === 1 ? 'relatório salvo' : 'relatórios salvos'}
          </span>

          {savedReports.length > 0 && (
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
              onClick={handleClearAll}
              title="Excluir todos os relatórios do histórico"
            >
              <Trash2 size={13} style={{ color: 'var(--red)' }} />
              Limpar histórico
            </button>
          )}
        </div>
      </div>

      {/* Barra de Filtro e Busca */}
      {savedReports.length > 0 && (
        <div className="history-toolbar">
          <div className="history-search-wrapper">
            <Search size={16} className="history-search-icon" />
            <input
              type="text"
              className="history-search-input"
              placeholder="Pesquisar por título, data ou atividade do relatório..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Listagem de Relatórios Arquivados */}
      {filteredReports.length === 0 ? (
        <div className="history-empty-state">
          <div className="history-empty-icon">
            <FileText size={28} />
          </div>
          {savedReports.length === 0 ? (
            <>
              <h3>Nenhum relatório salvo ainda</h3>
              <p>
                Quando você finalizar suas atividades no Gerador de Relatórios, clique no botão <strong>"Salvar"</strong> ou <strong>"Salvar como..."</strong> para arquivá-las aqui.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: 'auto', marginTop: '0.5rem' }}
                onClick={onNavigateToGenerator}
              >
                Ir para o Gerador de Relatórios
              </button>
            </>
          ) : (
            <>
              <h3>Nenhum resultado para a busca</h3>
              <p>Tente outros termos de pesquisa para localizar os relatórios arquivados.</p>
            </>
          )}
        </div>
      ) : (
        <div className="history-list">
          {filteredReports.map((report) => {
            const isExpanded = !!expandedIds[report.id];
            const isCopied = copiedId === report.id;
            const isEditing = editingId === report.id;

            // Formatação amigável da data exibida
            const [yyyy, mm, dd] = report.displayDate.split('-');
            const formattedDateBR = dd && mm && yyyy ? `${dd}/${mm}/${yyyy}` : report.displayDate;

            return (
              <div key={report.id} className="history-card">
                <div className="history-card-header">
                  <div className="history-card-title-group" style={{ flex: 1, minWidth: '260px' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '8px' }}>
                        <input
                          type="text"
                          className="field-input"
                          style={{ padding: '4px 8px', fontSize: '0.95rem' }}
                          value={editTitleValue}
                          onChange={(e) => setEditTitleValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveRename(report.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                          autoFocus
                        />
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ padding: '6px 10px', width: 'auto' }}
                          onClick={() => handleSaveRename(report.id)}
                          title="Salvar novo título"
                        >
                          <Check size={14} />
                        </button>
                      </div>
                    ) : (
                      <h3>
                        <span>{report.title}</span>
                        <button
                          type="button"
                          className="field-icon-btn"
                          style={{ position: 'static', padding: 2 }}
                          onClick={() => handleStartRename(report)}
                          title="Renomear título"
                        >
                          <Edit2 size={13} />
                        </button>
                      </h3>
                    )}

                    <div className="history-card-meta">
                      <span className="history-card-meta-item">
                        <Calendar size={13} style={{ color: 'var(--blue)' }} />
                        {formattedDateBR} às {report.displayTime}
                      </span>

                      <span className="history-card-meta-item">
                        <Clock size={13} style={{ color: 'var(--yellow)' }} />
                        Período: {report.periodSummary}
                      </span>

                      <span className="history-card-meta-item">
                        <CheckCircle size={13} style={{ color: 'var(--green)' }} />
                        {report.taskCount} {report.taskCount === 1 ? 'atividade' : 'atividades'}
                      </span>
                    </div>

                    {report.note && (
                      <div className="history-card-note">
                        <strong>Nota:</strong> {report.note}
                      </div>
                    )}
                  </div>

                  {/* Ações por Relatório */}
                  <div className="history-card-actions">
                    <button
                      type="button"
                      className="btn-history-action"
                      onClick={() => handleCopy(report)}
                      title="Copiar texto compilado do relatório"
                    >
                      {isCopied ? <Check size={14} style={{ color: 'var(--green)' }} /> : <Copy size={14} />}
                      {isCopied ? 'Copiado!' : 'Copiar'}
                    </button>

                    <button
                      type="button"
                      className="btn-history-action"
                      onClick={() => handleDownloadTxt(report)}
                      title="Baixar como arquivo .txt"
                    >
                      <Download size={14} />
                      Baixar .txt
                    </button>

                    <button
                      type="button"
                      className="btn-history-action restore"
                      onClick={() => handleRestore(report)}
                      title="Restaurar estas atividades no Gerador de Relatórios para continuar editando"
                    >
                      <RotateCcw size={14} />
                      Restaurar no Gerador
                    </button>

                    <button
                      type="button"
                      className="btn-history-action delete"
                      onClick={() => handleDelete(report)}
                      title="Excluir este relatório do histórico"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Alternador de Pré-visualização */}
                <div>
                  <button
                    type="button"
                    className="history-preview-toggle"
                    onClick={() => toggleExpand(report.id)}
                  >
                    {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    {isExpanded ? 'Ocultar texto do relatório' : 'Visualizar texto do relatório'}
                  </button>

                  {isExpanded && (
                    <div className="history-preview-box" style={{ marginTop: '0.65rem' }}>
                      {report.reportText}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
