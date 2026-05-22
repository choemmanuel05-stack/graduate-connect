import React from 'react';

interface EmptyStateProps {
  /** Icon or emoji to display */
  icon?: React.ReactNode;
  /** Main heading */
  title: string;
  /** Descriptive message */
  description: string;
  /** Optional CTA button label */
  actionLabel?: string;
  /** Optional CTA callback */
  onAction?: () => void;
  /** Optional secondary action label */
  secondaryLabel?: string;
  /** Optional secondary action callback */
  onSecondary?: () => void;
}

/**
 * EmptyState — shown when a list or page has no content.
 * Provides a friendly message and optional action button.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3rem 1.5rem',
        gap: '1rem',
      }}
      role="status"
      aria-label={title}
    >
      {/* Icon / Illustration */}
      {icon && (
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'rgba(29,78,216,0.08)',
            border: '1px solid rgba(29,78,216,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            color: 'var(--color-primary, #1D4ED8)',
            marginBottom: '0.5rem',
          }}
        >
          {icon}
        </div>
      )}

      {/* Title */}
      <h3
        style={{
          fontSize: '1.0625rem',
          fontWeight: 700,
          color: 'var(--text-primary, #0F172A)',
          margin: 0,
        }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: '0.875rem',
          color: 'var(--text-faint, #94A3B8)',
          maxWidth: 360,
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {description}
      </p>

      {/* Actions */}
      {(actionLabel || secondaryLabel) && (
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              style={{
                padding: '0.6rem 1.5rem',
                background: 'var(--color-primary, #1D4ED8)',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary-hover, #1E40AF)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-primary, #1D4ED8)'; }}
            >
              {actionLabel}
            </button>
          )}
          {secondaryLabel && onSecondary && (
            <button
              onClick={onSecondary}
              style={{
                padding: '0.6rem 1.5rem',
                background: 'transparent',
                color: 'var(--text-faint, #94A3B8)',
                border: '1px solid var(--border-2, rgba(148,163,184,0.22))',
                borderRadius: 10,
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              {secondaryLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
