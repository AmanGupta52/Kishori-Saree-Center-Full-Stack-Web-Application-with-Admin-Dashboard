import React from 'react';

export default function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-card border border-border bg-white shadow-card">
        <div className="zari-border" />
        <div className="flex items-center justify-between px-5 pt-4">
          <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
          <button onClick={onClose} className="text-xl leading-none text-ink/40 hover:text-ink">
            ×
          </button>
        </div>
        <div className="px-5 pb-5 pt-3">{children}</div>
      </div>
    </div>
  );
}
