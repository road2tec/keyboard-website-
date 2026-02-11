import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../new-pages.css';

export default function AboutPage() {
    const steps = [
        { num: 1, title: "User Input", desc: "User types on the Android IME or Web Keyboard Demo." },
        { num: 2, title: "Request Layer", desc: "Text is sent to the Next.js API route with JWT authentication." },
        { num: 3, title: "AI Processing", desc: "The Backend invokes Google Gemini AI for grammar and suggestions." },
        { num: 4, title: "Response Handling", desc: "AI response is parsed and formatted for the specific language." },
        { num: 5, title: "UI Update", desc: "Corrected text and smart suggestions are displayed in real-time." }
    ];

    return (
        <div className="new-pages-container">
            <Navbar />

            <main style={{ padding: '4rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
                <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Project Architecture</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        A technical overview of the AI Smart Keyboard System.
                    </p>
                </header>

                <section className="feature-card" style={{ marginBottom: '3rem' }}>
                    <h3>System Flow</h3>
                    <div className="arch-diagram">
                        {steps.map((s, i) => (
                            <div key={i} className="flow-step">
                                <div className="step-number">{s.num}</div>
                                <div>
                                    <h4 style={{ margin: 0 }}>{s.title}</h4>
                                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="card-grid" style={{ padding: 0 }}>
                    <div className="feature-card">
                        <h3>Frontend Stack</h3>
                        <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            <li>Next.js 15 (App Router)</li>
                            <li>React 19 Hooks</li>
                            <li>Vanilla CSS (Design Tokens)</li>
                            <li>TypeScript</li>
                        </ul>
                    </div>
                    <div className="feature-card">
                        <h3>Backend & AI</h3>
                        <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            <li>Google Gemini API</li>
                            <li>Edge Runtime API Routes</li>
                            <li>JWT (Jose) Authentication</li>
                            <li>Rate Limiting</li>
                        </ul>
                    </div>
                    <div className="feature-card">
                        <h3>Mobile Integration</h3>
                        <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            <li>Android IME Service</li>
                            <li>Kotlin / Java</li>
                            <li>Retrofit API Client</li>
                            <li>Custom View Rendering</li>
                        </ul>
                    </div>
                </div>

                <section style={{ marginTop: '4rem', textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Web to Android Mapping</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        The Web UI serves as a demonstration and management portal. The core AI logic
                        developed for the web is shared with the Android application via a unified
                        RESTful API, ensuring consistent performance and intelligence across all platforms.
                    </p>
                </section>
            </main>

            <Footer />
        </div>
    );
}
