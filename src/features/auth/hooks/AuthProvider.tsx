import { supabase } from "@/lib/supabase";
import type { AuthContextValue } from "@/features/auth/types/auth";
import { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Alert } from "react-native";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error: unknown) {
      Alert.alert(
        "Inloggen mislukt",
        error instanceof Error ? error.message : "Onbekende fout",
      );
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName?: string,
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: fullName ? { data: { full_name: fullName } } : undefined,
      });
      if (error) throw error;
      if (data.session) {
        Alert.alert("Welkom!", "Je account is aangemaakt.");
      } else {
        Alert.alert(
          "Bijna klaar!",
          "Check je e-mail om je account te bevestigen.",
        );
      }
    } catch (error: unknown) {
      Alert.alert(
        "Registratie mislukt",
        error instanceof Error ? error.message : "Onbekende fout",
      );
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert("Uitloggen mislukt", error.message);
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke<{
        access_token: string;
        refresh_token: string;
      }>("test-login", { method: "POST" });
      if (error) throw error;
      if (!data?.access_token || !data?.refresh_token) {
        throw new Error("Geen geldige sessie ontvangen van de testaccount.");
      }
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });
      if (sessionError) throw sessionError;
    } catch (error: unknown) {
      Alert.alert(
        "Testaccount inloggen mislukt",
        error instanceof Error ? error.message : "Onbekende fout",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ session, user, loading, signIn, signUp, signOut, testLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
