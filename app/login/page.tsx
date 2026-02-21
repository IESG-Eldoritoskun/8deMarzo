"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

export default function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    
    try {
      console.log("1. Intentando login...");
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data?.user) {
        console.log("2. Login exitoso, verificando sesión...");
        
        // Verificar sesión múltiples veces
        let attempts = 0;
        const maxAttempts = 15; // Aumentamos intentos
        
        while (attempts < maxAttempts) {
          const { data: { session } } = await supabase.auth.getSession();
          
          console.log(`Intento ${attempts + 1}:`, session ? "Sesión OK" : "Sin sesión");
          
          if (session) {
            console.log("3. Sesión confirmada!");
            
            // MÉTODO 1: router.push
            console.log("4a. Intentando router.push...");
            router.push("/admin");
            
            // MÉTODO 2: window.location (después de un pequeño delay)
            setTimeout(() => {
              console.log("4b. Intentando window.location...");
              window.location.href = "/admin";
            }, 500);
            
            // MÉTODO 3: hard reload como último recurso
            setTimeout(() => {
              console.log("4c. Intentando hard reload...");
              window.location.reload();
            }, 1000);
            
            return;
          }
          
          await new Promise(resolve => setTimeout(resolve, 200));
          attempts++;
        }
        
        throw new Error("No se pudo establecer la sesión");
      }
      
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Error al iniciar sesión");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login Administrador</h1>
        
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </div>
      </form>
    </div>
  );
}