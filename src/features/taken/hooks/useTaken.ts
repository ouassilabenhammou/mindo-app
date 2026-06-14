import { useCallback, useMemo, useState } from "react";

import type { Prioriteit, SectieId, SectieOpenState, Taak } from "@/app/types/taken";
import { STANDAARD_OPEN_SECTIES } from "@/features/taken/constants/taken";
import { bepaalSectie, groepeerPerSectie, telPerSectie } from "@/features/taken/utils/taken";

export function useTaken() {
  const [taken, setTaken] = useState<Taak[]>([]);
  const [openSecties, setOpenSecties] =
    useState<SectieOpenState>(STANDAARD_OPEN_SECTIES);

  const [tekst, setTekst] = useState("");
  const [geselecteerdePrioriteit, setGeselecteerdePrioriteit] =
    useState<Prioriteit | null>(null);
  const [geselecteerdeDuur, setGeselecteerdeDuur] = useState<number | null>(null);

  const takenPerSectie = useMemo(() => groepeerPerSectie(taken), [taken]);
  const aantalPerSectie = useMemo(() => telPerSectie(taken), [taken]);

  const resetFormulier = useCallback(() => {
    setTekst("");
    setGeselecteerdePrioriteit(null);
    setGeselecteerdeDuur(null);
  }, []);

  const voegTaakToe = useCallback(() => {
    const trimmed = tekst.trim();
    if (!trimmed) return false;

    const nieuweTaak: Taak = {
      id: Date.now(),
      text: trimmed,
      prioriteit: geselecteerdePrioriteit,
      duur: geselecteerdeDuur,
      sectie: bepaalSectie(geselecteerdePrioriteit),
      completed: false,
    };

    setTaken((huidig) => [...huidig, nieuweTaak]);
    resetFormulier();
    return true;
  }, [tekst, geselecteerdePrioriteit, geselecteerdeDuur, resetFormulier]);

  const toggleTaakVoltooid = useCallback((id: number) => {
    setTaken((huidig) =>
      huidig.map((taak) => {
        if (taak.id !== id) return taak;

        if (taak.completed) {
          return {
            ...taak,
            completed: false,
            sectie: bepaalSectie(taak.prioriteit),
          };
        }

        return {
          ...taak,
          completed: true,
          sectie: "voltooid",
        };
      }),
    );
  }, []);

  const verwijderTaak = useCallback((id: number) => {
    setTaken((huidig) => huidig.filter((taak) => taak.id !== id));
  }, []);

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
