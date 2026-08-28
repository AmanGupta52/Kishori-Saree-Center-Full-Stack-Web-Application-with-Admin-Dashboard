import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api';

export default function AdminProfile() {
  const { admin, refetch } = useAuth();
  const [name, setName] = useState(admin?.name || '');
  const [email, setEmail] = useState(admin?.email || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');

  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileError('');
    setProfileMessage('');
    try {
      await api.put('/auth/profile', { name, email });
      await refetch();
      setProfileMessage('Profile updated.');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Could not update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordMessage('');

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }
    if (passwords.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    setPasswordSaving(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswordMessage('Password changed successfully.');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Could not change password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  const inputClass = 'w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-wine';
  const labelClass = 'mb-1 block text-sm font-medium text-ink/80';

  return (
    <AdminLayout title="Admin Profile">
      <div className="grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
        <form onSubmit={handleProfileSubmit} className="space-y-3 rounded-card border border-border bg-white p-5 shadow-card">
          <h3 className="mb-1 font-display text-base font-semibold text-ink">Profile</h3>

          <div>
            <label className={labelClass}>Name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </div>

          {profileError && <p className="rounded-md bg-rust/10 px-3 py-2 text-sm text-rust">{profileError}</p>}
          {profileMessage && <p className="rounded-md bg-sage/10 px-3 py-2 text-sm text-sage">{profileMessage}</p>}

          <button
            type="submit"
            disabled={profileSaving}
            className="w-full rounded-md bg-wine px-4 py-2.5 text-sm font-medium text-silk hover:bg-wine-dark disabled:opacity-60"
          >
            {profileSaving ? 'Saving…' : 'Save Profile'}
          </button>
        </form>

        <form onSubmit={handlePasswordSubmit} className="space-y-3 rounded-card border border-border bg-white p-5 shadow-card">
          <h3 className="mb-1 font-display text-base font-semibold text-ink">Change Password</h3>

          <div>
            <label className={labelClass}>Current Password</label>
            <input
              required
              type="password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>New Password</label>
            <input
              required
              type="password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Confirm New Password</label>
            <input
              required
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              className={inputClass}
            />
          </div>

          {passwordError && <p className="rounded-md bg-rust/10 px-3 py-2 text-sm text-rust">{passwordError}</p>}
          {passwordMessage && <p className="rounded-md bg-sage/10 px-3 py-2 text-sm text-sage">{passwordMessage}</p>}

          <button
            type="submit"
            disabled={passwordSaving}
            className="w-full rounded-md bg-wine px-4 py-2.5 text-sm font-medium text-silk hover:bg-wine-dark disabled:opacity-60"
          >
            {passwordSaving ? 'Saving…' : 'Change Password'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
