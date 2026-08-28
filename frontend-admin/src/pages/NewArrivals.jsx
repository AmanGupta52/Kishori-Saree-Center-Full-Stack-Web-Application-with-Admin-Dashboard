import React from 'react';
import SareeFlagList from './merchandising/SareeFlagList.jsx';

export default function NewArrivals() {
  return (
    <SareeFlagList
      title="New Arrivals"
      flagField="newArrival"
      emptyHint='No sarees are marked as New Arrival yet. Check the "New Arrival" box on a saree in Add/Edit Saree to have it appear on the homepage.'
    />
  );
}
