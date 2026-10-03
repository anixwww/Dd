import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {ErrorBoundary} from './components/ErrorBoundary';
import './index.css';

// Catch cross-origin or third-party iframe script errors safely
if (typeof window !== 'undefined') {
  const originalOnError = window.onerror;
  window.onerror = function (message, source, lineno, colno, error) {
    if (typeof message === 'string' && (message.includes('Script error') || message.includes('ResizeObserver'))) {
      console.warn('[GlobalSafety] Intercepted script or observer error safely:', message);
      return true;
    }
    if (originalOnError) {
      try {
        return originalOnError.apply(this, arguments as any);
      } catch {}
    }
    return false;
  };

  window.addEventListener('error', (event) => {
    if (event.message && (event.message.includes('Script error') || event.message.includes('ResizeObserver'))) {
      event.preventDefault();
      event.stopPropagation();
      console.warn('[GlobalSafety] Caught cross-origin Script error safely.');
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && (
      (typeof event.reason === 'string' && (event.reason.includes('Script error') || event.reason.includes('ResizeObserver'))) ||
      (event.reason?.message && (event.reason.message.includes('Script error') || event.reason.message.includes('ResizeObserver')))
    )) {
      event.preventDefault();
      console.warn('[GlobalSafety] Caught unhandled script rejection safely.');
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
