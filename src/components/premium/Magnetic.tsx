'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

type MagneticProps = {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  style?: React.CSSProperties;
};

export default function Magnetic({ children, strength = 0.35, className, style }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  // Read layout once on enter; reuse cached value on every move to avoid forced reflow.
  const handleMouseEnter = () => {
    if (ref.current) rectRef.current = ref.current.getBoundingClientRect();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = rectRef.current;
    if (!rect) return;
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setPos({ x, y });
  };

  const reset = () => setPos({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 12, mass: 0.2 }}
      className={className}
      style={{ display: 'inline-block', willChange: 'transform', ...style }}
    >
      {children}
    </motion.div>
  );
}
