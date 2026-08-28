import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/layout/AdminLayout.jsx';
import api from '../services/api';

const statusStyles = {
  new: 'bg-zari/15 text-zari',
  contacted: 'bg-sage/15 text-sage',
  closed: 'bg-ink/10 text-ink/50',
};

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const load = async () => {
    setEnquiries(null);
    const { data } = await api.get('/admin/enquiries', {
      params: { status: statusFilter || undefined },
    });
    setEnquiries(data.enquiries);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const updateStatus = async (id, status) => {
    await api.put(`/admin/enquiries/${id}`, { status });
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;
    await api.delete(`/admin/enquiries/${id}`);
    load();
  };

  return (
    <AdminLayout title="Enquiries">
      <div className="mb-4 flex justify-end">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-wine"
        >
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="space-y-3">
        {enquiries === null && <p className="text-sm text-ink/40">Loading…</p>}
        {enquiries && enquiries.length === 0 && (
          <p className="rounded-card border border-dashed border-border bg-white p-8 text-center text-sm text-ink/40">
            No enquiries yet.
          </p>
        )}

        {enquiries?.map((enq) => (
          <div key={enq._id} className="rounded-card border border-border bg-white p-4 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-ink">{enq.name}</p>
                <p className="text-xs text-ink/50">
                  {enq.mobile} {enq.email && `· ${enq.email}`}
                </p>
                {enq.saree?.name && <p className="mt-1 text-xs text-wine">Re: {enq.saree.name}</p>}
              </div>
              <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyles[enq.status]}`}>
                {enq.status}
              </span>
            </div>

            {enq.message && <p className="mt-2 text-sm text-ink/70">{enq.message}</p>}

            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-ink/40">{new Date(enq.createdAt).toLocaleString('en-IN')}</p>
              <div className="flex items-center gap-2 text-xs">
                <select
                  value={enq.status}
                  onChange={(e) => updateStatus(enq._id, e.target.value)}
                  className="rounded-md border border-border px-2 py-1 outline-none focus:border-wine"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
                <a
                  href={`tel:${enq.mobile}`}
                  className="rounded-md border border-border px-2 py-1 text-ink/70 hover:border-wine hover:text-wine"
                >
                  Call
                </a>
                <button onClick={() => handleDelete(enq._id)} className="text-rust hover:underline">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
