import React from 'react';
import { NavLink } from 'react-router-dom';
import { CloseIcon } from '../common/Icons.jsx';

const navSections = [
  {
    label: 'Overview',
    links: [{ to: '/', label: 'Dashboard', end: true }],
  },
  {
    label: 'Products',
    links: [
      { to: '/sarees', label: 'All Sarees', end: true },
      { to: '/sarees/add', label: 'Add Saree' },
      { to: '/sarees?status=out-of-stock', label: 'Out of Stock' },
    ],
  },
  {
    label: 'Catalog',
    links: [
      { to: '/categories', label: 'Categories' },
      { to: '/colors', label: 'Colors' },
      { to: '/fabrics', label: 'Fabrics' },
      { to: '/occasions', label: 'Occasions' },
    ],
  },
  {
    label: 'Merchandising',
    links: [
      { to: '/featured', label: 'Featured Sarees' },
      { to: '/new-arrivals', label: 'New Arrivals' },
      { to: '/best-sellers', label: 'Best Sellers' },
      { to: '/discounts', label: 'Discounts' },
    ],
  },
  {
    label: 'Customers',
    links: [
      { to: '/enquiries', label: 'Enquiries' },
      { to: '/feedback', label: 'Feedback / Reviews' },
    ],
  },
  {
    label: 'Settings',
    links: [
      { to: '/settings/shop', label: 'Shop Information' },
      { to: '/settings/profile', label: 'Admin Profile' },
    ],
  },
];

const linkBase = 'block rounded-md px-3 py-2 text-sm transition-colors';
const linkActive = 'bg-wine text-silk font-medium';
const linkInactive = 'text-ink/70 hover:bg-zari-light/40 hover:text-ink';

/**
 * Props:
 *  - open: whether the drawer is visible on mobile (ignored on lg+, where it's always visible)
 *  - onClose: called on backdrop click, the X button, or after a nav link is tapped
 */
export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Backdrop - mobile only, closes the drawer on click */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 max-w-[85vw] transform flex-col border-r border-border bg-white transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-64 lg:max-w-none lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className="flex items-start justify-between px-5 pt-6 pb-4">
            <div>
              <p className="font-display text-lg font-semibold text-wine">Kishori Saree</p>
              <p className="text-xs uppercase tracking-[0.14em] text-ink/50">Admin Panel</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-ink/50 hover:bg-silk hover:text-ink lg:hidden"
              aria-label="Close menu"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="zari-border" />
        </div>

        <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4">
          {navSections.map((section) => (
            <div key={section.label} className="mb-5">
              <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-ink/40">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `${linkBase} ${isActive ? linkActive : linkInactive}`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
