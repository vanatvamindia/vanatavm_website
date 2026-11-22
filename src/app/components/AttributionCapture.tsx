"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/** Records the visitor's landing page, referrer and utm_* tags once per session. Renders nothing. */
export default function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
