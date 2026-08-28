import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      const redirectTo = location.state?.from || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-silk px-4">
      <div className="w-full max-w-sm">
        <div className="overflow-hidden rounded-card border border-border bg-white shadow-card">
          <div className="zari-border" />
          <div className="px-8 pb-8 pt-7">
            <p className="font-display text-2xl font-semibold text-wine">Kishori Saree</p>
            <p className="mb-6 text-sm text-ink/50">Admin Panel</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink/80">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="username"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-md border border-border bg-silk/40 px-3 py-2 text-sm text-ink outline-none focus:border-wine"
                  placeholder="admin@kishorisaree.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink/80">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-md border border-border bg-silk/40 px-3 py-2 text-sm text-ink outline-none focus:border-wine"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="rounded-md bg-rust/10 px-3 py-2 text-sm text-rust">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-md bg-wine px-4 py-2.5 text-sm font-medium text-silk transition-colors hover:bg-wine-dark disabled:opacity-60"
              >
                {submitting ? 'Logging in…' : 'Log in'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
