"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

interface Integrante {
  nombre: string;
  edad: string;
}

export default function Registro() {
  const [integrantes, setIntegrantes] = useState<Integrante[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [mostrarAlertaExito, setMostrarAlertaExito] = useState(false);
  const [alertaError, setAlertaError] = useState<{ mostrar: boolean; mensaje: string }>({
    mostrar: false,
    mensaje: ""
  });

  const [formData, setFormData] = useState({
    nombre: "",
    procedencia: "",
    edad: "",
    grupo: "",
  });

  // Función para validar campos vacíos
  const validarCampos = (): { valido: boolean; mensajeError: string } => {
    // Validar campos principales
    if (!formData.nombre.trim()) {
      return {
        valido: false,
        mensajeError: "❌ Falta el campo: Nombre completo"
      };
    }
    if (!formData.procedencia.trim()) {
      return {
        valido: false,
        mensajeError: "❌ Falta el campo: Lugar de procedencia"
      };
    }
    if (!formData.edad.trim()) {
      return {
        valido: false,
        mensajeError: "❌ Falta el campo: Edad"
      };
    }

    // Validar integrantes
    for (let i = 0; i < integrantes.length; i++) {
      const int = integrantes[i];
      if (!int.nombre.trim()) {
        return {
          valido: false,
          mensajeError: `❌ Falta el nombre del integrante #${i + 1}`
      };
      }
      if (!int.edad.trim()) {
        return {
          valido: false,
          mensajeError: `❌ Falta la edad del integrante #${i + 1}`
        };
      }
    }

    return {
      valido: true,
      mensajeError: ""
    };
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const agregarIntegrante = () => {
    setIntegrantes([
      ...integrantes,
      { nombre: "", edad: "" },
    ]);
  };

  const handleIntegranteChange = (
    index: number,
    field: keyof Integrante,
    value: string
  ) => {
    const nuevos = [...integrantes];
    nuevos[index][field] = value;
    setIntegrantes(nuevos);
  };

  const eliminarIntegrante = (index: number) => {
    setIntegrantes(integrantes.filter((_, i) => i !== index));
  };

  const cerrarAlertaError = () => {
    setAlertaError({ mostrar: false, mensaje: "" });
  };

  // 🚀 GUARDAR EN SUPABASE
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Validar campos antes de enviar
    const validacion = validarCampos();
    if (!validacion.valido) {
      setAlertaError({
        mostrar: true,
        mensaje: validacion.mensajeError
      });
      
      // Ocultar la alerta de error después de 3 segundos
      setTimeout(() => {
        setAlertaError({ mostrar: false, mensaje: "" });
      }, 3000);
      
      return;
    }

    try {
      // 🔹 Insertar registro principal
      const { data: registro, error: registroError } = await supabase
        .from("registros")
        .insert([
          {
            nombre: formData.nombre,
            lugar_procedencia: formData.procedencia,
            edad: Number(formData.edad),
            grupo: formData.grupo || null,
          },
        ])
        .select()
        .single();

      if (registroError) {
        alert("Error guardando el registro");
        return;
      }

      // 🔹 Insertar integrantes si hay
      if (integrantes.length > 0) {
        const integrantesData = integrantes.map((int) => ({
          registro_id: registro.id,
          nombre: int.nombre,
          edad: Number(int.edad),
        }));

        const { error } = await supabase
          .from("integrantes")
          .insert(integrantesData);

        if (error) {
          alert("Error guardando integrantes");
          return;
        }
      }

      // ✅ Mostrar alerta de éxito
      setMostrarAlertaExito(true);
      
      // 🔄 LIMPIAR TODOS LOS CAMPOS
      setIntegrantes([]);
      setPreview(null);
      setFormData({
        nombre: "",
        procedencia: "",
        edad: "",
        grupo: "",
      });

      // Ocultar la alerta de éxito después de 2 segundos
      setTimeout(() => {
        setMostrarAlertaExito(false);
      }, 2000);

    } catch (error) {
      console.error(error);
      alert("Error inesperado al guardar");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF5FF] to-[#EDE9FE] flex items-center justify-center p-6 relative">
      {/* Alerta de éxito circular centrada */}
      {mostrarAlertaExito && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-full w-48 h-48 flex flex-col items-center justify-center shadow-2xl animate-pop-in border-4 border-green-500">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p className="text-green-700 font-bold text-center px-4">
              Datos guardados correctamente
            </p>
          </div>
        </div>
      )}

      {/* Alerta de error para campos faltantes */}
      {alertaError.mostrar && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-80 p-6 flex flex-col items-center justify-center shadow-2xl animate-slide-down border-l-4 border-red-500">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-red-700 font-semibold text-center mb-4">
              {alertaError.mensaje}
            </p>
            <button
              onClick={cerrarAlertaError}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-[#6D28D9] mb-6">
          Registro al Evento 
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            required
            value={formData.nombre}
            onChange={handleChange}
            className="w-full border border-purple-200 bg-white p-3 rounded-lg focus:ring-2 focus:ring-[#C084FC] focus:border-[#6D28D9] transition focus:border-transparent"
          />

          <input
            type="text"
            name="procedencia"
            placeholder="Lugar de procedencia"
            required
            value={formData.procedencia}
            onChange={handleChange}
            className="w-full border border-purple-200 bg-white p-3 rounded-lg focus:ring-2 focus:ring-[#C084FC] focus:border-[#6D28D9] transition focus:border-transparent"
          />

          <input
            type="number"
            name="edad"
            placeholder="Edad"
            required
            value={formData.edad}
            onChange={handleChange}
            className="w-full border border-purple-200 bg-white p-3 rounded-lg focus:ring-2 focus:ring-[#C084FC] focus:border-[#6D28D9] transition focus:border-transparent"
          />

          <input
            type="text"
            name="grupo"
            placeholder="Grupo (En caso de pertenecer a alguno)"
            value={formData.grupo}
            onChange={handleChange}
            className="w-full border border-purple-200 bg-white p-3 rounded-lg focus:ring-2 focus:ring-[#C084FC] focus:border-[#6D28D9] transition focus:border-transparent"
          />

          <button
            type="button"
            onClick={agregarIntegrante}
            className="bg-[#6D28D9] text-white px-4 py-2 rounded-lg hover:bg-[#5B21B6] transition shadow-md"
          >
            + Agregar integrante
          </button>

          {integrantes.map((int, index) => (
            <div key={index} className="p-4 rounded-lg space-y-3 bg-[#F5F3FF] border border-purple-200">
              <input
                type="text"
                placeholder="Nombre del integrante"
                value={int.nombre}
                onChange={(e) =>
                  handleIntegranteChange(index, "nombre", e.target.value)
                }
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-[#6D28D9] focus:border-transparent"
              />

              <input
                type="number"
                placeholder="Edad del integrante"
                value={int.edad}
                onChange={(e) =>
                  handleIntegranteChange(index, "edad", e.target.value)
                }
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-[#6D28D9] focus:border-transparent"
              />

              <button
                type="button"
                onClick={() => eliminarIntegrante(index)}
                className="bg-[#5B21B6] text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 transition shadow-sm"
              >
                Eliminar integrante
              </button>
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#6D28D9] to-[#C084FC] text-white py-3 rounded-lg font-semibold hover:scale-[1.02] hover:shadow-lg transition-all duration-300"
          >
            Enviar Registro 
          </button>

          <Link href="/">
            <button
              type="button"
              className="w-full border border-[#6D28D9] text-[#6D28D9] py-3 rounded-lg font-semibold hover:bg-[#EDE9FE] transition"
            >
              ← Regresar al Inicio
            </button>
          </Link>
        </form>
        <p className="text-center text-gray-600 mt-4 text-sm">
          NOTA: Al vaciarse los campos su registro se realizó correctamente.
        </p>
      </div>

      <style jsx>{`
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateY(-50px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-pop-in {
          animation: popIn 0.3s ease-out;
        }
        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}