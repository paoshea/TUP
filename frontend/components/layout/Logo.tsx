import React from 'react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="flex items-center justify-center rounded-lg bg-primary text-white font-bold p-2">
        TUP
      </div>
      <span className="font-semibold hidden sm:inline-block">
        LiveStock Show Assistant
      </span>
    </Link>
  );
}