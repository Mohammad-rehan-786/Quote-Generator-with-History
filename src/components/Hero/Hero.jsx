import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Database } from 'lucide-react';
import './Hero.css';

export default function Hero({ onGenerateClick, onExploreHistoryClick }) {
  return (
    <section className="hero-section">
      <div className="hero-badge animate-fade-in">
        <Sparkles size={14} className="hero-badge-icon" />
        <span>VIRTUAL INTERNSHIP SHOWCASE • 100% CLIENT-SIDE & BACKENDLESS</span>
      </div>

      <h1 className="hero-title animate-fade-in">
        Find Your <span className="gradient-text">Daily Spark.</span>
      </h1>

      <p className="hero-subtitle animate-fade-in">
        Discover meaningful words, save your favorites, and revisit the inspiration that matters.
        Engineered with live API integration, persistent localStorage history, and a Midnight Aurora glassmorphism aesthetic.
      </p>

      <div className="hero-actions animate-fade-in">
        <button className="btn-primary hero-btn" onClick={onGenerateClick}>
          <span>Generate Inspiration</span>
          <ArrowRight size={18} />
        </button>

        <button className="btn-secondary hero-btn" onClick={onExploreHistoryClick}>
          <span>View Vault History</span>
        </button>
      </div>

      {/* Feature Highlights Strip */}
      <div className="hero-features-strip animate-fade-in">
        <div className="hero-feature-item">
          <div className="feature-icon-box">
            <Zap size={16} />
          </div>
          <div className="feature-info">
            <span className="feature-title">Live Public API</span>
            <span className="feature-desc">With offline fallback</span>
          </div>
        </div>

        <div className="hero-feature-item">
          <div className="feature-icon-box">
            <Database size={16} />
          </div>
          <div className="feature-info">
            <span className="feature-title">Browser Persistence</span>
            <span className="feature-desc">Auto-saved to localStorage</span>
          </div>
        </div>

        <div className="hero-feature-item">
          <div className="feature-icon-box">
            <ShieldCheck size={16} />
          </div>
          <div className="feature-info">
            <span className="feature-title">100% Backendless</span>
            <span className="feature-desc">Zero tracking, zero latency</span>
          </div>
        </div>
      </div>
    </section>
  );
}
