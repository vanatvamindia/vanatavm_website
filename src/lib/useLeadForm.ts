"use client";

import { useCallback, useState, type FormEvent } from "react";
import { getAttribution } from "@/lib/attribution";

export type LeadFormStatus = "idle" | "submitting" | "success" | "error";

/**
 * Submit handler for the "Request details" forms. Sends the form's fields to /api/contact as
 * JSON (the API does not accept a native form post), together with the form's `source` label,
 * the page it was submitted from, and the visitor's recorded attribution.
 */
export function useLeadForm(source: string) {
  const [status, setStatus] = useState<LeadFormStatus>("idle");

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (status === "submitting") return;

      const form = event.currentTarget;
      const fields: Record<string, string> = {};
      new FormData(form).forEach((value, key) => {
        if (typeof value === "string") fields[key] = value;
      });

      setStatus("submitting");
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...fields,
            source,
            page: window.location.pathname,
            ...getAttribution(),
          }),
        });
        if (!res.ok) throw new Error("Submission failed");
        form.reset();
        setStatus("success");
      } catch (error) {
        console.error("Lead form submission error:", error);
        setStatus("error");
      }
    },
    [source, status]
  );

  return { status, onSubmit };
}
