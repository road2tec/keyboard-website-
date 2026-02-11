import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../new-pages.css';

export default function FeaturesPage() {
    const features = [
        {
            title: "Grammar Correction",
            description: "Our AI engine analyzes your sentence structure and provides instant corrections for grammar, spelling, and punctuation errors. It supports multiple languages and adapts to formal or informal contexts.",
            icon: "✨",
            details: ["Real-time Syntax Analysis", "Contextual Spell Check", "Punctuation Optimization"]
        },
        {
            title: "Context-aware Word Prediction",
            description: "Predict the next word based on deep learning models that understand the nuances of your conversation. The more you type, the better it gets at suggesting what's on your mind.",
            icon: "🔍",
            details: ["Transformer-based Models", "Personalized Vocabulary", "Fast Response Time"]
        },
        {
            title: "Emoji Intelligence",
            description: "Never hunt for an emoji again. Our keyboard suggests the perfect emoji based on the sentiment and content of your last few words.",
            icon: "😊",
            details: ["Sentiment Mapping", "Trend-aware Suggestions", "Quick Insert Flow"]
        },
        {
            title: "Language Detection",
            description: "Switch seamlessly between English, Hindi, and Marathi. The system automatically detects the language you are typing in and switches its AI models accordingly.",
            icon: "🌐",
            details: ["Automatic Language Switching", "Phonetic Typing Support", "Regional Nuance Awareness"]
        }
    ];

    return (
        <div className="new-pages-container">
            <Navbar />

            <main style={{ padding: '4rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
                <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>System Capabilities</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        A deep dive into the AI features that make our keyboard smart.
                    </p>
                </header>

                <div className="card-grid">
                    {features.map((f, i) => (
                        <div key={i} className="feature-card">
                            <div className="icon-box">{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>{f.description}</p>
                            <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                {f.details.map((d, j) => (
                                    <li key={j} style={{ marginBottom: '0.5rem' }}>{d}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
