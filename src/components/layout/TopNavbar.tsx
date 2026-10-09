import React from 'react';
import { Menu, Layers, ShieldCheck, HardDrive } from 'lucide-react';
import { NavigationItem } from '../../types/navigation';

interface TopNavbarProps {
  activeItem: NavigationItem;
  onOpenMobileSidebar: () => void;
  taskCount?: number;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeItem,
  onOpenMobileSidebar,
  taskCount = 0,
}) => {
  return (
    <header className="top-navbar">
      <div className="top-navbar-left">
        <button
          type="button"
          className="top-navbar-menu-btn"
          onClick={onOpenMobileSidebar}
          aria-label="Abrir menu de navegação"
        >
          <Menu size={22} />
        </button>

        <div className="top-navbar-breadcrumbs">
          <span className="crumb-hub">
            <Layers size={14} />
            BenHermes
          </span>
          <span className="crumb-separator">/</span>
          <span className="crumb-current">{activeItem.name}</span>
        </div>
      </div>

      <div className="top-navbar-right">
        <div className="top-navbar-status" title="Seus dados estão protegidos e salvos no navegador local">
          <HardDrive size={15} />
          <span>Armazenamento Local</span>
          <span className="top-navbar-pulse" />
        </div>

        {taskCount > 0 && (
          <div className="top-navbar-badge">
            <ShieldCheck size={14} />
            <span>{taskCount} {taskCount === 1 ? 'item' : 'itens'}</span>
          </div>
        )}
      </div>
    </header>
  );
};
