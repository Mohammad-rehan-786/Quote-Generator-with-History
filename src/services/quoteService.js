import { getRandomFallbackQuote } from '../utils/fallbackQuotes';

// Concurrency lock to prevent duplicate simultaneous API requests
let isFetching = false;
let lastQuoteId = null;

const TIMEOUT_MS = 6000;

/**
 * Fetch a quote from public APIs with timeout and fallback protection
 * Normalizes output into a unified Quote Vault schema.
 */
export async function fetchRandomQuote() {
  if (isFetching) {
    throw new Error('A quote request is already in progress.');
  }

  isFetching = true;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    // Attempt Primary API: DummyJSON quotes (Reliable, fast, browser CORS enabled)
    try {
      const response = await fetch('https://dummyjson.com/quotes/random', {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        clearTimeout(timeoutId);

        if (data && data.quote && data.author) {
          const normalized = {
            id: `api-dj-${data.id}`,
            text: data.quote.trim(),
            author: data.author.trim() || 'Unknown Author',
            category: 'Inspiration',
            source: 'Live API',
            isFallback: false,
            timestamp: new Date().toISOString()
          };
          lastQuoteId = normalized.id;
          return normalized;
        }
      }
    } catch (primaryErr) {
      console.warn('[QuoteVault] Primary API failed, trying backup API...', primaryErr.message);
    }

    // Attempt Secondary API: Quotable.io
    try {
      const response = await fetch('https://api.quotable.io/quotes/random', {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        clearTimeout(timeoutId);

        // Quotable may return an array of 1 quote or an object
        const item = Array.isArray(data) ? data[0] : data;
        if (item && (item.content || item.quote)) {
          const category = (item.tags && item.tags.length > 0)
            ? item.tags[0].charAt(0).toUpperCase() + item.tags[0].slice(1)
            : 'Wisdom';

          const normalized = {
            id: `api-qb-${item._id || item.id || Date.now()}`,
            text: (item.content || item.quote).trim(),
            author: (item.author || 'Unknown Author').trim(),
            category,
            source: 'Live API',
            isFallback: false,
            timestamp: new Date().toISOString()
          };
          lastQuoteId = normalized.id;
          return normalized;
        }
      }
    } catch (secErr) {
      console.warn('[QuoteVault] Backup API also failed or timed out:', secErr.message);
    }

    // Both network calls failed / timed out / offline. Use curated collection.
    clearTimeout(timeoutId);
    console.info('[QuoteVault] Serving high-quality curated quote from offline collection.');
    const fallback = getRandomFallbackQuote(lastQuoteId);
    lastQuoteId = fallback.id;
    return fallback;

  } catch (error) {
    clearTimeout(timeoutId);
    console.warn('[QuoteVault] Handled error in fetchRandomQuote, falling back:', error.message);
    const fallback = getRandomFallbackQuote(lastQuoteId);
    lastQuoteId = fallback.id;
    return fallback;
  } finally {
    clearTimeout(timeoutId);
    isFetching = false;
  }
}

/**
 * Returns current in-flight status
 */
export function isQuoteFetching() {
  return isFetching;
}
