import React from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import WhatsAppButton from '../enquiry/WhatsAppButton.jsx';

export default function PageLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />

      {/* Floating WhatsApp button, present on every page */}
      <WhatsAppButton
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-sage text-2xl text-white shadow-lg transition-transform hover:scale-105"
      >
        💬
      </WhatsAppButton>
    </div>
  );
}
