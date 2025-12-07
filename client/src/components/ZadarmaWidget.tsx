import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (!user || user.role === 'master') return;
    if (initialized) return;

    const initWidget = async () => {
      try {
        const response = await fetch('/api/zadarma/widget-config');
        if (!response.ok) {
          console.log('Zadarma widget config not available');
          return;
        }
        
        const config = await response.json();
        
        if (config.key && config.sip && window.zadarmaWidgetFn) {
          window.zadarmaWidgetFn(
            config.key,
            config.sip,
            'square',
            'en',
            true,
            { right: '10px', bottom: '5px' }
          );
          setInitialized(true);
          console.log('Zadarma widget initialized');
        }
      } catch (error) {
        console.log('Failed to initialize Zadarma widget:', error);
      }
    };

    const checkAndInit = () => {
      if (window.zadarmaWidgetFn) {
        initWidget();
      } else {
        setTimeout(checkAndInit, 500);
      }
    };

    checkAndInit();
  }, [user, initialized]);

  return null;
}
