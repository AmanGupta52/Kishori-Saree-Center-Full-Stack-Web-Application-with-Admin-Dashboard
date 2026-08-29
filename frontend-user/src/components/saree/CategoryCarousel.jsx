import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from '../common/Icons.jsx';

/**
 * All Categories, in one horizontally-scrollable row.
 *  - Mobile/tablet: native touch swipe, no visible scrollbar.
 *  - Desktop (md+): left/right arrow buttons sit in normal flow beside the
 *    row (not absolutely positioned on top of it), so they never cover the
 *    circles or names. Arrows disable/fade at either end of the list.
 */
export default function CategoryCarousel({ categories }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return undefined;

    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [categories.length]);

  const scrollByAmount = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  if (!categories || categories.length === 0) {
    return <p className="text-center text-sm text-ink/40">No categories yet.</p>;
  }

  const arrowClass =
    'z-10 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-white text-ink/70 shadow-card transition-colors md:flex hover:border-wine hover:text-wine disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-border disabled:hover:text-ink/70';

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <button
        onClick={() => scrollByAmount(-1)}
        disabled={!canScrollLeft}
        aria-label="Scroll categories left"
        className={arrowClass}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div
        ref={scrollRef}
        className="scrollbar-hide flex flex-1 gap-5 overflow-x-auto scroll-smooth py-1 sm:gap-6"
      >
        {categories.map((cat) => (
          <Link
            key={cat._id}
            to={`/category/${cat.slug}`}
            className="flex w-20 shrink-0 flex-col items-center gap-2 text-center sm:w-24"
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-white shadow-card sm:h-20 sm:w-20">
              {cat.image?.url ? (
                <img src={cat.image.url} alt={cat.name} className="h-full w-full object-cover" />
              ) : (
                <span className="font-display text-lg text-zari">{cat.name[0]}</span>
              )}
            </div>
            <span className="line-clamp-2 text-xs text-ink/70 sm:text-sm">{cat.name}</span>
          </Link>
        ))}
      </div>

      <button
        onClick={() => scrollByAmount(1)}
        disabled={!canScrollRight}
        aria-label="Scroll categories right"
        className={arrowClass}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}