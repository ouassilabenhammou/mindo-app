import { Mistral } from "@mistralai/mistralai";

import type {
  PrioriteerInput,
  PrioriteerResponse,
  PrioriteerResultaat,
} from "@/features/ai/types/prioriteit";

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
