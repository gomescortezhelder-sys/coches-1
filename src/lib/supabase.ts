import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js"; //la funcion que crea el cliente para conectarse a Supabase
import "react-native-url-polyfill/auto";

const supabaseUrl = "https://lqbdispmjtbrswerahfg.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxYmRpc3BtanRicnN3ZXJhaGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwMTg4NTMsImV4cCI6MjEwNTU5NDg1M30.gp6_v58Lxa67C07LwYs7ZZI4H9ZZY3D-DXFblFjtZhI";
const storage = {
  getItem: (key: string) =>
    typeof window === "undefined" ? Promise.resolve(null) : AsyncStorage.getItem(key),
  setItem: (key: string, value: string) =>
    typeof window === "undefined" ? Promise.resolve() : AsyncStorage.setItem(key, value),
  removeItem: (key: string) =>
    typeof window === "undefined" ? Promise.resolve() : AsyncStorage.removeItem(key),
};

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
);
