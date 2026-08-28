import React from 'react';
import SimpleTaxonomyManager from './shared/SimpleTaxonomyManager.jsx';

export default function Occasions() {
  return (
    <SimpleTaxonomyManager
      title="Occasions"
      publicPath="/occasions"
      adminPath="/admin/occasions"
      singular="Occasion"
    />
  );
}
