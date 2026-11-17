'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { riseStyle } from '@/lib/rise';

type RevealTextProps = {
  children: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  once?: boolean;
  /** stagger per word in seconds */
  stagger?: number;
  /**
   * Above-the-fold headlines: animate with CSS on first paint instead of waiting for
   * JavaScript and a scroll trigger. The words stay visible in the server HTML (only their
   * position animates), so the headline counts as painted immediately.
   */
  immediate?: boolean;
};

const container: Variants = {
  hidden: {},
  visible: (stagger: number) => ({
    transition: { staggerChildren: stagger },
  }),
};

const word: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Splits text into words, each masked in an overflow-hidden span, and
 * reveals them with a staggered upward wipe when scrolled into view.
 * Wrap it in whatever heading tag you need — it only renders inline spans.
 */
export default function RevealText({
  children,
  className,
  style,
  delay = 0,
  once = true,
  stagger = 0.06,
  immediate = false,
}: RevealTextProps) {
  const words = children.split(' ');

  if (immediate) {
    return (
      <span className={className} style={{ display: 'inline', ...style }}>
        {words.map((w, i) => (
          <React.Fragment key={i}>
            <span
              className="vt-rise"
              style={riseStyle(delay + i * stagger, { y: '0.45em' }, {
                display: 'inline-block',
                verticalAlign: 'top',
                paddingBottom: '0.08em',
              })}
            >
              {w}
            </span>
            {/* The space must sit between the inline-blocks: a trailing space inside one collapses. */}
            {i !== words.length - 1 ? ' ' : null}
          </React.Fragment>
        ))}
      </span>
    );
  }

  return (
    <motion.span
      className={className}
      style={{ display: 'inline', ...style }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.4 }}
      variants={container}
      custom={stagger}
      transition={{ delayChildren: delay }}
    >
      {words.map((w, i) => (
        <span
          key={i}
          style={{ display: 'inline-block', verticalAlign: 'top', paddingBottom: '0.08em' }}
        >
          <motion.span style={{ display: 'inline-block' }} variants={word}>
            {w}
            {i !== words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
