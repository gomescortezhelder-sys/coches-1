 import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";    //la funcion que crea  el cliente para conectarse a supabase 

const supabaseUrl = "https://lqbdispmjtbrswerahfg.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxYmRpc3BtanRicnN3ZXJhaGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwMTg4NTMsImV4cCI6MjEwNTU5NDg1M30.gp6_v58Lxa67C07LwYs7ZZI4H9ZZY3D-DXFblFjtZhI";
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);
