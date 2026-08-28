import { useEffect, useState } from 'react';
import api from '../services/api';

/**
 * Loads the four taxonomy lists used across the admin panel (category, color,
 * fabric, occasion dropdowns). These endpoints are public reads, so this hook
 * works on both admin and future public pages.
 */
export default function useTaxonomyOptions() {
  const [options, setOptions] = useState({
    categories: [],
    colors: [],
    fabrics: [],
    occasions: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [categories, colors, fabrics, occasions] = await Promise.all([
          api.get('/categories'),
          api.get('/colors'),
          api.get('/fabrics'),
          api.get('/occasions'),
        ]);

        if (!cancelled) {
          setOptions({
            categories: categories.data.categories,
            colors: colors.data.colors,
            fabrics: fabrics.data.fabrics,
            occasions: occasions.data.occasions,
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { ...options, loading };
}
