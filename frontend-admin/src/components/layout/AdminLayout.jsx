import React from 'react';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

export default function AdminLayout({ title, children }) {
  return (
    <div className="flex min-h-screen bg-silk">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
