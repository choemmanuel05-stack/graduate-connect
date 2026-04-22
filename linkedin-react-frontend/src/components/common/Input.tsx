import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, type, className = '', ...props }) => {
  const [show, setShow] = useState(false);
  const isPw = type === 'password';

  return (
    <div style={{ width: '100%' }}>
      {label && <label className="field-label">{label}</label>}
      <div style={{ position: 'relative' }}>
        <input
          type={isPw ? (show ? 'text' : 'password') : type}
          className={`field ${isPw ? 'pr-10' : ''} ${error ? 'border-red-500' : ''} ${className}`}
          style={isPw ? { paddingRight: '2.75rem' } : {}}
          {...props}
        />
        {isPw && (
          <button type="button" onClick={() => setShow(!show)}
            style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error && <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#FCA5A5' }}>{error}</p>}
    </div>
  );
};
