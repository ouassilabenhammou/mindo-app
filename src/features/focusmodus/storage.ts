import AsyncStorage from "@react-native-async-storage/async-storage";

const FOCUS_UITLEG_KEY = "mindo.focus.uitlegVerborgen.v1";

export async function isFocusUitlegVerborgen(): Promise<boolean> {
  try {
    const waarde = await AsyncStorage.getItem(FOCUS_UITLEG_KEY);
    return waarde === "true";
  } catch {
    return false;
  }
}

export async function markeerFocusUitlegVerborgen(): Promise<void> {
  try {
    await AsyncStorage.setItem(FOCUS_UITLEG_KEY, "true");
  } catch {
    // Stilletjes negeren: uitleg wordt dan opnieuw getoond, geen blocker.
  }
}
