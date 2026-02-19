'use client';

import { useRef } from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'default' | 'strong' | 'subtle' | 'dark';
  hover?: boolean;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = '',
  style,
  variant = 'default',
  hover = true,
  onClick,
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hover || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  const variantClass = {
    default: 'glass',
    strong: 'glass-strong',
    subtle: 'glass-subtle',
    dark: 'glass-dark',
  }[variant];

  const backdropStyles: Record<string, string> = {
    default: 'blur(16px)',
    strong: 'blur(20px)',
    subtle: 'blur(8px)',
    dark: 'blur(16px)',
  };

  return (
    <div
      ref={cardRef}
      className={`${variantClass} rounded-3xl ${hover ? 'glass-hover-card' : ''} ${className}`}
      style={{
        backdropFilter: backdropStyles[variant],
        WebkitBackdropFilter: backdropStyles[variant],
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
