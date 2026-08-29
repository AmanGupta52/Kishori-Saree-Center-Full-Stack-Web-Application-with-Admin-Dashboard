import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import shopConfig from '../../utils/shopConfig';
import {
  MenuIcon,
  CloseIcon,
  SearchIcon,
  PhoneIcon,
  MailIcon,
} from '../common/Icons.jsx';

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
  const menuRef = useRef(null);

  /* ---------------------------------------------
     SEARCH
  --------------------------------------------- */
  const handleSearch = (e) => {
    e.preventDefault();

    const searchValue = query.trim();

    if (!searchValue) return;

    navigate(`/sarees?search=${encodeURIComponent(searchValue)}`);
    setMenuOpen(false);
  };

  /* ---------------------------------------------
     CLOSE MENU
  --------------------------------------------- */
  const closeMenu = () => {
    setMenuOpen(false);
  };

  /* ---------------------------------------------
     LOCK BODY SCROLL WHEN MENU IS OPEN
  --------------------------------------------- */
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  /* ---------------------------------------------
     CLOSE WITH ESCAPE
  --------------------------------------------- */
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    if (menuOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  /* ---------------------------------------------
     CLOSE WHEN CLICKING OUTSIDE MOBILE MENU
  --------------------------------------------- */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-silk/95 backdrop-blur">
      
      {/* =====================================================
          TOP CONTACT BAR
      ====================================================== */}
      <div className="hidden border-b border-border bg-wine text-silk md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs lg:px-6">
          
          {/* City */}
          <span className="font-medium">
            {shopConfig.city}
          </span>

          {/* Contact information */}
          <div className="flex items-center gap-4">
            
            {/* Phone */}
            <a
              href={`tel:${shopConfig.phone.replace(/\s/g, '')}`}
              className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
            >
              <PhoneIcon className="h-3.5 w-3.5" />
              <span>{shopConfig.phone}</span>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${shopConfig.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              WhatsApp
            </a>

            {/* Email */}
            <a
              href={`mailto:${shopConfig.email}`}
              className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
            >
              <MailIcon className="h-3.5 w-3.5" />
              <span>{shopConfig.email}</span>
            </a>

          </div>
        </div>
      </div>


      {/* =====================================================
          MAIN HEADER
      ====================================================== */}
      <div className="mx-auto max-w-7xl px-4 lg:px-6">

        {/* ===================================================
            DESKTOP / TABLET MAIN ROW
        ==================================================== */}
        <div className="flex min-h-[72px] items-center justify-between gap-4">

          {/* -----------------------------------------------
              LOGO
          ------------------------------------------------ */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex min-w-0 shrink-0 items-center gap-2.5"
          >
            {/* Logo circle */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-wine font-display text-lg font-semibold text-silk">
              K
            </div>

            {/* Brand name */}
            <div className="min-w-0">
              <p className="truncate font-display text-base font-semibold leading-tight text-wine sm:text-lg lg:text-xl">
                {shopConfig.name}
              </p>

              {/* Mobile city */}
              <p className="text-[11px] text-ink/50 md:hidden">
                {shopConfig.city}
              </p>
            </div>
          </Link>


          {/* -----------------------------------------------
              DESKTOP SEARCH
          ------------------------------------------------ */}
          <form
            onSubmit={handleSearch}
            className="relative hidden min-w-0 max-w-[480px] flex-1 md:block lg:max-w-[500px]"
          >
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />

            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sarees, fabric, color..."
              className="w-full rounded-full border border-border bg-white py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-wine focus:ring-1 focus:ring-wine/20"
              aria-label="Search sarees"
            />
          </form>


          {/* -----------------------------------------------
              DESKTOP NAVIGATION
          ------------------------------------------------ */}
          <nav className="hidden items-center gap-5 lg:flex xl:gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="whitespace-nowrap text-sm text-ink/70 transition-colors hover:text-wine xl:text-[15px]"
              >
                {link.label}
              </Link>
            ))}
          </nav>


          {/* -----------------------------------------------
              TABLET / MOBILE MENU BUTTON
          ------------------------------------------------ */}
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-white text-ink transition hover:border-wine hover:text-wine md:flex lg:hidden"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <CloseIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>

        </div>


        {/* ===================================================
            MOBILE SEARCH
        ==================================================== */}
        <div className="pb-3 md:hidden">
          <form
            onSubmit={handleSearch}
            className="relative"
          >
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />

            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sarees, fabric, color..."
              className="w-full rounded-full border border-border bg-white py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-wine focus:ring-1 focus:ring-wine/20"
              aria-label="Search sarees"
            />
          </form>
        </div>

      </div>


      {/* =====================================================
          GOLD ZARI BORDER
      ====================================================== */}
      <div className="hidden md:block">
        <div className="zari-border" />
      </div>


      {/* =====================================================
          TABLET + MOBILE MENU
      ====================================================== */}
      {menuOpen && (
        <>
          {/* -----------------------------------------------
              BACKDROP
          ------------------------------------------------ */}
          <div
            className="fixed inset-0 z-[998] bg-black/30 lg:hidden"
            aria-hidden="true"
          />

          {/* -----------------------------------------------
              MENU PANEL
          ------------------------------------------------ */}
          <div
            ref={menuRef}
            className="absolute left-0 right-0 top-full z-[999] border-t border-border bg-white shadow-xl lg:hidden"
          >

            {/* Menu inner */}
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">

              {/* Navigation */}
              <nav className="flex flex-col">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={closeMenu}
                    className="border-b border-border/60 px-3 py-3.5 text-base font-medium text-ink/80 transition-colors hover:bg-silk hover:text-wine"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>


              {/* -------------------------------------------
                  CONTACT DETAILS
              -------------------------------------------- */}
              <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-2">

                {/* Phone */}
                <a
                  href={`tel:${shopConfig.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-2 text-sm text-ink/70 transition-colors hover:text-wine"
                >
                  <PhoneIcon className="h-4 w-4 shrink-0" />
                  {shopConfig.phone}
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${shopConfig.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-sage transition-colors hover:opacity-80"
                >
                  WhatsApp Us
                </a>

              </div>

            </div>
          </div>
        </>
      )}
    </header>
  );
}