import React, { useState } from 'react';
import {
  Quote,
  Sparkles,
  Copy,
  Check,
  Heart,
  Share2,
  Volume2,
  VolumeX,
  Tag,
  Wifi,
  WifiOff,
  Twitter
} from 'lucide-react';
import './QuoteCard.css';

export default function QuoteCard({
  quote,
  isLoading,
  onGenerateNew,
  isFavorite,
  onToggleFavorite,
  onCopyQuote,
  onShareQuote
}) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Handle Copy with local feedback
  const handleCopy = () => {
    if (!quote) return;
    onCopyQuote(quote);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Text to speech (Web Speech API)
  const handleToggleSpeech = () => {
    if (!quote || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel(); // Reset any ongoing utterances
    const textToRead = `"${quote.text}" by ${quote.author}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Twitter / X Intent
  const handleTweet = () => {
    if (!quote) return;
    const tweetText = encodeURIComponent(`"${quote.text}" — ${quote.author}\n\nVia QuoteVault`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="quote-card-container">
      <div className={`quote-card glass-panel ${isLoading ? 'card-loading' : ''}`}>
        
        {/* Glow ambient background element */}
        <div className="quote-card-glow" />

        {/* Top Meta Header: Category & Source Indicator */}
        <div className="quote-card-header">
          <div className="quote-category-badge">
            <Tag size={13} />
            <span>{quote?.category || 'Inspiration'}</span>
          </div>

          <div
            className={`source-badge ${quote?.isFallback ? 'source-fallback' : 'source-live'}`}
            title={
              quote?.isFallback
                ? 'Served from QuoteVault curated offline collection'
                : 'Fetched in real-time from public Quote API'
            }
          >
            {quote?.isFallback ? (
              <>
                <WifiOff size={13} />
                <span>Curated Collection</span>
              </>
            ) : (
              <>
                <Wifi size={13} />
                <span>Live API</span>
              </>
            )}
          </div>
        </div>

        {/* Quote Content Section */}
        <div className="quote-card-body">
          <div className="quote-decorative-icon" aria-hidden="true">
            <Quote size={56} className="quote-icon-mark" />
          </div>

          <div className="quote-text-wrapper">
            {isLoading ? (
              <div className="quote-skeleton">
                <div className="skeleton-line line-1" />
                <div className="skeleton-line line-2" />
                <div className="skeleton-line line-3" />
                <div className="skeleton-line skeleton-author" />
              </div>
            ) : (
              <>
                <blockquote className="quote-text">
                  "{quote?.text}"
                </blockquote>

                <div className="quote-author-row">
                  <span className="author-dash">—</span>
                  <cite className="quote-author-name">{quote?.author || 'Unknown'}</cite>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Controls Toolbar */}
        <div className="quote-card-footer">
          {/* Main Generate Spark Button */}
          <button
            className="btn-primary generate-spark-btn"
            onClick={onGenerateNew}
            disabled={isLoading}
            aria-label="Generate a new inspirational quote"
          >
            <Sparkles size={18} className={isLoading ? 'animate-spin' : 'sparkle-icon'} />
            <span>{isLoading ? 'Fetching Inspiration...' : 'New Spark'}</span>
          </button>

          {/* Secondary Utilities */}
          <div className="quote-actions-group">
            {/* Copy Button */}
            <button
              className={`btn-icon ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
              disabled={isLoading || !quote}
              title={copied ? 'Copied to clipboard!' : 'Copy quote'}
              aria-label="Copy quote to clipboard"
            >
              {copied ? <Check size={18} className="text-success" /> : <Copy size={18} />}
            </button>

            {/* Favorite Button */}
            <button
              className={`btn-icon fav-btn ${isFavorite ? 'active' : ''}`}
              onClick={() => onToggleFavorite(quote)}
              disabled={isLoading || !quote}
              title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
              aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Heart
                size={18}
                fill={isFavorite ? 'currentColor' : 'none'}
                className={isFavorite ? 'heart-pop' : ''}
              />
            </button>

            {/* Listen / Text-to-Speech Button */}
            <button
              className={`btn-icon ${isSpeaking ? 'active' : ''}`}
              onClick={handleToggleSpeech}
              disabled={isLoading || !quote}
              title={isSpeaking ? 'Stop speech' : 'Listen to quote'}
              aria-label="Listen to quote audio"
            >
              {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            {/* Tweet Share */}
            <button
              className="btn-icon"
              onClick={handleTweet}
              disabled={isLoading || !quote}
              title="Share on Twitter / X"
              aria-label="Share quote on Twitter"
            >
              <Twitter size={18} />
            </button>

            {/* Web Share API */}
            <button
              className="btn-icon"
              onClick={() => onShareQuote(quote)}
              disabled={isLoading || !quote}
              title="Share quote"
              aria-label="Share quote"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
