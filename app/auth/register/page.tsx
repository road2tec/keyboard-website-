'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '../../new-pages.css';

export default function RegisterPage() {
    const router = useRouter();

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        // Setting a mock session cookie for 1 hour
        document.cookie = "session=mock-user-session; path=/; max-age=3600";
        router.push('/demo');
        router.refresh();
    };

    return (
        <div className="new-pages-container">
            <Navbar />

            <main className="auth-page">
                <div className="auth-card">
                    <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Create Account</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Join the future of smart typing.</p>
                    </header>

                    <form onSubmit={handleRegister}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" className="form-input" placeholder="John Doe" required />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" className="form-input" placeholder="name@example.com" required />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" className="form-input" placeholder="••••••••" required />
                        </div>

                        <button type="submit" className="auth-btn">
                            Register
                        </button>
                    </form>

                    <footer style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
                        <Link href="/auth/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
                    </footer>
                </div>
            </main>

            <Footer />
        </div>
    );
}
