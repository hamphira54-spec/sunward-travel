'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const shouldReduceMotion = useReducedMotion();

  const offsets: Record<string, { x?: number; y?: number }> = {
    up:    { y: 28 },
    down:  { y: -28 },
    left:  { x: 28 },
    right: { x: -28 },
    none:  {},
  };

  const offset = offsets[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={shouldReduceMotion ? {} : { opacity: 0, ...offset }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={
        shouldReduceMotion
          ? {}
          : { duration: 0.55, delay, ease: [0.25, 0.1, 0.25, 1] }
      }
    >
      {children}
    </motion.div>
  );
}
