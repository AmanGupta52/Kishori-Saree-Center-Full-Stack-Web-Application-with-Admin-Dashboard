import React from 'react';

function Stars({ rating }) {
  return (
    <div className="text-sm text-zari" aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(rating)}
      <span className="text-border">{'★'.repeat(5 - rating)}</span>
    </div>
  );
}

export default function FeedbackList({ feedback }) {
  if (!feedback || feedback.length === 0) {
    return <p className="text-sm text-ink/40">No reviews yet — be the first to share your experience.</p>;
  }

  return (
    <div className="space-y-4">
      {feedback.map((f) => (
        <div key={f._id} className="rounded-card border border-border bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Stars rating={f.rating} />
              <p className="mt-1.5 text-sm text-ink/80">{f.comment}</p>
            </div>
            {f.photo?.url && (
              <img
                src={f.photo.url}
                alt={`Photo from ${f.name}`}
                className="h-14 w-14 shrink-0 rounded-md object-cover"
              />
            )}
          </div>
          <p className="mt-2 text-xs font-medium text-ink/50">— {f.name}</p>
        </div>
      ))}
    </div>
  );
}
