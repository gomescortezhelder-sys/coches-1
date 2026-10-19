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

export default function Registro() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const crearCuenta = async () => {
    setError("");
    setMensaje("");
    if (!correo.trim() || !password) {
      setError("Ingrese correo y contraseña.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener mínimo 6 caracteres.");
      return;
    }

    try {
      setGuardando(true);
      const { error: errorRegistro } = await supabase.auth.signUp({
        email: correo.trim(),
        password,
      });
      if (errorRegistro) {
        setError(errorRegistro.message);
        return;
      }

      const { error: errorSalida } = await supabase.auth.signOut();
      if (errorSalida) {
        setError(
          `La cuenta se creó, pero no se pudo cerrar la sesión: ${errorSalida.message}`
        );
        return;
      }

      setMensaje("Cuenta creada. Inicia sesión con tus nuevos datos.");
      router.replace("/login");
    } catch (errorRegistro) {
      setError(
        errorRegistro instanceof Error
          ? errorRegistro.message
          : "No se pudo crear la cuenta."
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.marca}>APEX PERFORMANCE</Text>
        <Text style={styles.logo}>🚘</Text>
        <Text style={styles.titulo}>Crear cuenta</Text>
        <Text style={styles.subtitulo}>
          Regístrate para descubrir y reservar tu próxima experiencia de manejo.
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
          placeholder="Contraseña (mínimo 6 caracteres)"
          placeholderTextColor="#94a3b8"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="new-password"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}
        <Pressable
          style={[styles.boton, guardando && styles.botonDeshabilitado]}
          onPress={crearCuenta}
          disabled={guardando}
        >
          {guardando ? (
            <ActivityIndicator color="#101827" />
          ) : (
            <Text style={styles.botonTexto}>Crear cuenta</Text>
          )}
        </Pressable>
        <Pressable onPress={() => router.replace("/login")}>
          <Text style={styles.enlace}>Ya tengo una cuenta</Text>
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
    fontSize: 28,
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
  mensaje: {
    color: "#bbf7d0",
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
