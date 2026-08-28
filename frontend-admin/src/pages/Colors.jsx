import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/layout/AdminLayout.jsx';
import Modal from '../components/common/Modal.jsx';
import api from '../services/api';

export default function Colors() {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');
  const [code, setCode] = useState('#B4462F');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    const { data } = await api.get('/colors');
    setColors(data.colors);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditing({});
    setName('');
    setCode('#B4462F');
    setError('');
  };

  const openEdit = (color) => {
    setEditing(color);
    setName(color.name);
    setCode(color.code);
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing._id) {
        await api.put(`/admin/colors/${editing._id}`, { name, code });
      } else {
        await api.post('/admin/colors', { name, code });
      }
      setEditing(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save color.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, colorName) => {
    if (!window.confirm(`Delete "${colorName}"?`)) return;
    await api.delete(`/admin/colors/${id}`);
    load();
  };

  return (
    <AdminLayout title="Colors">
      <div className="mb-4 flex justify-end">
        <button
          onClick={openNew}
          className="rounded-md bg-wine px-4 py-2 text-sm font-medium text-silk hover:bg-wine-dark"
        >
          + Add Color
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {loading && <p className="text-sm text-ink/40">Loading…</p>}
        {!loading && colors.length === 0 && <p className="text-sm text-ink/40">No colors yet.</p>}
        {colors.map((color) => (
          <div
            key={color._id}
            className="flex items-center gap-3 rounded-card border border-border bg-white p-3 shadow-card"
          >
            <span
              className="h-9 w-9 shrink-0 rounded-full border border-black/10"
              style={{ backgroundColor: color.code }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{color.name}</p>
              <p className="text-xs text-ink/40">{color.code}</p>
            </div>
            <div className="flex flex-col gap-1 text-xs">
              <button onClick={() => openEdit(color)} className="text-wine hover:underline">Edit</button>
              <button onClick={() => handleDelete(color._id, color.name)} className="text-rust hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editing !== null && (
        <Modal title={editing._id ? 'Edit Color' : 'Add Color'} onClose={() => setEditing(null)}>
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink/80">Name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Maroon"
                className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-wine"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink/80">Color Code</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="h-10 w-14 cursor-pointer rounded-md border border-border"
                />
                <input
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="#800000"
                  className="flex-1 rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-wine"
                />
              </div>
            </div>

            {error && <p className="rounded-md bg-rust/10 px-3 py-2 text-sm text-rust">{error}</p>}

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-md bg-wine px-4 py-2.5 text-sm font-medium text-silk hover:bg-wine-dark disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save Color'}
            </button>
          </form>
        </Modal>
      )}
    </AdminLayout>
  );
}
