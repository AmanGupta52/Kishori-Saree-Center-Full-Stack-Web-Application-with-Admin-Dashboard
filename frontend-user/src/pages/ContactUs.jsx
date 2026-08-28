import React from 'react';
import PageLayout from '../components/layout/PageLayout.jsx';
import EnquiryForm from '../components/enquiry/EnquiryForm.jsx';
import WhatsAppButton from '../components/enquiry/WhatsAppButton.jsx';
import shopConfig from '../utils/shopConfig';

export default function ContactUs() {
  return (
    <PageLayout>
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <h1 className="font-display text-3xl font-semibold text-ink">Contact Us</h1>
        <p className="mt-2 text-sm text-ink/60">
          Have a question about a saree, availability, or a custom order? We'd love to hear from you.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-card border border-border bg-white p-5">
              <p className="mb-3 font-display text-base font-semibold text-ink">Reach us directly</p>
              <div className="space-y-2 text-sm text-ink/70">
                <p>📍 {shopConfig.address}</p>
                <p>📞 <a href={`tel:${shopConfig.phone.replace(/\s/g, '')}`} className="hover:text-wine">{shopConfig.phone}</a></p>
                <p>✉️ <a href={`mailto:${shopConfig.email}`} className="hover:text-wine">{shopConfig.email}</a></p>
              </div>
              <WhatsAppButton className="mt-4 inline-flex items-center justify-center rounded-md bg-sage px-4 py-2.5 text-sm font-medium text-white hover:opacity-90">
                Chat on WhatsApp
              </WhatsAppButton>
            </div>
          </div>

          <EnquiryForm />
        </div>
      </div>
    </PageLayout>
  );
}
