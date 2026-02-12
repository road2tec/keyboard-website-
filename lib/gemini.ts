import { GoogleGenerativeAI } from "@google/generative-ai";
import { KeyboardResponse } from "../types/keyboard";
import { getKeyboardSuggestions as getLTSuggestions } from "./languagetool";

export async function getKeyboardSuggestions(text: string, retryCount = 0): Promise<KeyboardResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  // Use LanguageTool directly if no API Key
  if (!apiKey || apiKey.includes("REPLACE_ME")) {
    console.warn("Gemini API Key missing, falling back to LanguageTool.");
    return getLTSuggestions(text);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    generationConfig: { responseMimeType: "application/json" }
  });

  const systemPrompt = `
You are a Smart Keyboard AI Engine.

Your job is to assist users while typing in real time.

Tasks:
1. Analyze the input text.
2. If the sentence is INCOMPLETE, autocomplete it to form a logical, complete sentence in "corrected_text".
3. If the sentence has GRAMMAR errors, fix them in "corrected_text".
4. If the sentence is already COMPLETE and CORRECT, return it as is.
5. Predict exactly 3 context-aware next words.

Examples:
- Input: "how are" -> Corrected: "How are you doing today?"
- Input: "tumhi kay" -> Corrected: "तुम्ही काय करत आहात?"
- Input: "I goes home" -> Corrected: "I go home."

Language Rules:
- Detect English, Hindi, or Marathi.
- Return the response in the SAME language/script as the input.

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

    // Fallback to LanguageTool on failure (e.g. 429, 503, or Network Error)
    console.log("Falling back to LanguageTool due to Gemini error...");
    return getLTSuggestions(text);
  }
}
