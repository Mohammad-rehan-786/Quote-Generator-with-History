import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, Heart, X } from 'lucide-react';
import './Toast.css';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 3200);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="toast-icon toast-icon-success" size={20} />;
      case 'error':
        return <AlertCircle className="toast-icon toast-icon-error" size={20} />;
      case 'favorite':
        return <Heart className="toast-icon toast-icon-fav" size={20} fill="currentColor" />;
      default:
        return <Info className="toast-icon toast-icon-info" size={20} />;
    }
  };

  return (
    <div className={`toast-container toast-${toast.type || 'info'}`} role="status" aria-live="polite">
      <div className="toast-content">
        {getIcon()}
        <span className="toast-message">{toast.message}</span>
      </div>
      <button className="toast-close" onClick={onClose} aria-label="Close notification">
        <X size={16} />
      </button>
      <div className="toast-progress" />
    </div>
  );
}
