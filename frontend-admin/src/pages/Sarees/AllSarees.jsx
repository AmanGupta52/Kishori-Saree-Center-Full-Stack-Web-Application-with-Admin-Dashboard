import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout.jsx';
import api from '../../services/api';

const statusStyles = {
  active: 'bg-sage/15 text-sage',
  inactive: 'bg-ink/10 text-ink/50',
  'out-of-stock': 'bg-rust/15 text-rust',
  'coming-soon': 'bg-zari/15 text-zari',
};

export default function AllSarees() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sarees, setSarees] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const status = searchParams.get('status') || '';

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/sarees', {
        params: { search: search || undefined, status: status || undefined },
      });
      setSarees(data.sarees);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    load();
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This also removes its images from Cloudinary.`)) return;
    await api.delete(`/admin/sarees/${id}`);
    load();
  };

  const handleDuplicate = async (id) => {
    await api.post(`/admin/sarees/${id}/duplicate`);
    load();
  };

  return (
    <AdminLayout title="All Sarees">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sarees…"
            className="w-64 rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-wine"
          />
          <button
            type="submit"
            className="rounded-md border border-border px-3 py-2 text-sm text-ink/70 hover:border-wine hover:text-wine"
          >
            Search
          </button>
          <select
            value={status}
            onChange={(e) => setSearchParams(e.target.value ? { status: e.target.value } : {})}
            className="rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-wine"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="out-of-stock">Out of Stock</option>
            <option value="coming-soon">Coming Soon</option>
          </select>
        </form>

        <Link
          to="/sarees/add"
          className="rounded-md bg-wine px-4 py-2 text-sm font-medium text-silk hover:bg-wine-dark"
        >
          + Add Saree
        </Link>
      </div>

      <div className="overflow-hidden rounded-card border border-border bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-silk/60 text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-4 py-3">Saree</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Flags</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink/40">
                  Loading…
                </td>
              </tr>
            )}

            {!loading && sarees.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink/40">
                  No sarees found.
                </td>
              </tr>
            )}

            {sarees.map((saree) => {
              const mainImage = saree.images?.find((img) => img.isMain) || saree.images?.[0];
              return (
                <tr key={saree._id} className="border-b border-border last:border-0 hover:bg-silk/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {mainImage && (
                        <img
                          src={mainImage.url}
                          alt={saree.name}
                          className="h-12 w-12 rounded-md border border-border object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-ink">{saree.name}</p>
                        <p className="text-xs text-ink/40">{saree.category?.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-wine">₹{saree.sellingPrice?.toLocaleString('en-IN')}</p>
                    {saree.discountAmount > 0 && (
                      <p className="text-xs text-ink/40 line-through">
                        ₹{saree.originalPrice?.toLocaleString('en-IN')}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">{saree.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyles[saree.status]}`}>
                      {saree.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink/50">
                    {[saree.featured && 'Featured', saree.newArrival && 'New', saree.bestSeller && 'Best Seller']
                      .filter(Boolean)
                      .join(' · ') || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3 text-xs">
                      <button onClick={() => handleDuplicate(saree._id)} className="text-ink/60 hover:text-wine">
                        Duplicate
                      </button>
                      <button
                        onClick={() => handleDelete(saree._id, saree.name)}
                        className="text-rust hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!loading && (
        <p className="mt-3 text-xs text-ink/40">
          Showing {sarees.length} of {total} sarees
        </p>
      )}
    </AdminLayout>
  );
}
