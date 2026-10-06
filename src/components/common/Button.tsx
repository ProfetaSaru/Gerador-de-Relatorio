import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'text' | 'edit' | 'delete';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: React.ReactNode;
}

const VARIANT_CLASS_MAP: Record<ButtonVariant, string> = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  danger: 'btn btn-danger',
  text: 'btn btn-text',
  edit: 'btn btn-action-edit',
  delete: 'btn btn-action-delete',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  icon,
  children,
  className = '',
  type = 'button',
  ...rest
}) => {
  const variantClass = VARIANT_CLASS_MAP[variant] || VARIANT_CLASS_MAP.primary;
  const combinedClassName = `${variantClass} ${className}`.trim();

  return (
    <button type={type} className={combinedClassName} {...rest}>
      {icon}
      {children}
    </button>
  );
};
