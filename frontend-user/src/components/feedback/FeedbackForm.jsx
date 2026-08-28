import React, { useState } from 'react';
import api from '../../services/api';

export default function FeedbackForm({ sareeId, onSubmitted }) {
  const [form, setForm] = useState({ name: '', rating: 0, comment: '' });
  const [photo, setPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!form.rating) {
      setError('Please select a star rating.');
      return;
    }

    const payload = new FormData();
    payload.append('name', form.name);
    payload.append('rating', form.rating);
    payload.append('comment', form.comment);
    if (photo) payload.append('photo', photo);

    setSubmitting(true);
    try {
      const { data } = await api.post(`/sarees/${sareeId}/feedback`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(data.message);
      setForm({ name: '', rating: 0, comment: '' });
      setPhoto(null);
      onSubmitted?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit your feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-card border border-border bg-white p-5">
      <h3 className="mb-3 font-display text-base font-semibold text-ink">Share Your Feedback</h3>

      <div className="mb-3">
        <label className="mb-1 block text-sm font-medium text-ink/80">Your Rating</label>
        <div className="flex gap-1 text-2xl">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setForm({ ...form, rating: star })}
              className={star <= form.rating ? 'text-zari' : 'text-border'}
              aria-label={`${star} star`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="mb-1 block text-sm font-medium text-ink/80">Your Name</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-md border border-border bg-silk/40 px-3 py-2 text-sm outline-none focus:border-wine"
        />
      </div>

      <div className="mb-3">
        <label className="mb-1 block text-sm font-medium text-ink/80">Your Feedback</label>
        <textarea
          required
          rows={3}
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          className="w-full rounded-md border border-border bg-silk/40 px-3 py-2 text-sm outline-none focus:border-wine"
          placeholder="Very beautiful saree and good quality…"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-ink/80">Photo (optional)</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setPhoto(e.target.files?.[0] || null)}
          className="text-sm text-ink/60"
        />
      </div>

      {error && <p className="mb-3 rounded-md bg-rust/10 px-3 py-2 text-sm text-rust">{error}</p>}
      {message && <p className="mb-3 rounded-md bg-sage/10 px-3 py-2 text-sm text-sage">{message}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-wine px-5 py-2.5 text-sm font-medium text-silk hover:bg-wine-dark disabled:opacity-60"
      >
        {submitting ? 'Submitting…' : 'Submit Feedback'}
      </button>
    </form>
  );
}
