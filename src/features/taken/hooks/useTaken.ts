import { useCallback, useEffect, useMemo, useState } from "react";

import { STANDAARD_OPEN_SECTIES } from "@/features/taken/constants/taken";
import {
  haalTakenOp,
  updateTaakVoltooid,
  verwijderTaakUitDatabase,
  voegTaakToeAanDatabase,
} from "@/features/taken/services/takenService";
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
import { rijNaarTaak } from "@/features/taken/utils/takenMapper";
import { supabase } from "@/lib/supabase";

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

  const laadTaken = useCallback(async () => {
    const { data, error } = await haalTakenOp();

    if (error) {
      console.error("Taken ophalen mislukt:", error.message);
      return;
    }

    setTaken((data ?? []).map(rijNaarTaak));
  }, []);

  useEffect(() => {
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
  }, [laadTaken]);

  const takenPerSectie = useMemo(() => groepeerPerSectie(taken), [taken]);
  const aantalPerSectie = useMemo(() => telPerSectie(taken), [taken]);

  const resetFormulier = useCallback(() => {
    setTekst("");
    setGeselecteerdePrioriteit(null);
    setGeselecteerdeDuur(null);
  }, []);

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

    const { data, error } = await voegTaakToeAanDatabase({
      userId: user.id,
      title: trimmed,
      sectie,
      priority,
    });

    if (error) {
      console.error("Taak toevoegen mislukt:", error.message);
      return false;
    }

    setTaken((huidig) => [...huidig, rijNaarTaak(data)]);
    resetFormulier();
    return true;
  }, [tekst, geselecteerdePrioriteit, resetFormulier]);

  const toggleTaakVoltooid = useCallback(
    async (id: number) => {
      const taak = taken.find((t) => t.id === id);
      if (!taak) return;

      const wordtVoltooid = !taak.completed;
      const nieuweSectie = wordtVoltooid
        ? "voltooid"
        : bepaalSectie(taak.prioriteit);

      setTaken((huidig) =>
        huidig.map((t) =>
          t.id === id
            ? { ...t, completed: wordtVoltooid, sectie: nieuweSectie }
            : t,
        ),
      );

      const { error } = await updateTaakVoltooid({
        id: taak._uuid,
        completed: wordtVoltooid,
        sectie: nieuweSectie,
      });

      if (error) {
        console.error("Taak updaten mislukt:", error.message);

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

  const verwijderTaak = useCallback(
    async (id: number) => {
      const taak = taken.find((t) => t.id === id);
      if (!taak) return;

      setTaken((huidig) => huidig.filter((t) => t.id !== id));

      const { error } = await verwijderTaakUitDatabase(taak._uuid);

      if (error) {
        console.error("Taak verwijderen mislukt:", error.message);
        setTaken((huidig) => [...huidig, taak]);
      }
    },
    [taken],
  );

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
