import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="main-footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>AI Smart Keyboard</h3>
                    <p>
                        Revolutionizing digital communication with real-time AI grammar
                        correction and smart suggestions.
                    </p>
                </div>
                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <p><Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link></p>
                    <p><Link href="/features" style={{ color: 'inherit', textDecoration: 'none' }}>Features</Link></p>
                    <p><Link href="/about" style={{ color: 'inherit', textDecoration: 'none' }}>Architecture</Link></p>
                </div>
                <div className="footer-section">
                    <h3>Tech Stack</h3>
                    <p>Next.js & React</p>
                    <p>Google Gemini AI</p>
                    <p>TypeScript</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2026 AI Smart Keyboard System | Interactive AI Experience</p>
            </div>
        </footer>
    );
}
