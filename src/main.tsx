import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {ErrorBoundary} from './components/ErrorBoundary';
import './index.css';

// Catch cross-origin or third-party iframe script errors safely
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (event.message === 'Script error.') {
      event.preventDefault();
      console.warn('[GlobalSafety] Caught cross-origin Script error safely.');
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && typeof event.reason === 'string' && event.reason.includes('Script error')) {
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
