import React from 'react';
import SimpleTaxonomyManager from './shared/SimpleTaxonomyManager.jsx';

export default function Fabrics() {
  return (
    <SimpleTaxonomyManager
      title="Fabrics"
      publicPath="/fabrics"
      adminPath="/admin/fabrics"
      singular="Fabric"
    />
  );
}
