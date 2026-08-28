import React from 'react';
import { NavLink } from 'react-router-dom';

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

const linkBase =
  'block rounded-md px-3 py-2 text-sm transition-colors';
const linkActive = 'bg-wine text-silk font-medium';
const linkInactive = 'text-ink/70 hover:bg-zari-light/40 hover:text-ink';

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-white">
      <div>
        <div className="px-5 pt-6 pb-4">
          <p className="font-display text-lg font-semibold text-wine">Kishori Saree</p>
          <p className="text-xs uppercase tracking-[0.14em] text-ink/50">Admin Panel</p>
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
  );
}
