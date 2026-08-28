import React from 'react';
import { Link } from 'react-router-dom';
import shopConfig from '../../utils/shopConfig';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-10 sm:grid-cols-3">
        <div>
          <p className="font-display text-lg font-semibold text-wine">{shopConfig.name}</p>
          <p className="mt-1 text-sm text-ink/60">{shopConfig.tagline}</p>
          <p className="mt-3 text-sm text-ink/60">{shopConfig.address}</p>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink/40">Quick Links</p>
          <div className="flex flex-col gap-2 text-sm text-ink/70">
            <Link to="/sarees" className="hover:text-wine">All Sarees</Link>
            <Link to="/categories" className="hover:text-wine">Categories</Link>
            <Link to="/about" className="hover:text-wine">About Us</Link>
            <Link to="/contact" className="hover:text-wine">Contact Us</Link>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink/40">Get in Touch</p>
          <div className="flex flex-col gap-2 text-sm text-ink/70">
            <a href={`tel:${shopConfig.phone.replace(/\s/g, '')}`} className="hover:text-wine">
              📞 {shopConfig.phone}
            </a>
            <a href={`https://wa.me/${shopConfig.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-wine">
              WhatsApp Us
            </a>
            <a href={`mailto:${shopConfig.email}`} className="hover:text-wine">
              {shopConfig.email}
            </a>
          </div>
        </div>
      </div>

      <div className="zari-border" />
      <div className="mx-auto max-w-7xl px-6 py-4 text-center text-xs text-ink/40">
        © {new Date().getFullYear()} {shopConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
