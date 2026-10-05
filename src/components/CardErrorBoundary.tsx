import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, ShieldCheck } from 'lucide-react';

interface CardErrorBoundaryProps {
  children: ReactNode;
  cardName: string;
  onResetStorageKey?: string;
}

interface CardErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class CardErrorBoundary extends Component<CardErrorBoundaryProps, CardErrorBoundaryState> {
  public state: CardErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): CardErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[CardErrorBoundary] Error in ${this.props.cardName}:`, error, errorInfo);
  }

  private handleRecover = () => {
    if (this.props.onResetStorageKey) {
      try {
        localStorage.removeItem(this.props.onResetStorageKey);
      } catch {}
    }
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-slate-800 dark:text-zinc-200 text-left space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Захисний режим: {this.props.cardName}</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono font-bold">
              Auto-Protect
            </span>
          </div>

          <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
            Виникла незначна помилка при відображенні цього блоку. Натисніть нижче для швидкого самовідновлення без втрати решти даних.
          </p>

          <button
            type="button"
            onClick={this.handleRecover}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Відновити роботу вікна</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
