import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout.jsx';
import api from '../../services/api';

/**
 * Lists sarees currently marked with a given boolean flag (featured,
 * newArrival, bestSeller) and lets the admin untoggle them in place.
 * Adding a saree to one of these groups happens from the Add/Edit Saree
 * form's checkboxes — this page is for reviewing and removing.
 */
export default function SareeFlagList({ title, flagField, emptyHint }) {
  const [sarees, setSarees] = useState(null);

  const load = async () => {
    setSarees(null);
    const { data } = await api.get('/admin/sarees', { params: { limit: 100 } });
    setSarees(data.sarees.filter((s) => s[flagField]));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flagField]);

  const toggleOff = async (id) => {
    await api.put(`/admin/sarees/${id}`, { [flagField]: false });
    load();
  };

  return (
    <AdminLayout title={title}>
      {sarees === null && <p className="text-sm text-ink/40">Loading…</p>}

      {sarees && sarees.length === 0 && (
        <div className="rounded-card border border-dashed border-border bg-white p-8 text-center text-sm text-ink/40">
          {emptyHint}
        </div>
      )}

      {sarees && sarees.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {sarees.map((saree) => {
            const mainImage = saree.images?.find((img) => img.isMain) || saree.images?.[0];
            return (
              <div key={saree._id} className="overflow-hidden rounded-card border border-border bg-white shadow-card">
                {mainImage && (
                  <img src={mainImage.url} alt={saree.name} className="h-36 w-full object-cover" />
                )}
                <div className="p-3">
                  <p className="line-clamp-2 text-sm font-medium text-ink">{saree.name}</p>
                  <p className="mt-1 text-sm text-wine">₹{saree.sellingPrice?.toLocaleString('en-IN')}</p>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <Link to="/sarees" className="text-ink/50 hover:text-wine">
                      View in list
                    </Link>
                    <button onClick={() => toggleOff(saree._id)} className="text-rust hover:underline">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
