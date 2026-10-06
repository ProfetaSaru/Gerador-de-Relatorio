import React from 'react';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  isOptional?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  isOptional = false,
  className = '',
  children,
}) => {
  return (
    <div className={`field ${className}`.trim()}>
      <label htmlFor={htmlFor}>
        {label} {isOptional && <span>(opcional)</span>}
      </label>
      {children}
    </div>
  );
};
