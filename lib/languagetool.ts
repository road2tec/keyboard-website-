import { KeyboardResponse } from "../types/keyboard";

// Emoji mapping
const EMOJI_MAP: Record<string, string[]> = {
    "happy": ["😊", "😄", "✨"],
    "love": ["❤️", "😍", "🥰"],
    "sad": ["😢", "😔", "💔"],
    "home": ["🏠", "🏡"],
    "good": ["👍", "✨"],
    "thanks": ["🙏", "💖"],
    "ok": ["👌", "✅"],
    "fire": ["🔥"],
    "cool": ["😎"],
    "lol": ["😂"]
};

// Simple next word placeholders
const NEXT_WORD_SUGGESTIONS = ["is", "are", "the", "to", "for", "in", "on", "at", "with", "you", "where"];
const MARATHI_NEXT_WORDS = ["आहे", "नाही", "काय", "पण", "आणि", "कसे", "कुठे", "करा", "हो", "नको", "मी", "तुम्ही"];
const HINDI_NEXT_WORDS = ["है", "नहीं", "क्या", "लेकिन", "और", "कैसे", "कहाँ", "करो", "हाँ", "मत", "मैं", "आप"];

export async function getKeyboardSuggestions(text: string): Promise<KeyboardResponse> {
    try {
        if (!text || !text.trim()) {
            return {
                original_text: text,
                corrected_text: text,
                suggestions: [],
                language: "unknown"
            };
        }

        // 1. Detect Language (Simple heuristic for Devanagari)
        const hasDevanagari = /[\u0900-\u097F]/.test(text);
        const language = hasDevanagari ? "auto" : "en-US";

        // 2. Call LanguageTool API
        const params = new URLSearchParams();
        params.append("text", text);
        params.append("language", language);
        params.append("enabledOnly", "false");

        const response = await fetch("https://api.languagetool.org/v2/check", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json"
            },
            body: params
        });

        if (!response.ok) {
            throw new Error(`LanguageTool API Error: ${response.statusText}`);
        }

        const data = await response.json();
        const matches = data.matches || [];

        // 3. Apply Corrections (Sort by offset descending to avoiding index shifting)
        let correctedText = text;
        // Sort matches by offset descending
        matches.sort((a: any, b: any) => b.offset - a.offset);

        for (const match of matches) {
            // Only apply if there are replacements
            if (match.replacements && match.replacements.length > 0) {
                const replacement = match.replacements[0].value;
                const prefix = correctedText.substring(0, match.offset);
                const suffix = correctedText.substring(match.offset + match.length);
                correctedText = prefix + replacement + suffix;
            }
        }

        // 4. Generate Next Word Suggestions (Pseudo-prediction)
        const words = correctedText.trim().split(/\s+/);
        const lastWord = words[words.length - 1].toLowerCase().replace(/[^\w]/g, "");

        // Select pool based on language
        let nextWordsPool = NEXT_WORD_SUGGESTIONS;
        if (hasDevanagari) {
            // Mix Marathi and Hindi common words
            nextWordsPool = [...MARATHI_NEXT_WORDS, ...HINDI_NEXT_WORDS];
        }

        // Mix generic next words
        const nextWords = nextWordsPool.sort(() => 0.5 - Math.random()).slice(0, 3);

        // 5. Get Emoji Suggestions
        const emojis = EMOJI_MAP[lastWord] || [];

        // Combine for frontend "suggestions" array
        // Priority: Emojis first, then next words
        const combinedSuggestions = [...emojis, ...nextWords];

        // EXPERIMENTAL: If the user wants a "complete sentence", we can append the best next word
        // This mimics LLM completion behavior
        if (!/[.!?|।]$/.test(correctedText) && nextWords.length > 0) {
            correctedText += " " + nextWords[0];
        }

        return {
            original_text: text,
            corrected_text: correctedText,
            suggestions: combinedSuggestions,
            language: (data as any).language?.name || language
        };

    } catch (error) {
        console.error("LanguageTool Service Error:", error);
        // Fallback: return original text
        return {
            original_text: text,
            corrected_text: text,
            suggestions: [],
            language: "error"
        };
    }
}
