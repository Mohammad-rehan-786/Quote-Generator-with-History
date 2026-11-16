import React, { useState, useMemo } from 'react';
import { Heart, Search, Copy, Check, Share2, Trash2, Sparkles, Tag, Clock } from 'lucide-react';
import './Favorites.css';

export default function Favorites({
  favorites,
  onToggleFavorite,
  onCopyQuote,
  onShareQuote,
  onJumpToGenerator
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const filteredFavorites = useMemo(() => {
    if (!searchQuery.trim()) return favorites;
    const q = searchQuery.toLowerCase().trim();
    return favorites.filter(
      (item) =>
        item.text.toLowerCase().includes(q) ||
        (item.author && item.author.toLowerCase().includes(q))
    );
  }, [favorites, searchQuery]);

  const handleCopy = (item) => {
    onCopyQuote(item);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="favorites-section" id="vault-favorites">
      {/* Header */}
      <div className="section-header-row">
        <div>
          <div className="section-pill fav-pill">
            <Heart size={14} fill="currentColor" />
            <span>CURATED INSPIRATIONS</span>
          </div>
          <h2 className="section-title">Favorite Quotes</h2>
          <p className="section-subtitle">
            Your hand-picked collection of timeless quotes that resonate with you most.
          </p>
        </div>

        <div className="fav-count-badge">
          <span>{favorites.length} Saved</span>
        </div>
      </div>

      {/* Search Bar if favorites exist */}
      {favorites.length > 0 && (
        <div className="fav-search-wrap glass-panel">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search within your favorite quotes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search favorite quotes"
          />
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      )}

      {/* Grid or Empty State */}
      {favorites.length === 0 ? (
        <div className="empty-state-card glass-panel">
          <div className="empty-icon-wrap fav-empty-icon">
            <Heart size={36} fill="rgba(236, 72, 153, 0.4)" color="#ec4899" />
          </div>
          <h3 className="empty-title">No Favorites Yet</h3>
          <p className="empty-desc">
            Whenever a quote moves you, tap the heart icon on any card to save it to your personal favorites vault.
          </p>
          <button className="btn-primary" onClick={onJumpToGenerator}>
            <Sparkles size={16} />
            <span>Explore & Favorite Quotes</span>
          </button>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="empty-state-card glass-panel">
          <div className="empty-icon-wrap">
            <Search size={36} />
          </div>
          <h3 className="empty-title">No Favorites Match</h3>
          <p className="empty-desc">
            No favorite quotes match your search term "{searchQuery}".
          </p>
          <button className="btn-secondary" onClick={() => setSearchQuery('')}>
            <span>Clear Search</span>
          </button>
        </div>
      ) : (
        <div className="favorites-grid">
          {filteredFavorites.map((item) => {
            const isCopied = copiedId === item.id;
            return (
              <article key={item.id} className="fav-card glass-panel">
                <div className="fav-card-glow" />

                <div className="fav-card-top">
                  <span className="fav-tag">
                    <Tag size={12} />
                    <span>{item.category || 'Wisdom'}</span>
                  </span>

                  <button
                    className="fav-remove-btn"
                    onClick={() => onToggleFavorite(item)}
                    title="Remove from favorites"
                    aria-label="Remove from favorites"
                  >
                    <Heart size={16} fill="currentColor" />
                  </button>
                </div>

                <blockquote className="fav-quote-text">
                  "{item.text}"
                </blockquote>

                <div className="fav-author">
                  <span>— {item.author || 'Unknown'}</span>
                </div>

                <div className="fav-card-footer">
                  <span className="fav-saved-label">
                    <Clock size={11} />
                    <span>Favorited</span>
                  </span>

                  <div className="fav-actions">
                    <button
                      className={`btn-icon btn-sm ${isCopied ? 'copied' : ''}`}
                      onClick={() => handleCopy(item)}
                      title={isCopied ? 'Copied!' : 'Copy Quote'}
                      aria-label="Copy Quote"
                    >
                      {isCopied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                    </button>

                    <button
                      className="btn-icon btn-sm"
                      onClick={() => onShareQuote(item)}
                      title="Share Quote"
                      aria-label="Share Quote"
                    >
                      <Share2 size={14} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
