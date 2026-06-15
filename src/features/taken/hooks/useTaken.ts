import { useCallback, useEffect, useMemo, useState } from "react";

import { STANDAARD_OPEN_SECTIES } from "@/features/taken/constants/taken";
import type {
  Prioriteit,
  SectieId,
  SectieOpenState,
  Taak,
} from "@/features/taken/types/taken";
import {
  bepaalSectie,
  groepeerPerSectie,
  telPerSectie,
} from "@/features/taken/utils/taken";
import { supabase } from "@/lib/supabase";

const SECTIE_NAAR_CATEGORY: Record<SectieId, string> = {
  nu: "nu",
  straks: "straks",
  later: "later",
  taak: "braindump",
  voltooid: "voltooid",
};

const CATEGORY_NAAR_SECTIE: Record<string, SectieId> = {
  nu: "nu",
  straks: "straks",
  later: "later",
  braindump: "taak",
  voltooid: "voltooid",
};

function rijNaarTaak(rij: Record<string, unknown>): Taak & { _uuid: string } {
  return {
    id: Math.abs(
      String(rij.id)
        .split("")
        .reduce((a, c) => a + c.charCodeAt(0), 0),
    ),
    _uuid: String(rij.id),
    text: String(rij.title ?? ""),
    prioriteit: (rij.priority === 2
      ? "hoog"
      : rij.priority === 1
        ? "gemiddeld"
        : null) as Prioriteit | null,
    duur: null,
    sectie: (CATEGORY_NAAR_SECTIE[String(rij.category ?? "later")] ??
      "later") as SectieId,
    completed: Boolean(rij.is_completed),
  };
}

export function useTaken() {
  const [taken, setTaken] = useState<(Taak & { _uuid: string })[]>([]);
  const [openSecties, setOpenSecties] = useState<SectieOpenState>(
    STANDAARD_OPEN_SECTIES,
  );
  const [tekst, setTekst] = useState("");
  const [geselecteerdePrioriteit, setGeselecteerdePrioriteit] =
    useState<Prioriteit | null>(null);
  const [geselecteerdeDuur, setGeselecteerdeDuur] = useState<number | null>(
    null,
  );

  // ─── Taken ophalen ────────────────────────────────────────────────────────
  useEffect(() => {
    async function laadTaken() {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("position", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Taken ophalen mislukt:", error.message);
        return;
      }

      setTaken((data ?? []).map(rijNaarTaak));
    }

    laadTaken();

    const channel = supabase
      .channel("taken-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        laadTaken,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const takenPerSectie = useMemo(() => groepeerPerSectie(taken), [taken]);
  const aantalPerSectie = useMemo(() => telPerSectie(taken), [taken]);

  const resetFormulier = useCallback(() => {
    setTekst("");
    setGeselecteerdePrioriteit(null);
    setGeselecteerdeDuur(null);
  }, []);

  // ─── Taak toevoegen ───────────────────────────────────────────────────────
  const voegTaakToe = useCallback(async () => {
    const trimmed = tekst.trim();
    if (!trimmed) return false;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error("Niet ingelogd");
      return false;
    }

    const sectie = bepaalSectie(geselecteerdePrioriteit);
    const priority =
      geselecteerdePrioriteit === "hoog"
        ? 2
        : geselecteerdePrioriteit === "gemiddeld"
          ? 1
          : 0;

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        user_id: user.id,
        title: trimmed,
        category: SECTIE_NAAR_CATEGORY[sectie],
        priority,
        is_completed: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Taak toevoegen mislukt:", error.message);
      return false;
    }

    setTaken((huidig) => [...huidig, rijNaarTaak(data)]);
    resetFormulier();
    return true;
  }, [tekst, geselecteerdePrioriteit, resetFormulier]);

  // ─── Taak voltooien / heractiveren ────────────────────────────────────────
  const toggleTaakVoltooid = useCallback(
    async (id: number) => {
      const taak = taken.find((t) => t.id === id);
      if (!taak) return;

      const wordtVoltooid = !taak.completed;
      const nieuweSectie = wordtVoltooid
        ? "voltooid"
        : bepaalSectie(taak.prioriteit);
      const nieuweCategory = SECTIE_NAAR_CATEGORY[nieuweSectie];

      // Optimistisch updaten
      setTaken((huidig) =>
        huidig.map((t) =>
          t.id === id
            ? { ...t, completed: wordtVoltooid, sectie: nieuweSectie }
            : t,
        ),
      );

      const { error } = await supabase
        .from("tasks")
        .update({
          is_completed: wordtVoltooid,
          category: nieuweCategory,
          completed_at: wordtVoltooid ? new Date().toISOString() : null,
        })
        .eq("id", taak._uuid);

      if (error) {
        console.error("Taak updaten mislukt:", error.message);
        // Terugdraaien bij fout
        setTaken((huidig) =>
          huidig.map((t) =>
            t.id === id
              ? { ...t, completed: taak.completed, sectie: taak.sectie }
              : t,
          ),
        );
      }
    },
    [taken],
  );

  // ─── Taak verwijderen ─────────────────────────────────────────────────────
  const verwijderTaak = useCallback(
    async (id: number) => {
      const taak = taken.find((t) => t.id === id);
      if (!taak) return;

      // Optimistisch verwijderen
      setTaken((huidig) => huidig.filter((t) => t.id !== id));

      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taak._uuid);

      if (error) {
        console.error("Taak verwijderen mislukt:", error.message);
        // Terugplaatsen bij fout
        setTaken((huidig) => [...huidig, taak]);
      }
    },
    [taken],
  );

  // ─── Sectie open/dicht ────────────────────────────────────────────────────
  const toggleSectie = useCallback((sectieId: SectieId) => {
    setOpenSecties((huidig) => ({
      ...huidig,
      [sectieId]: !huidig[sectieId],
    }));
  }, []);

  return {
    taken,
    openSecties,
    tekst,
    setTekst,
    geselecteerdePrioriteit,
    setGeselecteerdePrioriteit,
    geselecteerdeDuur,
    setGeselecteerdeDuur,
    takenPerSectie,
    aantalPerSectie,
    voegTaakToe,
    resetFormulier,
    toggleTaakVoltooid,
    verwijderTaak,
    toggleSectie,
  };
}
