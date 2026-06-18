import { supabase } from "@/lib/supabase";

import type {
  BraindumpResponse,
  BraindumpTaak,
} from "@/features/ai/types/braindump";
import type {
  PrioriteerInput,
  PrioriteerResponse,
  PrioriteerResultaat,
} from "@/features/ai/types/prioriteit";

const BRAIN_DUMP_INSTRUCTIES = `Je bent Mindo Coach.

Je helpt studenten om een braindump om te zetten naar concrete taken.

Jouw taak:

* Analyseer de volledige braindump van de gebruiker.
* Haal alleen concrete taken, acties of verplichtingen uit de tekst.
* Verzin geen nieuwe taken.
* Voeg geen informatie toe die niet door de gebruiker is genoemd.
* Splits alleen op wanneer duidelijk meerdere taken worden genoemd.
* Houd taaknamen kort en duidelijk.
* Verwijder dubbele taken.
* Negeer losse gedachten, emoties of informatie waar geen actie aan gekoppeld is.
* Herken datums wanneer deze expliciet genoemd worden.
* Gebruik de genoemde datum alleen wanneer deze duidelijk uit de tekst blijkt.

Regels:

* Maak van elke taak één duidelijke titel.
* Voeg geen prioriteit toe.
* Voeg geen duur toe.
* Voeg geen subtaken toe.
* Geef geen uitleg.

Geef ALLEEN geldige JSON terug in dit formaat:
{"taken":[{"titel":"...","datum":"YYYY-MM-DD"|null}]}`;

function formatTakenVoorPrompt(taken: PrioriteerInput[]): string {
  const regels = taken.map((taak) => {
    const duur = taak.duur ? `${taak.duur} min` : "geen duur";
    return `- id: ${taak.id} | ${taak.text} | ${duur}`;
  });

  return regels.join("\n");
}

function parsePrioriteerResponse(content: string): PrioriteerResultaat[] {
  const parsed = JSON.parse(content) as PrioriteerResponse;

  if (!Array.isArray(parsed.taken)) {
    throw new Error("Ongeldig AI-antwoord: 'taken' ontbreekt");
  }

  const geldigeSecties = new Set(["nu", "straks", "later"]);

  return parsed.taken.filter(
    (item): item is PrioriteerResultaat =>
      typeof item.id === "string" &&
      typeof item.sectie === "string" &&
      geldigeSecties.has(item.sectie),
  );
}

function parseBraindumpResponse(content: string): BraindumpTaak[] {
  const parsed = JSON.parse(content) as BraindumpResponse;

  if (!Array.isArray(parsed.taken)) {
    throw new Error("Ongeldig AI-antwoord: 'taken' ontbreekt");
  }

  return parsed.taken.filter(
    (item): item is BraindumpTaak =>
      typeof item.titel === "string" &&
      item.titel.length > 0 &&
      (item.datum === null || typeof item.datum === "string"),
  );
}

export async function braindumpNaarTaken(
  braindump: string,
): Promise<BraindumpTaak[] | null> {
  const tekst = braindump.trim();
  if (!tekst) return [];

  try {
    const { data, error } = await supabase.functions.invoke("ai-braindump", {
      body: { braindump: tekst },
    });

    if (error) {
      console.error("Braindump Edge Function fout:", error);
      return null;
    }

    const content = JSON.stringify(data);
    if (!content) {
      console.error("Geen AI-antwoord ontvangen");
      return null;
    }

    return parseBraindumpResponse(content);
  } catch (error) {
    console.error("Braindump fout:", error);
    return null;
  }
}

export async function prioriteerTaken(
  taken: PrioriteerInput[],
): Promise<PrioriteerResultaat[] | null> {
  if (taken.length === 0) return [];

  try {
    const { data, error } = await supabase.functions.invoke("ai-prioritize", {
      body: { taken: formatTakenVoorPrompt(taken) },
    });

    if (error) {
      console.error("Prioriteer Edge Function fout:", error);
      return null;
    }

    const content = JSON.stringify(data);
    if (!content) {
      console.error("Geen AI-antwoord ontvangen");
      return null;
    }

    return parsePrioriteerResponse(content);
  } catch (error) {
    console.error("Prioriteer fout:", error);
    return null;
  }
}
