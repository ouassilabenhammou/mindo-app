import { useCallback, useEffect, useMemo, useState } from "react";

import { STANDAARD_OPEN_SECTIES } from "@/features/taken/constants/taken";
import {
  prioritizeTasks,
  type PrioritizeResult,
} from "@/services/aiPrioritizeService";
import {
  haalTakenOp,
  updateTaakVoltooid,
  verwijderTaakUitDatabase,
  voegTaakToeAanDatabase,
  werkTaakBijInDatabase,
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
  prioriteitNaarDbWaarde,
  telPerSectie,
} from "@/features/taken/utils/taken";
import { rijNaarTaak } from "@/features/taken/utils/takenMapper";
import { subscribeToTable } from "@/lib/realtime";
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
  const [geselecteerdeDatum, setGeselecteerdeDatum] = useState<Date | null>(
    null,
  );
  const [bewerkTaakId, setBewerkTaakId] = useState<string | null>(null);
  const [isPrioriteren, setIsPrioriteren] = useState(false);

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

    const channel = subscribeToTable("tasks", laadTaken);

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
    setGeselecteerdeDatum(null);
    setBewerkTaakId(null);
  }, []);

  const startBewerken = useCallback((taak: Taak) => {
    setBewerkTaakId(taak._uuid);
    setTekst(taak.text);
    setGeselecteerdePrioriteit(taak.prioriteit);
    setGeselecteerdeDuur(taak.duur);
    setGeselecteerdeDatum(taak.vervaldatum ? new Date(taak.vervaldatum) : null);
  }, []);

  const slaTaakOp = useCallback(async () => {
    const trimmed = tekst.trim();
    if (!trimmed) return false;

    const sectie = bepaalSectie(geselecteerdePrioriteit);
    const priority = prioriteitNaarDbWaarde(geselecteerdePrioriteit);
    const dueDate = geselecteerdeDatum
      ? geselecteerdeDatum.toISOString()
      : null;

    if (bewerkTaakId) {
      const { data, error } = await werkTaakBijInDatabase({
        id: bewerkTaakId,
        title: trimmed,
        sectie,
        priority,
        durationMinutes: geselecteerdeDuur,
        dueDate,
      });

      if (error) {
        console.error("Taak bijwerken mislukt:", error.message);
        return false;
      }

      setTaken((huidig) =>
        huidig.map((t) => (t._uuid === bewerkTaakId ? rijNaarTaak(data) : t)),
      );
      resetFormulier();
      return true;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("Niet ingelogd");
      return false;
    }

    const { data, error } = await voegTaakToeAanDatabase({
      userId: user.id,
      title: trimmed,
      sectie,
      priority,
      durationMinutes: geselecteerdeDuur,
      dueDate,
    });

    if (error) {
      console.error("Taak toevoegen mislukt:", error.message);
      return false;
    }

    setTaken((huidig) => [...huidig, rijNaarTaak(data)]);
    resetFormulier();
    return true;
  }, [
    tekst,
    geselecteerdePrioriteit,
    geselecteerdeDuur,
    geselecteerdeDatum,
    bewerkTaakId,
    resetFormulier,
  ]);

  const toggleTaakVoltooid = useCallback(
    async (id: number) => {
      const taak = taken.find((t) => t.id === id);
      if (!taak) return;

      const wordtVoltooid = !taak.completed;

      // Bij heractiveren keert de taak terug naar zijn oorspronkelijke sectie.
      // Voor oudere taken die nog letterlijk "voltooid" als sectie hadden,
      // leiden we de sectie opnieuw af uit de prioriteit.
      const herstelSectie =
        taak.sectie === "voltooid"
          ? bepaalSectie(taak.prioriteit)
          : taak.sectie;
      const nieuweSectie = wordtVoltooid ? taak.sectie : herstelSectie;

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

  const prioriteerMetAI =
    useCallback(async (): Promise<PrioritizeResult | null> => {
      const openTaken = taken.filter((taak) => !taak.completed);
      if (openTaken.length === 0) return null;

      setIsPrioriteren(true);

      try {
        const result = await prioritizeTasks();
        await laadTaken();

        setOpenSecties((huidig) => ({
          ...huidig,
          nu: true,
          straks: true,
          later: true,
        }));

        return result;
      } catch (error) {
        console.error("Prioriteren mislukt:", error);
        return null;
      } finally {
        setIsPrioriteren(false);
      }
    }, [taken, laadTaken]);

  return {
    taken,
    openSecties,
    tekst,
    setTekst,
    geselecteerdePrioriteit,
    setGeselecteerdePrioriteit,
    geselecteerdeDuur,
    setGeselecteerdeDuur,
    geselecteerdeDatum,
    setGeselecteerdeDatum,
    bewerkTaakId,
    isBewerken: bewerkTaakId !== null,
    startBewerken,
    takenPerSectie,
    aantalPerSectie,
    slaTaakOp,
    resetFormulier,
    toggleTaakVoltooid,
    verwijderTaak,
    toggleSectie,
    prioriteerMetAI,
    isPrioriteren,
  };
}
