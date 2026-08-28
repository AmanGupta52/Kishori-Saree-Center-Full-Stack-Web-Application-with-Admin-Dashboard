import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AllSarees from './pages/Sarees/AllSarees.jsx';
import AddSaree from './pages/Sarees/AddSaree.jsx';
import Categories from './pages/Categories.jsx';
import Colors from './pages/Colors.jsx';
import Fabrics from './pages/Fabrics.jsx';
import Occasions from './pages/Occasions.jsx';
import Featured from './pages/Featured.jsx';
import NewArrivals from './pages/NewArrivals.jsx';
import BestSellers from './pages/BestSellers.jsx';
import Discounts from './pages/Discounts.jsx';
import Enquiries from './pages/Enquiries.jsx';
import Feedback from './pages/Feedback.jsx';
import ShopInformation from './pages/settings/ShopInformation.jsx';
import AdminProfile from './pages/settings/AdminProfile.jsx';

const withLayout = (Component) => (
  <ProtectedRoute>
    <Component />
  </ProtectedRoute>
);

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={withLayout(Dashboard)} />

      {/* Products */}
      <Route path="/sarees" element={withLayout(AllSarees)} />
      <Route path="/sarees/add" element={withLayout(AddSaree)} />

      {/* Catalog */}
      <Route path="/categories" element={withLayout(Categories)} />
      <Route path="/colors" element={withLayout(Colors)} />
      <Route path="/fabrics" element={withLayout(Fabrics)} />
      <Route path="/occasions" element={withLayout(Occasions)} />

      {/* Merchandising */}
      <Route path="/featured" element={withLayout(Featured)} />
      <Route path="/new-arrivals" element={withLayout(NewArrivals)} />
      <Route path="/best-sellers" element={withLayout(BestSellers)} />
      <Route path="/discounts" element={withLayout(Discounts)} />

      {/* Customers */}
      <Route path="/enquiries" element={withLayout(Enquiries)} />
      <Route path="/feedback" element={withLayout(Feedback)} />

      {/* Settings */}
      <Route path="/settings/shop" element={withLayout(ShopInformation)} />
      <Route path="/settings/profile" element={withLayout(AdminProfile)} />
    </Routes>
  );
}
