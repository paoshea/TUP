"use client";

import React from 'react';
import Link from 'next/link';

export default function ErrorPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      backgroundColor: 'var(--background)',
      color: 'var(--foreground)',
    }}>
      <div style={{
        maxWidth: '28rem',
        width: '100%',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          marginBottom: '1rem',
        }}>
          Something went wrong
        </h1>
        <p style={{
          color: 'var(--muted-foreground)',
          marginBottom: '1.5rem',
        }}>
          An unexpected error occurred
        </p>
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
        }}>
          <Link
            href="/"
            style={{
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
            }}
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}