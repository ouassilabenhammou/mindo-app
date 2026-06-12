import type { CanvasResponse } from "@/app/types/canvas";

const CANVAS_API_URL =
  "https://rmpecwthfbuoipzdemxp.supabase.co/functions/v1/canvas-api";

export async function fetchCanvasDeadlines(
  daysAhead = 90,
): Promise<CanvasResponse> {
  const response = await fetch(CANVAS_API_URL);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error || "Kon Canvas-deadlines niet ophalen");
  }

  return json;
}
