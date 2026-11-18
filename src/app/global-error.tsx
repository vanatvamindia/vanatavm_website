'use client'; // Error boundaries must be Client Components

import ErrorRecovery from '@/components/ui/ErrorRecovery';

/**
 * Last-resort error boundary (errors in the root layout or during navigation). Replaces Next.js's
 * default "This page couldn't load" screen: reloads once automatically, which fixes the case of a
 * tab opened before a Catalyst deploy whose old JavaScript files were deleted; otherwise shows
 * Reload / Go back. It must render its own <html> and <body>.
 */
export default function GlobalError({ error }: { error: unknown }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <title>VanaTvam</title>
        <ErrorRecovery error={error} />
      </body>
    </html>
  );
}
