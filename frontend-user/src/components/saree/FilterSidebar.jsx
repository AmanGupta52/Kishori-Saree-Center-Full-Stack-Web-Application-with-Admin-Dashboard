import React from 'react';
import useTaxonomyOptions from '../../utils/useTaxonomyOptions.js';

const priceRanges = [
  { label: 'Under ₹1,000', min: 0, max: 1000 },
  { label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
  { label: '₹2,000 – ₹5,000', min: 2000, max: 5000 },
  { label: '₹5,000 – ₹10,000', min: 5000, max: 10000 },
  { label: 'Above ₹10,000', min: 10000, max: null },
];

const discountOptions = [10, 20, 30, 50];

function Section({ title, children }) {
  return (
    <div className="border-b border-border py-4 first:pt-0 last:border-0">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink/40">{title}</p>
      {children}
    </div>
  );
}

export default function FilterSidebar({ filters, onChange, onClear }) {
  const { categories, colors, fabrics, occasions, loading } = useTaxonomyOptions();

  const isPriceActive = (range) =>
    String(filters.minPrice || '') === String(range.min) &&
    String(filters.maxPrice || '') === String(range.max ?? '');

  const setPriceRange = (range) => {
    if (isPriceActive(range)) {
      onChange({ ...filters, minPrice: '', maxPrice: '' });
    } else {
      onChange({ ...filters, minPrice: range.min, maxPrice: range.max ?? '' });
    }
  };

  const toggleValue = (field, id) => {
    const current = filters[field] === id ? '' : id;
    onChange({ ...filters, [field]: current });
  };

  if (loading) {
    return <p className="text-sm text-ink/40">Loading filters…</p>;
  }

  return (
    <div className="rounded-card border border-border bg-white p-5 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-display text-base font-semibold text-ink">Filters</p>
        <button onClick={onClear} className="text-xs text-wine hover:underline">
          Clear all
        </button>
      </div>

      <Section title="Category">
        <div className="space-y-2">
          {categories.map((c) => (
            <label key={c._id} className="flex items-center gap-2 text-sm text-ink/70">
              <input
                type="radio"
                name="category"
                checked={filters.category === c._id}
                onChange={() => toggleValue('category', c._id)}
                className="h-4 w-4 border-border text-wine focus:ring-wine"
              />
              {c.name}
            </label>
          ))}
        </div>
      </Section>

      <Section title="Price">
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <label key={range.label} className="flex items-center gap-2 text-sm text-ink/70">
              <input
                type="radio"
                name="price"
                checked={isPriceActive(range)}
                onChange={() => setPriceRange(range)}
                className="h-4 w-4 border-border text-wine focus:ring-wine"
              />
              {range.label}
            </label>
          ))}
        </div>
      </Section>

      <Section title="Color">
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => (
            <button
              key={c._id}
              onClick={() => toggleValue('color', c._id)}
              title={c.name}
              className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                filters.color === c._id ? 'border-wine' : 'border-transparent'
              }`}
              style={{ backgroundColor: c.code }}
            />
          ))}
        </div>
      </Section>

      <Section title="Fabric">
        <div className="space-y-2">
          {fabrics.map((f) => (
            <label key={f._id} className="flex items-center gap-2 text-sm text-ink/70">
              <input
                type="radio"
                name="fabric"
                checked={filters.fabric === f._id}
                onChange={() => toggleValue('fabric', f._id)}
                className="h-4 w-4 border-border text-wine focus:ring-wine"
              />
              {f.name}
            </label>
          ))}
        </div>
      </Section>

      <Section title="Occasion">
        <div className="space-y-2">
          {occasions.map((o) => (
            <label key={o._id} className="flex items-center gap-2 text-sm text-ink/70">
              <input
                type="radio"
                name="occasion"
                checked={filters.occasion === o._id}
                onChange={() => toggleValue('occasion', o._id)}
                className="h-4 w-4 border-border text-wine focus:ring-wine"
              />
              {o.name}
            </label>
          ))}
        </div>
      </Section>

      <Section title="Discount">
        <div className="flex flex-wrap gap-2">
          {discountOptions.map((d) => (
            <button
              key={d}
              onClick={() => onChange({ ...filters, minDiscount: filters.minDiscount === d ? '' : d })}
              className={`rounded-full border px-3 py-1 text-xs ${
                filters.minDiscount === d
                  ? 'border-wine bg-wine text-white'
                  : 'border-border text-ink/70 hover:border-zari'
              }`}
            >
              {d}%+
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
}
