import React from 'react';
import SareeFlagList from './merchandising/SareeFlagList.jsx';

export default function Featured() {
  return (
    <SareeFlagList
      title="Featured Sarees"
      flagField="featured"
      emptyHint='No sarees are marked as Featured yet. Check the "Featured" box on a saree in Add/Edit Saree to have it appear on the homepage.'
    />
  );
}
