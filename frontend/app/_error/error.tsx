"use client";

import React from 'react';
import Link from 'next/link';

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    backgroundColor: 'var(--background)',
    color: 'var(--foreground)',
  },
  content: {
    maxWidth: '28rem',
    width: '100%',
    textAlign: 'center' as const,
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '1rem',
  },
  message: {
    color: 'var(--muted-foreground)',
    marginBottom: '1.5rem',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    height: '2.5rem',
    padding: '0 1rem',
    transition: 'all 0.2s',
    backgroundColor: 'var(--primary)',
    color: 'var(--primary-foreground)',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    border: '1px solid var(--input)',
  },
};

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Something went wrong</h1>
        <p style={styles.message}>
          {error.message || 'An unexpected error occurred'}
        </p>
        <div style={styles.actions}>
          <Link href="/" style={styles.button}>
            Go back home
          </Link>
          <button onClick={() => reset()} style={{...styles.button, ...styles.buttonSecondary}}>
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}