import React, { useMemo, useState } from 'react';
import ImageUploader from './ImageUploader.jsx';
import useTaxonomyOptions from '../../utils/useTaxonomyOptions.js';
import api from '../../services/api';

const initialState = {
  name: '',
  sku: '',
  category: '',
  subCategory: '',
  fabric: '',
  colors: [],
  occasions: [],
  pattern: '',
  work: '',
  shortDescription: '',
  description: '',
  originalPrice: '',
  discountType: 'percentage',
  discountValue: '',
  sareeLength: '5.5 Meter',
  blouseLength: '0.8 Meter',
  stock: '',
  status: 'active',
  featured: false,
  newArrival: false,
  bestSeller: false,
};

function calculatePreview(originalPrice, discountType, discountValue) {
  const original = Number(originalPrice) || 0;
  const value = Number(discountValue) || 0;
  let discountAmount = 0;

  if (discountType === 'percentage') discountAmount = Math.round((original * value) / 100);
  else if (discountType === 'fixed') discountAmount = value;

  const sellingPrice = Math.max(original - discountAmount, 0);
  const discountPercentage = original > 0 ? Math.round((discountAmount / original) * 100) : 0;

  return { discountAmount, sellingPrice, discountPercentage };
}

export default function SareeForm({ onSuccess }) {
  const { categories, colors, fabrics, occasions, loading: optionsLoading } = useTaxonomyOptions();
  const [form, setForm] = useState(initialState);
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const preview = useMemo(
    () => calculatePreview(form.originalPrice, form.discountType, form.discountValue),
    [form.originalPrice, form.discountType, form.discountValue]
  );

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const toggleMultiSelect = (field, id) => {
    setForm((prev) => {
      const current = prev[field];
      const next = current.includes(id) ? current.filter((v) => v !== id) : [...current, id];
      return { ...prev, [field]: next };
    });
  };

  const resetForm = () => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setForm(initialState);
    setImages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (images.length === 0) {
      setError('Please add at least one saree image.');
      return;
    }
    if (!form.category) {
      setError('Please select a category.');
      return;
    }

    const mainIndex = images.findIndex((img) => img.isMain);

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'colors' || key === 'occasions') {
        payload.append(key, JSON.stringify(value));
      } else {
        payload.append(key, value);
      }
    });
    payload.append('mainImageIndex', mainIndex >= 0 ? mainIndex : 0);
    images.forEach((img) => payload.append('images', img.file));

    setSubmitting(true);
    setProgress(0);

    try {
      const { data } = await api.post('/admin/sarees', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          if (evt.total) setProgress(Math.round((evt.loaded / evt.total) * 100));
        },
      });

      setSuccess(`"${data.saree.name}" was added successfully.`);
      resetForm();
      onSuccess?.(data.saree);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong while saving the saree.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:border-wine';
  const labelClass = 'mb-1 block text-sm font-medium text-ink/80';

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* --- Basic info --- */}
      <section className="rounded-card border border-border bg-white p-5 shadow-card">
        <h3 className="mb-4 font-display text-base font-semibold text-ink">Basic Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Saree Name *</label>
            <input
              required
              className={inputClass}
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="Banarasi Silk Saree"
            />
          </div>

          <div>
            <label className={labelClass}>Category *</label>
            <select
              required
              className={inputClass}
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
              disabled={optionsLoading}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Subcategory</label>
            <input
              className={inputClass}
              value={form.subCategory}
              onChange={(e) => update('subCategory', e.target.value)}
              placeholder="e.g. Wedding Collection"
            />
          </div>

          <div>
            <label className={labelClass}>Product Code / SKU</label>
            <input
              className={inputClass}
              value={form.sku}
              onChange={(e) => update('sku', e.target.value)}
              placeholder="KS102"
            />
          </div>

          <div>
            <label className={labelClass}>Fabric</label>
            <select
              className={inputClass}
              value={form.fabric}
              onChange={(e) => update('fabric', e.target.value)}
              disabled={optionsLoading}
            >
              <option value="">Select fabric</option>
              {fabrics.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* --- Colors & Occasions (multi-select chips) --- */}
      <section className="rounded-card border border-border bg-white p-5 shadow-card">
        <h3 className="mb-4 font-display text-base font-semibold text-ink">Colors & Occasions</h3>

        <div className="mb-4">
          <label className={labelClass}>Colors</label>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => {
              const active = form.colors.includes(c._id);
              return (
                <button
                  type="button"
                  key={c._id}
                  onClick={() => toggleMultiSelect('colors', c._id)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors ${
                    active ? 'border-wine bg-wine text-white' : 'border-border text-ink/70 hover:border-zari'
                  }`}
                >
                  <span
                    className="h-3 w-3 rounded-full border border-black/10"
                    style={{ backgroundColor: c.code }}
                  />
                  {c.name}
                </button>
              );
            })}
            {colors.length === 0 && !optionsLoading && (
              <p className="text-xs text-ink/40">No colors yet — add some under Admin → Colors.</p>
            )}
          </div>
        </div>

        <div>
          <label className={labelClass}>Occasions</label>
          <div className="flex flex-wrap gap-2">
            {occasions.map((o) => {
              const active = form.occasions.includes(o._id);
              return (
                <button
                  type="button"
                  key={o._id}
                  onClick={() => toggleMultiSelect('occasions', o._id)}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    active ? 'border-wine bg-wine text-white' : 'border-border text-ink/70 hover:border-zari'
                  }`}
                >
                  {o.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- Details --- */}
      <section className="rounded-card border border-border bg-white p-5 shadow-card">
        <h3 className="mb-4 font-display text-base font-semibold text-ink">Saree Details</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Pattern</label>
            <input
              className={inputClass}
              value={form.pattern}
              onChange={(e) => update('pattern', e.target.value)}
              placeholder="Traditional"
            />
          </div>
          <div>
            <label className={labelClass}>Work</label>
            <input
              className={inputClass}
              value={form.work}
              onChange={(e) => update('work', e.target.value)}
              placeholder="Zari Work"
            />
          </div>
          <div>
            <label className={labelClass}>Saree Length</label>
            <input
              className={inputClass}
              value={form.sareeLength}
              onChange={(e) => update('sareeLength', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Blouse Length</label>
            <input
              className={inputClass}
              value={form.blouseLength}
              onChange={(e) => update('blouseLength', e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass}>Short Description</label>
            <input
              maxLength={300}
              className={inputClass}
              value={form.shortDescription}
              onChange={(e) => update('shortDescription', e.target.value)}
              placeholder="Shown on the product card"
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass}>Full Description</label>
            <textarea
              rows={4}
              className={inputClass}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Beautiful traditional Banarasi silk saree…"
            />
          </div>
        </div>
      </section>

      {/* --- Pricing --- */}
      <section className="rounded-card border border-border bg-white p-5 shadow-card">
        <h3 className="mb-4 font-display text-base font-semibold text-ink">Pricing & Stock</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className={labelClass}>Original Price (₹) *</label>
            <input
              required
              type="number"
              min="0"
              className={inputClass}
              value={form.originalPrice}
              onChange={(e) => update('originalPrice', e.target.value)}
              placeholder="4999"
            />
          </div>

          <div>
            <label className={labelClass}>Discount Type</label>
            <select
              className={inputClass}
              value={form.discountType}
              onChange={(e) => update('discountType', e.target.value)}
            >
              <option value="none">No discount</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed amount</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Discount {form.discountType === 'fixed' ? '(₹)' : form.discountType === 'percentage' ? '(%)' : ''}
            </label>
            <input
              type="number"
              min="0"
              disabled={form.discountType === 'none'}
              className={`${inputClass} disabled:bg-silk disabled:text-ink/30`}
              value={form.discountValue}
              onChange={(e) => update('discountValue', e.target.value)}
              placeholder="0"
            />
          </div>

          <div>
            <label className={labelClass}>Stock Quantity</label>
            <input
              type="number"
              min="0"
              className={inputClass}
              value={form.stock}
              onChange={(e) => update('stock', e.target.value)}
              placeholder="12"
            />
          </div>
        </div>

        {/* Live-calculated final price */}
        <div className="mt-4 flex flex-wrap items-center gap-4 rounded-md bg-zari-light/25 px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-ink/50">Final Selling Price</p>
            <p className="font-display text-2xl font-semibold text-wine">
              ₹{preview.sellingPrice.toLocaleString('en-IN')}
            </p>
          </div>
          {preview.discountAmount > 0 && (
            <>
              <div className="text-sm text-ink/50 line-through">
                ₹{Number(form.originalPrice || 0).toLocaleString('en-IN')}
              </div>
              <div className="rounded-full bg-sage px-2.5 py-1 text-xs font-semibold text-white">
                {preview.discountPercentage}% OFF
              </div>
            </>
          )}
        </div>
      </section>

      {/* --- Images --- */}
      <section className="rounded-card border border-border bg-white p-5 shadow-card">
        <h3 className="mb-4 font-display text-base font-semibold text-ink">Images</h3>
        <ImageUploader
          files={images}
          onChange={setImages}
          uploading={submitting}
          uploadProgress={progress}
        />
      </section>

      {/* --- Flags & status --- */}
      <section className="rounded-card border border-border bg-white p-5 shadow-card">
        <h3 className="mb-4 font-display text-base font-semibold text-ink">Visibility</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Status</label>
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) => update('status', e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="coming-soon">Coming Soon</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-5 sm:col-span-1">
            {[
              ['featured', 'Featured'],
              ['newArrival', 'New Arrival'],
              ['bestSeller', 'Best Seller'],
            ].map(([field, label]) => (
              <label key={field} className="flex items-center gap-2 text-sm text-ink/80">
                <input
                  type="checkbox"
                  checked={form[field]}
                  onChange={(e) => update(field, e.target.checked)}
                  className="h-4 w-4 rounded border-border text-wine focus:ring-wine"
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      </section>

      {error && <p className="rounded-md bg-rust/10 px-4 py-3 text-sm text-rust">{error}</p>}
      {success && <p className="rounded-md bg-sage/10 px-4 py-3 text-sm text-sage">{success}</p>}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={resetForm}
          disabled={submitting}
          className="rounded-md border border-border px-4 py-2.5 text-sm text-ink/70 hover:border-rust hover:text-rust disabled:opacity-50"
        >
          Clear Form
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-wine px-6 py-2.5 text-sm font-medium text-silk transition-colors hover:bg-wine-dark disabled:opacity-60"
        >
          {submitting ? `Saving… ${progress}%` : 'Add Saree'}
        </button>
      </div>
    </form>
  );
}
