import { AuthProvider } from "@/features/auth/hooks/useAuth";
import AppSplash from "@/features/onboarding/components/AppSplash";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 300, fade: true });

export default function RootLayout() {
  const [splashKlaar, setSplashKlaar] = useState(false);

  useEffect(() => {
    // Verberg de native splash zodra de JS-bundel klaar is; de in-app
    // splash neemt het naadloos over (zelfde achtergrond en logo).
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }} />
          {!splashKlaar && (
            <AppSplash onFinish={() => setSplashKlaar(true)} />
          )}
        </View>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
