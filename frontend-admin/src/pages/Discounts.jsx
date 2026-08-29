import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/layout/AdminLayout.jsx';
import api from '../services/api';

function DiscountRow({ saree, onSaved }) {
  const [discountType, setDiscountType] = useState(saree.discountType);
  const [discountValue, setDiscountValue] = useState(saree.discountValue);
  const [saving, setSaving] = useState(false);

  const discountPct =
    saree.originalPrice > 0 ? Math.round((saree.discountAmount / saree.originalPrice) * 100) : 0;

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/admin/sarees/${saree._id}`, { discountType, discountValue });
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  const mainImage = saree.images?.find((img) => img.isMain) || saree.images?.[0];

  return (
    <tr className="border-b border-border last:border-0 hover:bg-silk/40">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {mainImage && <img src={mainImage.url} alt={saree.name} className="h-11 w-11 rounded-md border border-border object-cover" />}
          <span className="font-medium text-ink">{saree.name}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-ink/60">₹{saree.originalPrice?.toLocaleString('en-IN')}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
            className="rounded-md border border-border px-2 py-1.5 text-xs outline-none focus:border-wine"
          >
            <option value="none">None</option>
            <option value="percentage">%</option>
            <option value="fixed">₹</option>
          </select>
          <input
            type="number"
            min="0"
            disabled={discountType === 'none'}
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            className="w-20 rounded-md border border-border px-2 py-1.5 text-xs outline-none focus:border-wine disabled:bg-silk"
          />
        </div>
      </td>
      <td className="px-4 py-3 font-medium text-wine">
        ₹{saree.sellingPrice?.toLocaleString('en-IN')}
        {discountPct > 0 && <span className="ml-2 rounded-full bg-sage/15 px-2 py-0.5 text-xs text-sage">{discountPct}% OFF</span>}
      </td>
      <td className="px-4 py-3 text-right">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-md border border-border px-3 py-1.5 text-xs text-ink/70 hover:border-wine hover:text-wine disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Update'}
        </button>
      </td>
    </tr>
  );
}

export default function Discounts() {
  const [sarees, setSarees] = useState(null);

  const load = async () => {
    setSarees(null);
    const { data } = await api.get('/admin/sarees', { params: { limit: 100 } });
    const sorted = [...data.sarees].sort((a, b) => b.discountAmount - a.discountAmount);
    setSarees(sorted);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminLayout title="Discounts">
      <p className="mb-4 text-sm text-ink/50">
        All sarees, sorted by current discount. Adjust the discount type and value inline — the
        selling price recalculates automatically.
      </p>

      <div className="overflow-x-auto rounded-card border border-border bg-white shadow-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-silk/60 text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-4 py-3">Saree</th>
              <th className="px-4 py-3">Original Price</th>
              <th className="px-4 py-3">Discount</th>
              <th className="px-4 py-3">Selling Price</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {sarees === null && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-ink/40">Loading…</td></tr>
            )}
            {sarees && sarees.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-ink/40">No sarees yet.</td></tr>
            )}
            {sarees?.map((saree) => (
              <DiscountRow key={saree._id} saree={saree} onSaved={load} />
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
