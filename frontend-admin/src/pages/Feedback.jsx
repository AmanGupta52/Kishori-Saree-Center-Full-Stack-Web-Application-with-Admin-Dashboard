import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/layout/AdminLayout.jsx';
import api from '../services/api';

const statusStyles = {
  pending: 'bg-zari/15 text-zari',
  approved: 'bg-sage/15 text-sage',
  rejected: 'bg-rust/15 text-rust',
};

function Stars({ rating }) {
  return (
    <span className="text-sm text-zari">
      {'★'.repeat(rating)}
      <span className="text-border">{'★'.repeat(5 - rating)}</span>
    </span>
  );
}

export default function Feedback() {
  const [feedback, setFeedback] = useState(null);
  const [statusFilter, setStatusFilter] = useState('pending');

  const load = async () => {
    setFeedback(null);
    const { data } = await api.get('/admin/feedback', {
      params: { status: statusFilter || undefined },
    });
    setFeedback(data.feedback);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const approve = async (id) => {
    await api.put(`/admin/feedback/${id}/approve`);
    load();
  };
  const reject = async (id) => {
    await api.put(`/admin/feedback/${id}/reject`);
    load();
  };
  const remove = async (id) => {
    if (!window.confirm('Permanently delete this feedback?')) return;
    await api.delete(`/admin/feedback/${id}`);
    load();
  };

  return (
    <AdminLayout title="Feedback / Reviews">
      <div className="mb-4 flex justify-end">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-wine"
        >
          <option value="pending">Pending Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="">All</option>
        </select>
      </div>

      <div className="space-y-3">
        {feedback === null && <p className="text-sm text-ink/40">Loading…</p>}
        {feedback && feedback.length === 0 && (
          <p className="rounded-card border border-dashed border-border bg-white p-8 text-center text-sm text-ink/40">
            Nothing here right now.
          </p>
        )}

        {feedback?.map((f) => (
          <div key={f._id} className="rounded-card border border-border bg-white p-4 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <Stars rating={f.rating} />
                <p className="mt-1 text-sm font-medium text-ink">{f.name}</p>
                {f.saree?.name && <p className="text-xs text-wine">On: {f.saree.name}</p>}
              </div>
              <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyles[f.status]}`}>
                {f.status}
              </span>
            </div>

            <p className="mt-2 text-sm text-ink/70">{f.comment}</p>

            {f.photo?.url && (
              <img src={f.photo.url} alt={`Photo from ${f.name}`} className="mt-2 h-20 w-20 rounded-md object-cover" />
            )}

            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-ink/40">{new Date(f.createdAt).toLocaleString('en-IN')}</p>
              <div className="flex gap-2 text-xs">
                {f.status !== 'approved' && (
                  <button onClick={() => approve(f._id)} className="rounded-md bg-sage px-3 py-1.5 font-medium text-white hover:opacity-90">
                    Approve
                  </button>
                )}
                {f.status !== 'rejected' && (
                  <button onClick={() => reject(f._id)} className="rounded-md border border-border px-3 py-1.5 text-ink/70 hover:border-rust hover:text-rust">
                    Reject
                  </button>
                )}
                <button onClick={() => remove(f._id)} className="rounded-md border border-border px-3 py-1.5 text-rust hover:bg-rust/5">
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
