import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout.jsx';
import SareeGrid from '../components/saree/SareeGrid.jsx';
import FilterSidebar from '../components/saree/FilterSidebar.jsx';
import SortDropdown from '../components/saree/SortDropdown.jsx';
import Pagination from '../components/common/Pagination.jsx';
import Loader from '../components/common/Loader.jsx';
import api from '../services/api';

export default function AllSarees() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sarees, setSarees] = useState(null);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filters = {
    category: searchParams.get('category') || '',
    color: searchParams.get('color') || '',
    fabric: searchParams.get('fabric') || '',
    occasion: searchParams.get('occasion') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minDiscount: searchParams.get('minDiscount') || '',
  };
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page') || 1);
  const featured = searchParams.get('featured');
  const newArrival = searchParams.get('newArrival');
  const bestSeller = searchParams.get('bestSeller');

  useEffect(() => {
    setSarees(null);
    const params = {
      ...filters,
      search: search || undefined,
      sort,
      page,
      limit: 12,
      featured: featured || undefined,
      newArrival: newArrival || undefined,
      bestSeller: bestSeller || undefined,
    };
    Object.keys(params).forEach((k) => params[k] === '' && delete params[k]);

    api.get('/sarees', { params }).then(({ data }) => {
      setSarees(data.sarees);
      setTotal(data.total);
      setPages(data.pages);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) next.delete(key);
      else next.set(key, value);
    });
    next.delete('page'); // reset pagination on filter/sort change
    setSearchParams(next);
  };

  const handleFilterChange = (newFilters) => updateParams(newFilters);
  const handleClearFilters = () =>
    setSearchParams(search ? { search } : {});

  return (
    <PageLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">
              {search ? `Results for "${search}"` : 'All Sarees'}
            </h1>
            {sarees && <p className="text-sm text-ink/50">{total} sarees found</p>}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="rounded-md border border-border px-3 py-2 text-sm text-ink/70 lg:hidden"
            >
              Filters
            </button>
            <SortDropdown value={sort} onChange={(v) => updateParams({ sort: v })} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          {/* Desktop filters */}
          <div className="hidden lg:block">
            <FilterSidebar filters={filters} onChange={handleFilterChange} onClear={handleClearFilters} />
          </div>

          <div>
            {sarees === null ? <Loader label="Loading sarees…" /> : <SareeGrid sarees={sarees} />}
            {sarees && (
              <Pagination page={page} pages={pages} onChange={(p) => updateParams({ page: p })} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="flex-1 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="scrollbar-thin w-80 max-w-[85vw] overflow-y-auto bg-silk p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-lg font-semibold">Filters</p>
              <button onClick={() => setMobileFiltersOpen(false)} className="text-xl">
                ✕
              </button>
            </div>
            <FilterSidebar filters={filters} onChange={handleFilterChange} onClear={handleClearFilters} />
          </div>
        </div>
      )}
    </PageLayout>
  );
}
