"use client";

export default function MembershipDashboard() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Digital Card */}
        <div className="w-full lg:w-1/3">
          <h2 className="text-2xl font-bold uppercase italic mb-6">Tu Membresía</h2>
          <div className="aspect-[1.6/1] w-full rounded-3xl relative overflow-hidden glass shadow-2xl border-primary/30 p-8 flex flex-col justify-between group cursor-default">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <div className="text-8xl font-black italic">CZ</div>
            </div>
            
            <div className="flex justify-between items-start z-10">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-primary/80 mb-1">Club Zenith</div>
                <div className="text-2xl font-bold uppercase tracking-tighter text-primary">Nivel ORO</div>
              </div>
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-primary rounded-sm rotate-45"></div>
              </div>
            </div>

            <div className="z-10">
              <div className="text-xl font-medium mb-1">JUAN PÉREZ</div>
              <div className="text-xs font-mono text-muted-foreground">SOCIO #00542-MZ</div>
            </div>

            <div className="flex justify-between items-end z-10">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Válido hasta 12/2026</div>
              <div className="w-12 h-12 bg-white rounded-lg p-1">
                 {/* QR Placeholder */}
                 <div className="w-full h-full bg-black rounded-sm flex items-center justify-center text-[6px] text-white">QR CODE</div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits & Stats */}
        <div className="flex-grow">
          <h2 className="text-2xl font-bold uppercase italic mb-6">Beneficios Activos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-lg font-bold mb-4 text-primary">Cortes Ilimitados</h3>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[40%]"></div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Has usado 2 de tus turnos recomendados este mes.</p>
            </div>
            
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-lg font-bold mb-4 text-primary">Descuentos Premium</h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• 20% en Tinturas</li>
                <li>• 15% en Pomadas y Aceites</li>
                <li>• Cerveza gratis en cada visita</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 glass p-8 rounded-3xl border-primary/5">
             <h3 className="text-xl font-bold mb-4 uppercase italic">Notificaciones del Club</h3>
             <div className="space-y-4">
               <div className="flex gap-4 items-start">
                 <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                 <p className="text-sm">¡Nuevo producto disponible! Aceite orgánico para barbas largas.</p>
               </div>
               <div className="flex gap-4 items-start">
                 <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                 <p className="text-sm">Tu membresía se renovará automáticamente el 01/03.</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
