import { NextRequest, NextResponse } from "next/server";

export function validateApiKey(request: NextRequest): NextResponse | null {
  const authHeader = request.headers.get("authorization");
  
  if (!authHeader) {
    return NextResponse.json(
      { error: "Authorization header is required" },
      { status: 401 }
    );
  }

  const [scheme, token] = authHeader.split(" ");
  
  if (scheme !== "Bearer" || !token) {
    return NextResponse.json(
      { error: "Invalid authorization" },
      { status: 401 }
    );
  }

  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.error("API_KEY environment variable is not set");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  if (token !== apiKey) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return null; // Valid API key, allow request to proceed
} 