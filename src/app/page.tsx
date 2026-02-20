import Link from "next/link";

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold leading-6 text-primary ring-1 ring-inset ring-primary/20">
              Nuevo: Club Zenith ya disponible
            </span>
          </div>
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-primary sm:text-6xl uppercase italic">
            Mendoza Barber Club
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Donde la tradición del barbero clásico se encuentra con la modernidad. 
            Reserva tu lugar en nuestra agenda en menos de 1 minuto y vive la experiencia premium que te mereces.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Link
              href="/reserva"
              className="rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-background shadow-sm hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary uppercase tracking-wider"
            >
              Agendar Turno
            </Link>
            <Link href="/membresia" className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors">
              Conoce el Club Zenith <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Decorative Grid/Image Area */}
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[4/5] w-48 rounded-xl overflow-hidden glass shadow-2xl border border-primary/20">
                <img src="/image (1).png" alt="Mendoza Barber Club 1" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-[4/5] w-48 rounded-xl overflow-hidden glass shadow-2xl border border-primary/20 mt-12">
                <img src="/image (2).png" alt="Mendoza Barber Club 2" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Preview */}
      <section className="py-24 bg-card/30 border-y border-primary/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold uppercase mb-12 italic">¿Por qué elegirnos?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl glass transition-transform hover:-translate-y-2">
              <h3 className="text-xl mb-4">Reserva en segundos</h3>
              <p className="text-muted-foreground">Sin llamadas, sin esperas. Elige tu barbero y hora desde el celular.</p>
            </div>
            <div className="p-8 rounded-2xl glass transition-transform hover:-translate-y-2">
              <h3 className="text-xl mb-4">Cortes Ilimitados</h3>
              <p className="text-muted-foreground">Únete al Club Zenith Oro y mantén tu look perfecto todos los días.</p>
            </div>
            <div className="p-8 rounded-2xl glass transition-transform hover:-translate-y-2">
              <h3 className="text-xl mb-4">Experiencia VIP</h3>
              <p className="text-muted-foreground">Bebida de cortesía facilitada por nuestros sponsors locales en Mendoza.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
