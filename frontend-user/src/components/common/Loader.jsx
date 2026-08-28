import React from 'react';

export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink/50">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-wine" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
