'use client';

import { useState, useEffect } from 'react';
import './keyboard.css';

type Theme = 'light' | 'dark' | 'gradient' | 'neon';

export default function KeyboardPage() {
    const [theme, setTheme] = useState<Theme>('light');
    const [text, setText] = useState('');
    const [isShift, setIsShift] = useState(false);
    const [isCapsLock, setIsCapsLock] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [keyboardMode, setKeyboardMode] = useState<'letters' | 'numbers'>('letters');

    // Load theme from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('keyboardTheme') as Theme;
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    // Save theme to localStorage
    const handleThemeChange = (newTheme: Theme) => {
        setTheme(newTheme);
        localStorage.setItem('keyboardTheme', newTheme);
    };

    // Fetch suggestions from API
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (text.length > 0) {
                const words = text.split(' ');
                const lastWord = words[words.length - 1];

                if (lastWord.length > 1) {
                    try {
                        const response = await fetch('/api/suggestions', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ text: lastWord }),
                        });

                        if (response.ok) {
                            const data = await response.json();
                            setSuggestions(data.suggestions || []);
                        }
                    } catch (error) {
                        console.error('Error fetching suggestions:', error);
                    }
                }
            } else {
                setSuggestions([]);
            }
        };

        const debounce = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounce);
    }, [text]);

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
            setIsShift(!isShift);
        } else if (key === 'CapsLock') {
            setIsCapsLock(!isCapsLock);
        } else if (key === '123') {
            setKeyboardMode('numbers');
        } else if (key === 'ABC') {
            setKeyboardMode('letters');
        } else if (key.length === 1) {
            let char = key;
            if (keyboardMode === 'letters' && /[a-z]/.test(key)) {
                char = (isShift || isCapsLock) ? key.toUpperCase() : key.toLowerCase();
            }
            setText(prev => prev + char);
            setIsShift(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        const words = text.split(' ');
        words[words.length - 1] = suggestion;
        setText(words.join(' ') + ' ');
        setSuggestions([]);
    };

    const letterKeys = [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'],
        ['123', ',', 'Space', '.', 'Enter']
    ];

    const numberKeys = [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        ['@', '#', '$', '%', '&', '*', '(', ')', '-', '+'],
        ['!', '"', "'", ':', ';', '/', '?', '~', 'Backspace'],
        ['ABC', '=', 'Space', '_', 'Enter']
    ];

    const keys = keyboardMode === 'letters' ? letterKeys : numberKeys;

    return (
        <div className={`keyboard-app theme-${theme}`}>
            <header className="keyboard-header">
                <div className="header-content">
                    <div className="logo-section">
                        <div className="ai-badge">AI</div>
                        <h1>Smart Keyboard</h1>
                    </div>
                    <div className="theme-switcher">
                        <button
                            className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                            onClick={() => handleThemeChange('light')}
                            title="Light Theme"
                        >
                            ☀️
                        </button>
                        <button
                            className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                            onClick={() => handleThemeChange('dark')}
                            title="Dark Theme"
                        >
                            🌙
                        </button>
                        <button
                            className={`theme-btn ${theme === 'gradient' ? 'active' : ''}`}
                            onClick={() => handleThemeChange('gradient')}
                            title="Gradient Theme"
                        >
                            🎨
                        </button>
                        <button
                            className={`theme-btn ${theme === 'neon' ? 'active' : ''}`}
                            onClick={() => handleThemeChange('neon')}
                            title="Neon Theme"
                        >
                            ⚡
                        </button>
                    </div>
                </div>
            </header>

            <main className="keyboard-main">
                <div className="text-display">
                    <div className="display-content">
                        {text || <span className="placeholder">Start typing...</span>}
                    </div>
                    <div className="char-count">{text.length} characters</div>
                </div>

                {suggestions.length > 0 && (
                    <div className="suggestions-bar">
                        {suggestions.slice(0, 5).map((suggestion, index) => (
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

                <div className="keyboard-container">
                    {keys.map((row, rowIndex) => (
                        <div key={rowIndex} className="keyboard-row">
                            {row.map((key, keyIndex) => (
                                <button
                                    key={keyIndex}
                                    className={`key ${key.length > 1 ? 'key-special' : ''} ${(key === 'Shift' && isShift) || (key === 'CapsLock' && isCapsLock)
                                        ? 'key-active'
                                        : ''
                                        } ${key === '123' || key === 'ABC' ? 'key-mode' : ''}`}
                                    onClick={() => handleKeyPress(key)}
                                >
                                    {key === 'Backspace' ? '⌫' :
                                        key === 'Enter' ? '↵' :
                                            key === 'Space' ? '␣' :
                                                key === 'Shift' ? '⇧' :
                                                    key === '123' ? '123' :
                                                        key === 'ABC' ? 'ABC' :
                                                            key}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            </main>

            <footer className="keyboard-footer">
                <p>© 2026 AI Smart Keyboard System | Interactive Themed Keyboard</p>
            </footer>
        </div>
    );
}
