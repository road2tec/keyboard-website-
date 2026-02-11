import { NextRequest, NextResponse } from "next/server";
import { getKeyboardSuggestions } from "@/lib/gemini";
import { KeyboardRequest } from "@/types/keyboard";

export async function POST(req: NextRequest) {
    try {
        const body: KeyboardRequest = await req.json();

        if (!body.text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        const result = await getKeyboardSuggestions(body.text);

        return NextResponse.json(result);
    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
