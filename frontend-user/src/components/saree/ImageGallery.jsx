import React, { useState } from 'react';

export default function ImageGallery({ images = [], sareeName }) {
  const sorted = [...images].sort((a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0));
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  if (sorted.length === 0) {
    return <div className="aspect-square rounded-card bg-silk" />;
  }

  const active = sorted[activeIndex];

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {/* Thumbnails */}
      <div className="scrollbar-thin flex gap-2 overflow-x-auto sm:w-20 sm:flex-col sm:overflow-y-auto">
        {sorted.map((img, idx) => (
          <button
            key={img.publicId}
            onClick={() => setActiveIndex(idx)}
            className={`h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 ${
              idx === activeIndex ? 'border-wine' : 'border-border'
            }`}
          >
            <img src={img.url} alt={`${sareeName} thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="relative flex-1">
        <button
          onClick={() => setFullscreen(true)}
          className="block aspect-square w-full overflow-hidden rounded-card border border-border bg-silk"
        >
          <img src={active.url} alt={sareeName} className="h-full w-full object-cover" />
        </button>
        <button
          onClick={() => setFullscreen(true)}
          className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-ink shadow-card"
        >
          🔍 Zoom
        </button>
      </div>

      {/* Fullscreen viewer */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setFullscreen(false)}
        >
          <button
            onClick={() => setFullscreen(false)}
            className="absolute right-4 top-4 text-2xl text-white"
            aria-label="Close"
          >
            ✕
          </button>
          <img
            src={active.url}
            alt={sareeName}
            className="max-h-full max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
