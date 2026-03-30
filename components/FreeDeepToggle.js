'use client';

export default function FreeDeepToggle({ value, onChange }) {
  return (
    <div className="ask-toggle">
      <button
        type="button"
        onClick={() => onChange('free')}
        className={`ask-toggle-btn ${value === 'free' ? 'active' : ''}`}
      >
        FREE
      </button>
      <button
        type="button"
        onClick={() => onChange('deep')}
        className={`ask-toggle-btn ${value === 'deep' ? 'active' : ''}`}
      >
        DEEP
      </button>
    </div>
  );
}