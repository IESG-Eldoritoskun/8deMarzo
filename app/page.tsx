"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import Rodada from "@/app/components/rodada";
import SponsorsCarousel from "@/app/components/SponsorsCarousel";
import {
  Bike,
  Route,
  Heart,
  Sparkles,
  Wind,
  Ruler,
  DollarSign,
  ShoppingBag,
  MessageCircle,
  Facebook,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";

export default function Home() {
  type SectionKey = "sobre" | "patrocinadores" | "agradecimiento";

  const [visibleSections, setVisibleSections] = useState<
    Record<SectionKey, boolean>
  >({
    sobre: false,
    patrocinadores: false,
    agradecimiento: false,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id as SectionKey;

            setVisibleSections((prev) => ({
              ...prev,
              [id]: true,
            }));
          }
        });
      },
      { threshold: 0.2 },
    );

    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="bg-gradient-to-b from-[#FFFBF5] via-[#FCE7F3]/30 to-[#FFFBF5] text-[#0F172A] overflow-x-hidden">
      <Navbar />

      {/* HERO CON ANIMACIONES CSS */}
      <section className="min-h-screen flex items-center justify-center text-center px-4 relative overflow-hidden">
        {/* Fondos animados con CSS puro */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#EDE9FE]/20 rounded-full blur-3xl animate-pulseSlow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#6D28D9]/10 rounded-full blur-3xl animate-pulseSlow animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FCE7F3]/50 rounded-full blur-3xl animate-float"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-block px-6 py-2 bg-[#6D28D9]/10 rounded-full mb-8 animate-slideUp">
            <span className="text-[#6D28D9] font-semibold tracking-wide">
              8 DE MARZO 2026 · MARAVATÍO
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold leading-tight animate-slideUp animation-delay-200">
            <span className="bg-gradient-to-r from-[#6D28D9] via-[#C084FC] to-[#0F172A] bg-clip-text text-transparent">
              Rodamos juntas,
            </span>
            <br />
            <span className="text-[#0F172A]">crecemos juntas</span>
          </h1>

          <p className="mt-8 text-xl md:text-2xl max-w-3xl mx-auto text-gray-600 leading-relaxed animate-slideUp animation-delay-400">
            Una experiencia que transforma cada pedaleada en un símbolo de
            fuerza y determinación.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6 animate-slideUp animation-delay-600">
            <a
              href="/registro"
              className="group px-10 py-4 bg-gradient-to-r from-[#6D28D9] to-[#C084FC] text-white rounded-full shadow-2xl font-semibold text-lg hover:scale-105 hover:shadow-3xl transition-all duration-300"
            >
              Quiero asistir
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </a>

            <a
              href="#sobre"
              className="px-10 py-4 bg-white text-[#0F172A] rounded-full shadow-xl font-semibold text-lg border-2 border-[#C084FC] hover:border-[#6D28D9] hover:scale-105 transition-all duration-300"
            >
              Conocer más
            </a>
          </div>
        </div>

        {/* INDICADOR DE SCROLL - AHORA FUERA DEL CONTENEDOR PRINCIPAL */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-fadeIn animation-delay-1000 z-20">
          <div className="w-6 h-10 border-2 border-[#6D28D9] rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-[#6D28D9] rounded-full mt-2 animate-scrollIndicator"></div>
          </div>
        </div>
      </section>

      {/* SOBRE EL EVENTO */}
      <section
        id="sobre"
        className={`py-32 px-4 relative overflow-hidden transition-all duration-1000 ${
          visibleSections.sobre
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-20"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#EDE9FE]/50 to-transparent"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#C084FC]/20 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#6D28D9]/10 rounded-full blur-2xl animate-float animation-delay-2000"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#6D28D9] to-[#C084FC] bg-clip-text text-transparent">
                Sobre el Evento
              </span>
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-[#6D28D9] to-[#C084FC] mx-auto rounded-full"></div>
          </div>

          <p className="text-xl text-center max-w-4xl mx-auto leading-relaxed mb-16">
            Recuerda que el 8 M representa hacer visible le la violencia
            cotidiana vs. niñas y mujeres, cada pedaleada es confirmar que
            queremos respeto, igualdad de oportunidades, ser tratadas con
            dignidad y vivir libres de violencias. La rodada es gratuita, los
            producros de los abastecimientos son donados así que tu aportación
            en especie o dinero es bien administrada y es para beneficio de
            todas y todos.
            <br />
            Importante:
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            {[
              {
                icon: Bike,
                title: "Alístate para el Desafío",
                desc: "Revisa desde hoy tener la bicicleta en buen estado y sal a pedalear, previo a la rodada, ya que la ruta requiere de una buena condición física.",
                color: "from-[#9F1239] to-[#FFB6CD]",
              },
              {
                icon: Route,
                title: "Condiciones del Trayecto",
                desc: "Rodamos terracería, pasto, terrenos pedregosos, algunas bajadas y subidas aunque en su mayoria es terreno plano así que usa una bicicleta adecuada, es obligatorio el uso de casco.",
                color: "from-[#FFB6CD] to-[#9F1239]",
              },
              {
                icon: Heart,
                title: "Súmate con Color y Propósito",
                desc: "Usa una jersey de cualquier rodada 8M o prenda de color morado, rosa, naranja, blanco o del color que prefieras, pero únete a esta causa muchas mujeres desconocen el 8M ¡hazlo visible!",
                color: "from-[#0F172A] to-[#9F1239]",
              },
            ].map((item, i) => {
              const Icon = item.icon;

              return (
                <div
                  key={i}
                  className="group relative bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}
                  ></div>

                  <div className="mb-6 group-hover:scale-110 transition-transform duration-300 text-[#6D28D9]">
                    <Icon size={48} strokeWidth={1.5} />
                  </div>

                  <h3 className="text-2xl font-bold text-[#6D28D9] mb-4">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>

                  <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles
                      size={28}
                      strokeWidth={1.5}
                      className="text-[#6D28D9]"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* AVISO IMPORTANTE */}
<div className="mt-24 max-w-4xl mx-auto relative">

  <div className="bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-300 rounded-3xl p-10 shadow-xl">

    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center">
        <AlertTriangle className="text-amber-600" size={22} strokeWidth={2} />
      </div>
      <h3 className="text-2xl font-bold text-amber-700">
        Aviso para Participantes
      </h3>
    </div>

    <div className="text-sm md:text-base text-amber-900 space-y-4 leading-relaxed">
      <p>
        La participación en esta rodada implica reconocer que el ciclismo
        es una actividad física que conlleva riesgos inherentes.
      </p>

      <p>
        Las personas
        involucradas en la realización del evento no se hacen responsables
        por accidentes, lesiones o daños que pudieran ocurrir antes,
        durante o después de la rodada ciclista.
      </p>

      <p>
        Cada participante es responsable de su integridad física y de cualquier
        daño ocurrido a su bicicleta durante la actividad. Es obligatorio el uso
        de casco y guantes, así como del cumplimiento de los reglamentos vigentes.
      </p>

      <p>
        Se recomienda acudir con ánfora o botella reutilizable para mantenerse
        hidratada(o) durante el recorrido, así como contribuir al cuidado del
        entorno evitando dejar residuos y procurando conservar limpia la ruta
        en todo momento.
      </p>

      <p>
        Las personas menores de edad deberán asistir acompañadas por una persona
        adulta responsable durante el desarrollo del evento.
      </p>

      

      <p>
        La participación en el evento autoriza el uso de nombre e imagen
        con fines informativos y promocionales relacionados con la rodada.
      </p>
    </div>

  </div>
</div>
      </section>

      {/* Rodada */}
      <Rodada />

      {/* ================= JERSEY OFICIAL ================= */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6D28D9] to-[#C084FC]"></div>

        {/* Elementos decorativos */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulseSlow"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulseSlow animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float"></div>

        <div className="relative z-10 max-w-6xl mx-auto text-white">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Jersey Oficial del Evento
            </h2>
            <p className="text-xl md:text-2xl opacity-90">
              Edición conmemorativa exclusiva para esta rodada.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* IMAGEN DE LA JERSEY */}
            <div className="relative">
              <div className="absolute -inset-6 bg-white/10 blur-3xl rounded-3xl"></div>

              <div className="relative bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl">
                <img
                  src="/images/jersey.jpeg"
                  alt="Jersey oficial del evento"
                  className="w-full object-contain rounded-2xl"
                />
              </div>
            </div>

            {/* INFORMACIÓN */}
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Sparkles size={24} />
                  Detalles
                </h3>

                <ul className="space-y-4 opacity-90">
                  <li className="flex items-center gap-3">
                    <Sparkles size={18} />
                    Edición especial conmemorativa
                  </li>

                  <li className="flex items-center gap-3">
                    <Wind size={18} />
                    Tela deportiva transpirable
                  </li>

                  <li className="flex items-center gap-3">
                    <Bike size={18} />
                    Corte cómodo para rodada
                  </li>

                  <li className="flex items-center gap-3">
                    <Ruler size={18} />
                    Disponible en varias tallas
                  </li>
                </ul>

                <div className="mt-10 flex items-center gap-4">
                  <DollarSign size={28} />
                  <div>
                    <p className="text-lg opacity-80">Costo</p>
                    <p className="text-5xl font-bold">$280 MXN</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <ShoppingBag size={24} />
                  ¿Cómo puedes obtenerla?
                </h3>

                <p className="mt-6 text-sm opacity-90 leading-relaxed">
                  Cómprala el día del evento. Habrá un stand exclusivo para la
                  venta de jerseys y el pago será en efectivo. También puedes
                  enviarnos un mensaje directo para apartarla. ¡No te quedes sin
                  la tuya!
                </p>

                {/* Botones de contacto */}
                <div className="mt-6 flex flex-wrap gap-4">
                  <a
                    href="https://www.facebook.com/share/1JJBstL9vw/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-[#6D28D9] 
               px-5 py-2 rounded-full font-semibold 
               hover:bg-[#EDE9FE] transition-all duration-300 
               shadow-md hover:shadow-lg hover:scale-105"
                  >
                    <Facebook size={18} />
                    Facebook
                  </a>

                  <a
                    href="https://wa.me/524471032406"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white/20 border border-white/40 
               px-5 py-2 rounded-full font-semibold 
               hover:bg-white/30 transition-all duration-300"
                  >
                    <MessageCircle size={18} />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PATROCINADORES CON CARRUSEL */}
      <section
        id="patrocinadores"
        className={`py-32 px-4 bg-gradient-to-b from-[#FCE7F3]/20 to-white relative overflow-hidden transition-all duration-1000 ${
          visibleSections.patrocinadores
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-20"
        }`}
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#6D28D9] to-[#C084FC] bg-clip-text text-transparent">
              Patrocinadores
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-16">
            Empresas comprometidas con el empoderamiento femenino que hacen
            posible este evento
          </p>

          <div className="mt-12">
            <SponsorsCarousel />
          </div>
        </div>
      </section>
      <section
        id="agradecimiento"
        className={`py-32 px-4 relative overflow-hidden transition-all duration-1000 ${
          visibleSections.agradecimiento
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-20"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#EDE9FE]/40 to-transparent"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            <span className="bg-gradient-to-r from-[#6D28D9] to-[#C084FC] bg-clip-text text-transparent">
              Gracias por Rodar con Nosotras
            </span>
          </h2>

          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
            A todas las y los ciclistas que han pedaleado en ediciones
            anteriores, organizadoras, patrocinadoras, voluntarias y personas
            que apoyan y comparten esta causa: gracias por ser parte de la
            historia de las Rodadas 8M.
          </p>

          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-16">
            Cada año construimos comunidad, visibilizamos la lucha y reafirmamos
            nuestro compromiso con el respeto, la igualdad y la dignidad de
            todas las mujeres.
            <br />
            Esta rodada es suya. Esta causa es de todas y todos.
          </p>

          {/* GALERÍA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "rodada1.jpeg",
              "rodada2.jpeg",
              "rodada3.jpeg",
              "rodada4.jpeg",
              "rodada5.jpeg",
              "rodada6.jpeg",
              "rodada7.jpeg",
              "rodada8.jpeg",
            ].map((img, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-2xl shadow-lg group"
              >
                <img
                  src={`/rodadas/${img}`}
                  alt={`Rodada 8M ${index + 1}`}
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
