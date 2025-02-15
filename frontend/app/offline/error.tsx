"use client";

import { RouteError } from '@/components/shared/RouteError';

export default function OfflineError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteError error={error} reset={reset} pageName="Offline Mode" />;
}
