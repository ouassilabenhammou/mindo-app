import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "mindo.onboarding.voltooid.v1";

export async function isOnboardingVoltooid(): Promise<boolean> {
  try {
    const waarde = await AsyncStorage.getItem(ONBOARDING_KEY);
    return waarde === "true";
  } catch {
    return false;
  }
}

export async function markeerOnboardingVoltooid(): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
  } catch {
    // Stilletjes negeren: onboarding wordt dan opnieuw getoond, geen blocker.
  }
}
