"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { BrochureModalProps } from "@/components/premium/BrochureModal";

/** The modal's code (form, animations, icons) is downloaded only when it is first opened. */
const BrochureModal = dynamic(() => import("@/components/premium/BrochureModal"), { ssr: false });

/**
 * Drop-in replacement for <BrochureModal>: identical props, but nothing is loaded until the
 * visitor clicks "Download brochure". After the first open it stays mounted, so closing still
 * plays the exit animation and re-opening is instant.
 */
export default function LazyBrochureModal(props: BrochureModalProps) {
  const [hasOpened, setHasOpened] = useState(props.isOpen);
  // Derive "has ever been opened" during render (React's documented pattern for derived state).
  if (props.isOpen && !hasOpened) setHasOpened(true);
  return hasOpened ? <BrochureModal {...props} /> : null;
}
