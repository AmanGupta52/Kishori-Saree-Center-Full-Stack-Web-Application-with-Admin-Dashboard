import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout.jsx';
import SareeForm from '../../components/saree/SareeForm.jsx';

export default function AddSaree() {
  const navigate = useNavigate();

  return (
    <AdminLayout title="Add Saree">
      <div className="mx-auto max-w-4xl">
        <SareeForm onSuccess={() => setTimeout(() => navigate('/sarees'), 900)} />
      </div>
    </AdminLayout>
  );
}
