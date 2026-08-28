import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout.jsx';
import api from '../../services/api';

const fields = [
  ['shopName', 'Shop Name'],
  ['tagline', 'Tagline'],
  ['phone', 'Phone Number'],
  ['whatsapp', 'WhatsApp Number (digits only, with country code)'],
  ['email', 'Contact Email'],
  ['city', 'City'],
  ['address', 'Full Address'],
  ['instagram', 'Instagram URL'],
  ['facebook', 'Facebook URL'],
];

export default function ShopInformation() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/settings').then(({ data }) => setForm(data.settings));
  }, []);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const { data } = await api.put('/admin/settings', form);
      setForm(data.settings);
      setMessage('Shop information updated.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (!form) {
    return (
      <AdminLayout title="Shop Information">
        <p className="text-sm text-ink/40">Loading…</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Shop Information">
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 rounded-card border border-border bg-white p-5 shadow-card">
        {fields.map(([field, label]) => (
          <div key={field}>
            <label className="mb-1 block text-sm font-medium text-ink/80">{label}</label>
            {field === 'address' ? (
              <textarea
                rows={2}
                value={form[field] || ''}
                onChange={(e) => update(field, e.target.value)}
                className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-wine"
              />
            ) : (
              <input
                value={form[field] || ''}
                onChange={(e) => update(field, e.target.value)}
                className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-wine"
              />
            )}
          </div>
        ))}

        {error && <p className="rounded-md bg-rust/10 px-3 py-2 text-sm text-rust">{error}</p>}
        {message && <p className="rounded-md bg-sage/10 px-3 py-2 text-sm text-sage">{message}</p>}

        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-wine px-5 py-2.5 text-sm font-medium text-silk hover:bg-wine-dark disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </AdminLayout>
  );
}
