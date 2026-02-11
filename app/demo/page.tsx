'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../keyboard.css';
import '../globals.css';
import '../new-pages.css';
import { KeyboardResponse } from '../../types/keyboard';

type Theme = 'light' | 'dark' | 'gradient' | 'neon';

export default function KeyboardDemoPage() {
    const router = useRouter();
    const [theme, setTheme] = useState<Theme>('light');

    const [text, setText] = useState('');
    const [isShift, setIsShift] = useState(false);
    const [isCapsLock, setIsCapsLock] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [keyboardMode, setKeyboardMode] = useState<'letters' | 'numbers' | 'emojis'>('letters');
    const [response, setResponse] = useState<KeyboardResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [rateLimit, setRateLimit] = useState<{ remaining: string; limit: string } | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
    const [lastShiftClick, setLastShiftClick] = useState(0);

    // Emoji mapping
    const emojiMap: Record<string, string[]> = {
        'hello': ['👋', '🙂', '😊'],
        'hi': ['👋', '😊'],
        'happy': ['😊', '😄', '✨'],
        'love': ['❤️', '😍', '🥰'],
        'sad': ['😢', '😔', '💔'],
        'home': ['🏠', '🏡'],
        'good': ['👍', '✨'],
        'thanks': ['🙏', '💖'],
        'ok': ['👌', '✅']
    };

    // Load theme from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('keyboardTheme') as Theme;
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    // Authenticate and get JWT token
    useEffect(() => {
        fetch('/api/auth/token')
            .then(res => res.json())
            .then(data => setToken(data.token))
            .catch(err => console.error('Auth Error:', err));
    }, []);

    // Save theme to localStorage
    const handleThemeChange = (newTheme: Theme) => {
        setTheme(newTheme);
        localStorage.setItem('keyboardTheme', newTheme);
    };

    // Get emoji suggestions based on last word
    const getEmojiSuggestions = () => {
        const words = text.toLowerCase().split(/\s+/);
        const lastWord = words[words.length - 1];
        return emojiMap[lastWord] || [];
    };

    // Basic Language Detection logic (English vs Devanagari)
    const detectLanguage = (input: string) => {
        if (!input.trim()) return selectedLanguage;

        // Check for Devanagari characters (Hindi and Marathi)
        const hasDevanagari = /[\u0900-\u097F]/.test(input);
        if (hasDevanagari) {
            // Heuristic for Marathi-specific nasalization or common vowels
            const isMarathi = /[\u0933\u0934\u0937]/.test(input) || input.includes('आहे') || input.includes('कुठे');
            return isMarathi ? 'Marathi' : 'Hindi';
        }
        return 'English';
    };

    // Fetch AI suggestions from backend
    const fetchAISuggestions = async () => {
        if (!text.trim() || !token) return;
        setLoading(true);
        try {
            const detected = detectLanguage(text);
            if (detected !== selectedLanguage) {
                setSelectedLanguage(detected);
            }

            const res = await fetch('/api/keyboard/suggest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    text,
                    language: detected // Pass language to AI if supported
                }),
            });

            const remaining = res.headers.get('X-RateLimit-Remaining');
            const limit = res.headers.get('X-RateLimit-Limit');
            if (remaining && limit) setRateLimit({ remaining, limit });

            const data = await res.json();
            setResponse(data);

            // Combine AI suggestions with emoji suggestions
            const combinedSuggestions = [...(data.suggestions || []), ...getEmojiSuggestions()];
            setSuggestions(combinedSuggestions);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch suggestions with debouncing and selective immediate triggers
    useEffect(() => {
        if (!text.trim()) {
            setSuggestions([]);
            return;
        }

        // 1. Immediate triggers for natural pauses
        if (text.endsWith(' ') || text.endsWith('.')) {
            fetchAISuggestions();
            return;
        }

        // 2. Debounced trigger for active typing
        const timer = setTimeout(() => {
            fetchAISuggestions();
        }, 1000); // 1 second pause triggers prediction

        // 3. Emojis for current word (always immediate)
        const emojiSugs = getEmojiSuggestions();
        if (emojiSugs.length > 0) {
            setSuggestions(prev => [...new Set([...emojiSugs, ...prev])]);
        }

        return () => clearTimeout(timer);
    }, [text, token]);

    // Handle Physical Keyboard Input
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent handling if user is typing in an input field
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            // Allow standard shortcuts like Ctrl+C, Ctrl+V, Ctrl+A etc.
            if (e.ctrlKey || e.metaKey) return;

            if (e.key === 'Backspace') {
                handleKeyPress('Backspace');
            } else if (e.key === ' ') {
                handleKeyPress('Space');
            } else if (e.key === 'Enter') {
                handleKeyPress('Enter');
            } else if (e.key === 'Shift') {
                handleKeyPress('Shift');
            } else if (e.key.length === 1) {
                handleKeyPress(e.key);
            }
        };

        const handlePaste = (e: ClipboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            const pastedText = e.clipboardData?.getData('text');
            if (pastedText) {
                setText(prev => prev + pastedText);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('paste', handlePaste);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('paste', handlePaste);
        };
    }, []);

    const handleKeyPress = (key: string) => {
        if (key === 'Backspace') {
            setText(prev => prev.slice(0, -1));
        } else if (key === 'Space') {
            setText(prev => prev + ' ');
            setIsShift(false);
        } else if (key === 'Enter') {
            setText(prev => prev + '\n');
            setIsShift(false);
        } else if (key === 'Shift') {
            const now = Date.now();
            if (now - lastShiftClick < 300) { // Double tap within 300ms
                setIsCapsLock(!isCapsLock);
                setIsShift(false);
            } else {
                setIsShift(!isShift);
                if (isCapsLock) setIsCapsLock(false);
            }
            setLastShiftClick(now);
        } else if (key === 'CapsLock') {
            setIsCapsLock(!isCapsLock);
        } else if (key === '123') {
            setKeyboardMode('numbers');
        } else if (key === 'ABC') {
            setKeyboardMode('letters');
        } else if (key === '😊') {
            setKeyboardMode('emojis');
        } else if (key === '🌐' || key === 'abc' || key === 'हिंदी' || key === 'मराठी') {
            const cycle = {
                'English': 'Hindi',
                'Hindi': 'Marathi',
                'Marathi': 'English'
            };
            setSelectedLanguage(prev => (cycle as any)[prev] || 'English');
        } else if (key.length >= 1) {
            let char = key;
            if (keyboardMode === 'letters' && /[a-z]/.test(key)) {
                char = (isShift || isCapsLock) ? key.toUpperCase() : key.toLowerCase();
            }
            setText(prev => prev + char);
            setIsShift(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        const isEmoji = /\p{Emoji}/u.test(suggestion);
        if (isEmoji) {
            setText(text.trimEnd() + ' ' + suggestion + ' ');
        } else {
            const words = text.split(' ');
            words[words.length - 1] = suggestion;
            setText(words.join(' ') + ' ');
        }
        setSuggestions([]);
    };

    const langKey = selectedLanguage === 'English' ? 'मराठी' :
        selectedLanguage === 'Marathi' ? 'हिंदी' : 'abc';

    const letterKeys = [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'],
        ['123', langKey, 'Space', '.', '😊']
    ];

    const numberKeys = [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        ['@', '#', '$', '%', '&', '*', '(', ')', '-', '+'],
        ['!', '"', "'", ':', ';', '/', '?', '~', 'Backspace'],
        ['ABC', langKey, 'Space', '_', '😊']
    ];

    const emojiKeys = [
        ['😊', '😂', '❤️', '😍', '🥰', '😘', '😭', '😢', '😡', '🤔'],
        ['👍', '👎', '🙏', '💪', '✨', '🎉', '🔥', '💯', '✅', '❌'],
        ['🏠', '🚗', '✈️', '🌟', '🌈', '☀️', '🌙', '⭐', '💫', 'Backspace'],
        ['ABC', langKey, 'Space', '📱', '123']
    ];

    const hindiKeys = [
        ['१', '२', '३', '४', '५', '६', '७', '८', '९', '०'],
        ['क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ'],
        ['ट', 'ठ', 'ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न'],
        ['Shift', 'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'Backspace'],
        ['123', langKey, 'Space', 'श', '😊']
    ];

    const marathiKeys = [
        ['१', '२', '३', '४', '५', '६', '७', '८', '९', '०'],
        ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ'],
        ['क', 'ख', 'ग', 'घ', 'च', 'छ', 'ज', 'झ', 'ट', 'ठ'],
        ['Shift', 'ड', 'ढ', 'त', 'थ', 'द', 'ध', 'न', 'प', 'Backspace'],
        ['123', langKey, 'Space', 'भ', '😊']
    ];

    const keys = keyboardMode === 'emojis' ? emojiKeys :
        keyboardMode === 'numbers' ? numberKeys :
            selectedLanguage === 'Hindi' ? hindiKeys :
                selectedLanguage === 'Marathi' ? marathiKeys : letterKeys;

    return (
        <div className="new-pages-container">
            <div className={`keyboard-app theme-${theme}`} style={{ minHeight: '100vh' }}>
                <header className="keyboard-header">
                    <div className="header-content">
                        <div className="logo-section">
                            <div className="ai-badge">AI</div>
                            <h1>Smart Keyboard</h1>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div className="theme-switcher">
                                <button className="current-theme-btn">
                                    <span className="theme-label">
                                        {theme === 'light' ? 'Light' :
                                            theme === 'dark' ? 'Dark' :
                                                theme === 'gradient' ? 'Gradient' : 'Neon'}
                                    </span>
                                    <span className="dropdown-arrow">▼</span>
                                </button>
                                <div className="theme-options">
                                    <button
                                        className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                                        onClick={() => handleThemeChange('light')}
                                    >
                                        <span className="option-label">Light</span>
                                    </button>
                                    <button
                                        className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                                        onClick={() => handleThemeChange('dark')}
                                    >
                                        <span className="option-label">Dark</span>
                                    </button>
                                    <button
                                        className={`theme-option ${theme === 'gradient' ? 'active' : ''}`}
                                        onClick={() => handleThemeChange('gradient')}
                                    >
                                        <span className="option-label">Gradient</span>
                                    </button>
                                    <button
                                        className={`theme-option ${theme === 'neon' ? 'active' : ''}`}
                                        onClick={() => handleThemeChange('neon')}
                                    >
                                        <span className="option-label">Neon</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="keyboard-main">
                    <div className="status-bar-info">
                        <div className="lang-indicator">
                            <span className="status-dot"></span>
                            Language: <span className="lang-value">{selectedLanguage}</span>
                        </div>
                        <div className={token ? 'auth-ready' : 'auth-loading'}>
                            {token ? 'Ready' : 'Authenticating...'}
                        </div>
                        {rateLimit && (
                            <div className="quota-display">
                                Quota: {rateLimit.remaining}/{rateLimit.limit}
                            </div>
                        )}
                    </div>

                    <div className="text-display">
                        <div className="display-content">
                            {text || <span className="placeholder">Start typing...</span>}
                        </div>
                        <div className="char-count">{text.length} characters</div>
                    </div>

                    {suggestions.length > 0 && (
                        <div className="suggestions-bar">
                            {suggestions.slice(0, 6).map((suggestion, index) => (
                                <button
                                    key={index}
                                    className="suggestion-chip"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}

                    {response && response.corrected_text && (
                        <div className="results-section">
                            <div className="result-item">
                                <strong>Corrected Text:</strong>
                                <div className="corrected-text">{response.corrected_text}</div>
                            </div>
                        </div>
                    )}

                    <div className="action-section">
                        <button
                            onClick={fetchAISuggestions}
                            disabled={loading || !token}
                            className={`force-correct-btn ${!token ? 'disabled' : ''}`}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                                <path d="m9 12 2 2 4-4" />
                            </svg>
                            {loading ? 'Correcting...' : !token ? 'Authenticating...' : 'Force Correct'}
                        </button>
                    </div>

                    <div className="keyboard-container">
                        {keys.map((row, rowIndex) => (
                            <div key={rowIndex} className="keyboard-row">
                                {row.map((key, keyIndex) => (
                                    <button
                                        key={keyIndex}
                                        className={`key ${key.length > 1 && !/\p{Emoji}/u.test(key) ? 'key-special' : ''} ${(key === 'Shift' && isShift) || (key === 'CapsLock' && isCapsLock)
                                            ? 'key-active'
                                            : ''
                                            } ${key === '123' || key === 'ABC' || key === '😊' ? 'key-mode' : ''} ${/\p{Emoji}/u.test(key) && key.length <= 2 ? 'key-emoji' : ''}`}
                                        onClick={() => handleKeyPress(key)}
                                    >
                                        {key === 'Backspace' ? '⌫' :
                                            key === 'Enter' ? '↵' :
                                                key === 'Space' ? '␣' :
                                                    key === 'Shift' ? (isCapsLock ? '⇪' : '⇧') :
                                                        key}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}
