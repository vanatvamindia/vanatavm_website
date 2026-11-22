"use client";

import type { LeadFormStatus as Status } from "@/lib/useLeadForm";

/** Thank-you / error message shown under a lead form. Renders nothing until a submit finishes. */
export default function LeadFormStatus({ status }: { status: Status }) {
  if (status !== "success" && status !== "error") return null;
  const ok = status === "success";
  return (
    <p
      role={ok ? "status" : "alert"}
      aria-live="polite"
      style={{
        margin: "18px 0 0",
        padding: "12px 16px",
        borderRadius: "10px",
        textAlign: "center",
        fontSize: "0.92rem",
        fontWeight: 600,
        lineHeight: 1.5,
        color: ok ? "#1F5A3D" : "#9B2C1F",
        background: ok ? "#E8F3EC" : "#FBEAE7",
        border: `1px solid ${ok ? "#BFDCC9" : "#F0C4BD"}`,
      }}
    >
      {ok
        ? "Thank you! Our team will contact you shortly."
        : "Something went wrong. Please call or WhatsApp us directly."}
    </p>
  );
}
