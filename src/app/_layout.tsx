import { Stack } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { AuthProvider, useAuth } from "../context/AuthContext";

function RootNavigator() {
  const { session, cargando, error, reintentar } = useAuth();

  if (cargando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#f5d0a9" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>No se pudo recuperar la sesión</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={reintentar}>
          <Text style={styles.retryText}>Intentar de nuevo</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#070b12",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#070b12",
  },
  errorTitle: {
    color: "#f8fafc",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  errorText: {
    color: "#cbd5e1",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#b98959",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  retryText: {
    color: "#101827",
    fontWeight: "bold",
  },
});
