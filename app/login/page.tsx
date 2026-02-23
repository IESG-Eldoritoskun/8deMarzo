"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { Mail, Lock } from "lucide-react";

export default function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data?.user) {
        let attempts = 0;
        const maxAttempts = 15;

        while (attempts < maxAttempts) {
          const { data: { session } } = await supabase.auth.getSession();

          if (session) {
            router.push("/admin");
            setTimeout(() => {
              window.location.href = "/admin";
            }, 400);
            return;
          }

          await new Promise(resolve => setTimeout(resolve, 200));
          attempts++;
        }

        throw new Error("No se pudo establecer la sesión");
      }
    } catch (error: any) {
      alert(error.message || "Error al iniciar sesión");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAF5FF] via-[#EDE9FE] to-[#DDD6FE] px-4">

      {/* Card */}
      <div className="bg-white/80 backdrop-blur-lg shadow-2xl border border-purple-200 rounded-3xl p-10 w-full max-w-md animate-fadeIn">

        {/* Logo / Título */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#6D28D9]">
            Panel Administrativo
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Acceso exclusivo para organizadoras
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-purple-400" size={18} />
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-[#C084FC] focus:border-transparent transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-purple-400" size={18} />
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-[#C084FC] focus:border-transparent transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#6D28D9] text-white font-semibold hover:bg-[#5B21B6] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar al Panel"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-400">
          Mujeres en Bici 2026 ©
        </div>
      </div>
    </div>
  );
}