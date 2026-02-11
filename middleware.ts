import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

// In-memory store for rate limiting (Note: In serverless, use Redis/Upstash for persistence)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export async function middleware(request: NextRequest) {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const path = request.nextUrl.pathname;

    // 1. UI Route Protection
    const userSession = request.cookies.get("session")?.value;
    const adminSession = request.cookies.get("admin_session")?.value;

    // Protect user dashboard route (Demo is now public)
    if (path.startsWith("/dashboard") && !userSession) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Protect admin routes (except login)
    if (path.startsWith("/admin") && !path.startsWith("/admin/login") && !adminSession) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // 2. CORS Configuration
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",");
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    const response = NextResponse.next();

    // Allow if origin matches allowed list OR if it's a same-site request (origin is null or matches host)
    const isAllowed = origin && (allowedOrigins.includes(origin) || (host && origin.includes(host)));

    if (isAllowed) {
        response.headers.set("Access-Control-Allow-Origin", origin!);
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.headers.set("Access-Control-Allow-Credentials", "true");
    }

    // Handle preflight requests
    if (request.method === "OPTIONS") {
        return new NextResponse(null, { status: 204, headers: response.headers });
    }

    // Only protect API routes
    if (path.startsWith("/api/")) {
        // 2. Rate Limiting
        const limit = parseInt(process.env.RATE_LIMIT_RPM || "60");
        const now = Date.now();
        const windowMs = 60 * 1000; // 1 minute window

        let rateData = rateLimitMap.get(ip) || { count: 0, lastReset: now };

        if (now - rateData.lastReset > windowMs) {
            rateData = { count: 1, lastReset: now };
        } else {
            rateData.count++;
        }

        rateLimitMap.set(ip, rateData);

        // Set Rate Limit Headers
        response.headers.set("X-RateLimit-Limit", limit.toString());
        response.headers.set("X-RateLimit-Remaining", Math.max(0, limit - rateData.count).toString());
        response.headers.set("X-RateLimit-Reset", (rateData.lastReset + windowMs).toString());

        if (rateData.count > limit) {
            return new NextResponse(
                JSON.stringify({ error: "Too Many Requests", message: "Rate limit exceeded" }),
                {
                    status: 429,
                    headers: { ...Object.fromEntries(response.headers), "Content-Type": "application/json" }
                }
            );
        }

        // 3. Authentication & Authorization
        if (path.startsWith("/api/keyboard")) {
            const authHeader = request.headers.get("Authorization");
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return new NextResponse(
                    JSON.stringify({ error: "Unauthorized", message: "Missing or invalid token" }),
                    { status: 401, headers: { "Content-Type": "application/json" } }
                );
            }

            const token = authHeader.split(" ")[1];
            const payload = await verifyToken(token);

            if (!payload) {
                return new NextResponse(
                    JSON.stringify({ error: "Unauthorized", message: "Token is invalid or expired" }),
                    { status: 401, headers: { "Content-Type": "application/json" } }
                );
            }

            // Pass user info to request headers for downstream use if needed
            response.headers.set("X-User-ID", payload.sub as string);
        }
    }

    return response;
}

// Configure which paths should trigger the middleware
export const config = {
    matcher: ["/api/:path*", "/dashboard/:path*", "/demo/:path*", "/admin/:path*"],
};
