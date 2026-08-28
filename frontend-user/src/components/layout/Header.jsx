import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import shopConfig from '../../utils/shopConfig';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/sarees', label: 'All Sarees' },
  { to: '/categories', label: 'Categories' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/sarees?search=${encodeURIComponent(query.trim())}`);
      setMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-silk/95 backdrop-blur">
      {/* Top contact strip */}
      <div className="hidden border-b border-border bg-wine text-silk sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs sm:px-6">
          <span>{shopConfig.city}</span>
          <div className="flex items-center gap-4">
            <a href={`tel:${shopConfig.phone.replace(/\s/g, '')}`} className="hover:underline">
              📞 {shopConfig.phone}
            </a>
            <a
              href={`https://wa.me/${shopConfig.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              WhatsApp
            </a>
            <a href={`mailto:${shopConfig.email}`} className="hover:underline">
              {shopConfig.email}
            </a>
          </div>
        </div>
      </div>

      {/* Main header row */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wine font-display text-lg font-semibold text-silk">
            K
          </div>
          <div>
            <p className="font-display text-lg font-semibold leading-tight text-wine">
              {shopConfig.name}
            </p>
            <p className="text-[11px] text-ink/50 sm:hidden">{shopConfig.city}</p>
          </div>
        </Link>

        {/* Desktop search */}
        <form onSubmit={handleSearch} className="hidden max-w-sm flex-1 sm:block">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sarees, fabric, color…"
            className="w-full rounded-full border border-border bg-white px-4 py-2 text-sm outline-none focus:border-wine"
          />
        </form>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="rounded-md border border-border p-2 text-ink sm:hidden"
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Desktop nav */}
      <nav className="hidden border-t border-border sm:block">
        <div className="mx-auto flex max-w-7xl gap-6 px-6 py-2 text-sm">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="text-ink/70 transition-colors hover:text-wine">
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
      <div className="hidden sm:block">
        <div className="zari-border" />
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border bg-white px-4 py-4 sm:hidden">
          <form onSubmit={handleSearch} className="mb-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sarees…"
              className="w-full rounded-full border border-border bg-silk/50 px-4 py-2 text-sm outline-none focus:border-wine"
            />
          </form>
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-ink/80"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
