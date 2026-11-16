/**
 * Curated Collection of high-quality inspirational fallback quotes.
 * Used when offline, during network errors, API rate-limiting,
 * or as a seed collection for the daily quote algorithm.
 */
export const FALLBACK_QUOTES = [
  {
    id: "fq-1",
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "Success",
    source: "Curated Collection"
  },
  {
    id: "fq-2",
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    category: "Wisdom",
    source: "Curated Collection"
  },
  {
    id: "fq-3",
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
    category: "Perseverance",
    source: "Curated Collection"
  },
  {
    id: "fq-4",
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "Inspiration",
    source: "Curated Collection"
  },
  {
    id: "fq-5",
    text: "Happiness is not something readymade. It comes from your own actions.",
    author: "Dalai Lama",
    category: "Mindfulness",
    source: "Curated Collection"
  },
  {
    id: "fq-6",
    text: "Do what you can, with what you have, where you are.",
    author: "Theodore Roosevelt",
    category: "Action",
    source: "Curated Collection"
  },
  {
    id: "fq-7",
    text: "Everything you've ever wanted is on the other side of fear.",
    author: "George Addair",
    category: "Courage",
    source: "Curated Collection"
  },
  {
    id: "fq-8",
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "Perseverance",
    source: "Curated Collection"
  },
  {
    id: "fq-9",
    text: "Creativity is intelligence having fun.",
    author: "Albert Einstein",
    category: "Creativity",
    source: "Curated Collection"
  },
  {
    id: "fq-10",
    text: "You must be the change you wish to see in the world.",
    author: "Mahatma Gandhi",
    category: "Leadership",
    source: "Curated Collection"
  },
  {
    id: "fq-11",
    text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.",
    author: "Mother Teresa",
    category: "Compassion",
    source: "Curated Collection"
  },
  {
    id: "fq-12",
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
    category: "Wisdom",
    source: "Curated Collection"
  },
  {
    id: "fq-13",
    text: "An unexamined life is not worth living.",
    author: "Socrates",
    category: "Philosophy",
    source: "Curated Collection"
  },
  {
    id: "fq-14",
    text: "Your time is limited, so don't waste it living someone else's life.",
    author: "Steve Jobs",
    category: "Life",
    source: "Curated Collection"
  },
  {
    id: "fq-15",
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: "Confidence",
    source: "Curated Collection"
  },
  {
    id: "fq-16",
    text: "Turn your wounds into wisdom.",
    author: "Oprah Winfrey",
    category: "Wisdom",
    source: "Curated Collection"
  },
  {
    id: "fq-17",
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    category: "Productivity",
    source: "Curated Collection"
  },
  {
    id: "fq-18",
    text: "Simplicity is the soul of efficiency.",
    author: "Austin Freeman",
    category: "Design",
    source: "Curated Collection"
  },
  {
    id: "fq-19",
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Will Durant",
    category: "Habits",
    source: "Curated Collection"
  },
  {
    id: "fq-20",
    text: "Doubt kills more dreams than failure ever will.",
    author: "Suzy Kassem",
    category: "Courage",
    source: "Curated Collection"
  },
  {
    id: "fq-21",
    text: "Keep your face always toward the sunshine—and shadows will fall behind you.",
    author: "Walt Whitman",
    category: "Optimism",
    source: "Curated Collection"
  },
  {
    id: "fq-22",
    text: "Act as if what you do makes a difference. It does.",
    author: "William James",
    category: "Impact",
    source: "Curated Collection"
  },
  {
    id: "fq-23",
    text: "What you get by achieving your goals is not as important as what you become by achieving your goals.",
    author: "Zig Ziglar",
    category: "Growth",
    source: "Curated Collection"
  },
  {
    id: "fq-24",
    text: "Hardships often prepare ordinary people for an extraordinary destiny.",
    author: "C.S. Lewis",
    category: "Perseverance",
    source: "Curated Collection"
  },
  {
    id: "fq-25",
    text: "Light tomorrow with today.",
    author: "Elizabeth Barrett Browning",
    category: "Inspiration",
    source: "Curated Collection"
  },
  {
    id: "fq-26",
    text: "Don't count the days, make the days count.",
    author: "Muhammad Ali",
    category: "Action",
    source: "Curated Collection"
  },
  {
    id: "fq-27",
    text: "Never let the fear of striking out keep you from playing the game.",
    author: "Babe Ruth",
    category: "Courage",
    source: "Curated Collection"
  },
  {
    id: "fq-28",
    text: "Peace begins with a smile.",
    author: "Mother Teresa",
    category: "Mindfulness",
    source: "Curated Collection"
  },
  {
    id: "fq-29",
    text: "Life is what happens when you're busy making other plans.",
    author: "John Lennon",
    category: "Life",
    source: "Curated Collection"
  },
  {
    id: "fq-30",
    text: "Wisdom begins in wonder.",
    author: "Socrates",
    category: "Philosophy",
    source: "Curated Collection"
  }
];

/**
 * Get a random fallback quote, optionally avoiding the current quote ID.
 */
export function getRandomFallbackQuote(excludeId = null) {
  const pool = excludeId 
    ? FALLBACK_QUOTES.filter((q) => q.id !== excludeId)
    : FALLBACK_QUOTES;
  const quote = pool[Math.floor(Math.random() * pool.length)] || FALLBACK_QUOTES[0];
  
  return {
    ...quote,
    timestamp: new Date().toISOString(),
    isFallback: true
  };
}

/**
 * Returns a deterministic quote for the current local calendar date (YYYY-MM-DD).
 * Ensures the daily spark quote stays stable throughout the user's day.
 */
export function getDailyQuoteForDate(dateString = null) {
  const dateKey = dateString || new Date().toISOString().split("T")[0];
  
  // Simple deterministic hash of YYYY-MM-DD
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash << 5) - hash + dateKey.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % FALLBACK_QUOTES.length;
  const base = FALLBACK_QUOTES[index];

  return {
    ...base,
    dateKey,
    timestamp: new Date().toISOString(),
    isFallback: true,
    isDailyQuote: true
  };
}
