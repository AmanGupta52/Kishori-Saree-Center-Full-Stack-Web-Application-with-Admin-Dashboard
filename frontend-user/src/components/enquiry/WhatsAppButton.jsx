import React from 'react';
import shopConfig from '../../utils/shopConfig';

/**
 * Opens WhatsApp with a pre-filled message about a specific saree.
 * If no saree is passed, opens a generic "I'm interested" chat (e.g. from the footer/floating button).
 */
export default function WhatsAppButton({ saree, className = '', children }) {
  const message = saree
    ? `Hello, I am interested in ${saree.name}\nProduct ID: ${saree.sku || saree._id}\nPrice: ₹${saree.sellingPrice?.toLocaleString('en-IN')}`
    : `Hello, I'm interested in your sarees.`;

  const href = `https://wa.me/${shopConfig.whatsapp}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={
        className ||
        'inline-flex items-center justify-center gap-2 rounded-md bg-sage px-4 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90'
      }
    >
      {children || 'WhatsApp Enquiry'}
    </a>
  );
}
