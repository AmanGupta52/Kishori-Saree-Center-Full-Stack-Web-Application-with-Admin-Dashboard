import React, { useState } from 'react';
import api from '../../services/api';

export default function EnquiryForm({ saree }) {
  const [form, setForm] = useState({ name: '', mobile: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);

    try {
      const { data } = await api.post('/enquiries', {
        ...form,
        sareeId: saree?._id,
        message:
          form.message ||
          (saree ? `I'm interested in this saree (${saree.name}). Please contact me regarding availability.` : ''),
      });
      setMessage(data.message);
      setForm({ name: '', mobile: '', email: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send your enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-card border border-border bg-white p-5">
      <h3 className="mb-3 font-display text-base font-semibold text-ink">Enquire Now</h3>

      <div className="mb-3">
        <label className="mb-1 block text-sm font-medium text-ink/80">Name *</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-md border border-border bg-silk/40 px-3 py-2 text-sm outline-none focus:border-wine"
        />
      </div>

      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink/80">Mobile Number *</label>
          <input
            required
            type="tel"
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            className="w-full rounded-md border border-border bg-silk/40 px-3 py-2 text-sm outline-none focus:border-wine"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink/80">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-md border border-border bg-silk/40 px-3 py-2 text-sm outline-none focus:border-wine"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-ink/80">Message</label>
        <textarea
          rows={3}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder={
            saree
              ? `I'm interested in this saree. Please contact me regarding availability.`
              : `Tell us what you're looking for…`
          }
          className="w-full rounded-md border border-border bg-silk/40 px-3 py-2 text-sm outline-none focus:border-wine"
        />
      </div>

      {error && <p className="mb-3 rounded-md bg-rust/10 px-3 py-2 text-sm text-rust">{error}</p>}
      {message && <p className="mb-3 rounded-md bg-sage/10 px-3 py-2 text-sm text-sage">{message}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-wine px-5 py-2.5 text-sm font-medium text-silk hover:bg-wine-dark disabled:opacity-60"
      >
        {submitting ? 'Sending…' : 'Send Enquiry'}
      </button>
    </form>
  );
}
