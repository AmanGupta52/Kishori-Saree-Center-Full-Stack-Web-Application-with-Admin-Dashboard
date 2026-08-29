import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTaxonomyOptions from '../../utils/useTaxonomyOptions.js';

const ROTATE_MS = 5000;

export default function CategoryShowcase() {
  const { categories, loading } = useTaxonomyOptions();
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  const slides = categories.filter((c) => c.image?.url);

  useEffect(() => {
    if (slides.length < 2) return undefined;

    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, ROTATE_MS);

    return () => clearInterval(timerRef.current);
  }, [slides.length]);

  if (loading || slides.length === 0) return null;

  const goTo = (index, e) => {
    e.stopPropagation();
    setActive(index);
    clearInterval(timerRef.current);
    if (slides.length > 1) {
      timerRef.current = setInterval(() => {
        setActive((prev) => (prev + 1) % slides.length);
      }, ROTATE_MS);
    }
  };

  const handleActivate = () => navigate('/categories');

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">Shop by Category</h2>
          <p className="text-sm text-ink/50">Tap to browse the full collection</p>
        </div>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={handleActivate}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleActivate()}
        className="group relative h-64 w-full cursor-pointer overflow-hidden rounded-card border border-border shadow-card outline-none focus-visible:ring-2 focus-visible:ring-wine sm:h-80 lg:h-96"
      >
        {slides.map((cat, index) => (
          <div
            key={cat._id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === active ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            {/* Blurred backdrop: the same image, scaled and blurred, fills any
                space the foreground image (object-contain) leaves empty on
                the left/right or top/bottom, instead of harsh letterbox bars. */}
            <img
              src={cat.image.url}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl brightness-75 saturate-150"
            />

            {/* Foreground image, always fully visible, never cropped */}
            <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-10">
              <img
                src={cat.image.url}
                alt={cat.name}
                className="h-full max-h-full w-auto rounded-md object-contain shadow-lg transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Legibility gradient + caption */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent px-6 pb-5 pt-14">
              <p className="font-display text-xl font-semibold text-white sm:text-2xl">{cat.name}</p>
              <p className="text-xs text-white/70 sm:text-sm">Explore the collection →</p>
            </div>
          </div>
        ))}

        {/* Dot indicators */}
        {slides.length > 1 && (
          <div className="absolute right-4 top-4 flex gap-1.5">
            {slides.map((cat, index) => (
              <button
                key={cat._id}
                onClick={(e) => goTo(index, e)}
                aria-label={`Show ${cat.name}`}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === active ? 'w-5 bg-zari' : 'bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
