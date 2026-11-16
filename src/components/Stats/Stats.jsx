import React, { useMemo } from 'react';
import {
  BarChart3,
  Bookmark,
  Heart,
  Sparkles,
  UserCheck,
  Tag,
  HardDrive,
  Award,
  Layers
} from 'lucide-react';
import './Stats.css';

export default function Stats({ history, favorites, stats }) {
  // Dynamically calculate most frequent author
  const topAuthorData = useMemo(() => {
    if (!history || history.length === 0) return null;
    const authorCounts = {};

    history.forEach((item) => {
      const author = (item.author || 'Unknown').trim();
      authorCounts[author] = (authorCounts[author] || 0) + 1;
    });

    let topAuthor = '';
    let maxCount = 0;
    Object.entries(authorCounts).forEach(([author, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topAuthor = author;
      }
    });

    return { author: topAuthor, count: maxCount };
  }, [history]);

  // Dynamically calculate top category
  const topCategoryData = useMemo(() => {
    if (!history || history.length === 0) return null;
    const catCounts = {};

    history.forEach((item) => {
      const cat = (item.category || 'Inspiration').trim();
      catCounts[cat] = (catCounts[cat] || 0) + 1;
    });

    let topCat = '';
    let maxCount = 0;
    Object.entries(catCounts).forEach(([cat, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topCat = cat;
      }
    });

    return { category: topCat, count: maxCount };
  }, [history]);

  // Approximate localStorage usage
  const storageMetrics = useMemo(() => {
    try {
      let totalBytes = 0;
      for (const key in localStorage) {
        if (key.startsWith('quotevault_')) {
          totalBytes += (localStorage.getItem(key) || '').length * 2; // UTF-16 approximate
        }
      }
      const kb = (totalBytes / 1024).toFixed(1);
      return { kb, totalBytes };
    } catch {
      return { kb: '0.0', totalBytes: 0 };
    }
  }, [history, favorites, stats]);

  return (
    <section className="stats-section" id="vault-stats">
      <div className="section-header-row">
        <div>
          <div className="section-pill stats-pill">
            <BarChart3 size={14} />
            <span>METRICS & VAULT INTELLIGENCE</span>
          </div>
          <h2 className="section-title">Vault Analytics</h2>
          <p className="section-subtitle">
            Real-time statistics derived directly from your browser's persistent session storage.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        {/* Total Quotes Generated */}
        <div className="stat-card glass-panel">
          <div className="stat-icon-wrap icon-purple">
            <Sparkles size={22} />
          </div>
          <div className="stat-value">{stats?.totalGenerated || 0}</div>
          <div className="stat-label">Total Quotes Generated</div>
          <div className="stat-caption">Lifetime clicks across sessions</div>
        </div>

        {/* Unique Quotes in History */}
        <div className="stat-card glass-panel">
          <div className="stat-icon-wrap icon-blue">
            <Layers size={22} />
          </div>
          <div className="stat-value">{history.length}</div>
          <div className="stat-label">Unique Saved Quotes</div>
          <div className="stat-caption">Deduplicated in localStorage</div>
        </div>

        {/* Total Favorites */}
        <div className="stat-card glass-panel">
          <div className="stat-icon-wrap icon-pink">
            <Heart size={22} />
          </div>
          <div className="stat-value">{favorites.length}</div>
          <div className="stat-label">Starred Favorites</div>
          <div className="stat-caption">Hand-picked inspirations</div>
        </div>

        {/* Most Frequent Author */}
        <div className="stat-card glass-panel">
          <div className="stat-icon-wrap icon-cyan">
            <UserCheck size={22} />
          </div>
          <div className="stat-value stat-value-text">
            {topAuthorData ? topAuthorData.author : 'No Data Yet'}
          </div>
          <div className="stat-label">Top Encountered Author</div>
          <div className="stat-caption">
            {topAuthorData
              ? `${topAuthorData.count} quote${topAuthorData.count > 1 ? 's' : ''} in your vault`
              : 'Appears after generating quotes'}
          </div>
        </div>

        {/* Top Category */}
        <div className="stat-card glass-panel">
          <div className="stat-icon-wrap icon-amber">
            <Tag size={22} />
          </div>
          <div className="stat-value stat-value-text">
            {topCategoryData ? topCategoryData.category : 'Inspiration'}
          </div>
          <div className="stat-label">Prominent Category</div>
          <div className="stat-caption">
            {topCategoryData
              ? `${topCategoryData.count} quote${topCategoryData.count > 1 ? 's' : ''} categorized`
              : 'Based on your saved collection'}
          </div>
        </div>

        {/* Storage footprint */}
        <div className="stat-card glass-panel">
          <div className="stat-icon-wrap icon-emerald">
            <HardDrive size={22} />
          </div>
          <div className="stat-value">{storageMetrics.kb} KB</div>
          <div className="stat-label">Storage Footprint</div>
          <div className="stat-caption">Lightweight browser memory footprint</div>
        </div>
      </div>
    </section>
  );
}
