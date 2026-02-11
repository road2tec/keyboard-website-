/**
 * AI Smart Keyboard Engine - Web Demo
 */

const typingArea = document.getElementById('typing-area');
const suggestionBar = document.getElementById('suggestion-bar');
const currentLang = document.getElementById('current-lang');
const quotaInfo = document.getElementById('quota-info');
const authStatus = document.getElementById('auth-status');
const forceBtn = document.getElementById('force-correct-btn');

let apiToken = null;
let typingTimer;
const PAUSE_DURATION = 800; // ms

// Emoji Mapping Dictionary
const emojiMap = {
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

/**
 * Initialize Authentication
 */
async function initAuth() {
    try {
        const res = await fetch('/api/auth/token');
        const data = await res.json();
        apiToken = data.token;
        authStatus.textContent = 'Ready';
        authStatus.className = 'status-ready';
    } catch (err) {
        console.error('Auth failed:', err);
        authStatus.textContent = 'Offline';
    }
}

/**
 * Get Suggestions from Backend
 */
async function getSuggestions(text) {
    if (!text.trim() || !apiToken) return;

    try {
        const res = await fetch('/api/keyboard/suggest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiToken}`
            },
            body: JSON.stringify({ text })
        });

        // Update Quota status
        const remaining = res.headers.get('X-RateLimit-Remaining');
        const limit = res.headers.get('X-RateLimit-Limit');
        if (remaining && limit) {
            quotaInfo.textContent = `Quota: ${remaining}/${limit}`;
        }

        const data = await res.json();
        renderSuggestions(data);
    } catch (err) {
        console.error('API Error:', err);
    }
}

/**
 * Render Chips in the Suggestion Bar
 */
function renderSuggestions(data) {
    suggestionBar.innerHTML = '';

    // Show results section
    const resultsSection = document.getElementById('results-section');
    const resultLang = document.getElementById('result-lang');
    const resultCorrected = document.getElementById('result-corrected');

    resultsSection.style.display = 'flex';
    resultLang.textContent = data.language || 'English';
    resultCorrected.textContent = data.corrected_text || data.original_text;

    // 1. Get Word Suggestions
    const words = data.suggestions || [];

    // 2. Get Emoji Suggestions based on last word
    const textWords = data.original_text.toLowerCase().split(/\s+/);
    const lastWord = textWords[textWords.length - 1];
    const emojis = emojiMap[lastWord] || [];

    // Combine and Render
    const allItems = [...words, ...emojis];

    if (allItems.length === 0) {
        suggestionBar.innerHTML = '<div class="placeholder-chip">No suggestions found</div>';
        return;
    }

    allItems.forEach(item => {
        const chip = document.createElement('div');
        chip.className = 'suggestion-chip';
        chip.textContent = item;
        chip.onclick = () => insertSuggestion(item);
        suggestionBar.appendChild(chip);
    });

    currentLang.textContent = data.language || 'English';
}

/**
 * Insert clicked suggestion into textarea
 */
function insertSuggestion(value) {
    const text = typingArea.value;
    const words = text.split(/\s+/);

    // Check if it's an emoji (don't replace, just add)
    const isEmoji = /\p{Emoji}/u.test(value);

    if (isEmoji) {
        typingArea.value = text.trimEnd() + ' ' + value + ' ';
    } else {
        // Replace last word or append
        if (words.length > 0) {
            words[words.length - 1] = value;
            typingArea.value = words.join(' ') + ' ';
        } else {
            typingArea.value = value + ' ';
        }
    }

    typingArea.focus();
    // Re-fetch suggestions for the new context
    getSuggestions(typingArea.value);
}

/**
 * Event Listeners
 */
typingArea.addEventListener('input', (e) => {
    clearTimeout(typingTimer);

    const text = typingArea.value;

    // Check for Space trigger
    if (text.endsWith(' ')) {
        getSuggestions(text);
    } else {
        // Pause trigger
        typingTimer = setTimeout(() => {
            getSuggestions(text);
        }, PAUSE_DURATION);
    }
});

forceBtn.addEventListener('click', () => {
    getSuggestions(typingArea.value);
});

// Start the app
initAuth();
