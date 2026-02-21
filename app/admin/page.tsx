"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Tipos basados en tu estructura REAL
type Registro = {
  id: string;
  nombre: string | null;
  lugar_procedencia: string | null;
  edad: number | null;
  jersey_principal: string | null;
  talla_principal: string | null;
  total_jerseys: number | null;
  total_pagar: number | null;
  comprobante_url: string | null;
  created_at: string | null;
  integrantes?: Integrante[];
};

type Integrante = {
  id: string;
  registro_id: string;
  nombre: string | null;
  edad: number | null;
  jersey: string | null;
  talla: string | null;
};

type TallasCount = {
  [key: string]: number;
};

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Verificando autenticación...");
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [expandedRegistro, setExpandedRegistro] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalRegistros: 0,
    totalIntegrantes: 0,
  });
  const [tallasCount, setTallasCount] = useState<TallasCount>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUserAndFetchData = async () => {
      try {
        setLoadingMessage("Verificando autenticación...");
        
        // Verificar autenticación
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!user) {
          router.push("/login");
          return;
        }

        if (user.email?.toLowerCase() !== "mujeresenbici2026@gmail.com") {
          await supabase.auth.signOut();
          router.push("/login");
          return;
        }

        // Cargar datos
        await fetchData();
        
      } catch (error: any) {
        console.error("Error en autenticación:", error);
        setError("Error de conexión. Intenta nuevamente.");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    checkUserAndFetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      setLoadingMessage("Cargando registros...");
      
      // Paso 1: Obtener todos los registros
      const { data: registrosData, error: errorRegistros } = await supabase
        .from("registros")
        .select("*")
        .order('created_at', { ascending: false });

      if (errorRegistros) {
        console.error("Error en registros:", errorRegistros);
        throw new Error(`Error al cargar registros: ${errorRegistros.message}`);
      }

      setLoadingMessage(`✅ ${registrosData?.length || 0} registros encontrados. Cargando integrantes...`);

      // Paso 2: Obtener todos los integrantes
      const { data: integrantesData, error: errorIntegrantes } = await supabase
        .from("integrantes")
        .select("*");

      if (errorIntegrantes) {
        console.error("Error en integrantes:", errorIntegrantes);
        throw new Error(`Error al cargar integrantes: ${errorIntegrantes.message}`);
      }

      setLoadingMessage(`✅ Procesando ${integrantesData?.length || 0} integrantes...`);

      // Paso 3: Combinar los datos
      const dataCompleta = registrosData?.map(registro => ({
        ...registro,
        integrantes: integrantesData?.filter(
          i => i.registro_id === registro.id
        ) || []
      })) || [];

      console.log("Datos combinados exitosamente");
      setRegistros(dataCompleta);
      
      // Calcular estadísticas
      const totalIntegrantes = dataCompleta.reduce(
        (acc, reg) => acc + (reg.integrantes?.length || 0), 
        0
      );

      setStats({
        totalRegistros: dataCompleta.length,
        totalIntegrantes,
      });

      // Calcular jerseys por tallas
      const conteoTallas: TallasCount = {};
      
      // Contar jerseys principales de registros
      dataCompleta.forEach(registro => {
        if (registro.talla_principal) {
          const talla = registro.talla_principal;
          conteoTallas[talla] = (conteoTallas[talla] || 0) + 1;
        }
      });

      // Contar jerseys de integrantes
      dataCompleta.forEach(registro => {
        registro.integrantes?.forEach(integrante => {
          if (integrante.talla) {
            const talla = integrante.talla;
            conteoTallas[talla] = (conteoTallas[talla] || 0) + 1;
          }
        });
      });

      setTallasCount(conteoTallas);
      setLoadingMessage(""); // Limpiar mensaje cuando termina

    } catch (error: any) {
      console.error("Error completo:", error);
      setError(error.message || "Error al cargar los datos");
    }
  };

  const toggleExpand = (registroId: string) => {
    setExpandedRegistro(expandedRegistro === registroId ? null : registroId);
  };

  // Pantalla de carga mejorada
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center max-w-md mx-auto p-8">
          {/* Spinner animado */}
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Mensaje de carga dinámico */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            {loadingMessage}
          </h2>
          
          {/* Barra de progreso simulada */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
          
          <p className="text-gray-500 text-sm">
            Esto puede tomar unos segundos...
          </p>
        </div>
      </div>
    );
  }

  // Pantalla de error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Error de conexión</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
            
            <button
              onClick={() => router.push("/")}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Barra de navegación superior con botón de inicio */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Panel de Administrador 🔐
        </h1>
        
        <div className="flex gap-3">
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualizar Datos
          </button>
          
          <Link
            href="/"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Ir al Inicio
          </Link>
        </div>
      </div>

      {/* Tarjetas de estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg shadow border border-blue-100">
          <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
            Total Registros
          </h3>
          <p className="text-4xl font-bold text-blue-900">{stats.totalRegistros}</p>
          <p className="text-sm text-blue-600 mt-1">Personas registradas</p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg shadow border border-green-100">
          <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide">
            Total Integrantes
          </h3>
          <p className="text-4xl font-bold text-green-900">{stats.totalIntegrantes}</p>
          <p className="text-sm text-green-600 mt-1">Acompañantes registrados</p>
        </div>
      </div>

      {/* Tarjeta de Jerseys por Tallas */}
      <div className="bg-purple-50 p-6 rounded-lg shadow border border-purple-100 mb-8">
        <h3 className="text-sm font-semibold text-purple-700 uppercase tracking-wide mb-4">
          Cantidad de Jerseys por Tallas
        </h3>
        
        {Object.keys(tallasCount).length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Object.entries(tallasCount)
              .sort(([tallaA], [tallaB]) => {
                const orden = { 'XS': 1, 'S': 2, 'M': 3, 'L': 4, 'XL': 5, 'XXL': 6, 'XXXL': 7 };
                return (orden[tallaA as keyof typeof orden] || 99) - (orden[tallaB as keyof typeof orden] || 99);
              })
              .map(([talla, cantidad]) => (
                <div key={talla} className="bg-white p-3 rounded-lg text-center shadow-sm">
                  <span className="text-lg font-bold text-purple-900">{talla}</span>
                  <p className="text-2xl font-semibold text-purple-700">{cantidad}</p>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No hay jerseys registrados</p>
        )}
        
        <div className="mt-4 pt-3 border-t border-purple-200">
          <p className="text-sm text-purple-600 font-medium">
            Total de jerseys: {Object.values(tallasCount).reduce((a, b) => a + b, 0)}
          </p>
        </div>
      </div>

      {/* Lista de registros (resto del código igual) */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">Registros Detallados</h2>
          <p className="text-sm text-gray-600">
            Haz clic en cada registro para ver sus integrantes
          </p>
        </div>

        {registros.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 text-lg">No hay registros para mostrar</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {registros.map((registro) => (
              <div key={registro.id} className="hover:bg-gray-50 transition-colors">
                {/* Registro Principal */}
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => toggleExpand(registro.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Nombre</p>
                        <p className="font-medium">{registro.nombre || "No especificado"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Procedencia</p>
                        <p className="font-medium">{registro.lugar_procedencia || "No especificado"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Edad</p>
                        <p className="font-medium">{registro.edad ? `${registro.edad} años` : "No especificada"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Jersey Principal</p>
                        <p className="font-medium">{registro.jersey_principal || "No especificado"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Talla Principal</p>
                        <p className="font-medium">{registro.talla_principal || "No especificada"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Total Jerseys</p>
                        <p className="font-medium">{registro.total_jerseys || 0}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 ml-4">
                      <div className="text-right">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                          {registro.integrantes?.length || 0} integrantes
                        </span>
                        <p className="text-xs text-gray-400 mt-1">
                          {registro.created_at ? new Date(registro.created_at).toLocaleDateString() : "Sin fecha"}
                        </p>
                      </div>
                      <svg
                        className={`w-5 h-5 transform transition-transform text-gray-400 ${
                          expandedRegistro === registro.id ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  
                </div>

                {/* Integrantes (expandible) */}
                {expandedRegistro === registro.id && (
                  <div className="bg-gray-50 px-4 pb-4">
                    <div className="ml-6 pl-4 border-l-2 border-green-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs mr-2">
                          {registro.integrantes?.length || 0}
                        </span>
                        Integrantes registrados:
                      </h4>
                      
                      {registro.integrantes && registro.integrantes.length > 0 ? (
                        <div className="space-y-2">
                          {registro.integrantes.map((integrante) => (
                            <div key={integrante.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                <div>
                                  <p className="text-xs text-gray-500">Nombre</p>
                                  <p className="font-medium">{integrante.nombre || "No especificado"}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Edad</p>
                                  <p className="font-medium">{integrante.edad ? `${integrante.edad} años` : "No especificada"}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Jersey</p>
                                  <p className="font-medium">{integrante.jersey || "No especificado"}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Talla</p>
                                  <p className="font-medium">{integrante.talla || "No especificada"}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic bg-white p-3 rounded">
                          Sin integrantes registrados
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resumen adicional */}
      {registros.length > 0 && (
        <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-2">📊 Resumen Rápido</h3>
          <p className="text-sm text-yellow-700">
            <strong>{stats.totalRegistros}</strong> personas registradas con <strong>{stats.totalIntegrantes}</strong> integrantes.
            Promedio de {(stats.totalIntegrantes / stats.totalRegistros).toFixed(1)} integrantes por registro.
          </p>
        </div>
      )}
    </div>
  );
}