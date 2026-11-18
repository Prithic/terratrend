import { NextRequest, NextResponse } from "next/server";
import standaloneData from "@/data/standalone_data.json";

export async function POST(req: NextRequest) {
  const backendUrl = process.env.BACKEND_URL;
  const body = await req.json();

  if (backendUrl && backendUrl !== "http://127.0.0.1:8000") {
    try {
      const res = await fetch(`${backendUrl}/api/trend/regional`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch {
      // Fallback
    }
  }

  return NextResponse.json(standaloneData.regional);
}
