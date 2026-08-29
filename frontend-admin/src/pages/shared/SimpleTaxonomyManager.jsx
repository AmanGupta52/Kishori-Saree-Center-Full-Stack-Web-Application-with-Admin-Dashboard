import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout.jsx';
import Modal from '../../components/common/Modal.jsx';
import api from '../../services/api';

/**
 * Generic list + add/edit/delete UI for simple "name only" taxonomy
 * collections (Fabrics, Occasions). Pass the admin/public API paths and
 * a display label; everything else is shared.
 */
export default function SimpleTaxonomyManager({ title, publicPath, adminPath, singular }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    const { data } = await api.get(publicPath);
    setItems(data[Object.keys(data).find((k) => Array.isArray(data[k]))]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicPath]);

  const openNew = () => {
    setEditing({});
    setName('');
    setError('');
  };

  const openEdit = (item) => {
    setEditing(item);
    setName(item.name);
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing._id) {
        await api.put(`${adminPath}/${editing._id}`, { name });
      } else {
        await api.post(adminPath, { name });
      }
      setEditing(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || `Could not save ${singular.toLowerCase()}.`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, itemName) => {
    if (!window.confirm(`Delete "${itemName}"?`)) return;
    await api.delete(`${adminPath}/${id}`);
    load();
  };

  return (
    <AdminLayout title={title}>
      <div className="mb-4 flex justify-end">
        <button
          onClick={openNew}
          className="rounded-md bg-wine px-4 py-2 text-sm font-medium text-silk hover:bg-wine-dark"
        >
          + Add {singular}
        </button>
      </div>

      <div className="overflow-x-auto rounded-card border border-border bg-white shadow-card">
        <table className="w-full min-w-[360px] text-left text-sm">
          <thead className="border-b border-border bg-silk/60 text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-4 py-3">{singular}</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={2} className="px-4 py-8 text-center text-ink/40">Loading…</td></tr>
            )}
            {!loading && items.length === 0 && (
              <tr><td colSpan={2} className="px-4 py-8 text-center text-ink/40">None added yet.</td></tr>
            )}
            {items.map((item) => (
              <tr key={item._id} className="border-b border-border last:border-0 hover:bg-silk/40">
                <td className="px-4 py-3 font-medium text-ink">{item.name}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3 text-xs">
                    <button onClick={() => openEdit(item)} className="text-wine hover:underline">Edit</button>
                    <button onClick={() => handleDelete(item._id, item.name)} className="text-rust hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing !== null && (
        <Modal title={editing._id ? `Edit ${singular}` : `Add ${singular}`} onClose={() => setEditing(null)}>
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink/80">Name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-wine"
                autoFocus
              />
            </div>
            {error && <p className="rounded-md bg-rust/10 px-3 py-2 text-sm text-rust">{error}</p>}
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-md bg-wine px-4 py-2.5 text-sm font-medium text-silk hover:bg-wine-dark disabled:opacity-60"
            >
              {saving ? 'Saving…' : `Save ${singular}`}
            </button>
          </form>
        </Modal>
      )}
    </AdminLayout>
  );
}
