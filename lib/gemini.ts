import { GoogleGenerativeAI } from "@google/generative-ai";
import { KeyboardResponse } from "../types/keyboard";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function getKeyboardSuggestions(text: string, retryCount = 0): Promise<KeyboardResponse> {
  const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    generationConfig: { responseMimeType: "application/json" }
  });

  const systemPrompt = `
You are a Smart Keyboard AI Engine.

Your job is to assist users while typing in real time.

Tasks:
1. Analyze the COMPLETE input sentence provided by the user.
2. If the grammar of the COMPLETE sentence is incorrect, return the FULL corrected sentence in "corrected_text".
3. If the grammar is already correct, return the EXACT same sentence in "corrected_text".
4. CRITICAL: Do NOT truncate or shorten the sentence. Maintain all words and original meaning.
5. Predict exactly 3 context-aware next words that would follow the corrected sentence.

Language Rules:
- Detect English, Hindi, or Marathi.
- Preserve the detected language.

Performance Rules:
- Fast response suitable for keyboard typing.
- No creativity, no explanations, no chat-style responses.
  `;

  const userPrompt = `
User is typing the following text in a keyboard:

"${text}"

Return ONLY valid JSON in the following format:
{
  "original_text": "${text}",
  "corrected_text": "THE FULL CORRECTED SENTENCE",
  "suggestions": ["word1", "word2", "word3"],
  "language": "detected language"
}
  `;

  try {
    const result = await model.generateContent([systemPrompt, userPrompt]);
    const responseText = result.response.text();

    // Extract JSON if Gemini wraps it in markdown blocks
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : responseText.replace(/```json|```/g, "").trim();

    const parsed: KeyboardResponse = JSON.parse(cleanJson);

    // Basic validation: ensure we got the expected keys
    if (!parsed.corrected_text || !Array.isArray(parsed.suggestions)) {
      console.warn("Invalid response structure:", parsed);
      if (retryCount < 1) throw new Error("Invalid response structure");
    }

    return parsed;
  } catch (error: any) {
    const status = error.status || error.response?.status;
    const message = error.message;
    console.error(`Gemini API Error (Attempt ${retryCount + 1}): [${status}] ${message}`);

    // If it's a 429, we should definitely wait before retrying, or just fail gracefully
    if (status === 429) {
      console.log("Rate limited (429). Returning original text.");
      return {
        original_text: text,
        corrected_text: text,
        suggestions: [],
        language: "Quota Exceeded"
      };
    }

    if (retryCount < 1 && status !== 429) {
      console.log("Retrying Gemini API call...");
      return getKeyboardSuggestions(text, retryCount + 1);
    }

    return {
      original_text: text,
      corrected_text: text,
      suggestions: [],
      language: "Error: " + (status || "Unknown")
    };
  }
}
