import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout.jsx';
import SareeGrid from '../components/saree/SareeGrid.jsx';
import Loader from '../components/common/Loader.jsx';
import useTaxonomyOptions from '../utils/useTaxonomyOptions.js';
import api from '../services/api';

export default function CategoryPage() {
  const { slug } = useParams();
  const { categories, loading: categoriesLoading } = useTaxonomyOptions();
  const [sarees, setSarees] = useState(null);

  const category = categories.find((c) => c.slug === slug);

  useEffect(() => {
    if (!category) return;
    setSarees(null);
    api.get('/sarees', { params: { category: category._id, limit: 24 } }).then(({ data }) => {
      setSarees(data.sarees);
    });
  }, [category]);

  return (
    <PageLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="mb-1 font-display text-2xl font-semibold text-ink">
          {category ? category.name : 'Category'}
        </h1>
        <p className="mb-6 text-sm text-ink/50">Browse our {category?.name?.toLowerCase() || ''} collection</p>

        {categoriesLoading || sarees === null ? <Loader /> : <SareeGrid sarees={sarees} />}
      </div>
    </PageLayout>
  );
}
