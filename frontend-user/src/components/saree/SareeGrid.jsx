import React from 'react';
import SareeCard from './SareeCard.jsx';

export default function SareeGrid({ sarees, emptyMessage = 'No sarees found.' }) {
  if (!sarees || sarees.length === 0) {
    return <p className="py-16 text-center text-sm text-ink/40">{emptyMessage}</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {sarees.map((saree) => (
        <SareeCard key={saree._id} saree={saree} />
      ))}
    </div>
  );
}
