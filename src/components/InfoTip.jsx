import React, { useState, useRef, useEffect } from 'react';

/**
 * Small info icon. Click to toggle a popover with explanatory content.
 * Click outside, press Escape, or click the icon again to dismiss.
 */
export default function InfoTip({ children, label = 'More info', align = 'left' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function handleKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleDoc);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleDoc);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <span className="info-tip" ref={ref}>
      <button
        type="button"
        className={`info-tip-icon ${open ? 'open' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(o => !o);
        }}
        aria-label={label}
        aria-expanded={open}
      >
        i
      </button>
      {open && (
        <div className={`info-tip-popover align-${align}`} role="tooltip">
          {children}
        </div>
      )}
    </span>
  );
}
