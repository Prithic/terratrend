import { NextRequest, NextResponse } from "next/server";
import standaloneData from "@/data/standalone_data.json";

export async function POST(req: NextRequest) {
  const backendUrl = process.env.BACKEND_URL;
  const body = await req.json();
  const { variable = "T2M", latitude = 9.9252, longitude = 78.1198 } = body;

  // 1. If backend URL is available and not local default, proxy to FastAPI
  if (backendUrl && backendUrl !== "http://127.0.0.1:8000") {
    try {
      const res = await fetch(`${backendUrl}/api/trend/point`, {
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

  // 2. Standalone match: Find the best matching preset point
  const points = standaloneData.points as Record<string, any>;
  const presets = standaloneData.locations.presets;

  // Find closest preset by Euclidean distance
  let closestPreset = presets[0];
  let minDistance = Infinity;

  for (const preset of presets) {
    const d = Math.hypot(preset.latitude - latitude, preset.longitude - longitude);
    if (d < minDistance) {
      minDistance = d;
      closestPreset = preset;
    }
  }

  // Try direct key match: {preset.id}_{variable}
  const key = `${closestPreset.id}_${variable}`;
  if (points[key]) {
    return NextResponse.json(points[key]);
  }

  // Fallback: Try with T2M for this location
  const t2mKey = `${closestPreset.id}_T2M`;
  if (points[t2mKey]) {
    return NextResponse.json(points[t2mKey]);
  }

  // Generic fallback: Madurai T2M
  return NextResponse.json(points["madurai_T2M"] || Object.values(points)[0]);
}
