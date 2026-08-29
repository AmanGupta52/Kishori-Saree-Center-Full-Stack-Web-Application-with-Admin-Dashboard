import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { MenuIcon } from '../common/Icons.jsx';

export default function Topbar({ title, onMenuClick }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-white px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-md p-1.5 text-ink/70 hover:bg-silk hover:text-ink lg:hidden"
          aria-label="Open menu"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
        <h1 className="truncate font-display text-lg font-semibold text-ink sm:text-xl">{title}</h1>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <span className="hidden text-sm text-ink/60 sm:inline">{admin?.name}</span>
        <button
          onClick={handleLogout}
          className="whitespace-nowrap rounded-md border border-border px-2.5 py-1.5 text-xs text-ink/70 transition-colors hover:border-wine hover:text-wine sm:px-3 sm:text-sm"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
