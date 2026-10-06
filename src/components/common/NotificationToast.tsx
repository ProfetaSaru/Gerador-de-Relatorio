import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { NotificationType } from '../../types/task';

interface NotificationToastProps {
  message: string;
  type: NotificationType;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ message, type }) => {
  if (!message) {
    return <p className="form-message" role="status" aria-live="polite" />;
  }

  const isSuccess = type === 'success';
  const Icon = isSuccess ? CheckCircle2 : AlertCircle;

  return (
    <p className={`form-message ${type}`} role="status" aria-live="polite">
      <Icon size={16} />
      <span>{message}</span>
    </p>
  );
};
