import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea: React.FC<TextareaProps> = ({ className = '', ...props }) => {
  return <textarea className={`textarea-control ${className}`.trim()} {...props} />;
};
