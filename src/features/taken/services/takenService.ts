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
  dueDate,
}: {
  userId: string;
  title: string;
  sectie: SectieId;
  priority: number;
  durationMinutes?: number | null;
  dueDate?: string | null;
}) {
  return supabase
    .from("tasks")
    .insert({
      user_id: userId,
      title,
      category: SECTIE_NAAR_CATEGORY[sectie],
      priority,
      duration_minutes: durationMinutes ?? null,
      due_date: dueDate ?? null,
      is_completed: false,
    })
    .select()
    .single();
}

export async function werkTaakBijInDatabase({
  id,
  title,
  sectie,
  priority,
  durationMinutes,
  dueDate,
}: {
  id: string;
  title: string;
  sectie: SectieId;
  priority: number;
  durationMinutes?: number | null;
  dueDate?: string | null;
}) {
  return supabase
    .from("tasks")
    .update({
      title,
      category: SECTIE_NAAR_CATEGORY[sectie],
      priority,
      duration_minutes: durationMinutes ?? null,
      due_date: dueDate ?? null,
    })
    .eq("id", id)
    .select()
    .single();
}

export async function updateTaakVoltooid({
  id,
  completed,
}: {
  id: string;
  completed: boolean;
}) {
  // De categorie blijft ongewijzigd zodat een taak bij het opnieuw
  // activeren automatisch terugkeert naar zijn oorspronkelijke sectie.
  return supabase
    .from("tasks")
    .update({
      is_completed: completed,
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
