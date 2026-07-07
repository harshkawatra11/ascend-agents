import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { message } = (await request.json()) as { message?: string };

  if (!message) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  // Use local backend by default for dev, or configured URL
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";

  try {
    const res = await fetch(`${apiUrl}/api/v1/public-chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      return NextResponse.json({ error: errData?.detail || "Backend failed" }, { status: res.status });
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Public ask route failed", error);
    return NextResponse.json({ answer: "Citizen Services backend is unreachable.", confidence: null });
  }
}
