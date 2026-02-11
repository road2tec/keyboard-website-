'use client';

import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '../../new-pages.css';

export default function AdminDashboardPage() {
    const router = useRouter();

    const handleLogout = () => {
        document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        router.push('/');
        router.refresh();
    };

    const systemStats = [
        { label: "Total Registered Users", value: "8,432", trend: "+12% this month", color: "#3b82f6" },
        { label: "Daily Active Users", value: "1,205", trend: "+5% today", color: "#22c55e" },
        { label: "API Requests (24h)", value: "45,892", trend: "Normal", color: "#f59e0b" },
        { label: "Avg. Latency", value: "124ms", trend: "Excellent", color: "#ef4444" }
    ];

    const modelPerformance = [
        { model: "Gemini 1.5 Pro", usage: "75%", reliability: "99.9%" },
        { model: "Gemini 1.5 Flash", usage: "20%", reliability: "99.8%" },
        { model: "Custom NLP v2", usage: "5%", reliability: "98.5%" }
    ];

    const topUsers = [
        { name: "John Doe", email: "john@example.com", words: "15,240", status: "Active" },
        { name: "Alice Smith", email: "alice@example.com", words: "12,890", status: "Active" },
        { name: "Bob Wilson", email: "bob@example.com", words: "9,450", status: "Pending" },
        { name: "Sarah Connor", email: "sarah@skynet.com", words: "8,120", status: "Active" }
    ];

    const healthMetrics = [
        { service: "Database", status: "Operational", uptime: "99.99%" },
        { service: "AI API Node", status: "Operational", uptime: "99.95%" },
        { service: "Auth Service", status: "Operational", uptime: "100%" },
        { service: "CDN Edge", status: "Operational", uptime: "100%" }
    ];

    return (
        <div className="new-pages-container">
            <Navbar />

            <main style={{ padding: '4rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
                <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 800 }}>Admin Panel</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Global administrative control and system intelligence.</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: '#1e293b',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <span>🚪</span> Sign Out Admin
                    </button>
                </header>

                {/* Main Stats Grid */}
                <div className="stats-grid">
                    {systemStats.map((s, i) => (
                        <div key={i} className="stat-card" style={{ borderTop: `4px solid ${s.color}` }}>
                            <span className="stat-value">{s.value}</span>
                            <span className="stat-label">{s.label}</span>
                            <div style={{ fontSize: '0.8rem', color: '#22c55e', marginTop: '0.75rem', fontWeight: 500 }}>{s.trend}</div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
                    {/* User Management Section */}
                    <section style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem' }}>User Management</h3>
                            <button style={{ color: 'var(--primary)', background: 'transparent', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>View All</button>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                        <th style={{ padding: '0.75rem 0', fontWeight: 600 }}>User</th>
                                        <th style={{ padding: '0.75rem 0', fontWeight: 600 }}>Words</th>
                                        <th style={{ padding: '0.75rem 0', fontWeight: 600 }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topUsers.map((u, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '1rem 0' }}>
                                                <div style={{ fontWeight: 600 }}>{u.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{u.email}</div>
                                            </td>
                                            <td style={{ padding: '1rem 0' }}>{u.words}</td>
                                            <td style={{ padding: '1rem 0' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '4px',
                                                    background: u.status === 'Active' ? '#dcfce7' : '#fef9c3',
                                                    color: u.status === 'Active' ? '#166534' : '#854d0e',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600
                                                }}>
                                                    {u.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* System Health Section */}
                    <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Infrastructure Health</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {healthMetrics.map((h, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{h.service}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#22c55e' }}>{h.status}</div>
                                        </div>
                                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{h.uptime} Uptime</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ background: '#1e293b', padding: '2rem', borderRadius: 'var(--radius-lg)', color: 'white', boxShadow: 'var(--shadow-md)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', color: 'white' }}>Live AI Activity</h3>
                                <span style={{ fontSize: '0.75rem', background: '#334155', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>Real-time</span>
                            </div>
                            <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', lineHeight: 1.6, color: '#94a3b8' }}>
                                <p style={{ color: '#4ade80' }}>&gt; [VALID] Request validated for john@example.com</p>
                                <p>&gt; [AI] Prompting Gemini Pro: "I is going..."</p>
                                <p style={{ color: '#fbbf24' }}>&gt; [WARN] High traffic detected from Region: Mumbai</p>
                                <p>&gt; [CACHE] Loaded emoji mapping for "happy"</p>
                                <p style={{ color: '#4ade80' }}>&gt; [DONE] Suggestion delivery successful in 112ms</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Model Usage section */}
                <section style={{ marginTop: '3rem', background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>AI Model Distribution & Efficiency</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2.5rem' }}>
                        {modelPerformance.map((m, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                    <span style={{ fontWeight: 600 }}>{m.model}</span>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{m.usage} traffic</span>
                                </div>
                                <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                                    <div style={{ width: m.usage, background: i === 0 ? '#3b82f6' : i === 1 ? '#818cf8' : '#cbd5e1', height: '100%' }}></div>
                                </div>
                                <div style={{ fontSize: '0.75rem', textAlign: 'right', color: '#22c55e', fontWeight: 500 }}>Reliability: {m.reliability}</div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
