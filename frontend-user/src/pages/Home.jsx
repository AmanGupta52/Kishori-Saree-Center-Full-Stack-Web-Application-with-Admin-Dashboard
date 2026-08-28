import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout.jsx';
import SareeGrid from '../components/saree/SareeGrid.jsx';
import Loader from '../components/common/Loader.jsx';
import useTaxonomyOptions from '../utils/useTaxonomyOptions.js';
import api from '../services/api';

function HomeSection({ title, subtitle, children, viewAllHref }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">{title}</h2>
          {subtitle && <p className="text-sm text-ink/50">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link to={viewAllHref} className="text-sm font-medium text-wine hover:underline">
            View All →
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

export default function Home() {
  const { categories, loading: categoriesLoading } = useTaxonomyOptions();
  const [newArrivals, setNewArrivals] = useState(null);
  const [featured, setFeatured] = useState(null);
  const [bestSellers, setBestSellers] = useState(null);
  const [onSale, setOnSale] = useState(null);

  useEffect(() => {
    api.get('/sarees', { params: { newArrival: true, limit: 4 } }).then(({ data }) => setNewArrivals(data.sarees));
    api.get('/sarees', { params: { featured: true, limit: 4 } }).then(({ data }) => setFeatured(data.sarees));
    api.get('/sarees', { params: { bestSeller: true, limit: 4 } }).then(({ data }) => setBestSellers(data.sarees));
    api.get('/sarees', { params: { minDiscount: 20, sort: 'discount', limit: 4 } }).then(({ data }) => setOnSale(data.sarees));
  }, []);

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-wine-fade">
        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center sm:px-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-zari-light">
            Kishori Saree Center
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight text-silk sm:text-5xl">
            Beautiful Sarees
          </h1>
          <p className="mt-3 max-w-md text-silk/80">Traditional • Modern • Elegant</p>
          <Link
            to="/sarees"
            className="mt-7 rounded-md bg-zari px-7 py-3 text-sm font-medium text-ink transition-transform hover:scale-105"
          >
            Explore Sarees
          </Link>
        </div>
        <div className="zari-border" />
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h2 className="mb-5 font-display text-2xl font-semibold text-ink">Shop by Category</h2>
        {categoriesLoading ? (
          <Loader label="Loading categories…" />
        ) : (
          <div className="scrollbar-thin flex gap-4 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/category/${cat.slug}`}
                className="flex w-24 shrink-0 flex-col items-center gap-2 text-center"
              >
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-border bg-white">
                  {cat.image?.url ? (
                    <img src={cat.image.url} alt={cat.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-display text-lg text-zari">{cat.name[0]}</span>
                  )}
                </div>
                <span className="text-xs text-ink/70">{cat.name}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <HomeSection title="New Arrivals" viewAllHref="/sarees?newArrival=true">
        {newArrivals ? <SareeGrid sarees={newArrivals} /> : <Loader />}
      </HomeSection>

      <HomeSection title="Featured Sarees" viewAllHref="/sarees?featured=true">
        {featured ? <SareeGrid sarees={featured} /> : <Loader />}
      </HomeSection>

      <HomeSection title="Best Selling Sarees" viewAllHref="/sarees?bestSeller=true">
        {bestSellers ? <SareeGrid sarees={bestSellers} /> : <Loader />}
      </HomeSection>

      <section className="bg-zari-light/25 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink">Special Offers</h2>
              <p className="text-sm text-ink/60">Up to 50% OFF on selected sarees</p>
            </div>
            <Link to="/sarees?minDiscount=20" className="text-sm font-medium text-wine hover:underline">
              View All →
            </Link>
          </div>
          {onSale ? <SareeGrid sarees={onSale} /> : <Loader />}
        </div>
      </section>
    </PageLayout>
  );
}
