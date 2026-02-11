'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkAuth = () => {
            const cookies = document.cookie.split('; ');
            const hasUserSession = cookies.find(row => row.startsWith('session='));
            const hasAdminSession = cookies.find(row => row.startsWith('admin_session='));
            setIsLoggedIn(!!hasUserSession || !!hasAdminSession);
        };
        checkAuth();
        setIsMobileMenuOpen(false); // Close menu on route change
    }, [pathname]);

    const handleLogout = () => {
        document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        setIsLoggedIn(false);
        router.push('/');
        router.refresh();
    };

    return (
        <nav className="nav-header">
            <div className="nav-content">
                <Link href="/" className="nav-logo">
                    <span>⌨️</span> AI Smart Keyboard
                </Link>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? '✕' : '☰'}
                </button>

                {/* Desktop Nav */}
                <div className="nav-links desktop-only">
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="nav-cta"
                            style={{ background: '#ef4444', border: 'none', cursor: 'pointer' }}
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link href="/" className="nav-link">Home</Link>
                            <Link href="/features" className="nav-link">Features</Link>
                            <Link href="/about" className="nav-link">About</Link>
                            <Link href="/auth/login" className="nav-link">Login</Link>
                            <Link href="/auth/register" className="nav-cta">Get Started</Link>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Dropdown */}
            {isMobileMenuOpen && (
                <div className="mobile-menu">
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="nav-cta mobile-cta"
                            style={{ background: '#ef4444', border: 'none', cursor: 'pointer', width: '100%' }}
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link href="/" className="mobile-link">Home</Link>
                            <Link href="/features" className="mobile-link">Features</Link>
                            <Link href="/about" className="mobile-link">About</Link>
                            <Link href="/auth/login" className="mobile-link">Login</Link>
                            <Link href="/auth/register" className="nav-cta mobile-cta">Get Started</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
