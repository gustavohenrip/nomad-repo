'use client';

import { motion } from 'framer-motion';

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  scale?: number;
}

export default function RevealOnScroll({
  children,
  className = '',
  style,
  delay = 0,
  duration = 0.7,
  y = 50,
  x = 0,
  scale = 1,
}: RevealOnScrollProps) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y, x, scale: scale < 1 ? scale : undefined }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      transition={{
        duration,
        delay,
        ease: [0.23, 1, 0.32, 1],
      }}
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  );
}
