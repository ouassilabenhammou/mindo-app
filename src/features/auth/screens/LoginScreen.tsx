import { useAuth } from "@/features/auth/hooks/useAuth";
import { colors, radius, shadows, spacing, typography } from "@/theme";
import { Image } from "expo-image";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const logo = require("../../../../assets/images/mindo-logo.png");
type AuthMode = "login" | "signup";

export default function LoginScreen() {
  const { signIn, signUp, testLogin, loading } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) return;
    if (mode === "login") {
      await signIn(email, password);
    } else {
      await signUp(email, password, fullName);
    }
  };

  const handleTestLogin = async () => {
    await testLogin();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.inner}>
        <Image source={logo} style={styles.logo} contentFit="contain" />
        <Text style={styles.woordmerk}>Mindo</Text>

        <Text style={styles.title}>
          {mode === "login" ? "Welkom terug " : "Account aanmaken"}
        </Text>
        <Text style={styles.subtitle}>
          {mode === "login"
            ? "Log in om je taken te bekijken"
            : "Maak een Mindo-account aan"}
        </Text>

        {/* Naam (alleen bij registratie) */}
        {mode === "signup" && (
          <TextInput
            style={styles.input}
            placeholder="Jouw naam"
            placeholderTextColor={colors.textSubtle}
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="E-mailadres"
          placeholderTextColor={colors.textSubtle}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Wachtwoord"
          placeholderTextColor={colors.textSubtle}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {mode === "login" ? "Inloggen" : "Account aanmaken"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.testButton, loading && styles.buttonDisabled]}
          onPress={handleTestLogin}
          disabled={loading}
        >
          <Text style={styles.testButtonText}>of testen met testaccount</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchMode}
          onPress={() => setMode(mode === "login" ? "signup" : "login")}
        >
          <Text style={styles.switchModeText}>
            {mode === "login"
              ? "Nog geen account? Registreer je"
              : "Al een account? Log in"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingBottom: spacing.xxxl,
  },
  logo: {
    width: 72,
    height: 72,
    alignSelf: "center",
    marginBottom: spacing.sm,
  },
  woordmerk: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
    letterSpacing: -0.5,
    marginBottom: spacing.xxxl,
  },
  title: {
    ...typography.screenTitle,
    fontSize: 28,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: spacing.xxxl,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 18,
    paddingVertical: spacing.lg,
    fontSize: 16,
    color: colors.text,
    marginBottom: 14,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: spacing.sm,
    ...shadows.primary,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  testButton: {
    backgroundColor: colors.secondarySoft,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.secondary,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: spacing.md,
  },
  testButtonText: {
    color: colors.textOnLavender,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  switchMode: {
    marginTop: spacing.xl,
    alignItems: "center",
  },
  switchModeText: {
    fontSize: 15,
    color: colors.accent,
    fontWeight: "600",
  },
});
