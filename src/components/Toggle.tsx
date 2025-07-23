'use client';

import { useState, ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ToggleProps {
  children: ReactNode;
  trigger: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  showIcon?: boolean;
}

export default function Toggle({
  children,
  trigger,
  defaultOpen = false,
  className = "",
  triggerClassName = "",
  contentClassName = "",
  showIcon = true,
}: ToggleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={className} suppressHydrationWarning>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 ${triggerClassName}`}
        suppressHydrationWarning
      >
        {trigger}
        {showIcon && (
          isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />
        )}
      </button>

      {isOpen && (
        <div className={contentClassName}>
          {children}
        </div>
      )}
    </div>
  );
}