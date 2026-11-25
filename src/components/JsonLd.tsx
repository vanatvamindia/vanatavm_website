/**
 * Renders JSON-LD as a native <script> tag (per the Next.js JSON-LD guide).
 * `<` is escaped to < so content can never close the script tag (XSS-safe).
 * Falsy entries are skipped, so builders that return null can be passed directly.
 */
type Node = Record<string, unknown> | null | undefined | false;

export default function JsonLd({ data }: { data: Node | Node[] }) {
  const nodes = (Array.isArray(data) ? data : [data]).filter(Boolean);
  if (nodes.length === 0) return null;
  const payload = nodes.length === 1 ? nodes[0] : nodes;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload).replace(/</g, "\\u003c") }}
    />
  );
}
