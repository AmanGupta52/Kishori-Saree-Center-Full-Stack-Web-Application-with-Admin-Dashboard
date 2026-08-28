import React from 'react';
import PageLayout from '../components/layout/PageLayout.jsx';
import shopConfig from '../utils/shopConfig';

export default function AboutUs() {
  return (
    <PageLayout>
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h1 className="font-display text-3xl font-semibold text-ink">About {shopConfig.name}</h1>
        <div className="zari-border my-5 w-24" />

        <div className="space-y-4 text-sm leading-relaxed text-ink/70">
          <p>
            {shopConfig.name} has been bringing traditional and contemporary sarees to customers across{' '}
            {shopConfig.city} and beyond. Every piece in our collection — from Banarasi silk to Kanjivaram,
            Paithani to designer georgette — is chosen for its craftsmanship, comfort, and character.
          </p>
          <p>
            We work directly with weavers and trusted textile partners to bring you sarees for every
            occasion: weddings, festivals, daily wear, and everything in between. Our team is happy to help
            you find the right piece — reach out any time via phone, WhatsApp, or the enquiry form on any
            saree page.
          </p>
          <p>
            We believe a saree is more than fabric — it's a piece of tradition, carried forward. Thank you
            for shopping with us.
          </p>
        </div>

        <div className="mt-10 rounded-card border border-border bg-white p-5">
          <p className="mb-2 font-display text-base font-semibold text-ink">Visit or Contact Us</p>
          <p className="text-sm text-ink/70">{shopConfig.address}</p>
          <p className="mt-1 text-sm text-ink/70">📞 {shopConfig.phone}</p>
          <p className="text-sm text-ink/70">✉️ {shopConfig.email}</p>
        </div>
      </div>
    </PageLayout>
  );
}
