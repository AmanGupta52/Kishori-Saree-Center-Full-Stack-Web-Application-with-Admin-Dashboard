import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import shopConfig from '../../utils/shopConfig';
import { MenuIcon, CloseIcon, SearchIcon, PhoneIcon, MailIcon } from '../common/Icons.jsx';

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

  // Lock background scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

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
      <div className="hidden border-b border-border bg-wine text-silk md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs lg:px-6">
          <span>{shopConfig.city}</span>
          <div className="flex items-center gap-4">
            <a href={`tel:${shopConfig.phone.replace(/\s/g, '')}`} className="flex items-center gap-1.5 hover:underline">
              <PhoneIcon className="h-3.5 w-3.5" /> {shopConfig.phone}
            </a>
            <a href={`https://wa.me/${shopConfig.whatsapp}`} target="_blank" rel="noreferrer" className="hover:underline">
              WhatsApp
            </a>
            <a href={`mailto:${shopConfig.email}`} className="flex items-center gap-1.5 hover:underline">
              <MailIcon className="h-3.5 w-3.5" /> {shopConfig.email}
            </a>
          </div>
        </div>
      </div>

      {/* Main header row */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 lg:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wine font-display text-lg font-semibold text-silk">
            K
          </div>
          <div>
            <p className="font-display text-base font-semibold leading-tight text-wine sm:text-lg">
              {shopConfig.name}
            </p>
            <p className="text-[11px] text-ink/50 md:hidden">{shopConfig.city}</p>
          </div>
        </Link>

        {/* Desktop search */}
        <form onSubmit={handleSearch} className="relative hidden max-w-sm flex-1 md:block">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sarees, fabric, color…"
            className="w-full rounded-full border border-border bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-wine"
          />
        </form>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm lg:flex">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="text-ink/70 transition-colors hover:text-wine">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMenuOpen(true)}
          className="rounded-md border border-border p-2 text-ink lg:hidden"
          aria-label="Open menu"
          aria-expanded={menuOpen}
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="hidden lg:block">
        <div className="zari-border" />
      </div>

      {/* Mobile drawer + backdrop */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/50"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          <div className="absolute inset-y-0 right-0 flex w-80 max-w-[85vw] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <p className="font-display text-lg font-semibold text-wine">{shopConfig.name}</p>
              <button
                onClick={() => setMenuOpen(false)}
                className="rounded-md p-1.5 text-ink/60 hover:bg-silk hover:text-ink"
                aria-label="Close menu"
              >
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <form onSubmit={handleSearch} className="relative mb-6">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search sarees…"
                  className="w-full rounded-full border border-border bg-silk/50 py-2 pl-9 pr-4 text-sm outline-none focus:border-wine"
                />
              </form>

              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-silk hover:text-wine"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="border-t border-border px-5 py-4">
              <a
                href={`tel:${shopConfig.phone.replace(/\s/g, '')}`}
                className="mb-2 flex items-center gap-2 text-sm text-ink/70"
              >
                <PhoneIcon className="h-4 w-4" /> {shopConfig.phone}
              </a>
              <a
                href={`https://wa.me/${shopConfig.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-sage"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
