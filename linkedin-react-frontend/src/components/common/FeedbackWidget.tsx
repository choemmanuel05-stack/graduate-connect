import React, { useState } from 'react';
import { Star, X } from 'lucide-react';

interface FeedbackWidgetProps {
  onClose: () => void;
}

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({ onClose }) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('/api/feedback/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch {
      setError('Unable to submit feedback. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const displayRating = hovered || rating;

  return (
    /* Modal overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0, 0, 0, 0.6)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-title"
    >
      <div
        className="relative w-full max-w-md mx-4 rounded-2xl p-6 shadow-2xl"
        style={{ background: 'var(--bg-card, #1e293b)', border: '1px solid rgba(148,163,184,0.15)' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close feedback"
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        {submitted ? (
          /* Thank-you state */
          <div className="text-center py-6">
            <div className="text-4xl mb-3">🎉</div>
            <h2 className="text-xl font-semibold text-white mb-2">Thank you for your feedback!</h2>
            <p className="text-slate-400 text-sm">Your response helps us improve GradLink.</p>
          </div>
        ) : (
          <>
            <h2 id="feedback-title" className="text-lg font-semibold text-white mb-1">
              Share your feedback
            </h2>
            <p className="text-slate-400 text-sm mb-5">
              How would you rate your experience?
            </p>

            {/* Star rating */}
            <div className="flex items-center gap-2 mb-5" role="group" aria-label="Rating">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  aria-label={`${star} star${star !== 1 ? 's' : ''}`}
                  aria-pressed={rating === star}
                  onClick={() => { setRating(star); setError(''); }}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
                >
                  <Star
                    size={32}
                    fill={star <= displayRating ? '#FBBF24' : 'none'}
                    stroke={star <= displayRating ? '#FBBF24' : '#64748B'}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>

            {/* Comment textarea */}
            <div className="mb-4">
              <label htmlFor="feedback-comment" className="block text-sm text-slate-300 mb-1">
                Additional comments <span className="text-slate-500">(optional)</span>
              </label>
              <textarea
                id="feedback-comment"
                value={comment}
                onChange={e => setComment(e.target.value)}
                maxLength={500}
                rows={3}
                placeholder="Tell us more about your experience…"
                className="w-full rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(148,163,184,0.2)',
                }}
              />
              <p className="text-xs text-slate-500 text-right mt-1">{comment.length}/500</p>
            </div>

            {/* Error message */}
            {error && (
              <p className="text-red-400 text-sm mb-3" role="alert">
                {error}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-60"
                style={{ background: submitting ? '#3B82F6' : '#2563EB' }}
              >
                {submitting ? 'Submitting…' : 'Submit Feedback'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(148,163,184,0.15)' }}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
