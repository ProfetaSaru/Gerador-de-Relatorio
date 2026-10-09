import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  X,
} from 'lucide-react';
import { NavigationItem } from '../../types/navigation';

interface SidebarProps {
  items: NavigationItem[];
  activeToolId: string;
  onSelectTool: (toolId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  activeToolId,
  onSelectTool,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const automationItems = items.filter((item) => item.category === 'automacoes');
  const systemItems = items.filter((item) => item.category === 'sistema');

  const renderNavGroup = (title: string, groupItems: NavigationItem[]) => (
    <div className="sidebar-group">
      {!isCollapsed && <span className="sidebar-group-title">{title}</span>}
      <ul className="sidebar-list">
        {groupItems.map((item) => {
          const isActive = item.id === activeToolId;
          return (
            <li key={item.id} className="sidebar-list-item">
              <button
                type="button"
                className={`sidebar-nav-btn ${isActive ? 'active' : ''} ${!item.isReady ? 'is-upcoming' : ''}`}
                onClick={() => {
                  onSelectTool(item.id);
                  if (isMobileOpen) {
                    onCloseMobile();
                  }
                }}
                title={isCollapsed ? `${item.name}${item.badge ? ` (${item.badge})` : ''}` : undefined}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>

                {!isCollapsed && (
                  <div className="sidebar-nav-content">
                    <span className="sidebar-nav-label">{item.name}</span>
                    {item.badge && (
                      <span className={`sidebar-nav-badge badge-${item.badgeVariant || 'muted'}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}

                {/* Minified badge dot when collapsed */}
                {isCollapsed && item.badge && (
                  <span
                    className={`sidebar-collapsed-dot dot-${item.badgeVariant || 'muted'}`}
                    aria-hidden="true"
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <>
      {/* Backdrop for mobile devices */}
      {isMobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`app-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}
        aria-label="Navegação de Ferramentas"
      >
        {/* Header da Sidebar */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">
              <Zap size={20} />
            </div>
            {!isCollapsed && (
              <div className="sidebar-brand-text">
                <span className="brand-title">BenHermes</span>
                <span className="brand-subtitle">Hub de Automações & Produtividade</span>
              </div>
            )}
          </div>

          {/* Botão de Fechar no Mobile */}
          <button
            type="button"
            className="sidebar-mobile-close"
            onClick={onCloseMobile}
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>

          {/* Botão de Recolher no Desktop */}
          <button
            type="button"
            className="sidebar-collapse-btn"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
            title={isCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Corpo com a lista de itens */}
        <div className="sidebar-scrollable">
          {renderNavGroup('Ferramentas & Automação', automationItems)}
          {renderNavGroup('Sistema & Apoio', systemItems)}
        </div>

        {/* Rodapé da Sidebar */}
        <div className="sidebar-footer">
          {!isCollapsed ? (
            <div className="sidebar-status-box">
              <div className="status-indicator-dot" />
              <div className="status-indicator-text">
                <span className="status-label">Ambiente Ativo</span>
                <span className="status-sub">Dados locais (Offline)</span>
              </div>
            </div>
          ) : (
            <div
              className="sidebar-status-mini"
              title="Ambiente Local Ativo"
            >
              <div className="status-indicator-dot" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
