import { Mistral } from "@mistralai/mistralai";

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

const apiKey = process.env.EXPO_PUBLIC_MISTRAL_API_KEY;

const client = new Mistral({ apiKey });

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

function haalTekstUitResponse(
  outputs: Array<{ type?: string; content?: string | unknown[] }>,
): string | null {
  for (const output of outputs) {
    if (output.type !== "message.output") continue;

    const { content } = output;
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
      const tekst = content
        .map((chunk) =>
          typeof chunk === "object" &&
          chunk !== null &&
          "text" in chunk &&
          typeof chunk.text === "string"
            ? chunk.text
            : "",
        )
        .join("");
      if (tekst) return tekst;
    }
  }

  return null;
}

export async function braindumpNaarTaken(
  braindump: string,
): Promise<BraindumpTaak[] | null> {
  if (!apiKey) {
    console.error("Mistral API key ontbreekt");
    return null;
  }

  const tekst = braindump.trim();
  if (!tekst) return [];

  try {
    const response = await client.beta.conversations.start({
      model: "mistral-medium-latest",
      inputs: [
        {
          role: "user",
          content: tekst,
        },
      ],
      instructions: BRAIN_DUMP_INSTRUCTIES,
      completionArgs: {
        responseFormat: { type: "json_object" },
        temperature: 0.7,
        maxTokens: 2048,
        topP: 1,
      },
      tools: [],
    });

    const content = haalTekstUitResponse(response.outputs);
    if (!content) {
      console.error("Geen AI-antwoord ontvangen");
      return null;
    }

    return parseBraindumpResponse(content);
  } catch (error) {
    console.error("Mistral fout:", error);
    return null;
  }
}

export async function prioriteerTaken(
  taken: PrioriteerInput[],
): Promise<PrioriteerResultaat[] | null> {
  if (!apiKey) {
    console.error("Mistral API key ontbreekt");
    return null;
  }

  if (taken.length === 0) return [];

  try {
    const response = await client.beta.conversations.start({
      model: "mistral-medium-latest",
      inputs: [
        {
          role: "user",
          content: formatTakenVoorPrompt(taken),
        },
      ],
      instructions: `Je bent Mindo Coach.
Deel elke taak in bij Nu, Straks of Later op basis van urgentie, datum en duur.
Gebruik exact de meegegeven id per taak.
Geef ALLEEN geldige JSON terug in dit formaat:
{"taken":[{"id":"<uuid>","sectie":"nu|straks|later"}]}
Maak geen subtaken. Geef geen uitleg.`,
      completionArgs: {
        responseFormat: { type: "json_object" },
        temperature: 0.2,
      },
    });

    const content = haalTekstUitResponse(response.outputs);
    if (!content) {
      console.error("Geen AI-antwoord ontvangen");
      return null;
    }

    return parsePrioriteerResponse(content);
  } catch (error) {
    console.error("Mistral fout:", error);
    return null;
  }
}
