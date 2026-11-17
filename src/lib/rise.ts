import type { CSSProperties } from "react";

/** Options for {@link riseStyle}. Offsets are any CSS length, e.g. "24px", "0.4em", "110%". */
export type RiseOptions = {
  /** Horizontal start offset (default 0). Negative slides in from the left. */
  x?: string;
  /** Vertical start offset (default "24px" for .vt-rise, "110%" for .vt-rise-mask). */
  y?: string;
};

/**
 * Inline style for elements using the CSS-only `.vt-rise` / `.vt-rise-mask` entrance
 * animations defined in globals.css. Sets the stagger delay and optional start offset
 * through CSS custom properties, merged with any extra styles.
 *
 * Use it for above-the-fold content instead of a Framer Motion `initial={{ opacity: 0 }}`
 * animation: the text stays visible in the server HTML, so it paints immediately.
 *
 * @param delay   Animation delay in seconds (negative values are treated as 0).
 * @param options Optional start offsets.
 * @param style   Extra inline styles, merged after the custom properties.
 * @returns A style object, e.g. `{ "--rise-delay": "0.2s", maxWidth: "800px" }`.
 *
 * @example
 * <h1 className="vt-rise" style={riseStyle(0.2)}>Title</h1>
 */
export function riseStyle(delay = 0, options: RiseOptions = {}, style?: CSSProperties): CSSProperties {
  const vars: Record<string, string> = {
    "--rise-delay": `${Math.max(0, Number.isFinite(delay) ? delay : 0)}s`,
  };
  if (options.x !== undefined) vars["--rise-x"] = options.x;
  if (options.y !== undefined) vars["--rise-y"] = options.y;
  return { ...(vars as CSSProperties), ...style };
}
