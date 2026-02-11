import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './new-pages.css';

export default function RootLandingPage() {
  return (
    <div className="new-pages-container">
      <Navbar />

      <section className="hero-section">
        <h1 className="hero-title">AI Smart Keyboard</h1>
        <p className="hero-subtitle">
          An AI-powered keyboard for real-time grammar correction,
          smart word and emoji suggestions.
        </p>
        <Link href="/demo" className="nav-cta" style={{ fontSize: '1.25rem', padding: '1rem 2.5rem' }}>
          Try Keyboard Demo
        </Link>
      </section>

      <section className="card-grid">
        <div className="feature-card">
          <div className="icon-box">✍️</div>
          <h3>Grammar Correction</h3>
          <p>Real-time AI-powered grammar and spelling fixes to make your writing flawless.</p>
        </div>
        <div className="feature-card">
          <div className="icon-box">🧠</div>
          <h3>Smart Suggestions</h3>
          <p>Context-aware word and emoji predictions that adapt to your typing style.</p>
        </div>
        <div className="feature-card">
          <div className="icon-box">🌍</div>
          <h3>Multilingual Support</h3>
          <p>Seamlessly switch between English, Hindi, and Marathi with specialized AI models.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
