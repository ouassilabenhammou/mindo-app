import { Pressable, Text, View } from "react-native";

import { prioriteerTaken } from "@/features/ai/services/mistral";

export default function Mindo() {
  async function testAI() {
    console.log("Knop geklikt");

    const response = await prioriteerTaken(`
- Portfolio afmaken | 60 min | dinsdag
- Feedback verwerken | 30 min | morgen
- Boodschappen doen | 15 min | geen datum
`);

    console.log("AI response:", response);
  }

  return (
    <View>
      <Text>Mindo</Text>

      <Pressable onPress={testAI}>
        <Text>Test AI</Text>
      </Pressable>
    </View>
  );
}
