import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';

declare global {
  interface Window {
    zadarmaWidgetFn?: (
      key: string,
      sip: string,
      shape: 'square' | 'rounded',
      lang: string,
      show: boolean,
      position: { right: string; bottom: string }
    ) => void;
  }
}

export function ZadarmaWidget() {
  const { user } = useAuth();
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 10;
  const RETRY_DELAY = 1000;

  const initWidget = useCallback(async () => {
    try {
      const response = await fetch('/api/zadarma/widget-config', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('Zadarma widget config error:', errorData.message || response.statusText);
        setError(errorData.message || 'Widget config not available');
        return false;
      }
      
      const config = await response.json();
      
      if (!config.key || !config.sip) {
        console.log('Zadarma widget config incomplete - missing key or sip');
        setError('Widget configuration incomplete');
        return false;
      }

      if (!window.zadarmaWidgetFn) {
        console.log('Zadarma widget function not loaded yet');
        return false;
      }

      window.zadarmaWidgetFn(
        config.key,
        config.sip,
        'square',
        'en',
        true,
        { right: '10px', bottom: '5px' }
      );
      
      setInitialized(true);
      setError(null);
      console.log('Zadarma widget initialized successfully with SIP:', config.sip);
      return true;
    } catch (err) {
      console.log('Failed to initialize Zadarma widget:', err);
      setError('Failed to connect to Zadarma');
      return false;
    }
  }, []);

  useEffect(() => {
    if (!user || user.role === 'master') return;
    if (initialized) return;

    const attemptInit = async () => {
      if (retryCount >= MAX_RETRIES) {
        console.log('Max retries reached for Zadarma widget initialization');
        return;
      }

      const success = await initWidget();
      
      if (!success && retryCount < MAX_RETRIES) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, RETRY_DELAY);
      }
    };

    attemptInit();
  }, [user, initialized, initWidget, retryCount]);

  if (error && retryCount >= MAX_RETRIES) {
    console.log('Zadarma widget failed to initialize after max retries:', error);
  }

  return null;
}
