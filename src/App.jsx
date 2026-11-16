import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import QuoteCard from './components/QuoteCard/QuoteCard';
import DailyQuote from './components/DailyQuote/DailyQuote';
import History from './components/History/History';
import Favorites from './components/Favorites/Favorites';
import Stats from './components/Stats/Stats';
import Toast from './components/Toast/Toast';
import ConfirmModal from './components/ConfirmModal/ConfirmModal';

import { useLocalStorage } from './hooks/useLocalStorage';
import { fetchRandomQuote } from './services/quoteService';
import {
  STORAGE_KEYS,
  saveQuoteToHistory,
  deleteHistoryItem,
  clearAllHistory,
  toggleFavorite,
  isQuoteFavorite,
  getDailyQuote,
  getStats
} from './utils/storage';
import { FALLBACK_QUOTES } from './utils/fallbackQuotes';
import './App.css';

export default function App() {
  // Theme state persisted in localStorage
  const [theme, setTheme] = useLocalStorage(STORAGE_KEYS.THEME, 'dark');

  // Vault data state
  const [history, setHistory] = useLocalStorage(STORAGE_KEYS.HISTORY, []);
  const [favorites, setFavorites] = useLocalStorage(STORAGE_KEYS.FAVORITES, []);
  const [stats, setStats] = useLocalStorage(STORAGE_KEYS.STATS, { totalGenerated: 0 });

  // App UI state
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' | 'daily' | 'history' | 'favorites' | 'stats'
  const [currentQuote, setCurrentQuote] = useState(() => {
    // Initial quote from history or initial fallback quote
    if (history.length > 0) return history[0];
    return {
      ...FALLBACK_QUOTES[0],
      isFallback: true,
      timestamp: new Date().toISOString()
    };
  });
  const [dailyQuote, setDailyQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  // References for scrolling
  const generatorSectionRef = useRef(null);

  // Apply theme to html root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Load daily quote on mount
  useEffect(() => {
    const todaySpark = getDailyQuote();
    setDailyQuote(todaySpark);
  }, []);

  // Fetch initial quote if none existed
  useEffect(() => {
    if (history.length === 0) {
      handleGenerateQuote(true);
    }
  }, []);

  // Toast notification helper
  const showToast = useCallback((message, type = 'info') => {
    setToast({ id: Date.now(), message, type });
  }, []);

  // Theme toggle
  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    showToast(`Switched to ${nextTheme === 'dark' ? 'Midnight Aurora' : 'Aurora Dawn'} theme`, 'info');
  };

  // Generate new quote
  const handleGenerateQuote = async (isInitial = false) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const quote = await fetchRandomQuote();
      setCurrentQuote(quote);

      // Automatically persist to localStorage history with deduplication
      const { history: updatedHistory, isNew } = saveQuoteToHistory(quote);
      setHistory(updatedHistory);
      setStats(getStats());

      if (!isInitial) {
        if (quote.isFallback) {
          showToast('Served inspiring quote from curated collection', 'info');
        } else {
          showToast(isNew ? 'New quote added to your vault!' : 'Quote refreshed in history!', 'success');
        }
      }
    } catch (err) {
      console.error('Error generating quote:', err);
      showToast('Unable to fetch quote. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle favorite
  const handleToggleFavorite = (quote) => {
    if (!quote) return;
    const { favorites: updatedFavorites, isFav } = toggleFavorite(quote);
    setFavorites(updatedFavorites);

    if (isFav) {
      showToast('Added to your favorite quotes!', 'favorite');
    } else {
      showToast('Removed from favorites', 'info');
    }
  };

  // Copy quote to clipboard
  const handleCopyQuote = async (quote) => {
    if (!quote) return;
    const textToCopy = `"${quote.text}" — ${quote.author}`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      showToast('Quote copied to clipboard!', 'success');
    } catch (err) {
      console.warn('Copy failed:', err);
      showToast('Could not copy to clipboard', 'error');
    }
  };

  // Share quote
  const handleShareQuote = async (quote) => {
    if (!quote) return;
    const shareData = {
      title: 'QuoteVault Daily Spark',
      text: `"${quote.text}" — ${quote.author}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast('Shared successfully!', 'success');
      } catch (err) {
        // User aborted share or browser rejected
        if (err.name !== 'AbortError') {
          handleCopyQuote(quote);
        }
      }
    } else {
      // Fallback to clipboard
      handleCopyQuote(quote);
      showToast('Web Share not supported; quote copied instead!', 'info');
    }
  };

  // Delete individual history item
  const handleDeleteHistoryItem = (id) => {
    const updated = deleteHistoryItem(id);
    setHistory(updated);
    showToast('Quote removed from history', 'info');
  };

  // Clear all history
  const handleConfirmClearAll = () => {
    clearAllHistory();
    setHistory([]);
    setIsClearModalOpen(false);
    showToast('Vault history cleared successfully', 'info');
  };

  // Quick jump helper
  const handleJumpToGenerator = () => {
    setActiveTab('generator');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleJumpToHistory = () => {
    setActiveTab('history');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isCurrentFavorite = isQuoteFavorite(currentQuote, favorites);
  const isDailyFavorite = isQuoteFavorite(dailyQuote, favorites);

  return (
    <div className="app-layout">
      {/* Aurora Ambient Background Effect */}
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-orb aurora-orb-1" />
        <div className="aurora-orb aurora-orb-2" />
        <div className="aurora-orb aurora-orb-3" />
        <div className="aurora-grid-overlay" />
      </div>

      {/* Sticky Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        historyCount={history.length}
        favoritesCount={favorites.length}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area */}
      <main className="main-content container">
        {/* Render Tab Views or Main Showcase */}
        {activeTab === 'generator' && (
          <>
            <Hero
              onGenerateClick={() => handleGenerateQuote(false)}
              onExploreHistoryClick={handleJumpToHistory}
            />

            <div ref={generatorSectionRef} id="generator-card">
              <QuoteCard
                quote={currentQuote}
                isLoading={isLoading}
                onGenerateNew={() => handleGenerateQuote(false)}
                isFavorite={isCurrentFavorite}
                onToggleFavorite={handleToggleFavorite}
                onCopyQuote={handleCopyQuote}
                onShareQuote={handleShareQuote}
              />
            </div>

            {/* Quick Preview of Daily Quote underneath generator */}
            {dailyQuote && (
              <DailyQuote
                dailyQuote={dailyQuote}
                isFavorite={isDailyFavorite}
                onToggleFavorite={handleToggleFavorite}
                onCopyQuote={handleCopyQuote}
                onShareQuote={handleShareQuote}
              />
            )}
          </>
        )}

        {activeTab === 'daily' && (
          <div className="tab-view-container animate-fade-in">
            <DailyQuote
              dailyQuote={dailyQuote}
              isFavorite={isDailyFavorite}
              onToggleFavorite={handleToggleFavorite}
              onCopyQuote={handleCopyQuote}
              onShareQuote={handleShareQuote}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="tab-view-container animate-fade-in">
            <History
              history={history}
              favorites={favorites}
              onDeleteHistoryItem={handleDeleteHistoryItem}
              onClearHistory={() => setIsClearModalOpen(true)}
              onToggleFavorite={handleToggleFavorite}
              onCopyQuote={handleCopyQuote}
              onShareQuote={handleShareQuote}
              onJumpToGenerator={handleJumpToGenerator}
            />
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="tab-view-container animate-fade-in">
            <Favorites
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onCopyQuote={handleCopyQuote}
              onShareQuote={handleShareQuote}
              onJumpToGenerator={handleJumpToGenerator}
            />
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="tab-view-container animate-fade-in">
            <Stats history={history} favorites={favorites} stats={stats} />
          </div>
        )}
      </main>

      {/* Modern Footer */}
      <footer className="app-footer">
        <div className="container footer-container">
          <div className="footer-left">
            <span className="footer-brand gradient-text">QuoteVault</span>
            <p className="footer-copyright">
              Built with precision for Virtual Web Development Internship • 100% Backendless Architecture
            </p>
          </div>
          <div className="footer-right">
            <span className="footer-badge">React 18 + Vite + Vanilla CSS + localStorage</span>
          </div>
        </div>
      </footer>

      {/* Global Toast Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Clear All Confirmation Modal */}
      <ConfirmModal
        isOpen={isClearModalOpen}
        title="Clear Entire History Vault?"
        message="This action will permanently delete all saved quotes from your browser's localStorage. This cannot be undone."
        onConfirm={handleConfirmClearAll}
        onCancel={() => setIsClearModalOpen(false)}
      />
    </div>
  );
}
