import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Silence benign sandbox HMR WebSocket connection errors
if (typeof window !== "undefined") {
  const originalError = console.error;
  const originalWarn = console.warn;

  const isWebsocketError = (args: any[]) => {
    return args.some(arg => {
      if (!arg) return false;
      const str = String(arg.message || arg.stack || arg);
      return (
        str.includes("WebSocket") ||
        str.includes("websocket") ||
        str.includes("HMR") ||
        (str.includes("vite") && str.includes("connect"))
      );
    });
  };

  console.error = function(...args: any[]) {
    if (isWebsocketError(args)) return;
    originalError.apply(console, args);
  };

  console.warn = function(...args: any[]) {
    if (isWebsocketError(args)) return;
    originalWarn.apply(console, args);
  };

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    if (
      reason &&
      (reason.message?.includes("WebSocket") ||
        reason.message?.includes("websocket") ||
        reason.message?.includes("HMR") ||
        reason.stack?.includes("websocket") ||
        reason.stack?.includes("WebSocket") ||
        String(reason).includes("WebSocket") ||
        String(reason).includes("websocket"))
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  window.addEventListener("error", (event) => {
    if (
      event.message?.includes("WebSocket") ||
      event.message?.includes("websocket") ||
      event.message?.includes("HMR")
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
