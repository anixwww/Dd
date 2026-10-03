import React, { useRef } from 'react';

export interface SegmentedItem<T extends string> {
  id: T;
  label?: string;
  icon?: React.ReactNode;
  title?: string;
}

interface MonolithicSegmentedControlProps<T extends string> {
  items: SegmentedItem<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function MonolithicSegmentedControl<T extends string>({
  items,
  value,
  onChange,
  className = '',
  size = 'md',
}: MonolithicSegmentedControlProps<T>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const currentIndex = items.findIndex((it) => it.id === value);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;

  const updateFromPosition = (clientX: number) => {
    if (!containerRef.current || items.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = Math.max(0, Math.min(rect.width - 1, clientX - rect.left));
    const targetIdx = Math.min(
      items.length - 1,
      Math.max(0, Math.floor((relX / rect.width) * items.length))
    );
    if (targetIdx !== currentIndex && items[targetIdx]) {
      onChange(items[targetIdx].id);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate(8);
        } catch {}
      }
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    updateFromPosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    updateFromPosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {}
    }
  };

  const padClass =
    size === 'sm'
      ? 'p-0.5'
      : size === 'lg'
      ? 'p-1.5'
      : 'p-1';

  const itemPadClass =
    size === 'sm'
      ? 'py-1 px-2 text-[10px]'
      : size === 'lg'
      ? 'py-2 px-3 text-xs'
      : 'py-1.5 px-2.5 text-[11px]';

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative flex items-center rounded-2xl bg-slate-200/80 dark:bg-zinc-900/90 select-none cursor-ew-resize touch-none shadow-2xs ${padClass} ${className}`}
      title="Перетягуйте вліво або вправо для перемикання"
    >
      {/* Sliding active pill indicator */}
      <div
        className="absolute top-1 bottom-1 rounded-xl bg-white dark:bg-zinc-800 shadow-sm transition-all duration-200 ease-out pointer-events-none"
        style={{
          width: `calc((100% - ${size === 'sm' ? '4px' : size === 'lg' ? '12px' : '8px'}) / ${items.length})`,
          left: `calc(${safeIndex} * ((100% - ${size === 'sm' ? '4px' : size === 'lg' ? '12px' : '8px'}) / ${items.length}) + ${size === 'sm' ? '2px' : size === 'lg' ? '6px' : '4px'})`,
        }}
      />

      {items.map((item) => {
        const isActive = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(item.id);
            }}
            className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 font-bold transition-colors duration-150 cursor-pointer border-none bg-transparent ${itemPadClass} ${
              isActive
                ? 'text-slate-900 dark:text-zinc-100 font-extrabold'
                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
            title={item.title || item.label}
          >
            {item.icon && <span className="shrink-0">{item.icon}</span>}
            {item.label && <span className="truncate">{item.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
