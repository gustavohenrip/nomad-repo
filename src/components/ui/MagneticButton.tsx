'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export default function MagneticButton({
  children,
  className = '',
  style,
  onClick,
  type = 'button',
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || !innerRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const dy = (e.clientY - rect.top - rect.height / 2) * 0.3;
    gsap.to(buttonRef.current, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
    gsap.to(innerRef.current, { x: dx * 0.4, y: dy * 0.4, duration: 0.4, ease: 'power2.out' });
  };

  const handleMouseLeave = () => {
    if (!buttonRef.current || !innerRef.current) return;
    gsap.to(buttonRef.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    gsap.to(innerRef.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      className={className}
      style={style}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <span ref={innerRef} style={{ display: 'block' }}>
        {children}
      </span>
    </button>
  );
}
