import React from 'react';
import SareeFlagList from './merchandising/SareeFlagList.jsx';

export default function BestSellers() {
  return (
    <SareeFlagList
      title="Best Sellers"
      flagField="bestSeller"
      emptyHint='No sarees are marked as Best Seller yet. Check the "Best Seller" box on a saree in Add/Edit Saree to have it appear on the homepage.'
    />
  );
}
