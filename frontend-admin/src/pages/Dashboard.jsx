import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/layout/AdminLayout.jsx';
import api from '../services/api';

const statCards = [
  { key: 'totalSarees', label: 'Sarees' },
  { key: 'totalCategories', label: 'Categories' },
  { key: 'totalEnquiries', label: 'Enquiries' },
  { key: 'inStockCount', label: 'In Stock' },
  { key: 'outOfStockCount', label: 'Out of Stock' },
  { key: 'pendingFeedback', label: 'Pending Feedback' },
  { key: 'totalViews', label: 'Total Views' },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/admin/dashboard')
      .then(({ data }) => setStats(data.stats))
      .catch(() => setError('Could not load dashboard stats.'));
  }, []);

  return (
    <AdminLayout title="Dashboard">
      {error && <p className="mb-4 text-sm text-rust">{error}</p>}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.key}
            className="overflow-hidden rounded-card border border-border bg-white shadow-card"
          >
            <div className="zari-border" />
            <div className="px-5 py-4">
              <p className="text-xs uppercase tracking-wide text-ink/50">{card.label}</p>
              <p className="mt-1 font-display text-3xl font-semibold text-ink">
                {stats ? stats[card.key] ?? '—' : '···'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
