"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Registro = {
  id: string;
  nombre: string | null;
  lugar_procedencia: string | null;
  edad: number | null;
  grupo: string | null;
  telefono: string | null; // 📞 NUEVO CAMPO
  comprobante_url: string | null;
  created_at: string | null;
  integrantes?: Integrante[];
};

type Integrante = {
  id: string;
  registro_id: string;
  nombre: string | null;
  edad: number | null;
};

const REGISTROS_POR_PAGINA = 10;

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [expandedRegistro, setExpandedRegistro] = useState<string | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [stats, setStats] = useState({
    totalRegistros: 0,
    totalIntegrantes: 0,
  });
  const [grupos, setGrupos] = useState<{ [key: string]: number }>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUserAndFetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || user.email?.toLowerCase() !== "mujeresenbici2026@gmail.com") {
          await supabase.auth.signOut();
          router.push("/login");
          return;
        }

        await fetchData();
      } catch {
        setError("Error de conexión.");
      } finally {
        setLoading(false);
      }
    };

    checkUserAndFetchData();
  }, [router]);

  const fetchData = async () => {
    const { data: registrosData } = await supabase
      .from("registros")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: integrantesData } = await supabase
      .from("integrantes")
      .select("*");

    const dataCompleta =
      registrosData?.map((registro) => ({
        ...registro,
        integrantes:
          integrantesData?.filter((i) => i.registro_id === registro.id) || [],
      })) || [];

    setRegistros(dataCompleta);

    const totalIntegrantes = dataCompleta.reduce(
      (acc, reg) => acc + (reg.integrantes?.length || 0),
      0
    );

    setStats({
      totalRegistros: dataCompleta.length,
      totalIntegrantes,
    });

    const conteoGrupos: { [key: string]: number } = {};
    dataCompleta.forEach((registro) => {
      if (registro.grupo) {
        conteoGrupos[registro.grupo] =
          (conteoGrupos[registro.grupo] || 0) + 1;
      }
    });
    setGrupos(conteoGrupos);

    setPaginaActual(1);
  };

  const toggleExpand = (id: string) => {
    setExpandedRegistro(expandedRegistro === id ? null : id);
  };

  const totalPaginas = Math.ceil(registros.length / REGISTROS_POR_PAGINA);

  const registrosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * REGISTROS_POR_PAGINA;
    const fin = inicio + REGISTROS_POR_PAGINA;
    return registros.slice(inicio, fin);
  }, [registros, paginaActual]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAF5FF] to-[#EDE9FE]">
        <div className="w-20 h-20 border-4 border-purple-200 border-t-[#6D28D9] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAF5FF] to-[#EDE9FE]">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-purple-200">
          <p className="text-[#1E1B4B]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF5FF] to-[#EDE9FE] p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#6D28D9]">
          Panel de Administrador
        </h1>

        <div className="flex gap-3">
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-[#6D28D9] text-white rounded-lg hover:bg-[#5B21B6] transition"
          >
            Actualizar Datos
          </button>

          <Link
            href="/"
            className="px-4 py-2 bg-[#C084FC] text-white rounded-lg hover:bg-[#A855F7] transition"
          >
            Ir al Inicio
          </Link>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-purple-200 rounded-2xl shadow-lg p-6">
          <p className="text-sm text-[#6D28D9] uppercase font-semibold">
            Total Registros
          </p>
          <p className="text-4xl font-bold text-[#1E1B4B]">
            {stats.totalRegistros}
          </p>
        </div>

        <div className="bg-white border border-purple-200 rounded-2xl shadow-lg p-6">
          <p className="text-sm text-[#6D28D9] uppercase font-semibold">
            Total Integrantes
          </p>
          <p className="text-4xl font-bold text-[#1E1B4B]">
            {stats.totalIntegrantes}
          </p>
        </div>

        <div className="bg-white border border-purple-200 rounded-2xl shadow-lg p-6">
          <p className="text-sm text-[#6D28D9] uppercase font-semibold">
            Grupos Registrados
          </p>
          <p className="text-4xl font-bold text-[#1E1B4B]">
            {Object.keys(grupos).length}
          </p>
        </div>
      </div>

      {/* Lista de grupos */}
      {Object.keys(grupos).length > 0 && (
        <div className="bg-[#F5F3FF] border border-purple-200 rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-[#6D28D9] font-semibold mb-4">
            Grupos y cantidad de integrantes
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.entries(grupos).map(([grupo, cantidad]) => (
              <div
                key={grupo}
                className="bg-white rounded-lg p-4 text-center border border-purple-200"
              >
                <p className="font-bold text-[#1E1B4B]">{grupo}</p>
                <p className="text-2xl font-semibold text-[#6D28D9]">
                  {cantidad}
                </p>
                <p className="text-xs text-gray-500">
                  miembro{cantidad !== 1 ? "s" : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Indicador */}
      <div className="mb-4 flex items-center gap-2 text-sm text-[#6D28D9] font-medium">
        <span className="w-3 h-3 bg-[#6D28D9] rounded-full animate-pulse"></span>
        Haz clic en un registro para ver sus integrantes
      </div>

      {/* Lista registros */}
      <div className="bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden">
        {registrosPaginados.map((registro) => (
          <div
            key={registro.id}
            className="border-b border-purple-100 hover:bg-[#F5F3FF] transition"
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() => toggleExpand(registro.id)}
            >
              {/* Grid ajustado a 5 columnas para incluir teléfono */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Nombre</p>
                  <p className="font-medium text-[#1E1B4B]">
                    {registro.nombre}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    Procedencia
                  </p>
                  <p className="font-medium text-[#1E1B4B]">
                    {registro.lugar_procedencia}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Edad</p>
                  <p className="font-medium text-[#1E1B4B]">
                    {registro.edad} años
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Grupo</p>
                  <p className="font-medium text-[#1E1B4B]">
                    {registro.grupo || "Sin grupo"}
                  </p>
                </div>
                {/* 📞 NUEVA COLUMNA: Teléfono */}
                <div>
                  <p className="text-xs text-gray-500 uppercase">Teléfono</p>
                  <p className="font-medium text-[#1E1B4B]">
                    {registro.telefono || "No especificado"}
                  </p>
                </div>
              </div>
            </div>

            {expandedRegistro === registro.id && (
              <div className="bg-[#F5F3FF] p-4">
                {registro.integrantes?.length ? (
                  registro.integrantes.map((int) => (
                    <div
                      key={int.id}
                      className="bg-white border border-purple-200 rounded-lg p-3 mb-2"
                    >
                      {int.nombre} — {int.edad} años
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    Sin integrantes registrados
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Controles de Paginación */}
      {totalPaginas > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
            disabled={paginaActual === 1}
            className="px-4 py-2 bg-[#6D28D9] text-white rounded-lg disabled:opacity-40"
          >
            Anterior
          </button>

          <span className="text-[#1E1B4B] font-medium">
            Página {paginaActual} de {totalPaginas}
          </span>

          <button
            onClick={() =>
              setPaginaActual((p) => Math.min(p + 1, totalPaginas))
            }
            disabled={paginaActual === totalPaginas}
            className="px-4 py-2 bg-[#6D28D9] text-white rounded-lg disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Resumen */}
      {registros.length > 0 && (
        <div className="mt-8 bg-[#F5F3FF] border border-purple-200 p-6 rounded-2xl">
          <h3 className="font-semibold text-[#6D28D9] mb-2">
            Resumen Rápido
          </h3>
          <p className="text-[#1E1B4B] text-sm">
            <strong>{stats.totalRegistros}</strong> personas registradas con{" "}
            <strong>{stats.totalIntegrantes}</strong> integrantes. Promedio de{" "}
            {(stats.totalIntegrantes / stats.totalRegistros).toFixed(1)} integrantes por registro.
            {Object.keys(grupos).length > 0 && (
              <> <strong>{Object.keys(grupos).length}</strong> grupos diferentes.</>
            )}
          </p>
        </div>
      )}
    </div>
  );
}