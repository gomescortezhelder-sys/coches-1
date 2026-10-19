import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const iniciarSesion = async () => {
    setError("");
    if (!correo.trim() || !password) {
      setError("Ingrese correo y contraseña.");
      return;
    }

    try {
      setCargando(true);
      const { error: errorInicio } = await supabase.auth.signInWithPassword({
        email: correo.trim(),
        password,
      });
      if (errorInicio) {
        setError(errorInicio.message);
      }
    } catch (errorInicio) {
      setError(
        errorInicio instanceof Error
          ? errorInicio.message
          : "No se pudo iniciar sesión."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.marca}>APEX PERFORMANCE</Text>
        <Text style={styles.logo}>🏎️</Text>
        <Text style={styles.titulo}>Bienvenido</Text>
        <Text style={styles.subtitulo}>
          Inicia sesión para continuar con tu experiencia premium.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#94a3b8"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#94a3b8"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="current-password"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable
          style={[styles.boton, cargando && styles.botonDeshabilitado]}
          onPress={iniciarSesion}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color="#101827" />
          ) : (
            <Text style={styles.botonTexto}>Iniciar sesión</Text>
          )}
        </Pressable>
        <Pressable onPress={() => router.push("/registro")}>
          <Text style={styles.enlace}>¿No tienes cuenta? Regístrate</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#070b12",
  },
  card: {
    width: "100%",
    maxWidth: 460,
    alignSelf: "center",
    backgroundColor: "#101827",
    borderColor: "#2f3b4d",
    borderWidth: 1,
    borderRadius: 24,
    padding: 24,
  },
  marca: {
    color: "#f5d0a9",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 2,
    textAlign: "center",
  },
  logo: {
    fontSize: 52,
    textAlign: "center",
    marginTop: 12,
  },
  titulo: {
    color: "#f8fafc",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
  },
  subtitulo: {
    color: "#cbd5e1",
    textAlign: "center",
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 22,
  },
  input: {
    backgroundColor: "#1a2332",
    borderWidth: 1,
    borderColor: "#3b4657",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    color: "#f8fafc",
  },
  error: {
    color: "#fecaca",
    marginBottom: 12,
    lineHeight: 20,
  },
  boton: {
    backgroundColor: "#f5d0a9",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
  },
  botonDeshabilitado: {
    opacity: 0.7,
  },
  botonTexto: {
    color: "#101827",
    fontWeight: "bold",
  },
  enlace: {
    color: "#f5d0a9",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "600",
  },
});
