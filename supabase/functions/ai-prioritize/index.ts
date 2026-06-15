import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type TaskRow = {
  id: string;
  title: string;
  due_date: string | null;
  priority: number | null;
};

type PrioriteerItem = {
  id: string;
  category: "nu" | "straks" | "later";
};

function formatTakenVoorPrompt(taken: TaskRow[]): string {
  return taken
    .map((taak) => {
      const datum = taak.due_date
        ? ` | deadline: ${taak.due_date}`
        : " | geen deadline";
      const prioriteit =
        taak.priority === 2
          ? "hoog"
          : taak.priority === 1
            ? "gemiddeld"
            : taak.priority === 0
              ? "laag"
              : "geen prioriteit";
      return `- id: ${taak.id} | ${taak.title} | prioriteit: ${prioriteit}${datum}`;
    })
    .join("\n");
}

async function prioriteerMetMistral(
  taken: TaskRow[],
): Promise<PrioriteerItem[]> {
  const apiKey = Deno.env.get("MISTRAL_API_KEY");
  if (!apiKey) {
    throw new Error("MISTRAL_API_KEY ontbreekt");
  }

  const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "mistral-medium-latest",
      messages: [
        {
          role: "system",
          content: `Je bent Mindo Coach.
Deel elke taak in bij nu, straks of later op basis van urgentie, deadline en prioriteit.
Gebruik exact de meegegeven id per taak.
Geef ALLEEN geldige JSON terug in dit formaat:
{"taken":[{"id":"<uuid>","category":"nu|straks|later"}]}
Maak geen subtaken. Geef geen uitleg.`,
        },
        {
          role: "user",
          content: formatTakenVoorPrompt(taken),
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Mistral API fout: ${response.status} ${body}`);
  }

  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    throw new Error("Geen AI-antwoord ontvangen");
  }

  const parsed = JSON.parse(content) as { taken?: PrioriteerItem[] };
  const geldigeCategories = new Set(["nu", "straks", "later"]);

  return (parsed.taken ?? []).filter(
    (item): item is PrioriteerItem =>
      typeof item.id === "string" &&
      typeof item.category === "string" &&
      geldigeCategories.has(item.category),
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } },
    );

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: taken, error: takenError } = await supabaseClient
      .from("tasks")
      .select("id, title, due_date, priority")
      .eq("user_id", user.id)
      .eq("is_completed", false);

    if (takenError) {
      throw takenError;
    }

    const openTaken = (taken ?? []) as TaskRow[];

    if (openTaken.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          updated: 0,
          total: 0,
          message: "Geen open taken om te prioriteren",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const prioriteiten = await prioriteerMetMistral(openTaken);
    const errors: string[] = [];
    let updated = 0;

    for (const item of prioriteiten) {
      const { error } = await supabaseClient
        .from("tasks")
        .update({ category: item.category })
        .eq("id", item.id)
        .eq("user_id", user.id);

      if (error) {
        errors.push(`${item.id}: ${error.message}`);
        continue;
      }

      updated += 1;
    }

    return new Response(
      JSON.stringify({
        success: errors.length === 0,
        updated,
        total: openTaken.length,
        prioriteiten,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Onbekende serverfout";

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
