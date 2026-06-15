import type { CanvasResponse } from "@/features/canvas/types/canvas";
import { supabase } from "@/lib/supabase";

const CANVAS_API_URL =
  "https://rmpecwthfbuoipzdemxp.supabase.co/functions/v1/canvas-api";

export async function fetchCanvasDeadlines(
  daysAhead = 90,
): Promise<CanvasResponse> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Niet ingelogd");
  }

  const response = await fetch(`${CANVAS_API_URL}?action=deadlines`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error || "Kon Canvas-deadlines niet ophalen");
  }

  return json;
}
