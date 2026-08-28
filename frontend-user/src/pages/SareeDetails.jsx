import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout.jsx';
import ImageGallery from '../components/saree/ImageGallery.jsx';
import RelatedSarees from '../components/saree/RelatedSarees.jsx';
import FeedbackList from '../components/feedback/FeedbackList.jsx';
import FeedbackForm from '../components/feedback/FeedbackForm.jsx';
import EnquiryForm from '../components/enquiry/EnquiryForm.jsx';
import WhatsAppButton from '../components/enquiry/WhatsAppButton.jsx';
import Loader from '../components/common/Loader.jsx';
import api from '../services/api';

const detailRows = [
  ['category', 'Category', (s) => s.category?.name],
  ['fabric', 'Fabric', (s) => s.fabric?.name],
  ['colors', 'Color', (s) => s.colors?.map((c) => c.name).join(', ')],
  ['occasions', 'Occasion', (s) => s.occasions?.map((o) => o.name).join(', ')],
  ['pattern', 'Pattern', (s) => s.pattern],
  ['work', 'Work', (s) => s.work],
  ['sareeLength', 'Saree Length', (s) => s.sareeLength],
  ['blouseLength', 'Blouse Length', (s) => s.blouseLength],
];

export default function SareeDetails() {
  const { slug } = useParams();
  const [saree, setSaree] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [feedback, setFeedback] = useState([]);

  const loadFeedback = (sareeId) => {
    api.get(`/sarees/${sareeId}/feedback`).then(({ data }) => setFeedback(data.feedback));
  };

  useEffect(() => {
    setSaree(null);
    setNotFound(false);
    api
      .get(`/sarees/${slug}`)
      .then(({ data }) => {
        setSaree(data.saree);
        loadFeedback(data.saree._id);
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <PageLayout>
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <p className="font-display text-2xl text-ink">Saree not found</p>
          <Link to="/sarees" className="mt-3 inline-block text-wine hover:underline">
            ← Back to all sarees
          </Link>
        </div>
      </PageLayout>
    );
  }

  if (!saree) {
    return (
      <PageLayout>
        <Loader label="Loading saree…" />
      </PageLayout>
    );
  }

  const discountPct =
    saree.originalPrice > 0 ? Math.round((saree.discountAmount / saree.originalPrice) * 100) : 0;
  const avgRating =
    feedback.length > 0 ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1) : null;

  return (
    <PageLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-5 text-xs text-ink/40">
          <Link to="/" className="hover:text-wine">Home</Link> /{' '}
          <Link to="/sarees" className="hover:text-wine">Sarees</Link> /{' '}
          <span className="text-ink/60">{saree.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <ImageGallery images={saree.images} sareeName={saree.name} />

          <div>
            <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{saree.name}</h1>

            {avgRating && (
              <div className="mt-2 flex items-center gap-2 text-sm">
                <span className="text-zari">{'★'.repeat(Math.round(avgRating))}</span>
                <span className="text-ink/50">
                  {avgRating} ({feedback.length} review{feedback.length !== 1 ? 's' : ''})
                </span>
              </div>
            )}

            <div className="mt-4 flex items-center gap-3">
              <span className="font-display text-3xl font-semibold text-wine">
                ₹{saree.sellingPrice?.toLocaleString('en-IN')}
              </span>
              {saree.discountAmount > 0 && (
                <>
                  <span className="text-lg text-ink/40 line-through">
                    ₹{saree.originalPrice?.toLocaleString('en-IN')}
                  </span>
                  <span className="rounded-full bg-sage px-2.5 py-1 text-xs font-semibold text-white">
                    {discountPct}% OFF
                  </span>
                </>
              )}
            </div>

            {saree.status === 'out-of-stock' && (
              <p className="mt-3 inline-block rounded-md bg-rust/10 px-3 py-1.5 text-sm font-medium text-rust">
                Out of Stock
              </p>
            )}

            {saree.shortDescription && <p className="mt-4 text-sm text-ink/70">{saree.shortDescription}</p>}

            {/* Spec table */}
            <dl className="mt-6 divide-y divide-border rounded-card border border-border bg-white">
              {detailRows.map(([key, label, getValue]) => {
                const value = getValue(saree);
                if (!value) return null;
                return (
                  <div key={key} className="flex justify-between px-4 py-2.5 text-sm">
                    <dt className="text-ink/50">{label}</dt>
                    <dd className="font-medium text-ink">{value}</dd>
                  </div>
                );
              })}
            </dl>

            {saree.description && (
              <div className="mt-6">
                <h3 className="mb-1.5 font-display text-base font-semibold text-ink">Description</h3>
                <p className="whitespace-pre-line text-sm text-ink/70">{saree.description}</p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <WhatsAppButton saree={saree} className="flex-1 rounded-md bg-sage px-5 py-3 text-center text-sm font-medium text-white hover:opacity-90" />
              <a
                href="#enquire"
                className="flex-1 rounded-md border border-wine px-5 py-3 text-center text-sm font-medium text-wine hover:bg-wine hover:text-white"
              >
                Enquire Now
              </a>
            </div>
          </div>
        </div>

        <RelatedSarees slug={saree.slug} />

        {/* Feedback + Enquiry */}
        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <section>
            <h2 className="mb-4 font-display text-xl font-semibold text-ink">Customer Feedback</h2>
            <div className="mb-5">
              <FeedbackList feedback={feedback} />
            </div>
            <FeedbackForm sareeId={saree._id} onSubmitted={() => loadFeedback(saree._id)} />
          </section>

          <section id="enquire">
            <h2 className="mb-4 font-display text-xl font-semibold text-ink">Interested in this saree?</h2>
            <EnquiryForm saree={saree} />
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
