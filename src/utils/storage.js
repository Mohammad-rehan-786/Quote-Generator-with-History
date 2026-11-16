import { getDailyQuoteForDate } from './fallbackQuotes';

export const STORAGE_KEYS = {
  HISTORY: 'quotevault_history',
  FAVORITES: 'quotevault_favorites',
  THEME: 'quotevault_theme',
  STATS: 'quotevault_stats',
  DAILY_QUOTE: 'quotevault_daily_quote'
};

/**
 * Safely parse JSON from localStorage with fallback
 */
export function getStorageItem(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) return defaultValue;
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`[QuoteVault] Error parsing localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Safely stringify and write to localStorage
 */
export function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Trigger custom event so reactive components in same window can update if needed
    window.dispatchEvent(new Event('quotevault_storage_changed'));
    return true;
  } catch (error) {
    console.error(`[QuoteVault] Error writing to localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Normalize quote for deduplication checks
 */
export function getQuoteSignature(quote) {
  if (!quote || !quote.text) return '';
  const cleanText = quote.text.trim().toLowerCase().replace(/[^\w\s]/g, '');
  const cleanAuthor = (quote.author || 'Unknown').trim().toLowerCase();
  return `${cleanText}___${cleanAuthor}`;
}

/**
 * Save quote to history with automatic deduplication.
 * If quote already exists, bumps it to the top with an updated timestamp.
 * Returns the updated history array and whether it was a new record.
 */
export function saveQuoteToHistory(quote) {
  if (!quote || !quote.text) return { history: [], isNew: false };

  const history = getStorageItem(STORAGE_KEYS.HISTORY, []);
  const signature = getQuoteSignature(quote);
  const now = new Date().toISOString();

  const existingIndex = history.findIndex(
    (item) => getQuoteSignature(item) === signature
  );

  let updatedHistory;
  let isNew = false;

  if (existingIndex !== -1) {
    // Duplicate detected: update timestamp & bump to top
    const existing = history[existingIndex];
    const updatedItem = {
      ...existing,
      ...quote,
      id: existing.id || quote.id,
      timestamp: now,
      lastSeen: now
    };
    updatedHistory = [
      updatedItem,
      ...history.slice(0, existingIndex),
      ...history.slice(existingIndex + 1)
    ];
  } else {
    // New quote record
    isNew = true;
    const newRecord = {
      ...quote,
      id: quote.id || `quote-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: now,
      lastSeen: now
    };
    updatedHistory = [newRecord, ...history];
  }

  setStorageItem(STORAGE_KEYS.HISTORY, updatedHistory);
  recordQuoteGenerated();
  return { history: updatedHistory, isNew };
}

/**
 * Delete a single quote from history by ID
 */
export function deleteHistoryItem(id) {
  const history = getStorageItem(STORAGE_KEYS.HISTORY, []);
  const updated = history.filter((item) => item.id !== id);
  setStorageItem(STORAGE_KEYS.HISTORY, updated);
  return updated;
}

/**
 * Clear all history entries
 */
export function clearAllHistory() {
  setStorageItem(STORAGE_KEYS.HISTORY, []);
  return [];
}

/**
 * Favorites Management
 */
export function getFavorites() {
  return getStorageItem(STORAGE_KEYS.FAVORITES, []);
}

export function isQuoteFavorite(quote, favoritesList = null) {
  if (!quote) return false;
  const list = favoritesList || getFavorites();
  const sig = getQuoteSignature(quote);
  return list.some(
    (fav) => fav.id === quote.id || getQuoteSignature(fav) === sig
  );
}

export function toggleFavorite(quote) {
  if (!quote || !quote.text) return { favorites: [], isFav: false };

  const favorites = getFavorites();
  const sig = getQuoteSignature(quote);
  const existingIndex = favorites.findIndex(
    (fav) => fav.id === quote.id || getQuoteSignature(fav) === sig
  );

  let updated;
  let isFav;

  if (existingIndex !== -1) {
    // Remove from favorites
    updated = favorites.filter((_, idx) => idx !== existingIndex);
    isFav = false;
  } else {
    // Add to favorites
    const favItem = {
      ...quote,
      id: quote.id || `fav-${Date.now()}`,
      favoritedAt: new Date().toISOString()
    };
    updated = [favItem, ...favorites];
    isFav = true;
  }

  setStorageItem(STORAGE_KEYS.FAVORITES, updated);
  return { favorites: updated, isFav };
}

/**
 * Stats Management
 * Tracks totalGenerated count independently of unique history count.
 */
export function getStats() {
  const defaultStats = { totalGenerated: 0 };
  return getStorageItem(STORAGE_KEYS.STATS, defaultStats);
}

export function recordQuoteGenerated() {
  const current = getStats();
  const updated = {
    ...current,
    totalGenerated: (current.totalGenerated || 0) + 1
  };
  setStorageItem(STORAGE_KEYS.STATS, updated);
  return updated;
}

/**
 * Daily Quote Management
 * Returns today's quote, generating and caching it if not already set.
 */
export function getDailyQuote() {
  const today = new Date().toISOString().split('T')[0];
  const cached = getStorageItem(STORAGE_KEYS.DAILY_QUOTE, null);

  if (cached && cached.dateKey === today) {
    return cached;
  }

  // Generate today's deterministic daily quote
  const newDaily = getDailyQuoteForDate(today);
  setStorageItem(STORAGE_KEYS.DAILY_QUOTE, newDaily);
  return newDaily;
}
