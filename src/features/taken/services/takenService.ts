import type { SectieId } from "@/features/taken/types/taken";
import { SECTIE_NAAR_CATEGORY } from "@/features/taken/utils/takenMapper";
import { supabase } from "@/lib/supabase";

export async function haalTakenOp() {
  return supabase
    .from("tasks")
    .select("*")
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });
}

export async function voegTaakToeAanDatabase({
  userId,
  title,
  sectie,
  priority,
  durationMinutes,
}: {
  userId: string;
  title: string;
  sectie: SectieId;
  priority: number;
  durationMinutes?: number | null;
}) {
  return supabase
    .from("tasks")
    .insert({
      user_id: userId,
      title,
      category: SECTIE_NAAR_CATEGORY[sectie],
      priority,
      duration_minutes: durationMinutes ?? null,
      is_completed: false,
    })
    .select()
    .single();
}

export async function updateTaakVoltooid({
  id,
  completed,
  sectie,
}: {
  id: string;
  completed: boolean;
  sectie: SectieId;
}) {
  return supabase
    .from("tasks")
    .update({
      is_completed: completed,
      category: SECTIE_NAAR_CATEGORY[sectie],
      completed_at: completed ? new Date().toISOString() : null,
    })
    .eq("id", id);
}

export async function verwijderTaakUitDatabase(id: string) {
  return supabase.from("tasks").delete().eq("id", id);
}

export async function updateTaakSectie({
  id,
  sectie,
  priority,
}: {
  id: string;
  sectie: SectieId;
  priority: number;
}) {
  return supabase
    .from("tasks")
    .update({
      category: SECTIE_NAAR_CATEGORY[sectie],
      priority,
    })
    .eq("id", id);
}

export async function haalTakenMetVervaldatum() {
  return supabase
    .from("tasks")
    .select("id, title, due_date, category, is_completed")
    .not("due_date", "is", null)
    .eq("is_completed", false)
    .order("due_date", { ascending: true });
}
