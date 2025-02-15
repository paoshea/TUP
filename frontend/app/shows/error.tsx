"use client";

import { RouteError } from '../../components/shared/RouteError';

export default function ShowsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteError error={error} reset={reset} pageName="Shows" />;
}
