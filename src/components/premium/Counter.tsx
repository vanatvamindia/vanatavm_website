'use client';

import React, { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

type CounterProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
  decimals?: number;
};

export default function Counter({
  value,
  suffix = '',
  prefix = '',
  duration = 1.8,
  className,
  style,
  decimals = 0,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  // The real number is in the server HTML (crawlers, link previews, fast scrollers see it). Only
  // once the stat is actually on screen does it count up from 0 to that number.
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });

  useEffect(() => {
    if (isInView && !reduceMotion) motionValue.set(value);
  }, [isInView, reduceMotion, value, motionValue]);

  useEffect(() => {
    return springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${latest.toFixed(decimals)}${suffix}`;
      }
    });
  }, [springValue, prefix, suffix, decimals]);

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}{value.toFixed(decimals)}{suffix}
    </span>
  );
}
