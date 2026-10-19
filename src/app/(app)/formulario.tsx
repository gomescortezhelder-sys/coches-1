import { useRouter } from "expo-router";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function Formulario() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const enviar = async () => {
    setError("");
    if (!nombre.trim() || !correo.trim() || !telefono.trim() || !ciudad.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      setGuardando(true);
      const { error: errorReserva } = await supabase
        .from("clientes_coches")
        .insert({
          nombre: nombre.trim(),
          correo: correo.trim(),
          telefono: telefono.trim(),
          ciudad: ciudad.trim(),
        });

      if (errorReserva) {
        setError(`No se pudo guardar la reserva: ${errorReserva.message}`);
        return;
      }

      router.push({
        pathname: "/resultado",
        params: {
          nombre: nombre.trim(),
          correo: correo.trim(),
          telefono: telefono.trim(),
          ciudad: ciudad.trim(),
        },
      });
    } catch (errorReserva) {
      setError(
        `No se pudo guardar la reserva: ${
          errorReserva instanceof Error
            ? errorReserva.message
            : "Error inesperado de conexión."
        }`
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Reserva de prueba de manejo</Text>
      <Text style={styles.subtitulo}>
        Completa tus datos para agendar tu experiencia con un deportivo premium.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese su nombre"
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.label}>Correo</Text>
        <TextInput
          style={styles.input}
          placeholder="correo@dominio.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={correo}
          onChangeText={setCorreo}
        />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          placeholder="3001234567"
          keyboardType="numeric"
          value={telefono}
          onChangeText={setTelefono}
        />

        <Text style={styles.label}>Ciudad</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Bogotá"
          value={ciudad}
          onChangeText={setCiudad}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          style={[styles.boton, guardando && styles.botonDeshabilitado]}
          onPress={enviar}
          disabled={guardando}
        >
          <Text style={styles.botonTexto}>
            {guardando ? "Guardando reserva..." : "Reservar prueba"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0b1020",
    padding: 20,
    justifyContent: "center",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#f8fafc",
    textAlign: "center",
  },
  subtitulo: {
    color: "#cbd5e1",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#111827",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#374151",
    elevation: 3,
  },
  label: {
    color: "#fca5a5",
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#1f2937",
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 13,
    padding: 12,
    marginBottom: 14,
    color: "#f8fafc",
  },
  boton: {
    backgroundColor: "#ef4444",
    paddingVertical: 14,
    borderRadius: 13,
    alignItems: "center",
    marginTop: 4,
  },
  botonDeshabilitado: {
    opacity: 0.7,
  },
  botonTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
  error: {
    color: "#fecaca",
    marginBottom: 12,
    lineHeight: 20,
  },
});
