import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useTaxonomyOptions from '../../utils/useTaxonomyOptions.js';

const ROTATE_MS = 5000;

/**
 * The pink/wine hero itself — category photos ARE the hero content now
 * (no "Beautiful Sarees" headline/button). Each slide shows the category
 * photo in full (object-contain) with a blurred, scaled copy of the same
 * photo filling the space around it, so nothing gets cropped or leaves an
 * awkward empty bar. Slides cross-fade every 5s; tapping the hero (but not
 * the pagination dots) goes to /categories.
 */
export default function HeroCategorySlideshow() {
  const { categories, loading } = useTaxonomyOptions();
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  const slides = categories.filter((c) => c.image?.url);

  const startTimer = () => {
    clearInterval(timerRef.current);
    if (slides.length > 1) {
      timerRef.current = setInterval(() => {
        setActive((prev) => (prev + 1) % slides.length);
      }, ROTATE_MS);
    }
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

  const heroHeight = 'h-72 sm:h-96 lg:h-[440px]';

  if (loading) {
    return <div className={`relative flex ${heroHeight} items-center justify-center bg-wine-fade`} />;
  }

  if (slides.length === 0) {
    return (
      <div className={`relative flex ${heroHeight} flex-col items-center justify-center gap-4 bg-wine-fade px-4 text-center`}>
        <p className="font-display text-2xl font-semibold text-silk sm:text-3xl">Kishori Saree Center</p>
        <Link
          to="/categories"
          className="rounded-md bg-zari px-6 py-2.5 text-sm font-medium text-ink transition-transform hover:scale-105"
        >
          Browse Categories
        </Link>
      </div>
    );
  }

  const goTo = (index, e) => {
    e.stopPropagation();
    setActive(index);
    startTimer();
  };

  const handleActivate = () => navigate('/categories');

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleActivate}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleActivate()}
      aria-label="Browse all categories"
      className={`group relative ${heroHeight} w-full cursor-pointer overflow-hidden bg-wine-fade outline-none`}
    >
      {slides.map((cat, index) => (
        <div
          key={cat._id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === active ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          {/* Blurred backdrop fills the space the contained photo leaves empty */}
          <img
            src={cat.image.url}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl brightness-[.55] saturate-150"
          />

          {/* The category photo itself — always shown in full, never cropped */}
          <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-10">
            <img
              src={cat.image.url}
              alt={cat.name}
              className="h-full max-h-full w-auto rounded-md object-contain shadow-2xl transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Caption */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent px-6 pb-5 pt-16 text-center sm:text-left">
            <p className="font-display text-xl font-semibold text-white sm:text-2xl">{cat.name}</p>
            <p className="text-xs text-white/70 sm:text-sm">Explore the collection →</p>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <div className="absolute bottom-4 right-4 z-10 flex gap-1.5 sm:bottom-5 sm:right-5">
          {slides.map((cat, index) => (
            <button
              key={cat._id}
              onClick={(e) => goTo(index, e)}
              aria-label={`Show ${cat.name}`}
              className={`h-2 rounded-full transition-all ${
                index === active ? 'w-5 bg-zari' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}