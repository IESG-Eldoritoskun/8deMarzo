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
  const [alerta, setAlerta] = useState<{ tipo: 'exito' | 'error' | 'advertencia'; mensaje: string } | null>(null);

  const [formData, setFormData] = useState({
    nombre: "",
    procedencia: "",
    edad: "",
  });

  // Función para validar campos vacíos
  const validarCampos = (): { valido: boolean; camposFaltantes: string[] } => {
    const camposFaltantes: string[] = [];

    // Validar campos principales
    if (!formData.nombre.trim()) camposFaltantes.push("Nombre completo");
    if (!formData.procedencia.trim()) camposFaltantes.push("Lugar de procedencia");
    if (!formData.edad.trim()) camposFaltantes.push("Edad");

    // Validar integrantes
    integrantes.forEach((int, index) => {
      if (!int.nombre.trim()) {
        camposFaltantes.push(`Nombre del integrante #${index + 1}`);
      }
      if (!int.edad.trim()) {
        camposFaltantes.push(`Edad del integrante #${index + 1}`);
      }
    });

    return {
      valido: camposFaltantes.length === 0,
      camposFaltantes
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

  const cerrarAlerta = () => {
    setAlerta(null);
  };

  // 🚀 GUARDAR EN SUPABASE
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Validar campos antes de enviar
    const validacion = validarCampos();
    if (!validacion.valido) {
      const mensaje = `Campos requeridos faltantes:\n• ${validacion.camposFaltantes.join('\n• ')}`;
      setAlerta({ tipo: 'advertencia', mensaje });
      return;
    }

    try {
      // 🔹 Insertar registro principal (sin campos de jerseys)
      const { data: registro, error: registroError } = await supabase
        .from("registros")
        .insert([
          {
            nombre: formData.nombre,
            lugar_procedencia: formData.procedencia,
            edad: Number(formData.edad),
          },
        ])
        .select()
        .single();

      if (registroError) {
        console.log("ERROR COMPLETO:", JSON.stringify(registroError, null, 2));
        setAlerta({ 
          tipo: 'error', 
          mensaje: "Error guardando el registro" 
        });
        return;
      }

      // 🔹 Insertar integrantes (sin campos de jerseys)
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
          setAlerta({ 
            tipo: 'error', 
            mensaje: "Error guardando integrantes" 
          });
          return;
        }
      }

      // ✅ Mostrar mensaje de éxito y limpiar datos
      setAlerta({ 
        tipo: 'exito', 
        mensaje: "¡Registro guardado correctamente! 🎉" 
      });
      
      // 🔄 LIMPIAR TODOS LOS CAMPOS DESPUÉS DE ENVIAR
      setIntegrantes([]);
      setPreview(null);
      setFormData({
        nombre: "",
        procedencia: "",
        edad: "",
      });

    } catch (error) {
      console.error(error);
      setAlerta({ 
        tipo: 'error', 
        mensaje: "Error inesperado" 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF5FF] to-[#EDE9FE] flex items-center justify-center p-6 relative">
      {/* Alerta personalizada */}
      {alerta && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4 pointer-events-none">
          <div 
            className={`bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all animate-fadeIn pointer-events-auto
              ${alerta.tipo === 'exito' ? 'border-t-4 border-green-500' : 
                alerta.tipo === 'error' ? 'border-t-4 border-red-500' : 
                'border-t-4 border-yellow-500'}`}
          >
            <div className="flex justify-center mb-4">
              {alerta.tipo === 'exito' && (
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              )}
              {alerta.tipo === 'error' && (
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
              )}
              {alerta.tipo === 'advertencia' && (
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                </div>
              )}
            </div>

            <div className="text-center mb-6">
              <p className="text-gray-800 text-lg whitespace-pre-line">{alerta.mensaje}</p>
            </div>

            <button
              onClick={cerrarAlerta}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-colors
                ${alerta.tipo === 'exito' ? 'bg-green-500 hover:bg-green-600' : 
                  alerta.tipo === 'error' ? 'bg-red-500 hover:bg-red-600' : 
                  'bg-yellow-500 hover:bg-yellow-600'}`}
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
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}