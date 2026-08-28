import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import SareeGrid from './SareeGrid.jsx';
import Loader from '../common/Loader.jsx';

export default function RelatedSarees({ slug }) {
  const [sarees, setSarees] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api.get(`/sarees/${slug}/related`).then(({ data }) => {
      if (!cancelled) setSarees(data.sarees);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (sarees === null) return <Loader label="Finding similar sarees…" />;
  if (sarees.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-4 font-display text-xl font-semibold text-ink">You May Also Like</h2>
      <SareeGrid sarees={sarees} />
    </section>
  );
}
