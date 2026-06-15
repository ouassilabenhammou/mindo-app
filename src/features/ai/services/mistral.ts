import { Mistral } from "@mistralai/mistralai";

const apiKey = process.env.EXPO_PUBLIC_MISTRAL_API_KEY;

console.log("Mistral API key aanwezig:", !!apiKey);
console.log("Mistral API key start:", apiKey?.slice(0, 8));

const client = new Mistral({
  apiKey,
});

export async function prioriteerTaken(input: string) {
  try {
    const response = await client.beta.conversations.start({
      model: "mistral-medium-latest",
      inputs: [
        {
          role: "user",
          content: input,
        },
      ],
      instructions: `
Je bent Mindo Coach.
Deel taken in bij Nu, Straks of Later op basis van datum en duur.
Maak geen subtaken.
Geef geen uitleg.
`,
    });

    console.log("Mistral response:", response);
    return response;
  } catch (error) {
    console.error("Mistral fout:", error);
    return null;
  }
}
