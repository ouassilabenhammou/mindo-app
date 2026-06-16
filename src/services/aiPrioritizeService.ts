import { supabase } from "@/lib/supabase";

export interface PrioritizeResult {
  success: boolean;
  updated: number;
  total: number;
  breakdown?: {
    deterministic: number;
    ai_judged: number;
  };
  prioriteiten?: { id: string; category: string }[];
  errors?: string[];
  message?: string;
}

export async function prioritizeTasks(): Promise<PrioritizeResult> {
  const { data, error } = await supabase.functions.invoke("ai-prioritize", {
    method: "POST",
  });

  if (error) throw error;
  return data as PrioritizeResult;
}
