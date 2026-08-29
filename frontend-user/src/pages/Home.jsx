import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout.jsx';
import SareeGrid from '../components/saree/SareeGrid.jsx';
import HeroCategorySlideshow from '../components/saree/HeroCategorySlideshow.jsx';
import CategoryCarousel from '../components/saree/CategoryCarousel.jsx';
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
      {/* Hero — the category photos ARE the hero now; no headline/button over them */}
      <section className="relative overflow-hidden">
        <HeroCategorySlideshow />
        <div className="zari-border" />
      </section>

      {/* All Categories — single-row carousel: hidden scrollbar, swipeable
          on touch, arrow buttons on desktop that never overlap the content */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h2 className="mb-5 text-center font-display text-2xl font-semibold text-ink sm:text-left">
          All Categories
        </h2>

        {categoriesLoading ? <Loader label="Loading categories…" /> : <CategoryCarousel categories={categories} />}
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