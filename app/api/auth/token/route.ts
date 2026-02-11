import { NextResponse } from "next/server";
import { generateToken } from "@/lib/auth";

export async function GET() {
    // In a real app, this follows a successful username/password check
    const token = await generateToken({
        sub: "test-user-123",
        role: "admin",
        name: "Security Tester"
    });

    return NextResponse.json({ token });
}
