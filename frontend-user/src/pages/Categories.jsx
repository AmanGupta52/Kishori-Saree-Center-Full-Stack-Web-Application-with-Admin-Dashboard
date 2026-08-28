import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout.jsx';
import Loader from '../components/common/Loader.jsx';
import useTaxonomyOptions from '../utils/useTaxonomyOptions.js';

export default function Categories() {
  const { categories, loading } = useTaxonomyOptions();

  return (
    <PageLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="mb-6 font-display text-2xl font-semibold text-ink">All Categories</h1>

        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/category/${cat.slug}`}
                className="group overflow-hidden rounded-card border border-border bg-white shadow-card transition-shadow hover:shadow-lg"
              >
                <div className="flex aspect-[4/3] items-center justify-center bg-silk">
                  {cat.image?.url ? (
                    <img
                      src={cat.image.url}
                      alt={cat.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span className="font-display text-3xl text-zari">{cat.name[0]}</span>
                  )}
                </div>
                <p className="px-3 py-2.5 text-sm font-medium text-ink">{cat.name}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
