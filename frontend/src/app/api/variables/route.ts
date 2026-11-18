import { NextResponse } from "next/server";
import standaloneData from "@/data/standalone_data.json";

export async function GET() {
  const backendUrl = process.env.BACKEND_URL;
  if (backendUrl && backendUrl !== "http://127.0.0.1:8000") {
    try {
      const res = await fetch(`${backendUrl}/api/variables`, { next: { revalidate: 3600 } });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch {
      // Fallback to standalone data
    }
  }
  return NextResponse.json(standaloneData.variables);
}
