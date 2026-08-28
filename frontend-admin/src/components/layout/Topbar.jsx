import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Topbar({ title }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-white px-6">
      <h1 className="font-display text-xl font-semibold text-ink">{title}</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-ink/60">{admin?.name}</span>
        <button
          onClick={handleLogout}
          className="rounded-md border border-border px-3 py-1.5 text-sm text-ink/70 transition-colors hover:border-wine hover:text-wine"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
