import { useState, useRef, useCallback } from 'react';
import { NotificationState, NotificationType } from '../types/task';

export function useNotification(defaultDuration = 2400) {
  const [notification, setNotification] = useState<NotificationState>({
    message: '',
    type: '',
  });

  const timerRef = useRef<number | null>(null);

  const notify = useCallback(
    (message: string, type: NotificationType = 'success', duration = defaultDuration) => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }

      setNotification({ message, type });

      timerRef.current = window.setTimeout(() => {
        setNotification({ message: '', type: '' });
        timerRef.current = null;
      }, duration);
    },
    [defaultDuration]
  );

  const clearNotification = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setNotification({ message: '', type: '' });
  }, []);

  return {
    notification,
    notify,
    clearNotification,
  };
}
