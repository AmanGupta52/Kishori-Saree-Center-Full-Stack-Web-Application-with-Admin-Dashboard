import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/layout/AdminLayout.jsx';
import Modal from '../components/common/Modal.jsx';
import api from '../services/api';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {...} = editing
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    const { data } = await api.get('/categories');
    setCategories(data.categories);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditing({});
    setName('');
    setIsActive(true);
    setImageFile(null);
    setError('');
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setName(cat.name);
    setIsActive(cat.isActive);
    setImageFile(null);
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = new FormData();
    payload.append('name', name);
    payload.append('isActive', isActive);
    if (imageFile) payload.append('image', imageFile);

    try {
      if (editing._id) {
        await api.put(`/admin/categories/${editing._id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/admin/categories', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setEditing(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save category.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, catName) => {
    if (!window.confirm(`Delete "${catName}"? Sarees in this category will keep their reference.`)) return;
    await api.delete(`/admin/categories/${id}`);
    load();
  };

  return (
    <AdminLayout title="Categories">
      <div className="mb-4 flex justify-end">
        <button
          onClick={openNew}
          className="rounded-md bg-wine px-4 py-2 text-sm font-medium text-silk hover:bg-wine-dark"
        >
          + Add Category
        </button>
      </div>

      <div className="overflow-hidden rounded-card border border-border bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-silk/60 text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-ink/40">Loading…</td></tr>
            )}
            {!loading && categories.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-ink/40">No categories yet.</td></tr>
            )}
            {categories.map((cat) => (
              <tr key={cat._id} className="border-b border-border last:border-0 hover:bg-silk/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-md border border-border bg-silk">
                      {cat.image?.url && <img src={cat.image.url} alt={cat.name} className="h-full w-full object-cover" />}
                    </div>
                    <span className="font-medium text-ink">{cat.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${cat.isActive ? 'bg-sage/15 text-sage' : 'bg-ink/10 text-ink/50'}`}>
                    {cat.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3 text-xs">
                    <button onClick={() => openEdit(cat)} className="text-wine hover:underline">Edit</button>
                    <button onClick={() => handleDelete(cat._id, cat.name)} className="text-rust hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing !== null && (
        <Modal title={editing._id ? 'Edit Category' : 'Add Category'} onClose={() => setEditing(null)}>
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink/80">Name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-wine"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink/80">Icon Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="text-sm text-ink/60"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-ink/80">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-border text-wine focus:ring-wine"
              />
              Active (visible on the storefront)
            </label>

            {error && <p className="rounded-md bg-rust/10 px-3 py-2 text-sm text-rust">{error}</p>}

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-md bg-wine px-4 py-2.5 text-sm font-medium text-silk hover:bg-wine-dark disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save Category'}
            </button>
          </form>
        </Modal>
      )}
    </AdminLayout>
  );
}
