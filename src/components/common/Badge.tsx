import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, icon, className = '' }) => {
  return (
    <span className={`task-count ${className}`.trim()}>
      {icon}
      {children}
    </span>
  );
};
