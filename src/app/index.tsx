import { useAuth } from "@/features/auth/hooks/useAuth";
import LoginScreen from "@/features/auth/screens/LoginScreen";
import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Index() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#4A6FD6" />
      </View>
    );
  }

  if (!session) {
    return <LoginScreen />;
  }

  return <Redirect href="/agenda" />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
});
