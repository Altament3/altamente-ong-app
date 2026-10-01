import Image from "next/image";
import Link from "next/link";
import { Cormorant_Garamond, Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500"] });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500"],
  style: ["italic"],
});

const LEMA = "Desde la tierra hasta lo más alto del Bienestar";
const DESCRIPCION =
  "Promovemos el acceso responsable a la medicina natural mediante comunidad, evidencia científica y trazabilidad.";

// Ruta a la que lleva el botón "Entrar".
// Si la persona no inició sesión, el middleware la manda al login.
const ENTRAR_HREF = "/catalogo";

// Proporciones de las imágenes (ancho / alto) para que los textos y el botón
// queden siempre en el mismo lugar respecto del dibujo.
const DESKTOP_RATIO = 1717 / 916;
const MOBILE_RATIO = 720 / 1560;

type Medidas = {
  lemaTop: string;
  lemaSize: string;
  botonTop: string;
  descTop: string;
  descSize: string;
  descMaxWidth: string;
};

const ESCRITORIO: Medidas = {
  lemaTop: "63.5%",
  lemaSize: "clamp(18px, 2.1cqw, 38px)",
  botonTop: "73.5%",
  descTop: "82.5%",
  descSize: "clamp(12px, 1.15cqw, 20px)",
  descMaxWidth: "36cqw",
};

const CELULAR: Medidas = {
  lemaTop: "45.5%",
  lemaSize: "clamp(18px, 5.2cqw, 32px)",
  botonTop: "55.5%",
  descTop: "63%",
  descSize: "clamp(13px, 3.6cqw, 20px)",
  descMaxWidth: "84cqw",
};

function Contenido({ m }: { m: Medidas }) {
  return (
    <>
      <h1
        style={{ top: m.lemaTop, fontSize: m.lemaSize }}
        className={`${cormorant.className} absolute left-0 right-0 px-4 text-center italic leading-snug text-[#8B5E34]`}
      >
        {LEMA}
      </h1>

      <Link
        href={ENTRAR_HREF}
        style={{ top: m.botonTop }}
        className={`${poppins.className} absolute left-1/2 -translate-x-1/2 rounded-full
          bg-[#2E3A26] px-10 py-3 text-base font-medium tracking-wide text-[#E9E4D6]
          shadow-sm transition-colors duration-200
          hover:bg-[#556B3C]
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4A63A]`}
      >
        Entrar
      </Link>

      <p
        style={{ top: m.descTop, fontSize: m.descSize, width: m.descMaxWidth }}
        className={`${poppins.className} absolute left-1/2 -translate-x-1/2 text-center leading-relaxed text-[#2E3A26]`}
      >
        {DESCRIPCION}
      </p>
    </>
  );
}

export default function Home() {
  return (
    <main className="flex h-dvh items-center justify-center overflow-hidden bg-[#EAE1D0]">
      {/* Pantallas horizontales (computador, tablet acostada):
          la imagen cubre toda la pantalla y se recortan solo los bordes */}
      <div
        className="relative hidden shrink-0 landscape:block"
        style={{
          containerType: "inline-size",
          width: `max(100vw, calc(100dvh * ${DESKTOP_RATIO}))`,
          aspectRatio: `${DESKTOP_RATIO}`,
        }}
      >
        <Image
          src="/altamente-inicio.webp"
          alt="Altamente: comunidad, ciencia y naturaleza"
          fill
          priority
          sizes="100vw"
          className="object-contain"
        />
        <Contenido m={ESCRITORIO} />
      </div>

      {/* Pantallas verticales (celular, tablet parada):
          también cubre toda la pantalla */}
      <div
        className="relative block shrink-0 landscape:hidden"
        style={{
          containerType: "inline-size",
          width: `max(100vw, calc(100dvh * ${MOBILE_RATIO}))`,
          aspectRatio: `${MOBILE_RATIO}`,
        }}
      >
        <Image
                      src="/altamente-inicio-movil-v2.webp"
          alt="Altamente: comunidad, ciencia y naturaleza"
          fill
          priority
          sizes="100vw"
          className="object-contain"
        />
        <Contenido m={CELULAR} />
      </div>
    </main>
  );
}