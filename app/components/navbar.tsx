"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Inicio", href: "/" },
    { label: "Sobre", href: "/#sobre" },
    { label: "Ruta", href: "/#rodada" },
    { label: "Patrocinadores", href: "/#patrocinadores" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 py-3 px-4 md:px-8 flex justify-between items-center bg-white/90 backdrop-blur-md shadow-lg border-b border-[#FFB6CD]/30 animate-slideDown">
      
      {/* LOGO */}
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/images/logo.png"
          alt="Logo Evento Mujer 2026"
          width={140}
          height={50}
          className="object-contain w-[120px] md:w-[140px]" // Responsive logo
          priority
        />
      </Link>

      {/* MENÚ ESCRITORIO */}
      <div className="hidden md:flex items-center space-x-8">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="font-medium hover:text-[#6D28D9] transition-colors relative group"
          >
            {item.label}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#6D28D9] group-hover:w-full transition-all duration-300"></span>
          </Link>
        ))}
      </div>

      {/* BOTÓN + MENÚ MÓVIL */}
      <div className="flex items-center gap-3">
        {/* Botón Registro - visible en todos los dispositivos */}
        <Link
          href="/registro"
          className="bg-gradient-to-r from-[#6D28D9] to-[#C084FC] text-white px-4 py-2 md:px-6 md:py-2.5 rounded-full font-semibold text-sm md:text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 whitespace-nowrap"
        >
          Registrarme
        </Link>

        {/* Botón Hamburguesa - solo visible en móvil */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Menú"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-md shadow-lg md:hidden animate-slideDown">
          <div className="flex flex-col py-4 px-6 space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="font-medium py-2 hover:text-[#6D28D9] transition-colors border-b border-gray-100 last:border-0"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}