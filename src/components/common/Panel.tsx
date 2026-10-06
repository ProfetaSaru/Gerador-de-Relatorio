import React from 'react';

interface PanelProps {
  className?: string;
  children: React.ReactNode;
}

export const Panel: React.FC<PanelProps> = ({ className = '', children }) => {
  return <section className={`panel ${className}`.trim()}>{children}</section>;
};
