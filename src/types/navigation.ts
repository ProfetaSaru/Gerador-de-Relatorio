import React from 'react';

export type ToolCategory = 'automacoes' | 'sistema';

export interface NavigationItem {
  id: string;
  name: string;
  shortName?: string;
  description: string;
  category: ToolCategory;
  badge?: string;
  badgeVariant?: 'primary' | 'success' | 'warning' | 'muted';
  isReady: boolean;
  icon: React.ReactNode;
}
