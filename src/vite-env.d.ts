/// <reference types="vite/client" />

// hCaptcha global interface
declare global {
  interface Window {
    hcaptcha: {
      execute: (siteKey: string, options?: any) => Promise<string>;
      render: (container: string | HTMLElement, options: any) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}
