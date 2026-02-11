'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '../../new-pages.css';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Default Admin Credentials
        if (email === 'admin@smartkeyboard.com' && password === 'admin123') {
            document.cookie = "admin_session=authenticated; path=/; max-age=3600";
            router.push('/admin/dashboard');
            router.refresh();
        } else {
            setError('Invalid admin credentials. Please use the default ones.');
        }
    };

    return (
        <div className="new-pages-container">
            <Navbar />

            <main className="auth-page">
                <div className="auth-card">
                    <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{
                            background: 'var(--primary)',
                            color: 'white',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1rem'
                        }}>
                            🔒
                        </div>
                        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Admin Access</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            Authorized personnel only.
                        </p>
                    </header>

                    {error && (
                        <div style={{
                            padding: '0.75rem',
                            background: '#fee2e2',
                            color: '#dc2626',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.875rem',
                            marginBottom: '1.5rem',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Admin Email</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="admin@smartkeyboard.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="auth-btn" style={{ background: '#1e293b' }}>
                            Access Dashboard
                        </button>
                    </form>

                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f1f5f9', borderRadius: 'var(--radius-md)', fontSize: '0.75rem' }}>
                        <strong>Default Admin Credentials:</strong><br />
                        Email: <code>admin@smartkeyboard.com</code><br />
                        Password: <code>admin123</code>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
