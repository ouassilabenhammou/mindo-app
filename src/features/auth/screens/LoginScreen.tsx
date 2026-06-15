import { useAuth } from "@/features/auth/hooks/useAuth";
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
type AuthMode = "login" | "signup";

export default function LoginScreen() {
  const { signIn, signUp, loading } = useAuth();

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text style={styles.logo}>Mindo</Text>

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
            placeholderTextColor="#999"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="E-mailadres"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Wachtwoord"
          placeholderTextColor="#999"
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
    backgroundColor: "#FAFAFA",
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  logo: {
    fontSize: 40,
    fontWeight: "700",
    color: "#4A6FD6",
    textAlign: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A2E",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E8E8F0",
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1A1A2E",
    marginBottom: 14,
  },
  button: {
    backgroundColor: "#4A6FD6",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#4A6FD6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  switchMode: {
    marginTop: 20,
    alignItems: "center",
  },
  switchModeText: {
    fontSize: 15,
    color: "#4A6FD6",
    fontWeight: "500",
  },
});
