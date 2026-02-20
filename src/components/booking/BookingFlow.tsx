"use client";

import { useState, useEffect } from "react";
import { db, auth as clientAuth } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp, getDocs, QueryDocumentSnapshot } from "firebase/firestore";
import { Appointment, Barber } from "@/types/models";

const steps = ["Servicio", "Barbero", "Fecha y Hora", "Confirmar"];

const services = [
  { id: 1, name: "Corte Clásico", price: "$1500", desc: "Corte a tijera o máquina con acabado profesional." },
  { id: 2, name: "Barba & Perfilado", price: "$1000", desc: "Arreglo de barba con toalla caliente y perfilado." },
  { id: 3, name: "Combo Mendoza", price: "$2200", desc: "Corte + Barba + Bebida de cortesía." },
  { id: 4, name: "Tratamiento Capilar", price: "$1800", desc: "Lavado premium con productos orgánicos." },
];

const timeSlots = ["10:00", "10:45", "11:30", "12:15", "13:00", "16:00", "16:45", "17:30", "18:15", "19:00"];

export default function BookingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dbBarbers, setDbBarbers] = useState<Barber[]>([]);
  const [loadingBarbers, setLoadingBarbers] = useState(true);
  
  const [selection, setSelection] = useState({
    service: null as any,
    barber: null as any,
    date: null as string | null,
    time: null as string | null,
  });

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "barbers"));
        const barbersList = querySnapshot.docs.map((doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() } as Barber));
        setDbBarbers(barbersList);
      } catch (err) {
        console.error("Error fetching barbers:", err);
      } finally {
        setLoadingBarbers(false);
      }
    };
    fetchBarbers();
  }, []);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-12">
        <h2 className="text-3xl font-bold uppercase italic mb-8">Reservar Turno</h2>
        
        {/* Progress Bar */}
        <div className="flex justify-between items-center relative">
          <div className="absolute h-0.5 bg-muted w-full top-1/2 -translate-y-1/2 z-0"></div>
          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                idx <= currentStep ? "bg-primary border-primary text-background" : "bg-card border-muted text-muted-foreground"
              }`}>
                {idx + 1}
              </div>
              <span className={`text-[10px] mt-2 uppercase tracking-widest ${idx <= currentStep ? "text-primary font-bold" : "text-muted-foreground"}`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="glass rounded-3xl p-8 min-h-[450px] relative overflow-hidden">
        {currentStep === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {services.map((service) => (
              <button 
                key={service.id}
                onClick={() => {
                  setSelection({ ...selection, service });
                  nextStep();
                }}
                className="p-6 rounded-2xl border border-primary/10 hover:border-primary/40 hover:bg-primary/5 transition-all text-left flex justify-between items-center group"
              >
                <div>
                  <div className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{service.name}</div>
                  <div className="text-xs text-muted-foreground">{service.desc}</div>
                </div>
                <div className="text-primary font-bold">{service.price}</div>
              </button>
            ))}
          </div>
        )}

        {currentStep === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-bold mb-6 text-center uppercase tracking-wider">¿Quién te va a atender?</h3>
            {loadingBarbers ? (
               <div className="flex justify-center items-center h-40">
                 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
               </div>
            ) : dbBarbers.length === 0 ? (
               <div className="text-center py-12 text-muted-foreground italic">
                 No hay barberos disponibles en este momento.
                 <br/><span className="text-[10px] uppercase font-bold text-primary mt-2 block">Administración debe cargarlos</span>
               </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {dbBarbers.map((barber) => (
                  <button 
                    key={barber.id}
                    onClick={() => {
                      setSelection({ ...selection, barber });
                      nextStep();
                    }}
                    className="flex flex-col items-center p-6 rounded-2xl border border-primary/10 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                  >
                    <img src={barber.img} alt={barber.name} className="w-20 h-20 rounded-full bg-muted mb-4 border-2 border-transparent group-hover:border-primary transition-all p-1" />
                    <div className="font-bold group-hover:text-primary">{barber.name}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{barber.role}</div>
                  </button>
                ))}
              </div>
            )}
            <button onClick={prevStep} className="mt-12 text-muted-foreground hover:text-primary text-sm uppercase tracking-widest flex items-center gap-2">
               ← Volver
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-bold mb-6 text-center uppercase tracking-wider">Elige tu Turno</h3>
            
            <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar mb-8 border-b border-primary/5">
              {["Hoy", "Mañana", "Sáb 21", "Lun 23", "Mar 24"].map((d, i) => (
                <button 
                  key={i}
                  onClick={() => setSelection({ ...selection, date: d })}
                  className={`flex-shrink-0 px-6 py-4 rounded-xl border transition-all ${
                    selection.date === d ? "bg-primary border-primary text-background" : "bg-white/5 border-primary/10 hover:border-primary/40"
                  }`}
                >
                  <div className="text-center font-bold">{d}</div>
                  <div className="text-[10px] uppercase opacity-60">Feb</div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {timeSlots.map((time) => (
                <button 
                  key={time}
                  onClick={() => {
                    setSelection({ ...selection, time });
                    nextStep();
                  }}
                  className={`py-3 rounded-lg text-sm border transition-all ${
                    selection.time === time ? "bg-primary border-primary text-background" : "bg-white/5 border-primary/10 hover:border-primary/40"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>

            <button onClick={prevStep} className="mt-12 text-muted-foreground hover:text-primary text-sm uppercase tracking-widest flex items-center gap-2">
               ← Volver
            </button>
          </div>
        )}

        {currentStep === 3 && (
          <div className="animate-in fade-in zoom-in-95 duration-500 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
              <div className="text-primary text-2xl">✓</div>
            </div>
            <h3 className="text-2xl font-bold uppercase italic mb-2">¡Casi listo!</h3>
            <p className="text-muted-foreground mb-10">Revisa los detalles de tu turno para confirmar.</p>
            
            <div className="w-full max-w-sm glass p-6 rounded-2xl text-left border-primary/20 mb-8">
              <div className="flex justify-between items-start mb-4">
                <div className="text-[10px] uppercase tracking-widest text-primary font-bold">Resumen</div>
                <div className="text-xs font-mono text-muted-foreground">#TURN-{Math.floor(Math.random()*1000)}</div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Servicio:</span>
                  <span className="text-sm font-bold">{selection.service?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Barbero:</span>
                  <span className="text-sm font-bold">{selection.barber?.name}</span>
                </div>
                <div className="flex justify-between border-t border-primary/10 pt-3">
                  <span className="text-sm">Fecha:</span>
                  <span className="text-sm font-bold">{selection.date} de Febrero</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Hora:</span>
                  <span className="text-sm font-bold text-primary">{selection.time} hs</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col w-full max-w-sm gap-3">
              <button 
                onClick={async () => {
                  try {
                    const appointmentData = {
                      userId: clientAuth.currentUser?.uid || "guest",
                      userName: clientAuth.currentUser?.displayName || "Invitado",
                      serviceId: selection.service.id.toString(),
                      serviceName: selection.service.name,
                      price: parseInt(selection.service.price.replace("$", "")),
                      barberId: selection.barber.id.toString(),
                      barberName: selection.barber.name,
                      date: selection.date || "Hoy",
                      time: selection.time || "00:00",
                      status: "pending",
                      createdAt: serverTimestamp(),
                    };

                    await addDoc(collection(db, "appointments"), appointmentData);
                    setShowSuccess(true);
                  } catch (error) {
                    console.error("Error al guardar turno:", error);
                    alert("Hubo un error al confirmar. Por favor intenta de nuevo.");
                  }
                }}
                className="w-full bg-primary text-background py-4 rounded-xl font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
              >
                Confirmar Turno
              </button>
              <button onClick={prevStep} className="text-muted-foreground hover:text-primary text-[10px] uppercase tracking-widest py-2">
                 Modificar datos
              </button>
            </div>
          </div>
        )}
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
          <div className="glass max-w-md w-full p-10 rounded-[40px] border-primary/30 text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(212,175,55,0.4)]">
              <span className="text-background text-4xl">✓</span>
            </div>
            <h2 className="text-3xl font-bold uppercase italic mb-4">¡Turno Reservado!</h2>
            <p className="text-muted-foreground mb-8">
              Tu reserva para <strong>{selection.service?.name}</strong> con <strong>{selection.barber?.name}</strong> ha sido registrada con éxito.
            </p>
            
            <div className="space-y-4">
              <button 
                onClick={() => {
                  const message = `Hola! Acabo de reservar un turno:\n\nServicio: ${selection.service?.name}\nBarbero: ${selection.barber?.name}\nFecha: ${selection.date}\nHora: ${selection.time}hs\n\n¡Nos vemos!`;
                  window.open(`https://wa.me/5492610000000?text=${encodeURIComponent(message)}`, "_blank");
                }}
                className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-[0_10px_20px_rgba(37,211,102,0.2)]"
              >
                <span>Avisar por WhatsApp</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowSuccess(false);
                  setCurrentStep(0);
                  setSelection({ service: null, barber: null, date: null, time: null });
                }}
                className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Finalizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
