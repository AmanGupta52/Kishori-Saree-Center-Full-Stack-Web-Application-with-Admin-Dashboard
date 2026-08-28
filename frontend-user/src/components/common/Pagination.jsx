import React from 'react';

export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;

  const nums = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(pages, start + 4);
  for (let i = start; i <= end; i++) nums.push(i);

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="rounded-md border border-border px-3 py-1.5 text-sm text-ink/70 disabled:opacity-30 hover:border-wine hover:text-wine"
      >
        Prev
      </button>

      {start > 1 && <span className="px-1 text-ink/30">…</span>}

      {nums.map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`h-9 w-9 rounded-md text-sm ${
            n === page ? 'bg-wine text-silk' : 'border border-border text-ink/70 hover:border-wine hover:text-wine'
          }`}
        >
          {n}
        </button>
      ))}

      {end < pages && <span className="px-1 text-ink/30">…</span>}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= pages}
        className="rounded-md border border-border px-3 py-1.5 text-sm text-ink/70 disabled:opacity-30 hover:border-wine hover:text-wine"
      >
        Next
      </button>
    </div>
  );
}
