import React from 'react';
import { Link } from 'react-router-dom';

export default function SareeCard({ saree }) {
  const mainImage = saree.images?.find((img) => img.isMain) || saree.images?.[0];
  const discountPct =
    saree.originalPrice > 0 ? Math.round((saree.discountAmount / saree.originalPrice) * 100) : 0;

  return (
    <Link
      to={`/saree/${saree.slug}`}
      className="group block overflow-hidden rounded-card border border-border bg-white shadow-card transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-silk">
        {mainImage ? (
          <img
            src={mainImage.url}
            alt={saree.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink/30">No image</div>
        )}

        {discountPct > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-wine px-2 py-1 text-[11px] font-semibold text-silk">
            {discountPct}% OFF
          </span>
        )}
        {saree.status === 'out-of-stock' && (
          <span className="absolute inset-x-0 bottom-0 bg-ink/80 py-1.5 text-center text-[11px] font-semibold uppercase tracking-wide text-white">
            Out of Stock
          </span>
        )}
      </div>

      <div className="p-3.5">
        <p className="line-clamp-2 text-sm font-medium text-ink">{saree.name}</p>

        <div className="mt-1.5 flex items-center gap-2">
          <span className="font-display text-base font-semibold text-wine">
            ₹{saree.sellingPrice?.toLocaleString('en-IN')}
          </span>
          {saree.discountAmount > 0 && (
            <span className="text-xs text-ink/40 line-through">
              ₹{saree.originalPrice?.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        <div className="mt-1.5 flex flex-wrap gap-x-3 text-xs text-ink/50">
          {saree.fabric?.name && <span>{saree.fabric.name}</span>}
          {saree.colors?.[0]?.name && <span>{saree.colors[0].name}</span>}
        </div>
      </div>
    </Link>
  );
}
