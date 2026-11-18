'use client'; // Error boundaries must be Client Components

import ErrorRecovery from '@/components/ui/ErrorRecovery';

/**
 * Error boundary for every page. Recovers automatically with a single reload (e.g. after a new
 * deploy removed the files an already-open tab needs); otherwise shows Reload / Go back.
 */
export default function Error({ error }: { error: unknown }) {
  return <ErrorRecovery error={error} />;
}
