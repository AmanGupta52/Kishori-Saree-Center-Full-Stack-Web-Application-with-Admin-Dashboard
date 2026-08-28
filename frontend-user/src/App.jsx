import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import AllSarees from './pages/AllSarees.jsx';
import SareeDetails from './pages/SareeDetails.jsx';
import Categories from './pages/Categories.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import AboutUs from './pages/AboutUs.jsx';
import ContactUs from './pages/ContactUs.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sarees" element={<AllSarees />} />
      <Route path="/saree/:slug" element={<SareeDetails />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/category/:slug" element={<CategoryPage />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route
        path="*"
        element={
          <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-silk text-center">
            <p className="font-display text-3xl text-ink">Page not found</p>
            <a href="/" className="text-wine hover:underline">
              Back to home
            </a>
          </div>
        }
      />
    </Routes>
  );
}
