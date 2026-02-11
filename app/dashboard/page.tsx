'use client';

import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../new-pages.css';

export default function DashboardPage() {
    const router = useRouter();

    const stats = [
        { label: "Words Typed Today", value: "1,248" },
        { label: "Grammar Corrections", value: "86" },
        { label: "Emojis Suggested", value: "312" },
        { label: "Accuracy Rate", value: "98.2%" }
    ];

    const recentActivity = [
        { type: "Correction", text: "I is going -> I am going", time: "2 mins ago" },
        { type: "Suggestion", text: "Meeting -> 📅 Meeting", time: "15 mins ago" },
        { type: "Correction", text: "Their is -> There is", time: "1 hour ago" }
    ];

    return (
        <div className="new-pages-container">
            <Navbar />

            <main style={{ padding: '4rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
                <header style={{ marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>User Dashboard</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Track your writing improvements and AI interactions.</p>
                    </div>
                </header>

                <div className="stats-grid">
                    {stats.map((s, i) => (
                        <div key={i} className="stat-card">
                            <span className="stat-value">{s.value}</span>
                            <span className="stat-label">{s.label}</span>
                        </div>
                    ))}
                </div>

                <section style={{ background: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Recent AI Activity</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {recentActivity.map((a, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
                                <div>
                                    <span style={{ fontWeight: 600, color: 'var(--primary)', marginRight: '1rem' }}>[{a.type}]</span>
                                    <span>{a.text}</span>
                                </div>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{a.time}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div className="feature-card">
                        <h3>Language Distribution</h3>
                        <div style={{ height: '20px', background: '#e2e8f0', borderRadius: '10px', marginTop: '1rem', overflow: 'hidden', display: 'flex' }}>
                            <div style={{ width: '70%', background: 'var(--primary)', height: '100%' }}></div>
                            <div style={{ width: '20%', background: '#818cf8', height: '100%' }}></div>
                            <div style={{ width: '10%', background: '#c7d2fe', height: '100%' }}></div>
                        </div>
                        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem', fontSize: '0.75rem' }}>
                            <span>🔵 English (70%)</span>
                            <span>🟣 Hindi (20%)</span>
                            <span>⚪ Marathi (10%)</span>
                        </div>
                    </div>
                    <div className="feature-card">
                        <h3>System Status</h3>
                        <div style={{ marginTop: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>API Response Time</span>
                                <span style={{ color: '#22c55e' }}>120ms</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>AI Model</span>
                                <span>Gemini 1.5 Pro</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
