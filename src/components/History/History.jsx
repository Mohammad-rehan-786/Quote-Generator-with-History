import React, { useState, useMemo } from 'react';
import {
  History as HistoryIcon,
  Search,
  Filter,
  Trash2,
  Copy,
  Check,
  Heart,
  Share2,
  Clock,
  Tag,
  Wifi,
  WifiOff,
  RotateCcw,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import './History.css';

export default function History({
  history,
  favorites,
  onDeleteHistoryItem,
  onClearHistory,
  onToggleFavorite,
  onCopyQuote,
  onShareQuote,
  onJumpToGenerator
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSource, setSelectedSource] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'author'
  const [copiedId, setCopiedId] = useState(null);

  // Extract all unique categories from history
  const categories = useMemo(() => {
    const set = new Set();
    history.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ['ALL', ...Array.from(set)];
  }, [history]);

  // Filter and sort history
  const filteredHistory = useMemo(() => {
    let result = [...history];

    // Search query filter (quote text or author)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.text.toLowerCase().includes(q) ||
          (item.author && item.author.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== 'ALL') {
      result = result.filter(
        (item) => item.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Source filter
    if (selectedSource !== 'ALL') {
      if (selectedSource === 'API') {
        result = result.filter((item) => !item.isFallback);
      } else if (selectedSource === 'FALLBACK') {
        result = result.filter((item) => item.isFallback);
      }
    }

    // Sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    } else if (sortBy === 'author') {
      result.sort((a, b) => (a.author || '').localeCompare(b.author || ''));
    }

    return result;
  }, [history, searchQuery, selectedCategory, selectedSource, sortBy]);

  // Check if a quote is currently favorited
  const checkIsFav = (quote) => {
    return favorites.some(
      (f) =>
        f.id === quote.id ||
        (f.text?.trim().toLowerCase() === quote.text?.trim().toLowerCase() &&
          f.author?.trim().toLowerCase() === quote.author?.trim().toLowerCase())
    );
  };

  const handleCopy = (item) => {
    onCopyQuote(item);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedSource('ALL');
    setSortBy('newest');
  };

  const formatTimestamp = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }).format(date);
    } catch {
      return '';
    }
  };

  return (
    <section className="history-section" id="vault-history">
      {/* Section Header */}
      <div className="section-header-row">
        <div>
          <div className="section-pill">
            <HistoryIcon size={14} />
            <span>LOCAL PERSISTENCE VAULT</span>
          </div>
          <h2 className="section-title">Quote History</h2>
          <p className="section-subtitle">
            Every inspirational spark you discover is automatically cataloged in browser storage.
          </p>
        </div>

        {history.length > 0 && (
          <button
            className="btn-clear-history"
            onClick={onClearHistory}
            aria-label="Clear all history"
          >
            <Trash2 size={16} />
            <span>Clear Vault ({history.length})</span>
          </button>
        )}
      </div>

      {/* Filter and Search Controls Bar */}
      {history.length > 0 && (
        <div className="history-controls-panel glass-panel">
          {/* Search Box */}
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by quote words or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search saved quotes"
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
              >
                ×
              </button>
            )}
          </div>

          <div className="filters-row">
            {/* Category Select */}
            <div className="control-group">
              <label htmlFor="history-cat-select" className="control-label">
                <Tag size={13} />
                <span>Category:</span>
              </label>
              <select
                id="history-cat-select"
                className="control-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'ALL' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Source Select */}
            <div className="control-group">
              <label htmlFor="history-source-select" className="control-label">
                <Filter size={13} />
                <span>Source:</span>
              </label>
              <select
                id="history-source-select"
                className="control-select"
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
              >
                <option value="ALL">All Sources</option>
                <option value="API">Live API Only</option>
                <option value="FALLBACK">Curated Collection</option>
              </select>
            </div>

            {/* Sort Select */}
            <div className="control-group">
              <label htmlFor="history-sort-select" className="control-label">
                <ArrowUpDown size={13} />
                <span>Sort:</span>
              </label>
              <select
                id="history-sort-select"
                className="control-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="author">Author (A-Z)</option>
              </select>
            </div>

            {/* Reset Filters button if any filter active */}
            {(searchQuery || selectedCategory !== 'ALL' || selectedSource !== 'ALL' || sortBy !== 'newest') && (
              <button
                className="btn-reset-filters"
                onClick={handleResetFilters}
                title="Reset all filters"
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Results Counter */}
          <div className="results-counter">
            <span>
              Showing <strong>{filteredHistory.length}</strong> of{' '}
              <strong>{history.length}</strong> quotes
            </span>
          </div>
        </div>
      )}

      {/* History Cards Grid */}
      {history.length === 0 ? (
        <div className="empty-state-card glass-panel">
          <div className="empty-icon-wrap">
            <Sparkles size={36} className="empty-spark-icon" />
          </div>
          <h3 className="empty-title">Your Vault is Empty</h3>
          <p className="empty-desc">
            You haven't generated any quotes yet. Spark your curiosity by generating your first quote above!
          </p>
          <button className="btn-primary" onClick={onJumpToGenerator}>
            <Sparkles size={16} />
            <span>Generate First Quote</span>
          </button>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="empty-state-card glass-panel">
          <div className="empty-icon-wrap">
            <Search size={36} />
          </div>
          <h3 className="empty-title">No Matching Quotes Found</h3>
          <p className="empty-desc">
            No saved quotes match your current filter or search term "{searchQuery}".
          </p>
          <button className="btn-secondary" onClick={handleResetFilters}>
            <RotateCcw size={16} />
            <span>Reset Search & Filters</span>
          </button>
        </div>
      ) : (
        <div className="history-grid">
          {filteredHistory.map((item) => {
            const isFav = checkIsFav(item);
            const isCopied = copiedId === item.id;

            return (
              <article key={item.id} className="history-card glass-panel">
                <div className="history-card-top">
                  <span className="history-category-badge">
                    {item.category || 'Wisdom'}
                  </span>

                  <div className="history-card-meta-right">
                    <span
                      className={`history-source-tag ${
                        item.isFallback ? 'tag-fallback' : 'tag-api'
                      }`}
                      title={item.isFallback ? 'Curated Collection' : 'Live API'}
                    >
                      {item.isFallback ? <WifiOff size={11} /> : <Wifi size={11} />}
                      <span>{item.isFallback ? 'Curated' : 'API'}</span>
                    </span>

                    <span className="history-timestamp">
                      <Clock size={11} />
                      <span>{formatTimestamp(item.timestamp)}</span>
                    </span>
                  </div>
                </div>

                <blockquote className="history-quote-text">
                  "{item.text}"
                </blockquote>

                <div className="history-card-author">
                  <span>— {item.author || 'Unknown'}</span>
                </div>

                <div className="history-card-actions">
                  <div className="history-actions-left">
                    <button
                      className={`btn-icon btn-sm ${isCopied ? 'copied' : ''}`}
                      onClick={() => handleCopy(item)}
                      title={isCopied ? 'Copied!' : 'Copy Quote'}
                      aria-label="Copy Quote"
                    >
                      {isCopied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                    </button>

                    <button
                      className={`btn-icon btn-sm fav-btn ${isFav ? 'active' : ''}`}
                      onClick={() => onToggleFavorite(item)}
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                      aria-label="Toggle Favorite"
                    >
                      <Heart size={14} fill={isFav ? 'currentColor' : 'none'} />
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

                  <button
                    className="btn-icon btn-sm btn-delete-item"
                    onClick={() => onDeleteHistoryItem(item.id)}
                    title="Delete from history"
                    aria-label="Delete quote from history"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
