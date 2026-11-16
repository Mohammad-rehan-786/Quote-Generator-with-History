import React, { useState } from 'react';
import { Calendar, Compass, Sparkles, Copy, Check, Heart, Share2, Info } from 'lucide-react';
import './DailyQuote.css';

export default function DailyQuote({
  dailyQuote,
  isFavorite,
  onToggleFavorite,
  onCopyQuote,
  onShareQuote
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!dailyQuote) return;
    onCopyQuote(dailyQuote);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format today's date nicely (e.g., Monday, November 16, 2026)
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  if (!dailyQuote) return null;

  return (
    <section className="daily-quote-section" id="daily-spark-section">
      <div className="daily-quote-card glass-panel">
        <div className="daily-glow-strip" />

        <div className="daily-header">
          <div className="daily-badge">
            <Compass size={15} className="compass-icon" />
            <span>DAILY SPARK FOR TODAY</span>
          </div>

          <div className="daily-date">
            <Calendar size={14} />
            <span>{formattedDate}</span>
          </div>
        </div>

        <div className="daily-body">
          <blockquote className="daily-quote-text">
            "{dailyQuote.text}"
          </blockquote>

          <div className="daily-author-row">
            <span className="author-dash">—</span>
            <span className="daily-author-name">{dailyQuote.author}</span>
            <span className="daily-category-tag">{dailyQuote.category}</span>
          </div>
        </div>

        <div className="daily-footer">
          <div className="daily-note">
            <Info size={14} className="daily-note-icon" />
            <span>Curated algorithmically for this calendar date. Stays locked for 24 hours.</span>
          </div>

          <div className="daily-actions">
            <button
              className={`btn-icon ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
              title="Copy Daily Quote"
              aria-label="Copy Daily Quote"
            >
              {copied ? <Check size={17} className="text-success" /> : <Copy size={17} />}
            </button>

            <button
              className={`btn-icon fav-btn ${isFavorite ? 'active' : ''}`}
              onClick={() => onToggleFavorite(dailyQuote)}
              title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
              aria-label="Toggle favorite for daily quote"
            >
              <Heart size={17} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>

            <button
              className="btn-icon"
              onClick={() => onShareQuote(dailyQuote)}
              title="Share Daily Quote"
              aria-label="Share Daily Quote"
            >
              <Share2 size={17} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
