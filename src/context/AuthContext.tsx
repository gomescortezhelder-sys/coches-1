import type { Session } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "../lib/supabase";

type AuthContextType = {
  session: Session | null;
  cargando: boolean;
  error: string | null;
  reintentar: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intentos, setIntentos] = useState(0);

  useEffect(() => {
    let activo = true;
    let cambioDeAuthRecibido = false;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nuevaSesion) => {
      cambioDeAuthRecibido = true;
      if (activo) {
        setSession(nuevaSesion);
        setError(null);
        setCargando(false);
      }
    });

    const recuperarSesion = async () => {
      try {
        const { data, error: errorSesion } = await supabase.auth.getSession();
        if (errorSesion) {
          throw errorSesion;
        }
        if (activo && !cambioDeAuthRecibido) {
          setSession(data.session);
        }
      } catch (errorSesion) {
        if (activo && !cambioDeAuthRecibido) {
          setError(
            errorSesion instanceof Error
              ? errorSesion.message
              : "No se pudo recuperar la sesión."
          );
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    void recuperarSesion();

    return () => {
      activo = false;
      subscription.unsubscribe();
    };
  }, [intentos]);

  const reintentar = useCallback(() => {
    setCargando(true);
    setError(null);
    setIntentos((valor) => valor + 1);
  }, []);

  return (
    <AuthContext.Provider value={{ session, cargando, error, reintentar }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de AuthProvider.");
  }
  return context;
}
