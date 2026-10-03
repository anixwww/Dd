import React from 'react';

interface TimerShellProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const RefractedTimerShell: React.FC<TimerShellProps> = ({ children, className = '', style }) => {
  return (
    <div style={style} className={`relative flex items-center justify-center ${className}`}>
      {children}
    </div>
  );
};
